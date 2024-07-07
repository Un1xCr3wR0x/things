/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  AlertService,
  BaseComponent,
  BilingualText,
  DocumentItem,
  DocumentService,
  TransactionReferenceData
} from '@gosi-ui/core';
import { throwError } from 'rxjs';
import { noop } from 'rxjs/internal/util/noop';
import { catchError, tap } from 'rxjs/operators';
import { BulkPenaltyEntityCountDetails, PenalityWavier, PenaltyWaiverSegmentRequest } from '../../models';
import { PenalityWavierService } from '../../services';

@Directive()
export abstract class VicPenaltyWaiverBaseScComponent extends BaseComponent {
  constructor(
    readonly penaltyWavierService: PenalityWavierService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService
  ) {
    super();
  }
  // Local Variables
  penalityWaiverSelectedReason: BilingualText = new BilingualText();
  wavierDetailsOnEdit: PenalityWavier;
  segmentDetailsOnEdit: PenaltyWaiverSegmentRequest;
  vicSegment: BilingualText = new BilingualText();
  bulkpenaltyCount: BulkPenaltyEntityCountDetails;
  vicSegmentMultiSelect;
  penalityWaiverSelectedOtherReason: string;
  searchOption = '';
  penaltyWaiverId: number;
  segmentDetails: PenalityWavier;
  documents: DocumentItem[] = [];
  csvUploadFlag: string;
  csvSinDataList = [];
  vicSegmentMultiSelectValues: string;
  exceptionReason: string;
  extendedGracePeriod: number;
  paymentRequired: boolean;
  comments: TransactionReferenceData[] = [];
  isEditFlag: boolean;
  referenceNumber: number;
  reqNo: number;
  vicSegmentValidator: boolean;
  idNumber: number;
  isCommentsPresent = false;
  /** Method to get required data to view transaction. */
  getDataForBulkExceptionalVicEdit(penaltyWaiverId): void {
    this.penaltyWavierService
      .getExceptionalBulkDetails(penaltyWaiverId)
      .pipe(
        tap(res => {
          this.segmentDetailsOnEdit = res;
          this.vicSegment = this.segmentDetailsOnEdit.selectedCriteria.segment.name;
          this.vicSegmentMultiSelect = this.segmentDetailsOnEdit.selectedCriteria.segment.values;
          this.bulkpenaltyCount = this.segmentDetailsOnEdit.quote;
          this.wavierDetailsOnEdit = new PenalityWavier();
          this.penalityWaiverSelectedReason = this.segmentDetailsOnEdit.reason;
          this.penalityWaiverSelectedOtherReason = this.segmentDetailsOnEdit.reasonOthers;
          this.wavierDetailsOnEdit.waiverStartDate = this.segmentDetailsOnEdit.waiverStartDate;
          this.wavierDetailsOnEdit.waiverEndDate = this.segmentDetailsOnEdit.waiverEndDate;
          this.wavierDetailsOnEdit.waivedPenaltyPercentage = this.segmentDetailsOnEdit.waivedPenaltyPercentage;
          if (this.segmentDetailsOnEdit?.selectedCriteria?.sin.length > 0) {
            this.csvSinDataList = this.segmentDetailsOnEdit?.selectedCriteria?.sin;
            this.csvUploadFlag = 'csvUploadVic';
          }
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get required data to view transaction. */
  getDataForVicExceptionalEdit(sinNumber, reqNo): void {
    this.penaltyWavierService
      .getExceptionalVicDetails(sinNumber, reqNo)
      .pipe(
        tap(val => {
          this.wavierDetailsOnEdit = val;
          this.penalityWaiverSelectedReason = this.wavierDetailsOnEdit.exceptionReason;
          this.penalityWaiverSelectedOtherReason = this.wavierDetailsOnEdit.exceptionReasonOthers;
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to show error alert. */
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }
  //Method to check form validity
  checkValidity(form: FormGroup) {
    if (!this.documentService.checkMandatoryDocuments(this.documents)) {
      this.alertService.showMandatoryDocumentsError();
      if (!form.valid) this.alertService.showMandatoryErrorMessage();
      return false;
    } else if (form) {
      return form.valid;
    } else {
      return true;
    }
  }

  //  * Method to get bulk penalty waiver details */
  getBulkPenaltyWaiverQuoteDetails(vicSegment, vicSegmentMultiSelectValues, entity) {
    if (vicSegmentMultiSelectValues?.length > 0) {
      for (let i = 0; i < vicSegmentMultiSelectValues?.length; i++) {
        if (vicSegmentMultiSelectValues?.length === 1) {
          this.vicSegmentMultiSelectValues = 'segmentCriteriaValues=' + vicSegmentMultiSelectValues[i]?.english;
        } else {
          if (i === 0) {
            this.vicSegmentMultiSelectValues = 'segmentCriteriaValues=' + vicSegmentMultiSelectValues[i]?.english;
          } else {
            this.vicSegmentMultiSelectValues += '&segmentCriteriaValues=' + vicSegmentMultiSelectValues[i]?.english;
          }
        }
      }
    }
    if (this.vicSegmentMultiSelectValues === undefined) {
      this.penaltyWavierService
        .getBulkPenaltyWaiverQuoteForAll(vicSegment, entity)
        .pipe(tap(res => (this.bulkpenaltyCount = res)))
        .subscribe(noop, noop);
    } else {
      this.penaltyWavierService
        .getBulkPenaltyWaiverQuote(vicSegment, this.vicSegmentMultiSelectValues, entity)
        .pipe(tap(res => (this.bulkpenaltyCount = res)))
        .subscribe(noop, noop);
    }
  }
  //method to get extended values
  getExtensionValues(extensionValues) {
    this.exceptionReason = extensionValues.extensionreason;
    this.extendedGracePeriod = extensionValues.extendedGrace;
    this.paymentRequired = extensionValues.paymentRequires;
  }

  //method to get payment requires values
  getPaymentValue(paymentValues) {
    this.paymentRequired = paymentValues;
  }
}
