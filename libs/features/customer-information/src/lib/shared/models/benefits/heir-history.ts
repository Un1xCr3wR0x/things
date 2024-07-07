/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, BorderNumber, GosiCalendar, Iqama, NationalId, NIN, Passport } from '@gosi-ui/core';
import { BenefitWageDetail } from './benefit-wage-detail';

export class HeirHistory {
  dateFrom: GosiCalendar;
  dateTo: GosiCalendar;
  statusDate: GosiCalendar;
  heirDetails: HeirHistoryDetails[];
  heirHistoryDetails?: HeirHistoryDetails;
}

export class HeirHistoryDetails {
  amount: number;
  benefitStarted: boolean;
  changeDate: GosiCalendar;
  eventType: BilingualText;
  eventSource: BilingualText;
  heirStatus: BilingualText;
  identifier: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  // identifier: CommonIdentity | null;
  modificationReason: BilingualText;
  motherId: number;
  marriageGrantAmount?: number;
  deathGrantAmount?: number;
  name: BilingualText;
  nin: number;
  personId: number;
  relationship: BilingualText;
  startDate: GosiCalendar;
  status: BilingualText;
  statusDate: GosiCalendar;
  stopDate: GosiCalendar;
  otherBenefitAndWage: BenefitWageDetail;
}

export class EachHeirDetail {
  dateFrom: GosiCalendar;
  dateTo: GosiCalendar;
  heirDetails: HeirHistoryDetails;
}

export class ParamId {
  sin?: number;
  benefitRequestId?: number;
  transactionTraceId?: number;
}
