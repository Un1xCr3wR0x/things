/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AuthorizedPersonDcComponent } from './authorized-person-dc/authorized-person-dc.component';
import { BasicDetailsDcComponent } from './basic-details-dc/basic-details-dc.component';
import { CardLabelDcComponent } from './card-label-dc/card-label-dc.component';
import { ComplianceModalDcComponent } from './compliance-modal-dc/compliance-modal-dc.component';
import { EmployeeListDcComponent } from './employee-list-dc/employee-list-dc.component';
import { EstablishmentDetailsDcComponent } from './establishment-details-dc/establishment-details-dc.component';
import { ESTABLSIHMENT_DOCUMENTS } from './establishment-documents';
import { EstablishmentGroupProfileScComponent } from './establishment-group-profile-sc/establishment-group-profile-sc.component';
import { EstablishmentProfileScComponent } from './establishment-profile-sc/establishment-profile-sc.component';
import { GroupActionsDcComponent } from './group-actions-dc/group-actions-dc.component';
import { NameDetailsDcComponent } from './name-details-dc/name-details-dc.component';
import { ProfileTabsetDcComponent } from './profile-tabset-dc/profile-tabset-dc.component';
import { RelationshipManagerDcComponent } from './relationship-manager-dc/relationship-manager-dc.component';
import { TerminateStatusDcComponent } from './terminate-status-dc/terminate-status-dc.component';
export const PROFILE_COMPONENTS = [
  EstablishmentGroupProfileScComponent,
  EstablishmentProfileScComponent,
  EstablishmentDetailsDcComponent,
  BasicDetailsDcComponent,
  EmployeeListDcComponent,
  GroupActionsDcComponent,
  ComplianceModalDcComponent,
  CardLabelDcComponent,
  TerminateStatusDcComponent,
  NameDetailsDcComponent,
  AuthorizedPersonDcComponent,
  ProfileTabsetDcComponent,
  RelationshipManagerDcComponent,
  ESTABLSIHMENT_DOCUMENTS
];
export * from './authorized-person-dc/authorized-person-dc.component';
export * from './basic-details-dc/basic-details-dc.component';
export * from './card-label-dc/card-label-dc.component';
export * from './compliance-modal-dc/compliance-modal-dc.component';
export * from './employee-list-dc/employee-list-dc.component';
export * from './establishment-details-dc/establishment-details-dc.component';
export * from './establishment-documents';
export * from './establishment-group-profile-sc/establishment-group-profile-sc.component';
export * from './establishment-profile-sc/establishment-profile-sc.component';
export * from './group-actions-dc/group-actions-dc.component';
export * from './profile-tabset-dc/profile-tabset-dc.component';
export * from './relationship-manager-dc/relationship-manager-dc.component';
export * from './terminate-status-dc/terminate-status-dc.component';
