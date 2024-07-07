/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionStateGuard } from '@gosi-ui/core';
import { DelinkEstablishmentScComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    component: DelinkEstablishmentScComponent,
    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.DELINK-OTHER-GROUP'
    }
  },
  {
    path: 'modify',
    component: DelinkEstablishmentScComponent,
    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.DELINK-OTHER-GROUP'
    }
  },
  {
    path: ':groupStatus',
    component: DelinkEstablishmentScComponent,
    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.DELINK-NEW-GROUP'
    }
  },
  {
    path: ':groupStatus/modify',
    component: DelinkEstablishmentScComponent,

    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.DELINK-NEW-GROUP'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelinkEstablishmentRoutingModule {}
