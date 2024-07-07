/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject, OnDestroy, TemplateRef } from '@angular/core';
import {
  AlertService,
  DocumentService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  LanguageToken,
  DocumentItem,
  convertToYYYYMMDD,
  BilingualText,
  bindToObject,
  UuidGeneratorService,
  RouterData,
  RouterDataToken,
  RouterConstants,
  BPMUpdateRequest,
  WorkflowService,
  TransactionReferenceData,
  markFormGroupTouched,
  WorkFlowActions
} from '@gosi-ui/core';
import { BehaviorSubject, noop, throwError, of } from 'rxjs';
import { BillingRoutingService, PenalityWavierService } from '../../../shared/services';
import { BillingConstants } from '../../../shared/constants';
import { catchError, tap, map } from 'rxjs/operators';
import {
  PenalityWavier,
  PenaltyWaiverRequest,
  PaymentResponse,
  BulkPenaltyEntityCountDetails
} from '../../../shared/models';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PenaltyWaiverSegmentRequest } from '../../../shared/models/penalty-waiver-segment-request';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VicPenaltyWaiverBaseScComponent } from '../../../shared/components/base/vic-penalty-waiver-base-sc.component';
@Component({
  selector: 'blg-vic-penalty-waiver-sc',
  templateUrl: './vic-penalty-waiver-sc.component.html',
  styleUrls: ['./vic-penalty-waiver-sc.component.scss']
})
export class VicPenaltyWaiverScComponent extends VicPenaltyWaiverBaseScComponent implements OnInit, OnDestroy {
  // local variables
  vicSegmentValue = '';
  isAppPrivate: boolean;
  lang = 'en';
  sinNumber: number;
  wavierDetails: PenalityWavier = new PenalityWavier();
  fromDate;
  wavierSegmentDetailsReq: PenaltyWaiverSegmentRequest = new PenaltyWaiverSegmentRequest();
  toDate;
  exceptionalPenalityMainForm: FormGroup = new FormGroup({});
  eligibleWaiveOffAmount: number;
  penalityWaiverSelectedReason: BilingualText = new BilingualText();
  penalityWaiverSelectedOtherReason: string;
  wavierDetailsRequest: PenaltyWaiverRequest = new PenaltyWaiverRequest();
  exceptionReason: string;
  extendedGracePeriod: number;
  paymentRequired = true;
  paymentResponses: PaymentResponse = new PaymentResponse();
  waviePenalityPercentage: number;
  uuid: string;
  bulkSin = [];
  documentTransactionId = BillingConstants.PENALTY_WAIVER_DOCUMENT_TRANSACTION_ID;
  successMessage: BilingualText;
  searchOption = '';
  vicSegment: BilingualText = new BilingualText();
  vicSegmentMultiSelect;
  modalRef: BsModalRef;
  entity = 'VIC';

  constructor(
    readonly alertService: AlertService,
    readonly routingService: BillingRoutingService,
    readonly penaltyWavierService: PenalityWavierService,
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly modalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private uuidGeneratorService: UuidGeneratorService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService
  ) {
    super(penaltyWavierService, alertService, documentService);
  }

  // This method is used to initialise the component on loading
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    //method to check whether the transaction in workflow or not
    this.identifyTheTransaction();
    if (this.isEditFlag) {
      if (this.routerDataToken.payload) {
        const payload = JSON.parse(this.routerDataToken.payload);
        this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
        this.reqNo = payload.id ? Number(payload.id) : null;
        this.sinNumber = payload.sin ? Number(payload.sin) : null;
        this.penaltyWaiverId = payload.waiverId ? Number(payload.waiverId) : null;
        if (this.routerDataToken.resourceType === RouterConstants.TRANSACTION_VIC_EXCEPTIONAL_ESTABLISHMENT_PENALTY) {
          this.searchOption = 'SIN';
          this.idNumber = this.sinNumber;
          this.getDataForVicExceptionalEdit(this.sinNumber, this.reqNo);
        } else if (this.routerDataToken.resourceType === RouterConstants.TRANSACTION_VIC_EXCEPTIONAL_BULK_PENALTY) {
          this.getVicSegmentEditDetails();
          this.searchOption = 'vicSegmentation';
          this.idNumber = this.penaltyWaiverId;
        }
        if (this.routerDataToken.comments) {
          if (this.routerDataToken.comments.length > 0) {
            this.comments = this.routerDataToken.comments;
            this.isCommentsPresent = true;
          }
        }
      }
    }
    this.csvSinDataList = this.penaltyWavierService.getPenalityWaiverBulkFileContent();
    if (!this.isEditFlag) {
      this.route.queryParams.subscribe(params => {
        if (params?.searchOption === 'SIN') {
          this.idNumber = params?.sin;
          this.sinNumber = this.idNumber;
        } else {
          this.idNumber = 0;
        }
        this.searchOption = params?.searchOption;
        this.csvUploadFlag = this.searchOption;
      }, noop);
    }
    this.getReason();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;

