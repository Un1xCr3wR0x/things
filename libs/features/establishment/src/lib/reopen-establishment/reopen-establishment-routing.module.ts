/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionStateGuard } from '@gosi-ui/core';
import { ReopenEstablishmentScComponent } from './componants/reopen-establishment-sc/reopen-establishment-sc.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'request',
    pathMatch: 'full'
  },
  {
    path: 'request',
    component: ReopenEstablishmentScComponent,

    data: {
      breadcrumb: 'ESTABLISHMENT.REOPEN-ESTABLISHMENT'
    }
  },
  {
    path: 'modify',
    component: ReopenEstablishmentScComponent,
    canDeactivate: [TransactionStateGuard],
    data: {
      breadcrumb: 'ESTABLISHMENT.REOPEN-ESTABLISHMENT'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReopenEstablishmentRoutingModule {}
