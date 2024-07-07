/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BenefitsDcComponent } from './benefits-dc.component';
import { BenefitsRoutingModule } from './benefits-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GosiHttpInterceptor } from '@gosi-ui/core';

@NgModule({
  imports: [CommonModule, BenefitsRoutingModule],
  declarations: [BenefitsDcComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ]
  /* ,
  providers: [
    BILLING_PROVIDERS,
    {
      provide: ContributionPaymentToken,
      useValue: new ContributionPaymentRouterData()
    }
  ] */
})
export class BenefitsModule {}
