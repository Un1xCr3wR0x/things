/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AddressCardDcComponent } from './address-card-dc/address-card-dc.component';
import { BankDetailsCardDcComponent } from './bank-details-card-dc/bank-details-card-dc.component';
import { BankFormDcComponent } from './bank-form-dc/bank-form-dc.component';
import { ChangePersonScComponent } from './change-person-sc/change-person-sc.component';
import { ContactCardDcComponent } from './contact-card-dc/contact-card-dc.component';
import { EducationCardDcComponent } from './education-card-dc/education-card-dc.component';
import { EducationFormDcComponent } from './education-form-dc/education-form-dc.component';

export const CHANGE_PERSON_COMPONENTS = [
  EducationFormDcComponent,
  BankFormDcComponent,
  ContactCardDcComponent,
  ChangePersonScComponent,
  AddressCardDcComponent,
  EducationCardDcComponent,
  BankDetailsCardDcComponent
];

export * from './address-card-dc/address-card-dc.component';
export * from './bank-details-card-dc/bank-details-card-dc.component';
export * from './bank-form-dc/bank-form-dc.component';
export * from './change-person-sc/change-person-sc.component';
export * from './contact-card-dc/contact-card-dc.component';
export * from './education-card-dc/education-card-dc.component';
export * from './education-form-dc/education-form-dc.component';
