/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export function TransactionMixin(superClass) {
  return class extends superClass {
    reRoute: string;
    private _hasCompleted = false;
    constructor(...args) {
      super(...args);
    }
    setTransactionComplete() {
      this._hasCompleted = true;
    }
    get hasCompleted() {
      return this._hasCompleted;
    }
  };
}
