/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard, PermissionGuard } from '@gosi-ui/core';

/**
 * Declaration of routes for Home feature
 */
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: './features/home/home.module#HomeModule',
    canActivate: [LoginGuard],
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
    canActivate: [LoginGuard],
    canLoad: [LoginGuard],
    canActivateChild: [PermissionGuard]
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
