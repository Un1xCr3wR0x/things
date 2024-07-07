/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { AddressModule, ContactModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { AddContributorDcComponent } from './add-contributor-dc.component';
import { AddContributorRoutingModule } from './add-contributor-routing.module';
import {ADD_CONTRIBUTOR_COMPONENTS, EngagementWageAddDcComponent, EngagementWageHistoryDcComponent} from './components';
import { FileUploadDcComponent } from './components/file-upload-dc/file-upload-dc.component';
import { PERSON_DETAILS_COMPONENTS } from './components/person-details';

@NgModule({
  declarations: [AddContributorDcComponent, ...ADD_CONTRIBUTOR_COMPONENTS],
  imports: [CommonModule, AddContributorRoutingModule, ThemeModule, AddressModule, ContactModule, SharedModule],
  entryComponents: [PERSON_DETAILS_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    EngagementWageAddDcComponent,
    EngagementWageHistoryDcComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ]
})
export class AddContributorModule {}
