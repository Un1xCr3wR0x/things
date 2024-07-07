/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BilingualText,
  BorderNumber,
  CommonIdentity,
  GosiCalendar,
  Iqama,
  NationalId,
  NIN,
  Passport
} from '@gosi-ui/core';

export class SingleDependent {
  identifier: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  dependentIdentifier: CommonIdentity | null;
  changeDate: GosiCalendar;
  dependentStatus: BilingualText;
  dependentEventType: BilingualText;
  eligibilityStarted: boolean;
  name: BilingualText;
  relation: BilingualText;
}
