/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TransferDetail } from './transfer-detail';

export class CreditTransferWrapper {
  numberOfRecords: number;
  totalAmount: number;
  transferDetails: TransferDetail[];
}
