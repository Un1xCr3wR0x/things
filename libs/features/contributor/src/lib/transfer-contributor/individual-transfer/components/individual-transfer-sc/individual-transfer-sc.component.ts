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
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  CalendarService,
  CoreIndividualProfileService,
  DocumentItem,
  DocumentService,
  getFormErrorCount,
  LookupService,
  Lov,
  markFormGroupTouched,
  RouterConstants,
  RouterData,
  RouterDataToken,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { concat, iif, noop, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ContributorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType, TransactionId } from '../../../../shared/enums';
import {
  BranchDetails,
  SystemParameter,
  TransferContributorDetails,
  TransferContributorPayload
} from '../../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  TransferContributorService
} from '../../../../shared/services';

@Component({
  selector: 'cnt-individual-transfer-sc',
  templateUrl: './individual-transfer-sc.component.html'
})
export class IndividualTransferScComponent extends ContributorBaseScComponent implements OnInit {
  /**Local variables */
  isAppPrivate: boolean;
  systemParameter: SystemParameter;
  parentForm: FormGroup = new FormGroup({});
  transactionId = TransactionId.TRANSFER_CONTRIBUTOR;
  registrationNoList = [];
  establishmentNameList = [];
  branchList: BranchDetails[] = [];
  transferDetails: TransferContributorDetails;
  disablePrimary: boolean=false;

  /** Creates an instance of IndividualTransferScComponent. */
  constructor(
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly lookupService: LookupService,
    readonly transferService: TransferContributorService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly manageWageService: ManageWageService,
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly coreService: CoreIndividualProfileService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly uuidGeneratorService: UuidGeneratorService,
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
    this.alertService.clearAlerts();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.checkEdit();
    if (!this.isEditMode) this.uuid = this.uuidGeneratorService.getUuid();
    super.setKeysForView();
    this.fetchDataToDisplay();
  }

  /** Method to check whether it is edit mode. */
  checkEdit() {
    this.route.url.subscribe(res => {
      if (res.length > 1) if (res[0].path === 'individual' && res[1].path === 'edit') this.isEditMode = true;
    });
  }

  /** Method to fetch data to display. */
  fetchDataToDisplay(): void {
    concat(
      super.getContributorDetails(this.registrationNo, this.socialInsuranceNo),
      this.fetchEstBranchDetails(),
      iif(() => this.isEditMode, this.fetchTransferDetails())
    ).subscribe({
      error: err => this.showError(err),
      complete: () => {
        if (this.isAppPrivate)
          super.getRequiredDocuments(
            this.engagementId,
            DocumentTransactionId.TRANSFER_ENGAGEMENT,
            DocumentTransactionType.TRANSFER_ENGAGEMENT,
            this.isEditMode,
            this.referenceNo
          );
      }
    });
  }

  /** Method to fetch transfer details. */
  fetchTransferDetails(): Observable<TransferContributorDetails> {
    return this.transferService
      .getTransferDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .pipe(tap(res => (this.transferDetails = res)));
  }

  /** Method to fetch branch details*/
  fetchEstBranchDetails(): Observable<BranchDetails[]> {
    return this.establishmentService.getBranches(this.registrationNo).pipe(
      map(branchList => (branchList = branchList.filter(branch => branch.registrationNo !== this.registrationNo))),
      tap(branchList => {
        this.registrationNoList = branchList
          .filter(branch => branch.status.english !== 'Closed')
          .map(branch => branch.registrationNo);
        this.establishmentNameList = branchList
          .filter(branch => branch.status.english !== 'Closed')
          .map(branch => {
            const newLov = new Lov();
            newLov.sequence = branchList.indexOf(branch);
            newLov.value.english = branch.name.english ? branch.name.english : branch.name.arabic;
            newLov.value.arabic = branch.name.arabic ? branch.name.arabic : branch.name.english;
            return newLov;
          });
        this.branchList = branchList;
      })
    );
  }

