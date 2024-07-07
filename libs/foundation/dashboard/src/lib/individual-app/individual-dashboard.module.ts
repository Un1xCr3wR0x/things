import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme/src';
import { SharedModule } from '../shared';
import { IndividualDashboardDCComponent } from './individual-dashboard-dc.component';
import { INDIVIDUAL_DASHBOARD_COMPONENTS } from './components';
import { IndividualRoutingModule } from './individual-routing.module';

@NgModule({
  declarations: [IndividualDashboardDCComponent, ...INDIVIDUAL_DASHBOARD_COMPONENTS],
  imports: [ThemeModule, CommonModule, IndividualRoutingModule, SharedModule],
  exports: [...INDIVIDUAL_DASHBOARD_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IndividualDashboardModule {}
