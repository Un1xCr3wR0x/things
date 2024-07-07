/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class UserProfile {
  preferredLanguage: string = null;
  gosiscp: string = null;
  userreferenceid: number = null;
  mobile: string = null;
  userId: string = null;
  email: string = null;
  longNameArabic: string = null;
  role: UserRole[] = null;
  displayName: string = null;
}

export class UserRole {
  role: string[];
}
