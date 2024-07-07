/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';
import { Channel } from '../enums';
import { TransactionType } from '../enums/transaction-type';

/**
 * Model Lov(Lookup Value) used as response type for lookup APIs such as country, currency, etc.
 *
 * @export
 * @class Lov
 */
export class Lov {
  value: BilingualText = new BilingualText();
  code?: number = undefined;
  sequence: number = undefined;
  items?: Lov[] = [];
  disabled? = false;
  channelType?: Channel=null;
  display? = false ;
  transactionId? : TransactionType=null;
  bankName?: BilingualText = new BilingualText();
  resourceName?: string;
  swimlaneRole?: string;
}
