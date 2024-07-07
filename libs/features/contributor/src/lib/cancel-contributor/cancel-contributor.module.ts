/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CancelContributorDcComponent } from './cancel-contributor-dc.component';
import { CancelContributorRoutingModule } from './cancel-contributor-routing.module';
import { CANCEL_CONTRINBUTOR_COMPONENTS } from './components';

@NgModule({
  declarations: [CancelContributorDcComponent, CANCEL_CONTRINBUTOR_COMPONENTS],
  imports: [CommonModule, CancelContributorRoutingModule, SharedModule],
  exports: [CANCEL_CONTRINBUTOR_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CancelContributorModule {}
