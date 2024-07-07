/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme/src';
import { SharedModule } from './shared/shared.module';
import { AppealsRoutingModule } from './appeals-routing.module';
import { AppealsDcComponent } from './appeals-dc.component';

@NgModule({
  imports: [CommonModule, AppealsRoutingModule, ThemeModule, SharedModule],
  declarations: [AppealsDcComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppealsModule {}