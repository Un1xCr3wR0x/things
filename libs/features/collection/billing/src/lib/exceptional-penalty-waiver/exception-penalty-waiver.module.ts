import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeModule } from '@gosi-ui/foundation-theme';
import { ESTABLISHMENT_SERVICE_COMPONENTS } from './components';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExceptionalPenaltyWaiverRoutingModule } from './exception-penalty-waiver-routing.module';

@NgModule({
  declarations: [...ESTABLISHMENT_SERVICE_COMPONENTS],
  imports: [ThemeModule, CommonModule, ExceptionalPenaltyWaiverRoutingModule, SharedModule, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExceptionalPenaltyWaiverModule {}
