import { EstablishmentsFinancialDetailsComponent } from './components/establishments-financial-details-dc/establishments-financial-details-dc.component';
import { EstablishmentsContributionDetailsComponent } from './components/establishments-contribution-details-dc/establishments-contribution-details-dc.component';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { EstablishmentsSearchResultDcComponent, REGISTER_COMPONENTS } from './components';
import { EstablishmentsSearchDcComponent } from './components/establishments-search-dc/establishments-search-dc.component';
import { EstablishmentsRoutingModule } from './establishments-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [REGISTER_COMPONENTS],
  imports: [CommonModule, EstablishmentsRoutingModule, ReactiveFormsModule, ThemeModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    EstablishmentsSearchDcComponent,
    EstablishmentsSearchResultDcComponent,
    EstablishmentsContributionDetailsComponent,
    EstablishmentsFinancialDetailsComponent
  ]
})
export class EstablishmentsModule {}
