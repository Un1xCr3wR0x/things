/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CancelVicDcComponent } from './cancel-vic-dc.component';
import { CancelVicRoutingModule } from './cancel-vic-routing.module';
import { CANCEL_VIC_COMPONENTS } from './components';

@NgModule({
  declarations: [CANCEL_VIC_COMPONENTS, CancelVicDcComponent],
  imports: [CommonModule, CancelVicRoutingModule, SharedModule],
  exports: [CANCEL_VIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CancelVicModule {}
