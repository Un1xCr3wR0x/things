/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  BaseComponent,
  BilingualText,
  convertToYYYYMMDD,
  endOfMonth,
  LookupService,
  LovList
} from '@gosi-ui/core';
import moment from 'moment';
import { Observable, Observer } from 'rxjs';
import { noop } from 'rxjs/internal/util/noop';
import { BillingConstants } from '../../constants/billing-constants';
import {
  BillDetails,
  ChangeEngagement,
  CreditRefundDetails,
  DetailedBillViolationDetails,
  ItemizedCreditRefund,
  ItemizedInstallmentWrapper,
  ItemizedRejectedOHWrapper,
  RequestList
} from '../../models';
import { CreditTransferWrapper } from '../../models/credit-tansfer-wrapper';
import { ViolationAdjustmentDetails } from '../../models/violation-adjustment-details';
import { BillingRoutingService, DetailedBillService, ReportStatementService } from '../../services';

@Directive()
export abstract class VicRefundCreditBalanceBaseScComponent extends BaseComponent {
  constructor(
    readonly alertService: AlertService,
    readonly routingService: BillingRoutingService,
    readonly lookupService: LookupService
  ) {
    super();
  }
  isBankTransfer = true;
  creditRefundDetails: CreditRefundDetails;
  iscreditRetained = false;
  isRefundCreditBalance = false;
  vicCreditRefundMainForm: FormGroup = new FormGroup({});
  documentTransactionIdVic = BillingConstants.VIC_CREDIT_REFUND_DOCUMENT_TRANSACTION_ID;
  userRoleValues: string[] = [];
  transferModeList$: Observable<LovList>;
  creditRetainedList$: Observable<LovList>;
  bankNameFromApi: BilingualText;

  navBackToInbox() {
    this.routingService.navigateToInbox();
  }
  getBankTranser(val) {
    this.isBankTransfer = val;
  }
  getCreditRetainedValue(res) {
    this.iscreditRetained = res;
  }
  onGetBankName(iban) {
    this.lookupService.getBankForIban(iban.slice(4, 6)).subscribe(
      res => (this.bankNameFromApi = res.items[0]?.value),
      err => this.showErrorMessage(err)
    );
  }
  showErrorMessage(err) {
    this.alertService.showError(err.error.message, err.error.details);
  }
}
