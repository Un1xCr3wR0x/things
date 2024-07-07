/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITSM_COMPONENTS } from './components';
import { ItsmComplaintsRoutingModule } from './itsm-complaints.routing.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { ItsmModule } from '@gosi-ui/foundation/form-fragments';
@NgModule({
  declarations: [...ITSM_COMPONENTS],
  imports: [ItsmComplaintsRoutingModule, CommonModule, ThemeModule, ItsmModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItsmComplaintModule {}
