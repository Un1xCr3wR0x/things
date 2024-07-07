import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SessionStatusDcComponent } from './session-status-dc.component';
import { SessionStatusScComponent, RescheduleSessionScComponent } from './components';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: SessionStatusScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.MANAGE-MEDICAL-BOARD'
    }
  },
  {
    path: ':sessionId/reschedule-session',
    component: RescheduleSessionScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.MANAGE-MEDICAL-BOARD'
    }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionStatusRoutingModule {}
