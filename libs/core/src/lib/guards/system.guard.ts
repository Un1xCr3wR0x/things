/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterConstants } from '../constants';
import { SystemStatusEnum } from '../enums/system-status-enum';
import { SystemService } from '../services/system.service';

@Injectable({
  providedIn: 'root'
})
export class SystemGuard implements CanActivate {
  constructor(private router: Router, readonly systemService: SystemService) {}
  canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    //return this.systemService.getSystemStatus().pipe(map(res => this.handleStatus(res.code, state)));   
    return true;
  }
  /**
   * Method to handle the status
   * @param code
   */
  handleStatus(code: SystemStatusEnum, state: RouterStateSnapshot): boolean | UrlTree {
    if (code === SystemStatusEnum.NORMAL) {
      return this.accessMaintanancePage(state.url, false);
    } else if (code === SystemStatusEnum.MAINTANANCE) {
      return this.accessMaintanancePage(state.url, true);
    } else if (code === SystemStatusEnum.REFRESH) {
      if (this.systemService.shouldRefresh) {
        this.systemService.reload();
      }
      return this.accessMaintanancePage(state.url, false);
    } else if (code === SystemStatusEnum.UNAUTHORISED) {
      return this.accessUnauthorisedPage(state.url);
    } else {
      return true;
    }
  }

  accessMaintanancePage(route: string, isMaintanance: boolean) {
    if (isMaintanance) {
      return route.includes(RouterConstants.ROUTE_UNDER_MAINTANENCE)
        ? true
        : this.router.parseUrl(RouterConstants.ROUTE_UNDER_MAINTANENCE);
    } else {
      if (
        route.includes(RouterConstants.ROUTE_UNDER_MAINTANENCE) ||
        route.includes(RouterConstants.ROUTE_INVALID_TOKEN)
      ) {
        this.router.navigate(['/']);
        return false;
      } else return true;
    }
  }

  accessUnauthorisedPage(route: string) {
    return route.includes(RouterConstants.ROUTE_INVALID_TOKEN)
      ? true
      : this.router.parseUrl(RouterConstants.ROUTE_INVALID_TOKEN);
  }
}
