import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class SamaStatusConstants {
  public static get VERIFIED(): BilingualText {
    const status = {
      arabic: 'تم التحقق',
      english: 'Verified'
    };
    return status;
  }
  public static get NO_OF_OTP_RETRIES() {
    return 3;
  }
  public static get VERIFICATION_IN_PROGRESS(): BilingualText {
    const status = {
      arabic: 'تم التحقق من الحساب المصرفي',  // Defect 537067
      english: 'Bank Account Verified'
    };
    return status;
  }

  public static get VERIFICATION_FAILED(): BilingualText {
    const status = {
      arabic: 'فشل التحقق',
      english: 'Verification failed'
    };
    return status;
  }

  public static get EXPIRED(): BilingualText {
    const status = {
      arabic: 'انتهت صلاحية التحقق',
      english: 'Expired'
    };
    return status;
  }

  public static get RE_VERIFICATION_REQUIRED(): BilingualText {
    const status = {
      arabic: 'طلب إعادة التحقق',
      english: ' Re-verification required'
    };
    return status;
  }
}
