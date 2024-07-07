/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackScComponent } from './components/callback-sc/callback-sc.component';
import { CallbackUpdatedScComponent } from './components/callback-updated-sc/callback-updated-sc.component';

const routes: Routes = [
  {
    path: 'oauth2/callback',
    component: CallbackScComponent
  },
  {
    path: 'access_token',
    component: CallbackUpdatedScComponent
  }
];

/**
 * The routing file is used to define core routing for the application.
 *
 * @export
 * @class CoreRoutingModule
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  declarations: []
})
export class CoreRoutingModule {}
