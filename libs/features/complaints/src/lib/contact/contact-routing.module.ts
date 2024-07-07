/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { RegisterGeneralComplaintsComponentSc, ReportGeneralComplaintsScComponent } from './components';
import { Routes, RouterModule } from '@angular/router';

/**
 * Declaration of routes for complaints feature
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'general',
    pathMatch: 'full'
  },
  {
    path: 'general/:personId',
    component: ReportGeneralComplaintsScComponent,
    data: {
      breadcrumb: 'COMPLAINTS.GENERAL-COMPLAINTS'
    }
  },
  {
    path: 'general/:personId/:transactionId',
    component: ReportGeneralComplaintsScComponent,
    data: {
      breadcrumb: 'COMPLAINTS.GENERAL-COMPLAINTS'
    }
  },
  {
    path: 'general',
    component: ReportGeneralComplaintsScComponent,
    data: {
      breadcrumb: 'COMPLAINTS.GENERAL-COMPLAINTS'
    }
  },
  {
    path: 'register-complaint/:id',
    component: RegisterGeneralComplaintsComponentSc,
    data: {
      breadcrumb: 'COMPLAINTS.GENERAL-COMPLAINTS'
    }
  },
  {
    path: 'register-complaint',
    component: RegisterGeneralComplaintsComponentSc,
    data: {
      breadcrumb: 'COMPLAINTS.GENERAL-COMPLAINTS'
    }
  },
  {
    path: '',
    redirectTo: 'reassign',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule {}
