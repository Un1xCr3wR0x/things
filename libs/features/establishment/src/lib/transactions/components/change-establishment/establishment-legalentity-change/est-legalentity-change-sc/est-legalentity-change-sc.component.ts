import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  Autobind,
  DocumentService,
  Establishment,
  RouterConstants,
  TransactionService,
  getArabicName
} from '@gosi-ui/core';
import {
  AddEstablishmentService,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentService,
  EstablishmentTransEnum,
  LegalEntityEnum,
  Owner
} from '@gosi-ui/features/establishment/lib/shared';
import { noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-est-legalentity-change-sc',
  templateUrl: './est-legalentity-change-sc.component.html',
  styleUrls: ['./est-legalentity-change-sc.component.scss']
})
export class EstLegalentityChangeScComponent extends TransactionsBaseScComponent implements OnInit {
  legalEntityDetailsValidatorForm: FormGroup;
  addedOwners: Owner[] = [];
  currentOwners: Owner[] = [];
  governmetLegalEntity = LegalEntityEnum.GOVERNMENT;
  semiGovernmetLegalEntity = LegalEntityEnum.SEMI_GOV;
  isFieldOfficeTransaction = false;
  isGcc: boolean;
  currentOwnerList: Owner[];
  newOwners: Owner[] = [];
  modifiedOwners: Owner[] = [];
  showModifiedLegend = false;
  isUpperArrowOpen: boolean = false;
  isStyleForAddress: boolean = true;

  constructor(
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    readonly location: Location,
    readonly router: Router,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly addEstService: AddEstablishmentService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_LEGAL_ENTITY;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_LEGAL_ENTITY;
    this.tnxId = EstablishmentTransEnum.LE_CHANGE;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getModifiedEstablishmentDetails();
      this.getLegalEntityDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getLegalEntityDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }

  getModifiedEstablishmentDetails() {
    if (!this.isTransactionCompleted) {
      this.getLEFromTransient();
    } else {
      this.getLEForCompletedData();
    }
  }

  getLEForCompletedData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedLegalEntity))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  getLEFromTransient() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedLegalEntity))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  @Autobind
  getCurrentAndModifiedLegalEntity(legalEntity: [Establishment, Establishment]) {
    const [estOldData, estNewData] = legalEntity;
    this.establishment = estOldData;
    this.establishmentToValidate = estNewData;
    this.getOwnerData();
  }

  /**
   * Get the owner name in arabic
   * @param index
   */
  getOwnerName(index: number) {
    let ownerName = null;
    if (this.addedOwners[index] && this.addedOwners[index].person.name.arabic.firstName) {
      ownerName = getArabicName(this.addedOwners[index].person.name.arabic);
    }
    return ownerName;
  }
  isUpperArrow() {
    this.isUpperArrowOpen = !this.isUpperArrowOpen;
  }
}
