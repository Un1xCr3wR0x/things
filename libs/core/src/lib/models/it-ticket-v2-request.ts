/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ItTicketV2Request {
    type: string = undefined;
    subtype: string = undefined;
    detailDescription: string = undefined;
    attachmentName1: string = undefined;
    attachmentContent1: string = undefined;
    attachmentName2: string = undefined;
    attachmentContent2: string = undefined;
    attachmentName3: string = undefined;
    attachmentContent3: string = undefined;
    service: string = undefined;
    paymentStop: string = 'Yes';
    financialImpact: string = 'Yes';
  }
  