import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { NgxPaginationModule } from 'ngx-pagination';
import { PENALTY_WAIVER_COMPONENTS } from './components';
import { PenaltyWaiverRoutingModule } from './penalty-waiver-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PENALTY_WAIVER_COMPONENTS],
  imports: [ThemeModule, CommonModule, SharedModule, NgxPaginationModule, PenaltyWaiverRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PenaltyWaiverModule {}
