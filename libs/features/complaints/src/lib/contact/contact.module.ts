/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactRoutingModule } from './contact-routing.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { CONTACT_COMPONENTS } from './components';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [...CONTACT_COMPONENTS,],
  imports: [CommonModule, ContactRoutingModule, ThemeModule, SharedModule],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactModule {}
