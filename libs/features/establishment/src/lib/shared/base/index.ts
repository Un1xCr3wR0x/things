/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AddEstablishmentSCBaseComponent } from './add-establishment-sc/add-establishment-sc.base-component';
import { ChangeEstablishmentScBaseComponent } from './change-establishment-sc.base-component';
import { DocumentManagementScBaseComponent } from './document-management-sc.base-component';
import { FlagEstablishmentBaseScComponent } from './flag-establishment-sc.base-component';
import { GenerateCertificateScBaseComponent } from './generate-certificate-sc.base-component';
import { ReopenEstablishmentScBaseComponent } from './reopen-establishment-sc.base-component';

export const BASE_COMPONENTS = [
  AddEstablishmentSCBaseComponent,
  ChangeEstablishmentScBaseComponent,
  FlagEstablishmentBaseScComponent,
  GenerateCertificateScBaseComponent,
  DocumentManagementScBaseComponent,
  ReopenEstablishmentScBaseComponent
];

export * from './add-establishment-sc/add-establishment-sc.base-component';
export * from './change-establishment-sc.base-component';
export * from './document-management-sc.base-component';
export * from './generate-certificate-sc.base-component';
export * from './manage-admin-sc.base-component';
export * from './reopen-establishment-sc.base-component';
