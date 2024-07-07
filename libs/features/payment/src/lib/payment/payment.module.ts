/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme/lib/theme.module';
import { SharedModule } from '../shared/shared.module';

import { PaymentRoutingModule } from './payment-routing.module';
import { MiscPaymentScComponent } from '@gosi-ui/features/payment/lib/payment/misc-payment/misc-payment-sc/misc-payment-sc.component';
import { ContributorSearchScComponent } from '@gosi-ui/features/payment/lib/payment/contributor-search-sc/contributor-search-sc.component';
import { PaymentDetailsDcComponent } from '@gosi-ui/features/payment/lib/payment/misc-payment/payment-details-dc/payment-details-dc.component';
import { DirectPaymentTimelineScComponent } from './misc-payment/direct-payment-timeline-sc/direct-payment-timeline-sc.component';

@NgModule({
  declarations: [
    MiscPaymentScComponent,
    ContributorSearchScComponent,
    PaymentDetailsDcComponent,
    DirectPaymentTimelineScComponent
  ],
  imports: [CommonModule, PaymentRoutingModule, ThemeModule, SharedModule]
})
export class PaymentModule {}
