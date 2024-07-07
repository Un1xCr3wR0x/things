/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DoctorProfileDcComponent,
  MedicalBoardSessionScComponent,
  PersonalDetailsScComponent,
  DoctorContactScComponent,
  DoctorAddressScComponent,
  DoctorBankDetailsScComponent,
  DoctorDetailsScComponent,
  DoctorUnavailablePeriodScComponent,
  TerminateContractScComponent,
  ModifyContractScComponent,
  ViewContractHistoryScComponent
} from './components';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme';

export const routes: Routes = [
  { path: 'refresh', component: RefreshDcComponent, pathMatch: 'full' },
  {
    path: '',
    component: DoctorProfileDcComponent,
    children: [
      {
        path: 'person-details',
        component: PersonalDetailsScComponent,
        data: {
          breadcrumb: 'MEDICAL-BOARD.DOCTOR-PROFILE'
        }
      },
      {
        path: 'sessions',
        component: MedicalBoardSessionScComponent,
        data: {
          breadcrumb: 'MEDICAL-BOARD.DOCTOR-PROFILE'
        }
      }
    ]
  },
  {
    path: 'contact/edit',
    component: DoctorContactScComponent
  },
  {
    path: 'add-unavailable-period',
    component: DoctorUnavailablePeriodScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.ADD-UNAVAILABLE-PERIOD'
    }
  },
  {
    path: 'modify-unavailable-period/:calenderId',
    component: DoctorUnavailablePeriodScComponent
  },
  {
    path: 'address',
    component: DoctorAddressScComponent
  },
  {
    path: 'bank',
    component: DoctorBankDetailsScComponent
  },
  {
    path: 'doctor-details',
    component: DoctorDetailsScComponent
  },
  {
    path: 'modify-contract/:contractId',
    component: ModifyContractScComponent
  },
  {
    path: 'modify-contract/:contractId/edit',
    component: ModifyContractScComponent
  },
  {
    path: 'terminate-contract/:contractId',
    component: TerminateContractScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.TERMINATE-MB'
    }
  },
  {
    path: 'terminate-contract/:contractId/edit',
    component: TerminateContractScComponent,
  },
  {
    path: 'contract-history/:contractId',
    component: ViewContractHistoryScComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class DoctorProfileRoutingModule {}
