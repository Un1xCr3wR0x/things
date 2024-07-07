/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { ThemeModule } from '@gosi-ui/foundation-theme/src';
import { SharedModule } from './shared/shared.module';
import { ViolationsDcComponent } from './violations-dc.component';
import { ViolationsRoutingModule } from './violations-routing.module';

@NgModule({
  imports: [CommonModule, ViolationsRoutingModule, ThemeModule, SharedModule],
  declarations: [ViolationsDcComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViolationsModule {}
