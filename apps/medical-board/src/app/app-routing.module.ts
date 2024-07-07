/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard, NavigationGuard, PermissionGuard, RouterConstants, SystemGuard } from '@gosi-ui/core';
import { SystemStatusScComponent } from '@gosi-ui/foundation-theme';
/**
 * Declaration of routes for Home feature
 */
const routes: Routes = [
  ...['', 'home'].map(path => {
    return {
      path: path,
      canActivate: [LoginGuard,SystemGuard, NavigationGuard],
      canLoad: [LoginGuard],
      children: [],
      pathMatch: 'full',
      data: {
        routeList: RouterConstants.CONTRACTEDDOC_ROUTE_LIST
      }
    };
  }),
  {
    path: 'home',
    loadChildren: './features/home/home.module#HomeModule',
    canActivate: [LoginGuard, SystemGuard],
    canLoad: [LoginGuard],
    canActivateChild: [PermissionGuard],
    data: {
      breadcrumb: 'HOME'
    }
  },
  {
    path: 'dashboard',
    loadChildren: './features/dashboard/dashboard.module#DashboardModule',
    data: {
      breadcrumb: 'HOME'
    },
    canActivate: [LoginGuard, SystemGuard],
    canLoad: [LoginGuard],
    canActivateChild: [PermissionGuard]
  },
  {
    path: 'system-maintanance',
    component: SystemStatusScComponent,
    canActivate: [LoginGuard],
    canLoad: [LoginGuard]
  },
  {
    path: 'invalid-token',
    component: SystemStatusScComponent,
    canActivate: [SystemGuard]
  },
  {
    path: 'validator',
    loadChildren: () =>
      import('libs/features/contributor/src/lib/validator/validator.module').then(mod => mod.ValidatorModule)
  }
];
/**
 * Routing module for Home feature
 *
 * @export
 * @class HomeRoutingModule
 */
@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: true })],
  declarations: []
})
export class AppRoutingModule {}

