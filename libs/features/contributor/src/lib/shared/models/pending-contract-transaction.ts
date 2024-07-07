/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PendingContractTransaction {
  contractTransactionId: number = undefined;
  contractTransactionType: string = undefined;
  draft:boolean = false;
  contractId?: number;
}
