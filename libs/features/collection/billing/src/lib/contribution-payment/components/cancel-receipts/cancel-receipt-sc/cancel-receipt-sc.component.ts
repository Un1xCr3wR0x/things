/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment-timezone';
import {
  AlertService,
  BaseComponent,
  BilingualText,
  DocumentItem,
  DocumentService,
  ExchangeRateService,
  LanguageToken,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken,
  BPMUpdateRequest,
  scrollToTop,
  UuidGeneratorService,
  bindToObject,
  WorkflowService,
  markFormGroupTouched
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, iif, noop, Observable, throwError, pipe, of } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import { BillingConstants } from '../../../../shared/constants';
import { CurrencyArabic, ReceiptType, TransactionOutcome } from '../../../../shared/enums';
import {
  CurrencyDetails,
  EstablishmentDetails,
  PaymentDetails,
  PaymentResponse,
  CancelReceiptPayload
} from '../../../../shared/models';
import { BillingRoutingService, ContributionPaymentService, EstablishmentService } from '../../../../shared/services';
import { assembleCurrencyDetails, createBilingualObject } from '../../../../shared/utils';

@Component({
  selector: 'blg-cancel-receipt-sc',
  templateUrl: './cancel-receipt-sc.component.html',
  styleUrls: ['./cancel-receipt-sc.component.scss']
})
export class CancelReceiptScComponent extends BaseComponent implements OnInit {
  /** Constants */
  documentTransactionId = BillingConstants.CANCEL_RECEIPT_TRANSACTION_ID;
  /** Local variables */
  otherReasonFlag = false;
  lang = 'en';
  receiptNumber: number;
  registrationNumber: number;
  receipt: PaymentDetails;
  establishment: EstablishmentDetails;
  isGccCountry = false;
  currencyDetails: CurrencyDetails;
  gccCurrency: BilingualText;
  documents: DocumentItem[] = [];
  receiptDetailsForm: FormGroup;
  modalRef: BsModalRef;
  isEditMode = false;
  role: string;
  paymentResponse: PaymentResponse = new PaymentResponse();
  successMessage: BilingualText;
  noDetailsFlag = false;
  searchFlag = false;
  uuid: string;
  cancelReceiptPayload: CancelReceiptPayload = new CancelReceiptPayload();
  indicatorList: LovList;
  indicator: string;
  currencySAR = BillingConstants.CURRENCY_SAR;
  amount: number;

  /** Observables */
  cancellationReasonList$: Observable<LovList>;
  
  /** Creates an instance of CancelReceiptScComponent. */
  constructor(
    readonly contributionPaymentService: ContributionPaymentService,
    readonly establishmentService: EstablishmentService,
    readonly exchangeRateService: ExchangeRateService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly routingService: BillingRoutingService,
    readonly route: ActivatedRoute,
    readonly fb: FormBuilder,
    readonly workflowService: WorkflowService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    @Inject(RouterDataToken) private routerData: RouterData,
    private uuidGeneratorService: UuidGeneratorService
  ) {
    super();
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.role = this.routerData.assignedRole;
    scrollToTop();
    this.alertService.clearAlerts();
    this.language.subscribe(lang => (this.lang = lang));
    this.checkEditMode();
    this.setKeysForView();
    this.getLookupValues();
    this.receiptDetailsForm = this.createReceiptForm();
    if (this.receiptNumber && this.registrationNumber) this.getDataForView();
    const item = [
      {
        value: { english: 'Yes', arabic: 'نعم' },
        sequence: 0
      },
      {
        value: { english: 'No', arabic: 'لا' },
        sequence: 1
      }
    ];
    this.indicatorList = new LovList(item);
  }

  /** Method to search particular receipt number. */
  searchReceiptNo(receiptNo: number) {
    this.receiptNumber = receiptNo;
    this.searchFlag = true;
    if (this.receiptNumber && this.registrationNumber) this.getDataForView();
  }
  /** Method to check edit mode. */
  checkEditMode(): void {
    this.route.url.subscribe(res => {
      if (res.length > 1) {
        if (res[0].path === 'cancel-establishment-payment' && res[1].path === 'edit') {
          this.isEditMode = true;
        }
      } else {
        if (!this.isEditMode) {
          this.uuid = this.uuidGeneratorService.getUuid();
        }
      }
    });
  }

  /** Method to set keys for view. */
  setKeysForView(): void {
    if (this.isEditMode && this.routerData.taskId) this.readKeysFromToken();
    else this.readKeysFromService();
  }

