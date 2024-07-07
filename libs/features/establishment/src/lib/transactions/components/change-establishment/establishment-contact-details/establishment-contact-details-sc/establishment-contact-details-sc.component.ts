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
  selector: 'est-establishment-contact-details-sc',
  templateUrl: './establishment-contact-details-sc.component.html',
  styleUrls: ['./establishment-contact-details-sc.component.scss']
})
export class EstablishmentContactDetailsScComponent extends TransactionsBaseScComponent implements OnInit {
  isMobNo: boolean;
  isEmailId: boolean;
  isTelephoneNo: boolean;

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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_CONTACT_DETAILS;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_CONTACT_DETAILS;
    this.tnxId = EstablishmentTransEnum.CONTACT_DETAILS_UPDATE;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getContactData();
      this.getContactDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
  getContactData() {
    if (!this.isTransactionCompleted) {
      this.getContactFromTransient();
    } else {
      this.getContactForCompletedData();
    }
  }
  getContactForCompletedData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedContactData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  getContactFromTransient() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedContactData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  @Autobind
  getCurrentAndModifiedContactData(ContactData: [Establishment, Establishment]) {
    const [estOldData, estNewData] = ContactData;
    this.establishment = estOldData;
    this.estToValidate = estNewData;
    if (this.establishment?.contactDetails.mobileNo.primary !== this.estToValidate.contactDetails.mobileNo.primary) {
      this.isMobNo = true;
    }
    if (this.establishment?.contactDetails.emailId.primary !== this.estToValidate.contactDetails.emailId.primary) {
      this.isEmailId = true;
    }
    if (
      this.establishment?.contactDetails.telephoneNo.primary !== this.estToValidate.contactDetails.telephoneNo.primary
    ) {
      this.isTelephoneNo = true;
    }
  }
  getContactDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
}
