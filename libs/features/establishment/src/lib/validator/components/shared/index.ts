/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { EstablishmentContentDcComponent } from './establishment-content-dc/establishment-content-dc.component';
import { OwnerDetailsDcComponent } from './owner-details-dc/owner-details-dc.component';
import { OwnerListDcComponent } from './owner-list-dc/owner-list-dc.component';

export const SHARED_VALIDATOR_COMPONENTS = [
  OwnerDetailsDcComponent,
  EstablishmentContentDcComponent,
  OwnerListDcComponent
];

export * from './establishment-content-dc/establishment-content-dc.component';
export * from './owner-details-dc/owner-details-dc.component';
export * from './owner-list-dc/owner-list-dc.component';
