import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactUsRoutingModule } from './contact-us-routing.module';
import { WRITE_US_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [...WRITE_US_COMPONENTS],
  imports: [CommonModule, ContactUsRoutingModule, ThemeModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactUsModule {}
