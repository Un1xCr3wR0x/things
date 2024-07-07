/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { TERMINATE_EST_COMPONENTS } from './components';
import { TerminateEstablishmentRoutingModule } from './terminate-establishment-routing.module';

@NgModule({
  declarations: [TERMINATE_EST_COMPONENTS],
  imports: [CommonModule, SharedModule, ThemeModule, TerminateEstablishmentRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TerminateEstablishmentModule {}
