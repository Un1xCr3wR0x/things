/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  BPMMergeUpdateParamEnum,
  BPMUpdateRequest,
  BilingualText,
  CurrencySar,
  DocumentItem,
  DocumentService,
  ExchangeRateService,
  LookupService,
  LovList,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService,
  scrollToTop
} from '@gosi-ui/core';
import { TransactionService } from '@gosi-ui/foundation/transaction-tracing/lib/services';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BillingConstants } from '../../../shared/constants';
import {
  CurrencyArabic,
  CurrencyArabicShortForm,
  EstablishmentDocumentType,
  MCITransaction,
  MOFDocumentType,
  Months,
  PaymentHeader,
  ReceiptType,
  ValidatorRoles
} from '../../../shared/enums';
import { CurrencyDetails, EstablishmentDetails, PaymentDetails } from '../../../shared/models';
import {
  BillingRoutingService,
  ContributionPaymentService,
  EstablishmentService,
  EventDateService
} from '../../../shared/services';
import { assembleCurrencyDetails, createBilingualObject } from '../../../shared/utils';

@Component({
  selector: 'blg-validate-payment-sc',
  templateUrl: './validate-payment-sc.component.html',
  styleUrls: ['./validate-payment-sc.component.scss']
})
export class ValidatePaymentScComponent implements OnInit {
  //Local variables
  comments: TransactionReferenceData[] = [];
  modalRef: BsModalRef;
  rejectReasonList: Observable<LovList>;
  returnReasonList: Observable<LovList>;
  paymentDocumentList: DocumentItem[] = [];
  establishmentInfo: EstablishmentDetails;
  paymentDetails: PaymentDetails;
  currency: BilingualText;
  paymentValidatorForm: FormGroup;
  showContent = false;
  canReturn = false;
  gccFlag = false;
  isGOL = false;
  isMOF = false;
  mainHeading: string;
  rejectHeading: string;
  returnHeading: string;
  currencyDetails: CurrencyDetails;
  paymentbillBatchIndicator = false;
  isEditApprove = false;
  isShow = false;
  transaction: Transaction[] = [];
  initialDate1: Date;
  initialDate2: Date;
  isDate: boolean;
  trans: Transaction;
  isReopenClosingInProgress: boolean;

  /**
   * Creates an instance of ContributionPaymentScComponent.
   * @param fb
   * @param documentService
   * @param validatorService
   * @param alertService
   * @param lookUpService
   * @param modalService
   * @param router
   * @param validatorDataToken
   */
  constructor(
    private fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly validatorService: ContributionPaymentService,
    private alertService: AlertService,
    private lookUpService: LookupService,
    readonly modalService: BsModalService,
    readonly establishmentService: EstablishmentService,
    readonly exchangeRateService: ExchangeRateService,
    readonly billingRoutingService: BillingRoutingService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly eventService: EventDateService,
    readonly transactionService: TransactionService
  ) {}

  /** This method is to initialize the component. */
  ngOnInit() {
    scrollToTop();
    this.paymentValidatorForm = this.createForm();
    if (this.routerDataToken.taskId) {
      this.showContent = true;
      this.initialiseTheView(this.routerDataToken);
    }
    this.rejectReasonList = this.lookUpService.getEstablishmentRejectReasonList();
    this.returnReasonList = this.lookUpService.getEstablishmentRejectReasonList();
  }

  /** Method to create a form for transaction data. */
  createForm() {
    return this.fb.group({
      taskId: [null],
      receiptNumber: [null],
      user: [null],
      type: [null]
    });
  }

  /** Method to initialse the inbox view. */
  initialiseTheView(validatorDataToken: RouterData) {
    const payload = JSON.parse(validatorDataToken.payload);
    if (this.routerDataToken.assignedRole === Role.VALIDATOR_2 || payload.channel === 'gosi-online') {
      this.canReturn = true;
      this.isGOL = payload.channel === 'gosi-online' ? true : false;
    }
    if (validatorDataToken.comments.length > 0) {
      this.comments = validatorDataToken.comments;
    }
    this.isMOF =
      validatorDataToken.resourceType === RouterConstants.TRANSACTION_RECEIVE_CONTRIBUTION_MOF ? true : false;
    this.bindDataToForm(validatorDataToken);
    this.currencyDetails = new CurrencyDetails(
      createBilingualObject(CurrencySar.ENGLISH, CurrencyArabicShortForm[CurrencySar.ENGLISH])
    );
    this.getDataForView(payload);
  }

