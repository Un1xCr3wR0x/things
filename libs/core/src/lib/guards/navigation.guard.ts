/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from '../services/menu.service';
@Injectable()
export class NavigationGuard implements CanActivate {
  constructor(private menuService: MenuService, readonly router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const defaultUrl = this.menuService.getDefaultNavigation(route.data.routeList);
    this.router.navigate([defaultUrl], { replaceUrl: true });
    return true;
  }
}
