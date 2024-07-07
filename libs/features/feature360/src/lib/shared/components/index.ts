import { ChooseDetailsTypeComponent } from './choose-details-type/choose-details-type.component';
import { EnterComplaintDcComponent } from './enter-complaint-dc/enter-complaint-dc.component';
import { VerifyNinumberDcComponent } from './verify-ninumber-dc/verify-ninumber-dc.component';
import { MessageModalComponent } from './message-modal/message-modal.component';

export const REGISTER_COMPONENTS = [
  VerifyNinumberDcComponent,
  EnterComplaintDcComponent,
  ChooseDetailsTypeComponent,
  MessageModalComponent
];

export * from './message-modal/message-modal.component';
export * from './verify-ninumber-dc/verify-ninumber-dc.component';
export * from './enter-complaint-dc/enter-complaint-dc.component';
export * from './choose-details-type/choose-details-type.component';
