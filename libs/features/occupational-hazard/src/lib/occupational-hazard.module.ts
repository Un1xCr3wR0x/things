/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OccupationalHazardRoutingModule } from './occupational-hazard-routing.module';
import { OccupationalHazardDcComponent } from './occupational-hazard-dc.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GosiHttpInterceptor } from '@gosi-ui/core';

@NgModule({
  declarations: [OccupationalHazardDcComponent],
  imports: [CommonModule, OccupationalHazardRoutingModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OccupationalHazardModule {}
