/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class BenefitWageDetail {
  benefitDetailsList: BenefitDetailsList[] = [];
  totalBenefitAmount: number;
  totalWageAmount: number;
  wageDetailsList: WageDetailsList[] = [];
}

export class BenefitDetailsList {
  benefitRequestId: number;
  benefitAmount: number;
  benefitStatus: BilingualText;
  benefitType: BilingualText;
  contributorNin: number;
  relationship: BilingualText;
  sin: number;
}

export class WageDetailsList {
  amount: number;
  endDate: GosiCalendar;
  startDate: GosiCalendar;
}

// export class BenefitAndWageDetails{
//     benefitsAndWages: BenefitWageDetail;
//     personId: number;
//     dateFrom: GosiCalendar;
//     dateTo: GosiCalendar;
//     name: BilingualText;
// }
