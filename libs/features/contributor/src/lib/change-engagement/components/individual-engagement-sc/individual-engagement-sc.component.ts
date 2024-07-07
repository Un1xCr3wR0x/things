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
  AuthTokenService,
  BilingualText,
  CalendarService,
  CoreIndividualProfileService,
  DocumentItem,
  DocumentService,
  LookupService,
  Lov,
  LovList,
  OccupationList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionService,
  WizardItem,
  WorkflowService,
  addDays,
  convertToHijriFormat,
  convertToYYYYMMDD,
  scrollToTop
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, iif, noop, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ContributorBaseScComponent } from '../../../shared/components';
import { ContributorConstants, ContributorRouteConstants, ManageWageConstants } from '../../../shared/constants';
import {
  ContributorTypesEnum,
  DocumentTransactionId,
  DocumentTransactionType,
  EngagementSubType,
  FormWizardTypes,
  PersonTypesEnum,
  SubmitActions,
  TransactionId
} from '../../../shared/enums';
import {
  ContributorBPMRequest,
  CoverageDetails,
  CoveragePeriodWrapper,
  EngagementDetails,
  HijiriConstant,
  ModifyCoverage,
  ModifyEngagementPeriod,
  PeriodChangeDetails,
  SystemParameter,
  TransactionResponse,
  UpdatedWageDetails
} from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared/services';

