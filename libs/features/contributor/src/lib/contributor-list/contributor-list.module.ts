/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CONTRIBUTOR_LIST_COMPONENTS } from './components';
import { ContributorListDcComponent } from './contributor-list-dc.component';
import { ContributorListRoutingModule } from './contributor-list-routing.module';

@NgModule({
  declarations: [ContributorListDcComponent, ...CONTRIBUTOR_LIST_COMPONENTS],
  imports: [CommonModule, SharedModule, ContributorListRoutingModule],
  exports: [ContributorListDcComponent, ...CONTRIBUTOR_LIST_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContributorListModule {}