  /** Method to get required data to view transaction. */
  getDataForView(payload) {
    if (!this.isMOF) {
      this.establishmentService.getEstablishment(payload.registrationNo).subscribe(res => {
        this.establishmentInfo = res;
        this.isReopenClosingInProgress = res?.status?.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS ? true : false;
        //console.log("1",this.isReopenClosingInProgress)
        if (this.establishmentInfo.gccEstablishment != null) {
          this.gccFlag = true;
        }
        this.validatorService
          .getReceiptDetails(payload.registrationNo, payload.id, this.isMOF, ReceiptType.PARENT_RECEIPT)
          .pipe(
            tap(receipt => {
              this.paymentDetails = new PaymentDetails().fromJsonToObject(receipt);
              this.paymentbillBatchIndicator = receipt.billBatchIndicator;
              //this.getTransaction(payload.registrationNo);
              if (this.paymentbillBatchIndicator) {
                this.alertService.setInfoByKey('BILLING.SERVICE-MAINTANACE');
                this.isEditApprove = true;
              }
              if (this.gccFlag && this.paymentDetails.amountReceived.currency !== CurrencySar.ENGLISH) {
                //To get conversion rate for gcc establishments.
                this.checkConversionRate(
                  {
                    transactionDate: moment(this.paymentDetails.transactionDate.gregorian).format('YYYY-MM-DD'),
                    countryCode: this.paymentDetails.amountReceived.currency
                  },
                  Months
                );
              } else {
                this.currency = createBilingualObject(
                  CurrencySar.ENGLISH,
                  CurrencyArabicShortForm[CurrencySar.ENGLISH]
                );
              }
              this.getScreenHeaders();
            }),
            switchMap(() => {
              return this.getDocuments(payload.id, this.paymentDetails.receiptMode.english);
            }),
            switchMap(() => {
              return this.transactionService
                .getMCITransactions(payload.registrationNo, MCITransaction.legalEntity)
                .pipe(
                  tap(res => {
                    this.transaction = res.listOfTransactionDetails;
                    this.getCompareDates();
                  })
                );
            }),
            switchMap(() => {
              return this.transactionService.getMCITransactions(payload.registrationNo, MCITransaction.Delink).pipe(
                tap(res => {
                  this.transaction = res.listOfTransactionDetails;
                  this.getCompareDates();
                })
              );
            })
          )
          .subscribe();
      });
    } else {
      this.getScreenHeaders();
      this.validatorService
        .getReceiptDetails(1, payload.id, this.isMOF, ReceiptType.PARENT_RECEIPT)
        .pipe(tap(receipt => (this.paymentDetails = new PaymentDetails().fromJsonToObject(receipt))))
        .subscribe();
    }
  }
  getCompareDates() {
    for (let i = 0; i < this.transaction[i].transactionId; i++) {
      if (
        (this.transaction[i].channel.english === 'mci' || this.transaction[i].channel.english === 'hrsd') &&
        (this.transaction[i].transactionId == 300314 || this.transaction[i].transactionId == 300318)
      ) {
        this.initialDate1 = new Date(this.transaction[i].initiatedDate?.gregorian.toString());
        this.initialDate2 = new Date(this.paymentDetails?.initiatedDate.gregorian.toString());
        this.isDate = this.initialDate1 > this.initialDate2 ? true : false;
        if (this.isDate === true) {
          this.isShow = true;
        }
      } 
    }
  }
  /** Method to get screen headings */
  getScreenHeaders() {
    if (this.isGOL) {
      if (this.gccFlag) {
        this.mainHeading = PaymentHeader.GCC_PAYMENT_NOTICE;
        this.rejectHeading = PaymentHeader.GCC_PAYMENT_NOTICE_REJECT;
        this.returnHeading = PaymentHeader.GCC_PAYMENT_NOTICE_RETURN;
      } else {
        this.mainHeading = PaymentHeader.EST_PAYMENT_NOTICE;
        this.rejectHeading = PaymentHeader.EST_PAYMENT_NOTICE_REJECT;
        this.returnHeading = PaymentHeader.EST_PAYMENT_NOTICE_RETURN;
      }
    } else {
      if (this.isMOF) {
        this.mainHeading = PaymentHeader.RECEIVE_PAYMENT_MOF;
        this.rejectHeading = PaymentHeader.RECEIVE_PAYMENT_MOF_REJECT;
        this.returnHeading = PaymentHeader.RECEIVE_PAYMENT_MOF_RETURN;
      } else if (this.gccFlag) {
        this.mainHeading = PaymentHeader.RECEIVE_GCC_PAYMENT;
        this.rejectHeading = PaymentHeader.RECEIVE_PAYMET_GCC_REJECT;
        this.returnHeading = PaymentHeader.RECEIVE_PAYMET_GCC_RETURN;
      } else {
        this.mainHeading = PaymentHeader.RECEIVE_PAYMENT;
        this.rejectHeading = PaymentHeader.RECEIVE_PAYMENT_REJECT;
        this.returnHeading = PaymentHeader.RECEIVE_PAYMENT_RETURN;
      }
    }
  }

