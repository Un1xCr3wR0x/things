/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme';
import { AddVicScComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: AddVicScComponent
  },
  { path: 'refresh', component: RefreshDcComponent },
  { path: 'edit', component: AddVicScComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddVicRoutingModule {}
