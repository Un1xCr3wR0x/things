/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AppConstants, RouterConstants } from '../constants';
import { StorageService } from '../services/storage.service';
import { MenuService } from '../services/menu.service';

@Injectable()
export class LoginGuardTmp implements CanActivate {
  /**
   * Creates an instance of LoginGuard
   * @param authTokenService
   * @param loginService
   * @memberof LoginGuard
   */
  constructor(
    /* private authTokenService: AuthTokenService, */
    private storageService: StorageService,
    private router: Router,
    readonly menuService: MenuService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // TODO: KP uncomment below 3 lines on merging to master
    //if (this.menuService.checkURLPermission(state.url)?.isEstablishmentRequired === false) {
    // return true;
    //} else
    if (this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY)) {
      return true;
    } else {
      // TODO: KP remove below line on merging to master
      this.router.navigate(['/login']);
      // TODO: KP uncomment below 1 line on merging to master
      // this.router.navigate([RouterConstants.ROUTE_DASHBOARD]);
    }
  }
}
