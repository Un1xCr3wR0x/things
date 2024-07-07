/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ValidatorModule as CommonValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { VALIDATOR_COMPONENTS } from './components';
import { UpdateModifyCoverageDcComponent } from './components/change-engagement/update-modify-coverage-dc/update-modify-coverage-dc.component';
import { EAdminScComponent } from './components/e-registration/verify-e-registration/e-admin-sc/e-admin-sc.component';
import { EnterRpaEngagementDetailsDcComponent } from './components/enter-rpa/enter-rpa-engagement-details-dc/enter-rpa-engagement-details-dc.component';
import { ValidatorReactivateEngagementScComponent } from './components/reactivate-engagement/validator-reactivate-engagement-sc/validator-reactivate-engagement-sc.component';
import { ValidatorReactivateVicScComponent } from './components/reactivate-vic/validator-reactivate-vic-sc/validator-reactivate-vic-sc.component';
import { ValidatorDcComponent } from './validator-dc.component';
import { ValidatorRoutingModule } from './validator-routing.module';

@NgModule({
  declarations: [
    ValidatorDcComponent,
    ...VALIDATOR_COMPONENTS,
    UpdateModifyCoverageDcComponent,
    EAdminScComponent,
    ValidatorReactivateEngagementScComponent,
    ValidatorReactivateVicScComponent,
    EnterRpaEngagementDetailsDcComponent
  ],
  imports: [CommonModule, SharedModule, ValidatorRoutingModule, CommonValidatorModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ValidatorModule {}
