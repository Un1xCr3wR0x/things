/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { REGISTER_COMPONENTS } from './components';
import { RegisterEstablishmentRoutingModule } from './register-establishment-routing.module';

@NgModule({
  declarations: [REGISTER_COMPONENTS],
  imports: [SharedModule, CommonModule, RegisterEstablishmentRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterEstablishmentModule {}