@Component({
  selector: 'cnt-indivdual-engagement-sc',
  templateUrl: './individual-engagement-sc.component.html',
  styleUrls: ['./individual-engagement-sc.component.scss']
})
export class IndividualEngagementScComponent extends ContributorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  wizardItems: WizardItem[] = [];
  currentTab = 0;
  isEngagementVerified = false;
  engagementForm: FormGroup = new FormGroup({});
  periodChanged = false;
  isScanEdit = false;
  updatedEngagement: EngagementDetails;
  transactionTypes: string[] = [];
  changeRequestTypes: string[] = [];
  periodLevelChanges: PeriodChangeDetails[];
  modalRef: BsModalRef;
  counter = 0;
  isPeriodEditInProgress = false;
  formSubmissionDate: Date;
  isAppPrivate: boolean;
  penaltyIndicator: number;
  userRoles: string[];
  isAppPublic: boolean;
  coverageDeatils: CoverageDetails;
  newCoverage: Lov[] = [];
  newCoverages: LovList;
  reasonForCoverageChange: Lov[] = [];
  coveragePeriod: CoveragePeriodWrapper;
  isModifyCoverage = false;
  modifyCoverageValue: ModifyCoverage;
  isPrevious = false;
  isWageDetailsUpdate = false;
  isCurrentMonth = false;
  nicDetails: any;
  errorAlert: boolean = false;
  errorAlivePerson: boolean = false;
  role: string;
  isAdminReEdit: boolean;
  backdatedEngValidatorRequired: boolean;
  isUnclaimed: boolean = false;
  payload;
  minDiff: any;
  secDiff: any;
  seconds: string;
  isGOL: boolean;
  taskId: string = undefined;

  /** Observables */
  leavingReasonList$: Observable<LovList>;
  occupationList$: Observable<OccupationList>;
  workTypeList$: Observable<LovList>;
  yesOrNoList$: Observable<LovList>;
  reasonForChange$: Observable<LovList>;

  /** Child components */
  @ViewChild('changeEngagementWizard', { static: false })
  changeEngagementWizard: ProgressWizardDcComponent;
  systemParameter: SystemParameter;
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  @ViewChild('draftTemplate', { static: true })
  draftTemplate: TemplateRef<HTMLElement>;

  hasWorkFlow: boolean = false;
  docTransactionId: number;
  isJoiningDateChanged: boolean;
  saveB: Boolean = false;
  dateValue: string;
  startDate: string = '';
  endDate: string = '';
  resume: boolean = false;
  draftAvailable: boolean;
  isDraftNeeded: boolean;
  isDraftRequired: boolean;
  transactionTraceId: number;
  notLocationback: boolean = false;
  hijiriDateConst: HijiriConstant;

  /** Method to instantiate the component. */
  constructor(
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly manageWageService: ManageWageService,
    readonly lookupService: LookupService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly coreService: CoreIndividualProfileService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly authTokenService: AuthTokenService,
    readonly location: Location,
    readonly calendarService: CalendarService,
    readonly transactionService: TransactionService
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
  /** Method to initialise the component. */
  ngOnInit(): void {
    this.getRoles();
    this.alertService.clearAlerts();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    if (this.routerDataToken.draftRequest) {
      this.resume = true;
    }
    this.route.queryParams.subscribe(params => {
      this.isModifyCoverage = params.isModifyCoverage;
    });
    this.getSystemParameters();
    this.checkEditMode();
    this.initializeWizard(this.isAppPrivate || this.isEditMode);
    this.setDataForView();
    this.initializeLookupValues();
    this.getDataForView();
    this.getSystemParameters();
    this.getCoverageValue();
    if (this.isModifyCoverage) {
      this.docTransactionId = TransactionId.MAINTAIN_COVERAGE;
    } else {
      this.docTransactionId = TransactionId.CHANGE_ENGAGEMENT;
    }
    if (this.draftNeeded == false && this.draftNeeded != undefined && this.draftNeeded != null && this.referenceNo) {
      this.cancelDraftTransaction(this.draftNeeded);
      this.notLocationback = true;
    }
    this.calculateTimeDiff();
  }

  // this method is used to set max min hijiri dates
  setHijiriDate() {
    this.hijiriDateConst = new HijiriConstant();
    const currentDate = new Date();
    this.hijiriDateConst.gosiMinHijiriDate = '01/10/1317';
    this.hijiriDateConst.gosiMaxHijiriDate = '13/04/1439';
    this.hijiriDateConst.gosiMaxHijiriDateInGregorian = '2017-12-31';
    this.hijiriDateConst.gosiMaxHijiriNextDateInGregorian = '2018-01-01';
    this.hijiriDateConst.gosiMaxHijiriNextYearInGregorian = '2018';

    this.hijiriDateConst.ppaMinHijiriDate = '01/10/1317';
    this.systemParameter.REG_CONT_MIN_START_DATE_G_PPA > currentDate
      ? (this.hijiriDateConst.ppaMaxHijirDate = convertToHijriFormat(this.sysDate?.hijiri))
      : (this.hijiriDateConst.ppaMaxHijirDate = this.systemParameter.REG_CONT_MAX_END_DATE_H_PPA);

    this.hijiriDateConst.ppaMinGregorianDate = this.systemParameter.REG_CONT_MIN_START_DATE_G_PPA;
    this.hijiriDateConst.ppaMaxHjiriDateInGregorian = this.systemParameter.REG_CONT_MIN_START_DATE_G_PPA;
    this.hijiriDateConst.ppaMaxHijiriNextDateInGregorian = addDays(
      this.systemParameter.REG_CONT_MIN_START_DATE_G_PPA,
      1
    );
  }

  /** Method to check whether it is edit mode. */
  checkEditMode() {
    this.route.url.subscribe(res => {
      if (res.length > 1) if (res[0].path === 'change' && res[1].path === 'edit') this.isEditMode = true;
    });
    if (this.routerDataToken.payload) {
      super.initializeFromToken();
      this.payload = JSON.parse(this.routerDataToken.payload); 
      this.taskId = this.routerDataToken.taskId
      this.isUnclaimed = this.payload?.isPool;
      this.isGOL = this.payload.channel === 'gosi-online' ? true : false;
      console.log("payload",this.payload,"taskid",this.taskId,"claim",this.isUnclaimed)
    }
  }
  /** Method to get user roles. */
  getRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    if (gosiscp) {
      if (this.isAppPublic) {
        const adminRole = gosiscp.filter(item => Number(item.establishment) === this.registrationNo)[0];
        this.userRoles = adminRole ? adminRole.role?.map(r => r.toString()) : [];
      } else this.userRoles = gosiscp?.[0].role?.map(r => r?.toString());
    }
  }
  /** Method to set keys to initialize the view. */
  setDataForView() {
    if (this.isEditMode) this.readKeysFromToken();
    else this.initializeFromWageService();
  }
  /** Method to read keys from token for retrieving data. */
  readKeysFromToken() {
    this.initializeFromToken();
    if (this.routerDataToken.tabIndicator === 2) {
      this.isScanEdit = true;
      this.transactionTypes = this.routerDataToken.documentFetchTypes;
    }
    if (this.routerDataToken.payload) {
      const payload = JSON.parse(this.routerDataToken.payload);
      this.role = payload.assignedRole;
      if (this.role === 'Admin') {
        this.isAdminReEdit = true;
      }
      this.backdatedEngValidatorRequired = payload.backdatedEngValidatorRequired;
    }
    if (this.isAppPrivate) this.penaltyIndicator = Number(this.contributorService.getPenaltyIndicator); // penalty only shown in validator edit only
  }
  getCoverageValue() {
    this.manageWageService
      .getContributoryCoverage(this.socialInsuranceNo, this.engagementId, this.registrationNo)
      .subscribe(res => {
        this.coveragePeriod = res;
      });
  }
  /** Method to initialize wizard. */
  initializeWizard(hasWorkFlow) {
    this.getWizardItems(hasWorkFlow);
    this.wizardItems[0].isDisabled = false;
    this.wizardItems[0].isActive = true;
  }
  /** Method to initialize lookup values. */
  initializeLookupValues() {
    this.occupationList$ = this.lookupService.getOccupationList();
    this.workTypeList$ = this.lookupService.getWorkTypeList();
    this.yesOrNoList$ = this.lookupService.getYesOrNoList();
  }
  /** Method to get wizard items */
  getWizardItems(hasWorkFlow) {
    const wizardItems: WizardItem[] = [];
    if (!hasWorkFlow) {
      wizardItems.push(new WizardItem(FormWizardTypes.ENGAGEMENT_DETAILS, 'user'));
      //console.log('1', hasWorkFlow);
    } else {
      wizardItems.push(new WizardItem(FormWizardTypes.ENGAGEMENT_DETAILS, 'user'));
      wizardItems.push(new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt'));
      //console.log('2', hasWorkFlow);
    }
    this.wizardItems = wizardItems;
  }
  /** Method to handle navigation through wizard. */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index + 1;
  }
  /** Method to get system parameter like maximum backdated joining date. */
  getSystemParameters() {
    this.contributorService.getSystemParams().subscribe(res => {
      this.systemParameter = new SystemParameter().fromJsonToObject(res);
      this.setHijiriDate();
    });
  }
  /** Method for filtering leaving reason */
  filterLeavingReason(flag: boolean) {
    const excludeList = flag ? ContributorConstants.DEAD_LEAVING_REASONS : ContributorConstants.GOV_JOB_JOINING;
    this.leavingReasonList$ = this.leavingReasonList$.pipe(
      filter(lovlist => lovlist && lovlist !== null),
      map(lovList => {
        return new LovList(lovList.items.filter(lov => excludeList.indexOf(lov?.value?.english) === -1));
      })
    );
  }

  includeDeadOrInjuryLeavingReasons() {
    const includeList = ContributorConstants.DEAD_INJURY_LEAVING_REASONS;
  this.leavingReasonList$ = this.leavingReasonList$.pipe(
    filter(lovlist => lovlist && lovlist !== null),
    map(lovList => {
      // Filter the lovlist to include only leaving reasons that are present in the includeList
      const filteredItems = lovList.items.filter(lov => includeList.includes(lov?.value?.english));
      return new LovList(filteredItems);
    })
  );
  }
  /** Method to retrieve necessary data for view. */
  getDataForView() {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
      this.currentTab = 1;
      this.getEstablishmentDetails(this.registrationNo)
        .pipe(
          tap(res => (this.establishment = res)),
          switchMap(() => {
            return this.getContributorDetails(this.registrationNo, this.socialInsuranceNo).pipe(
              tap(res => {
                this.contributor = res;
              })
            );
          }),
          switchMap(() => {
            return this.getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId).pipe(
              tap((res: EngagementDetails) => {
                this.engagement = res;
                this.formSubmissionDate = this.engagement.formSubmissionDate.gregorian;
              })
            );
          }),
          switchMap(() => {
            //To fetch leaving reason based on nationality of the person.
            const nationalityType: string = this.contributor.person.personType === PersonTypesEnum.SAUDI ? '1' : '2';
            this.leavingReasonList$ = this.isPpa
              ? this.lookupService.getReasonForLeavingListPpa()
              : this.lookupService.getReasonForLeavingList(nationalityType);
              if (
                this.contributor.contributorType &&
                this.contributor.contributorType !== ContributorTypesEnum.GCC &&
                this.contributor.contributorType !== ContributorTypesEnum.SAUDI &&
                this.contributor.contributorType !== ContributorTypesEnum.SPECIAL_RESIDENTS &&
                this.contributor.contributorType !== ContributorTypesEnum.PREMIUM_RESIDENTS &&
                this.contributor.contributorType.toUpperCase() !== ContributorTypesEnum.SPECIAL_FOREIGNER.toUpperCase()
              ){
                if (this.isAppPrivate && nationalityType === '2')
                  this.includeDeadOrInjuryLeavingReasons();
                  this.checkForObsoleteReasons();
              }

            if (this.engagement.leavingReason?.english !== ContributorConstants.GOV_JOB_JOINING && !this.isAppPrivate)
              this.filterLeavingReason(false);
            return this.leavingReasonList$;
          }),
          switchMap(() => iif(() => this.isEditMode || this.draftNeeded, this.getUpdatedEngagementDetails())),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
      if (this.isScanEdit) this.getRequiredDocuments(); //To handle document edit scenario.
    }
  }
  /* Fetch data from NIC call and compare leaving date and death date */
  checkIndividualDetails(nicCheck: boolean, queryParams: string, leavingDeathReason: boolean) {
    if (nicCheck) {
      this.contributorService.getPersonDetails(queryParams, new Map().set('fetchAddressFromWasel', true)).subscribe(
        res => {
          this.nicDetails = res.deathDate;
          if (res.deathDate == null) {
            this.alertService.showErrorByKey('CONTRIBUTOR.LEAVING-REASON-NOT-DEATH');
            this.errorAlivePerson = true;
          } else if (moment(this.engagement.leavingDate.gregorian).isAfter(res.deathDate.gregorian)) {
            this.alertService.showErrorByKey('CONTRIBUTOR.LEAVING-AFTER-DEATH');
          } else if (moment(this.engagement.leavingDate.gregorian).isBefore(res.deathDate.gregorian)) {
            this.alertService.showErrorByKey('CONTRIBUTOR.LEAVING-BEFORE-DEATH');
            this.errorAlert = true;
          }
        },
        err => {
          this.showError(err);
        }
      );
    } else {
      this.errorAlert = false;
      this.errorAlivePerson = false;
      this.alertService.clearAlerts();
    }
    if (leavingDeathReason) {
      this.filterLeavingReason(true);
    }
  }
  /** Method to check for obsolete reason and add it to leaving reason list. */
  checkForObsoleteReasons() {
    if (this.engagement.leavingDate && this.engagement.leavingDate.gregorian)
      this.leavingReasonList$ = this.leavingReasonList$.pipe(
        filter(lovlist => lovlist && lovlist !== null),
        map(lovList => {
          if (!lovList.items.some(item => item?.value?.english === this.engagement?.leavingReason?.english)) {
            const lov = new Lov();
            lov.items = undefined;
            lov.value = this.engagement.leavingReason;
            lovList.items.push(lov);
          }
          return lovList;
        })
      );
  }
  /** Verify whether wages are valid after wage change. */
  verifyEngagementWage(engagement: EngagementDetails) {
    this.alertService.clearAlerts();
    this.isEngagementVerified = false;
    this.manageWageService
      .verifyWageChange(this.registrationNo, this.socialInsuranceNo, this.engagementId, engagement)
      .subscribe(
        (res: boolean) => {
          this.counter++;
          this.isPeriodEditInProgress = false;
          this.isEngagementVerified = res;
        },
        err => {
          this.isEngagementVerified = false;
          this.showError(err);
        }
      );
    this.hasWorkFlow = true;
    //console.log('edited', this.hasWorkFlow);
    // console.log(engagement);
    // console.log(engagement.engagementDuration.noOfMonths);
    this.isWageDetailsUpdate = this.checkDetails(engagement);
    // console.log("checkDetails  ",this.isWageDetailsUpdate);
    if (this.isWageDetailsUpdate) {
      this.initializeWizard(false);
    } else {
      this.initializeWizard(this.hasWorkFlow || this.isEditMode);
    }
  }

  checkDetails(engagement: EngagementDetails): boolean {
    this.isCurrentMonth = this.checkCurrentMonth(engagement);
    // console.log("Active or inactive",this.contributor.statusType);
    // console.log("month checking",this.isCurrentMonth);
    // if(!this.hasWorkFlow){&& this.contributorType === "SAUDI"
    if (this.isCurrentMonth) {
      if (
        !engagement.updatedPeriod.isSplit &&
        engagement.updatedPeriod.wageDetailsUpdated &&
        this.contributor.statusType === 'ACTIVE' &&
        this.isCurrentMonth &&
        this.isAppPublic &&
        this.isJoiningDateChanged != true
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        !engagement.updatedPeriod.isSplit &&
        !engagement.updatedPeriod.wageDetailsUpdated &&
        this.contributor.statusType === 'ACTIVE' &&
        !this.isCurrentMonth &&
        this.isAppPublic &&
        this.isJoiningDateChanged != true
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  // check joining month is current month
  checkCurrentMonth(engagement: EngagementDetails) {
    // console.log("joining change ",this.isJoiningDateChanged);
    let jDate = moment(engagement.joiningDate.gregorian).toDate(); //joining date
    let tDate = new Date(); //today
    // console.log("joining date ",jDate.getMonth());
    // console.log("joining month",jDate.getFullYear());
    // console.log("today month ",tDate.getMonth());
    // console.log("today year",tDate.getFullYear());
    if (tDate.getFullYear() === jDate.getFullYear() && tDate.getMonth() === jDate.getMonth()) {
      return true;
    } else {
      return false;
    }
  }
  /** Method to modify engagement periods changes in wage. */
  modifyEngagementWage(engagement: EngagementDetails) {
    if (this.engagementForm.get('engagementDetails')?.valid) {
      this.updatedEngagement = engagement;
      // console.log(this.updatedEngagement,'updated');
      // console.log(engagement,'engagement');
      if (this.isEditMode) engagement.editFlow = true; //Set edit flag to true in case of edit mode.
      // show error if death reason is chosen as leaving reason when leaving date is before death date
      if (this.errorAlivePerson) {
        this.alertService.showErrorByKey('CONTRIBUTOR.LEAVING-REASON-NOT-DEATH');
        scrollToTop();
      } else if (this.errorAlert) {
        this.alertService.showErrorByKey('CONTRIBUTOR.LEAVING-BEFORE-DEATH');
        scrollToTop();
      } else {
        this.manageWageService
          .modifyEnagagementPeriodWage(this.registrationNo, this.socialInsuranceNo, this.engagementId, engagement)
          .subscribe(
            res => {
              this.periodChanged = true;
              if (res && res.docFetchTypes && res.referenceNo) {
                this.transactionTypes = this.establishment.gccEstablishment
                  ? [DocumentTransactionType.CHANGE_ENGAGEMENT_IN_GCC]
                  : res.docFetchTypes;
                this.referenceNo = res.referenceNo;
                // check document upload page required or not
                if (this.isWageDetailsUpdate) {
                  this.handleTransactionCompletion(res.message);
                } else {
                  this.getRequiredDocuments();
                }
              } else if (res && !res.docFetchTypes && !this.isAppPrivate) this.handleTransactionCompletion(res.message);
            },
            err => {
              if (err.error.code === ManageWageConstants.CHANGE_ENGAGEMENT_VALIDATOR_REVERT_ERROR_CODE) {
                this.alertService.showErrorByKey(
                  ManageWageConstants.CHANGE_ENGAGEMENT_VALIDATOR_REVERT_MESSAGE,
                  null,
                  null,
                  ManageWageConstants.CHANGE_ENGAGEMENT_VALIDATOR_REVERT_MESSAGE_DETAILS
                );
              } else this.showError(err);
            }
          );
        //this.saveB = true;
      }
    } else this.showMandatoryFieldsError();
  }
  /** Method to navigate to next section of the screen. */
  nextTab() {
    this.alertService.clearAlerts();
    this.changeEngagementWizard.setNextItem(this.currentTab);
    this.currentTab++;
    this.isEngagementVerified = false;
    scrollToTop();
  }
  /** Method to get required document list. */
  getRequiredDocuments() {
    this.documentService
      .getRequiredDocuments(
        !this.isModifyCoverage ? DocumentTransactionId.CHANGE_ENGAGEMENT : DocumentTransactionId.MAINTAIN_COVERAGE,
        this.transactionTypes
      )
      .subscribe(res => {
        if (this.isAppPrivate) {
          this.documents = this.documentService.removeDuplicateDocs(
            res.filter(docs => docs.documentClassification === 'Internal')
          );
        } else {
          this.documents = this.documentService.removeDuplicateDocs(res);
        }
        if (this.periodChanged || this.isEditMode) this.documents.forEach(doc => this.refreshDocument(doc));
        if (!this.isEditMode) this.resume = true;
        this.nextTab();
      });
  }
  /** Method to refresh documents after scan. */
  refreshDocument(doc: DocumentItem) {
    super.refreshDocument(
      doc,
      this.engagementId,
      !this.isModifyCoverage ? DocumentTransactionId.CHANGE_ENGAGEMENT : DocumentTransactionId.MAINTAIN_COVERAGE,
      null,
      this.referenceNo
    );
  }
  /** Method to navigate back based on mode. */
  navigateBack() {
    if (this.isEditMode && this.isAppPrivate)
      this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT_VALIDATOR]);
    else if (this.isEditMode && !this.isAppPrivate) this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
    else if (!this.isEditMode) this.location.back();
  }
  /** Method to navigate back to previous section. */
  navigateToPreviousSection() {
    this.isPrevious = true;
    this.alertService.clearAlerts();
    this.currentTab--;
    this.changeEngagementWizard.setNextItem(this.currentTab - 1);
    this.wizardItems[this.currentTab].isDisabled = false;
    scrollToTop();
  }

  /** Method to submit engagement after wage change. */
  submitChangedEngagement() {
    const flag = this.establishment.gccEstablishment
      ? this.checkOptionalDocuments(this.documents)
      : this.documentService.checkMandatoryDocuments(this.documents);
    if (flag) {
      const mode = this.isEditMode ? SubmitActions.EDIT : SubmitActions.SUBMIT;
      const comments = this.isEditMode ? null : this.engagementForm.get('comments.comments').value;
      if (!this.isModifyCoverage) {
        this.manageWageService
          .submitEngagementAfterChange(this.registrationNo, this.socialInsuranceNo, this.engagementId, mode, comments)
          .subscribe(
            (res: BilingualText) => {
              if (res) {
                if (this.isEditMode) this.saveWorkflowInEdit(res);
                else this.handleTransactionCompletion(res);
              }
            },
            err => this.showError(err)
          );
      } else {
        this.manageWageService
          .submitModifyCoverage(
            this.registrationNo,
            this.socialInsuranceNo,
            this.engagementId,
            this.referenceNo,
            comments,
            this.isEditMode
          )
          .subscribe(
            (res: TransactionResponse) => {
              if (res) {
                if (this.isEditMode) this.saveWorkflowInEdit(res.message);
                else this.handleTransactionCompletion(res.message);
              }
            },
            err => this.showError(err)
          );
      }
    } else
      this.establishment.gccEstablishment
        ? this.showMandatoryDocumentsError()
        : this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
  }
  /** Method to handle transaction completion. */
  handleTransactionCompletion(message: BilingualText) {
    this.alertService.showSuccess(message, null, 10);
    this.location.back();
    this.coreService.setSuccessMessage(message, true);
  }
  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit(message: BilingualText) {
    const workflowData: ContributorBPMRequest = this.assembleWorkflowPayload(
      this.routerDataToken,
      this.engagementForm.get('comments.comments').value
    );
    this.engagementService
      .updatePenaltyIndicator(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.penaltyIndicator)
      .pipe(switchMap(() => this.workflowService.updateTaskWorkflow(workflowData)))
      .subscribe(
        () => {
          this.alertService.showSuccess(message);
          const route = this.isAppPrivate ? RouterConstants.ROUTE_INBOX : RouterConstants.ROUTE_TODOLIST;
          this.router.navigate([route]);
        },
        err => this.showError(err)
      );
  }
  /** Method to get updated engagement details. */
  getUpdatedEngagementDetails() {
    return this.getEngagementDetails(
      this.registrationNo,
      this.socialInsuranceNo,
      this.engagementId,
      EngagementSubType.PENDING
    ).pipe(
      tap(res => (this.updatedEngagement = this.markSplittedPeriodsOnEdit(res))),
      switchMap(() => {
        if (!this.isModifyCoverage) return this.getEngagementChangesInWorkflow();
        else {
          return this.getCoverageChangesInWorkFlow();
        } //To get list of field changes
      })
    );
  }
  /** Method to get list of changed fields  while open in edit mode. */
  getEngagementChangesInWorkflow() {
    if (this.draftNeeded) {
      return this.manageWageService
        .getEngagementInWorkflow(
          this.registrationNo,
          this.socialInsuranceNo,
          this.engagementId,
          this.referenceNo,
          this.draftNeeded
        )
        .pipe(
          tap(res => {
            if (!this.isAppPrivate) this.penaltyIndicator = res.penaltyIndicator;
            this.changeRequestTypes = res.changeRequestTypes;
            this.formSubmissionDate = res.formSubmissionDate.gregorian;
            if (res.wagePeriods) this.identifyChangesInPeriods(res);
            else this.periodLevelChanges = [];
          })
        );
    } else {
      return this.manageWageService
        .getEngagementInWorkflow(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
        .pipe(
          tap(res => {
            if (!this.isAppPrivate) this.penaltyIndicator = res.penaltyIndicator;
            this.changeRequestTypes = res.changeRequestTypes;
            this.formSubmissionDate = res.formSubmissionDate.gregorian;
            if (res.wagePeriods) this.identifyChangesInPeriods(res);
            else this.periodLevelChanges = [];
          })
        );
    }
  }

  /**
   *
   * @param engagement
   */
  getCoverageChangesInWorkFlow() {
    return this.manageWageService
      .getModifyCoverageDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .pipe(
        tap(res => {
          this.changeRequestTypes = res.changeRequestTypes;
          this.formSubmissionDate = res.formSubmissionDate.gregorian;
          this.updatedCoverageValues(res);
        })
      );
  }
  updatedCoverageValues(res: UpdatedWageDetails) {
    // let modify :ModifyCoverage  = new ModifyCoverage() ;
    this.modifyCoverageValue = new ModifyCoverage();
    this.modifyCoverageValue.engagementPeriods = [];
    res.details.forEach(periods => {
      const updatedEngagementPeriod: ModifyEngagementPeriod = new ModifyEngagementPeriod();
      updatedEngagementPeriod.endDate = periods.endDate;
      updatedEngagementPeriod.engagementWageCoverageId = periods.id;
      updatedEngagementPeriod.modified = true;
      updatedEngagementPeriod.reasonForCoverageModification = periods.reasonForChange;
      updatedEngagementPeriod.startDate = periods.startDate;
      updatedEngagementPeriod.coverages = periods.modifiedCoverage;
      this.modifyCoverageValue.engagementPeriods.push(updatedEngagementPeriod);
    });
    this.modifyCoverageValue.editFlow = true;
    this.isPrevious = true;
  }
  /* Method to mark the splitted periods on validator edit. */
  markSplittedPeriodsOnEdit(engagement: EngagementDetails) {
    engagement.engagementPeriod.forEach((period, i, array) => {
      if (array[i + 1] && period.id === array[i + 1].id) {
        period.isSplit = true;
        period.wageDetailsUpdated = true;
      }
    });
    return engagement;
  }
  /** Method to identify the changes in period on validator edit. */
  identifyChangesInPeriods(updatedDetails: UpdatedWageDetails) {
    const changeList: PeriodChangeDetails[] = [];
    updatedDetails.wagePeriods.forEach(period => {
      const oldPeriod = period.current;
      period.updated.forEach(newPeriod => {
        const changesInPeriod: PeriodChangeDetails = new PeriodChangeDetails();
        changesInPeriod.periodId = oldPeriod.id;
        changesInPeriod.startDate = newPeriod.startDate.gregorian;
        changesInPeriod.endDate = newPeriod.endDate ? newPeriod.endDate.gregorian : new Date();
        changesInPeriod.isOccupationChanged = false;
        changesInPeriod.isRankGradeClassChanged = false;
        changesInPeriod.isWageChanged = false;
        if (oldPeriod.contributorAbroad !== newPeriod.contributorAbroad)
          changesInPeriod.isContributorAbroadChanged = true;
        if (
          oldPeriod.occupation &&
          newPeriod.occupation &&
          oldPeriod.occupation.english !== newPeriod.occupation.english
        ) {
          changesInPeriod.isOccupationChanged = true;
        }
        if (this.isPpa) {
          if (
            oldPeriod?.jobRankCode !== newPeriod?.jobRankCode ||
            oldPeriod?.jobClassCode !== newPeriod?.jobClassCode ||
            oldPeriod?.jobGradeCode !== newPeriod?.jobGradeCode
          ) {
            changesInPeriod.isRankGradeClassChanged = true;
          }
        }
        if (
          (oldPeriod.wage.basicWage &&
            newPeriod.wage.basicWage &&
            oldPeriod.wage.basicWage !== newPeriod.wage.basicWage) ||
          (oldPeriod.wage.commission &&
            newPeriod.wage.commission &&
            oldPeriod.wage.commission !== newPeriod.wage.commission) ||
          (oldPeriod.wage.housingBenefit &&
            newPeriod.wage.housingBenefit &&
            oldPeriod.wage.housingBenefit !== newPeriod.wage.housingBenefit) ||
          (oldPeriod.wage.otherAllowance &&
            newPeriod.wage.otherAllowance &&
            oldPeriod.wage.otherAllowance !== newPeriod.wage.otherAllowance) ||
          (this.isPpa && changesInPeriod?.isRankGradeClassChanged)
        ) {
          changesInPeriod.isWageChanged = true;
        }
        changeList.push(changesInPeriod);
      });
    });
    this.periodLevelChanges = changeList;
  }
  /** Method to show a confirmation popup for reseting the form. */
  showModal(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: 'modal-dialog-centered' };
    this.modalRef = this.modalService.show(template, config);
  }
  /** Method to handle cancellation of transaction. */
  cancelTransaction() {
    const formStatus = this.engagementForm.get('engagementDetails')
      ? this.engagementForm.get('engagementDetails').dirty
      : false;
    const formValue = this.engagementForm.get('modifiedCoverage')
      ? this.engagementForm.get('modifiedCoverage').dirty
      : false;
    const docStatus = this.checkDocumentStatus();
    if (formStatus || this.isPeriodEditInProgress || this.counter > 0 || this.periodChanged || docStatus || formValue)
      if (this.resume || this.draftNeeded) this.showModal(this.draftTemplate);
      else this.showModal(this.confirmTemplate);
    else {
      if (this.draftNeeded) this.showModal(this.draftTemplate);
      else this.navigateBack();
    }
  }
  /** Method to gt document status. */
  checkDocumentStatus(): boolean {
    return this.engagementForm.get('docStatus.changed') ? this.engagementForm.get('docStatus.changed').value : false;
  }
  /** Method to confirm cancellation. */
  confirm() {
    this.modalRef.hide();
    if (this.isEditMode && (this.periodChanged || this.checkDocumentStatus())) this.cancelValidatorEditTransaction();
    else if (!this.isEditMode && this.periodChanged) {
      super.deleteDocumentsOnCancel(this.referenceNo);
      this.navigateBack();
    } else this.navigateBack();
  }
  /** Method to decline cancellation. */
  decline() {
    this.modalRef.hide();
  }
  /** Method to change period editing flag. */
  togglePeriodEditFlag(flag: boolean) {
    this.isPeriodEditInProgress = flag;
  }
  joiningDateChangeCheck(flag: boolean) {
    this.isJoiningDateChanged = flag;
  }
  /**  This method is to cancel validator edit transaction */
  cancelValidatorEditTransaction() {
    this.contributorService
      .revertTransaction(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .subscribe(
        res => {
          if (res) this.navigateBack();
        },
        err => this.showError(err)
      );
  }
  /**Method to clear alerts  */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }

  modifyDateCoverage(res) {
    this.startDate = '';
    this.endDate = '';
    if (res.startdate) this.startDate = convertToYYYYMMDD(moment(res?.startdate?.gregorian).toString());
    if (res.enddate) this.endDate = convertToYYYYMMDD(moment(res?.enddate?.gregorian).toString());
    if (this.isEditMode && this.isModifyCoverage && this.startDate !== '') this.modifyCoverage(true);
  }

  modifyCoverage(response) {
    if (this.newCoverage) this.newCoverage = [];
    if (response && this.startDate !== '') {
      this.contributorService
        .getModifyCoverage(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.startDate, this.endDate)
        .subscribe(
          res => {
            this.coverageDeatils = res;
            res.coverages.forEach(resp => {
              this.newCoverage.push({
                value: {
                  english: resp.english,
                  arabic: resp.arabic
                },
                sequence: 1
              });
            });
            this.newCoverages = new LovList(this.newCoverage);
            this.reasonForChange$ = this.lookupService.getModifyCoverageReason();
          },
          err => this.showError(err)
        );
    }
  }
  modifyCoverageChange(res) {
    this.alertService.clearAlerts();
    this.isEngagementVerified = false;
    this.modifyCoverageValue = res;
    if (res === undefined || this.modifyCoverageValue?.engagementPeriods?.length === 0) {
      this.alertService.showErrorByKey('CONTRIBUTOR.WAGE.WAGE-NO-CHANGE');
    } else if (this.engagementForm?.get('modifiedCoverage')?.valid) {
      if (this.isEditMode) res.editFlow = true; //Set edit flag to true in case of edit mode.
      this.contributorService
        .updateModifyCoverage(this.registrationNo, this.socialInsuranceNo, this.engagementId, res)
        .subscribe(
          resp => {
            this.periodChanged = true;
            if (resp && resp.referenceNo) {
              this.transactionTypes = this.establishment.gccEstablishment
                ? [DocumentTransactionType.CHANGE_ENGAGEMENT_IN_GCC]
                : [DocumentTransactionType.MODIFY_COVERAGE];
              this.referenceNo = resp.referenceNo;
              this.getRequiredDocuments();
            } else if (resp && !this.isAppPrivate) this.handleTransactionCompletion(resp.message);
          },
          err => {
            if (err.error.code === ManageWageConstants.CHANGE_ENGAGEMENT_VALIDATOR_REVERT_ERROR_CODE) {
              this.alertService.showErrorByKey(
                ManageWageConstants.CHANGE_ENGAGEMENT_VALIDATOR_REVERT_MESSAGE,
                null,
                null,
                ManageWageConstants.CHANGE_ENGAGEMENT_VALIDATOR_REVERT_MESSAGE_DETAILS
              );
            } else this.showError(err);
          }
        );
    } else this.showMandatoryFieldsError();
  }
  coverageValidity() {
    if (!this.engagementForm.get('modifiedCoverage').valid) this.showMandatoryFieldsError();
  }

  onKeepDraft() {
    this.isDraftRequired = true;
    this.notLocationback = false;
    this.cancelDraftTransaction(this.isDraftRequired);
    this.hideModal();
  }
  onDiscard() {
    this.isDraftRequired = false;
    this.notLocationback = false;
    this.cancelDraftTransaction(this.isDraftRequired);
    this.hideModal();
  }

  showDraft() {
    this.isDraftNeeded = true;
    this.hideModal();
  }

  clearDraft() {
    this.isDraftNeeded = false;
    this.hideModal();
  }

  /**  This method is to cancel validator edit transaction */
  cancelDraftTransaction(isDraftRequired: boolean) {
    this.contributorService
      .revertTransaction(
        this.registrationNo,
        this.socialInsuranceNo,
        this.engagementId,
        this.referenceNo,
        isDraftRequired
      )
      .subscribe(
        res => {
          if (res && !this.notLocationback) this.navigateBack();
        },
        err => this.showError(err)
      );
  }

  claimTask() {
    this.calculateTimeDiff();
    this.transactionService.accquireTasks(this.taskId).subscribe(
      (res: any) => {
        const value = {
          english:
            'Transaction has been assigned . You can now process the transaction or release it back to Establishment inbox ',
          arabic: 'تم إسناد المعاملة، بإمكانك البدء بمعالجة المعاملة او ارجعاها إلى صندوق بريد المنشاة '
        };
        this.alertService.showSuccess(value);
        this.isUnclaimed = false;
      },
      err => {
        console.log(err.error.status, err.headers.status);
        const value = {
          english: 'This Transaction can’t be assigned. Another admin have already assigned it to him ',
          arabic: 'لا يمكن اسناد المعاملة. لقد تم اسناد المعاملة من قبل مشرف آخر'
        };
        this.router.navigate(['home/transactions/list/todolist']);
        this.alertService.showError(value);
        setTimeout(() => {
          this.alertService.showError(value);
        }, 500);
      }
    );
    //  this.onClaimClicked.emit();
    console.log("payload",this.payload.currentDate,"2",this.payload.claimTaskExpiry)
  }

  calculateTimeDiff() {
    var currentDate: any = this.payload.currentDate;
    var convertedDate: any = moment.tz(currentDate, 'Asia/Riyadh');
    var expDate: any = this.payload.claimTaskExpiry;
    // console.log(currentDate,convertedDate.format())
    var updated = moment(convertedDate.format(), 'DD-MM-YYYY HH:mm:ss'); //now
    var expiry = moment(expDate, 'DD-MM-YYYY HH:mm:ss');
    if (expDate == 'NULL') {
      this.minDiff = '89';
      this.seconds = '0';
    } else {
      this.minDiff = Math.floor(expiry.diff(updated, 'seconds') / 60);
      this.secDiff = expiry.diff(updated, 'seconds');
      this.seconds = (this.secDiff % 60).toString();
    }
  }

  release() {
    this.minDiff = '89';
    this.seconds = '0';
    this.payload.claimTaskExpiry = 'NULL';
    this.transactionService.releaseTasks(this.taskId).subscribe((res: any) => {
      const value = {
        english: 'Transaction released to Establishment Inbox',
        arabic: 'تم إعادة تعيين المعاملة إلى صندوق المنشأة'
      };
      this.alertService.showSuccess(value);
      this.isUnclaimed = true;
      setTimeout(() => {
        this.router.navigate(['home/transactions/list/todolist']);
      }, 2000);
    });
  }


}