    /**UUID generator for scan and upload */
    if (!this.isEditFlag) {
      this.uuid = this.uuidGeneratorService.getUuid(); // Should not generate uuid for validator view.
    }
  }
  getReason() {
    if (this.penaltyWavierService.getPenalityWaiverReason()) {
      this.penalityWaiverSelectedReason = this.penaltyWavierService.getPenalityWaiverReason();
    }
    if (this.penaltyWavierService.getPenalityWaiverOtherReason()) {
      this.penalityWaiverSelectedOtherReason = this.penaltyWavierService.getPenalityWaiverOtherReason();
    }
    if (this.penaltyWavierService.getVicSegments()) {
      this.vicSegment = this.penaltyWavierService.getVicSegments();
    }
    if (this.penaltyWavierService.getSegments()) {
      this.vicSegmentMultiSelect = this.penaltyWavierService.getSegments();
    }
    if (this.searchOption !== 'SIN' && this.vicSegment?.english) {
      this.getBulkPenaltyWaiverQuoteDetails(this.vicSegment?.english, this.vicSegmentMultiSelect, this.entity);
    }
    this.isEditFlag ? this.getDocumentsOnValidatorEdit() : this.getRequiredDocumentForVic();
    if (this.searchOption === 'SIN') {
      this.getVicPenaltyWaiverDetails();
      this.onInitialVicPenaltyDetailsLoad();
    } // This method is used to get details on loading
  }
  onInitialVicPenaltyDetailsLoad() {
    this.wavierDetails = this.penaltyWavierService.getPenalityWaiverDetails();

    if (this.wavierDetails.contributorNumber === undefined || this.wavierDetails.contributorNumber === null) {
      this.getVicPenaltyWaiverDetails();
      this.getRequiredDocumentForVic();
    } else {
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
  }
  //method to check whether the transaction in workflow or not
  identifyTheTransaction() {
    this.route.url.subscribe(res => {
      if (res[1] && res[1].path === 'edit') {
        this.isEditFlag = true;
      } else if (res[1] && res[1].path === 'modify') {
        this.isEditFlag = true;
      } else {
        this.isEditFlag = false;
      }
    });
  }
  // This method is used to get penalty waiver details for vic type.
  getVicPenaltyWaiverDetails() {
    this.penaltyWavierService
      .getVicWavierPenalityDetails(this.sinNumber, 'SPECIAL', this.fromDate, this.toDate)
      .pipe(tap(res => (this.wavierDetails = res)))
      .subscribe(noop, noop);
  }
  /** Method to get required documents */
  getRequiredDocumentForVic() {
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
  /** Method to get required documents on single vic and vic seg edit */
  getDocumentsOnValidatorEdit() {
    this.documentService
      .getDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
        this.searchOption === 'SIN' ? this.sinNumber : this.penaltyWaiverId,
        this.referenceNumber
      )
      .subscribe(doc => (this.documents = doc));
    this.documents.forEach(doc => {
      this.refreshDocumentsForVic(doc);
    });
  }
  /** Method to refresh documents after scan. */
  refreshDocumentsForVic(doc: DocumentItem): void {
    if (this.searchOption === 'SIN') {
      this.idNumber = this.idNumber;
    } else {
      if (!this.isEditFlag) this.idNumber = 0;
      else this.idNumber = this.penaltyWaiverId;
    }
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.idNumber,
          BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
          BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
          this.isEditFlag ? this.referenceNumber : null,
          null,
          this.isEditFlag ? null : this.uuid
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
  /** Method to get available waive off amount. */
  getWaiverAmount(period) {
    if (period !== null) {
      this.fromDate = convertToYYYYMMDD(period[0]);
      this.toDate = convertToYYYYMMDD(period[1]);
      if (this.searchOption === 'SIN') {
        this.getVicPenaltyWaiverDetails();
      }
    } else {
      this.penaltyWavierService
        .getVicWavierPenalityDetails(this.sinNumber, 'SPECIAL')
        .pipe(tap(res => (this.wavierDetails = res)))
        .subscribe(noop, noop);
    }
  }
  /** Method to get calculated waive off amount */
  passEligiblePenaltyAmount(waiveOffAmt) {
    this.eligibleWaiveOffAmount = waiveOffAmt.eligiblePenlaityAmt;
    this.waviePenalityPercentage = waiveOffAmt.wavieOffPercentage;
  }
  navigateBackToHome() {
    this.modalRef.hide();
    if (this.isEditFlag && this.searchOption === 'SIN') {
      this.penaltyWavierService.vicExceptionalPenaltyWaiverRevert(this.sinNumber, this.penaltyWaiverId).subscribe(
        () => this.routingService.navigateToInbox(),
        err => this.alertService.showError(err.error.message)
      );
    } else if (this.isEditFlag && this.searchOption === 'vicSegmentation') {
      this.penaltyWavierService.estVicBulkExceptionalRevert(this.penaltyWaiverId).subscribe(
        () => this.routingService.navigateToInbox(),
        err => this.alertService.showError(err.error.message)
      );
    } else this.router.navigate(['/home/billing/establishment-service/verify']);
  }
  onSubmitVicPenalityDetails() {
    markFormGroupTouched(this.exceptionalPenalityMainForm);
    if (this.searchOption === 'SIN') {
      if (this.checkValidity(this.exceptionalPenalityMainForm)) {
        this.alertService.clearAlerts();
        this.createForm();
        this.wavierDetailsRequest.exceptionReason = this.penalityWaiverSelectedReason;
        this.wavierDetailsRequest.extensionReasonOthers = this.penalityWaiverSelectedOtherReason;
        this.wavierDetailsRequest.waiveOffType = 'SPECIAL';
        this.wavierDetailsRequest.waiverEndDate.gregorian = this.toDate;
        this.wavierDetailsRequest.waiverStartDate.gregorian = this.fromDate;
        this.wavierDetailsRequest.gracePeriod = this.wavierDetails?.terms?.gracePeriod;
        this.wavierDetailsRequest.waiverPercentage = this.waviePenalityPercentage;
        this.wavierDetailsRequest.uuid = this.uuid;
        if (this.paymentRequired === false) {
          this.wavierDetailsRequest.extensionReason = null;
          this.wavierDetailsRequest.extendedGracePeriod = 0;
          this.wavierDetailsRequest.paymentRequired = false;
        } else if (this.paymentRequired === true) {
          this.wavierDetailsRequest.extensionReason = this.exceptionReason;
          this.wavierDetailsRequest.extendedGracePeriod = this.extendedGracePeriod;
          this.wavierDetailsRequest.paymentRequired = true;
        } else {
          this.wavierDetailsRequest.extensionReason = this.exceptionReason;
          if (this.wavierDetails.paymentRequired) this.wavierDetailsRequest.paymentRequired = true;
          else this.wavierDetailsRequest.paymentRequired = false;
        }
        if (this.exceptionReason === undefined) {
          this.wavierDetailsRequest.extensionReason = null;
          this.wavierDetailsRequest.extendedGracePeriod = 0;
        }
        if (!this.isEditFlag) {
          this.penaltyWavierService
            .submitVicWavierPenalityDetails(this.sinNumber, this.wavierDetailsRequest)
            .pipe(
              tap(res => {
                this.paymentResponses.fromJsonToObject(res);
                this.successMessage = this.paymentResponses.message; //Setting success message
                this.alertService.showSuccess(this.successMessage, null, 10);
              }),
              catchError(err => {
                this.alertService.showError(err.error.message);
                return throwError(err);
              })
            )
            .subscribe(noop, noop);
          this.navigateBackHome();
        }
        if (this.isEditFlag) {
          if (this.exceptionReason === undefined && this.wavierDetailsRequest.paymentRequired) {
            if (this.wavierDetailsOnEdit?.terms?.extendedGracePeriod)
              this.wavierDetailsRequest.extendedGracePeriod = this.wavierDetailsOnEdit.terms.extendedGracePeriod;
            else this.wavierDetailsRequest.extendedGracePeriod = 0;
            this.wavierDetailsRequest.extensionReason = this.wavierDetailsOnEdit?.extensionReason;
          }
          this.penaltyWavierService
            .updateVicExceptionalPenaltyDet(this.sinNumber, this.penaltyWaiverId, this.wavierDetailsRequest)
            .pipe(
              tap(res => {
                this.paymentResponses.fromJsonToObject(res);
                this.successMessage = this.paymentResponses.message; //Setting success message
              }),
              catchError(err => {
                this.alertService.showError(err.error.message);
                return throwError(err);
              })
            )
            .subscribe(noop, noop);
          this.handleWorkflow();
        }
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    } else {
      if (this.checkValidity(this.exceptionalPenalityMainForm)) {
        this.alertService.clearAlerts();
        this.createVicFormData();
        this.wavierSegmentDetailsReq.reason = this.penalityWaiverSelectedReason;
        if (this.vicSegment?.english === 'All') {
          this.wavierSegmentDetailsReq.entitySelectionCriteria.All = this.vicSegment;
        } else if (this.vicSegment?.english === 'Purpose Of Registration/Contribution') {
          this.wavierSegmentDetailsReq.entitySelectionCriteria.purposeOfRegistration = this.vicSegmentMultiSelect;
        }
        this.wavierSegmentDetailsReq.waiverEndDate.gregorian = this.toDate;
        this.wavierSegmentDetailsReq.waiverStartDate.gregorian = this.fromDate;
        if (this.penalityWaiverSelectedOtherReason === undefined) {
          this.wavierSegmentDetailsReq.reasonOthers = null;
        } else {
          this.wavierSegmentDetailsReq.reasonOthers = this.penalityWaiverSelectedOtherReason;
        }

        this.wavierSegmentDetailsReq.entityType = 'VIC';
        this.wavierSegmentDetailsReq.eventDate = null;
        this.wavierSegmentDetailsReq.waiverType = 'SEGMENT';
        this.wavierSegmentDetailsReq.waivedPenaltyPercentage = this.waviePenalityPercentage;
        this.wavierSegmentDetailsReq.uuid = this.uuid;
        this.wavierSegmentDetailsReq.entitySelectionCriteria.socialInsuranceNumber = this.penaltyWavierService.getPenalityWaiverBulkFileContent();
        if (!this.isEditFlag) {
          this.penaltyWavierService
            .submitWavierPenalitySegmentDetails(this.wavierSegmentDetailsReq)
            .pipe(
              tap(res => {
                this.paymentResponses.fromJsonToObject(res);
                this.successMessage = this.paymentResponses.message; //Setting success message
                this.alertService.showSuccess(this.successMessage, null, 10);
              }),
              catchError(err => {
                this.alertService.showError(err.error.message);
                return throwError(err);
              })
            )
            .subscribe(noop, noop);
          this.navigateBackHome();
        } else if (this.isEditFlag) {
          this.penaltyWavierService
            .updateEstVicSegmentDetails(this.penaltyWaiverId, this.wavierSegmentDetailsReq)
            .pipe(
              tap(res => {
                this.paymentResponses.fromJsonToObject(res);
                this.successMessage = this.paymentResponses.message; //Setting success message
              }),
              catchError(err => {
                this.alertService.showError(err.error.message);
                return throwError(err);
              })
            )
            .subscribe(noop, noop);
          this.handleWorkflow();
        }
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
  /** Method to navigate back to home page */
  navigateBackHome(): void {
    this.router.navigate(['/home/billing/establishment-service/verify']);
  }
  /** Method to create data from form and check validations. */
  createForm() {
    this.wavierDetailsRequest = bindToObject(
      new PenaltyWaiverRequest(),
      this.exceptionalPenalityMainForm.get('wavierDetailForm').value
    );
  }
  /** Method to create data from form and check validations. */
  createVicFormData() {
    this.wavierSegmentDetailsReq = bindToObject(
      new PenaltyWaiverSegmentRequest(),
      this.exceptionalPenalityMainForm.get('wavierDetailForm').value
    );
  }

  //  * Method to show modal template*/
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  /** Method to hide modal. */
  hideModal(): void {
    if (this.modalRef !== undefined) {
      this.modalRef.hide();
    }
  }
  // Method to update actions after gdic edit submit
  handleWorkflow() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    if (this.wavierDetailsRequest?.extendedGracePeriod > 0) bpmUpdateRequest.outcome = WorkFlowActions.EXTEND;
    else bpmUpdateRequest.outcome = WorkFlowActions.UPDATE;
    bpmUpdateRequest.commentScope = 'BPM';
    if (
      this.exceptionalPenalityMainForm &&
      this.exceptionalPenalityMainForm.value &&
      this.exceptionalPenalityMainForm.value.wavierDetailForm
    )
      bpmUpdateRequest.comments = this.exceptionalPenalityMainForm.value.wavierDetailForm.comments;
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest).subscribe(
      () => this.routingService.navigateToInbox(),
      err => this.alertService.showError(err.error.message)
    );
  }
  // Method to get vic segemnt details on edit
  getVicSegmentEditDetails() {
    if (this.routerDataToken.payload) {
      const payload = JSON.parse(this.routerDataToken.payload);
      this.penaltyWaiverId = payload.waiverId ? Number(payload.waiverId) : null;
      this.getDataForBulkExceptionalVicEdit(this.penaltyWaiverId);
    }
  }
  //  * Method to destroy all errors */
  ngOnDestroy() {
    this.alertService.clearAlerts();
  }
}
