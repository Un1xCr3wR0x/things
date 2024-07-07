import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, DocumentService, Establishment, RouterConstants, TransactionService } from '@gosi-ui/core';
import {
  AddEstablishmentService,
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-cbm-details-sc',
  templateUrl: './cbm-details-sc.component.html',
  styleUrls: ['./cbm-details-sc.component.scss']
})
export class CbmDetailsScComponent extends TransactionsBaseScComponent implements OnInit {
  estToValidate: Establishment;
  cbmDetailsNew: Establishment;
  cbmInprogressDetailsNew: Establishment;
  newMain: number;
  newmain: number;

  isInprogress: boolean;
  constructor(
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    readonly location: Location,
    readonly router: Router,
    readonly addEstService: AddEstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly changeGroupEstablishmentService: ChangeGroupEstablishmentService
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_BRANCH_TO_MAIN;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_BRANCH_TO_MAIN;
    this.tnxId = EstablishmentTransEnum.CHANGE_BRANCH_TO_MAIN;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getCbmData();
      this.getCbmDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
  getCbmData() {
    if (!this.isTransactionCompleted) {
      this.getInprogress();
      this.getChangeEstData();
    } else {
      this.getChangeEstUpdateData();
      this.getChangeEstData();
    }
  }
  // Method to get the old transaction changes
  getChangeEstData() {
    this.changeEstablishmentService
      .getEstablishmentFromTransient(this.estRegNo, this.referenceNo, null, EstablishmentQueryKeysEnum.OLD_VALUE)
      .subscribe(
        res => {
          this.estToValidate = res;
        },
        err => {
          this.alertService.showError(err?.error?.message);
        }
      );
  }

  // Method to get the new transaction changes

  getChangeEstUpdateData() {
    this.changeEstablishmentService
      .getEstablishmentFromTransient(this.estRegNo, this.referenceNo, null, EstablishmentQueryKeysEnum.NEW_VALUE)
      .subscribe(
        res => {
          this.cbmDetailsNew = res;
          this.newmain = this.cbmDetailsNew?.mainEstablishmentRegNo;
          this.getEstablishmentDetails(this.newmain);
        },
        err => {
          this.alertService.showError(err?.error?.message);
        }
      );
  }

  getInprogress() {
    this.changeEstablishmentService.getEstablishmentFromTransient(this.estRegNo, this.referenceNo).subscribe(
      res => {
        this.cbmInprogressDetailsNew = res;
        this.newMain = this.cbmInprogressDetailsNew?.mainEstablishmentRegNo;
        this.getEstablishmentDetails(this.newMain);
      },
      err => {
        this.alertService.showError(err?.error?.message);
      }
    );
  }
  getCbmDocs() {
    this.changeGroupEstablishmentService
      .getDocuments(this.documentTransactionKey, this.documentTransactionType, this.estRegNo, this.referenceNo)
      .subscribe(res => (this.documentList = res.filter(item => item.documentContent != null)));
  }
}
