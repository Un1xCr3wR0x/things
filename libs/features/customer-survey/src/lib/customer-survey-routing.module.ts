/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   component: CustomerSurveyDcComponent,
  //   children: [
  //   ]
  // },
  {
    path: '',
    loadChildren: () => import('./survey/survey.module').then(mod => mod.SurveyModule)
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerSurveyRoutingModule {}
