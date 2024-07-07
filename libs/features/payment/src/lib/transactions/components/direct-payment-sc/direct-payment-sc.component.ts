/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { TransactionBaseScComponent } from '../../base';
import {
  Transaction,
  DocumentService,
  TransactionService,
  LookupService,
  AlertService,
  LanguageToken,
  RouterDataToken,
  RouterData,
  BilingualText,
  DocumentItem,
  TransactionStatus
} from '@gosi-ui/core';
import { MiscellaneousPaymentRequest, PaymentService } from '../../../shared';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'pmt-direct-payment-sc',
  templateUrl: './direct-payment-sc.component.html',
  styleUrls: ['./direct-payment-sc.component.scss']
})
export class DirectPaymentScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  isIbanVerified = true;
  transactionNumber: number;
  transactionType = 'MISCELLANEOUS_PAYMENT_REQUEST';
  bankName: BilingualText;
  referenceNumber: number;
  transactionId = 'MISCELLANEOUS_PAYMENT';
  validDetails: MiscellaneousPaymentRequest;
  miscPaymentId: number;
  personId: number;
  bankDetails: { bankName; ibanBankAccountNo };
  lang = 'en';
  sin: number;
  isCompletedTransaction = false;
  constructor(
    readonly documentService: DocumentService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly paymentService: PaymentService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {
    super(documentService);
  }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionNumber = this.transaction.transactionId;
      this.miscPaymentId = this.transaction.params.MISC_PAYMENT_ID;
      this.personId = parseInt(this.transaction.params.IDENTIFIER, 10);
      this.sin = this.transaction.sin ? this.transaction?.sin : this.transaction?.params?.SIN;
      this.isCompletedTransaction = this.transaction?.status?.english?.toUpperCase() === TransactionStatus.COMPLETED;
      this.getContributorDetail();
      this.getRequiredDocuments();
    }
  }
  /**
   * Method to navigate to contributor profile
   */
  navigateToContributorDetails() {
    // this.router.navigate([`/home/profile/individual/internal/${this.sin}`]);
  }
  /** method to get Contributor details */
  getContributorDetail() {
    this.paymentService.validatorDetails(this.personId, this.miscPaymentId, this.sin).subscribe(data => {
      this.validDetails = data;
      this.bankDetails = this.validDetails?.bankAccountList[0];
      this.paymentService.bankDetails = this.bankDetails;
    });
  }
  getRequiredDocuments() {
    this.documentService.getRequiredDocuments(this.transactionId, this.transactionType).subscribe(res => {
      this.documents = res;
      this.documents.forEach(doc => {
        this.refreshDocument(doc);
      });
    });
  }
  refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(doc, this.miscPaymentId, this.transactionId, this.transactionType, this.referenceNumber)
        .subscribe(res => {
          doc = res;
        });
    }
  }
}
