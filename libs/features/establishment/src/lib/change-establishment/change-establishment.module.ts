/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { AddressModule, ContactModule, ValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';
import { ChangeEstablishmentDcComponent } from './change-establishment-dc.component';
import { ChangeEstablishmentRoutingModule } from './change-establishment-routing.module';
import { CHANGE_EST_COMPONENTS } from './components';

@NgModule({
  declarations: [ChangeEstablishmentDcComponent, ...CHANGE_EST_COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    ThemeModule,
    AddressModule,
    ContactModule,
    ValidatorModule,
    ChangeEstablishmentRoutingModule,
    NgxPaginationModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChangeEstablishmentModule {}
