/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, iif, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, retryWhen, tap } from 'rxjs/operators';
import { AppConstants } from '../constants';
import { ApplicationTypeEnum, StorageKeyEnum, SystemStatusEnum } from '../enums';
import { BilingualText, SystemStatus } from '../models';
import { ApplicationTypeToken } from '../tokens';
import { AuthTokenService } from './auth-token.service';
import { LoginService } from './login.service';
import { StorageService } from './storage.service';
export interface RetryRequestOptions {
  maximumRetries: number;
  retryDelay: number;
}
@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private retryRequestOptions: RetryRequestOptions = {
    maximumRetries: 2,
    retryDelay: 2000 //milliseconds
  };
  private _status: SystemStatus;
  private _maintananceError = (message: BilingualText): SystemStatus => ({
    code: SystemStatusEnum.MAINTANANCE,
    message: message,
    refreshKey: '',
    status: 'OK'
  });
  private _unauthError = (): SystemStatus => ({
    code: SystemStatusEnum.UNAUTHORISED,
    messageKey: 'CORE.UNAUTHORIZED-ERROR',
    message: {
      arabic: '',
      english: ''
    },
    refreshKey: '',
    status: 'OK',
    messageParam: {
      link1: AppConstants.ADD_ADMIN_GPT_LINK_EN,
      link2: AppConstants.ADD_ADMIN_GPT_LINK_AR
    }
  });
  private _unauthError_general = (): SystemStatus => ({
    code: SystemStatusEnum.UNAUTHORISED,
    messageKey: 'CORE.UNAUTHORIZED-GENERAL-ERROR',
    message: {
      arabic: '',
      english: ''
    },
    refreshKey: '',
    status: 'OK'
  });

  constructor(
    readonly http: HttpClient,
    readonly storageService: StorageService,
    readonly authTokenService: AuthTokenService,
    readonly loginService: LoginService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  getSystemStatus(): Observable<SystemStatus> {
    if (this.authTokenService.getAuthToken()?.trim()) {
      if (this.authTokenService.getEntitlements()?.length > 0) {
        const url = `/api/v1/system/status`;
        return (this.status ? of(this.status) : this.http.get<SystemStatus>(url)).pipe(
          retryWhen(errors => {
            return errors.pipe(
              concatMap((error: HttpErrorResponse, retryId: number) =>
                // Executes a conditional Observable depending on the result
                // of the first argument
                iif(
                  () => retryId < this.retryRequestOptions.maximumRetries && error.status === 504,
                  this.retryError(error, retryId === 1 ? this.retryRequestOptions.retryDelay : 0),
                  this.returnError(error)
                )
              )
            );
          }),
          catchError(err => {
            if (err?.error?.code === SystemStatusEnum.UNAUTHORISED) {
              return of(this._unauthError());
            }
            return of(this._maintananceError(err?.error?.message));
          }),
          tap(res => {
            this._status = res;
          })
        );
      } else {
        if (this.appToken === ApplicationTypeEnum.PUBLIC) {
          return of(this._unauthError()).pipe(
            tap(res => {
              this._status = res;
            })
          );
        } else {
          return of(this._unauthError_general()).pipe(
            tap(res => {
              this._status = res;
            })
          );
        }
      }
    } else {
      this.authTokenService.clearApplicationData();
      this.authTokenService.doLogin();
    }
  }

  returnError(error: HttpErrorResponse) {
    return throwError(error);
  }

  retryError(error: HttpErrorResponse, retryDelay: number) {
    return of(error).pipe(delay(retryDelay));
  }

  get status() {
    return this._status;
  }

  get statusChecked() {
    return this._status ? true : false;
  }

  get isUnderMaintanance(): boolean {
    return this._status?.code === SystemStatusEnum.MAINTANANCE;
  }

  get shouldRefresh(): boolean {
    if (this._status?.code === SystemStatusEnum.REFRESH) {
      const refreshKey = this.storageService.getLocalValue(StorageKeyEnum.REFRESH_KEY);
      if (refreshKey !== this.status.refreshKey) {
        this.storageService.setLocalValue(StorageKeyEnum.REFRESH_KEY, this.status.refreshKey);
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  reload() {
    window.location.reload();
  }
}
