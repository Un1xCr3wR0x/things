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
import { BenefitWageDetail } from './benefit-wage-detail';

export class DependentsDetails {
  amount?: number;
  identifier: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  dependentIdentifier: CommonIdentity | null;
  changeDate: GosiCalendar;
  dependentStatus: BilingualText;
  dependentEventType: BilingualText;
  eligibilityStarted: boolean;
  eligibilityStopped: boolean;
  eventSource?: BilingualText;
  name: BilingualText;
  relation: BilingualText;
  heirStatus?: BilingualText;
  marriageGrantAmount?: number;
  deathGrantAmount?: number;
  otherBenefitAndWage?: BenefitWageDetail;
  benefitStarted?: boolean;
  isOrphan?: boolean;
  addedEvent?: boolean;
  removedEvent?: boolean;
  isDisabilityPresent?: boolean;
}
