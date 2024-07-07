/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { TransferItem } from './transfer-item';

export class TransferContributorPayload {
  editFlow: boolean = undefined;
  transferTo: number = undefined;
  requestId: number = undefined;
  transferAll: boolean = undefined;
  transferItem: TransferItem[] = [];
  comments: string = undefined;
  uuid?: string;
}
