/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllowanceRoutingModule } from './allowance-routing.module';
import { SharedModule } from '../shared/shared.module';
import { IconsModule, ThemeModule } from '@gosi-ui/foundation-theme';
import { ALLOWANCE_COMPONENTS } from '.';

@NgModule({
  declarations: [...ALLOWANCE_COMPONENTS],
  imports: [CommonModule, SharedModule, IconsModule, ThemeModule, AllowanceRoutingModule],
  exports: [...ALLOWANCE_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AllowanceModule {}
