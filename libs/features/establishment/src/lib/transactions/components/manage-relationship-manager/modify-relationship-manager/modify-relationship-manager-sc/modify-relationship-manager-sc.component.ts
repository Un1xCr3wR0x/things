import { Component, OnInit } from '@angular/core';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';
import {
  AlertService,
  Autobind,
  DocumentService,
  Establishment,
  RouterConstants,
  TransactionService
} from '@gosi-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionTypeEnum,
  AddEstablishmentService,
  ChangeEstablishmentService,
  EstablishmentService,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { Location } from '@angular/common';
import { noop } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'est-modify-relationship-manager-sc',
  templateUrl: './modify-relationship-manager-sc.component.html',
  styleUrls: ['./modify-relationship-manager-sc.component.scss']
})
export class ModifyRelationshipManagerScComponent extends TransactionsBaseScComponent implements OnInit {
  establishment: Establishment;
  isArabicNameModified: boolean;
  isTelephoneNumberModified: boolean;
  isMobileNoModified: boolean;
  isEmailIdModified: boolean;
  isEmployeeIdModified: boolean;
  isUpperArrowOpen: boolean = false;
  removeRecordAction = ActionTypeEnum.REMOVE;
  modifyRecordAction = ActionTypeEnum.MODIFY;
  addRecordAction = ActionTypeEnum.ADD;
  replaceRecordAction = ActionTypeEnum.REPLACE;

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
    this.tnxId = EstablishmentTransEnum.MODIFY_RELATIONSHIP_MANAGER;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getRelationshipManagerData();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getRelationshipManagerData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  @Autobind
  getCurrentAndModifiedData(ManagerData: [Establishment, Establishment]) {
    const [oldData, newData] = ManagerData;
    this.establishment = oldData;
    this.estToValidate = newData;
    if (this.establishment.establishmentManager.employeeName !== this.estToValidate.establishmentManager.employeeName) {
      this.isArabicNameModified = true;
    }
    if (
      this.establishment.establishmentManager.telephoneNumber !==
      this.estToValidate?.establishmentManager.telephoneNumber
    ) {
      this.isTelephoneNumberModified = true;
    }
    if (this.establishment.establishmentManager.mobileNo !== this.estToValidate?.establishmentManager.mobileNo) {
      this.isMobileNoModified = true;
    }
    if (this.establishment.establishmentManager.emailId !== this.estToValidate?.establishmentManager.emailId) {
      this.isEmailIdModified = true;
    }
    if (this.establishment.establishmentManager.employeeId !== this.estToValidate?.establishmentManager.employeeId) {
      this.isEmployeeIdModified = true;
    }
  }
  isUpperArrow() {
    this.isUpperArrowOpen = !this.isUpperArrowOpen;
  }
}
