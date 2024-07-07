/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  CalendarService,
  CoreIndividualProfileService,
  DocumentItem,
  DocumentService,
  LookupService,
  OccupationList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  StorageService,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { pensionReformEligibility } from '@gosi-ui/features/contributor/lib/shared/models/pr-eligibility';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, iif, of } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { VicBaseScComponent } from '../../../../shared/components/base/vic-base-sc.component';
import { BreadcrumbConstants, ContributorRouteConstants, VicConstants } from '../../../../shared/constants';
import {
  DocumentTransactionId,
  DocumentTransactionType,
  FormWizardTypes,
  TransactionId,
  TransactionName
} from '../../../../shared/enums';
import { VicEngagementDetails, VicEngagementPayload, VicWageUpdateSummary } from '../../../../shared/models';
import {
  AddVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService,
  VicWageUpdateService
} from '../../../../shared/services';

@Component({
  selector: 'cnt-vic-wage-update-sc',
  templateUrl: './vic-wage-update-sc.component.html'
})
export class VicWageUpdateScComponent extends VicBaseScComponent implements OnInit {
  /**Local variables */
  parentForm = new FormGroup({});
  vicWageUpdateBanner = VicConstants.UPDATE_WAGE_BANNER_FIELDS;
  vicEngagementDetails: VicEngagementDetails;
  disableOccupation = false;
  disableWage = false;
  currentWageCategory: number;
  previousUrl: string;
  currentUrl: string;
  pensionReformEligibility: pensionReformEligibility;

