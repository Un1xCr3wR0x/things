import { Component, OnInit } from '@angular/core';
import { DocumentItem, DocumentService, Transaction, TransactionService } from '@gosi-ui/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { isDocumentsValid } from '../../../shared';

@Component({
  selector: 'bnt-transaction-disability-assessment-sc',
  templateUrl: './transaction-disability-assessment-sc.component.html',
  styleUrls: ['./transaction-disability-assessment-sc.component.scss']
})
export class TransactionDisabilityAssessmentScComponent implements OnInit {
  payForm: FormGroup;
  transaction: Transaction;
  reqList: DocumentItem[];
  documents: DocumentItem[];

  constructor(
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.payForm = this.fb.group({
      checkBoxFlag: [false]
    });
    this.transaction = this.transactionService.getTransactionDetails();
    this.getTransactionDocuments();
  }

  getTransactionDocuments() {
    this.documentService.getAllDocuments(null, this.transaction?.transactionRefNo).subscribe(docs => {
      this.reqList = docs;
      if (isDocumentsValid(this.reqList)) {
        this.documents = this.reqList;
      }
    });
  }
}
