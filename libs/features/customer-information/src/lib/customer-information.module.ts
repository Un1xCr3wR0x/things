/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CustomerInformationDcComponent } from './customer-information-dc.component';
import { CustomerInformationRoutingModule } from './customer-information-routing.module';
import { SharedModule, MANAGE_PERSON_GUARDS } from './shared';


@NgModule({
  imports: [CommonModule, CustomerInformationRoutingModule, SharedModule],
  declarations: [CustomerInformationDcComponent],
  providers: [MANAGE_PERSON_GUARDS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerInformationModule {}
