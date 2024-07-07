/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AddAuthorizationRoutingModule } from './add-authorization-routing.module';
import { ADD_AUTHORIZATION_COMPONENTS } from './components';

@NgModule({
  declarations: [ADD_AUTHORIZATION_COMPONENTS],
  imports: [CommonModule, AddAuthorizationRoutingModule, SharedModule],
  exports: [ADD_AUTHORIZATION_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddAuthorizationModule {}
