/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme/lib/theme.module';
import { BypassReassessmentRoutingModule } from './bypass-reassessment-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BYPASS_REASSESSMENT_COMPONENTS } from '.';
import { BypassReassessmentDcComponent } from './bypass-reassessment-dc.component';

@NgModule({
  declarations: [BYPASS_REASSESSMENT_COMPONENTS, BypassReassessmentDcComponent],
  imports: [CommonModule, BypassReassessmentRoutingModule, ThemeModule, SharedModule],
  exports: [BYPASS_REASSESSMENT_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BypassReassessmentModule {}
