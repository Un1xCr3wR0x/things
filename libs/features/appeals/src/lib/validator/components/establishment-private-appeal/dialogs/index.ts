/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AssignToSpecialistComponent } from './assign-to-specialist/assign-to-specialist.component';
import { ReturnToClerkComponent } from './return-to-clerk/return-to-clerk.component';
import { ReturnToUserDialogComponent } from './return-to-user-dialog/return-to-user-dialog.component';
import { SecretaryConfirmationComponent } from './secretary-confirmation/secretary-confirmation.component';

export const EMPLOYEE_VALIDATOR_DIALOGS = [
  ReturnToUserDialogComponent,
  AssignToSpecialistComponent,
  ReturnToClerkComponent,
  SecretaryConfirmationComponent
];

export * from './return-to-user-dialog/return-to-user-dialog.component';
export * from './assign-to-specialist/assign-to-specialist.component';
export * from './return-to-clerk/return-to-clerk.component';
export * from './secretary-confirmation/secretary-confirmation.component';
