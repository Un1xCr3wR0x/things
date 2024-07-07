/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  CalendarService,
  DocumentItem,
  DocumentService,
  EstablishmentStatusEnum,
  getFormErrorCount,
  LookupService,
  Lov,
  LovList,
  markFormGroupTouched,
  RegistrationNoToken,
  RegistrationNumber,
  RouterConstants,
  RouterConstantsBase,
  RouterData,
  RouterDataToken,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, iif, noop, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ContributorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType, TransactionId } from '../../../../shared/enums';
import {
  BranchDetails,
  ContributorCountDetails,
  ContributorWageParams,
  Establishment,
  TransferAllContributorDetails,
  TransferContributorPayload
} from '../../../../shared/models';
import {
  ContributorService,
  ContributorsWageService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  TransferContributorService
} from '../../../../shared/services';
@Component({
  selector: 'cnt-transfer-all-sc',
  templateUrl: './transfer-all-sc.component.html',
  styleUrls: ['./transfer-all-sc.component.scss']
})
export class TransferAllScComponent extends ContributorBaseScComponent implements OnInit, OnDestroy {
  /**Local variables */
  isAppPrivate: boolean;
  parentForm: FormGroup = new FormGroup({});
  transactionId = TransactionId.TRANSFER_ALL_CONTRIBUTOR;
  registrationNumberList = [];
  estNameList = [];
  branchList: BranchDetails[] = [];
  contributorCount: Observable<ContributorCountDetails>;
  canTransfer = false;
  requestId: number;
  transferAllDetails: TransferAllContributorDetails;
  hasWorkflow = false;
  successMessage: BilingualText;
  isTransferable = true;
  mainEstRegistrationNo: number;

  /** Observables */
  establishmentType$: Observable<LovList>;

