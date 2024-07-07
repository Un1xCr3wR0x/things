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
import {
  hasCrnChanged,
  hasLicenseChanged
} from '../../../../../change-establishment/components/change-identifier-details-sc/change-identifier-helper';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-identifier-change-details-sc',
  templateUrl: './identifier-change-details-sc.component.html',
  styleUrls: ['./identifier-change-details-sc.component.scss']
})
export class IdentifierChangeDetailsScComponent extends TransactionsBaseScComponent implements OnInit {
  crnAndLicenseChanged: boolean;

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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_IDENTIFIER_DETAILS;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_IDENTIFIER_DETAILS;
    this.tnxId = EstablishmentTransEnum.IDENTIER_UPDATE_TRANSACTION;
  }
  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getIdentifierData();
      this.getIdentifierDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getIdentifierData() {
    if (!this.isTransactionCompleted) {
      this.getIdentifierFromTransient();
    } else {
      this.getIdentifierForCompletedData();
    }
  }
  getIdentifierForCompletedData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedIdentifierData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  getIdentifierFromTransient() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedIdentifierData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  @Autobind
  getCurrentAndModifiedIdentifierData(identifierData: [Establishment, Establishment]) {
    const [estOldData, estNewData] = identifierData;
    this.establishment = estOldData;
    this.estToValidate = estNewData;
    this.crnAndLicenseChanged =
      hasLicenseChanged(this.establishment, this.estToValidate) &&
      hasCrnChanged(this.establishment?.crn, this.estToValidate?.crn);
  }
  getIdentifierDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
}
