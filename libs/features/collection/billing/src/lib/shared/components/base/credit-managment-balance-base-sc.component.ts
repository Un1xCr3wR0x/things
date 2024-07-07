import {
  BaseComponent,
  AlertService,
  DocumentService,
  DocumentItem,
  bindToObject,
  scrollToTop,
  EstablishmentStatusEnum
} from '@gosi-ui/core';
import { Directive, ViewChild } from '@angular/core';
import { EstablishmentService, CreditManagementService, BillingRoutingService } from '../../services';
import { EstablishmentDetails } from '../../models/establishment-details';
import { CreditBalanceDetails } from '../../models/credit-balance-details';
import { catchError, tap } from 'rxjs/operators';
import { throwError, noop } from 'rxjs';
import { BranchDetails, CreditManagmentRequest, RecipientAmountDetails } from '../../models';
import { BillingConstants } from '../../constants';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

@Directive()
export abstract class CreditManagmentBalanceBaseScComponent extends BaseComponent {
  /** Local variables */
  regNumber: number;
  searchResult = true;
  establishmentDetails: EstablishmentDetails;
  creditBalanceDetails: CreditBalanceDetails;
  branchDetails: BranchDetails[] = [];
  documentList: DocumentItem[] = [];
  isAppPrivate: boolean;
  requestNo: number;
  fieldArray = [];
  creditDetailsReq: CreditManagmentRequest;
  uuid: string;
  branchValues = [];
  referenceNumber: number;
  creditDetails: RecipientAmountDetails;
  isSave = false;
  isSerach = false;
  creditManagmentMainForm: FormGroup = new FormGroup({});
  isValid = false;
  inWorkflow = false;
  currentTab = 0;
  isBranchSearch = false;
  branchValuesDetails = [];
  isMain = false;
  isAddDetils = false;
  currentBalance: CreditBalanceDetails;
  /** Child components */
  @ViewChild('creditManagementWizard', { static: false })
  creditManagementWizard: ProgressWizardDcComponent;
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly creditManagementService: CreditManagementService,
    readonly documentService: DocumentService,
    readonly routingService: BillingRoutingService,
    readonly route: ActivatedRoute
  ) {
    super();
  }

  // this method is used to get avaible balance for credit management
  getAvailableBalanceDetails(regNumber: number) {
    this.creditManagementService.getAvailableCreditBalance(regNumber).subscribe(
      datas => {
        this.creditBalanceDetails = datas;
        if (this.creditBalanceDetails.totalCreditBalance === 0) {
          this.alertService.showErrorByKey('BILLING.NO-CREDIT-BALANCE-ERROR-MESG');
          this.searchResult = true;
        } else this.searchResult = false;
      },
      errs => {
        this.alertService.showError(errs.error.message);
      }
    );
  }
  getAllcreditDetails(registrationNumber, referenceNo) {
    this.searchResult = false;

    this.creditManagementService.getAllCreditBalanceDetails(registrationNumber, this.requestNo).subscribe(data => {
      if (data) {
        this.creditDetailsReq = data;
        if (this.creditDetailsReq && this.creditDetailsReq.recipientDetail) {
          for (const i of this.creditDetailsReq.recipientDetail) {
            this.creditDetails = i;
            this.creditManagementService.getAvailableCreditBalance(i.registrationNo).subscribe(datas => {
              if (datas) {
                this.branchValues = [];
                this.fieldArray = [];
                const listItem = {
                  name: i.name,
                  status: i.status,
                  registrationNo: i.registrationNo,
                  totalCreditBalance: datas.totalCreditBalance,
                  totalDebitBalance: datas.totalDebitBalance,
                  amount: i.amount
                };
                this.fieldArray.push(listItem);
                this.branchValues = this.fieldArray;
              }
            });
            this.getScannedDocuments(referenceNo);
          }
        }
      }
    });
  }
  // * Method to search establishment based on serach values
  searchValues(res) {
    this.establishmentService.getBranchDetails(this.regNumber, res).subscribe(
      value => {
        this.isSerach = true;
        this.branchDetails = value;
      },
      catchError(err => {
        this.alertService.showError(err.error.message);
        return throwError(err);
      })
    );
  }
  /** Method to check whether mandatory documents are scanned/uploaded or not. */
  checkMandatoryDocuments() {
    return this.documentService.checkMandatoryDocuments(this.documentList);
  }
  /** Method to fetch credit details for establishment. */

  /** Method to fetch scanned document details. */
  getScannedDocuments(referenceNo) {
    this.documentService
      .getDocuments(
        BillingConstants.CREDIT_MANAGEMENT_ID,
        this.isAppPrivate
          ? BillingConstants.CREDIT_MANAGEMENT_TRANSACTION_FO_TYPE
          : BillingConstants.CREDIT_MANAGEMENT_TRANSACTION_GOL_TYPE,
        this.regNumber,
        referenceNo
      )
      .subscribe(doc => (this.documentList = doc));
    this.documentList.forEach(doc => {
      this.refreshDocuments(doc);
    });
  }
  refreshDocuments(documents: DocumentItem) {
    if (documents && documents.name) {
      this.documentService
        .refreshDocument(
          documents,
          this.regNumber,
          BillingConstants.CREDIT_MANAGEMENT_ID,
          this.isAppPrivate
            ? BillingConstants.CREDIT_MANAGEMENT_TRANSACTION_FO_TYPE
            : BillingConstants.CREDIT_MANAGEMENT_TRANSACTION_GOL_TYPE,
          this.referenceNumber,
          null,
          this.uuid
        )
        .pipe(
          tap(response => {
            documents = response;
          }),
          catchError(err => {
            this.alertService.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }
  /** Method to navigate back to inbox page */
  navigateBackToInbox() {
    if (this.isAppPrivate) {
      this.routingService.navigateToInbox();
    } else {
      this.routingService.navigateToPublicInbox();
    }
  }
  navigateToBack(isAppPrivate) {
    if (isAppPrivate) {
      this.routingService.navigateToValidator();
    } else {
      this.routingService.navigateToInbox();
    }
  }
  cancelPopups() {
    this.isSave = false;
  }
  wrongSearchValue() {
    this.alertService.showErrorByKey('BILLING.ESTABLISHEMNT-CANNOT-ADDED-TO-TRANSFER-CREDIT');
  }
  // * Method to create form data
  createFormData() {
    this.creditDetailsReq = bindToObject(
      new CreditManagmentRequest(),
      this.creditManagmentMainForm.get('branchBreakupForm').value
    );
    this.creditDetailsReq = bindToObject(
      new CreditManagmentRequest(),
      this.creditManagmentMainForm.get('commentForm').value
    );
    this.creditDetailsReq.recipientDetail = this.creditManagmentMainForm.get('branchBreakupForm').value;
    if (!this.isAppPrivate) this.isValid = this.creditManagmentMainForm.get('checkForm').get('checkBoxFlag').value;
  }
  setErrorMessage(res) {
    if (res === true) this.alertService.showErrorByKey('BILLING.TOTAL-AMOUNT-GRT-THN-TRANSFERABLE-AMOUNT');
  }
  identifyModeOfTransaction() {
    this.route.url.subscribe(res => {
      if (res[1] && res[1].path === 'edit') this.inWorkflow = true;
    });
  }
  /** Method to enable navigation through wizard. */
  selectWizards(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  getBranch(establishmentValues) {
    if (!this.isAddDetils) {
      this.branchValuesDetails.forEach(res => {
        if (res.registerNumber === establishmentValues.registrationNo) this.isBranchSearch = res.branchSearch;
      });
    } else this.isBranchSearch = false;
    this.alertService.clearAlerts();
    if (this.isAppPrivate) {
      this.creditManagementService.getAvailableCreditBalance(establishmentValues.registrationNo).subscribe(res => {
        this.currentBalance = res;
        if (
          (this.currentBalance && establishmentValues?.status?.english === EstablishmentStatusEnum.REGISTERED) ||
          establishmentValues?.status?.english === EstablishmentStatusEnum.REOPEN ||
          establishmentValues?.status?.english === EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS
        ) {
          this.branchValues = [];
          this.fieldArray = [];
          const listItem = {
            name: establishmentValues.name,
            status: establishmentValues.status,
            registrationNo: establishmentValues.registrationNo,
            totalCreditBalance: res.totalCreditBalance,
            totalDebitBalance: res.totalDebitBalance,
            branchSearch: this.isBranchSearch
          };
          this.fieldArray.push(listItem);
          this.branchValues = this.fieldArray;
        } else {
          this.alertService.showErrorByKey('BILLING.ESTABLISHEMNT-CANNOT-ADDED-TO-TRANSFER-CREDIT');
        }
      });
    } else {
      if (establishmentValues?.status?.english === 'Registered') {
        const listItem = {
          name: establishmentValues.name,
          status: establishmentValues.status,
          registrationNo: establishmentValues.registrationNo,
          branchSearch: true
        };
        this.fieldArray.push(listItem);
        this.branchValues = this.fieldArray;
      }
    }
    this.isAddDetils = false;
  }
  /** Method to show error alert. */
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }
  /** Method to navigate to next form */
  nextForm() {
    this.alertService.clearAlerts();
    this.currentTab = 1;
    this.creditManagementWizard.setNextItem(this.currentTab);
    scrollToTop();
  }
}
