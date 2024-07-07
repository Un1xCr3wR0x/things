/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject, OnDestroy, TemplateRef } from '@angular/core';
import {
  AlertService,
  DocumentService,
  ApplicationTypeToken,
  LanguageToken,
  DocumentItem,
  convertToYYYYMMDD,
  BilingualText,
  bindToObject,
  UuidGeneratorService,
  RouterDataToken,
  RouterData,
  endOfMonth,
  TransactionReferenceData,
  BPMUpdateRequest,
  WorkflowService,
  markFormGroupTouched
} from '@gosi-ui/core';
import { BehaviorSubject, noop, Observable, throwError, of } from 'rxjs';
import { PenalityWavierService, EventDateService, BillingRoutingService } from '../../../shared/services';
import { BillingConstants } from '../../../shared/constants';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import {
  PenalityWavier,
  PenaltyWaiverRequest,
  PaymentResponse,
  PenaltyWaiverSegmentRequest,
  BulkPenaltyEntityCountDetails,
  EventDate
} from '../../../shared/models';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import moment from 'moment';
@Component({
  selector: 'blg-entity-type-penalty-waiver-sc',
  templateUrl: './entity-type-penalty-waiver-sc.component.html',
  styleUrls: ['./entity-type-penalty-waiver-sc.component.scss']
})
export class EntityTypePenaltyWaiverScComponent implements OnInit, OnDestroy {
  // local variables
  lang = 'en';
  businessKey = 0;
  documents: DocumentItem[] = [];
  wavierDetails: PenalityWavier;
  fromDate;
  wavierSegmentDetailsRequest: PenaltyWaiverSegmentRequest;
  toDate;
  exceptionalPenalityMainForm: FormGroup = new FormGroup({});
  eligibleWaiveOffAmount: number;
  penalityWaiverSelectedReason: BilingualText = new BilingualText();
  penalityWaiverSelectedOtherReason: string;
  wavierDetailsReq: PenaltyWaiverRequest;
  exceptionReason: string;
  inWorkflow = false;
  extendedGracePeriod: number;
  paymentRequired: boolean;
  paymentResponses: PaymentResponse = new PaymentResponse();
  waviePenalityPercentage: number;
  entitySegmentAll = 'All';
  uuid: string;
  documentTransactionId = BillingConstants.PENALTY_WAIVER_DOCUMENT_TRANSACTION_ID;
  successMessage: BilingualText;
  comments: TransactionReferenceData[] = [];
  searchOption = '';
  isEventDateFlag = false;
  entitySegment: BilingualText = new BilingualText();
  entitySegmentMultiSelect;
  modalRef: BsModalRef;
  wavierDetailsOnEdit: PenaltyWaiverSegmentRequest = new PenaltyWaiverSegmentRequest();
  eventDateList: EventDate = new EventDate();
  newEventDateDetails = [];
  totalNumberOfEntity: BulkPenaltyEntityCountDetails;
  entity = 'BOTH';
  entitySegmentMultiSelectValues: string;
  referenceNumber: number;
  penaltyWaiveId: number;
  isCommentsPresent = false;

