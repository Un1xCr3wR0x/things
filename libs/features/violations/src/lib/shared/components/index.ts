/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ContributorsDetailsDcComponent } from './contributors-details-dc/contributors-details-dc.component';
import { DocumentUploadDcComponent } from './document-upload-dc/document-upload-dc.component';
import { ExcludedContributorDcComponent } from './excluded-contributor-dc/excluded-contributor-dc.component';
import { PenaltyDetailsDcComponent } from './penalty-details-dc/penalty-details-dc.component';
import { PreviousContributorViolationsScComponent } from './previous-contributor-violations-sc/previous-contributor-violations-sc.component';
import { PreviousEstablishmentViolationsScComponent } from './previous-establishment-violations-sc/previous-establishment-violations-sc.component';
import { VcApproveRestrictionDcComponent } from './vc-approve-restriction-dc/vc-approve-restriction-dc.component';
export const SHARED_VIOLATION_COMPONENTS = [
  DocumentUploadDcComponent,
  ContributorsDetailsDcComponent,
  ExcludedContributorDcComponent,
  PenaltyDetailsDcComponent,
  VcApproveRestrictionDcComponent,
  PreviousContributorViolationsScComponent,
  PreviousEstablishmentViolationsScComponent
];

export * from './base';
export * from './document-upload-dc/document-upload-dc.component';
export * from './contributors-details-dc/contributors-details-dc.component';
export * from './excluded-contributor-dc/excluded-contributor-dc.component';
export * from './penalty-details-dc/penalty-details-dc.component';
export * from './previous-contributor-violations-sc/previous-contributor-violations-sc.component';
export * from './previous-establishment-violations-sc/previous-establishment-violations-sc.component';
export * from './vc-approve-restriction-dc/vc-approve-restriction-dc.component';
