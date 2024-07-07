/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiseaseRoutingModule } from './disease-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';

import { DISEASE_COMPONENTS } from '.';
import { AddAnotherEngagementModalDcComponent } from './add-another-engagement-modal-dc/add-another-engagement-modal-dc.component';
import { AddDiseaseScComponent } from './add-disease-sc/add-disease-sc.component';
import { DiseaseAssessmentDetailsDcComponent } from './disease-assessment-details-dc/disease-assessment-details-dc.component';
import { DiseaseDetailsDcComponent } from './disease-details-dc/disease-details-dc.component';
import { DiseaseSummaryDcComponent } from './disease-summary-dc/disease-summary-dc.component';
import { OccupationDetailsDcComponent } from './occupation-details-dc/occupation-details-dc.component';
import { PersonInfoDcComponent } from './person-info-dc/person-info-dc.component';
import { SelectOccupationDcComponent } from './select-occupation-dc/select-occupation-dc.component';
import { ViewDiseaseComplicationDcComponent } from './view-disease-complication-dc/view-disease-complication-dc.component';
import { ViewDiseaseDcComponent } from './view-disease-dc/view-disease-dc.component';
import { ViewDiseaseScComponent } from './view-disease-sc/view-disease-sc.component';
import { ReopenDiseaseScComponent } from './reopen-disease-sc/reopen-disease-sc.component';

@NgModule({
  declarations: [...DISEASE_COMPONENTS, AddAnotherEngagementModalDcComponent, AddDiseaseScComponent, DiseaseAssessmentDetailsDcComponent, DiseaseDetailsDcComponent, DiseaseSummaryDcComponent, OccupationDetailsDcComponent, PersonInfoDcComponent, SelectOccupationDcComponent, ViewDiseaseComplicationDcComponent, ViewDiseaseDcComponent, ViewDiseaseScComponent, ReopenDiseaseScComponent],
  imports: [CommonModule, SharedModule, IconsModule, ThemeModule,  DiseaseRoutingModule],
  exports: [...DISEASE_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiseaseModule {}
