/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared/shared.module';
import { DELINK_EST_COMPONENTS } from './components';
import { DelinkEstablishmentRoutingModule } from './delink-establishment-routing.module';

@NgModule({
  declarations: [...DELINK_EST_COMPONENTS],
  imports: [CommonModule, ThemeModule, SharedModule, DelinkEstablishmentRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DelinkEstablishmentModule {}
