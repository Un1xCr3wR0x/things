/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SHARED_COMPONENTS } from './components';

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [CommonModule, ThemeModule],
  exports: [...SHARED_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SharedModule {}
