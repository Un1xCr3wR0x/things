/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  BPMUpdateRequest,
  DocumentService,
  LanguageToken,
  markFormGroupTouched,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EstablishmentPenalityWavierBaseScComponent } from '../../../shared/components/base/establishment-penality-wavier-base-sc.component';
import { BillingConstants } from '../../../shared/constants';
import { PaymentResponse, PenaltyWaiverRequest } from '../../../shared/models';
import { PenaltyWaiverSegmentRequest } from '../../../shared/models/penalty-waiver-segment-request';
import {
  BillingRoutingService,
  EstablishmentService,
  InstallmentService,
  PenalityWavierService
} from '../../../shared/services';
@Component({
  selector: 'blg-establishment-penalty-waiver-sc',
  templateUrl: './establishment-penalty-waiver-sc.component.html',
  styleUrls: ['./establishment-penalty-waiver-sc.component.scss']
})
export class EstablishmentPenaltyWaiverScComponent
  extends EstablishmentPenalityWavierBaseScComponent
  implements OnInit, OnDestroy {
  idNumber: number;
  establishmentCount: number;
  wavierPenalityMainForm: FormGroup = new FormGroup({});
  fromDate;
  toDate;
  uuid: string;
  successMessage: BilingualText;
  comments: TransactionReferenceData[] = [];
  reasonToShow;
  searchOption: string;
  establishmentSegment;
  establishmentSegmentMultiSelect;
  paymentResponses: PaymentResponse = new PaymentResponse();
  documentTransactionId = BillingConstants.PENALTY_WAIVER_DOCUMENT_TRANSACTION_ID;
  id: number;
  constructor(
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly penalityWavierService: PenalityWavierService,
    readonly installmentService: InstallmentService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly routingService: BillingRoutingService,
    readonly route: ActivatedRoute,
    readonly modalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    private uuidGeneratorService: UuidGeneratorService,
    readonly workflowService: WorkflowService
  ) {
    super(
      establishmentService,
      penalityWavierService,
      documentService,
      router,
      routingService,
      alertService,
      installmentService,
      modalService
    );
  }
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.csvDataList = this.penalityWavierService.getPenalityWaiverBulkFileContent();
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.identifyModeOfTransaction();
    if (this.inWorkflow) {
      if (this.routerDataToken.payload) {
        const payload = JSON.parse(this.routerDataToken.payload);
        this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
        this.penaltyWaiveId = payload.waiverId ? Number(payload.waiverId) : null;
        this.idNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
        this.getInstallmentDetails(payload.registrationNo);
        if (payload.resource === RouterConstants.TRANSACTION_EXCEPTIONAL_ESTABLISHMENT_PENALTY)
          this.searchOption = 'registration';
        else if (payload.resource === RouterConstants.TRANSACTION_ESTABLISHMENT_EXCEPTIONAL_BULK_PENALTY) {
          this.searchOption = 'segmentation';
          this.idNumber = this.penaltyWaiveId;
        }
        this.getDataForView();
        if (this.routerDataToken.comments) {
          if (this.routerDataToken.comments.length > 0) {
            this.comments = this.routerDataToken.comments;
            this.isCommentsPresent = true;
          }
        }
      }
    } else {
      this.route.queryParams.subscribe(params => {
        this.searchOption = params?.searchOption;
        if (this.searchOption === 'registration') {
          this.idNumber = params?.regNo;
          this.getInstallmentDetails(this.idNumber);
          this.getRequiredDocuments();
          this.getEstablishmentDetails();
        } else this.idNumber = 0;
        this.csvUploadFlag = this.searchOption;
      }, noop);
      if (this.penalityWavierService.getPenalityWaiverReason()) {
        this.penalityWaiverSelectedReason = this.penalityWavierService.getPenalityWaiverReason();
      }
      if (this.penalityWavierService.getPenalityWaiverOtherReason()) {
        this.penalityWaiverSelectedOtherReason = this.penalityWavierService.getPenalityWaiverOtherReason();
      }
      if (this.penalityWavierService.getEstablishmentSegments()) {
        this.establishmentSegment = this.penalityWavierService.getEstablishmentSegments();
      }
      if (this.penalityWavierService.getSegments()) {
        this.establishmentSegmentMultiSelect = this.penalityWavierService.getSegments();
      }
      if (this.searchOption !== 'registration') {
        this.getBulkPenaltyWaiverQuoteEstDetails(
          this.establishmentSegment?.english,
          this.establishmentSegmentMultiSelect,
          this.entity
        );
      }
      /**UUID generator for scan and upload */
      this.uuid = this.uuidGeneratorService.getUuid();
      this.getRequiredDocuments(); // Should not generate uuid for validator view.
    }
  }
  identifyModeOfTransaction() {
    this.route.url.subscribe(res => {
      if (res[1] && res[1].path === 'edit') this.inWorkflow = true;
    });
  }
  /**
   * Method to submit the form
   */
  onSubmitEstPenality() {
    markFormGroupTouched(this.wavierPenalityMainForm);
    if (this.searchOption === 'registration') {
      if (this.checkDocumentValidity(this.wavierPenalityMainForm)) {
        this.alertService.clearAlerts();
        this.createFormData();
        this.wavierDetailsReq.exceptionReason = this.penalityWaiverSelectedReason;
        this.wavierDetailsReq.extensionReasonOthers = this.penalityWaiverSelectedOtherReason;
        this.wavierDetailsReq.waiveOffType = 'SPECIAL';
        this.wavierDetailsReq.waiverEndDate.gregorian = this.toDate;
        this.wavierDetailsReq.waiverStartDate.gregorian = this.fromDate;
        this.wavierDetailsReq.gracePeriod = this.wavierDetails.terms.gracePeriod;
        this.wavierDetailsReq.waiverPercentage = this.waviePenalityPercentage;
        this.wavierDetailsReq.uuid = this.uuid;
        if (this.paymentRequired === false) {
          this.wavierDetailsReq.extensionReason = null;
          this.wavierDetailsReq.extendedGracePeriod = 0;
          this.wavierDetailsReq.paymentRequired = false;
        } else if (this.paymentRequired === true) {
          this.wavierDetailsReq.extendedGracePeriod = this.extendedGracePeriod;
          if (
            this.extendedGracePeriod === 0 ||
            this.extendedGracePeriod === null ||
            this.extendedGracePeriod === undefined
          )
            this.wavierDetailsReq.extensionReason = null;
          else this.wavierDetailsReq.extensionReason = this.exceptionReason;
          this.wavierDetailsReq.paymentRequired = true;
        } else {
          this.wavierDetailsReq.extensionReason = this.exceptionReason;
          if (this.wavierDetails.paymentRequired) this.wavierDetailsReq.paymentRequired = true;
          else this.wavierDetailsReq.paymentRequired = false;
        }
        if (this.exceptionReason === undefined) {
          this.wavierDetailsReq.extensionReason = null;
          this.wavierDetailsReq.extendedGracePeriod = 0;
        }
        if (!this.inWorkflow) {
          this.penalityWavierService
            .submitWavierPenalityDetails(this.idNumber, this.wavierDetailsReq)
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
          this.navigateBackToHome();
        } else if (this.inWorkflow) {
          if (this.exceptionReason === undefined && this.wavierDetailsReq.paymentRequired) {
            if (this.waiverDetailsOnEdit?.terms?.extendedGracePeriod)
              this.wavierDetailsReq.extendedGracePeriod = this.waiverDetailsOnEdit?.terms?.extendedGracePeriod;
            else this.wavierDetailsReq.extendedGracePeriod = 0;
            if (
              this.waiverDetailsOnEdit?.terms?.extendedGracePeriod === 0 ||
              this.waiverDetailsOnEdit?.terms?.extendedGracePeriod === null ||
              this.waiverDetailsOnEdit?.terms?.extendedGracePeriod === undefined
            )
              this.wavierDetailsReq.extensionReason = null;
            else this.wavierDetailsReq.extensionReason = this.waiverDetailsOnEdit?.extensionReason;
          }
          this.penalityWavierService
            .updateEstablishmentExceptional(this.idNumber, this.penaltyWaiveId, this.wavierDetailsReq)
            .pipe(
              tap(res => {
                this.paymentResponses.fromJsonToObject(res);
                this.successMessage = this.paymentResponses.message;
                this.alertService.showSuccess(this.successMessage, null, 10);
              }),
              catchError(err => {
                this.alertService.showError(err.error.message);
                return throwError(err);
              })
            )
            .subscribe(noop, noop);
          this.handleWorkflowAction();
        }
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
    if (this.searchOption !== 'registration') {
      this.saveSegmentDetails();
    }
  }
  /** Method to save bulk establishment segment details */
  saveSegmentDetails() {
    if (this.checkDocumentValidity(this.wavierPenalityMainForm)) {
      this.alertService.clearAlerts();
      this.createEstablishmentFormData();
      this.wavierSegmentDetailsReq.reason = this.penalityWaiverSelectedReason;
      if (this.penalityWaiverSelectedOtherReason === undefined) {
        this.wavierSegmentDetailsReq.reasonOthers = null;
      } else {
        this.wavierSegmentDetailsReq.reasonOthers = this.penalityWaiverSelectedOtherReason;
      }
      if (this.establishmentSegment?.english === 'Region') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.region = this.establishmentSegmentMultiSelect;
      } else if (this.establishmentSegment?.english === 'City') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.city = this.establishmentSegmentMultiSelect;
      } else if (this.establishmentSegment?.english === 'Field Office') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.fieldOffice = this.establishmentSegmentMultiSelect;
      } else if (this.establishmentSegment?.english === 'Sector (Establishment Activity/ Industry)') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.sector = this.establishmentSegmentMultiSelect;
      } else if (this.establishmentSegment?.english === 'Installment Status') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.installmentStatus = this.establishmentSegmentMultiSelect;
      } else if (this.establishmentSegment?.english === 'Nationality Of Establishment') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.nationality = this.establishmentSegmentMultiSelect;
      } else if (this.establishmentSegment?.english === 'Establishment Flag Situation') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.flagType = this.establishmentSegmentMultiSelect;
      } else if (this.establishmentSegment?.english === 'Payment Type (Mof Type - Other Types)') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.paymentType = this.establishmentSegmentMultiSelect;
      } else if (this.establishmentSegment?.english === 'Legal Entity  - Only Establishments In Saudi') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.legalEntitySaudi = this.establishmentSegmentMultiSelect;
      } else if (this.establishmentSegment?.english === 'Legal Entity - Only Gcc Establishments') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.legalEntityGCC = this.establishmentSegmentMultiSelect;
      } else if (this.establishmentSegment?.english === 'Violation Record') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.violationRecord = this.establishmentSegmentMultiSelect;
      } else if (this.establishmentSegment?.english === 'All') {
        this.wavierSegmentDetailsReq.entitySelectionCriteria.All = this.establishmentSegment;
      }
      this.wavierSegmentDetailsReq.entityType = 'ESTABLISHMENT';
      this.wavierSegmentDetailsReq.eventDate = null;
      this.wavierSegmentDetailsReq.waiverEndDate.gregorian = this.toDate;
      this.wavierSegmentDetailsReq.waiverStartDate.gregorian = this.fromDate;
      this.wavierSegmentDetailsReq.waiverType = 'SEGMENT';
      this.wavierSegmentDetailsReq.waivedPenaltyPercentage = this.waviePenalityPercentage;
      this.wavierSegmentDetailsReq.uuid = this.uuid;
      this.wavierSegmentDetailsReq.entitySelectionCriteria.registrationNumber = this.csvDataList;
      if (!this.inWorkflow) {
        this.penalityWavierService
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
        this.navigateBackToHome();
      } else {
        this.penalityWavierService
          .updateEstVicSegmentDetails(this.penaltyWaiveId, this.wavierSegmentDetailsReq)
          .pipe(
            tap(res => {
              this.paymentResponses.fromJsonToObject(res);
              this.successMessage = this.paymentResponses.message; //Setting success message
              this.alertService.showSuccess(this.successMessage, null, 10);
              this.handleWorkflowAction();
            }),
            catchError(err => {
              this.alertService.showError(err.error.message);
              return throwError(err);
            })
          )
          .subscribe(noop, noop);
      }
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  navigateBackToHome() {
    this.router.navigate(['/home/billing/establishment-service/verify']);
  }
  navigateBack(): void {
    this.modalRef.hide();
    if (this.inWorkflow && this.searchOption === 'registration') {
      this.penalityWavierService.penaltyWaiverRevert(this.idNumber, this.penaltyWaiveId).subscribe(
        () => this.routingService.navigateToInbox(),
        err => this.alertService.showError(err.error.message)
      );
    } else if (this.inWorkflow && this.searchOption === 'segmentation') {
      this.penalityWavierService.estVicBulkExceptionalRevert(this.penaltyWaiveId).subscribe(
        () => this.routingService.navigateToInbox(),
        err => this.alertService.showError(err.error.message)
      );
    } else this.router.navigate(['/home/billing/establishment-service/verify']);
  }

  /** Method to create data from form and check validations. */
  createFormData() {
    this.wavierDetailsReq = bindToObject(
      new PenaltyWaiverRequest(),
      this.wavierPenalityMainForm.get('wavierDetailForm').value
    );
  }
  /** * method to get extended values
   * @param extensionValues */
  getExtensionValuesData(extensionValues) {
    this.exceptionReason = extensionValues.extensionreason;
    this.extendedGracePeriod = extensionValues.extendedGrace;
  }
  /** Method to create data from form and check validations. */
  createEstablishmentFormData() {
    this.wavierSegmentDetailsReq = bindToObject(
      new PenaltyWaiverSegmentRequest(),
      this.wavierPenalityMainForm.get('wavierDetailForm').value
    );
  }
  /**
   * Method to check form validity
   * @param form form control */
  checkDocumentValidity(form: FormGroup) {
    if (!this.documentService.checkMandatoryDocuments(this.documents)) {
      this.alertService.showMandatoryDocumentsError();
      return false;
    } else if (form) {
      return form.valid;
    } else {
      return true;
    }
  }

  //  * Method to destroy all errors */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
  // Method to update actions after gdic edit submit
  handleWorkflowAction() {
    const bpmDataRequest = new BPMUpdateRequest();
    bpmDataRequest.taskId = this.routerDataToken.taskId;
    bpmDataRequest.user = this.routerDataToken.assigneeId;
    bpmDataRequest.commentScope = 'BPM';
    if (
      this.wavierPenalityMainForm &&
      this.wavierPenalityMainForm.value &&
      this.wavierPenalityMainForm.value.wavierDetailForm
    )
      bpmDataRequest.comments = this.wavierPenalityMainForm.value.wavierDetailForm.comments;
    bpmDataRequest.taskId = this.routerDataToken.taskId;
    bpmDataRequest.user = this.routerDataToken.assigneeId;
    bpmDataRequest.commentScope = 'BPM';
    this.workflowService.updateTaskWorkflow(bpmDataRequest).subscribe(
      () => this.routingService.navigateToInbox(),
      err => this.alertService.showError(err.error.message)
    );
  }
}
