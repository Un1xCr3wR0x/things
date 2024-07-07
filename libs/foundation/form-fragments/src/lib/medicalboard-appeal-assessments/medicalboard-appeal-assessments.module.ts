import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFragmentsModule } from '../form-fragments.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AppealAssessmentsTimelineDcComponent } from './appeal-assessments-timeline-dc/appeal-assessments-timeline-dc.component';
import { AppealReasonsFormDcComponent } from './appeal-reasons-form-dc/appeal-reasons-form-dc.component';

@NgModule({
  declarations: [AppealReasonsFormDcComponent, AppealAssessmentsTimelineDcComponent],
  imports: [CommonModule, FormFragmentsModule, AlertModule.forRoot()],
  exports: [AppealAssessmentsTimelineDcComponent,AppealReasonsFormDcComponent,AlertModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MedicalboardAppealAssessmentsModule {}
