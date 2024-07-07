/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared/shared.module';
import { ChangeMainEstablishmentRoutingModule } from './change-main-establishment-routing.module';
import { CHANGE_MAIN_EST_COMPONENTS } from './components';

@NgModule({
  declarations: [...CHANGE_MAIN_EST_COMPONENTS],
  imports: [CommonModule, ChangeMainEstablishmentRoutingModule, ThemeModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChangeMainEstablishmentModule {}
