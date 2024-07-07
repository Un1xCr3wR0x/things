/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TRANSFER_CONTRIBUTOR_COMPONENTS } from './individual-transfer/components';
import { TRANSFER_ALL_CONTRIBUTOR_COMPONENTS } from './transfer-all/components';
import { TransferContributorDcComponent } from './transfer-contributor-dc.component';
import { TransferContributorRoutingModule } from './transfer-contributor-routing.module';
import { TRANSFER_MULTIPLE_CONTRIBUTOR_COMPONENTS } from './multiple-transfer/components';

@NgModule({
  declarations: [TransferContributorDcComponent, TRANSFER_CONTRIBUTOR_COMPONENTS, TRANSFER_ALL_CONTRIBUTOR_COMPONENTS, TRANSFER_MULTIPLE_CONTRIBUTOR_COMPONENTS],
  imports: [CommonModule, SharedModule, TransferContributorRoutingModule],
  exports: [TRANSFER_CONTRIBUTOR_COMPONENTS, TRANSFER_ALL_CONTRIBUTOR_COMPONENTS, TRANSFER_MULTIPLE_CONTRIBUTOR_COMPONENTS ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransferContrbutorModule {}
