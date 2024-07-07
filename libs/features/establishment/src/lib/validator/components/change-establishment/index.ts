/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ValidateAddressDetailsScComponent } from './validate-address-details-sc/validate-address-details-sc.component';
import { ValidateBankDetailsScComponent } from './validate-bank-details-sc/validate-bank-details-sc.component';
import { ValidateBasicDetailsScComponent } from './validate-basic-details-sc/validate-basic-details-sc.component';
import { ValidateContactDetailsScComponent } from './validate-contact-details-sc/validate-contact-details-sc.component';
import { ValidateIdentifierDetailsScComponent } from './validate-identifier-details-sc/validate-identifier-details-sc.component';
import { ValidateLateFeeScComponent } from './validate-late-fee-sc/validate-late-fee-sc.component';
import { ValidateLegalEntityScComponent } from './validate-legal-entity-sc/validate-legal-entity-sc.component';
import { ValidateMofPaymentDetailsScComponent } from './validate-mof-payment-details-sc/validate-mof-payment-details-sc.component';
import { ValidateOwnerScComponent } from './validate-owner-sc/validate-owner-sc.component';

export const CHANGE_ESTABLISHMENT_VALIDATOR_COMPONENTS = [
  ValidateBasicDetailsScComponent,
  ValidateIdentifierDetailsScComponent,
  ValidateBankDetailsScComponent,
  ValidateOwnerScComponent,
  ValidateContactDetailsScComponent,
  ValidateAddressDetailsScComponent,
  ValidateLegalEntityScComponent,
  ValidateLateFeeScComponent,
  ValidateMofPaymentDetailsScComponent
];

export * from './validate-address-details-sc/validate-address-details-sc.component';
export * from './validate-bank-details-sc/validate-bank-details-sc.component';
export * from './validate-basic-details-sc/validate-basic-details-sc.component';
export * from './validate-contact-details-sc/validate-contact-details-sc.component';
export * from './validate-identifier-details-sc/validate-identifier-details-sc.component';
export * from './validate-late-fee-sc/validate-late-fee-sc.component';
export * from './validate-legal-entity-sc/validate-legal-entity-sc.component';
export * from './validate-owner-sc/validate-owner-sc.component';
export * from './validate-mof-payment-details-sc/validate-mof-payment-details-sc.component';
