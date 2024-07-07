/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordScComponent } from './components/change-password-sc/change-password-sc.component';
import { UserPreferencesScComponent } from './components/user-preferences-sc/user-preferences-sc.component';
import {UpdateUserContactScComponent} from './components/update-user-contact-sc/update-user-contact-sc.component';
export const routes: Routes = [
  {
    path: 'preference',
    component: UserPreferencesScComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordScComponent,
    data: {
      breadcrumb: 'CUSTOMER-INFORMATION.PASSWORD-MANAGEMENT'
    }
  },{
    path: 'update-user-contact',
    component: UpdateUserContactScComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class UserActivityRoutingModule {}
