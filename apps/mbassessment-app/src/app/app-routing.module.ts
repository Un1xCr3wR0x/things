/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LoginGuard } from '@gosi-ui/core';

/**
 * Declaration of routes for Home feature
 */
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(mod => mod.HomeModule),
    data: {
      breadcrumb: 'HOME'
    }
    // canActivate: [LoginGuard]
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
