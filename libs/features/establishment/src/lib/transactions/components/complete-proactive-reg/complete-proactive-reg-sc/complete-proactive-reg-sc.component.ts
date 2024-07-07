import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  getArabicName,
  Person,
  RouterConstants,
  TransactionService,
  LegalEntitiesEnum,
  Autobind,
  Establishment
} from '@gosi-ui/core';
import {
  AddEstablishmentService,
  ChangeEstablishmentService,
  EstablishmentService,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { TransactionsBaseScComponent } from '../../../base/transactions-base-sc.component';
import { noop } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'est-complete-proactive-reg-sc',
  templateUrl: './complete-proactive-reg-sc.component.html',
  styleUrls: ['./complete-proactive-reg-sc.component.scss']
})
export class CompleteProactiveRegScComponent extends TransactionsBaseScComponent implements OnInit {
  isUpperArrowOpen: boolean = false;
  proactiveTransaction: number;
  establishment: Establishment
  isPaymentModified: Boolean;
  isLateFeeModified: boolean;
  isBankNameModified: boolean;
  isIbanNumberModified: boolean;
  isGov: boolean;
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
  }

  ngOnInit(): void {
    this.getTransactionData();
    this.proactiveTransaction = EstablishmentTransEnum.COMPLETE_PROACTIVE_TRANSACTION;
    if (this.estRegNo) {
      this.intialiseView(this.estRegNo);
      this.getOwnerData();
      this.getEstablishmentData();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getEstablishmentData() {
    if (!this.isTransactionCompleted) {
      this.getChangeEstData();
    } else {
      this.getChangeEstUpdateData();
    }
  }

  // Method to get the old transaction changes

  getChangeEstData() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedPaymentData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  // Method to get the new transaction changes

  getChangeEstUpdateData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedPaymentData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  @Autobind
  getCurrentAndModifiedPaymentData(PaymentData: [Establishment, Establishment]) {
    const [estOldData, estNewData] = PaymentData;
    this.establishment = estOldData;
    this.estToValidate = estNewData;
    if (
      this.establishment?.establishmentAccount?.bankAccount?.bankName?.english !==
      this.estToValidate?.establishmentAccount?.bankAccount?.bankName?.english
    ) {
      this.isBankNameModified = true;
    }
    if (
      this.establishment?.establishmentAccount?.bankAccount?.ibanAccountNo !==
      this.estToValidate?.establishmentAccount?.bankAccount?.ibanAccountNo
    ) {
      this.isIbanNumberModified = true;
    }
    if (
      this.estToValidate?.legalEntity?.english === LegalEntitiesEnum.GOVERNMENT ||
      this.estToValidate?.legalEntity?.english === LegalEntitiesEnum.SEMI_GOVERNMENT
    ) {
      this.isGov = true;
    }
    if (this.establishment?.establishmentAccount?.paymentType?.english === this.estToValidate?.establishmentAccount?.paymentType?.english) {
      this.isPaymentModified = false;
    }
    if (
      this.establishment?.establishmentAccount?.lateFeeIndicator?.english ===
      this.estToValidate?.establishmentAccount?.lateFeeIndicator?.english
    ) {
      this.isLateFeeModified = false;
    }
  }
  /**
   * Get the owner name in arabic
   * @param person
  //  */
  getOwnerName(person: Person) {
    let ownerName = null;
    if (person?.name?.arabic?.firstName) {
      ownerName = getArabicName(person?.name?.arabic);
    } else if (person?.name?.english?.name) {
      ownerName = person?.name?.english?.name;
    }

    return ownerName;
  }
  isUpperArrow() {
    this.isUpperArrowOpen = !this.isUpperArrowOpen;
  }
}
