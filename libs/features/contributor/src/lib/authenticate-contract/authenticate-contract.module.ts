/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PersonProfileViewModule } from '@gosi-ui/foundation/form-fragments';
import { EngagementActionGuard } from '../shared/guards';
import { SharedModule } from '../shared/shared.module';
import { AuthenticateContractDcComponent } from './authenticate-contract-dc.component';
import { AuthenticateContractRoutingModule } from './authenticate-contract-routing.module';
import { CONTRACT_COMPONENTS } from './components';
import { EstablishmentPreviewDcComponent } from './components/establishment-preview-dc/establishment-preview-dc.component';

@NgModule({
  declarations: [AuthenticateContractDcComponent, CONTRACT_COMPONENTS, EstablishmentPreviewDcComponent],
  imports: [CommonModule, AuthenticateContractRoutingModule, SharedModule, PersonProfileViewModule],
  providers: [EngagementActionGuard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthenticateContractModule {}
