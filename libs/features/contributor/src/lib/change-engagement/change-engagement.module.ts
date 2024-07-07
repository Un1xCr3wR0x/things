/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ChangeEngagementRoutingModule } from './change-engagement-routing.module';
import { CHANGE_ENGAGEMENT_COMPONENTS } from './components';
import { ChangeEngagementDcComponent } from './change-engagement-dc.component';

@NgModule({
  declarations: [CHANGE_ENGAGEMENT_COMPONENTS, ChangeEngagementDcComponent],
  imports: [CommonModule, ChangeEngagementRoutingModule, SharedModule],
  exports: [CHANGE_ENGAGEMENT_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChangeEngagementModule {}
