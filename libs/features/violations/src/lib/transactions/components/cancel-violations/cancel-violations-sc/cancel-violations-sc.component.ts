import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionService
} from '@gosi-ui/core';
import {
  ChangeViolationValidator,
  TransactionsBaseScComponent,
  ViolationsValidatorService
} from '@gosi-ui/features/violations/lib/shared';
import { DocumentTransactionType } from '../../../../shared/enums';

@Component({
  selector: 'vol-cancel-violations-sc',
  templateUrl: './cancel-violations-sc.component.html',
  styleUrls: ['./cancel-violations-sc.component.scss']
})
export class CancelViolationsScComponent extends TransactionsBaseScComponent implements OnInit {
  violationDetail: ChangeViolationValidator = new ChangeViolationValidator();

  constructor(
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router,
    readonly validatorService: ViolationsValidatorService,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      transactionService,
      alertService,
      documentService,
      routerDataToken,
      router,
      validatorService,
      location,
      appToken
    );

    this.documentTransactionKey = DocumentTransactionType.CANCEL_TRANSACTION_TYPE;
    this.documentTransactionType = DocumentTransactionType.CANCEL_TRANSACTION_TYPE;
  }

  ngOnInit(): void {
    super.getTransactionData();
    if (this.estRegNo && this.violationId) {
      this.transactionDetailsFetch();
      this.getViolationDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  transactionDetailsFetch() {
    this.validatorService.getValidatorViewDetails(this.violationId, this.transactionId).subscribe(res => {
      this.violationDetail = res;
    });
  }
  getViolationDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.violationId,
      this.transactionId
    );
  }
}
