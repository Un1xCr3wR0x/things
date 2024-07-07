/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeAdminGuard, LoginGuard, PermissionGuard, SystemGuard } from '@gosi-ui/core';
import { SystemStatusScComponent } from '@gosi-ui/foundation-theme';
import { AppLoginDcComponent } from './app-login/app-login-dc.component';
import { LoginDcComponent } from './login/login-dc.component';
/**
 * Declaration of routes for Home feature
 */
const routes: Routes = [
  ...['', 'home'].map(path => {
    return {
      path: path,
      redirectTo: '/dashboard',
      pathMatch: 'full',
      canLoad: [LoginGuard]
    };
  }),
  {
    path: 'home',
    loadChildren: './features/home/home.module#HomeModule',
    canActivate: [LoginGuard, SystemGuard, AuthorizeAdminGuard],
    canLoad: [LoginGuard],
    canActivateChild: [PermissionGuard],

    data: {
      breadcrumb: 'HOME'
    }
  },
  {
    path: 'dashboard',
    loadChildren: './features/dashboard/dashboard.module#DashboardModule',
    canActivate: [LoginGuard, SystemGuard, AuthorizeAdminGuard],
    canLoad: [LoginGuard],
    canActivateChild: [PermissionGuard]
  },
  {
    path: 'login',
    component: LoginDcComponent,
    canActivate: [LoginGuard, AuthorizeAdminGuard]
  },
  {
    path: 'complete-admin',
    loadChildren: './complete-admin-details/complete-admin-details.module#CompleteAdminDetailsModule',
    canActivate: [LoginGuard],
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
    path: 'virtual-visit',
    loadChildren: './features/virtual-visit/virtual-visit.module#VirtualVisitModule'
    //canActivate: [LoginGuard, SystemGuard, AuthorizeAdminGuard],
    //canLoad: [LoginGuard],
    //canActivateChild: [PermissionGuard]
  },
  {
    path: 'do-login',
    component: AppLoginDcComponent
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
