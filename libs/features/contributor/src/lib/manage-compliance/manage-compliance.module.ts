/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MANAGE_COMPLIANCE_COMPONENTS } from './components';
import { ManageComplianceRoutingModule } from './manage-compliance-routing.module';

@NgModule({
  declarations: [MANAGE_COMPLIANCE_COMPONENTS],
  imports: [CommonModule, ManageComplianceRoutingModule, SharedModule]
})
export class ManageComplianceModule {}
