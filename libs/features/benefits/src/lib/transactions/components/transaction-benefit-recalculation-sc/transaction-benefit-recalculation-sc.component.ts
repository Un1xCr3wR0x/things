import { Component, Inject, OnInit } from '@angular/core';
import {
  AlertService,
  BilingualText,
  DocumentItem,
  LanguageToken,
  Transaction,
  TransactionService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnt-transaction-benefit-recalculation-sc',
  templateUrl: './transaction-benefit-recalculation-sc.component.html',
  styleUrls: ['./transaction-benefit-recalculation-sc.component.scss']
})
export class TransactionBenefitRecalculationScComponent implements OnInit {
  transaction: Transaction;
  lang = 'en';
  transactionId: number;
  channel: BilingualText;
  sin: number;
  businessId: number;
  documents: DocumentItem[];
  referenceNumber: number;
  benefitRequestId: number;
  requestId: number;
  transactionName: string;
  transactionType: string;
  transactionKey: string;
  reqList: DocumentItem[];

  constructor(
    readonly alertService: AlertService,
    readonly transactionService: TransactionService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    this.transactionId = this.transaction.transactionId;
    this.getDocumentRelatedValues();
  }

  getDocumentRelatedValues() {
    this.channel = this.transaction.channel;
    this.referenceNumber = this.transaction.transactionRefNo;
    this.transactionId = this.transaction.transactionId;
    this.sin = this.transaction.params.SIN;
    this.requestId = this.transaction.params.BENEFIT_REQUEST_ID;
    this.businessId = this.transaction.params.BUSINESS_ID;
  }
}
