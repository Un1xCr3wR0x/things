/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { DashboardDcComponent } from './components/dashboard-dc/dashboard-dc.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [DashboardDcComponent],
  imports: [ThemeModule, CommonModule, DashboardRoutingModule]
})
export class DashboardModule {}