  /** Method to read keys from token. */
  readKeysFromToken(): void {
    const payload = JSON.parse(this.routerData.payload);

    if (payload) {
      this.registrationNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
      this.receiptNumber = payload.parentReceiptNo ? Number(payload.parentReceiptNo) : null;
    }
  }

  /** Method to read the keys from route. */
  readKeysFromService(): void {
    this.receiptNumber = this.contributionPaymentService.receiptNumber;
    this.registrationNumber = this.contributionPaymentService.registrationNumber;
  }

  /** Method to get lookup values. */
  getLookupValues(): void {
    this.cancellationReasonList$ = this.lookupService.getReasonForCancellationList();
  }

  /** Method to create receipt form. */
  createReceiptForm(): FormGroup {
    return this.fb.group({
      receiptNo: [null, { validators: Validators.required }],
      reasonForCancellation: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null],
      }),
      penaltyIndicator: this.fb.group({
        english: ['Yes', { validators: Validators.required }],
        arabic: [null]
      }),
      cancellationReasonOthers: [null],
      comments: [null, { validators: Validators.required }]
    });
  }
  getPenaltyIndicator(indicator) {
    this.receiptDetailsForm.get('penaltyIndicator').setValue(indicator);
    this.cancelReceiptPayload.penaltyIndicator = indicator;
  }
  /** Method to get other reason   */

  otherValueSelect() {
    const otherField = this.receiptDetailsForm.get('reasonForCancellation').get('english');
    if (otherField.value === 'Other'){ this.otherReasonFlag = true;
      this.receiptDetailsForm.get('cancellationReasonOthers').setValidators([Validators.required]);
    }
    else {this.otherReasonFlag = false;
      this.receiptDetailsForm.get('cancellationReasonOthers').setValidators(null);
    }
  }
  /** Method to retrieve data for intializing the view. */
  getDataForView(): void {
    this.contributionPaymentService
      .getReceiptDetails(this.registrationNumber, this.receiptNumber, false, ReceiptType.PARENT_RECEIPT)
      .pipe(
        tap(res => {
          if (this.searchFlag) {
            if (
              res.status.english !== (BillingConstants.CANCELLED || BillingConstants.PROCESSED_STATUS) &&
              res.receiptMode.english !== BillingConstants.SADAD_NETWORK
            ) {
              this.alertService.showErrorByKey('BILLING.PROCESSED-RECEIPTS');
            } else if (
              res.status.english === BillingConstants.CANCELLED &&
              res.receiptMode.english !== BillingConstants.SADAD_NETWORK
            ) {
              this.alertService.showErrorByKey('BILLING.CANCELLED-RECEIPTS');
            } else if (res.receiptMode.english === BillingConstants.SADAD_NETWORK) {
              this.alertService.showErrorByKey('BILLING.SADAD-RECEIPTS');
            }
            this.noDetailsFlag = true;
          }
          if (!this.noDetailsFlag) {
            this.receipt = res;
            this.amount=this.receipt.amountReceived.amount;
          }

          this.initializeReceiptForm();
        }),
        switchMap(() => {
          return this.getRequiredDocuments();
        }),
        switchMap(() => {
          return this.getEstablishmentDetails();
        }),
        catchError(err => {
          this.showError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get establishment details. */
  getEstablishmentDetails() {
    return this.establishmentService.getEstablishment(this.registrationNumber).pipe(
      tap(res => {
        this.establishment = res;
        this.isGccCountry = this.establishment.gccEstablishment !== null;
      }),
      switchMap(() => iif(() => (this.isGccCountry && this.receipt.amountReceived.currency != this.currencySAR.english), this.getCurrencyDetails(this.receipt.amountReceived.currency)))
    );
  }

  /** Method to get currency details */
  getCurrencyDetails(currencyCode: string): Observable<number> {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const txnDate=moment(this.receipt.transactionDate.gregorian).format('YYYY-MM-DD');
    return this.exchangeRateService
      .getExchangeRate(currencyCode, BillingConstants.CURRENCY_SAR.english, txnDate)
      .pipe(
        tap(res => {
            this.currencyDetails = assembleCurrencyDetails(this.receipt.amountReceived.amount, res, currencyCode);
            this.amount=this.currencyDetails.convertedAmount;
        })
      );
  }

  /** Method to initialize receipt form. */
  initializeReceiptForm(): void {
    this.receiptDetailsForm.get('receiptNo').setValue(this.receiptNumber);
    if (this.isEditMode) {
      this.receiptDetailsForm.get('comments').setValue(this.receipt.cancellationComments);
      this.receiptDetailsForm.get('reasonForCancellation').setValue(this.receipt.reasonForCancellation);
      this.receiptDetailsForm.get('penaltyIndicator').setValue(this.receipt.penaltyIndicator);
      if (this.receipt.cancellationReasonOthers !== null) {
        this.otherReasonFlag = true;
        this.receiptDetailsForm.get('cancellationReasonOthers').setValue(this.receipt.cancellationReasonOthers);
      }
    }
  }

  /** Method to get required documents */
  getRequiredDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getRequiredDocuments(
        BillingConstants.CANCEL_RECEIPT_DOC_TRANSACTION_ID,
        BillingConstants.CANCEL_RECEIPT_DOC_TRANSACTION_TYPE
      )
      .pipe(
        map(docs => this.documentService.removeDuplicateDocs(docs)),
        catchError(error => of(error)),
        tap(res => {
          this.documents = res;
          this.documents.forEach(doc => this.refreshDocument(doc));
        })
      );
  }

  /** Method to refresh documents after scan. */
  refreshDocument(doc: DocumentItem): void {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.receiptNumber,
          BillingConstants.CANCEL_RECEIPT_DOC_TRANSACTION_ID,
          BillingConstants.CANCEL_RECEIPT_DOC_TRANSACTION_TYPE
        )
        .pipe(
          tap(res => (doc = res)),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }

  /** Method to cancel the receipt. */
  cancelReceipt(): void {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.receiptDetailsForm);
    if (this.checkValidity()) {
      if (this.receiptDetailsForm.get('reasonForCancellation').get('english').value !== 'Other') {
        this.receiptDetailsForm.get('cancellationReasonOthers').setValue(null);
        this.cancelReceiptPayload = bindToObject(this.cancelReceiptPayload, this.receiptDetailsForm.value);
        this.cancelReceiptPayload.uuid = this.uuid;
      } else {
        this.cancelReceiptPayload = bindToObject(this.cancelReceiptPayload, this.receiptDetailsForm.value);
      }
      this.contributionPaymentService
        .cancelPayment(this.registrationNumber, this.receiptNumber, this.cancelReceiptPayload, this.isEditMode)
        .pipe(
          tap(res => {
            this.paymentResponse.fromJsonToObject(res);
            this.successMessage = this.paymentResponse.transactionMessage;
            if (!this.isEditMode) this.handleTransactionSuccess(res.transactionMessage, undefined);
          }),
          switchMap(res =>
            iif(
              () => this.isEditMode,
              this.workflowService.updateTaskWorkflow(this.setWorkflowData()).pipe(
                tap(() => {
                  this.handleTransactionSuccess(res.transactionMessage, true);
                })
              )
            )
          ),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }

  /** Method to check whether the transaction can be saved or not. */
  checkValidity(): boolean {
    let flag = true;
    if (!this.receiptDetailsForm.valid) {
      flag = false;
      this.alertService.showMandatoryErrorMessage();
    } else if (!this.documentService.checkMandatoryDocuments(this.documents)) {
      flag = false;
      this.alertService.showMandatoryDocumentsError();
    }
    return flag;
  }

  /** Method to handle transaction success. */
  handleTransactionSuccess(message: BilingualText, flag: boolean): void {
    this.alertService.showSuccess(message, null, 10);
    this.navigateBack(flag);
  }

  /** Method to set workflow data. */
  setWorkflowData(): BPMUpdateRequest {
    const data = new BPMUpdateRequest();
    data.taskId = this.routerData.taskId;
    data.user = this.routerData.assigneeId;
    data.outcome = TransactionOutcome.UPDATE;
    data.comments = this.receiptDetailsForm.get('comments').value;
    return data;
  }

  /** Method to show error alert. */
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }

  /** Method to navigate back. */
  navigateBack(flag: boolean): void {
    //flag is undefined in csr mode
    //in validator edit, false to navigate to validator, true to navigate to inbox
    if (this.modalRef) this.hideModal();
    if (this.isEditMode && flag) this.routingService.navigateToInbox();
    else if (this.isEditMode && !flag) this.routingService.navigateToValidator();
    else this.routingService.navigateToReceipt();
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to hide modal. */
  hideModal(): void {
    this.modalRef.hide();
  }
}
