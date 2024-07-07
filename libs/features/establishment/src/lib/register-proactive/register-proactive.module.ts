/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RegisterProactiveScComponent, ProactiveDetailsDcComponent } from './components';
import { RegisterProactiveRoutingModule } from './register-proactive-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [RegisterProactiveScComponent, ProactiveDetailsDcComponent],
  imports: [RegisterProactiveRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
//TODO: rename folder to proactive-registration
export class RegisterProactiveModule {}
