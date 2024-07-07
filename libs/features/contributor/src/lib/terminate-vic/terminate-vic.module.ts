/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TERMINATE_VIC_COMPONENTS } from './components';
import { TerminateVicDcComponent } from './terminate-vic-dc.component';
import { TerminateVicRoutingModule } from './terminate-vic-routing.module';

@NgModule({
  declarations: [TerminateVicDcComponent, TERMINATE_VIC_COMPONENTS],
  imports: [CommonModule, TerminateVicRoutingModule, SharedModule],
  exports: [TERMINATE_VIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TerminateVicModule {}
