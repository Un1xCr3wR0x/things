import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  Autobind,
  DocumentService,
  RouterConstants,
  TransactionService,
  Establishment
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
  selector: 'est-establishment-late-fee-sc',
  templateUrl: './establishment-late-fee-sc.component.html',
  styleUrls: ['./establishment-late-fee-sc.component.scss']
})
export class EstablishmentLateFeeScComponent extends TransactionsBaseScComponent implements OnInit {
  isLateFee: boolean;

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
    this.documentTransactionKey = DocumentTransactionTypeEnum.MODIFY_LATE_FEE;
    this.documentTransactionType = DocumentTransactionTypeEnum.MODIFY_LATE_FEE;
    this.tnxId = EstablishmentTransEnum.LATE_FEE_UPDATE;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.intialiseView(this.estRegNo);
      this.getLateFeeData();
      this.getLateFeeDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getLateFeeData() {
    if (!this.isTransactionCompleted) {
      this.getLateFeeFromTransient();
    } else {
      this.getLateFeeForCompletedData();
    }
  }

  getLateFeeForCompletedData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedLateFee))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  getLateFeeFromTransient() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedLateFee))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  @Autobind
  getCurrentAndModifiedLateFee(LateFee: [Establishment, Establishment]) {
    const [estOldData, estNewData] = LateFee;
    this.establishment = estOldData;
    this.estToValidate = estNewData;
    if (
      this.establishment?.establishmentAccount.lateFeeIndicator !==
      this.estToValidate.establishmentAccount.lateFeeIndicator
    ) {
      this.isLateFee = true;
    }
  }
  getLateFeeDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
}
