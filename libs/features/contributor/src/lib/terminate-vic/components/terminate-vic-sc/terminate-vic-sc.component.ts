/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BankAccount,
  BilingualText,
  CalendarService,
  CoreIndividualProfileService,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WizardItem,
  WorkflowService,
  getPersonArabicName,
  getPersonEnglishName,
  startOfDay
} from '@gosi-ui/core';
import * as moment from 'moment-timezone';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, iif, noop, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { VicBaseScComponent } from '../../../shared/components';
import { ContributorRouteConstants, VicConstants } from '../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType, FormWizardTypes, TransactionId } from '../../../shared/enums';
import {
  TerminateContributorDetails,
  TerminateContributorPayload,
  VicContributionDetails,
  VicEngagementDetails
} from '../../../shared/models';
import { pensionReformEligibility } from '../../../shared/models/pr-eligibility';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  TerminateVicService,
  VicService
} from '../../../shared/services';

@Component({
  selector: 'cnt-terminate-vic-sc',
  templateUrl: './terminate-vic-sc.component.html',
  styleUrls: ['./terminate-vic-sc.component.scss']
})
export class TerminateVicScComponent extends VicBaseScComponent implements OnInit, OnDestroy {
  /**Local variables */
  terminateVicForm: FormGroup = new FormGroup({});
  terminateVicBanner = VicConstants.UPDATE_WAGE_BANNER_FIELDS;
  vicEngagementDetails: VicEngagementDetails;
  vicContributionDetails: VicContributionDetails;
  personName: BilingualText = new BilingualText();
  vicTerminateDetails: TerminateContributorDetails;
  transactionTypes: string[] = [];
  bankAccount: BankAccount;
  isBankDetailsPending: boolean;
  pensionReformEligibility: pensionReformEligibility;

  /** Observables. */
  terminationReasonList$: Observable<LovList>;
  bankNameList$: Observable<LovList>;

  /** Child components. */
  @ViewChild('vicConfirmationMessage') vicConfirmationMessage: TemplateRef<HTMLElement>;
  isPREligible: boolean = false;
  lang: string;

