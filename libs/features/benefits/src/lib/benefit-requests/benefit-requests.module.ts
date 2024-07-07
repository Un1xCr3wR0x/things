/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme/lib/theme.module';

import { SharedModule } from '../shared/shared.module';
import { BenefitRequestsRoutingModule } from './benefit-requests-routing.module';

import { MyBenefitRequestsScComponent } from './my-benefit-requests-sc/my-benefit-requests-sc.component';
import { BenefitsRequestsTabDcComponent } from './my-benefit-requests-sc/benefits-requests-tab-dc/benefits-requests-tab-dc.component';
import { BenefitRequestFilterDcComponent } from './my-benefit-requests-sc/benefit-request-filter-dc/benefit-request-filter-dc.component';

@NgModule({
  declarations: [MyBenefitRequestsScComponent, BenefitsRequestsTabDcComponent, BenefitRequestFilterDcComponent],
  imports: [CommonModule, BenefitRequestsRoutingModule, ThemeModule, SharedModule]
})
export class BenefitRequestsModule {}
