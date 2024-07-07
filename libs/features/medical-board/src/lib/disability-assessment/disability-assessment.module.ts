import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFragmentsModule, ValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { DISABILITY_ASSESSMENT_COMPONENTS } from './components';
import { AddVisitingDoctorRoutingModule } from './disability-assessment-routing.module';

@NgModule({
  declarations: [...DISABILITY_ASSESSMENT_COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    FormFragmentsModule,
    ValidatorModule,
    AddVisitingDoctorRoutingModule,
  ]
})
export class DisabilityAssessmentModule { }
