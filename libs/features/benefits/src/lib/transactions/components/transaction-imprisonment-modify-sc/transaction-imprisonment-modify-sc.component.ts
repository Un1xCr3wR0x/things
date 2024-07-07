import { Component, Inject, OnInit } from '@angular/core';
import {
  Channel,
  DocumentItem,
  DocumentService,
  LanguageToken,
  Transaction,
  TransactionService,
  TransactionStatus
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BenefitDocumentService, UITransactionType } from '../../../shared';

@Component({
  selector: 'bnt-transaction-imprisonment-modify-sc',
  templateUrl: './transaction-imprisonment-modify-sc.component.html',
  styleUrls: ['./transaction-imprisonment-modify-sc.component.scss']
})
export class TransactionImprisonmentModifyScComponent implements OnInit {
  //local variables
  lang = 'en';
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  sin: number;
  requestId: number;
  channel = 'field-office';
  documents: DocumentItem[];
  isRejectedTransaction = false;

  constructor(
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.requestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.sin = this.transaction.params.SIN;
      this.isRejectedTransaction = this.transaction.stepStatus?.english.toUpperCase() === TransactionStatus.REJECTED;
    }
    if (this.transaction?.status?.english === 'Completed') {
      this.getTransactionCompletedDocuments();
    } else {
      this.fetchDocumentsForImprisonmentModify();
    }
  }

  /**to fetch documents */
  fetchDocumentsForImprisonmentModify() {
    const transactionKey = UITransactionType.REQUEST_MODIFY_IMPRISONMENT_TRANSACTION;
    const transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.benefitDocumentService.getUploadedDocuments(this.requestId, transactionKey, transactionType).subscribe(res => {
      this.documents = res;
    });
  }

  getTransactionCompletedDocuments() {
    this.documentService.getAllDocuments(null, this.referenceNumber).subscribe(docs => {
      this.documents = docs;
    });
  }
}
