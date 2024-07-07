/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { VirtualVisitDcComponent } from './components/virtual-visit-dc/virtual-visit-dc.component';
import { VirtualVisitRoutingModule } from './virtual-visit-routing.module';

@NgModule({
  declarations: [VirtualVisitDcComponent],
  imports: [ThemeModule, CommonModule, VirtualVisitRoutingModule]
})
export class VirtualVisitModule {}