  constructor(
    readonly alertService: AlertService,
    readonly penaltyWavierService: PenalityWavierService,
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly penaltyWaiverService: PenalityWavierService,
    readonly router: Router,
    readonly eventService: EventDateService,
    readonly workflowService: WorkflowService,
    readonly routingService: BillingRoutingService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private uuidGeneratorService: UuidGeneratorService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {}

  // This method is used to initialise the component on loading
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.modeOfTransaction();
    if (this.inWorkflow) {
      if (this.routerDataToken.payload) {
        const payload = JSON.parse(this.routerDataToken.payload);
        if (payload) {
          this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
          this.penaltyWaiveId = payload.waiverId ? Number(payload.waiverId) : null;
          if (this.penaltyWaiveId) this.getDataForBulkExceptionalView();
        }
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
      });
      if (this.penaltyWavierService.getPenalityWaiverReason()) {
        this.penalityWaiverSelectedReason = this.penaltyWavierService.getPenalityWaiverReason();
        if (this.penalityWaiverSelectedReason?.english === 'Change in Late Fees Calculation Date') {
          this.isEventDateFlag = true;
        }
      }
      if (this.penaltyWavierService.getPenalityWaiverOtherReason()) {
        this.penalityWaiverSelectedOtherReason = this.penaltyWavierService.getPenalityWaiverOtherReason();
      }
      if (this.penaltyWavierService.getAllEntitySegments()) {
        this.entitySegment = this.penaltyWavierService.getAllEntitySegments();
      }
      if (this.searchOption && this.entitySegment?.english) {
        this.getBulkPenaltyWaiverAllEntityDetails();
      }
      this.onInitialVicPenaltyDetailsLoad();

      /**UUID generator for scan and upload */
      this.uuid = this.uuidGeneratorService.getUuid(); // Should not generate uuid for validator view.
    }
  }
  modeOfTransaction() {
    this.route.url.subscribe(res => {
      if (res[1] && res[1].path === 'edit') this.inWorkflow = true;
    });
  }
  onInitialVicPenaltyDetailsLoad() {
    this.wavierDetails = this.penaltyWavierService.getPenalityWaiverDetails();

    if (this.wavierDetails.contributorNumber === undefined || this.wavierDetails.contributorNumber === null) {
      this.getRequiredDocumentForVic();
    } else {
      this.documentService
        .getRequiredDocuments(
          BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
          BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE
        )
        .pipe(
          map(docs => (this.documents = this.documentService.removeDuplicateDocs(docs))),
          catchError(error => of(error))
        )
        .subscribe(noop, noop);
    }
  }

  /** Method to get required documents */
  getRequiredDocumentForVic() {
    this.documentService
      .getRequiredDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE
      )
      .pipe(
        map(docs => (this.documents = this.documentService.removeDuplicateDocs(docs))),
        catchError(error => of(error))
      )
      .subscribe(doc => (this.documents = doc), noop);
  }

  /** Method to refresh documents after scan. */
  refreshDocumentsForAllSegment(doc: DocumentItem): void {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.businessKey,
          BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
          BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
          null,
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
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }
  /** Method to get available waive off amount. */

  getWaiverAmount(period) {
    this.fromDate = convertToYYYYMMDD(period[0]);
    this.toDate = convertToYYYYMMDD(endOfMonth(period[1]).toString());
  }

  /** Method to get calculated waive off amount */
  passEligiblePenaltyAmount(waiveOffAmt) {
    this.eligibleWaiveOffAmount = waiveOffAmt.eligiblePenlaityAmt;
    this.waviePenalityPercentage = waiveOffAmt.wavieOffPercentage;
  }
  onSubmitEntityPenalityDetails() {
    markFormGroupTouched(this.exceptionalPenalityMainForm);
    if (this.checkDocumentValidity(this.exceptionalPenalityMainForm)) {
      this.alertService.clearAlerts();
      this.createSegmentFormData();
      this.wavierSegmentDetailsRequest.reason = this.penalityWaiverSelectedReason;
      if (this.entitySegment?.english === 'Region') {
        this.wavierSegmentDetailsRequest.entitySelectionCriteria.region = this.entitySegmentMultiSelect;
      } else if (this.entitySegment?.english === 'City') {
        this.wavierSegmentDetailsRequest.entitySelectionCriteria.city = this.entitySegmentMultiSelect;
      } else if (this.entitySegment?.english === 'Field Office') {
        this.wavierSegmentDetailsRequest.entitySelectionCriteria.fieldOffice = this.entitySegmentMultiSelect;
      } else if (this.entitySegment?.english === 'All') {
        this.wavierSegmentDetailsRequest.entitySelectionCriteria.All = this.entitySegment;
      }
      if (this.isEventDateFlag) {
        this.wavierSegmentDetailsRequest.entitySelectionCriteria = null;
      }
      this.wavierSegmentDetailsRequest.waiverEndDate.gregorian = this.toDate;
      this.wavierSegmentDetailsRequest.waiverStartDate.gregorian = this.fromDate;

      if (this.penalityWaiverSelectedOtherReason === undefined) {
        this.wavierSegmentDetailsRequest.reasonOthers = null;
      } else {
        this.wavierSegmentDetailsRequest.reasonOthers = this.penalityWaiverSelectedOtherReason;
      }

      this.wavierSegmentDetailsRequest.entityType = 'BOTH';
      if (this.isEventDateFlag) {
        this.newEventDateDetails.forEach(element => {
          this.wavierSegmentDetailsRequest.eventDate.push(
            Object.assign({
              actualEventDate: {
                gregorian: convertToYYYYMMDD(element?.eventDateInfo?.gregorian),
                hijiri: element?.eventDateInfo?.hijiri
              },
              newEventDate: {
                gregorian: convertToYYYYMMDD(element?.newDate?.gregorian),
                hijiri: ''
              }
            })
          );
        });
      } else {
        this.wavierSegmentDetailsRequest.eventDate = null;
      }
      this.wavierSegmentDetailsRequest.waiverType = this.isEventDateFlag ? 'EVENT_DATE_CHANGE' : 'SEGMENT';
      this.wavierSegmentDetailsRequest.waivedPenaltyPercentage = this.isEventDateFlag
        ? 0
        : this.waviePenalityPercentage;
      this.wavierSegmentDetailsRequest.uuid = this.uuid;
      if (this.inWorkflow) {
        this.penaltyWaiverService
          .updateEstVicSegmentDetails(this.penaltyWaiveId, this.wavierSegmentDetailsRequest)
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
        this.handleWorkflowActions();
      } else {
        this.penaltyWavierService
          .submitWavierPenalitySegmentDetails(this.wavierSegmentDetailsRequest)
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
      }
      this.navigateBack();
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }

  /** Method to navigate back to home page */
  navigateBack(): void {
    this.router.navigate([BillingConstants.EXCEPTIONAL_HOME]);
  }
  navigateBackToHome(): void {
    this.hideModal();
    if (this.inWorkflow) {
      this.penaltyWavierService.estVicBulkExceptionalRevert(this.penaltyWaiveId).subscribe(
        () => this.router.navigate([BillingConstants.EXCEPTIONAL_HOME]),
        err => this.alertService.showError(err.error.message)
      );
    } else {
      this.router.navigate([BillingConstants.EXCEPTIONAL_HOME]);
    }
  }
  /** Method to create data from form and check validations. */
  createSegmentFormData() {
    this.wavierSegmentDetailsRequest = bindToObject(
      new PenaltyWaiverSegmentRequest(),
      this.exceptionalPenalityMainForm.get('wavierDetailForm').value
    );
  }
  /**
   * method to get extended values
   * @param extensionValues
   */
  getExtensionValues(extensionValues) {
    this.exceptionReason = extensionValues.extensionreason;
    this.extendedGracePeriod = extensionValues.extendedGrace;
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

  newEventDateList(newEventDateDetailsList) {
    this.newEventDateDetails = newEventDateDetailsList;
  }
  onMonthRangeChange(daterange) {
    if (daterange) {
      this.eventService
        .getEventDetailsByDate(
          moment(daterange[0]).toDate().getFullYear(),
          moment(daterange[0]).toDate().getMonth() + 1,
          moment(daterange[1]).toDate().getFullYear(),
          moment(daterange[1]).toDate().getMonth() + 1
        )
        .subscribe(data => {
          this.eventDateList = data;
        });
    }
  }
  //  * Method to destroy all errors */
  ngOnDestroy() {
    this.alertService.clearAlerts();
  }
  //  * Method to get bulk penalty waiver details */
  getBulkPenaltyWaiverAllEntityDetails() {
    this.penaltyWavierService
      .getBulkPenaltyWaiverQuoteForAll(this.entitySegmentAll, this.entity)
      .pipe(tap(res => (this.totalNumberOfEntity = res)))
      .subscribe(noop, noop);
  }
  /**------------------------------------------------------------------------------------------------ */
  /** Method to get required data to view transaction. */
  getDataForBulkExceptionalView(): void {
    this.penaltyWaiverService
      .getExceptionalBulkDetails(this.penaltyWaiveId)
      .pipe(
        tap(res => {
          this.wavierDetailsOnEdit = res;
          this.isEventDateFlag = this.wavierDetailsOnEdit.waiverType === 'EVENT_DATE_CHANGE' ? true : false;
          if (this.routerDataToken?.resourceType === 'bulk-penalty-waiver-all' || 'bulk-penalty-waiver-event-date') {
            this.searchOption = 'entityType';
            this.entitySegment = this.wavierDetailsOnEdit?.selectedCriteria?.segment.name;
            this.penalityWaiverSelectedReason = this.wavierDetailsOnEdit?.reason;
            this.getBulkPenaltyWaiverAllEntityDetails();
          }
        }),
        switchMap(() => {
          return this.getBulkDocuments();
        }),
        catchError(err => {
          this.handleErrors(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  /** Method to get documents. */
  getBulkDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
        this.penaltyWaiveId,
        this.referenceNumber
      )
      .pipe(tap(res => (this.documents = res)));
  }
  /** Method to handle error. */
  handleErrors(error) {
    this.alertService.showError(error.error.message);
  }
  // Method to update actions after gdic edit submit
  handleWorkflowActions() {
    const bpmUpdate = new BPMUpdateRequest();
    bpmUpdate.commentScope = 'BPM';
    bpmUpdate.user = this.routerDataToken.assigneeId;
    bpmUpdate.taskId = this.routerDataToken.taskId;
    if (
      this.exceptionalPenalityMainForm &&
      this.exceptionalPenalityMainForm.value.wavierDetailForm &&
      this.exceptionalPenalityMainForm.value
    )
      bpmUpdate.comments = this.exceptionalPenalityMainForm.value.wavierDetailForm.comments;
    this.workflowService.updateTaskWorkflow(bpmUpdate).subscribe(
      () => this.routingService.navigateToInbox(),
      err => this.alertService.showError(err.error.message)
    );
  }
}
