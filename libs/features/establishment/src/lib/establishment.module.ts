/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { EstablishmentDcComponent } from './establishment-dc.component';
import { EstablishmentRoutingModule } from './establishment-routing.module';
import { SharedModule } from './shared/shared.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';

@NgModule({
  imports: [CommonModule, EstablishmentRoutingModule, SharedModule, RouterModule, ThemeModule],
  declarations: [EstablishmentDcComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EstablishmentModule {}
