/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  BaseComponent,
  BilingualText,
  convertToYYYYMMDD,
  DocumentItem,
  DocumentService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { BillingConstants } from '../../constants';
import {
  BulkPenaltyEntityCountDetails,
  EstablishmentDetails,
  PenalityWavier,
  PenaltyWaiverRequest,
  PenaltyWaiverSegmentRequest,
  PreviousInstallment
} from '../../models';
import { BillingRoutingService, EstablishmentService, InstallmentService, PenalityWavierService } from '../../services';

@Directive()
export abstract class EstablishmentPenalityWavierBaseScComponent extends BaseComponent {
  /** Local variables */

  idNumber: number;
  establishmentCount: number;
  entity = 'ESTABLISHMENT';
  establishmentDetails: EstablishmentDetails;
  wavierDetails: PenalityWavier = new PenalityWavier();
  penalityWaiverSelectedReason: BilingualText = new BilingualText();
  penalityWaiverSelectedOtherReason: string;
  documents: DocumentItem[] = [];
  isAppPrivate: boolean;
  searchOption: string;
  documentTransactionId = BillingConstants.PENALTY_WAIVER_DOCUMENT_TRANSACTION_ID;
  bulkpenaltyCount: BulkPenaltyEntityCountDetails;
  receiptNumber: number;
  requestNo: number;
  referenceNumber: number;
  penaltyWaiveId: number;
  eligibleWaiveOffAmount: number;
  wavierDetailsReq: PenaltyWaiverRequest;
  wavierSegmentDetailsReq: PenaltyWaiverSegmentRequest;
  exceptionReason: string;
  extendedGracePeriod: number;
  paymentRequired = true;
  waviePenalityPercentage: number;
  registrationNumber: number;
  lang = 'en';
  waiverDetailsOnEdit: PenalityWavier;
  waiverDetailsOn: PenaltyWaiverSegmentRequest;
  establishmentSegment;
  establishmentSegmentMultiSelect;
  fromDate;
  toDate;
  modalRef: BsModalRef;
  id: number;
  inWorkflow = false;
  establishmentSegmentMultiSelectValues: string;
  isCommentsPresent = false;
  previousInstallment: PreviousInstallment[];
  uuid: string;
  csvUploadFlag: string;
  csvDataList = [];
  isPpa: boolean;
  /**
   * Creates an instance of EstablishmentPenalityWavierBaseScComponent
   * @param lookupService lookup service
   * @param contributionPaymentService contribution payment service
   * @param establishmentService establishment service
   * @param alertService alert service
   * @param documentService document service
   */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly penalityWavierService: PenalityWavierService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly routingService: BillingRoutingService,
    readonly alertService: AlertService,
    readonly installmentService: InstallmentService,
    readonly modalService: BsModalService
  ) {
    super();
  }
  getDataForView() {
    if (this.searchOption === 'registration') {
      this.getEstablishmentDetails();
      this.penalityWavierService.getWavierPenalityDetailsForView(this.idNumber, this.penaltyWaiveId).subscribe(
        resp => {
          if (resp) {
            this.waiverDetailsOnEdit = resp;
            this.penalityWaiverSelectedReason = this.waiverDetailsOnEdit.exceptionReason;
            if (this.waiverDetailsOnEdit?.terms.extendedGracePeriod > 0)
              this.penalityWaiverSelectedOtherReason = this.waiverDetailsOnEdit.exceptionReasonOthers;
            else this.penalityWaiverSelectedOtherReason = this.waiverDetailsOnEdit.extensionReason;
          }
        },
        err => this.alertService.showError(err.error.message)
      );
    } else {
      this.penalityWavierService.getExceptionalBulkDetails(this.penaltyWaiveId).subscribe(res => {
        this.waiverDetailsOn = res;
        this.bulkpenaltyCount = this.waiverDetailsOn.quote;
        this.waiverDetailsOnEdit = new PenalityWavier();
        this.penalityWaiverSelectedReason = this.waiverDetailsOn.reason;
        this.penalityWaiverSelectedOtherReason = this.waiverDetailsOn.reasonOthers;
        this.establishmentSegment = this.waiverDetailsOn.selectedCriteria.segment.name;
        this.establishmentSegmentMultiSelect = this.waiverDetailsOn.selectedCriteria.segment.values;
        this.waiverDetailsOnEdit.waiverStartDate = this.waiverDetailsOn.waiverStartDate;
        this.waiverDetailsOnEdit.waiverEndDate = this.waiverDetailsOn.waiverEndDate;
        this.waiverDetailsOnEdit.waivedPenaltyPercentage = this.waiverDetailsOn.waivedPenaltyPercentage;
        if (this.waiverDetailsOn?.selectedCriteria?.registrationNo.length > 0) {
          this.csvDataList = this.waiverDetailsOn?.selectedCriteria?.registrationNo;
          this.csvUploadFlag = 'csvUploadEst';
        }
        this.getBulkPenaltyWaiverQuoteEstDetails(
          this.establishmentSegment?.english,
          this.establishmentSegmentMultiSelect,
          this.entity
        );
      });
    }
    this.getScannedDocuments(this.referenceNumber);
  }
  /**
   * Method to get installment details
   * */
  getInstallmentDetails(registrationNo: number) {
    this.installmentService.getInstallmentactive(registrationNo, false).subscribe(res => {
      this.previousInstallment = res['installmentDetails'];
    });
  }
  /** This method is used to search establishment details.
   * @param idNumber
   * @param branchRequired
   */
  getEstablishmentDetails() {
    this.establishmentService.getEstablishment(this.idNumber).subscribe(establishment => {
      this.establishmentDetails = establishment;
      this.isPpa = establishment.ppaEstablishment;
      this.getPenalityAccountDetailsForEstablishment();
    }, noop);
  }
  /** Method is used to get waive establishment penalty details */
  getPenalityAccountDetailsForEstablishment() {
    this.penalityWavierService
      .getWavierPenalityDetails(this.idNumber, 'SPECIAL', this.fromDate, this.toDate)
      .pipe(tap(res => (this.wavierDetails = res)))
      .subscribe(noop, noop);
  }
  /** Method to get available waive off amount. */
  getWaiverAmount(period) {
    if (period !== null) {
      this.fromDate = convertToYYYYMMDD(period[0]);
      this.toDate = convertToYYYYMMDD(period[1]);
      if (this.searchOption === 'registration') this.getPenalityAccountDetailsForEstablishment();
    } else {
      this.penalityWavierService
        .getWavierPenalityDetails(this.idNumber, 'SPECIAL')
        .pipe(tap(res => (this.wavierDetails = res)))
        .subscribe(noop, noop);
    }
  }
  /** Method to get required documents */
  getRequiredDocuments() {
    this.documentService
      .getRequiredDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE
      )
      .pipe(
        map(docs => this.documentService.removeDuplicateDocs(docs)),
        catchError(error => of(error))
      )
      .subscribe(doc => (this.documents = doc), noop);
  }
  /** Method to hide modal. */
  hideModal(): void {
    if (this.modalRef !== undefined) {
      this.modalRef.hide();
    }
  }
  //  * Method to show modal template*/
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  /** Method to get calculated waive off amount */
  passEligiblePenaltyAmount(waiveOffAmt) {
    this.eligibleWaiveOffAmount = waiveOffAmt.eligiblePenlaityAmt;
    this.waviePenalityPercentage = waiveOffAmt.wavieOffPercentage;
  }
  /** Method to fetch scanned document details. */
  getScannedDocuments(referenceNo) {
    this.documentService
      .getDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
        this.searchOption === 'registration' ? this.idNumber : this.penaltyWaiveId,
        referenceNo
      )
      .subscribe(doc => (this.documents = doc));
    this.documents.forEach(doc => {
      this.refreshDocuments(doc);
    });
  }
  /**
   * method to get payment requires values
   * @param paymentValues
   */
  getPaymentValue(Values) {
    this.paymentRequired = Values;
  }
  /** Method to refresh documents after scan. */
  refreshDocuments(doc: DocumentItem): void {
    if (doc && doc.name) {
      if (this.searchOption === 'registration') {
        this.id = this.idNumber;
      } else {
        if (!this.inWorkflow) this.id = 0;
        else this.id = this.penaltyWaiveId;
      }
      this.documentService
        .refreshDocument(
          doc,
          this.id,
          BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
          BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
          this.inWorkflow ? this.referenceNumber : null,
          null,
          this.uuid
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

  /** Method to show error alert. */
  showError(errors): void {
    this.alertService.showError(errors.error.message, errors.error.details);
  }
  //  * Method to get bulk penalty waiver details */
  getBulkPenaltyWaiverQuoteEstDetails(establishmentSegment, establishmentSegmentMultiSelectValues, entity) {
    {
      if (establishmentSegmentMultiSelectValues?.length > 0) {
        for (let i = 0; i < establishmentSegmentMultiSelectValues?.length; i++) {
          if (establishmentSegmentMultiSelectValues?.length === 1) {
            this.establishmentSegmentMultiSelectValues =
              'segmentCriteriaValues=' + establishmentSegmentMultiSelectValues[i]?.english;
          } else {
            if (i === 0) {
              this.establishmentSegmentMultiSelectValues =
                'segmentCriteriaValues=' + establishmentSegmentMultiSelectValues[i]?.english;
            } else {
              this.establishmentSegmentMultiSelectValues +=
                '&segmentCriteriaValues=' + establishmentSegmentMultiSelectValues[i]?.english;
            }
          }
        }
      }
    }
    if (this.establishmentSegmentMultiSelectValues === undefined) {
      this.penalityWavierService
        .getBulkPenaltyWaiverQuoteForAll(establishmentSegment, entity)
        .pipe(tap(res => (this.bulkpenaltyCount = res)))
        .subscribe(noop, noop);
    } else {
      this.penalityWavierService
        .getBulkPenaltyWaiverQuote(establishmentSegment, this.establishmentSegmentMultiSelectValues, entity)
        .pipe(tap(res => (this.bulkpenaltyCount = res)))
        .subscribe(noop, noop);
    }
  }
}
