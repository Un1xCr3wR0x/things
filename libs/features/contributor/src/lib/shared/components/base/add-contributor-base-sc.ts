/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Directive, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BPMUpdateRequest,
  BilingualText,
  CalendarService,
  DocumentService,
  GosiCalendar,
  LegalEntitiesEnum,
  LookupService,
  Lov,
  LovList,
  OccupationList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService,
  scrollToTop
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { Observable, concat, iif, noop, of, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { ContractAuthConstant, ContributorConstants, ContributorRouteConstants } from '../../constants';
import {
  ContributorTypesEnum,
  DocumentTransactionId,
  DocumentTransactionType,
  EngagementSubType,
  Nationalities,
  SubmitActions
} from '../../enums';
import {
  ContributorDetailsWrapper,
  ContributorSinResponse,
  EngagementDetails,
  SaveEngagementResponse,
  SubmitEngagementResponse,
  SystemParameter
} from '../../models';
import { ContributorService, EngagementService, EstablishmentService, ManageWageService } from '../../services';
import { getTransactionType, setWageDetails } from '../../utils';
import { ContributorBaseScComponent } from './contributor-base-sc.component';
@Directive()
export abstract class AddContributorBaseSc extends ContributorBaseScComponent {
  /** Variable declaration and initialization */
  totalTabs = 3;
  activeTab = 0;
  isGccEstablishment = false;
  isValidatorEdit = false;
  isEditAdmin = false;
  penaltyIndicator: boolean;
  updateBpmTask: BPMUpdateRequest = new BPMUpdateRequest();
  feedbackMessageToDisplay: BilingualText;
  backdatingIndicator: boolean;
  isDocumentsRequired = false; // for activating comment section
  documentUploadEngagementId: number;
  isBeneficiary: boolean;
  isSaved = false; //for revert api calls
  isContractRequired: boolean;
  systemParams: SystemParameter;
  minContractStartDate: GosiCalendar;
  isbackdated = false;
  isApiTriggered = false;
  joiningDate: GosiCalendar = new GosiCalendar();
  checkPersonalDetailsSaved: boolean = false;
  isDraftNeeded = false;
  notLocationBack = false;
  isMytransDraft = false;
  /** Lookup Observables */
  nationalityList$: Observable<LovList>;
  gccCountryList$: Observable<LovList>;
  educationList$: Observable<LovList>;
  specializationList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  genderList$: Observable<LovList>;
  internationalCountryList$: Observable<LovList>;
  maritalStatusList$: Observable<LovList>;
  workTypeList$: Observable<LovList>;
  yesOrNoList$: Observable<LovList>;
  occupationList$: Observable<OccupationList>;
  leavingReasonList$: Observable<LovList>;
  bankNameList$: Observable<LovList>;
  religionList$: Observable<LovList>;
  isDraftRequired: boolean; //resume transaction
  draftAvailable: boolean;
  engagementId: number;
  transactionTraceId: number;
  personDetailsApi: boolean;

  /**Progress wizard */
  @ViewChild('progressWizardItems', { static: false })
  progressWizardItems: ProgressWizardDcComponent;
  countryList$: Observable<LovList>;
  jobScaleList$: Observable<LovList>;

  constructor(
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly location: Location,
    readonly router: Router,
    readonly manageWageService: ManageWageService,
    readonly workflowService: WorkflowService,
    readonly calendarService: CalendarService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
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

  /** Method to set all lov lists on component load */
  setLovLists() {
    this.gccCountryList$ = this.lookupService.getGccCountryList();
    this.educationList$ = this.lookupService.getEducationList();
    this.specializationList$ = this.lookupService.getSpecializationList();
    this.cityList$ = this.lookupService.getCityList();
    this.genderList$ = this.lookupService.getGenderList();
    this.jobScaleList$ = this.lookupService.getJobScale();
    this.maritalStatusList$ = this.lookupService.getMaritalStatus().pipe(
      filter(res => res !== null),
      map(
        list =>
          new LovList(
            list.items.filter(lov => ContributorConstants.MARITAL_STATUS_EXCLUDE_LIST.indexOf(lov.value.english) === -1)
          )
      )
    );
    this.yesOrNoList$ = this.lookupService.getYesOrNoList();
    this.nationalityList$ = this.lookupService.getNationalityList();
    this.countryList$ = this.lookupService.getCountryList();
  }
  /** Method to fetch filtered lov list. */
  fetchFilteredLovList(ppaEstablishment?: boolean): void {
    this.filterLeavingReason(ppaEstablishment);
    this.filterWorkTypeList();
    this.filterOccupationList();
  }
  /** Filter lov list for proactive countributor */
  fetchFilterLovListForProactive(): void {
    this.nationalityList$ = this.lookupService.getNationalityList().pipe(
      filter(res => res !== null),
      map(res => new LovList(res.items.filter(item => item.value.english !== Nationalities.SAUDI_ARABIA)))
    );
    this.filterWorkTypeList();
    this.occupationList$ = this.lookupService.getOccupationList();
  }
  /** Method to get social insurance number details of the person if person already have a SIN */
  getContributorSin(
    personId: number,
    registrationNo: number,
    checkBeneficiary: boolean = false
  ): Observable<ContributorSinResponse> {
    if (personId && registrationNo) {
      return this.contributorService.setSin(personId, registrationNo, checkBeneficiary).pipe(
        tap(res => {
          if (res !== null && res?.socialInsuranceNo) {
            this.socialInsuranceNo = res.socialInsuranceNo;
            this.isBeneficiary = res.isBeneficiary;
            this.contributor.active = res.active;
          }
        }),
        catchError(err => {
          this.showError(err);
          return throwError(err);
        })
      );
    }
  }
  /** Method to filter work type list */
  filterWorkTypeList(): void {
    if (this.contributorType !== ContributorTypesEnum.SAUDI && this.contributorType) {
      this.workTypeList$ = this.lookupService.getWorkTypeList().pipe(
        filter(res => res && res !== null),
        map(
          list =>
            new LovList(
              list.items.filter(item => ContributorConstants.EXCLUDED_WORK_TYPE.indexOf(item.value.english) === -1)
            )
        )
      );
    } else this.workTypeList$ = this.lookupService.getWorkTypeList();
  }
  /** Method to filter occupatio list based on contributor type */
  filterOccupationList(): void {
    if (this.contributorType && this.contributorType !== ContributorTypesEnum.SAUDI) {
      const excludedOccupations: string[] =
        this.legalEntity === LegalEntitiesEnum.INDIVIDUAL ||
        this.legalEntity === LegalEntitiesEnum.GOVERNMENT ||
        this.legalEntity === LegalEntitiesEnum.SEMI_GOVERNMENT
          ? [...ContributorConstants.EXCLUDED_OCCUPATIONS, ContributorConstants.OCCUPATION_EXPLOITER]
          : [];
      this.occupationList$ = this.lookupService.getOccupationList().pipe(
        filter(res => res && res !== null),
        map(
          list => new OccupationList(list.items.filter(item => excludedOccupations.indexOf(item.value.english) === -1))
        )
      );
    } else {
      const excludedOccupations: string[] =
        this.legalEntity === LegalEntitiesEnum.INDIVIDUAL ||
        this.legalEntity === LegalEntitiesEnum.GOVERNMENT ||
        this.legalEntity === LegalEntitiesEnum.SEMI_GOVERNMENT
          ? [...ContributorConstants.EXCLUDED_OCCUPATIONS, ContributorConstants.OCCUPATION_EXPLOITER]
          : [];
      this.occupationList$ = this.lookupService.getOccupationList().pipe(
        filter(res => res && res !== null),
        map(
          list => new OccupationList(list.items.filter(item => excludedOccupations.indexOf(item.value.english) === -1))
        )
      );
    }
  }
  /** Method to filter leaving reason */
  filterLeavingReason(ppaEstablishment?: boolean): void {
    //To fetch leaving reason based on nationality of the person.
    const nationalityType: string = this.contributorType === ContributorTypesEnum.SAUDI ? '1' : '2';
    let reqList: string[] = !this.person?.deathDate?.gregorian ? ContributorConstants.DEAD_LEAVING_REASONS : [];
    reqList =
      this.engagement?.leavingReason?.english !== ContributorConstants.LEAVING_REASON_BACKDATED
        ? [...reqList, ContributorConstants.LEAVING_REASON_BACKDATED]
        : reqList;
    if (reqList) {
      if (ppaEstablishment) {
        this.leavingReasonList$ = this.lookupService.getReasonForLeavingListPpa();
        this.leavingReasonList$ = this.leavingReasonList$.pipe(
          filter(lovlist => lovlist && lovlist !== null),
          map(
            lovList =>
              new LovList(
                lovList.items.filter(lov => lov.value.english !== 'Secondment' && lov.value.english !== 'Study Leave')
              )
          )
        );
      } else {
        this.leavingReasonList$ = this.lookupService.getReasonForLeavingList(nationalityType);
      }
      this.leavingReasonList$ = this.leavingReasonList$.pipe(
        filter(res => res && res !== null),
        map(res => new LovList(res.items.filter(item => reqList.indexOf(item.value.english) === -1)))
      );
    } else this.leavingReasonList$ = this.lookupService.getReasonForLeavingList(nationalityType);
    //Government job joining must be available only in FO
    if (this.appToken === ApplicationTypeEnum.PUBLIC)
      this.leavingReasonList$ = this.leavingReasonList$.pipe(
        filter(lovlist => lovlist && lovlist !== null),
        map(list => new LovList(list.items.filter(lov => lov.value.english !== ContributorConstants.GOV_JOB_JOINING)))
      );
    if (this.engagement) this.checkForObsoleteReasons();
  }
  /** Method to check for obsolete reason and add it to leaving reason list. */
  checkForObsoleteReasons() {
    if (this.engagement?.leavingDate?.gregorian)
      this.leavingReasonList$ = this.leavingReasonList$.pipe(
        filter(lovlist => lovlist && lovlist !== null),
        map(lovList => {
          if (
            this.engagement?.leavingReason?.english &&
            !lovList.items.some(item => item.value.english === this.engagement.leavingReason.english)
          ) {
            const newLov = new Lov();
            newLov.items = undefined;
            newLov.value = this.engagement.leavingReason;
            lovList.items.push(newLov);
          }
          return lovList;
        })
      );
  }

  /** Method to fetch contract lookups. */
  fetchContractLookups() {
    this.religionList$ = this.lookupService.getReligionList();
    this.internationalCountryList$ = this.lookupService.getCountryList().pipe(
      filter(res => res && res !== null),
      map(
        list =>
          new LovList(
            list.items.filter(
              lov => ContractAuthConstant.INTERNATIONAL_COUNTRY_FILTER.indexOf(lov.value.english) === -1
            )
          )
      )
    );
  }
  /** Method to submit uploaded documents */
  submitDocuments(comments: string) {
    if (this.isValidatorEdit || this.isEditAdmin) {
      this.updateBpmTask.outcome = WorkFlowActions.SUBMIT;
      this.updateBpmTask.comments = comments;
    }
    concat(
      this.contributorService.submitUploadedDocuments(
        this.registrationNo,
        this.socialInsuranceNo,
        this.engagementId,
        this.isEditAdmin || this.isValidatorEdit ? SubmitActions.EDIT : SubmitActions.SUBMIT,
        !(this.isEditAdmin || this.isValidatorEdit) ? comments : '',
        this.engagement.skipContract
      ),
      this.isValidatorEdit
        ? this.engagementService.updatePenaltyIndicator(
            this.registrationNo,
            this.socialInsuranceNo,
            this.engagementId,
            this.engagement.penaltyIndicator ? 1 : 0
          )
        : of(null),
      this.isValidatorEdit || this.isEditAdmin ? this.workflowService.updateTaskWorkflow(this.updateBpmTask) : of(null)
    ).subscribe({
      next: (value: SubmitEngagementResponse) => {
        if (value?.message) this.feedbackMessageToDisplay = value.message;
      },
      error: err => this.showAlertDetails(err),
      complete: () => {
        this.backdatingIndicator ? this.getBackdatedEngagementPeriods() : this.getEngagement().subscribe();
        this.navigateToNextTab();
      }
    });
  }
  /** This method is to get all engagement period details */
  getBackdatedEngagementPeriods() {
    super
      .getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, EngagementSubType.BACKDATED)
      .subscribe(
        res => (this.engagement = res),
        err => this.showError(err)
      );
  }
  /** Method to get documents for contributor */
  getRequiredDocForContributor(isRefreshRequired = false, isIbanRequired = false) {
    const transactionTypes = [
      getTransactionType(this.legalEntity, this.person, this.contributorType, this.isGccEstablishment)
    ];
    if (isIbanRequired) transactionTypes.push(DocumentTransactionType.BANK_UPDATE);
    if (this.isEditAdmin || this.isValidatorEdit)
      this.getDocumentsInEdit(
        DocumentTransactionId.REGISTER_CONTRIBUTOR,
        transactionTypes,
        this.documentUploadEngagementId,
        this.referenceNo
      );
    else
      super.getRequiredDocuments(
        this.documentUploadEngagementId,
        DocumentTransactionId.REGISTER_CONTRIBUTOR,
        transactionTypes,
        isRefreshRequired,
        this.referenceNo
      );
  }
  /** Method to get documents in edit. */
  getDocumentsInEdit(docTransactionId: string, transactionTypes: string[], businessKey: number, referenceNo: number) {
    this.documentService.getDocuments(docTransactionId, transactionTypes, businessKey, referenceNo).subscribe(res => {
      res.forEach(doc => {
        if (doc.name.english === ContributorConstants.IBAN_DOCUMENT) doc.canDelete = false;
      });
      this.documents = res.filter(item =>
        item.name.english === ContributorConstants.IBAN_DOCUMENT && item.documentContent === null ? false : true
      );
    });
  }
  /** This method to get engagment  details. :: Establishment Admin Edit */
  getEngagement(coverageFlag: boolean = true) {
    return super
      .getEngagementDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        this.engagementId,
        this.isbackdated ? EngagementSubType.BACKDATED : null,
        coverageFlag
      )
      .pipe(
        tap((res: EngagementDetails) => {
          scrollToTop();
          this.engagement = res;
          this.engagement.isContributorActive = this.engagement.leavingDate?.gregorian ? false : true; //api removed this property so workaround
          this.backdatingIndicator = res.backdatingIndicator;
          this.joiningDate = res.joiningDate;
        }),
        catchError(err => {
          this.showError(err);
          return throwError(err);
        })
      );
  }
  /** This method is to submit employment details for adding engagement */
  saveEngagementDetails(engagementWageDetails, coverage?: BilingualText, skipContract?: boolean) {
    const isEditMode = this.isValidatorEdit || this.isEditAdmin;
    this.engagement = setWageDetails(engagementWageDetails, coverage);
    this.engagement.skipContract = skipContract;
    if (this.isContractRequired && !this.minContractStartDate) this.getMinContractStartDate();
    iif(
      () => !this.engagementId,
      this.engagementService.saveEngagementDetails(this.engagement, this.socialInsuranceNo, this.registrationNo),
      this.updateEngagementDetails()
    )
      .pipe(tap(res => (!isEditMode ? this.setDetailsFromResponse(res) : noop())))
      .subscribe({
        complete: () => {
          if (this.isDocumentsRequired && !this.isContractRequired) this.getRequiredDocForContributor(true);
          if (!isEditMode && !this.isContractRequired && !this.isDocumentsRequired) this.getEngagement().subscribe();
          else if (isEditMode) this.isSaved = true;
          this.navigateToNextTab();
          this.checkPersonalDetailsSaved = true;
        },
        error: err => this.showAlertDetails(err)
      });
  }
  /** Method to get minimum contract start date. */
  getMinContractStartDate() {
    this.calendarService
      .addToHijiriDate(this.contributor.person.birthDate.hijiri, 15)
      .subscribe(res => (this.minContractStartDate = res));
  }
  /** Method to set details  from response. */
  setDetailsFromResponse(response: SaveEngagementResponse) {
    const isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC;
    if (isAppPublic && response.backDatedEngagementId) {
      this.documentUploadEngagementId = response.backDatedEngagementId;
      this.referenceNo = response.backDatedTransactionReferenceNo;
    } else {
      this.documentUploadEngagementId = response.id;
      this.referenceNo = response.transactionReferenceNo;
    }
    this.engagementId = response.id;
    this.backdatingIndicator = response.backDatedEngagementId ? true : false;
    this.feedbackMessageToDisplay = response.message;
  }
  /** This method is to submit engagement details for updating existing engagement */
  updateEngagementDetails(): Observable<SaveEngagementResponse> {
    return this.engagementService.updateEngagementDetails(
      this.engagement,
      this.socialInsuranceNo,
      this.registrationNo,
      this.engagementId,
      this.isEditAdmin || this.isValidatorEdit,
      this.backdatingIndicator
    );
  }
  /** Method to update existing contributor */
  updateContributor(contributor: ContributorDetailsWrapper, navigationInd?: string) {
    return this.contributorService.updateContributor(
      contributor,
      this.registrationNo,
      this.socialInsuranceNo,
      contributor.person.personId,
      navigationInd
    );
  }
  /** Method to save contributor */
  saveContributor(contributor: ContributorDetailsWrapper, regNo: number): void {
    this.contributorService.saveContributorDetails(contributor, regNo).subscribe(
      res => {
        this.socialInsuranceNo = res.socialInsuranceNo;
        this.navigateToNextTab();
        this.personDetailsApi = false;
        this.engagementService.setIsPersonApiTriggered(this.personDetailsApi);
        if (this.draftAvailable && this.engagementId && this.isDraftNeeded) {
          this.engagementService
            .getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId)
            .pipe(tap(res => (this.engagement = res)));
        }
      },
      err => {
        this.personDetailsApi = false;
        this.engagementService.setIsPersonApiTriggered(this.personDetailsApi);
        this.showAlertDetails(err);
      }
    );
  }
  /** Method to alert details if present */
  showAlertDetails(err): void {
    this.isApiTriggered = false;
    if (err.error?.details?.length > 0) this.alertService.showError(null, err.error.details);
    else this.showError(err);
  }
  /** Method to navigate back. */
  navigateBack(): void {
    this.isApiTriggered = false;
    this.isValidatorEdit
      ? this.router.navigate([ContributorRouteConstants.ROUTE_VALIDATOR_CONTRIBUTOR])
      : this.router.navigateByUrl(RouterConstants.ROUTE_INBOX);
  }
  /** This method is to cancel the newly added contributor if the transaction is cancelled */
  cancelAddedContributor(docFlag = false, isDraftRequired?) {
    this.isDraftRequired = isDraftRequired;
    if (this.modalRef) this.hideModal();
    if (this.isValidatorEdit || this.isEditAdmin) {
      if (this.isSaved || docFlag)
        this.contributorService
          .revertTransaction(this.registrationNo, this.socialInsuranceNo, this.engagementId)
          .subscribe(
            () => this.navigateBack(),
            err => this.alertService.showError(err.error.message)
          );
      else this.location.back();
    } else {
      if (this.socialInsuranceNo !== null && this.socialInsuranceNo !== undefined)
        this.contributorService
          .cancelAddedContributor(
            this.socialInsuranceNo,
            this.registrationNo,
            this.engagementId,
            this.referenceNo,
            this.isDraftRequired
          )
          .subscribe(
            () => {
              if (!this.notLocationBack) this.resetToFirstForm();
              else this.notLocationBack = false;
            },
            err => this.alertService.showError(err.error.message, err.error.details)
          );
      else this.resetToFirstForm();
    }
  }
  /** This method is to reset form to first screen */
  resetToFirstForm() {
    if (this.isValidatorEdit) this.location.back();
    else if (this.isEditAdmin) this.router.navigate([RouterConstants.ROUTE_INBOX]);
    else if (this.isMytransDraft && this.appToken === ApplicationTypeEnum.PUBLIC)
      this.router.navigate([RouterConstants.ROUTE_TRANSACTION_HISTORY]);
    else if (this.isMytransDraft) this.router.navigate([RouterConstants.ROUTE_INBOX]);
    else this.router.navigate([ContributorRouteConstants.ROUTER_CONTRIBUTOR_SEARCH]);
  }
  /** Method to navigate to next tab on successful save */
  navigateToNextTab() {
    this.isApiTriggered = false;
    this.alertService.clearAlerts();
    this.activeTab++;
    this.progressWizardItems.setNextItem(this.activeTab);
    scrollToTop();
  }
  /** Method to navigate to the previous tab */
  navigateToPreviousTab() {
    this.isApiTriggered = false;
    this.alertService.clearAlerts();
    this.activeTab--;
    this.progressWizardItems.setPreviousItem(this.activeTab);
    scrollToTop();
  }
  /** Method to navigate by index. */
  navigateToTabByIndex(activeTab: number) {
    this.isApiTriggered = false;
    this.activeTab = activeTab;
    this.progressWizardItems.setActive(this.activeTab);
    scrollToTop();
  }
  /**Method to fetch bank details */
  getBank(iBanCode: string): void {
    this.alertService.clearAlerts();
    this.bankNameList$ = this.lookupService.getBankForIban(iBanCode).pipe(
      tap(res => {
        if (res.items.length === 0) this.alertService.showErrorByKey('CONTRIBUTOR.INVALID-IBAN-ERROR');
      })
    );
  }
}
