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
import { AccountStatusEnum } from '@gosi-ui/features/establishment/lib/shared/enums/sama-response-enum';
import { noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-establishment-bank-account-details-sc',
  templateUrl: './establishment-bank-account-details-sc.component.html',
  styleUrls: ['./establishment-bank-account-details-sc.component.scss']
})
export class EstablishmentBankAccountDetailsScComponent extends TransactionsBaseScComponent implements OnInit {
  isBankName: boolean;
  isIbanNumber: boolean;
  isAccountStatus: boolean;
  oldAccountStatus: string;
  modifiedAccountStatus: string;

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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_BANK_DETAILS;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_BANK_DETAILS;
    this.tnxId = EstablishmentTransEnum.BANK_DETAILS_UPDATE;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.intialiseView(this.estRegNo);
      this.getBankData();
      this.getBankDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
  getBankData() {
    if (!this.isTransactionCompleted) {
      this.getBankFromTransient();
    } else {
      this.getBankForCompletedData();
    }
  }
  getBankForCompletedData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedBankData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  getBankFromTransient() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedBankData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  @Autobind
  getCurrentAndModifiedBankData(BankData: [Establishment, Establishment]) {
    const [estOldData, estNewData] = BankData;
    this.establishment = estOldData;
    this.estToValidate = estNewData;
    if (
      this.establishment?.establishmentAccount?.bankAccount.bankName !==
      this.estToValidate?.establishmentAccount?.bankAccount.bankName
    ) {
      this.isBankName = true;
    }
    if (
      this.establishment?.establishmentAccount?.bankAccount?.ibanAccountNo !==
      this.estToValidate?.establishmentAccount?.bankAccount.ibanAccountNo
    ) {
      this.isIbanNumber = true;
    }
    if (
      this.establishment?.establishmentAccount?.bankAccount?.accountStatus !==
      this.estToValidate?.establishmentAccount?.bankAccount.accountStatus
    ) {
      this.isAccountStatus = true;
    }
    this.oldAccountStatus =
      'ESTABLISHMENT.BANK-ACCOUNT-STATUS.' + this.establishment?.establishmentAccount?.bankAccount?.accountStatus;
    this.modifiedAccountStatus =
      'ESTABLISHMENT.BANK-ACCOUNT-STATUS.' + this.estToValidate?.establishmentAccount?.bankAccount?.accountStatus;
    if (this.establishment?.establishmentAccount?.bankAccount?.accountStatus === AccountStatusEnum.NONE) {
      this.oldAccountStatus = null;
    }
    if (this.estToValidate?.establishmentAccount?.bankAccount?.accountStatus === AccountStatusEnum.NONE) {
      this.modifiedAccountStatus = null;
    }
  }
  getBankDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
}
