/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidatorRoutingModule } from './validator-routing.module';
import { ValidatorDcComponent } from './validator-dc.component';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { VALIDATOR_COMPONENTS } from './components';
import { SharedModule } from '../shared/shared.module';
import { ItsmComplaintsRoutingModule } from '../itsm/itsm-complaints.routing.module';
import { AppealScComponent } from './components/appeal-sc/appeal-sc.component';

@NgModule({
  declarations: [ValidatorDcComponent, ...VALIDATOR_COMPONENTS, AppealScComponent],
  imports: [CommonModule, ValidatorRoutingModule, ItsmComplaintsRoutingModule, ThemeModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ValidatorModule {}
