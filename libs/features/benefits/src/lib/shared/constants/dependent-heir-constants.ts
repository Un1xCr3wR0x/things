/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { EventsConstants } from './events-constants';
import { HeirEligibilityStatus } from '../enum';

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

  public static get notEligibleString() {
    const bilingualText = this.notEligible();
    return bilingualText.english;
  }

  public static eligibleForBenefit() {
    return EventsConstants.setBilingualText(HeirEligibilityStatus.ELIGIBLE_FOR_BENEFIT, 'مؤهل');
  }

  public static eligibleForBackdatedBenefit() {
    return EventsConstants.setBilingualText(HeirEligibilityStatus.ELIGIBLE_FOR_BACKDATED, 'مؤهل عن فترة سابقة');
  }

  public static notEligibleBenefit() {
    return EventsConstants.setBilingualText(HeirEligibilityStatus.NOT_ELIGIBILE_BACKDATED, 'غير مؤهل');
  }
  public static get Death() {
    return 'Death';
  }

  public static get Birth() {
    return "Born after father's death";
  }

  public static get SonBilingual() {
    return {
      english: 'Son',
      arabic: 'ابن'
    };
  }

  public static get DaughterBilingual() {
    return {
      english: 'Daughter',
      arabic: 'ابنة'
    };
  }

  public static get Son() {
    return {
      sequence: 1,
      code: 1004,
      value: this.SonBilingual
    };
  }

  public static get Daughter() {
    return {
      sequence: 1,
      code: 1005,
      value: this.DaughterBilingual
    };
  }

  public static get MaleBilingual() {
    return {
      arabic: 'ذكر',
      english: 'Male'
    };
  }

  public static get FeMaleBilingual() {
    return { arabic: 'انثى', english: 'Female' };
  }

  public static get WifeBilingual() {
    return {
      english: 'Wife',
      arabic: 'زوجه'
    };
  }
}
