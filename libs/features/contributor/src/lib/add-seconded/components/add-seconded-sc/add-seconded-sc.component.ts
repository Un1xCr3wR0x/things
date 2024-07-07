/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
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
  getFormErrorCount,
  LookupService,
  LovList,
  markFormGroupTouched,
  RouterConstants,
  RouterData,
  RouterDataToken,
  startOfDay,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { iif, noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ContributorBaseScComponent } from '../../../shared/components';
import { ContributorRouteConstants } from '../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType, TransactionId } from '../../../shared/enums';
import { Contributor, ContributorBPMRequest, PersonalInformation, SecondedDetails } from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  SecondedService,
  ManageWageService
} from '../../../shared/services';

@Component({
  selector: 'cnt-add-seconded-sc',
  templateUrl: './add-seconded-sc.component.html',
  styleUrls: ['./add-seconded-sc.component.scss']
})
export class AddSecondedScComponent extends ContributorBaseScComponent implements OnInit {
  /** Local variables. */
  isAppPrivate: boolean;
  secondedForm: FormGroup = new FormGroup({});
  transactionId: number = TransactionId.ADD_SECONDED;
  isTransactionSuccess = false;
  successMessage: BilingualText;
  secondedId: number;
  secondedDetails: SecondedDetails;

  /** Observables */
  govtEstablishmentList$: Observable<LovList>;

