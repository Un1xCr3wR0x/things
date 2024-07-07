/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject } from '@angular/core';
import {
  DocumentService,
  RouterDataToken,
  RouterData,
  scrollToTop,
  AlertService,
  LovList,
  LookupService,
  DocumentItem,
  WorkflowService,
  TransactionReferenceData,
  BilingualText,
  TransactionService,
  Transaction
} from '@gosi-ui/core';
import {
  CreditBalanceDetails,
  CreditRefundDetails,
  VicCreditRefundIbanDetails,
  VicContributorDetails
} from '../../../../shared/models';

import { BillingRoutingService, CreditManagementService } from '../../../../shared/services';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { throwError, Observable, noop } from 'rxjs';

import { Router } from '@angular/router';
import { BillingConstants } from '../../../../shared/constants';

@Component({
  selector: 'blg-credit-refund-vic-view-sc',
  templateUrl: './credit-refund-vic-view-sc.component.html',
  styleUrls: ['./credit-refund-vic-view-sc.component.scss']
})
export class CreditRefundVicViewScComponent implements OnInit {
  //Local variables

  documents: DocumentItem[];
  requestNo: number;
  vicCreditBalanceDetails: CreditRefundDetails;
  bankName: BilingualText;
  transactionNumber: number;
  contributorDetails: VicContributorDetails = new VicContributorDetails();
  comments: TransactionReferenceData[] = [];

  referenceNumber: number;
  rejectHeadingVic: string;
  returnHeadingVic: string;
  sin: number;
  isGOL: boolean;
  vicCreditRefundIbanDetails: VicCreditRefundIbanDetails;
  vicAccountDetails: CreditBalanceDetails;
  iscreditRefund = true;
  transaction: Transaction;
  refNo: number;
  constructor(
    readonly alertService: AlertService,
    readonly billingRoutingService: BillingRoutingService,
    readonly creditManagementService: CreditManagementService,
    readonly router: Router,
    readonly transactionService: TransactionService,
    private lookUpService: LookupService,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService
  ) {}

  /** This method is to initialize the component. */
  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.sin = this.transaction?.params?.SIN;
      this.requestNo = this.transaction?.params?.CREDIT_REQUEST_NUMBER;
      this.refNo = this.transaction?.transactionRefNo;
    }
    scrollToTop();
    this.getVicCreditKeys();
    if (this.sin) this.getDataForVicRefundView();
  }
  getDataForVicRefundView(): void {
    this.creditManagementService
      .getContirbutorDetails(this.sin)
      .pipe(
        tap(res => {
          this.contributorDetails = res;
          this.getVicCreditRefundAmount(this.sin, this.requestNo);
        }),
        switchMap(() => {
          return this.getVicDocuments();
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          this.handleErrorForVic(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  /** Method to read keys from token. */
  getVicCreditKeys(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.requestNo = payload.requestId ? Number(payload.requestId) : null;
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.sin = payload.socialInsuranceNo ? Number(payload.socialInsuranceNo) : null;
      this.isGOL = payload.channel === 'gosi-online' ? true : false;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }
  /** Method to get credit refunded amount. */
  getVicCreditRefundAmount(sin: number, requestNo: number) {
    this.creditManagementService.getVicCreditRefundAmountDetails(sin, requestNo).subscribe(
      val => {
        this.vicCreditBalanceDetails = val;
        this.getVicIbanDetails(this.vicCreditBalanceDetails?.iban);
      },
      errs => {
        this.alertService.showError(errs.error.message);
      }
    );
  }
  /**----Method to get contributor IBAN details */
  getVicIbanDetails(iBanCode: string) {
    this.lookUpService.getBankForIban(iBanCode?.slice(4, 6)).subscribe(
      res => {
        this.bankName = res.items[0]?.value;
      },
      err => this.handleErrorForVic(err)
    );
  }
  /** Method to get documents. */
  getVicDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.CREDIT_REFUND_VIC_ID,
        BillingConstants.CREDIT_REFUND_VIC_TRANSACTION_TYPE,
        this.sin,
        this.refNo
      )
      .pipe(tap(resp => (this.documents = resp.filter(items => items.documentContent !== null))));
  }
  /** Method to handle error. */
  handleErrorForVic(error) {
    this.alertService.showError(error.error.message);
  }
}
