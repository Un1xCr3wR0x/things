/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export interface TransactionInterface {
  hasCompleted: boolean;
  reRoute: string; //navigate to the route when clicked on some other links
  setTransactionComplete();
  askForCancel();
}
