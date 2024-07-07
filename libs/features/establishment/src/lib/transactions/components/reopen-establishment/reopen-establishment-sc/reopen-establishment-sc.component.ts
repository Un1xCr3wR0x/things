import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  Establishment,
  NationalityTypeEnum,
  RouterConstants,
  TransactionService,
  checkBilingualTextNull
} from '@gosi-ui/core';
import {
  AddEstablishmentService,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { TransactionsBaseScComponent } from '../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-reopen-establishment-sc',
  templateUrl: './reopen-establishment-sc.component.html',
  styleUrls: ['./reopen-establishment-sc.component.scss']
})
export class ReopenEstablishmentScComponent extends TransactionsBaseScComponent implements OnInit {
  isMobNo: boolean;
  isEmailId: boolean;
  isTelephoneNo: boolean;
  establishmentToValidate: Establishment;
  gccNationality = false;
  others = false;
  saudiNationality = false;

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
    this.documentTransactionKey = DocumentTransactionTypeEnum.REOPEN_DOCUMENT;
    this.documentTransactionType = DocumentTransactionTypeEnum.REOPEN_DOCUMENT;
    this.tnxId = EstablishmentTransEnum.REOPON_ESTABLISHMENT_TRANSACTION;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getReopenData();
      this.getReopenDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
  getReopenData() {
    if (!this.isTransactionCompleted) {
      this.getReopenDataFromTransient();
    } else {
      this.getReopenDataForCompletedData();
    }
  }
  getReopenDataForCompletedData() {
    this.changeEstablishmentService
      .getEstablishmentFromTransient(this.estRegNo, this.referenceNo, null, EstablishmentQueryKeysEnum.NEW_VALUE)
      .subscribe(res => {
        this.establishmentToValidate = res;
      });
  }

  getReopenDataFromTransient() {
    this.changeEstablishmentService.getEstablishmentFromTransient(this.estRegNo, this.referenceNo).subscribe(res => {
      this.establishmentToValidate = res;
    });
  }
  getReopenDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
  // this method is used to match the identifier corresponding to nationality
  getIdentifier(establishmentToValidate: Establishment) {
    if (
      establishmentToValidate?.reopenEstablishment?.person &&
      establishmentToValidate?.reopenEstablishment?.person?.identity
    ) {
      if (
        establishmentToValidate?.reopenEstablishment?.person?.nationality?.english ===
        NationalityTypeEnum.SAUDI_NATIONAL
      ) {
        return (this.saudiNationality = true);
      } else if (
        EstablishmentConstants.GCC_NATIONAL.indexOf(
          establishmentToValidate?.reopenEstablishment?.person?.nationality?.english
        ) !== -1
      ) {
        return (this.gccNationality = true);
      } else {
        return (this.others = true);
      }
    }
  }

  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
  goToEstProfile(regNo) {
    this.router.navigate([EstablishmentConstants.EST_PROFILE_ROUTE(regNo)]);
  }
}
