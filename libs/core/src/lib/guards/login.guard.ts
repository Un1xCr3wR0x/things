/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { AuthTokenService } from '../services/auth-token.service';
@Injectable()
export class LoginGuard implements CanActivate, CanLoad {
  /**
   * Creates an instance of LoginGuard
   * @param authTokenService
   * @param loginService
   * @memberof LoginGuard
   */
  constructor(
    /* private authTokenService: AuthTokenService, */
    private authTokenService: AuthTokenService,
    private loginService: LoginService
  ) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkToken();
  }
  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkToken();
  }
  checkToken() {
    if (this.authTokenService.isValidAuthToken()) {
      return true;
    }
    this.authTokenService.doLogin();
    return false;
  }
}
