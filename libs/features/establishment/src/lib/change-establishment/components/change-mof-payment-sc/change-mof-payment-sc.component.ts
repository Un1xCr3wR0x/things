/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  Autobind,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  LovList,
  RouterConstants,
  TransactionInterface,
  TransactionMixin,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  DocumentNameEnum,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentService,
  getChangeMofPaymentWizards,
  isEstablishmentTokenValid,
  isTransactionDraft,
  NavigationIndicatorEnum,
  PaymentTypeEnum,
  selectWizard
} from '../../../shared';

@Component({
  selector: 'est-change-mof-payment-sc',
  templateUrl: './change-mof-payment-sc.component.html',
  styleUrls: ['./change-mof-payment-sc.component.scss']
})
export class ChangeMofPaymentScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit {
  changeMofPaymentForm: FormGroup;
  isValidator: boolean;
  registrationNo: number;
  currentTab = 0;
  changeMofPaymentTabWizards: WizardItem[];
  referenceNo: number;
  documentTransactionType = DocumentTransactionTypeEnum.PAYMENT_TYPE_CHANGE_ESTABLISHMENT;
  documentTransactionKey = DocumentTransactionTypeEnum.PAYMENT_TYPE_CHANGE_ESTABLISHMENT;
  documentTransactionId = DocumentTransactionIdEnum.PAYMENT_TYPE_CHANGE_ESTABLISHMENT;
  documents: DocumentItem[];
  yesOrNoList$: Observable<LovList>;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    readonly location: Location,
    readonly bsModalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly router: Router,
    readonly fb: FormBuilder,
    readonly lookUpService: LookupService
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
    this.changeMofPaymentForm = this.createForm();
  }

  ngOnInit(): void {
    if (isTransactionDraft(this.estRouterData, this.documentTransactionId)) {
      this.referenceNo = this.estRouterData.referenceNo ? this.estRouterData.referenceNo : null;
      this.registrationNo = this.estRouterData.registrationNo;
      this.getEstablishmentWithWorkflowData(this.estRouterData, this.intialiseView, this.navigateToValidator);
    } else if (isEstablishmentTokenValid(this.estRouterData, RouterConstants.TRANSACTION_CHANGE_MOF_PAYMENT_DETAILS)) {
      this.referenceNo = this.estRouterData.referenceNo ? this.estRouterData.referenceNo : null;
      this.isValidator = true;
      this.registrationNo = this.estRouterData.registrationNo;
      this.getEstablishmentWithWorkflowData(this.estRouterData, this.intialiseView, this.navigateToValidator);
      this.fetchComments(this.estRouterData);
    } else if (this.changeEstablishmentService.selectedEstablishment) {
      this.establishmentToChange = this.changeEstablishmentService.selectedEstablishment;
      this.registrationNo = this.establishmentToChange.registrationNo;
      this.intialiseView();
    } else {
      this.setTransactionComplete();
      this.location.back();
    }
  }

  /**
   * Method to initilise the view
   */
  @Autobind
  intialiseView() {
    this.changeMofPaymentTabWizards = getChangeMofPaymentWizards(0);
    this.yesOrNoList$ = this.lookUpService.getYesOrNoList();
    this.changeMofPaymentForm
      .get('paymentType')
      .patchValue(this.establishmentToChange.establishmentAccount?.paymentType);
  }

  /**
   * Method to cancel the transaction
   */
  cancelTransaction() {
    if (this.referenceNo || this.isValidator) {
      this.changeEstablishmentService.revertTransaction(this.registrationNo, this.referenceNo).subscribe(
        () => {
          this.setTransactionComplete();
          if (this.reRoute) {
            this.router.navigate([this.reRoute]);
          } else {
            if (this.isValidator) {
              this.changeEstablishmentService.navigateToChangeMofPaymentValidator();
            } else this.location.back();
          }
        },
        err => this.alertService.showError(err?.error?.message)
      );
    } else {
      this.setTransactionComplete();
      this.reRoute ? this.router.navigate([this.reRoute]) : this.location.back();
    }
  }

  /**
   * Create form
   */
  createForm() {
    return this.fb.group({
      comments: null,
      paymentType: this.fb.group({
        arabic: [],
        english: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ]
      })
    });
  }

  /**
   * Method to select the tab
   * @param tabIndex
   */
  selectedWizard(tabIndex: number) {
    this.currentTab = tabIndex;
    this.changeMofPaymentTabWizards = selectWizard(this.changeMofPaymentTabWizards, tabIndex);
  }

  /**
   *Method to submit new main establishment Details
   */
  saveMofPaymentDetails(isFinalSubmit: boolean) {
    this.alertService.clearAlerts();
    if (isFinalSubmit && !this.documentService.checkMandatoryDocuments(this.documents)) {
      this.alertService.showMandatoryDocumentsError();
    } else {
      const formValues = this.changeMofPaymentForm.getRawValue();
      this.changeEstablishmentService
        .changeMofPaymnetDetails(this.registrationNo, {
          paymentType: formValues.paymentType,
          navigationIndicator: isFinalSubmit
            ? this.isValidator
              ? NavigationIndicatorEnum.VALIDATOR_MOF_PAYMENT_FINAL_SUBMIT
              : NavigationIndicatorEnum.CSR_MOF_PAYMENT_FINAL_SUBMIT
            : this.isValidator
            ? NavigationIndicatorEnum.VALIDATOR_MOF_PAYMENT_SUBMIT
            : NavigationIndicatorEnum.CSR_MOF_PAYMENT_SUBMIT,
          comments: formValues.comments,
          referenceNo: this.referenceNo || null
        })
        .pipe(
          catchError(err => {
            this.alertService.showError(err.error.message, err.error.details);
            return throwError(err);
          }),
          tap(res => {
            if (isFinalSubmit) {
              if (this.isValidator) {
                this.updateBpm(
                  this.estRouterData,
                  this.changeMofPaymentForm.get('comments').value,
                  res.successMessage
                ).subscribe(
                  () => {
                    this.setTransactionComplete();
                    this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                  },
                  err => {
                    this.alertService.showError(err?.error?.message);
                  }
                );
              } else {
                this.setTransactionComplete();
                this.location.back();
                this.alertService.showSuccess(res.successMessage);
              }
            } else {
              this.referenceNo = +res?.transactionId;
              this.getDocuments().subscribe(() => {
                this.selectedWizard(1);
              });
            }
          })
        )
        .subscribe(noop, noop);
    }
  }

  /**
   * Method to get all documents
   */
  getDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(this.documentTransactionKey, this.documentTransactionType, this.registrationNo, this.referenceNo)
      .pipe(
        tap(res => {
          const isMof = this.changeMofPaymentForm.get('paymentType').get('english').value === PaymentTypeEnum.MOF;
          this.documents = res.map(doc => {
            if (doc.name.english === DocumentNameEnum.MOF_FINANCIAL_GUARANTEE) {
              doc.show = doc.required = isMof;
            } else if (doc.name.english === DocumentNameEnum.FINANCIAL_GUARANTEE) {
              doc.required = doc.show = !isMof;
            }
            return doc;
          });
        }),
        catchError(err => {
          this.alertService.showError(err.error.message, err.error.details);
          return throwError(err);
        })
      );
  }

  /**
   * Method to confirm cancel
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelTransaction();
  }

  /**
   * Method to navigate to validator screen
   */
  @Autobind
  navigateToValidator() {
    this.setTransactionComplete();
    this.changeEstablishmentService.navigateToChangeMofPaymentValidator();
  }

  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
}