  /** Method to bind data to the form. */
  bindDataToForm(validatorDataToken: RouterData) {
    this.paymentValidatorForm.get('taskId').setValue(validatorDataToken.taskId);
    this.paymentValidatorForm.get('user').setValue(validatorDataToken.assigneeId);
    this.paymentValidatorForm.get('receiptNumber').setValue(validatorDataToken.transactionId);
    this.paymentValidatorForm.get('type').setValue(validatorDataToken.resourceType);
  }

  /** Method to retrieve documents scanned for the transaction. */
  getDocuments(receiptNo: number, receiptMode: string): Observable<DocumentItem[]> {
    const key = receiptMode.replace(/\s/g, '_').toUpperCase();
    let transactionType: string;
    if (this.isMOF) {
      transactionType = MOFDocumentType[key];
    } else {
      transactionType = EstablishmentDocumentType[key];
    }
    return this.documentService.getDocuments(BillingConstants.SCAN_TRANSACTION_ID, transactionType, receiptNo).pipe(
      tap(res => {
        this.paymentDocumentList = res.filter(item => item.documentContent !== null);
      })
    );
  }

  /**
   * Method to get conversion rate for a gcc country.
   * @param currencyCode currency code
   */
  getConversionRates(currencyDetails) {
    this.exchangeRateService
      .getExchangeRate(currencyDetails?.countryCode, CurrencySar.ENGLISH, currencyDetails?.transactionDate)
      .subscribe(res => {
        this.currencyDetails = assembleCurrencyDetails(
          this.paymentDetails.amountReceived.amount,
          res,
          currencyDetails?.countryCode
        );
        this.currency = createBilingualObject(
          currencyDetails?.countryCode,
          CurrencyArabic[currencyDetails?.countryCode]
        );
      });
  }
  checkConversionRate(currencyDetails, months) {
    const month = this.getMonthFromDate(new Date(currencyDetails?.transactionDate));
    const checkMonth = 'BILLING.' + 'CALENDAR.' + month.toUpperCase();
    if (checkMonth === months.january) {
      this.getEventDates(currencyDetails);
    } else {
      this.getConversionRates(currencyDetails);
    }
  }
  /** Method to get event date details*/
  getEventDates(values) {
    if (values) {
      const eventDate = values.transactionDate ? values.transactionDate : values[0].transactionDate;
      const year = moment(eventDate).toDate().getFullYear() - 1;
      if (year) {
        this.eventService.getEventDetailsByDate(year, 12, year, 12, 'APPROVED').subscribe(res => {
          if (res.eventDateInfo && res.eventDateInfo[0] && res.eventDateInfo[0].eventDate) {
            const eventDifference = moment(res.eventDateInfo[0].eventDate.gregorian).diff(moment(eventDate));
            if (eventDifference >= 0) {
              const transDate = moment(eventDate).toDate().getFullYear() - 1 + '-12-31';
              this.getConversionRates({ transactionDate: transDate, countryCode: values.countryCode });
            } else
              this.getConversionRates({ transactionDate: values.transactionDate, countryCode: values.countryCode });
          }
        });
      }
    }
  }
  /**
   * Method to show approve modal.
   * @param templateRef
   */
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.paymentValidatorForm.updateValueAndValidity();
    this.showModal(templateRef);
  }

  /**
   * Method to show reject modal.
   * @param templateRef
   */
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.paymentValidatorForm.updateValueAndValidity();
    this.showModal(templateRef);
  }

  /**
   * Method to show return modal.
   * @param templateRef
   */
  returnTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.paymentValidatorForm.updateValueAndValidity();
    this.showModal(templateRef);
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /**
   * This method is to hide the modal reference.
   * @param modalRef
   */

  hideModal() {
    this.modalRef.hide();
  }

  //Method to reject the transaction.
  confirmReject() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.outcome = WorkFlowActions.REJECT;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.isExternalComment =
      this.isGOL && this.routerDataToken.assignedRole === ValidatorRoles.VALIDATOR_ONE;
    bpmUpdateRequest.payload = this.routerDataToken.content;
    bpmUpdateRequest.commentScope = 'BPM';
    if (this.paymentValidatorForm) {
      if (this.paymentValidatorForm.get('comments'))
        bpmUpdateRequest.comments = this.paymentValidatorForm.value.comments;
      if (this.paymentValidatorForm.get('rejectionReason')) {
        bpmUpdateRequest.updateMap.set(
          BPMMergeUpdateParamEnum.REJECTION_REASON_ARB,
          this.paymentValidatorForm.get('rejectionReason').value.arabic
        );
        bpmUpdateRequest.updateMap.set(
          BPMMergeUpdateParamEnum.REJECTION_REASON_ENG,
          this.paymentValidatorForm.get('rejectionReason').value.english
        );
      }
    }
    this.workflowService.mergeAndUpdateTask(bpmUpdateRequest).subscribe(
      () => {
        this.navigateToInbox(BillingConstants.TRANSACTION_REJECTED);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }

  //Method to approve the transaction.
  confirmApprove() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.outcome = WorkFlowActions.APPROVE;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.commentScope = 'BPM';
    if (this.paymentValidatorForm) {
      if (this.paymentValidatorForm.get('comments'))
        bpmUpdateRequest.comments = this.paymentValidatorForm.value.comments;
    }
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest, WorkFlowActions.APPROVE).subscribe(
      () => {
        if (
          this.routerDataToken.assignedRole === Role.VALIDATOR_1 &&
          this.routerDataToken.state === WorkFlowActions.RETURN
        )
          this.navigateToInbox('BILLING.VALIDATOR-SUCCESS-MESSAGE');
        else this.navigateToInbox(BillingConstants.TRANSACTION_APPROVED);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }

  //Method to return the transaction.
  confirmReturn() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.outcome = WorkFlowActions.RETURN;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.commentScope = 'BPM';
    if (this.paymentValidatorForm) {
      if (this.paymentValidatorForm.get('comments'))
        bpmUpdateRequest.comments = this.paymentValidatorForm.value.comments;
      if (this.paymentValidatorForm.get('returnReason'))
        bpmUpdateRequest.rejectionReason = this.paymentValidatorForm.value.returnReason;
    }
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest, WorkFlowActions.RETURN).subscribe(
      () => {
        this.navigateToInbox(BillingConstants.TRANSACTION_RETURNED);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }

  /**
   * Method to navigate on validator actions
   * @param response
   */
  navigateToInbox(message) {
    if (message) {
      this.alertService.showSuccessByKey(message, null, 5);
    }
    this.billingRoutingService.navigateToInbox();
  }

  /** Method to navigate to capture details screen on edit.  */
  navigateToCapture() {
    this.routerDataToken.tabIndicator = 0;
    this.billingRoutingService.navigateToEdit();
  }

  /** Method to navigate to scan documents screen on edit. */
  navigateToScan() {
    this.routerDataToken.tabIndicator = 1;
    this.billingRoutingService.navigateToEdit();
  }

  confirmCancel() {
    this.decline();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  //*@memberof ValidatorScComponent
  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Method to get month from a given date
   * @param date date
   */
  getMonthFromDate(date: Date): string {
    return Object.keys(Months)[moment(date).toDate().getMonth()];
  }
}