  /** Method to refresh documents. */
  refreshDocument(document: DocumentItem): void {
    super.refreshDocument(
      document,
      this.engagementId,
      DocumentTransactionId.TRANSFER_ENGAGEMENT,
      DocumentTransactionType.TRANSFER_ENGAGEMENT,
      this.referenceNo,
      this.uuid
    );
  }

  /** Method to handle success events. */
  handleSuccess(message: BilingualText): void {
    this.navigateBack(true);
    this.alertService.showSuccess(message, null, 10);
    this.coreService.setSuccessMessage(message, true);
  }

  /** Method to submit the transaction. */
  submitTransaction(): void {
    if (this.checkFormValidity()) {
      this.disablePrimary=true;
      const payload = this.assemblePayload();
      this.transferService
        .updateTansferContributor(this.registrationNo, this.socialInsuranceNo, this.engagementId, payload)
        .pipe(
          tap(res => {
            this.disablePrimary=false;
            if (!this.isEditMode) this.handleSuccess(res.message);
          }),
          switchMap(() =>  iif(() => this.isEditMode, this.submitTransactionOnEdit())),
          catchError(err => {
            this.disablePrimary=false;
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }

  /** Method is to assemble payload. */
  assemblePayload(): TransferContributorPayload {
    const payload = new TransferContributorPayload();
    payload.transferTo = this.parentForm.get('transferForm.registrationNo').value;
    payload.editFlow = this.isEditMode;
    payload.comments = this.parentForm.get('comments.comments').value;
    if (!this.isEditMode) payload.uuid = this.uuid;
    return payload;
  }

  /** Method to check form validity. */
  checkFormValidity(): boolean {
    let isFormValid = false;
    markFormGroupTouched(this.parentForm);
    if (this.parentForm.valid)
      if (this.documentService.checkMandatoryDocuments(this.documents)) isFormValid = true;
      else this.showMandatoryDocumentsError();
    else super.showMandatoryFieldsError();
    return isFormValid;
  }

  /** Method to submit transaction on edit mode. */
  submitTransactionOnEdit() {
    return this.workflowService
      .updateTaskWorkflow(
        this.assembleWorkflowPayload(this.routerDataToken, this.parentForm.get('comments.comments').value)
      )
      .pipe(
        tap(() => {
          this.disablePrimary=false;
          this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.VALIDATOR-EDIT-MESSAGE');
          this.navigateBack(true);
        })
      );
  }

  /** Method to check for changes. */
  checkForChanges(template: TemplateRef<HTMLElement>): void {
    const docStatus = this.checkDocumentStatus();
    if (getFormErrorCount(this.parentForm) > 0 || this.parentForm.dirty || docStatus) this.showModal(template);
    else this.navigateBack();
  }

  /** Method to check whether revert is required. */
  checkRevertRequired(): void {
    this.hideModal();
    if (this.checkDocumentStatus() && this.isEditMode) this.revertTransferRequest();
    else this.navigateBack();
  }

  /** Method to navigate back based on mode. */
  navigateBack(isTransactionSuccess = false) {
    if (this.isEditMode && !isTransactionSuccess)
      this.router.navigate([ContributorRouteConstants.ROUTE_TRANSFER_CONTRIBUTOR_VALIDATOR]);
    else if (this.isEditMode && isTransactionSuccess) this.router.navigate([RouterConstants.ROUTE_INBOX]);
    else if (!this.isEditMode) this.location.back();
  }

  /** Method to gt document status. */
  checkDocumentStatus(): boolean {
    return this.parentForm.get('docStatus.changed') ? this.parentForm.get('docStatus.changed').value : false;
  }

  /** Method to revert termination request. */
  revertTransferRequest(): void {
    this.contributorService
      .revertTransaction(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .subscribe(
        () => this.navigateBack(),
        err => this.showError(err)
      );
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered'
    });
  }
}
