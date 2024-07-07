/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { UserPreferencesScComponent } from './user-preferences-sc/user-preferences-sc.component';
import { ChangePasswordScComponent } from './change-password-sc/change-password-sc.component';
import { PasswordInfoDcComponent } from './change-password-sc/password-info-dc/password-info-dc.component';
import { UpdateUserContactScComponent} from './update-user-contact-sc/update-user-contact-sc.component';
export const USER_ACTIVITY_COMPONENTS = [
  ChangePasswordScComponent,
  UserPreferencesScComponent,
  PasswordInfoDcComponent,
  UpdateUserContactScComponent,
];

export * from './change-password-sc/change-password-sc.component';
export * from './user-preferences-sc/user-preferences-sc.component';
export * from './change-password-sc/password-info-dc/password-info-dc.component';
export * from './update-user-contact-sc/update-user-contact-sc.component';
