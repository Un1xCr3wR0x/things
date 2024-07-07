/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchDcComponent } from './search-dc.component';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { DASHBOARD_SEARCH_COMPONENTS } from './components';
import { SharedModule } from '../shared';
@NgModule({
  declarations: [SearchDcComponent, ...DASHBOARD_SEARCH_COMPONENTS],
  imports: [ThemeModule, CommonModule, SearchRoutingModule, SharedModule],
  exports: [...DASHBOARD_SEARCH_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchModule {}
