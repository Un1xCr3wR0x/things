/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstants } from '../constants';
import { Environment } from '../models';
import { ApplicationTypeToken, EnvironmentToken } from '../tokens';
import { AuthTokenService } from './auth-token.service';
import { PushMessageService } from './push-message.service';
import { StorageService } from './storage.service';

/**
 * The service class to manage contributor operations.
 *
 * @export
 * @class ContributorService
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  /**
   * Creates an instance of LoginService.
   * @memberof LoginService
   */
  isLoggedOut = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    readonly authTokenService: AuthTokenService,
    readonly router: Router,
    readonly storageService: StorageService,
    @Inject(EnvironmentToken) private environment: Environment,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly pushMessageService: PushMessageService
  ) {}


  /**
   * Method to check login status
   */
  checkLoginStatus() {
    if(window.location.href.includes("oauth2/callback") || window.location.href.includes("do-login")) {

      return true;

    }
    if (this.authTokenService.isTokenAvailable()) {
      window.onpopstate = () => {
        if (!this.authTokenService.isValidAuthToken()) this.authTokenService.doLogout();
      };
      window.onstorage = () => {
        if (!this.authTokenService.isValidAuthToken()) this.authTokenService.doLogout();
      };
    }
    return this.authTokenService.isValidAuthToken();
  }
  /**
   * Method to handle login and save the token in local storage
   * @param token
   */
  handleLoginCallBack(token) {
    if (token !== '') {
      this.authTokenService.setAuthToken(token);
      this.router.navigate(['/']);
    }
  }

  /**
   * Method to handle token unavailability
   */
  handleTokenUnavailable() {
    this.router.navigate([RouterConstants.ROUTE_INVALID_TOKEN]);
  }

}