  /** Instances of TransferAllScComponent. */
  constructor(
    readonly alertService: AlertService,
    readonly route: ActivatedRoute,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly manageWageService: ManageWageService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly transferService: TransferContributorService,
    readonly contributorWageService: ContributorsWageService,
    readonly workflowService: WorkflowService,
    private uuidGeneratorService: UuidGeneratorService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RegistrationNoToken) readonly regNoToken: RegistrationNumber,
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
    this.checkTransferEdit();
    if (!this.isEditMode) {
      this.uuid = this.isAppPrivate ? this.uuidGeneratorService.getUuid() : null;
      this.onEstablishmentSearch(
        this.isAppPrivate ? this.regNoToken.value : this.establishmentService.getRegistrationFromStorage()
      );
    } else {
      this.initializeFromToken();
      this.canTransfer = true;
    }
  }

  /** Method to initialize keys from token. */
  initializeFromToken(): void {
    this.referenceNo = this.routerDataToken.transactionId;
    const payload = JSON.parse(this.routerDataToken.payload);
    if (payload) {
      this.registrationNo = Number(payload.registrationNo);
      if (payload.requestId) this.requestId = payload.requestId;
      this.getDataToDisplay();
    }
  }

  /** Method to fetch establishment details on establishment search. */
  onEstablishmentSearch(registrationNo: number) {
    if (registrationNo) {
      this.alertService.clearAlerts();
      this.registrationNo = registrationNo;
      this.getDataToDisplay();
    } else this.showMandatoryFieldsError();
  }

  /** Method to check whether it is edit mode. */
  checkTransferEdit() {
    this.route.url.subscribe(res => {
      if (res.length > 1) if (res[0].path === 'all' && res[1].path === 'edit') this.isEditMode = true;
    });
  }

  /** Method to get required data for view. */
  getDataToDisplay(): void {
    this.getWorkflowDetails()
      .pipe(
        switchMap(() => iif(() => !this.hasWorkflow, this.getEstablishmentDetails(this.registrationNo))),
        switchMap(est => iif(() => this.checkEstablishmentEligibility(est), this.getBranches()))
      )
      .subscribe({
        error: err => this.showError(err),
        complete: () => {
          if (this.canTransfer && this.isAppPrivate)
            this.getRequiredDocuments(
              this.isEditMode ? this.requestId : this.mainEstRegistrationNo,
              DocumentTransactionId.TRANSFER_ALL_ENGAGEMENT,
              DocumentTransactionType.TRANSFER_ALL_ENGAGEMENT,
              this.isEditMode,
              this.referenceNo
            );
        }
      });
  }

  /** Method to check workflow status of transfer. */
  getWorkflowDetails() {
    return this.transferService.getTransferAllDetails(this.registrationNo).pipe(
      tap(res => {
        if (this.isEditMode) this.transferAllDetails = res;
        else this.hasWorkflow = this.checkWokflowStatus(res.referenceNo);
      }),
      catchError(err => {
        if (err.error.code === 'CON-ERR-5208') return of(true);
        else {
          this.showError(err);
          return throwError(err);
        }
      })
    );
  }

  /** Method to check workflow status. */
  checkWokflowStatus(referenceNo: number) {
    if (referenceNo) {
      this.alertService.showErrorByKey('CONTRIBUTOR.TRANSFER-CON.TRANSFER-ALL-WORKFLOW-INFO', {
        transactionRefNo: referenceNo
      });
      return true;
    } else return false;
  }

  /** Method to check establishment eligibility. */
  checkEstablishmentEligibility(establishment: Establishment): boolean {
    let flag = true;
    if (
      establishment.status.english !== EstablishmentStatusEnum.REGISTERED &&
      establishment.status.english !== EstablishmentStatusEnum.REOPEN
    ) {
      flag = false;
      this.alertService.showErrorByKey('CONTRIBUTOR.TRANSFER-CON.NO-UNREGISTERED-TRANSFER');
    } else if (establishment.gccEstablishment && establishment.gccEstablishment.gccCountry) {
      flag = false;
      this.alertService.showErrorByKey('CONTRIBUTOR.TRANSFER-CON.NO-GCC-TRANSFER');
    }
    return flag;
  }

  /** Method to get branches of establishment. */
  getBranches() {
    return this.establishmentService.getBranches(this.registrationNo).pipe(
      tap(res => {
        this.canTransfer = this.checkBranchEligibility(res);
        if (this.canTransfer) this.createLookups(res);
      })
    );
  }

  /** Method to check branch eligibility. */
  checkBranchEligibility(branches: BranchDetails[]) {
    let flag = true;
    if (!branches || branches.length === 0 || branches.length === 1) {
      flag = false;
      this.alertService.showErrorByKey('CONTRIBUTOR.TRANSFER-CON.NO-BRANCHES-MESSAGE');
    }
    return flag;
  }

  /** Method to create lookups for view. */
  createLookups(branchList: BranchDetails[]) {
    this.mainEstRegistrationNo = branchList[0].registrationNo;
    this.registrationNumberList = branchList.map(branch => branch.registrationNo);
    this.estNameList = branchList.map(branch => {
      const newLov = new Lov();
      newLov.sequence = branchList.indexOf(branch);
      newLov.value.english = branch.name.english ? branch.name.english : branch.name.arabic;
      newLov.value.arabic = branch.name.arabic ? branch.name.arabic : branch.name.english;
      return newLov;
    });
    this.branchList = branchList;
    this.establishmentType$ = this.lookupService.getEstablishmentTypeList();
  }

  /** Method to fetch total and active contributor count for establishment. */
  fetchActiveCont(regNo: number) {
    this.contributorCount = forkJoin([
      this.contributorWageService.getContributorWageDetails(
        regNo,
        new ContributorWageParams(false, true, 'ACTIVE'),
        false
      ),
      this.contributorWageService.getContributorWageDetails(
        regNo,
        new ContributorWageParams(false, true, 'TRANSFERABLE'),
        false
      )
    ]).pipe(
      map(([active, transferable]) => {
        this.checkTransferableEligibility(transferable.numberOfContributors);
        return new ContributorCountDetails(
          Number(active.numberOfContributors),
          Number(transferable.numberOfContributors)
        );
      })
    );
  }

  /** Method to check transferable eligibility. */
  checkTransferableEligibility(count: number) {
    if (count > 0) this.isTransferable = true;
    else {
      this.isTransferable = false;
      this.alertService.showWarningByKey('CONTRIBUTOR.TRANSFER-CON.NO-ELIGIBLE-CONTRIBUTORS');
    }
  }

  /** Method to refresh documents. */
  refreshTransferDocument(document: DocumentItem): void {
    super.refreshDocument(
      document,
      this.isEditMode ? this.requestId : this.mainEstRegistrationNo,
      DocumentTransactionId.TRANSFER_ALL_ENGAGEMENT,
      DocumentTransactionType.TRANSFER_ALL_ENGAGEMENT,
      this.referenceNo,
      this.uuid
    );
  }

  /** Method to submit transfer all request. */
  submitTransferAll(): void {
    if (this.checkValidity())
      this.transferService
        .submitTransferRequest(
          this.parentForm.get('transferAllForm.registrationNoFrom').value,
          this.assembleTransferAllPayload()
        )
        .pipe(
          tap(res => {
            if (!this.isEditMode) this.successMessage = res;
          }),
          switchMap(() => iif(() => this.isEditMode, this.saveTransferAllWorkflow())),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
  }

  /** Method to save transferAll workflow.  */
  saveTransferAllWorkflow() {
    const data = super.assembleWorkflowPayload(this.routerDataToken, this.parentForm.get('comments.comments').value);
    return this.workflowService.updateTaskWorkflow(data).pipe(
      tap(res => {
        if (res) {
          this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.VALIDATOR-EDIT-MESSAGE');
          this.navigateBack(true);
        }
      })
    );
  }

  /** Method to check validity of transaction. */
  checkValidity(): boolean {
    let isValid = true;
    const isDocumentScanned = this.isAppPrivate ? this.documentService.checkMandatoryDocuments(this.documents) : true;
    if (this.parentForm.valid) {
      if (isDocumentScanned) isValid = true;
      else {
        isValid = false;
        this.showMandatoryDocumentsError();
      }
    } else {
      isValid = false;
      markFormGroupTouched(this.parentForm);
      this.showMandatoryFieldsError();
    }
    return isValid;
  }

  /** Method to assemble transfer all  payload. */
  assembleTransferAllPayload(): TransferContributorPayload {
    const transferForm = this.parentForm.get('transferAllForm').value;
    const payload = new TransferContributorPayload();
    payload.editFlow = this.isEditMode;
    payload.transferAll = true;
    payload.transferItem = null;
    payload.requestId = this.isEditMode ? this.requestId : null;
    payload.transferTo = transferForm.registrationNoTo;
    payload.comments = this.parentForm.get('comments.comments').value;
    if (!this.uuid) payload.uuid = this.uuid;
    return payload;
  }

  /** Method to navigate back. */
  navigateBack(isSuccess: boolean) {
    if (this.isEditMode && !isSuccess)
      this.router.navigate([ContributorRouteConstants.ROUTE_TRANSFER_ALL_CONTRIBUTOR_VALIDATOR]);
    else if (this.isEditMode && isSuccess) this.router.navigate([RouterConstants.ROUTE_INBOX]);
    else if (!this.isEditMode)
      this.router.navigate([
        this.isAppPrivate ? RouterConstantsBase.ROUTE_ESTABLISHMENT_SEARCH : RouterConstants.ROUTE_DASHBOARD
      ]);
  }

  /** Method to submit transfer all request. */
  cancelTransferAll(template: TemplateRef<HTMLElement>): void {
    const docStatus = this.findDocumentStatus();
    if (getFormErrorCount(this.parentForm) > 0 || this.parentForm.dirty || docStatus) this.showModal(template);
    else this.navigateBack(false);
  }

  /** Method to gt document status. */
  findDocumentStatus(): boolean {
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

  /** Method to check whether revert is required. */
  checkRevertTransaction(): void {
    this.hideModal();
    if (this.findDocumentStatus() && this.isEditMode) this.revertTransferAllRequest();
    else this.navigateBack(false);
  }

  /** Method to revert transfer all  */
  revertTransferAllRequest(): void {
    this.transferService.revertTransactionAll(this.registrationNo, this.requestId).subscribe(
      () => this.navigateBack(false),
      err => this.showError(err)
    );
  }

  /** Method to handle tasks on component destroy. */
  ngOnDestroy(): void {
    this.alertService.clearAlerts();
  }
}
