/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class SanedConstants {
  public static get SUSPENDED(): BilingualText {
    return { arabic: 'إيقاف المنفعة', english: 'Suspended' };
  }

  public static get STOPPED(): BilingualText {
    return { arabic: 'موقوف', english: 'Stopped' };
  }

  public static get REACTIVATE(): BilingualText {
    return { arabic: 'Reactivated', english: 'Reactivated' };
  }

  public static get ACTIVE(): BilingualText {
    return { arabic: 'يصرف,', english: 'Active' };
  }
}
