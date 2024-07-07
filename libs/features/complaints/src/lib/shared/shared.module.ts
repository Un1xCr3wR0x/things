/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SHARED_COMPONENTS } from './components';
import { EstablishmentSelectDcComponent } from './components/establishment-select-dc/establishment-select-dc.component';
import { ItsmDetailsDcComponent } from './components/itsm-details-dc/itsm-details-dc.component';
import { ItsmReopenDcComponent } from './components/itsm-reopen-dc/itsm-reopen-dc.component';
import { CustomerVerifyDcComponent } from './components/customer-verify-dc/customer-verify-dc.component';

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS,
    EstablishmentSelectDcComponent,
    ItsmDetailsDcComponent,
    ItsmReopenDcComponent,
    CustomerVerifyDcComponent
  ],
  imports: [CommonModule, ThemeModule],
  exports: [...SHARED_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
