import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantQueueRoutingModule } from './participant-queue-routing.module';
import { FormFragmentsModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { PARTICIPANT_QUEUE_COMPONENTS } from './components';
import { ParticipantQueueDcComponent } from './participant-queue-dc.component';
import { ThemeModule } from '@gosi-ui/foundation-theme';

@NgModule({
  declarations: [ParticipantQueueDcComponent, ...PARTICIPANT_QUEUE_COMPONENTS],
  imports: [CommonModule, ParticipantQueueRoutingModule, FormFragmentsModule, SharedModule,ThemeModule]
})
export class ParticipantQueueModule {}
