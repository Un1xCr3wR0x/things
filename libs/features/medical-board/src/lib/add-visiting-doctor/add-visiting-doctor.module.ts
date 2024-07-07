import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddVisitingDoctorDcComponent } from './add-visiting-doctor-dc.component';
import { FormFragmentsModule, ValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { AddVisitingDoctorRoutingModule } from './add-visiting-doctor-routing.module';
import { ADD_VISITING_DOCTOR_COMPONENTS } from './components';
import { VisitingDoctorSpecialtyDcComponent } from './components/visiting-doctor-specialty-dc/visiting-doctor-specialty-dc.component';
import { VisitingDoctorListDcComponent } from './components/visiting-doctor-list-dc/visiting-doctor-list-dc.component';
import { AssessmentScheduleDetailsDcComponent } from './components/assessment-schedule-details-dc/assessment-schedule-details-dc.component';
import { ContributorVisitingDetailsDcComponent } from './components/contributor-visiting-details-dc/contributor-visiting-details-dc.component';
import { VisitingDoctorFilterDcComponent } from './components/visiting-doctor-filter-dc/visiting-doctor-filter-dc.component';
import { PreviousAssessmentsDcComponent } from './components/previous-assessments-dc/previous-assessments-dc.component';
import { AssessmentContentDcComponent } from './components/assessment-content-dc/assessment-content-dc.component';
import { HeirDisabilityAssessmentDetailsDcComponent } from './components/heir-disability-assessment-details-dc/heir-disability-assessment-details-dc.component';
import { MboVisitingDoctorDetailsDcComponent } from './components/mbo-visiting-doctor-details-dc/mbo-visiting-doctor-details-dc.component';
import { SharedModule as FormSharedModule } from '@gosi-ui/foundation/form-fragments/lib/shared/shared.module';
import { ThemeModule } from '@gosi-ui/foundation-theme/lib/theme.module';

@NgModule({
  declarations: [
    AddVisitingDoctorDcComponent,
    ...ADD_VISITING_DOCTOR_COMPONENTS,
    VisitingDoctorSpecialtyDcComponent,
    VisitingDoctorListDcComponent,
    AssessmentScheduleDetailsDcComponent,
    ContributorVisitingDetailsDcComponent,
    VisitingDoctorFilterDcComponent,
    PreviousAssessmentsDcComponent,
    AssessmentContentDcComponent,
    HeirDisabilityAssessmentDetailsDcComponent,
    MboVisitingDoctorDetailsDcComponent
  ],
  imports: [CommonModule, ValidatorModule, FormFragmentsModule, SharedModule, AddVisitingDoctorRoutingModule,FormSharedModule,ThemeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddVisitingDoctorModule {}
