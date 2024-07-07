import { CUSTOM_ELEMENTS_SCHEMA,  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFragmentsModule } from '../form-fragments.module';
import { AcceptAssessmentDcComponent } from './accept-assessment-dc/accept-assessment-dc.component';
import { MedicalboardAssessmentScheduleDcComponent } from './medicalboard-assessment-schedule-dc/medicalboard-assessment-schedule-dc.component';
import { MedicalboardRescheduleDcComponent } from './medicalboard-reschedule-dc/medicalboard-reschedule-dc.component';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [AcceptAssessmentDcComponent, MedicalboardAssessmentScheduleDcComponent, MedicalboardRescheduleDcComponent],
  imports: [CommonModule, FormFragmentsModule,AlertModule.forRoot()],
  exports: [AcceptAssessmentDcComponent,MedicalboardAssessmentScheduleDcComponent,MedicalboardRescheduleDcComponent,AlertModule,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MedicalboardAssessmentModule {
}
