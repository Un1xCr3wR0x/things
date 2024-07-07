/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { EstablishmentAdminDetailsDcComponent } from './establishment-admin-details-dc/establishment-admin-details-dc.component';
import { EstablishmentDetailsDcComponent } from './establishment-details-dc/establishment-details-dc.component';
import { EstablishmentPaymentDetailsDcComponent } from './establishment-payment-details-dc/establishment-payment-details-dc.component';
import { EstablishmentScComponent } from './establishment-sc/establishment-sc.component';
import { EstablishmentOwnerDetailsDcComponent } from './establishment-owner-details-dc/establishment-owner-details-dc.component';

export const ADD_ESTABLISMENT_VALIDATOR_COMPONENTS = [
  EstablishmentAdminDetailsDcComponent,
  EstablishmentScComponent,
  EstablishmentDetailsDcComponent,
  EstablishmentPaymentDetailsDcComponent,
  EstablishmentOwnerDetailsDcComponent
];

export * from './establishment-admin-details-dc/establishment-admin-details-dc.component';
export * from './establishment-details-dc/establishment-details-dc.component';
export * from './establishment-payment-details-dc/establishment-payment-details-dc.component';
export * from './establishment-sc/establishment-sc.component';
export * from './establishment-owner-details-dc/establishment-owner-details-dc.component';
