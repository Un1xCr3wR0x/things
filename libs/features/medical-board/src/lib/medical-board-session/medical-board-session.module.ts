/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormFragmentsModule, ValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { MedicalBoardSessionDcComponent } from './medical-board-session-dc.component';
import { MedicalBoardSessionRoutingModule } from './medical-board-session-routing.module';
import { MEDICAL_BOARD_SESSION_COMPONENTS } from './components';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ParticpantsListAssignDcComponent } from './components/shared/particpants-list-assign-dc/particpants-list-assign-dc.component';

FullCalendarModule.registerPlugins([interactionPlugin, dayGridPlugin]);

//TODO Try to provide the same name as the folder(ViewMemberModule) for modules. No need to append mb in file name
@NgModule({
  declarations: [MedicalBoardSessionDcComponent, ...MEDICAL_BOARD_SESSION_COMPONENTS, ParticpantsListAssignDcComponent],
  imports: [
    CommonModule,
    ValidatorModule,
    FormFragmentsModule,
    SharedModule,
    FullCalendarModule,
    MedicalBoardSessionRoutingModule
  ]
})
export class MedicalBoardSessionModule {}
