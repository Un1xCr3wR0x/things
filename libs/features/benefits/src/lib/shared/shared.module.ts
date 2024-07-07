/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_SHARED_COMPONENTS, ModifyRequestDateDcComponent } from './component';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';

import {
  AddressModule,
  ValidatorModule as CommonValidatorModule,
  ContactModule,
  PersonalDetailsModule
} from '@gosi-ui/foundation/form-fragments';
import { BENEFITPIPES } from './pipes';
import { RefundVoluntaryContributionsDcComponent } from './component/refund-voluntary-contributions-dc/refund-voluntary-contributions-dc.component';
import { AddModifyDependentDcComponent } from './component/add-modify-dependent-dc/add-modify-dependent-dc.component';
import { NewbornAddDcComponent } from './component/newborn-add-dc/newborn-add-dc.component';
import { CancelTransactionPopupDcComponent } from './component/cancel-transaction-popup-dc/cancel-transaction-popup-dc.component';
import { TranslateModule } from '@ngx-translate/core';
//import { TranscationPaymentDetailsScComponent } from './component/transaction-details/transcation-payment-details-sc/transcation-payment-details-sc.component';
// import { DependentListingMobileViewDcComponent } from './component/dependent-listing-mobile-view-dc/dependent-listing-mobile-view-dc.component';
@NgModule({
  declarations: [
    ...UI_SHARED_COMPONENTS,
    ...BENEFITPIPES,
    RefundVoluntaryContributionsDcComponent,
    AddModifyDependentDcComponent,
    NewbornAddDcComponent,
    CancelTransactionPopupDcComponent,
    //TranscationPaymentDetailsScComponent
    // DependentListingMobileViewDcComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    AddressModule,
    ContactModule,
    IconsModule,
    PersonalDetailsModule,
    CommonValidatorModule,
    TranslateModule
  ],
  providers: [...BENEFITPIPES],
  exports: [
    ...UI_SHARED_COMPONENTS,
    ...BENEFITPIPES,
    ThemeModule,
    AddressModule,
    ContactModule,
    IconsModule,
    PersonalDetailsModule,
    CommonValidatorModule,
    TranslateModule
  ]
})
export class SharedModule {}
