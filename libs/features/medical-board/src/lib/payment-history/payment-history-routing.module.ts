/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentHistoryComponent } from './payment-history.component';

export const routes: Routes = [{
    path: 'list',
    component: PaymentHistoryComponent
}];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    declarations: []
  })
  export class PaymentHistoryRoutingModule {}