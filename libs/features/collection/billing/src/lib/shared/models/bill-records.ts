/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AdjustmentTotal } from './adjustment-total';
import { AdjustmentTypeDetails } from './adjustment-type-details';
import { AdjustmentWageDetails } from './adjustment-wage-details';
import { DebitCreditDetails } from './debit-credit-details';
import { MonthReceipt } from './month-receipt';
import { RecordDetails } from './record-details';

export class BillRecords {
  elements:
    | RecordDetails[]
    | DebitCreditDetails
    | MonthReceipt[]
    | AdjustmentTotal[]
    | AdjustmentTypeDetails[]
    | AdjustmentWageDetails[];
}
