import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContributorAssessmentScComponent } from './contributor-assessment-sc/contributor-assessment-sc.component';
import { FormFragmentsModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { REASSESSMENT_COMPONENTS } from '.';
import { reassessmentRoutingModule } from './reassessment-routing.module';
import { PreviousAssessmentModalDcComponent } from './previous-assessment-modal-dc/previous-assessment-modal-dc.component';
import { EarlyParticipantReassessmentScComponent } from './early-participant-reassessment-sc/early-participant-reassessment-sc.component';
import { EarlyDisabilityDetailsDcComponent } from './early-disability-details-dc/early-disability-details-dc.component';
import { ReportFormDcComponent } from './report-form-dc/report-form-dc.component';

@NgModule({
  declarations: [
    REASSESSMENT_COMPONENTS,
    PreviousAssessmentModalDcComponent,
    EarlyParticipantReassessmentScComponent,
    EarlyDisabilityDetailsDcComponent,
    ReportFormDcComponent,
    ContributorAssessmentScComponent
  ],
  imports: [CommonModule, SharedModule, FormFragmentsModule, ThemeModule, reassessmentRoutingModule],
  exports: [REASSESSMENT_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReassessmentModule {}
