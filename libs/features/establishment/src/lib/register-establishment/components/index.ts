/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { EstablishmentInfoDcComponent } from './establishment-info-dc/establishment-info-dc.component';
import { EstablishmentSearchScComponent } from './establishment-search-sc/establishment-search-sc.component';
import { EstablishmentTypeDcComponent } from './establishment-type-dc/establishment-type-dc.component';
import { RegisterEstablishmentScComponent } from './register-establishment-sc/register-establishment-sc.component';
import { VerifyEstablishmentDCComponent } from './verify-establishment-dc/verify-establishment-dc.component';
import { VerifyGccEstablishmentDcComponent } from './verify-gcc-establishment-dc/verify-gcc-establishment-dc.component';

export const REGISTER_COMPONENTS = [
  RegisterEstablishmentScComponent,
  VerifyGccEstablishmentDcComponent,
  EstablishmentInfoDcComponent,
  EstablishmentTypeDcComponent,
  VerifyEstablishmentDCComponent,
  EstablishmentSearchScComponent
];

export * from './establishment-info-dc/establishment-info-dc.component';
export * from './establishment-search-sc/establishment-search-sc.component';
export * from './establishment-type-dc/establishment-type-dc.component';
export * from './register-establishment-sc/register-establishment-sc.component';
export * from './verify-establishment-dc/verify-establishment-dc.component';
export * from './verify-gcc-establishment-dc/verify-gcc-establishment-dc.component';
