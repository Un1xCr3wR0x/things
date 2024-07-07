/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar, NIN, Iqama, NationalId, Passport, BorderNumber } from '@gosi-ui/core';

export class BenefitPaymentsDetails {
  authorizedPersonIdentifier = [];
  authorizedPersonName: BilingualText;
  bankName: BilingualText;
  finalBenefitAmount: number;
  iban: string;
  lastUpdatedOn: GosiCalendar;
  payeeType: BilingualText;
  paymentMethod: BilingualText;
}
