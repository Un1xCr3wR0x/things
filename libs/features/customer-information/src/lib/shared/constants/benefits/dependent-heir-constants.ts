/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { EventsConstants } from './events-constants';

export class DependentHeirConstants {
  public static eligible() {
    return EventsConstants.setBilingualText('Eligible', 'مؤهل');
  }

  public static eligibleForBackdated() {
    return EventsConstants.setBilingualText('Eligible for Backdated', 'مؤهل عن فترة سابقة');
  }
  public static notEligible() {
    return EventsConstants.setBilingualText('Not Eligible', 'غير مؤهل');
  }

  public static get eligibleForBackdatedString() {
    const bilingualText = this.eligibleForBackdated();
    return bilingualText.english;
  }
  public static get eligibleString() {
    const bilingualText = this.eligible();
    return bilingualText.english;
  }
}
