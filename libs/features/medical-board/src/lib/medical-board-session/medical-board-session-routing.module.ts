/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CreateAdhocSessionScComponent,
  CreateRegularSessionScComponent,
  MedicalBoardSessionScComponent,
  SessionConfigurationDetailsScComponent
} from './components';

export const routes: Routes = [
  {
    path: '',
    component: MedicalBoardSessionScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.MB-SESSIONS'
    }
  },
  {
    path: 'regular-session',
    component: CreateRegularSessionScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.MANAGE-MEDICAL-BOARD'
    }
  },
  {
    path: 'regular-session/edit',
    component: CreateRegularSessionScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.MANAGE-MEDICAL-BOARD'
    }
  },
  {
    path: 'adhoc-session',
    component: CreateAdhocSessionScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.MANAGE-MEDICAL-BOARD'
    }
  },
  {
    path: 'adhoc-session/edit',
    component: CreateAdhocSessionScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.MANAGE-MEDICAL-BOARD'
    }
  },
  {
    path: 'session-details',
    component: SessionConfigurationDetailsScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.MANAGE-MEDICAL-BOARD'
    }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class MedicalBoardSessionRoutingModule {}
