/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RefreshDcComponent } from '@gosi-ui/foundation-theme';
import { ParticipantProfileDcComponent } from './participant-profile-dc.component';

export const routes: Routes = [
  { path: 'refresh', component: RefreshDcComponent, pathMatch: 'full' },
  {
    path: '',
    component: ParticipantProfileDcComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.PARTICIPANT-PROFILE'
    },
    children: [
      {
        path: 'details',
        component: ParticipantProfileDcComponent,
        data: {
          breadcrumb: 'MEDICAL-BOARD.PARTICIPANT-PROFILE'
        }
      },
  ]
}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class ParticipantProfileRoutingModule {}
