/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme';

@NgModule({
  imports: [CommonModule, ThemeModule],
  exports: [ThemeModule],
  declarations: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormFragmentsModule {}
