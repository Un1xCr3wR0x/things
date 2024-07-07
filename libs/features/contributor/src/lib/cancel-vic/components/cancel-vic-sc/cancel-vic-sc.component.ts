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
  ApplicationTypeToken,
  BankAccount,
  BilingualText,
  CalendarService,
  CoreContributorService,
  CoreIndividualProfileService,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WizardItem,
  WorkflowService,
  getPersonArabicName,
  getPersonEnglishName
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import * as moment from 'moment-timezone';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, iif, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { VicBaseScComponent } from '../../../shared/components';
import { ContributorRouteConstants, VicConstants } from '../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType, FormWizardTypes, TransactionId } from '../../../shared/enums';
import {
  CancelContributorDetails,
  CancelContributorRequest,
  VicContributionDetails,
  VicEngagementDetails
} from '../../../shared/models';
import { pensionReformEligibility } from '../../../shared/models/pr-eligibility';
import {
  CancelVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService
} from '../../../shared/services';

@Component({
  selector: 'cnt-cancel-vic-sc',
  templateUrl: './cancel-vic-sc.component.html',
  styleUrls: ['./cancel-vic-sc.component.scss']
})
export class CancelVicScComponent extends VicBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  cancelVicForm: FormGroup = new FormGroup({});
  cancelVicBanner = VicConstants.UPDATE_WAGE_BANNER_FIELDS;
  vicEngagement: VicEngagementDetails;
  vicContributionDetails: VicContributionDetails;
  personName: BilingualText = new BilingualText();
  cancellationDetails: CancelContributorDetails;
  transactionTypes: string[] = [];
  bankAccountDetails: BankAccount;
  isBankDetailsPending: boolean;
  pensionReformEligibility: pensionReformEligibility;

  /** Observables */
  cancellationReason$: Observable<LovList>;
  terminationReason$: Observable<LovList>;
  bankName$: Observable<LovList>;

  /** Child components. */
  @ViewChild('progressWizardItems') progressWizard: ProgressWizardDcComponent;
  @ViewChild('vicCancelConfirmationMessage') vicCancelConfirmationMessage: TemplateRef<HTMLElement>;
  isPREligible: boolean = false;
  lang: string;

  /** Creates an instance of CancelVicScComponent. */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly manageWageService: ManageWageService,
    readonly vicService: VicService,
    readonly cancelVicService: CancelVicService,
    readonly workflowService: WorkflowService,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly coreService: CoreIndividualProfileService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly coreContributorService: CoreContributorService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
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

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.setParamsForView();
    this.checkEditMode();
    this.initializeWizard();
    this.getLookupValues();
    if (this.isEditMode) this.getViewForEdit();
    else {
      this.socialInsuranceNo = this.manageWageService.socialInsuranceNo || this.coreContributorService.selectedSIN;
      this.engagementId = this.manageWageService.engagementId || this.coreContributorService.engagementId;
      if (this.socialInsuranceNo) this.initializeView();
    }
  }

  /** Method to check for edit mode. */
  checkEditMode() {
    this.route.url.subscribe(res => {
      if (res.length > 0) if (res[0]?.path === 'edit') this.isEditMode = true;
    });
  }

  /** Method to initialize view on edit. */
  getViewForEdit(): void {
    super.initializeFromToken();
    this.activeTab = this.routerDataToken.tabIndicator;
    this.initializeView();
    this.setWizardOnEdit();
  }

  /** Method to set parameters for view. */
  setParamsForView() {
    this.alertService.clearAllErrorAlerts();
    this.totalTab = 2;
    this.transactionId = TransactionId.CANCEL_VIC;
  }

  /** Method to initialize wizard. */
  initializeWizard() {
    this.wizardItems = this.getWizardItems();
    this.initializeFirstWizardItem(true);
  }

  /** Method to get wizard items. */
  getWizardItems() {
    return [
      new WizardItem(FormWizardTypes.CANCEL_VIC_DETAILS, 'cancel-vic'),
      new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt')
    ];
  }

  /** Method to look up values. */
  getLookupValues() {
    this.cancellationReason$ = this.lookupService.getVicReasonForCancellation();
  }

  /** Method to initialize view for vic cancellation. */
  initializeView() {
    this.getContributor(new Map().set('includeBankAccountInfo', true))
      .pipe(
        switchMap(() => this.checkEligibility()), //comment #forDisable
        switchMap(() => {
          return iif(
            () => this.isEditMode,
            this.cancelVicService
              .getCancellationDetails(this.socialInsuranceNo, this.engagementId, this.referenceNo)
              .pipe(tap(res => (this.cancellationDetails = res))),
            this.vicService
              .getVicEngagementById(this.socialInsuranceNo, this.engagementId)
              .pipe(tap(res => (this.vicEngagement = res)))
          );
        }),
        switchMap(() => {
          this.terminationReason$ = this.lookupService.getVICTerminationReasonList();
          this.checkAutoTerminationReasons(
            this.isEditMode ? this.cancellationDetails.leavingDate : this.vicEngagement.leavingDate,
            this.isEditMode ? this.cancellationDetails.leavingReason : this.vicEngagement.leavingReason
          );
          return this.terminationReason$;
        }),
        switchMap(() => {
          const leavingDate = this.isEditMode ? this.cancellationDetails.leavingDate : this.vicEngagement.leavingDate;
          return this.vicService
            .getVicContributionDetails(
              this.nin,
              this.engagementId,
              leavingDate ? moment(leavingDate.gregorian).format('YYYY-MM-DD') : null,
              'Cancel VIC'
            )
            .pipe(
              tap(res => (this.vicContributionDetails = res)),
              catchError(err => {
                this.showError(err);
                return of(new VicContributionDetails());
              })
            );
        }),
        switchMap(() => this.checkBankWorkflow()),
        tap(() => {
          if (this.isEditMode && this.activeTab === 1) this.getDocumentsOnEdit();
        })
      )
      .subscribe({
        error: err => this.showError(err)
      });
  }

  /** Method to check auto termination reason of the vic engagement. */
  checkAutoTerminationReasons(leavingDate: GosiCalendar, leavingReason: BilingualText) {
    if (leavingDate && leavingDate.gregorian)
      this.terminationReason$ = this.terminationReason$.pipe(
        filter(list => list && list !== null),
        map(list => {
          if (!list.items.some(item => item.value.english === leavingReason.english)) {
            const lov = new Lov();
            lov.items = undefined;
            lov.value = leavingReason;
            list.items.push(lov);
          }
          return list;
        })
      );
  }

  /** Method to check bank workflow. */
  checkBankWorkflow() {
    return this.contributorService
      .getBankDetailsWorkflowStatus(new Map().set('personId', this.contributor.person.personId))
      .pipe(
        tap(res => {
          if (res) {
            this.isBankDetailsPending = true;
            this.bankAccountDetails = res;
          } else this.bankAccountDetails = this.contributor?.bankAccountDetails[0];
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
  /** Method to get documents on edit mode. */
  getDocumentsOnEdit() {
    this.documentService
      .getDocuments(
        DocumentTransactionId.CANCEL_VIC,
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

  /** Method to handle cancel vic  save. */
  onCancelVicSave(payload: CancelContributorRequest) {
    if (payload) {
      this.isEditMode ? this.getDocumentsOnEdit() : this.fetchDocumentList(this.identifyTransactionTypes());
      this.saveCancelVicRequest(payload);
    } else this.showMandatoryFieldsError();
  }

  /** Method to save vic cancellation request. */
  saveCancelVicRequest(payload: CancelContributorRequest) {
    this.cancelVicService.saveVicCancellation(this.nin, this.engagementId, payload).subscribe(
      res => {
        this.referenceNo = res.referenceNo;
        this.hasSaved = true;
        this.setNextSection();
      },
      err => this.showError(err)
    );
  }

  /** Method to refresh document after scan. */
  refreshDoc(document: DocumentItem) {
    super.refreshDocument(document, this.engagementId, DocumentTransactionId.CANCEL_VIC, null, this.referenceNo);
  }

  /** Method to handle cancel vic submit. */
  onSubmitCancelVic(): void {
    if (this.checkDocuments()) {
      this.personName.english = getPersonEnglishName(this.contributor.person.name.english);
      this.personName.arabic = getPersonArabicName(this.contributor.person.name.arabic);
      if (this.personName.english === null) {
        this.personName.english = this.personName.arabic;
      }
      this.showModal(this.vicCancelConfirmationMessage);
    } else this.showMandatoryDocumentsError();
  }

  /** Method to submit cancel vic request. */
  submitCancelVicRequest(): void {
    if (this.modalRef) this.hideModal();
    this.cancelVicService
      .submitVicCancellation(
        this.nin,
        this.engagementId,
        this.referenceNo,
        this.isEditMode,
        this.cancelVicForm.get('comments.comments').value
      )
      .pipe(
        tap(res => {
          this.hasSaved = true;
          if (!this.isEditMode) {
            this.navigateBack();
            this.alertService.showSuccess(res.message, null, 10);
            this.coreService.setSuccessMessage(res.message, true);
          }
        }),
        switchMap(() => iif(() => this.isEditMode, this.submitTransactionOnEdit(), of(true)))
      )
      .subscribe({ error: err => this.showError(err) });
  }

  /** Method to submit transaction on edit. */
  submitTransactionOnEdit() {
    const workflowPayload = this.assembleWorkflowPayload(
      this.routerDataToken,
      this.cancelVicForm.get('comments.comments').value
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

  /** Method to handle cancellation of transaction. */
  onTransactionCancel(template: TemplateRef<HTMLElement>) {
    if (this.checkConfirmationRequired(this.cancelVicForm)) this.showModal(template);
    else this.navigateBack();
  }

  /** Method to confirm cancellation. */
  confirmCancel() {
    this.hideModal();
    if (this.checkRevertRequired(this.cancelVicForm.get('docStatus.changed'))) this.revertCancelVicTransaction();
    else this.navigateBack();
  }

  /** Method to revert cancel vic transaction. */
  revertCancelVicTransaction() {
    this.vicService.revertTransaction(this.socialInsuranceNo, this.engagementId, this.referenceNo).subscribe(
      () => this.navigateBack(),
      err => this.showError(err)
    );
  }
  /** Method to navigate back based on mode. */
  navigateBack(isCompleted = false) {
    if (this.isEditMode)
      this.router.navigate([
        isCompleted ? RouterConstants.ROUTE_INBOX : ContributorRouteConstants.ROUTE_CANCEL_VIC_VALIDATOR
      ]);
    else this.location.back();
  }

  /**  Method to get required document list based on transaction type. */
  fetchDocumentList(types: string[]) {
    super.getRequiredDocuments(
      this.engagementId,
      DocumentTransactionId.CANCEL_VIC,
      types,
      this.isEditMode || this.hasSaved,
      this.referenceNo
    );
  }

  /**Method to fetch bank details */
  getBankDetails(ibanCode: string): void {
    this.clearErrorAlerts();
    this.bankName$ = this.lookupService.getBank(ibanCode).pipe(
      tap(res => {
        if (res.items.length === 0) this.alertService.showErrorByKey('CONTRIBUTOR.INVALID-IBAN-ERROR');
      })
    );
  }

  /** Method to identify document types. */
  identifyTransactionTypes(): string[] {
    this.transactionTypes = [DocumentTransactionType.CANCEL_VIC];
    const iban: string = this.isEditMode
      ? this.bankAccountDetails.ibanAccountNo
      : this.cancelVicForm.get('bankDetailsForm')
      ? this.cancelVicForm.get('bankDetailsForm.ibanAccountNo').value
      : null;
    if (
      iban &&
      (this.contributor?.bankAccountDetails ? this.contributor?.bankAccountDetails[0]?.ibanAccountNo : '') !== iban
    )
      this.transactionTypes.push(DocumentTransactionType.BANK_UPDATE);
    return this.transactionTypes;
  }

  /** Method to clear error alerts. */
  clearErrorAlerts() {
    this.alertService.clearAllErrorAlerts();
  }

  /** Method to clear alerts  */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
}
