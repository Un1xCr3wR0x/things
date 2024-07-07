/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { RouterConstants } from '../constants';
import { ApplicationTypeEnum } from '../enums';
import { ApplicationTypeToken } from '../tokens';
import { MenuService } from '../services/menu.service';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivateChild {
  constructor(
    private menuService: MenuService,
    private loginService: LoginService,
    private router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  canActivateChild(_childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.appToken !== ApplicationTypeEnum.DEV && this.appToken !== ApplicationTypeEnum.CONTRACT_APP) {
      if (this.loginService.isLoggedOut) {
        return false;
      } else if (this.menuService.checkURLPermission(state.url)) {
        return true;
      } else {
        this.router.navigate([RouterConstants.ROUTE_NOT_FOUND]);
        return true;
      }
    } else return true;
  }
}
