/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { BillingDcComponent } from './billing-dc.component';
import { BillingRoutingModule } from './billing-routing.module';

@NgModule({
  imports: [CommonModule, ThemeModule, BillingRoutingModule],
  declarations: [BillingDcComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  /* ,
  providers: [
    BILLING_PROVIDERS,
    {
      provide: ContributionPaymentToken,
      useValue: new ContributionPaymentRouterData()
    }
  ] */
})
export class BillingModule {}
