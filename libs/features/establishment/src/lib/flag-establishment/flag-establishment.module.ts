/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared/shared.module';
import { FLAG_EST_COMPONENTS } from './components';
import { FlagEstablishmentRoutingModule } from './flag-establishment-routing.module';
import { FlagFilterDcComponent } from './components/flag-filter-dc/flag-filter-dc.component';

@NgModule({
  declarations: [FLAG_EST_COMPONENTS, FlagFilterDcComponent],
  imports: [CommonModule, ThemeModule, SharedModule, FlagEstablishmentRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FlagEstablishmentModule {}
