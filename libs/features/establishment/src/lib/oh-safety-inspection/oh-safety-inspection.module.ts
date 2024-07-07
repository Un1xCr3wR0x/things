/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared/shared.module';
import { OH_SAFETY_COMPONENTS } from './components';
import { OhSafetyInspectionRoutingModule } from './oh-safety-inspection-routing.module';

@NgModule({
  declarations: [OH_SAFETY_COMPONENTS],
  imports: [CommonModule, ThemeModule, SharedModule, OhSafetyInspectionRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OhSafetyInspectionModule {}
