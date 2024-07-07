/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormGroup } from '@angular/forms';
import { BankAccount, BilingualText } from '@gosi-ui/core';
import { Adjustment } from './adjustment';
import { AdjustmentDetails } from './adjustment-details';
import { BeneficiaryList, BenefitDetails } from './beneficiary-list';
import { PayeeDetails } from './payee-details';
import { Payment } from './payment';
import { ThirdPartyBankAccount } from './third-party-bank-account';

export class AddData {
  payeeSearchResult: PayeeDetails[];
  totalPayeesCount: number;
  showPayeesList: boolean;
  selectedpayee: PayeeDetails;
  showPayeeSummary: boolean;
  payeeListPageDetails = {
    currentPage: null,
    goToPage: 1
  };
  payeeCurrentBank: BankAccount;
  showBenefitDetails: boolean;
  newBankName: BilingualText;
  csrAdjustmentValues: Adjustment;
  payeeSearchQuery: string;
  csrSelectedpayee: PayeeDetails;
  payeebankName: BilingualText;
  savedBankData?: BankAccount;
}

export class ModifyData {
  enableReactivate?: boolean;
  adjustment: Adjustment;
  csrAdjustmentValues: Adjustment;
}

export class AdjustmentMapModel {
  form: FormGroup;
  isAdd: boolean;
  addData?: AddData;
  modifyData?: ModifyData;
  isSaved: boolean;
  savedAdjustmentData?: Adjustment;
  hasSavedData?: boolean;
  hasModified?: boolean;
}
export class ThirdPartyAdjustmentList {
  currentAdjustment: Adjustment;
  modifiedAdjustment: Adjustment;
  payee: PayeeDetails;
  bank: BilingualText;
  benefit: BenefitDetails;
  isAdd: boolean;
}
export class PaymentList {
  payment: Payment;
  bankName: BilingualText;
}
