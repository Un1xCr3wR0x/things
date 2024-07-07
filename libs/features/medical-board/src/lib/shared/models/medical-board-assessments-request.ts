import { BilingualText, GosiCalendar, Name } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class MedicalBoardAssessmentRequest {
  assessmentDate: string;
  status: BilingualText[];
  assessmentId: number;
  assessmentType: BilingualText[];
  identifier: number;
  medicalBoardType: BilingualText[];
  sessionPeriodFrom: Date = undefined;
  sessionPeriodTo: Date = undefined;
  pageNo: number = undefined;
  pageSize: number = undefined;
  searchKey: string = undefined;
  sortOrder: string = undefined;
}

export class MBPaymentHistory {
  paymentDetails: MBPaymentDetails[];
  totalCount: number;
}
export class MBPaymentDetails {
  name: Name;
  sessionId: number;
  sessionDate: GosiCalendar;
  sessionType: BilingualText;
  fieldOfficeCode: BilingualText;
  amount: number;
  paymentDate: GosiCalendar;
  status: BilingualText;
  nationalIdType: number;
  nationalId: number;
}
export class PaymentHistoryRequest {
  endDate?: string = undefined;
  startDate?: string = undefined;
  fieldOffice?: BilingualText[] = [];
  memberType?: string;
  pageNo?: number = undefined;
  pageSize?: number = undefined;
  paymentStatus?: BilingualText[] = [];
  searchKey?: string = undefined;
  sessionType?: string = undefined;
  totalCount?: number = undefined;
}
