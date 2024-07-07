/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  bindToObject,
  CalendarService,
  CoreIndividualProfileService,
  DocumentItem,
  DocumentService,
  hijiriToJSON,
  LanguageToken,
  LegalEntitiesEnum,
  LookupService,
  LovList,
  OccupationList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  StorageService,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  ContributorBaseScComponent,
  ContributorRouteConstants,
  ContributorService,
  ContributorTypesEnum,
  DocumentTransactionId,
  DocumentTransactionType,
  EngagementDetails,
  EngagementPeriod,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../../shared';
import { UpdateCurrentWageDetailsDcComponent } from '../update-current-wage-details-dc/update-current-wage-details-dc.component';

@Component({
  selector: 'cnt-individual-wage-update-sc',
  templateUrl: './individual-wage-update-sc.component.html',
  styleUrls: ['./individual-wage-update-sc.component.scss']
})

/**
 * This class is used to single wage update for an individual
 */
export class IndividualWageUpdateScComponent extends ContributorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  selectedLang = 'en';
  //TODO: use it from base class
  currentEngagement: EngagementDetails;
  wageDetailsparentForm = new FormGroup({});
  canDeactivate = true;
  isUpdated = false;
  isEditValidator = false;
  isDocumentScanned = false;
  uuid: string;
  apiTriggered = false;
  isIndividualProfile: string;
  page: string;
  isPPA: boolean;
  alreadySavedWage:number=0;
  updatedTotalWage:number=0;
  updatedWageForm:FormGroup;
  wageDiff: number;

  /** Observables */
  occupationList$: Observable<OccupationList>;
  jobScaleList$: Observable<LovList>;

  /** Child component references. */
  @ViewChild('cancelTemplate1', { static: true })
  cancelTemplate1: TemplateRef<HTMLElement>;
  @ViewChild('cancelTemplate2', { static: true })
  cancelTemplate2: TemplateRef<HTMLElement>;
  @ViewChild('saveTemplate1', { static: true })
  saveTemplate1: TemplateRef<HTMLElement>;
  @ViewChild('currentWageDetails', { static: false })
  currentWageDetails: UpdateCurrentWageDetailsDcComponent;
  @ViewChild('wageDifferenceModal', { static: true }) 
  wageDifferenceModal: TemplateRef<HTMLElement>;

  /** Constructor method. */
  constructor(
    readonly contributorService: ContributorService,
    readonly manageWageService: ManageWageService,
    readonly establishmentService: EstablishmentService,
    readonly router: Router,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly engagementService: EngagementService,
    readonly workflowService: WorkflowService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private uuidGeneratorService: UuidGeneratorService,
    readonly coreService: CoreIndividualProfileService,
    readonly location: Location,
    readonly storageService: StorageService,
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
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { page: string };
    this.page = state?.page;
    super.getTodaysDate();
  }

  /** This method is used to handle additional initialisation tasks. */
  ngOnInit() {
    this.alertService.clearAlerts();
    this.occupationList$ = this.lookUpService.getOccupationList();
    this.isIndividualProfile = this.storageService.getLocalValue('individualProfile');
    this.handleInitialization();
  }

  /** Method to fetch data for view. */
  handleInitialization(): void {
    this.storageService.setLocalValue('initialize', true);
    this.establishment = this.manageWageService.getEstablishment;
    if (this.router.url.indexOf('/edit') >= 0) {
      super.initializeFromToken();
      this.manageWageService.registrationNo = this.registrationNo;
      this.getModifiedCurrentEngagment();
      this.isEditValidator = true;
    } else {
      this.language.subscribe(language => (this.selectedLang = language));
      super.initializeFromWageService();
      this.fetchEngagmentPeriod();
      super.getRequiredDocuments(
        this.engagementId,
        DocumentTransactionId.MANAGE_WAGE,
        DocumentTransactionType.MANAGE_WAGE
      );
      if (!this.isEditValidator) {
        this.uuid = this.uuidGeneratorService.getUuid();
      }
    }
  }

  /** To fetch current engagment details from manage wage service. */
  fetchEngagmentPeriod() {
    if (this.manageWageService.getCurrentEngagment) {
      this.currentEngagement = JSON.parse(JSON.stringify(this.manageWageService.getCurrentEngagment));
      this.isPPA = this.currentEngagement?.ppaIndicator;
      this.getContributor();
    } else this.navigateToWageDetails();
    if (this.isPPA) {
      this.getCalenderDataForPPAEst();
      this.getJobLookUps();
    }
  }

  /** Get current engagment details while in validator/edit workflow. */
  getModifiedCurrentEngagment() {
    this.manageWageService
      .getOccupationAndWageDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .pipe(
        tap(res => {
          this.currentEngagement = res;
          this.currentEngagement.engagementId = this.engagementId;
          this.isPPA = this.currentEngagement?.ppaIndicator;
          if (this.isPPA) {
            this.getCalenderDataForPPAEst();
            this.getJobLookUps();
          }
        })
      )
      .subscribe(() => {
        this.getContributor();
        super.getRequiredDocuments(
          this.engagementId,
          DocumentTransactionId.MANAGE_WAGE,
          DocumentTransactionType.MANAGE_WAGE,
          true
        );
      });
  }

  /** Method to get scanned documents while clicking the refresh icon. */
  refreshDocument(documentItem: DocumentItem) {
    super.refreshDocument(
      documentItem,
      this.currentEngagement.engagementId,
      DocumentTransactionId.MANAGE_WAGE,
      DocumentTransactionType.MANAGE_WAGE
    );
  }

  /** To fetch contributor details from core contributor service. */
  getContributor() {
    super.getContributorDetails(this.registrationNo, this.socialInsuranceNo).subscribe(() => {
      if (this.contributorType === 'non-saudi' || this.contributorType === 'NON_SAUDI') this.getEstablishment();
    });
  }

  /** Method to get establishment details from core establishment service.  */
  getEstablishment() {
    super.getEstablishmentDetails(Number(this.manageWageService.registrationNo)).subscribe(res => {
      this.contributorType =
        res.legalEntity.english === LegalEntitiesEnum.INDIVIDUAL
          ? ContributorTypesEnum.NON_SAUDI_PRIVATE
          : ContributorTypesEnum.NON_SAUDI_NON_PRIVATE;
    });
  }

  /** Method to cancel updated wage. */
  cancelUpdateWage() {
    if (this.checkFormValidity(this.wageDetailsparentForm.get('wageDetails'))) {
      if (this.wageDetailsparentForm?.dirty || this.checkDocumentStatus()) this.showTemplate(this.cancelTemplate2);
      else {
        this.canDeactivate = false;
        this.isEditValidator
          ? this.router.navigate([ContributorRouteConstants.ROUTE_VALIDATOR_MANAGE_WAGE])
          : this.location.back();
      }
    } else this.showTemplate(this.cancelTemplate1);
  }

  /** Method to get document status. */
  checkDocumentStatus(): boolean {
    return this.wageDetailsparentForm.get('docStatus.changed')
      ? this.wageDetailsparentForm.get('docStatus.changed').value
      : false;
  }

  /** Method to check form validity. */
  checkFormValidity(form: AbstractControl) {
    if (form) return form.valid;
    return false;
  }

  /** This method is used to show given template. */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to hide modal. */
  hideModal() {
    this.modalRef.hide();
  }

  /** Method to cancel wage update. */
  confirmCancel() {
    this.alertService.clearAlerts();
    this.currentWageDetails.patchWageDetailsForm();
    this.canDeactivate = false;
    this.hideModal();
    if (this.isEditValidator) this.cancelValidatorEditTransaction();
    else if (this.storageService.getLocalValue('individualProfile'))
      this.router.navigate([`/home/profile/individual/internal/${this.socialInsuranceNo}/engagements`]);
    else this.location.back();
  }

  /**  This method is to cancel validator edit transaction */
  cancelValidatorEditTransaction() {
    this.contributorService
      .revertTransaction(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .subscribe(
        res => {
          if (res) this.router.navigate([ContributorRouteConstants.ROUTE_VALIDATOR_MANAGE_WAGE]);
        },
        err => this.showError(err)
      );
  }

  /** Method to retain same screen when user choose stay. */
  confirmStay() {
    if (this.wageDetailsparentForm.get('wageDetails')) this.hideModal();
  }

  /** To navigate back to wage details view. */
  navigateToWageDetails() {
    this.location.back();
  }

  /** To navigate back to wage details view. */
  navigateToInbox() {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  /** Method to update current wage. */
  updateCurrentWage(updateWageForm: FormGroup) { 
    if (!this.apiTriggered) {
      const isDocumentsSubmitted =
        this.appToken === ApplicationTypeEnum.PRIVATE
          ? this.documentService.checkMandatoryDocuments(this.documents)
          : true;    
      if (!updateWageForm.valid) this.alertService.showMandatoryErrorMessage();
      else if (!this.checkForChangesInWagePeriod(updateWageForm.getRawValue())) this.showTemplate(this.saveTemplate1);
      else if (!isDocumentsSubmitted && this.appToken === ApplicationTypeEnum.PRIVATE)
        this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
      else if (isDocumentsSubmitted || this.appToken === ApplicationTypeEnum.PUBLIC) {
        if(!this.isPPA){
          this.calculateWageDifference(updateWageForm)
        }else{
          this.updateCurrentWageOccupationData(updateWageForm);
        }
      }
    }
  }
  updateCurrentWageOccupationData(updateWageForm){
    this.canDeactivate = false;
    const currentEngagmentPeriod: EngagementPeriod = bindToObject(
      new EngagementPeriod(),
      (updateWageForm as FormGroup).getRawValue()
    );
    currentEngagmentPeriod.startDate.hijiri = this.currentEngagement?.ppaIndicator
      ? hijiriToJSON(currentEngagmentPeriod.startDate.hijiri)
      : currentEngagmentPeriod.startDate.hijiri;
    if (this.currentEngagement?.ppaIndicator) {
      currentEngagmentPeriod.wage.commission = null;
      currentEngagmentPeriod.wage.housingBenefit = null;
      currentEngagmentPeriod.wage.otherAllowance = null;
    }
    currentEngagmentPeriod.uuid = this.uuid;
    if (this.wageDetailsparentForm.get('comments.comments')?.value)
      currentEngagmentPeriod.comments = this.wageDetailsparentForm.get('comments.comments').value;
    this.apiTriggered = true;
    this.storageService.setLocalValue('triggered', this.apiTriggered);
    this.manageWageService
      .updateWageDetails(
        currentEngagmentPeriod,
        this.registrationNo ? this.registrationNo : Number(this.manageWageService.registrationNo),
        this.socialInsuranceNo,
        this.currentEngagement.engagementId ? this.currentEngagement.engagementId : this.engagementId,
        this.isEditValidator
      )
      .subscribe(
        res => {
          if (this.isEditValidator) {
            const payload = this.assembleWorkflowPayload(
              this.routerDataToken,
              this.wageDetailsparentForm.get('comments.comments').value
            );
            this.workflowService.updateTaskWorkflow(payload).subscribe();
            this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.VALIDATOR-EDIT-MESSAGE');
            setTimeout(() => {
              this.navigateToInbox();
            }, 3000);
          } else {
            this.alertService.showSuccess(res.message, null, 10);
            if (this.page == 'individualProfile') this.coreService.setSuccessMessage(res.message, true);
            setTimeout(() => {
              this.navigateToWageDetails();
            }, 3000); //3s
          }
          this.isUpdated = true;
        },
        err => {
          this.apiTriggered = false;
          if (err.error?.details?.length > 0) this.alertService.showError(null, err.error.details);
          else this.alertService.showError(err.error.message, err.error.details);
        }
      );
  }
  // 
  calculateWageDifference(updateWageForm){
    this.updatedWageForm=updateWageForm;
    this.updatedTotalWage= parseFloat(updateWageForm.get('wage').get('totalWage').value);
    this.alreadySavedWage=this.currentEngagement?.engagementPeriod[0]?.wage?.totalWage;
    this.wageDiff = (((this.updatedTotalWage - this.alreadySavedWage) / (this.alreadySavedWage ) )* 100);
    if (this.wageDiff >= 50 || this.wageDiff <= -50){
      this.showTemplate(this.wageDifferenceModal);
    } else {
      this.updateCurrentWageOccupationData(updateWageForm);
    }
  }
  confirmWageUpdate() {
    this.updateCurrentWageOccupationData(this.updatedWageForm)
    this.hideModal();
  }
  resetWage(){
    this.updatedWageForm.get('wage').reset(this.currentEngagement?.engagementPeriod[0]?.wage);
    this.updatedWageForm.get('wage').updateValueAndValidity();
    this.hideModal();
  }

  /** Methpd to check changes in wage period. */
  checkForChangesInWagePeriod(period: EngagementPeriod) {
    let flag = false;
    const currentPeriod = this.currentEngagement.engagementPeriod[0];
    if (
      (!this.currentEngagement?.ppaIndicator && currentPeriod.occupation.english !== period.occupation.english) ||
      Number(currentPeriod.wage.basicWage) !== Number(period.wage.basicWage) ||
      Number(currentPeriod.wage.commission) !== Number(period.wage.commission) ||
      Number(currentPeriod.wage.housingBenefit) !== Number(period.wage.housingBenefit) ||
      Number(currentPeriod.wage.otherAllowance) !== Number(period.wage.otherAllowance) ||
      (this.currentEngagement?.ppaIndicator &&
        (currentPeriod.jobClassName?.english !== period?.jobClassName?.english ||
          currentPeriod.jobRankName?.english !== period?.jobRankName?.english ||
          currentPeriod.jobGradeName?.english !== period?.jobGradeName?.english))
    )
      flag = true;
    return flag;
  }

  /** Method to check for changes. */
  hasChanges() {
    if (this.wageDetailsparentForm.get('wageDetails').touched && this.canDeactivate) return true;
    else return false;
  }

  /** Method to handle tasks on component destroy. */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
  getJobLookUps() {
    this.jobScaleList$ = this.lookUpService.getJobScale();
    this.getJobClass(
      this.currentEngagement?.engagementPeriod[0]?.jobClassCode,
      this.currentEngagement?.engagementPeriod[0]?.jobRankCode
    );
  }
}