  /** Creates an instance of AddSecondedScComponent. */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly secondedService: SecondedService,
    readonly workflowService: WorkflowService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly lookupSerice: LookupService,
    readonly modalService: BsModalService,
    readonly manageWageService: ManageWageService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
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
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.checkEditMode();
    this.setKeysForView();
    this.getLookups();
    if (this.checkKeys()) this.initializeView();
  }

  /** MEthod to check edit mode. */
  checkEditMode(): void {
    this.route.url.subscribe(res => {
      if (res.length > 1) if (res[0].path === 'add' && res[1].path === 'edit') this.isEditMode = true;
    });
  }

  /** Method to set keys for view. */
  setKeysForView(): void {
    if (this.isEditMode) this.readKeysFromToken();
    else this.readKeysFromService();
  }

  /** Method to read keys from token. */
  readKeysFromToken(): void {
    this.referenceNo = this.routerDataToken.transactionId;
    const payload = JSON.parse(this.routerDataToken.payload);
    if (payload) {
      this.registrationNo = payload.RegistrationNo;
      this.secondedId = payload.id;
    }
  }

  /** Method to read keys from service. */
  readKeysFromService(): void {
    this.registrationNo = this.establishmentService.getRegistrationNo;
    this.personId = this.contributorService.personId;
  }

  /** Method to check keys. */
  checkKeys(): boolean {
    if (this.registrationNo && ((!this.isEditMode && this.personId) || (this.isEditMode && this.secondedId)))
      return true;
    else {
      this.router.navigate([ContributorRouteConstants.ROUTER_CONTRIBUTOR_SEARCH]);
      return false;
    }
  }

  /** Method to get look up values. */
  getLookups(): void {
    this.govtEstablishmentList$ = this.lookupSerice.getGovernmentUniversities();
  }

  /** Method to initialize the view. */
  initializeView(): void {
    this.getEstablishmentDetails(this.registrationNo)
      .pipe(
        tap(res => (this.establishment = res)),
        switchMap(() => iif(() => this.isEditMode, this.getSecondedDetails(), this.getPersonDetails(this.personId))),
        tap(() =>
          this.getRequiredDocuments(
            this.isEditMode ? this.secondedId : this.personId,
            DocumentTransactionId.ADD_SECONDED,
            this.isAppPrivate ? DocumentTransactionType.ADD_SECONDED_FO : DocumentTransactionType.ADD_SECONDED_GOL,
            this.isEditMode,
            this.referenceNo
          )
        ),
        catchError(err => {
          this.showError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get person details. */
  getPersonDetails(personId: number): Observable<PersonalInformation> {
    return this.contributorService.getPersonById(personId).pipe(
      tap(res => {
        this.contributor = new Contributor();
        this.contributor.person = res;
      })
    );
  }

  /** Method to get seconded details. */
  getSecondedDetails(): Observable<PersonalInformation> {
    return this.secondedService.getSecondedDetails(this.registrationNo, this.secondedId).pipe(
      tap(res => (this.secondedDetails = res)),
      switchMap(res => {
        this.personId = res.personId;
        return this.getPersonDetails(res.personId);
      })
    );
  }

  /** Method to refresh document. */
  refreshDocument(document: DocumentItem): void {
    super.refreshDocument(
      document,
      this.isEditMode ? this.secondedId : this.personId,
      DocumentTransactionId.ADD_SECONDED,
      this.isAppPrivate ? DocumentTransactionType.ADD_SECONDED_FO : DocumentTransactionType.ADD_SECONDED_GOL,
      this.referenceNo
    );
  }

  /** Method to submit seconded details. */
  submitSecondedDetails(): void {
    if (this.checkTransactionValidity()) {
      this.secondedService
        .submitSecondedDetails(this.registrationNo, this.assembleSecondedDetails())
        .pipe(
          tap(res => {
            if (!this.isEditMode) {
              this.isTransactionSuccess = true;
              this.successMessage = res.message;
            }
          }),
          switchMap(() => iif(() => this.isEditMode, this.saveWorkflowOnEdit())),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }

  /** Method to check transaction validity. */
  checkTransactionValidity(): boolean {
    let isValid = true;
    markFormGroupTouched(this.secondedForm);
    if (this.secondedForm.valid) {
      if (!this.documentService.checkMandatoryDocuments(this.documents)) {
        this.showMandatoryDocumentsError();
        isValid = false;
      }
    } else {
      this.showMandatoryFieldsError();
      isValid = false;
    }
    return isValid;
  }

  /** Method to assemble seconded details. */
  assembleSecondedDetails(): SecondedDetails {
    const payload: SecondedDetails = new SecondedDetails();
    payload.personId = this.personId;
    payload.currentEstablishment = this.secondedForm.get('secondedForm.currentEstablishment').value;
    payload.startDate.gregorian = startOfDay(this.secondedForm.get('secondedForm.startDate.gregorian').value);
    payload.endDate.gregorian = startOfDay(this.secondedForm.get('secondedForm.endDate.gregorian').value);
    payload.contractDate.gregorian = startOfDay(this.secondedForm.get('secondedForm.contractDate.gregorian').value);
    payload.salary = this.secondedForm.get('secondedForm.salary').value;
    payload.editFlow = this.isEditMode;
    payload.secondedId = this.secondedId;
    payload.formSubmissionDate = undefined;
    return payload;
  }

  /** Method to save workflow on edit. */
  saveWorkflowOnEdit(): Observable<BilingualText> {
    const workflowPayload: ContributorBPMRequest = this.assembleWorkflowPayload(
      this.routerDataToken,
      this.secondedForm.get('comments.comments').value
    );
    return this.workflowService.updateTaskWorkflow(workflowPayload).pipe(
      tap(res => {
        this.alertService.showSuccess(res);
        this.navigateBack(true);
      })
    );
  }

  /** Method to check for changes. */
  checkForChanges(template: TemplateRef<HTMLElement>): void {
    const docStatus = this.checkDocumentStatus();
    if (getFormErrorCount(this.secondedForm) > 0 || this.secondedForm.dirty || docStatus) this.showModal(template);
    else this.navigateBack(false);
  }

  /** Method to gt document status. */
  checkDocumentStatus(): boolean {
    return this.secondedForm.get('docStatus.changed') ? this.secondedForm.get('docStatus.changed').value : false;
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

  /** Method to navigate back based on mode. */
  navigateBack(isTransactionSuccess: boolean): void {
    if (this.isEditMode) {
      if (this.isAppPrivate)
        this.router.navigate([
          isTransactionSuccess ? RouterConstants.ROUTE_INBOX : ContributorRouteConstants.ROUTE_ADD_SECONDED_VALIDATOR
        ]);
      else this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
    } else this.router.navigate([ContributorRouteConstants.ROUTER_CONTRIBUTOR_SEARCH]);
  }

  /** Method to check whether revert is required. */
  checkRevertRequired(): void {
    this.hideModal();
    if (this.checkDocumentStatus() && this.isEditMode) this.revertSecondedRequest();
    else this.navigateBack(false);
  }

  /** Method to revert termination request. */
  revertSecondedRequest(): void {
    this.secondedService.revertTransaction(this.registrationNo, this.secondedId).subscribe(
      res => {
        if (res) this.navigateBack(false);
      },
      err => this.showError(err)
    );
  }
}
