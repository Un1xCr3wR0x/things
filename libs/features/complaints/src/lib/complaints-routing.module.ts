/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/**
 * Declaration of routes for complaints module
 */
export const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./contact/contact.module').then(mod => mod.ContactModule)
  },
  {
    path: 'validator',
    loadChildren: () => import('./validator/validator.module').then(mod => mod.ValidatorModule)
  },
  {
    path: 'itsm',
    loadChildren: () => import('./itsm/itsm-complaint.module').then(mod => mod.ItsmComplaintModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then(mod => mod.TransactionsModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact-us/contact-us.module').then(mod => mod.ContactUsModule)
  }

];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplaintsRoutingModule {}
