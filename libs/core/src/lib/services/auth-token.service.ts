/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import * as moment from 'moment-timezone';
import { BehaviorSubject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { devToken } from '../../../../../token.json';
import { AppConstants, RouterConstants, RouterConstantsBase } from '../constants';
import { ApplicationTypeEnum, RoleIdEnum, StorageKeyEnum } from '../enums';
import { Environment, GosiScope, JWTPayload } from '../models';
import { ApplicationTypeToken, EnvironmentToken } from '../tokens';
import { PushMessageService } from './push-message.service';
import { StorageService } from './storage.service';

/**
 * The service class to manage jwt tokens.
 *
 * @export
 * @class AuthTokenService
 */
@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  private isTimeoutSet = false;
  private isTimeoutRequired = true;
  isLoggedOut = false;
  notifyLogout: BehaviorSubject<number> = new BehaviorSubject(undefined);
  notifyBefore = 120; //2min
  /**
   * Creates an instance of AuthTokenService.
   *
   * @param {HttpClient} http
   * @memberof AuthTokenService
   */
  constructor(
    private storageService: StorageService,
    private router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(DOCUMENT) readonly document: Document,
    readonly pushMessageService: PushMessageService,
    @Inject(EnvironmentToken) private environment: Environment,
    readonly http: HttpClient,
  ) {}

  /**
   * Method to set the token to local storage of browser.
   * And set the timeout of the token
   * @param token
   */
  setAuthToken(token): void {
    if (token != null) {
      if (this.appToken === ApplicationTypeEnum.PRIVATE) {
        this.storageService.setLocalValue(AppConstants.AUTH_TOKEN_PRIVATE, token);
      } else if (this.appToken === ApplicationTypeEnum.PUBLIC) {
        this.storageService.setLocalValue(AppConstants.AUTH_TOKEN_PUBLIC, token);
      } else if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
        this.storageService.setLocalValue(AppConstants.AUTH_TOKEN_MEDICAL_BOARD, token);
      } else {
        this.storageService.setLocalValue(AppConstants.AUTH_TOKEN_INDIVIDUAL, token);
      }
      if (!this.environment.disableTokenTimeout) {
        this.setTokenTimeOut(token);
      }
      if (!this.checkTokenValidity(token)) this.router.navigate([RouterConstants.ROUTE_NOT_FOUND]);
      else {
        // if (this.appToken === ApplicationTypeEnum.PUBLIC) this.pushMessageService.updateToken();
        const payload = this.decodeToken(token);
        if (payload?.preferredlanguage?.trim() === undefined || payload?.preferredlanguage?.trim() === 'NOT_FOUND') {
          this.storageService.setLocalValue('lang', 'ar');
        } else {
          const lang = payload.preferredlanguage?.trim();
          this.storageService.setLocalValue('lang', lang);
        }
        /**
         * set token for local development. Can remove after development
         * start block
         */
        if (this.document.location.hostname !== 'localhost') {
          this.router.navigate(['/']);
        }
        /**
         * End of block
         */
      }
    }
  }

  /**
   * Method to get the token from local storage
   */
  getAuthToken(): string {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      return this.storageService.getLocalValue(AppConstants.AUTH_TOKEN_PRIVATE);
    } else if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      return this.storageService.getLocalValue(AppConstants.AUTH_TOKEN_PUBLIC);
    } else if (this.appToken === ApplicationTypeEnum.DEV) {
      return this.storageService.getLocalValue(AppConstants.AUTH_TOKEN_DEV);
    } else if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      return this.storageService.getLocalValue(AppConstants.AUTH_TOKEN_INDIVIDUAL);
    } else if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      return this.storageService.getLocalValue(AppConstants.AUTH_TOKEN_MEDICAL_BOARD);
    }
  }

  /**
   * Method to get the entitlements
   */
  getEntitlements(): GosiScope[] {
    const scopes = [];
    const token = this.decodeToken(this.getAuthToken());
    const publicEstKey =
      this.appToken === ApplicationTypeEnum.MEDICAL_BOARD
        ? 'i'
        : this.environment.entitlementChange
        ? 'establishment'
        : 'e';
    const publicRoleKey = this.environment.entitlementChange ? 'role' : 'r';
    const privateRoleKey = 'role';
    if (token['gosiscp'] && token['gosiscp'].trim() !== 'NOT_FOUND') {
      const isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
      this.parseToken(token).forEach(scp => {
        const roles = scp[isPrivate ? privateRoleKey : publicRoleKey]?.map((r: string) => +r);
        if (
          this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP &&
          this.appToken !== ApplicationTypeEnum.MEDICAL_BOARD
        ) {
          const regNo = isPrivate ? undefined : scp[publicEstKey] ? Number(scp[publicEstKey]) : undefined;
          scopes.push(new GosiScope(regNo, roles));
        } else if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
          const regNo = isPrivate ? undefined : scp[publicEstKey] ? Number(scp[publicEstKey]) : undefined;
          scopes.push(new GosiScope(regNo, roles));
        } else {
          const individulaId = isPrivate ? undefined : scp['i'] ? Number(scp['i']) : undefined;
          scopes.push(new GosiScope(null, roles, individulaId));
        }
      });
    }
    return scopes;
  }

  /**
   * Method to get the individual Id
   */
  getIndividual(): number {
    this.getEntitlements().forEach(scp => {
      if (scp.role.includes(RoleIdEnum.SUBSCRIBER) || scp.role.includes(RoleIdEnum.VIC)) {
        return scp.individualId;
      }
    });
    return this.getEntitlements()[0].individualId;
  }

  /**
   * Method to get NIN of the logged in user in establishment public
   */

  getEstablishmentUID(): number{
    const token = this.decodeToken(this.getAuthToken());
    let userId = token.uid ? token.uid : token.userreferenceid;
    return Number(userId);
  }


  getEstablishment(): number {
    this.getEntitlements().forEach(scp => {
    if(scp.role.includes(RoleIdEnum.CONTRACTED_DOCTOR)) {
      return scp.establishment;
    }
  });
  return this.getEntitlements()[0].establishment;
  }
  /**
   *
   * @param token
   * method to get individual roles
   */
  getIndividualRole(): RoleIdEnum[] {
    const role = [];
    this.getEntitlements().forEach(scp => {
      role.push(scp.role);
    });
    return role;
  }
  /**
   * Method to parse token
   */
  parseToken(token: JwtPayload) {
    try {
      return JSON.parse(token['gosiscp']);
    } catch {
      return undefined;
    }
  }

  /**
   * Method to check the token is present
   */
  isTokenAvailable(): boolean {
    const token = this.getAuthToken();
    if (!token) {
      return false;
    }
    return true;
  }

  /**
   * Method to check the validity of token
   */
  isValidAuthToken(): boolean {
    if (
      this.appToken === ApplicationTypeEnum.CONTRACT_APP ||
      this.appToken === ApplicationTypeEnum.DEV ||
      this.appToken === ApplicationTypeEnum.MBASSESSMENT_APP ||
      this.appToken === ApplicationTypeEnum.CUSTOMER_SURVEY
    ) {
      return true;
    }
    let token = this.getAuthToken();
    if (!token) {
      /**
       * set token for local development. Can remove after development
       * start block
       */
      if (this.document.location.hostname === 'localhost') {
          // Temp logic to enable external access to local IP address
          token =
            this.appToken === ApplicationTypeEnum.PRIVATE
              ? devToken.privateToken
              : this.appToken === ApplicationTypeEnum.PUBLIC
              ? devToken.publicToken
              : this.appToken === ApplicationTypeEnum.MEDICAL_BOARD
              ? devToken.medicalBoardToken
              : devToken.individualToken;
          this.setAuthToken(token);
        } else return false;
      /**
       * End of block
       */
    }
    if (!this.isTimeoutSet && !this.environment.disableTokenTimeout) {
      this.setTokenTimeOut(token);
    }
    if (this.environment.disableTokenTimeout) {
      return true;
    }
    return this.getTokenTimeOut(token) > 0 ? true : false;
    // return true;
  }

  /**
   * Method to set the timer based on timeout.
   * And will clear the local storage when token got expired
   * @param token
   */
  setTokenTimeOut(token): void {
    const timeout = this.getTokenTimeOut(token);
    let timeoutInSec = timeout > 0 ? Math.floor(timeout / 1000) : 0;
    if (this.isTimeoutRequired) {
      const enableTimer = new BehaviorSubject<boolean>(true);
      const timer$ = timer(0, 1000);
      const clearTimer = () => {
        enableTimer.next(false);
        this.clearApplicationData();
      };
      timer$.pipe(takeUntil(enableTimer));
      timer$.subscribe(() => {
        this.isTimeoutSet = true;
        /**
       * if (timeoutInSec < 60 && this.appToken === ApplicationTypeEnum.PUBLIC && this.pushMessageService.isTokenValid) {
          this.terminateUserSession();
        }
       */
        if (timeoutInSec > 0) {
          timeoutInSec--;
        } else {
          clearTimer();
        }
      });
    }
  }

  /**
   * Method to notify user
   * @param timeoutInSec
   */
  notifyUser(timeoutInSec: number) {
    if (timeoutInSec <= this.notifyBefore) {
      this.notifyLogout.next(timeoutInSec);
      this.notifyLogout.complete();
    }
  }

  /**
   * Method to get the timeout in milliseconds
   * @param token
   */
  getTokenTimeOut(token): number {
    try {
      const jwtToken = this.decodeToken(token);
      let timeout = 0;
      if (jwtToken) {
        const expDateAst = moment(jwtToken.exp * 1000, 'x').tz('Asia/Riyadh');
        const currentDateAST = moment().tz('Asia/Riyadh');
        timeout = expDateAst.diff(currentDateAST);
      }
      return timeout < 0 ? 0 : timeout;
    } catch (error) {
      return 0;
    }
  }
  /**
   * Method to check token validity
   * @param token
   */
  checkTokenValidity(token) {
    const jwtToken = this.decodeToken(token);
    if (jwtToken && jwtToken.gosiscp && jwtToken.gosiscp.trim() !== 'NOT_FOUND') return true;
    else return false;
  }
  /**
   * Method to decode token
   * @param token
   */
  decodeToken(token) {
    if (token) {
      try {
        return jwtDecode<JWTPayload>(token);
      } catch (error) {
        return null;
      }
    }
  }
  

  /**
   * This method is to perform login operation.
   *
   * @returns
   * @memberof LoginService
   */
  doLogin() {
    if (!this.isLoggedOut) {
      const loginUrl = this.environment.loginUrl;
      this.document.location.href = loginUrl;
    }
  }
    /**
   * Method to do the logoout activity
   */
    doLogout() {
      if (!this.isLoggedOut) {
        this.isLoggedOut = true;
        this.terminateUserSession();
      }
    }
  /**
   * Method to clear application data
   */
  clearApplicationData() {
    this.storageService.clearSession();
    this.storageService.clearLocalValue(AppConstants.APPLICATION_AUTH_TOKEN(this.appToken)
    );
    this.storageService.clearLocalValue('disply-benefit-exp-popup');
    if (this.storageService.getLocalValue(StorageKeyEnum.IS_MOBILE_APP)) {
      this.router.navigate([RouterConstantsBase.ROUTE_LOGIN]);
    } else if (this.appToken === ApplicationTypeEnum.PRIVATE && this.environment?.isProd) {
      this.doLogin();
    } else {
      const logoutUrl = this.environment.logoutUrl;
      this.document.location.href = logoutUrl;
    }
  }
  /**
   * Method to invalidate jwt token in Ameen
   */
  invalidateJwtToken() {
    return this.http.post(
      '/api/v1/token-invalidate',
      {},
      {
        headers: { ignoreLoadingBar: '' }
      }
    );
  }
  /**
   * Method to clear user session
   */
  terminateUserSession() {
    if (this.appToken === ApplicationTypeEnum.PUBLIC || this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP || this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.invalidateJwtToken().subscribe(
        () => this.clearApplicationData(),
        () => this.clearApplicationData()
      );
    } else this.clearApplicationData();
    /**
  if (this.pushMessageService.isTokenValid)
      this.pushMessageService
        .removeToken()
        .pipe(
          switchMap(() => {
            return this.invalidateJwtToken();
          }),
          catchError(() => this.invalidateJwtToken())
        )
        .subscribe(
          () => this.clearApplicationData(),
          () => this.clearApplicationData()
        );
    else  */
  }
}
