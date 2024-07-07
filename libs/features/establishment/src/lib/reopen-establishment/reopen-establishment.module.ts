/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared/shared.module';
import { REOPEN_EST_COMPONENTS } from './componants';
import { ReopenEstablishmentRoutingModule } from './reopen-establishment-routing.module';

@NgModule({
  declarations: [REOPEN_EST_COMPONENTS],
  imports: [CommonModule, SharedModule, ThemeModule, ReopenEstablishmentRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReopenEstablishmentModule {}
