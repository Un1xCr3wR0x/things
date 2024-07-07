/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RouterConstants } from '../constants';
import { RoleIdEnum } from '../enums';
import { AuthTokenService } from '../services/auth-token.service';
@Injectable()
export class AuthorizeAdminGuard implements CanActivate {
  /**
   * Creates an instance of AuthorizeAdminGuard
   * This guard will ensure that, admins with basic role are made to complete the details in GOSI Online before proceeding.
   * @param authTokenService
   * @param loginService
   * @memberof LoginGuard
   */
  constructor(private authTokenService: AuthTokenService, readonly router: Router) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.hasTemporaryRole();
  }

  hasTemporaryRole(): boolean {
    const identifier = +this.authTokenService.decodeToken(this.authTokenService.getAuthToken())?.sub;
    const value = this.authTokenService.getEntitlements();
    if (value) {
      const establishmentDetails = value
        ? value?.find(est => est?.role?.indexOf(RoleIdEnum.UPDATE_ADMIN) !== -1)
        : undefined;
      if (establishmentDetails) {
        this.router.navigate([
          RouterConstants.ROUTE_MISSING_ADMIN_DETAILS(establishmentDetails.establishment, identifier)
        ]);
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}
