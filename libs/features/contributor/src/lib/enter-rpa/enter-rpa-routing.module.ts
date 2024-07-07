/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnterRpaScComponent } from './components/enter-rpa-sc/enter-rpa-sc.component';


const routes: Routes = [
    {
        path: '',
        component: EnterRpaScComponent
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnterRpaRoutingModule {}