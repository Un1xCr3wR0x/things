import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  Autobind,
  DocumentService,
  Establishment,
  RouterConstants,
  TransactionService
} from '@gosi-ui/core';
import {
  AddEstablishmentService,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentService,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-establishment-payment-type-sc',
  templateUrl: './establishment-payment-type-sc.component.html',
  styleUrls: ['./establishment-payment-type-sc.component.scss']
})
export class EstablishmentPaymentTypeScComponent extends TransactionsBaseScComponent implements OnInit {
  isPayment: boolean;
  constructor(
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    readonly location: Location,
    readonly router: Router,
    readonly addEstService: AddEstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
    this.documentTransactionKey = DocumentTransactionTypeEnum.PAYMENT_TYPE_CHANGE_ESTABLISHMENT;
    this.documentTransactionType = DocumentTransactionTypeEnum.PAYMENT_TYPE_CHANGE_ESTABLISHMENT;
    this.tnxId = EstablishmentTransEnum.PAYMENT_TYPE_UPDATE;
  }

  ngOnInit(): void {
    this.getTransactionData();

    if (this.estRegNo) {
      this.intialiseView(this.estRegNo);
      this.getPaymentData();
      this.getBasicDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  //////////////////////////////added code ///////////////////////
  getPaymentData() {
    if (!this.isTransactionCompleted) {
      this.getPaymentFromTransient();
    } else {
      this.getPaymentForCompletedData();
    }
  }
  getPaymentForCompletedData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedPaymentData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  getPaymentFromTransient() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedPaymentData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  @Autobind
  getCurrentAndModifiedPaymentData(paymentData: [Establishment, Establishment]) {
    const [estOldData, estNewData] = paymentData;
    this.establishment = estOldData;
    this.estToValidate = estNewData;
    if (this.establishment.establishmentAccount.paymentType === this.estToValidate.establishmentAccount.paymentType) {
      this.isPayment = true;
    }
  }

  getBasicDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
}
