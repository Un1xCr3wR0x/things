/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme';
import { AddVisitingDoctorDcComponent } from './add-visiting-doctor-dc.component';
import { AddVisitingDoctorScComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    component: AddVisitingDoctorScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.VISITING-DOCTOR'
    }
  },
  {
    path: 'edit',
    component: AddVisitingDoctorScComponent,
    data: {
      breadcrumb: 'Visiting Doctor'
    }
  }
 ];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class AddVisitingDoctorRoutingModule {}
