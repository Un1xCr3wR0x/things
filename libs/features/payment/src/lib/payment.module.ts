/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentDcComponent } from './payment-dc.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { GosiHttpInterceptor } from '@gosi-ui/core';

@NgModule({
  imports: [CommonModule, PaymentRoutingModule],
  declarations: [PaymentDcComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ]
})
export class PaymentModule {}
