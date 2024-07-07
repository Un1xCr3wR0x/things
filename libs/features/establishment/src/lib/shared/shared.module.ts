/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { AddressModule, BankDetailsModule, ContactModule } from '@gosi-ui/foundation/form-fragments';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { EST_COMPONENTS } from './components';

@NgModule({
  declarations: [...EST_COMPONENTS],
  imports: [
    CommonModule,
    ThemeModule,
    ReactiveFormsModule,
    AddressModule,
    ContactModule,
    BankDetailsModule,
    NgxPaginationModule,
    TranslateModule
  ],
  exports: [...EST_COMPONENTS, ThemeModule, AddressModule, ContactModule, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