  /** This method is to initialize TerminateVicScComponent. */
  constructor(
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly manageWageService: ManageWageService,
    readonly vicService: VicService,
    readonly terminateVicService: TerminateVicService,
    readonly coreService: CoreIndividualProfileService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
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
      vicService,
      modalService,
      routerDataToken,
      appToken,
      router,
      calendarService
    );
  }

  /** Method to initialze the component. */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.fetchLookup();
    this.alertService.clearAlerts();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.setParamsForView();
    this.checkEditMode();
    this.initializeWizard();
    if (this.isEditMode) this.getViewForEdit();
    else {
      this.socialInsuranceNo = this.manageWageService.socialInsuranceNo;
      this.engagementId = this.manageWageService.engagementId;
      if (this.socialInsuranceNo) this.initializeDataToDisplay();
    }
  }

  /** Method to set parameters for view. */
  setParamsForView() {
    this.totalTab = 2;
    this.transactionId = TransactionId.TERMINATE_VIC;
  }

  /** Method to handle lookup. */
  fetchLookup(): void {
    this.terminationReasonList$ = this.lookupService.getVICTerminationReasonList();
  }

  /** Method to check for edit mode. */
  checkEditMode() {
    this.route.url.subscribe(res => {
      if (res.length > 0) if (res[0]?.path === 'edit') this.isEditMode = true;
    });
  }

  /** Method to initialize wizard. */
  initializeWizard(): void {
    this.wizardItems = this.getWizardItems();
    this.initializeFirstWizardItem(true);
  }

  /** Method to fetch wizard items. */
  getWizardItems(): WizardItem[] {
    return [
      new WizardItem(FormWizardTypes.TERMINATE_VIC_DETAILS, 'terminate-vic'),
      new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt')
    ];
  }

  /** Method to initialize view on edit. */
  getViewForEdit(): void {
    super.initializeFromToken();
    this.activeTab = this.routerDataToken.tabIndicator;
    this.initializeDataToDisplay();
    this.setWizardOnEdit();
  }

  /**Method to fetch contribution details on termination date change */
  terminationDateChange(date: Date): void {
    this.fetchContributionDetails(moment(date).format('YYYY-MM-DD')).subscribe(noop);
  }

  /** Method to initialize required data for view. */
  initializeDataToDisplay(): void {
    this.getContributor(new Map().set('includeBankAccountInfo', true))
      .pipe(
        switchMap(() => this.checkEligibility()), //comment #forDisable
        switchMap(() => iif(() => this.isEditMode, this.fetchVicTerminateDetails(), this.getVicEngagementDetails())),
        switchMap(() =>
          this.fetchContributionDetails(
            this.isEditMode ? moment(this.vicTerminateDetails.leavingDate.gregorian).format('YYYY-MM-DD') : null
          )
        ),
        switchMap(() => this.checkBankWorkflow()),
        tap(() => {
          if (this.isEditMode && this.activeTab === 1) this.getDocumentsOnEdit();
        })
      )
      .subscribe({
        error: err => this.showError(err)
      });
  }

  /**Method to get vic terminate details */
  fetchVicTerminateDetails(): Observable<TerminateContributorDetails> {
    return this.terminateVicService
      .getTerminateVicDetails(this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .pipe(tap(res => (this.vicTerminateDetails = res)));
  }

  /**Method to fetch payment detais */
  fetchContributionDetails(date?: string): Observable<VicContributionDetails> {
    if (this.socialInsuranceNo && this.engagementId)
      return this.vicService.getVicContributionDetails(this.nin, this.engagementId, date).pipe(
        tap(res => {
          this.vicContributionDetails = new VicContributionDetails();
          if (res) this.vicContributionDetails = res;
        }),
        catchError(err => {
          this.showError(err);
          return of(null);
        })
      );
    else return of(null);
  }

  /** Method to get vic engagement details with sin.*/
  getVicEngagementDetails() {
    return this.vicService
      .getVicEngagementById(this.socialInsuranceNo, this.engagementId)
      .pipe(tap(res => (this.vicEngagementDetails = res)));
  }

  /** Method to check bank workflow. */
  checkBankWorkflow() {
    return this.contributorService
      .getBankDetailsWorkflowStatus(new Map().set('personId', this.contributor.person.personId))
      .pipe(
        tap(res => {
          if (res) {
            this.isBankDetailsPending = true;
            this.bankAccount = res;
          } else this.bankAccount = this.contributor?.bankAccountDetails[0];
        })
      );
  }

  /** Method to get documents on edit. */
  getDocumentsOnEdit() {
    this.documentService
      .getDocuments(
        DocumentTransactionId.TERMINATE_VIC,
        this.identifyTransactionTypes(),
        this.engagementId,
        this.referenceNo
      )
      .subscribe(res => {
        res.forEach(doc => {
          if (doc.name.english === VicConstants.IBAN_DOC) doc.canDelete = false;
        });
        this.documents = res.filter(item =>
          item.name.english === VicConstants.IBAN_DOC && item.documentContent === null ? false : true
        );
      });
  }

  /** Method to handle save and next. */
  onSaveTerminateVic(payload: TerminateContributorPayload) {
    if (payload) {
      payload.leavingDate.gregorian = startOfDay(payload.leavingDate.gregorian);
      this.isEditMode ? this.getDocumentsOnEdit() : this.getDocumentList(this.identifyTransactionTypes());
      this.saveVicTermination(payload);
    } else super.showMandatoryFieldsError();
  }

  /** Method to identify document types based on leaving reason. */
  identifyTransactionTypes(): string[] {
    this.transactionTypes = [DocumentTransactionType.TERMINATE_VIC];
    const iban: string = this.isEditMode
      ? this.bankAccount.ibanAccountNo
      : this.terminateVicForm.get('bankDetailsForm')
      ? this.terminateVicForm.get('bankDetailsForm.ibanAccountNo').value
      : null;
    if (
      iban &&
      (this.contributor?.bankAccountDetails ? this.contributor.bankAccountDetails[0]?.ibanAccountNo : '') !== iban
    )
      this.transactionTypes.push(DocumentTransactionType.BANK_UPDATE);
    return this.transactionTypes;
  }

  /**  Method to get required document list based on transaction. */
  getDocumentList(types: string[]) {
    super.getRequiredDocuments(
      this.engagementId,
      DocumentTransactionId.TERMINATE_VIC,
      types,
      this.isEditMode || this.hasSaved,
      this.referenceNo
    );
  }
  /** Method to save vic  termination. */
  saveVicTermination(payload: TerminateContributorPayload) {
    payload.editFlow = this.isEditMode;
    this.terminateVicService.saveVicTermination(this.nin, this.engagementId, payload).subscribe(
      res => {
        this.hasSaved = true;
        this.referenceNo = res.referenceNo;
        this.setNextSection();
      },
      err => this.showError(err)
    );
  }

  /** Method to refresh document. */
  refreshDoc(document: DocumentItem): void {
    super.refreshDocument(document, this.engagementId, DocumentTransactionId.TERMINATE_VIC, null, this.referenceNo);
  }

  /** Method to navigate to submit. */
  onSubmitTerminateVic(): void {
    if (this.checkDocuments()) {
      this.personName.english = getPersonEnglishName(this.contributor.person.name.english);
      this.personName.arabic = getPersonArabicName(this.contributor.person.name.arabic);
      this.showModal(this.vicConfirmationMessage);
    } else this.showMandatoryDocumentsError();
  }

  /** Method to submit vic wage update. */
  submitVicTermination(): void {
    if (this.modalRef) this.hideModal();
    this.terminateVicService
      .submitVicTermination(
        this.nin,
        this.engagementId,
        this.referenceNo,
        this.isEditMode,
        this.terminateVicForm.get('comments.comments').value
      )
      .pipe(
        tap(res => {
          this.hasSaved = true;
          if (!this.isEditMode) {
            this.navigateBack();
            this.coreService.setSuccessMessage(res.message, true);
            this.alertService.showSuccess(res.message, null, 10);
          }
        }),
        switchMap(() => iif(() => this.isEditMode, this.submitTransactionOnEdit(), of(true)))
      )
      .subscribe({ error: err => this.showError(err) });
  }
  /**Method to fetch bank details */
  getBankDetails(ibanCode: string): void {
    this.clearErrorAlerts();
    this.bankNameList$ = this.lookupService.getBank(ibanCode).pipe(
      tap(res => {
        if (res.items.length === 0) this.alertService.showErrorByKey('CONTRIBUTOR.INVALID-IBAN-ERROR');
      })
    );
  }

  /** Method to submit transaction on edit. */
  submitTransactionOnEdit() {
    const workflowPayload = this.assembleWorkflowPayload(
      this.routerDataToken,
      this.terminateVicForm.get('comments.comments').value
    );
    return this.workflowService.updateTaskWorkflow(workflowPayload).pipe(
      tap(res => {
        if (res) {
          this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.VALIDATOR-EDIT-MESSAGE');
          this.navigateBack(true);
        }
      })
    );
  }
  /** Method to check pension-reform-eligibility. */
  checkEligibility() {
    return this.contributorService.checkEligibilityNin(this.nin).pipe(
      tap(res => {
        this.pensionReformEligibility = res;
        if (res.pensionReformEligible === 'Not Eligible' || res.pensionReformEligible === 'Impacted') {
          this.isPREligible = false;
        } else {
          this.isPREligible = true;
        }
      })
    );
  }
  /** Method to cancel vic wage update. */
  cancelTerminateVic(template: TemplateRef<HTMLElement>): void {
    if (this.checkConfirmationRequired(this.terminateVicForm)) this.showModal(template);
    else this.navigateBack();
  }

  /** Method to navigate back based on mode. */
  navigateBack(isCompleted = false) {
    if (this.isEditMode)
      this.router.navigate([
        isCompleted ? RouterConstants.ROUTE_INBOX : ContributorRouteConstants.ROUTE_TERMINATE_VIC_VALIDATOR
      ]);
    else this.location.back();
  }

  /** Method to handle confirm cancellation. */
  confirmCancel() {
    this.hideModal();
    if (this.checkRevertRequired(this.terminateVicForm.get('docStatus.changed'))) this.revertTransaction();
    else this.navigateBack();
  }

  /** Method to revert vic wage update. */
  revertTransaction(): void {
    this.vicService.revertTransaction(this.socialInsuranceNo, this.engagementId, this.referenceNo).subscribe(
      () => this.navigateBack(),
      err => this.showError(err)
    );
  }

  /** Method to clear error alerts. */
  clearErrorAlerts() {
    this.alertService.clearAllErrorAlerts();
  }

  /**Method to clear alerts  */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
}
