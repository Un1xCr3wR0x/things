/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ChangeAddressDetailsScComponent } from './change-address-details-sc/change-address-details-sc.component';
import { ChangeBankDetailsScComponent } from './change-bank-details-sc/change-bank-details-sc.component';
import { ChangeBasicDetailsScComponent } from './change-basic-details-sc/change-basic-details-sc.component';
import { ChangeContactDetailsScComponent } from './change-contact-details-sc/change-contact-details-sc.component';
import { ChangeIdentifierDetailsScComponent } from './change-identifier-details-sc/change-identifier-details-sc.component';
import { ChangeLegalEntityDetailsScComponent } from './change-legal-entity-details-sc/change-legal-entity-details-sc.component';
import { ChangeMofPaymentScComponent } from './change-mof-payment-sc/change-mof-payment-sc.component';
import { ChangeOwnerScComponent } from './change-owner-sc/change-owner-sc.component';
import { ModifyLateFeeScComponent } from './modify-late-fee-sc/modify-late-fee-sc.component';
import { MofPaymentDetailsScComponent } from './mof-payment-details-sc/mof-payment-details-sc.component';
import { OwnerCardDcComponent } from './owner-card-dc/owner-card-dc.component';
import { OwnerDcComponent } from './owner-dc/owner-dc.component';
import { OwnerFilterDcComponent } from './owner-filter-dc/owner-filter-dc.component';
import { OwnersScComponent } from './owners-sc/owners-sc.component';
import { SearchEstablishmentScComponent } from './search-establishment-sc/search-establishment-sc.component';

export const CHANGE_EST_COMPONENTS = [
  OwnersScComponent,
  OwnerDcComponent,
  OwnerFilterDcComponent,
  SearchEstablishmentScComponent,
  ChangeBasicDetailsScComponent,
  ChangeIdentifierDetailsScComponent,
  ChangeBankDetailsScComponent,
  ChangeAddressDetailsScComponent,
  ChangeContactDetailsScComponent,
  ChangeLegalEntityDetailsScComponent,
  OwnerCardDcComponent,
  ChangeOwnerScComponent,
  ModifyLateFeeScComponent,
  ChangeMofPaymentScComponent,
  MofPaymentDetailsScComponent
];

export * from './change-address-details-sc/change-address-details-sc.component';
export * from './change-bank-details-sc/change-bank-details-sc.component';
export * from './change-basic-details-sc/change-basic-details-sc.component';
export * from './change-contact-details-sc/change-contact-details-sc.component';
export * from './change-identifier-details-sc/change-identifier-details-sc.component';
export * from './change-legal-entity-details-sc/change-legal-entity-details-sc.component';
export * from './change-owner-sc/change-owner-sc.component';
export * from './modify-late-fee-sc/modify-late-fee-sc.component';
export * from './owner-card-dc/owner-card-dc.component';
export * from './owner-dc/owner-dc.component';
export * from './owner-filter-dc/owner-filter-dc.component';
export * from './owners-sc/owners-sc.component';
export * from './search-establishment-sc/search-establishment-sc.component';
export * from './change-mof-payment-sc/change-mof-payment-sc.component';
export * from './mof-payment-details-sc/mof-payment-details-sc.component';
