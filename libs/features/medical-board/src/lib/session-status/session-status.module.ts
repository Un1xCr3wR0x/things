import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionStatusRoutingModule } from './session-status-routing.module';
import { SessionStatusDcComponent } from './session-status-dc.component';
import { SESSION_STATUS_COMPONENTS } from './components';
import { FormFragmentsModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { MbOfficerModalDcComponent } from './components/mb-officer-modal-dc/mb-officer-modal-dc.component';

@NgModule({
  declarations: [SessionStatusDcComponent, ...SESSION_STATUS_COMPONENTS, MbOfficerModalDcComponent],
  imports: [CommonModule, SessionStatusRoutingModule, FormFragmentsModule, SharedModule]
})
export class SessionStatusModule {}
