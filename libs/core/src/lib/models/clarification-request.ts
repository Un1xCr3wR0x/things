/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';
export class ClarificationRequest {
  auditNo: number;
  claimNos: number[];
  comments: string;
  documents?: BilingualText[];
  invoiceId: number;
  referenceNo: number;
  serviceIds: number[];
}
