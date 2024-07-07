/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AddressModule, ContributorProfileModule } from '@gosi-ui/foundation/form-fragments';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared';
import { SURVEY_COMPONENTS } from './components';
import { SurveyRoutingModule } from './survey-routing.module';
import { QuestionsDcComponent } from './components/questions-dc/questions-dc.component';

@NgModule({
  declarations: [SURVEY_COMPONENTS, QuestionsDcComponent],
  imports: [CommonModule, SharedModule, ThemeModule, AddressModule, ContributorProfileModule, SurveyRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SurveyModule {}
