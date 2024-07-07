import { GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ReimbursementRequestDetails {
  emailId: string;
  comments?: string;
  roleid?: string;
  userId?: string;
  actionedDate?: GosiCalendar;
  isTreatmentWithinSaudiArabia: boolean;
  isdCode: string;
  vatAmount?: number;
  invoiceAmount?: number;
  invoiceDate?: Date;
  mobileNo: string;
  payableTo: number;
  requestDate: string;
  hospital: {
    arabic: string;
    english: string;
  };
  status: {
    arabic: string;
    english: string;
  };
  supportingDocuments: [
    {
      contentId: string;
      documentType: number;
    }
  ];
}
