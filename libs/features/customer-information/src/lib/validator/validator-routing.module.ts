/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePersonScComponent } from './components/manage-person-sc/manage-person-sc.component';
import { ValidatorDcComponent } from './validator-dc.component';
import { ValidateModifyNationalityComponentsc } from './components/change-nationality/validate-modify-nationality.component';
import { ModifyPersonDetailsScComponent } from './components/modify-person-details-sc/modify-person-details-sc.component';
import { AddNinDetailsDcComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    component: ValidatorDcComponent,
    children: [
      {
        path: 'add-iqama',
        component: ManagePersonScComponent
      },
      {
        path: 'add-border',
        component: ManagePersonScComponent
      },
      {
        path: 'change-nationality',
        component: ValidateModifyNationalityComponentsc
      },
      {
        path: 'add-passport',
        component: ManagePersonScComponent
      },
      {
        path: 'modify-personal-details',
        component: ModifyPersonDetailsScComponent
      },
      {
        path: 'add-nin',
        component: ManagePersonScComponent
      },
      {
        path: 'edit-nin',
        component: ManagePersonScComponent
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidatorRoutingModule {}
