/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ApprovalOneComponent } from './approval-one/approval-one.component';
import { ApprovalTwoComponent } from './approval-two/approval-two.component';
import { ReviewerComponent } from './reviewer/reviewer.component';
import { AppealClerkComponent } from './appeal-clerk/appeal-clerk.component';
import { LegalManagerComponent } from './legal-manager/legal-manager.component';
import { ExecutorComponent } from './executor/executor.component';

export const FIRST_LEVEL_APPEAL_FORMS = [
  ReviewerComponent,
  ApprovalOneComponent,
  ApprovalTwoComponent,
  AppealClerkComponent,
  LegalManagerComponent,
  ExecutorComponent
];

export * from './reviewer/reviewer.component';
export * from './approval-one/approval-one.component';
export * from './approval-two/approval-two.component';
export * from './appeal-clerk/appeal-clerk.component';
export * from './executor/executor.component';
