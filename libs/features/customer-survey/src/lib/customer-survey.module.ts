/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
// import { CustomerInformationDcComponent } from './customer-information-dc.component';
// import { CustomerInformationRoutingModule } from './customer-information-routing.module';
import { SharedModule, MANAGE_PERSON_GUARDS } from './shared';
import { CustomerSurveyRoutingModule } from './customer-survey-routing.module';
import { CustomerSurveyDcComponent } from './customer-survey-dc.component';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme/src';

@NgModule({
  imports: [CommonModule, CustomerSurveyRoutingModule, ThemeModule, SharedModule, IconsModule],
  declarations: [CustomerSurveyDcComponent],
  providers: [MANAGE_PERSON_GUARDS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerSurveyModule {}
