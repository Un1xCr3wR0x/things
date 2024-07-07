/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme/lib/theme.module';
import { SharedModule } from '../../shared/shared.module';
import { ReturnLumpsumScComponent } from './return-lumpsum-sc/return-lumpsum-sc.component';
import { RETURN_LUMPSUM_COMPONENTS } from './components';
import { ReturnLumpsumRoutingModule } from './return-lumpsum-routing.module';
import { RestoreLumpsumScComponent } from './restore-lumpsum-sc/restore-lumpsum-sc.component';

@NgModule({
  declarations: [RETURN_LUMPSUM_COMPONENTS, ReturnLumpsumScComponent, RestoreLumpsumScComponent],
  imports: [CommonModule, ThemeModule, SharedModule, ReturnLumpsumRoutingModule],
  exports: []
})
export class ReturnLumpsumModule {}
