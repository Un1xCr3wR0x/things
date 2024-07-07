/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchDcComponent } from './search-dc.component';

import {
  TransactionSearchScComponent,
  EstablishmentSearchScComponent,
  IndividualSearchScComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'establishment',
    pathMatch: 'full'
  },
  {
    path: '',
    component: SearchDcComponent,
    children: [
      { path: '', redirectTo: 'establishment', pathMatch: 'full' },
      {
        path: 'establishment',
        component: EstablishmentSearchScComponent
      },
      {
        path: 'transaction',
        component: TransactionSearchScComponent
      },
      {
        path: 'individual',
        component: IndividualSearchScComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule {}
