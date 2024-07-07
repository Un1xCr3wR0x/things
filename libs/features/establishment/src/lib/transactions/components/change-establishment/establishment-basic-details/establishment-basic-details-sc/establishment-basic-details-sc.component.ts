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
  selector: 'est-establishment-basic-details-sc',
  templateUrl: './establishment-basic-details-sc.component.html',
  styleUrls: ['./establishment-basic-details-sc.component.scss']
})
export class EstablishmentBasicDetailsScComponent extends TransactionsBaseScComponent implements OnInit {
  isArabicNameModified: boolean;
  isEnglishNameModified: boolean;
  isTypeModified: boolean;
  isNationalityModified: boolean;

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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_BASIC_DETAILS;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_BASIC_DETAILS;
    this.tnxId = EstablishmentTransEnum.BASIC_DETAILS_TRANSACTION;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getBasicData();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
  getBasicData() {
    if (!this.isTransactionCompleted) {
      this.getChangeEstData();
    } else {
      this.getChangeEstUpdateData();
    }
  }

  // Method to get the old transaction changes

  getChangeEstData() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedBasicData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  // Method to get the new transaction changes

  getChangeEstUpdateData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedBasicData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  @Autobind
  getCurrentAndModifiedBasicData(BasicData: [Establishment, Establishment]) {
    const [estOldData, estNewData] = BasicData;
    this.establishment = estOldData;
    this.estToValidate = estNewData;
    if (this.establishment?.name?.arabic !== this.estToValidate?.name?.arabic) {
      this.isArabicNameModified = true;
    }
    if (this.establishment?.name?.english !== this.estToValidate?.name?.english) {
      this.isEnglishNameModified = true;
    }
    if (this.establishment?.activityType?.english !== this.estToValidate?.activityType?.english) {
      this.isTypeModified = true;
    }
    if (this.establishment?.nationalityCode?.english !== this.estToValidate?.nationalityCode?.english) {
      this.isNationalityModified = true;
    }
    this.getBasicDocs();
  }

  getBasicDocs() {
    this.documentTransactionType = this.isGCC
      ? DocumentTransactionTypeEnum.CHANGE_GCC_BASIC_DETAILS
      : DocumentTransactionTypeEnum.CHANGE_BASIC_DETAILS;
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
}
