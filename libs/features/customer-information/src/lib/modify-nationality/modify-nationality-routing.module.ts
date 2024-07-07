/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModifyNationalityScComponent } from './components/modify-nationality-sc.component';


const routes: Routes = [
  
  {
    path: '',
    component: ModifyNationalityScComponent,
    data: {
      breadcrumb: 'CUSTOMER-INFORMATION.MODIFY-NATIONALITY'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModifyNationalityRoutingModule {}

