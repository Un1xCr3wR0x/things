import { AssignSessionScComponent } from './assign-session-sc/assign-session-sc.component';
import { ParticipantDetailsDcComponent } from './participant-details-dc/participant-details-dc.component';
import { ParticipantFilterDcComponent } from './participant-filter-dc/participant-filter-dc.component';
import { ParticipantQueueHeadingDcComponent } from './participant-queue-heading-dc/participant-queue-heading-dc.component';
import { ParticipantQueueScComponent } from './participant-queue-sc/participant-queue-sc.component';

export const PARTICIPANT_QUEUE_COMPONENTS = [
  AssignSessionScComponent,
  ParticipantQueueScComponent,
  ParticipantQueueHeadingDcComponent,
  ParticipantFilterDcComponent,
  ParticipantDetailsDcComponent
];

export * from './participant-queue-sc/participant-queue-sc.component';
export * from './participant-queue-heading-dc/participant-queue-heading-dc.component';
export * from './participant-queue-sc/participant-queue-sc.component';
export * from './participant-details-dc/participant-details-dc.component';
export * from './assign-session-sc/assign-session-sc.component';
