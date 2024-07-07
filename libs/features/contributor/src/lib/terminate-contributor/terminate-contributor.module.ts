/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TERMINATE_CONTRIBUTOR_COMPONENTS } from './components';
import { TerminateContributorDcComponent } from './terminate-contributor-dc.component';
import { TerminateContributorRoutingModule } from './terminate-contributor-routing.module';

@NgModule({
  declarations: [TerminateContributorDcComponent, TERMINATE_CONTRIBUTOR_COMPONENTS],
  imports: [CommonModule, TerminateContributorRoutingModule, SharedModule],
  exports: [TERMINATE_CONTRIBUTOR_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TerminateContributorModule {}
