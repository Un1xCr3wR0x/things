/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { ThemeModule,IconsModule } from '@gosi-ui/foundation-theme';
import { MANAGE_PERSON_COMPONENTS , SHARED_COMPONENTS } from './components';
import { AlertModule } from 'ngx-bootstrap/alert'
import { AddressModule } from '@gosi-ui/foundation/form-fragments/lib/address/address.module';
import { FormFragmentsModule } from '../form-fragments.module';
import { ValidatorModule } from '../validator/validator.module';

@NgModule({
  declarations: [...MANAGE_PERSON_COMPONENTS,...SHARED_COMPONENTS],
  imports: [FormFragmentsModule,CommonModule, ThemeModule, AddressModule,IconsModule, AlertModule.forRoot(), ValidatorModule],
  exports: [...MANAGE_PERSON_COMPONENTS,ThemeModule, IconsModule, ...SHARED_COMPONENTS, AlertModule, ValidatorModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ],


})
export class SharedModule {}
