/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { EstablishmentDetails, InstallmentRequest, InstallmentDetails } from '../../../../shared/models';
import { BillingRoutingService, EstablishmentService, InstallmentService } from '../../../../shared/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AlertService,
  DocumentService,
  DocumentItem,
  RouterDataToken,
  RouterData,
  TransactionReferenceData,
  TransactionService,
  Transaction,
  BilingualText
} from '@gosi-ui/core';
import { noop, Observable, throwError } from 'rxjs';
import { BillingConstants } from '../../../../shared/constants';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'blg-installment-details-sc',
  templateUrl: './installment-details-sc.component.html',
  styleUrls: ['./installment-details-sc.component.scss']
})
export class InstallmentDetailsScComponent implements OnInit {
  isOpen = false;
  canEdit = false;
  comments: TransactionReferenceData[] = [];
  docTransactionId: string;
  docTransactionType: string;
  documents: DocumentItem[] = [];
  establishmentDetails: EstablishmentDetails = new EstablishmentDetails();
  installmentDetails: InstallmentDetails = new InstallmentDetails();
  installmentDetailsForm: FormGroup;
  installmentNo: number;
  installmentId: number;
  installmentSubmittedDetails: InstallmentRequest = new InstallmentRequest();
  modalRef: BsModalRef;
  outOfMarket = false;
  referenceNumber: number;
  registrationNumber: number;
  transaction: Transaction;
  transactionNumber: number;
  transactionId: number;
  channel: BilingualText;
  /**
   *
   * @param documentService
   * @param installmentService
   * @param routerDataToken
   * @param establishmentService
   * @param billingRoutingService
   * @param modalService
   * @param alertService
   * @param router
   */
  constructor(
    readonly billingRoutingService: BillingRoutingService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly installmentService: InstallmentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly transactionService: TransactionService,
    readonly router: Router,
    readonly fb: FormBuilder
  ) {}

  /*
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.installmentDetailsForm = this.createValidateInstallmentForm();
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.registrationNumber = this.transaction?.params?.REGISTRATION_NO;
      this.installmentNo = this.transaction?.params?.INSTALLMENT_ID;
      this.transactionId = this.transaction.transactionId;
      this.channel = this.transaction.channel;
    }
    this.getKeysFromTokens();
    this.getDataForViews();
  }
  createValidateInstallmentForm() {
    return this.fb.group({
      type: [null],
      taskId: [null],
      user: [null],
      transactionNo: [null]
    });
  }
  getDataForViews(): void {
    this.establishmentService
      .getEstablishment(this.registrationNumber)
      .pipe(
        tap(response => {
          this.establishmentDetails = response;
          this.outOfMarket = this.establishmentDetails.outOfMarket;
        }),
        switchMap(() => {
          return this.installmentService
            .getValidatorInstallmentDetails(this.registrationNumber, this.installmentNo)
            .pipe(
              tap(resp => {
                this.installmentSubmittedDetails = resp;
                this.getDocParameter();
              })
            );
        }),
        switchMap(() => {
          return this.getScannedDocuments();
        }),
        catchError(error => {
          this.alertService.showError(error.error.message);
          this.showErrors(error);
          return throwError(error);
        })
      )
      .subscribe(noop, noop);
  }
  /** Method to handle error. */
  showErrors(error) {
    this.alertService.showError(error.error.message);
  }
  /** Method to get document parameters */
  getDocParameter() {
    this.installmentSubmittedDetails.guaranteeDetail.forEach(res => {
      if (res && res.category.english) {
        switch (res.category.english) {
          case 'Bank Guarantee':
            if (this.installmentSubmittedDetails?.installmentPeriodInMonths > 30) {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.BANK_GUARANTEE_EXCEPTIONAL_CASE_GOL;
              } else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.BANK_GUARANTEE_EXCEPTIONAL;
              }
            } else {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.BANK_GUARANTEE_CASE_GOL;
              } else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.BANK_GUARANTEE;
              }
            }
            break;
          case 'Promissory Note':
            if (this.installmentSubmittedDetails?.installmentPeriodInMonths > 30) {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PROMISSORY_NOTE_EXCEPTIONAL_CASE_GOL;
              } else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PROMISSORY_NOTE_EXCEPTIONAL_CASE;
              }
            } else {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PROMISSORY_NOTE_EXCEPTIONAL_CASE_GOL;
              }
              this.docTransactionId = BillingConstants.INSTALLMENT;
              this.docTransactionType = BillingConstants.PROMISSORY_NOTE;
            }
            break;
          case 'Pension':
            if (this.outOfMarket) {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PENSION_REGISTERED_CASE_GOL;
              }
              this.docTransactionId = BillingConstants.INSTALLMENT;
              this.docTransactionType = BillingConstants.PENSION_REGISTERED;
            } else {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PENSION_CLOSED_GOL;
              } else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PENSION_CLOSED;
              }
            }
            break;
          case 'Other':
            if (!this.outOfMarket && res.type.english === 'No Guarantee') {
              if (this.installmentSubmittedDetails?.installmentPeriodInMonths > 30) {
                if (this.channel.english === 'GOL') {
                  this.docTransactionId = BillingConstants.INSTALLMENT;
                  this.docTransactionType = BillingConstants.NON_COMPLIANCE_EXCEPTIONAL_CASE_GOL;
                } else {
                  this.docTransactionId = BillingConstants.INSTALLMENT;
                  this.docTransactionType = BillingConstants.NON_COMPLIANCE_EXCEPTIONAL;
                }
              } else {
                if (this.channel.english === 'GOL') {
                  this.docTransactionId = BillingConstants.INSTALLMENT;
                  this.docTransactionType = BillingConstants.NON_COMPLIANCE_GUARANTEE_CASE_GOL;
                }
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.NON_COMPLIANCE_GUARANTEE;
              }
            } else if (this.outOfMarket && res.type.english === 'Establishment owner is on a job') {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.ESTABLISHMENT_OWNER_ON_JOB_GOL;
              } else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.ESTABLISHMENT_OWNER_ON_JOB;
              }
            } else if (this.outOfMarket && this.channel.english !== 'GOL') {
              this.docTransactionId = BillingConstants.INSTALLMENT;
              this.docTransactionType = BillingConstants.DECEASED_CLOSED_EST;
            } else if (this.outOfMarket && res.type.english === 'Deceased / no source of income') {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.DECEASED_CLOSED_EST_GOL;
              } else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.DECEASED_CLOSED_EST;
              }
            }else if (res.type.english === 'Special Request'){
              this.docTransactionId = BillingConstants.INSTALLMENT;
              this.docTransactionType = BillingConstants.SPECIAL_REQUEST;
            }
            break;
        }
      }
    });
  }

  /** Method to read keys from token. */
  getKeysFromTokens(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.registrationNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
      this.installmentNo = payload.installmentId;
    }
    if (this.routerDataToken.comments.length > 0) this.comments = this.routerDataToken.comments;
    this.transactionNumber = this.routerDataToken.transactionId;
  }

  /** Method to get documents. */
  getScannedDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(this.docTransactionId, this.docTransactionType, this.registrationNumber, this.referenceNumber)
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.installmentDetailsForm.updateValueAndValidity();
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  hideModal() {
    this.modalRef.hide();
  }
}
