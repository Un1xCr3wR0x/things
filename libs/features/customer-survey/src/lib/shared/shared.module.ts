/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { MANAGE_PERSON_COMPONENTS } from './components';
import { AddressModule } from '@gosi-ui/foundation/form-fragments';

@NgModule({
  declarations: [...MANAGE_PERSON_COMPONENTS],
  imports: [CommonModule, ThemeModule, AddressModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ],
  exports: [...MANAGE_PERSON_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
