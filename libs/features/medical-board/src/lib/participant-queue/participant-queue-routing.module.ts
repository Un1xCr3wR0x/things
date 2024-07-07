import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignSessionScComponent, ParticipantQueueScComponent } from './components';
import { ParticipantQueueDcComponent } from './participant-queue-dc.component';

const routes: Routes = [
  {
    path: '',
    component: ParticipantQueueDcComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.MB-SESSIONS'
    }
  },
  {
    path: 'view',
    component: ParticipantQueueScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.MANAGE-MEDICAL-BOARD'
    }
  },
  {
    path: 'assign',
    component: AssignSessionScComponent,
    data: {
      breadcrumb: 'MEDICAL-BOARD.MANAGE-MEDICAL-BOARD'
    }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipantQueueRoutingModule {}
