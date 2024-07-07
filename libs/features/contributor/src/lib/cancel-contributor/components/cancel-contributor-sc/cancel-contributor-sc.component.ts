/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  CalendarService,
  CoreIndividualProfileService,
  DocumentItem,
  DocumentService,
  getFormErrorCount,
  LookupService,
  Lov,
  LovList,
  markFormGroupTouched,
  RouterConstants,
  RouterData,
  RouterDataToken,
  StorageService,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { concat, iif, noop, Observable, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ContributorBaseScComponent } from '../../../shared/components';
import { ContributorConstants, ContributorRouteConstants } from '../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType, PersonTypesEnum, TransactionId } from '../../../shared/enums';
import {
  CancelContributorDetails,
  CancelContributorRequest,
  ContributorBPMRequest,
  EngagementDetails,
  SystemParameter
} from '../../../shared/models';
import {
  CancelContributorService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared/services';

@Component({
  selector: 'cnt-cancel-contributor-sc',
  templateUrl: './cancel-contributor-sc.component.html',
  styleUrls: ['./cancel-contributor-sc.component.scss']
})
export class CancelContributorScComponent extends ContributorBaseScComponent implements OnInit {
  /**Local variables */
  systemParameter: SystemParameter;
  parentForm: FormGroup = new FormGroup({});
  transactionId = TransactionId.CANCEL_CONTRIBUTOR;
  cancellationDetails: CancelContributorDetails;
  apiTriggered = false;

  /** Observables */
  leavingReasonList$: Observable<LovList>;
  cancelReasonList$: Observable<LovList>;

  /** Creates an instance of CancelContributorScComponent. */
  constructor(
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly manageWageService: ManageWageService,
    readonly lookupService: LookupService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly cancelContributorService: CancelContributorService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly storageService: StorageService,
    readonly coreService: CoreIndividualProfileService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    private uuidGeneratorService: UuidGeneratorService,
    readonly location: Location,
    readonly calendarService: CalendarService
  ) {
    super(
      alertService,
      establishmentService,
      contributorService,
      engagementService,
      documentService,
      workflowService,
      manageWageService,
      routerDataToken,
      calendarService
    );
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.checkEditMode();
    this.setKeysForView();
    if (!this.isEditMode) this.uuid = this.uuidGeneratorService.getUuid();
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
      this.fetchSystemParameters();
      // !this.isPpa ? this.fetchLovList() : this.fetchPpaCancellationReasonList();
      this.fetchDataToDisplay();
    }
  }

  /** Method to check whether it is edit mode. */
  checkEditMode() {
    this.route.url.subscribe(res => {
      if (res.length > 0 && res[0].path === 'edit') this.isEditMode = true;
    });
  }

  /** Method to get system parameter like maximum backdated joining date. */
  fetchSystemParameters(): void {
    this.contributorService.getSystemParams().subscribe(res => {
      this.systemParameter = new SystemParameter().fromJsonToObject(res);
    });
  }

  /**Method to fetch data to display */
  fetchDataToDisplay(): void {
    concat(
      this.getEstablishmentDetails(this.registrationNo),
      super.getContributorDetails(this.registrationNo, this.socialInsuranceNo),
      iif(() => this.isEditMode, this.getCancelWorkflowDetails(), this.getEngagement())
    ).subscribe({
      error: err => this.showError(err),
      complete: () => {
        this.fetchLovList();
        this.getLeavingReasonList();
        super.getRequiredDocuments(
          this.engagementId,
          DocumentTransactionId.CANCEL_CONTRIBUTOR,
          this.getDocumentTransactionType(),
          this.isEditMode,
          this.referenceNo
        );
      }
    });
  }

  /**Method to fetch engagement */
  getEngagement(): Observable<EngagementDetails> {
    return super
      .getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId)
      .pipe(tap(eng => (this.engagement = eng)));
  }

  /** Method to get cancel workflow details. */
  getCancelWorkflowDetails(): Observable<CancelContributorDetails> {
    return this.cancelContributorService
      .getCancellationDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .pipe(tap(res => (this.cancellationDetails = res)));
  }

  /**Method to fetch lov list */
  fetchLovList(): void {
    if (this.isPpa) this.fetchPpaCancellationReasonList();
    else {
      this.cancelReasonList$ = this.lookupService.getReasonForCancelEngagement().pipe(
        filter(lovlist => lovlist && lovlist !== null),
        map(lovList => {
          return new LovList(
            lovList.items.filter(lov => lov.value.english !== ContributorConstants.CANCEL_DUE_TO_TRANSFER_REASON)
          );
        })
      );
    }
  }
  /**Method to fetch lov list */
  fetchPpaCancellationReasonList(): void {
    this.cancelReasonList$ = this.lookupService.getPpaReasonForCancellationList();
  }
  /** Metohod to get leaving reason list. */
  getLeavingReasonList() {
    const leavingDate = this.isEditMode ? this.cancellationDetails.leavingDate : this.engagement.leavingDate;
    if (leavingDate && leavingDate?.gregorian) {
      this.leavingReasonList$ = !this.isPpa
        ? this.lookupService.getReasonForLeavingList(
            this.contributor?.person?.personType === PersonTypesEnum.SAUDI ? '1' : '2'
          )
        : this.lookupService.getReasonForLeavingListPpa();
      this.checkObsoleteReasons(
        this.isEditMode ? this.cancellationDetails?.leavingReason : this.engagement?.leavingReason
      );
    }
  }

  /** Method to check for obsolete reasons. */
  checkObsoleteReasons(leavingReason: BilingualText) {
    this.leavingReasonList$ = this.leavingReasonList$.pipe(
      filter(lovlist => lovlist && lovlist !== null),
      map(lovList => {
        if (!lovList.items.some(lov => lov?.value?.english === leavingReason?.english)) {
          const lov = new Lov();
          lov.items = undefined;
          lov.value = leavingReason;
          lovList.items.push(lov);
        }
        return lovList;
      })
    );
  }

  /** Method to get document transaction type. */
  getDocumentTransactionType() {
    if (this.isPpa) {
      return DocumentTransactionType.CANCEL_CONTRIBUTOR_PPA;
    } else {
      return this.establishment.gccEstablishment
        ? DocumentTransactionType.CANCEL_CONTRIBUTOR_IN_GCC
        : DocumentTransactionType.CANCEL_CONTRIBUTOR;
    }
  }
  getDocIfWrongReg(isWrongReg = false) {
    super.getRequiredDocuments(
      this.engagementId,
      DocumentTransactionId.CANCEL_CONTRIBUTOR,
      isWrongReg ? DocumentTransactionType.CANCEL_PPA_WRONG_REG : DocumentTransactionType.CANCEL_CONTRIBUTOR_PPA,
      this.isEditMode,
      this.referenceNo
    );
  }
  /**Method to refresh documents */
  refreshDocument(document: DocumentItem): void {
    super.refreshDocument(
      document,
      this.engagementId,
      DocumentTransactionId.CANCEL_CONTRIBUTOR,
      this.getDocumentTransactionType(),
      this.referenceNo,
      this.uuid
    );
  }

  /** Method to check for changes. */
  checkForChanges(template: TemplateRef<HTMLElement>): void {
    const docStatus = this.checkDocumentStatus();
    if (getFormErrorCount(this.parentForm) > 0 || this.parentForm.dirty || docStatus) this.showModal(template);
    else this.navigateBack();
  }

  /** Method to gt document status. */
  checkDocumentStatus(): boolean {
    return this.parentForm.get('docStatus.changed') ? this.parentForm.get('docStatus.changed').value : false;
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered'
    });
  }

  /** Method to hide modal. */
  hideModal(): void {
    this.modalRef.hide();
  }

  /** Method to submit the transaction. */
  submitTransaction(): void {
    if (!this.apiTriggered) {
      if (this.checkFormValidity()) {
        this.apiTriggered = true;
        this.storageService.setLocalValue('triggered', this.apiTriggered);
        this.cancelContributorService
          .submitCancelContributor(
            this.registrationNo,
            this.socialInsuranceNo,
            this.engagementId,
            this.assemblePayload()
          )
          .pipe(
            tap(res => {
              if (!this.isEditMode) {
                this.navigateBack(true);
                this.alertService.showSuccess(res.message, null, 10);
                this.coreService.setSuccessMessage(res.message, true);
              }
            }),
            switchMap(() => iif(() => this.isEditMode, this.submitTransactionOnEdit())),
            catchError(err => {
              this.apiTriggered = false;
              this.showError(err);
              return throwError(err);
            })
          )
          .subscribe(noop, noop);
      }
    }
  }

  /**Method to check form validity */
  checkFormValidity(): boolean {
    let isFormValid = false;
    // const docStatus = this.documentService.checkMandatoryDocuments(this.documents);
    const docStatus =
      this.establishment?.gccEstablishment || this.establishment?.ppaEstablishment
        ? this.documentService.checkMandatoryDocuments(this.documents)
        : this.checkOptionalDocuments(this.documents);
    markFormGroupTouched(this.parentForm);
    if (this.parentForm.valid)
      if (docStatus) isFormValid = true;
      //  this.showMandatoryDocumentsError();
      else
        this.establishment?.gccEstablishment || this.establishment?.ppaEstablishment
          ? this.showMandatoryDocumentsError()
          : this.alertService.showErrorByKey('CONTRIBUTOR.OPTIONAL-DOCUMENT-INFO');
    else super.showMandatoryFieldsError();
    return isFormValid;
  }

  /**Method to assemble payload for Cancel Contributor */
  assemblePayload(): CancelContributorRequest {
    const cancelContributor = new CancelContributorRequest();
    cancelContributor.cancellationReason = this.parentForm.get('cancelForm.cancellationReason').value;
    cancelContributor.comments = this.parentForm.get('comments.comments').value;
    cancelContributor.editFlow = this.isEditMode;
    if (!this.isEditMode) cancelContributor.uuid = this.uuid;
    return cancelContributor;
  }

  /** Method to submit transaction on edit mode. */
  submitTransactionOnEdit() {
    const workflowPayload: ContributorBPMRequest = this.assembleWorkflowPayload(
      this.routerDataToken,
      this.parentForm.get('comments.comments').value
    );
    return this.workflowService.updateTaskWorkflow(workflowPayload).pipe(
      tap(() => {
        this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.VALIDATOR-EDIT-MESSAGE');
        this.navigateBack(true);
      })
    );
  }

  /** Method to check whether revert is required. */
  checkRevertRequired(): void {
    this.hideModal();
    if (this.checkDocumentStatus() && this.isEditMode) this.revertCancelRequest();
    else this.navigateBack();
  }

  /** Method to revert termination request. */
  revertCancelRequest(): void {
    this.contributorService
      .revertTransaction(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .subscribe(
        () => this.navigateBack(),
        err => this.showError(err)
      );
  }

  /** Method to navigate back based on mode. */
  navigateBack(isTransactionSuccess = false) {
    if (this.isEditMode && !isTransactionSuccess)
      this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_ENGAGEMENT_VALIDATOR]);
    else if (this.isEditMode && isTransactionSuccess) this.router.navigate([RouterConstants.ROUTE_INBOX]);
    else if (!this.isEditMode) this.location.back();
  }
}