  /** Observables. */
  occupationList$: Observable<OccupationList>;
  @ViewChild('brdcmb', { static: false })
  cntWageBrdcmb: BreadcrumbDcComponent;
  isEligible = false;
  /** This method is to initialize VicWageUpdateScComponent. */
  constructor(
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly fb: FormBuilder,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly manageWageService: ManageWageService,
    readonly addVicService: AddVicService,
    readonly vicService: VicService,
    readonly vicWageUpdateService: VicWageUpdateService,
    readonly changePersonService: ChangePersonService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly storageService: StorageService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly coreService: CoreIndividualProfileService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
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
    this.alertService.clearAlerts();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.setParamsForView();
    this.checkEditMode();
    this.handleLookup();
    this.initializeWizard();
    this.personId = this.changePersonService.getURLId();
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.route.queryParams.subscribe(params => {
        this.socialInsuranceNo = params.nin;
        this.engagementId = params.engId;
        if (this.socialInsuranceNo) this.getDataToDisplay();
      });
    } else {
      if (this.isEditMode) this.initializeViewForEdit();
      else {
        this.socialInsuranceNo = this.manageWageService.socialInsuranceNo;
        this.engagementId = this.manageWageService.engagementId;
        if (this.socialInsuranceNo) this.getDataToDisplay();
      }
    }
  }
  ngAfterViewInit() {
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.cntWageBrdcmb.breadcrumbs = BreadcrumbConstants.CNT_BREADCRUMB_VALUES;
    }
  }
  /** Method to set parameters for view. */
  setParamsForView() {
    this.totalTab = 2;
    this.transactionId = TransactionId.MANAGE_VIC_WAGE;
  }

  /** Method to handle lookup. */
  handleLookup(): void {
    this.getPurposeOfRegistrationList();
    this.occupationList$ = this.lookupService.getOccupationList();
  }

  /** Method to get purpose of registration. */
  getPurposeOfRegistrationList() {
    this.lookupService
      .getPurposeOfRegistrationList()
      .pipe(filter(res => res !== null))
      .subscribe({ next: res => (this.purposeOfRegistrationList = res.items) });
  }

  /** Method to check for edit mode. */
  checkEditMode() {
    this.route.url.subscribe(res => {
      if (res.length > 0) if (res[2]?.path === 'edit') this.isEditMode = true;
    });
  }

  /** Method to initialize wizard. */
  initializeWizard(): void {
    this.wizardItems = this.getWizardItems();
    this.initializeFirstWizardItem();
  }

  /** Method to fetch wizard items. */
  getWizardItems(): WizardItem[] {
    return [
      new WizardItem(FormWizardTypes.ENGAGEMENT_DETAILS, 'briefcase'),
      new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt')
    ];
  }

  /** Method to initialize view on edit. */
  initializeViewForEdit(): void {
    super.initializeFromToken();
    this.activeTab = this.routerDataToken.tabIndicator;
    this.setWizardOnEdit();
    this.getDataToDisplay();
  }

  /** Method to get required data for view. */
  getDataToDisplay(): void {
    this.getContributor()
      .pipe(
        switchMap(() => this.getVicEngagementDetails()),
        switchMap(() =>
          this.getVICWageCategories(
            this.vicEngagementDetails.purposeOfRegistration.english,
            TransactionName.MANAGE_VIC_WAGE
          )
        ),
        switchMap(() => this.checkEligibility()), // comment #forDisable
        switchMap(() => {
          return iif(
            () => this.isEditMode,
            this.vicWageUpdateService
              .getVicWageUpdateDetails(this.socialInsuranceNo, this.engagementId, this.referenceNo)
              .pipe(tap(res => this.handleEditActions(res.wageSummary))),
            of(true)
          );
        }),
        tap(() => {
          if (this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP)
            super.getRequiredDocuments(
              this.engagementId,
              DocumentTransactionId.MANAGE_VIC_WAGE,
              DocumentTransactionType.MANAGE_VIC_WAGE,
              this.isEditMode,
              this.referenceNo
            );
        })
      )
      .subscribe({
        next: () => this.setCurrentWageCategoryFlag(this.currentWageCategory),
        error: err => this.showError(err)
      });
  }

  /** Method to enable or disable fields during edit. */
  handleEditActions(summary: VicWageUpdateSummary): void {
    if (summary?.currentPeriod?.occupation?.english === summary?.updatedPeriod?.occupation?.english)
      this.disableOccupation = true;
    if (summary?.currentPeriod?.basicWage === summary?.updatedPeriod?.basicWage) this.disableWage = true;
  }

  /** Method to get vic engagement details with sin.*/
  getVicEngagementDetails() {
    return this.vicService
      .getVicEngagementById(this.socialInsuranceNo, this.engagementId)
      .pipe(tap(res => this.setEngagementDetails(res)));
  }

  /** Method to set engagement details. */
  setEngagementDetails(engagement: VicEngagementDetails) {
    if (engagement) {
      this.vicEngagementDetails = engagement;
      this.currentWageCategory = this.vicEngagementDetails.engagementPeriod.find(
        item => item.isCurrentPeriod
      ).wageCategory;
    }
  }
  checkEligibility() {
    return this.contributorService.checkEligibilityNin(this.nin).pipe(
      tap(res => {
        this.pensionReformEligibility = res;
        if (res.pensionReformEligible === 'Not Eligible' || res.pensionReformEligible === 'Impacted') {
          this.isEligible = false;
        } else {
          this.isEligible = true;
        }
      })
    );
  }
  /** Method to set current wage category flag. */
  setCurrentWageCategoryFlag(currentCategory: number) {
    this.vicWageCategories.forEach(item => {
      if (item.category === currentCategory) {
        item.isCurrent = true;
        item.disabled = false;
      }
    });
  }

  /** Method to handle update vic wage. */
  onUpdateVicWage(vicEngagement: VicEngagementPayload): void {
    if (vicEngagement) this.updateVicWage(vicEngagement);
    else super.showMandatoryFieldsError();
  }

  /** Method to save vic wage update. */
  updateVicWage(vicEngagement: VicEngagementPayload): void {
    vicEngagement.engagementPeriod.editFlow = this.isEditMode;
    this.vicWageUpdateService.updateVicWage(this.nin, this.engagementId, vicEngagement).subscribe({
      next: res => {
        this.referenceNo = res.referenceNo;
        this.hasSaved = true;
        if (moment(res?.incomeCategoryStartDate?.gregorian?.toString()).isSameOrBefore(moment(new Date().toString()))) {
          this.alertService.showSuccess(res.message);
        }
        this.setNextSection();
      },
      error: err => this.showError(err)
    });
  }

  /** Method to refresh document. */
  refreshDoc(document: DocumentItem): void {
    super.refreshDocument(
      document,
      this.engagementId,
      DocumentTransactionId.MANAGE_VIC_WAGE,
      DocumentTransactionType.MANAGE_VIC_WAGE,
      this.referenceNo
    );
  }

  /** Method to handle vic wage update submit. */
  onSubmitVicWageUpdate(): void {
    if (this.checkDocuments()) this.submitVicUpdate();
    else this.showMandatoryDocumentsError();
  }

  /** Method to submit vic wage update. */
  submitVicUpdate(): void {
    this.vicWageUpdateService
      .submitVicWageUpdate(
        this.nin,
        this.engagementId,
        this.referenceNo,
        this.parentForm.get('comments.comments').value
      )
      .pipe(
        tap(res => {
          this.hasSaved = true;
          if (!this.isEditMode) {
            this.alertService.showSuccess(res.message, null, 10);
            this.coreService.setSuccessMessage(res.message, true);
            this.navigateBack();
          }
        }),
        switchMap(() => iif(() => this.isEditMode, this.submitTransactionOnEdit(), of(true)))
      )
      .subscribe({
        error: err => this.showError(err)
      });
  }

  /** Method to submit transaction on edit. */
  submitTransactionOnEdit() {
    const workflowPayload = this.assembleWorkflowPayload(
      this.routerDataToken,
      this.parentForm.get('comments.comments').value
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

  /** Method to cancel vic wage update. */
  cancelVicWageUpdate(template: TemplateRef<HTMLElement>): void {
    if (
      this.checkConfirmationRequired(this.parentForm) ||
      this.checkWageCategoryStatus() ||
      this.changeBasicWageStatus()
    )
      this.showModal(template);
    else this.navigateBack();
  }

  /** Method to get wagecategory status. */
  checkWageCategoryStatus(): boolean {
    return this.parentForm.get('wageCategory.changed') ? this.parentForm.get('wageCategory.changed').value : false;
  }
  /** Method to change in basic wage for pr eligible. */
  changeBasicWageStatus(): boolean {
    return this.parentForm.get('basicWage.changed') ? this.parentForm.get('basicWage.changed').value : false;
  }

  /** Method to navigate back */
  navigateBack(isCompleted: boolean = false) {
    if (this.isEditMode)
      this.router.navigate([
        isCompleted ? RouterConstants.ROUTE_INBOX : ContributorRouteConstants.ROUTE_VIC_INDIVIDUAL_WAGE_VALIDATOR
      ]);
    else if (this.storageService.getLocalValue('individualProfile'))
      setTimeout(() => {
        this.router.navigate([`/home/profile/individual/internal/${this.personId}/engagements`]);
      }, 3000);
    else this.location.back();
  }

  /** Method to handle confirm cancellation. */
  confirmCancel() {
    this.hideModal();
    if (
      this.checkRevertRequired(this.parentForm.get('docStatus.changed')) ||
      (this.isEditMode && this.checkWageCategoryStatus())
    )
      this.revertVicWageTransaction();
    else this.navigateBack();
  }

  /** Method to revert vic wage update. */
  revertVicWageTransaction(): void {
    this.vicService.revertTransaction(this.socialInsuranceNo, this.engagementId, this.referenceNo).subscribe(
      () => this.navigateBack(),
      err => this.showError(err)
    );
  }
}
