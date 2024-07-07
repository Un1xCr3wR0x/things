/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { ContributorDcComponent } from './contributor-dc.component';
import { ContributorRoutingModule } from './contributor-routing.module';
@NgModule({
  imports: [CommonModule, ContributorRoutingModule],
  declarations: [ContributorDcComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContributorModule {}
