/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, ComponentFactoryResolver, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BankAccount,
  CalendarService,
  CalendarTypeEnum,
  DocumentItem,
  DocumentService,
  EstablishmentStatusEnum,
  GosiCalendar,
  LookupService,
  Lov,
  LovList,
  Person,
  RouterData,
  RouterDataToken,
  TransactionService,
  WizardItem,
  WorkflowService,
  addDays,
  convertToHijriFormat,
  convertToHijriFormatAPI,
  downloadFile,
  monthDiff,
  monthDiffHijiri,
  startOfMonth
} from '@gosi-ui/core';
import { ComponentHostDirective } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { concat, forkJoin, noop } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AddContributorBaseSc } from '../../../shared/components/base/add-contributor-base-sc';
import { ContributorConstants } from '../../../shared/constants';
import { ContractStatus, ContributorTypesEnum, DocumentTransactionId, SubmitActions } from '../../../shared/enums';
import { NationalityCategoryEnum } from '../../../shared/enums/nationality-category-enum';
import {
  ClausesWrapper,
  ContractDetails,
  ContractParams,
  ContractRequest,
  Contributor,
  ContributorDetailsWrapper,
  EngagementDetails,
  HijiriConstant,
  ManageWageLookUp,
  PersonalInformation,
  SystemParameter
} from '../../../shared/models';
import { classDetails } from '../../../shared/models/jobClassDetails';
import { gradeDetails } from '../../../shared/models/jobGradeDetails';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared/services';
import { setWageDetails } from '../../../shared/utils';
import * as WizardUtil from '../../../shared/utils/wizard-util';
import { ContributorConfirmationDcComponent } from '../contributor-confirmation-dc/contributor-confirmation-dc.component';
import * as ContributorHelper from './add-contributor-helper';
import moment from 'moment';
import { DataSharingService } from '../../../shared/services/data-sharing.service';

@Component({
  selector: 'cnt-add-contributor-sc',
  templateUrl: './add-contributor-sc.component.html',
  styleUrls: ['./add-contributor-sc.component.scss']
})
export class AddContributorScComponent extends AddContributorBaseSc implements OnInit, OnDestroy {
  /**Variable declaration and initialization */
  contributorDetailsWrapper: ContributorDetailsWrapper;
  formWizardItems: WizardItem[] = [];
  tempEngagementDetails; // temporary storage for pop confirmation
  savetempEngagementDetails; //for handling hijiri-> payload
  parentForm = new FormGroup({});
  isComments = false;
  isPrivate: boolean;
  createEngagementView = false;
  conTypeSaudi = ContributorTypesEnum.SAUDI;
  coverageTypesLov: LovList;
  coverageTypeForm = ContributorHelper.getCoverageTypeForm();
  contractClauses: ClausesWrapper;
  contractId: number;
  contractDetails: ContractDetails;
  bankDetails: BankAccount;
  isBankDetailsPending: boolean;
  approvedBank: BankAccount;
  monthDifference: number;
  isbackdated = false;
  isApiTriggered = false;
  checkLegal = false;
  personTemp: PersonalInformation;
  backdatedEngValidatorRequired: boolean;
  isNonSaudi = false;
  hijiriDateConst: HijiriConstant;
  //for ppa
  jobClassDetails: classDetails[];
  jobClassLov: Lov[] = [];
  jobRankLov: Lov[] = [];
  jobGradeLov: Lov[] = [];
  civilianJobScale: number;
  jobClassCivilType: number;
  jobRankList: number;
  jobGradeApiResponse: gradeDetails[];
  jobRankListLov = new Lov();
  jobClassCivilTypeLov = new Lov();
  sysDate: GosiCalendar;
  lovDataList: ManageWageLookUp[] = new Array<ManageWageLookUp>();

  taskId: string = undefined;
  seconds: string;
  isGOL: boolean;
  adminPool: boolean;
  isUnclaimed: boolean = false;
  payload;
  minDiff: any;
  secDiff: any;

  /**Template and directive references */
  @ViewChild(ComponentHostDirective, { static: true })
  gosiComponentHost: ComponentHostDirective;
  @ViewChild('confirmSubmitTemplate', { static: false })
  confirmSubmitTemplate: TemplateRef<HTMLElement>;
  @ViewChild('selectCoverageTemplate', { static: false })
  selectCoverageTemplate: TemplateRef<HTMLElement>;
  @ViewChild('draftTemplate', { static: true })
  draftTemplate: TemplateRef<HTMLElement>;
  @ViewChild('draftRequiredTemplate', { static: true })
  draftRequiredTemplate: TemplateRef<HTMLElement>;
  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;
  disableTerminate: boolean = false;

  constructor(
    readonly alertService: AlertService,
    readonly componentFactoryResolver: ComponentFactoryResolver,
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly lookupService: LookupService,
    readonly activatedRoute: ActivatedRoute,
    readonly engagementService: EngagementService,
    readonly location: Location,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly calendarService: CalendarService,
    readonly manageWageService: ManageWageService,
    readonly contractService: ContractAuthenticationService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router,
    readonly transactionService: TransactionService,
    private dataSharingService: DataSharingService
  ) {
    super(
      alertService,
      lookupService,
      contributorService,
      establishmentService,
      engagementService,
      documentService,
      location,
      router,
      manageWageService,
      workflowService,
      calendarService,
      appToken,
      routerDataToken
    );
  }
  /** Method to handle all initialization tasks */
  ngOnInit(): void {
    // system parameter dates needs to be fetch before forms initization
    this.getSystemParameters();
  }

  /** Method to get system parameters. */
  getSystemParameters() {
    this.contributorService.getSystemParams().subscribe(res => {
      this.systemParams = new SystemParameter().fromJsonToObject(res);
      this.getSysDate();
    });
  }
  getSysDate() {
    this.calendarService.getSystemRunDate().subscribe(res => {
      this.sysDate = res;
      this.initizaation();
    });
  }

  initizaation() {
    this.hijiriDateConst = new HijiriConstant();
    this.alertService.clearAlerts();
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.setHijiriDate();
    if (this.routerDataToken.draftRequest) {
      this.draftAvailable = true;
      this.isDraftNeeded = true;
      this.isMytransDraft = true;
      this.registrationNo = this.routerDataToken.idParams.get('registrationNo');
      this.socialInsuranceNo = this.routerDataToken.idParams.get('socialInsuranceNo');
      this.engagementId = this.routerDataToken.idParams.get('engagementId');
      this.referenceNo = this.routerDataToken.idParams.get('referenceNo');
    }
    super.setLovLists();
    this.setRouteDetails();
    this.checkLegalEntity();
    this.getEstablishmentStatus();
    this.calculateTimeDiff();
  }

  // on edit period
  jobClassSelectedData(event) {
    this.jobRankLov = this.lovDataList[event.index]?.jobRankLov;
    this.jobGradeLov = this.lovDataList[event.index]?.jobGradeLov;
    this.jobGradeApiResponse = this.lovDataList[event.index]?.jobGradeApiResponse;
    // console.log(this.lovDataList);

    // let selectedJobCLassLov: Lov = new Lov();
    // selectedJobCLassLov = this.jobClassLov.find(jobClass => jobClass.code === event.data.jobClassCode);
    // if (selectedJobCLassLov && selectedJobCLassLov?.code) {
    //   this.jobClassValueChangeForPPA(selectedJobCLassLov, event.data.jobRankCode);
    // }
  }

  //Job Rank List For PPA
  jobClassValueChangeForPPA(data: Lov, selectedRankCode?: number, index?: number) {
    this.jobClassCivilTypeLov = data;
    let selectedJobRankLov: Lov = new Lov();
    this.contributorService
      .getRank(
        this.civilianJobScale,
        this.jobClassCivilTypeLov ? (this.jobClassCivilTypeLov.code ? this.jobClassCivilTypeLov.code : 0) : 0
      )
      .subscribe(res => {
        this.jobRankLov = [];
        res.forEach((eachRankType, index) => {
          const lov = new Lov();
          lov.code = eachRankType.jobRankCode;
          lov.value = eachRankType.jobRankName;
          lov.sequence = index;
          this.jobRankLov.push(lov);
          if (selectedRankCode == eachRankType.jobRankCode) {
            selectedJobRankLov = lov;
          }
        });
        if (selectedJobRankLov?.code || selectedJobRankLov?.code === 0) {
          this.jobRankListChangeForPPA(selectedJobRankLov, index);
        }
        if (index >= 0) this.lovDataList[index].jobRankLov = this.jobRankLov;
      });
  }
  //Job Grade List For PPA
  jobRankListChangeForPPA(data: Lov, index?: number) {
    this.jobRankListLov = data;
    this.contributorService
      .getGrade(
        this.civilianJobScale,
        this.jobClassCivilTypeLov ? (this.jobClassCivilTypeLov.code ? this.jobClassCivilTypeLov.code : 0) : 0,
        this.jobRankListLov ? (this.jobRankListLov.code ? this.jobRankListLov.code : 0) : 0
      )
      .subscribe(res => {
        this.jobGradeLov = [];
        this.jobGradeApiResponse = res;
        res.forEach((eachGradeType, index) => {
          const lov = new Lov();
          lov.value = eachGradeType.jobGradeName;
          lov.sequence = index;
          lov.code = parseInt(eachGradeType.jobGradeCode);
          this.jobGradeLov.push(lov);
        });
        if (index >= 0) this.lovDataList[index].jobGradeLov = this.jobGradeLov;
        if (index >= 0) this.lovDataList[index].jobGradeApiResponse = this.jobGradeApiResponse;
      });
  }
  // this method is used to set max min hijiri dates
  setHijiriDate() {
    const currentDate = new Date();

    this.hijiriDateConst.gosiMinHijiriDate = '01/10/1317';
    this.hijiriDateConst.gosiMaxHijiriDate = '13/04/1439';
    this.hijiriDateConst.gosiMaxHijiriDateInGregorian = '2017-12-31';
    this.hijiriDateConst.gosiMaxHijiriNextDateInGregorian = '2018-01-01';
    this.hijiriDateConst.gosiMaxHijiriNextYearInGregorian = '2018';

    this.hijiriDateConst.ppaMinHijiriDate = '01/10/1317';

    this.systemParams?.REG_CONT_MIN_START_DATE_G_PPA > currentDate
      ? (this.hijiriDateConst.ppaMaxHijirDate = convertToHijriFormat(this.sysDate?.hijiri))
      : (this.hijiriDateConst.ppaMaxHijirDate = this.systemParams?.REG_CONT_MAX_END_DATE_H_PPA);

    this.hijiriDateConst.ppaMinGregorianDate = this.systemParams?.REG_CONT_MIN_START_DATE_G_PPA;
    this.hijiriDateConst.ppaMaxHjiriDateInGregorian = this.systemParams?.REG_CONT_MIN_START_DATE_G_PPA;
    this.hijiriDateConst.ppaMaxHijiriNextDateInGregorian = addDays(this.systemParams?.REG_CONT_MIN_START_DATE_G_PPA, 1);
  }
  checkLegalEntity() {
    if (
      this.establishmentService.getLegalEntity.english === 'Government' ||
      this.establishmentService.getLegalEntity.english === 'Semi Government'
    ) {
      this.checkLegal = false;
    } else {
      this.checkLegal = true;
    }
  }

  //check establishment status for reopened
  getEstablishmentStatus() {
    if (this.establishmentService.getEstablishmentStatus.english === EstablishmentStatusEnum.REOPEN) {
      this.disableTerminate = true;
    }
  }

  /** Handle initialisaton tasks */
  handleInitialisation(): void {
    this.contributorType = this.contributorService.getContributorType;
    this.contributor = new Contributor();
    this.person = this.contributor.person = this.contributorService.getPerson;
    this.ppaEstablishment = this.establishmentService.getPpaEstablishment;
    this.establishment = this.establishmentService.getEstablishment;
    if (this.person.personId === undefined) {
      this.isNonSaudi = true;
    }
    this.registrationNo = this.establishmentService.getRegistrationNo;
    this.legalEntity = this.establishmentService.getLegalEntity
      ? this.establishmentService.getLegalEntity.english
      : null;
    this.getJobDataForPPA();
    if (this.person?.personId && this.registrationNo)
      super.getContributorSin(this.person.personId, this.establishment.registrationNo, true).subscribe(res => {
        if (res?.person) {
          this.personTemp = res.person;
        }
        this.engagementId = res?.engagementDraftDetailsdto?.engagementId;
        this.draftAvailable = res?.engagementDraftDetailsdto?.draftAvailable;
        this.transactionTraceId = res?.engagementDraftDetailsdto?.transactionTraceId;
        if (
          this.draftAvailable &&
          this.transactionTraceId &&
          this.contributorType.toUpperCase() == res?.engagementDraftDetailsdto?.contributorType.toUpperCase()
        )
          this.showTemplate(this.draftRequiredTemplate);
        else this.loadPersonDetailsComponent(this.contributorType);
      });

    this.isGccEstablishment = this.establishment?.gccCountry ? true : false;
    super.fetchFilteredLovList(this.ppaEstablishment);
    this.formWizardItems = WizardUtil.createAddContributorWizard(this.isPrivate, this.contributorType);
  }
  /** Method to set different flag based on the route params. */
  setRouteDetails() {
    if (this.router.url.indexOf('/edit') >= 0) {
      if (this.routerDataToken.payload) {
        super.initializeFromToken();
        this.documentUploadEngagementId = this.engagementId;
        const payload = JSON.parse(this.routerDataToken.payload);
        this.backdatedEngValidatorRequired = payload?.backdatedEngValidatorRequired;
      }
      this.payload = JSON.parse(this.routerDataToken.payload); 
      this.taskId = this.routerDataToken.taskId
      this.isUnclaimed = this.payload?.isPool;
      this.adminPool = this.payload?.assignedRole === 'ADMINPOOL' ? true : false;
      this.isGOL = this.payload.channel === 'gosi-online' ? true : false;
      this.updateBpmTask.taskId = this.routerDataToken.taskId;
      this.ppaEstablishment = this.establishmentService.getPpaEstablishment;
      this.getDataForView();
      this.isComments = true;
      this.updateBpmTask.user = this.routerDataToken.assigneeId;
      if (this.routerDataToken.tabIndicator !== null && this.routerDataToken.tabIndicator !== undefined) {
        this.activeTab = this.routerDataToken.tabIndicator;
        this.isValidatorEdit = true;
        this.penaltyIndicator = Number(this.contributorService.getPenaltyIndicator) === 1 ? true : false; // penalty only shown in validator edit only
      } else {
        this.isEditAdmin = true;
        this.activeTab = 0;
      }
    } else if (this.routerDataToken.draftRequest) {
      this.getDataForView();
    } else {
      this.handleInitialisation();
      this.checkDocumentsRequired();
      WizardUtil.initializeWizard(this.formWizardItems, this.activeTab);
      if (!this.person?.personId || !this.registrationNo) this.loadPersonDetailsComponent(this.contributorType);
      this.createEngagementView = true;
      if (this.isContractRequired) super.fetchContractLookups();
    }
    if(!this.isEditAdmin) this.dataSharingService.setIsUnclaimed(true); 
  }
  /** Method to retrieve data for view. */
  getDataForView() {
    this.ppaEstablishment = this.establishmentService.getPpaEstablishment;
    return forkJoin([
      super.getEstablishmentDetails(this.registrationNo),
      super.getContributorDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        new Map().set('checkBeneficiaryStatus', true)
      ),
      super.getEngagement(false)
    ])
      .pipe(
        tap(([est, cont]) => {
          this.isGccEstablishment = est?.gccCountry ? true : false;
          this.ppaEstablishment = this.establishmentService.getPpaEstablishment;
          this.getJobDataForPPA();
          if (
            this.person.personType == NationalityCategoryEnum.SAUDI_PERSON &&
            this.contributorType == ContributorTypesEnum.VIC
          )
            this.contributorType = ContributorTypesEnum.SAUDI;
          this.formWizardItems = WizardUtil.createAddContributorWizard(this.isPrivate, this.contributorType);
          this.checkDocumentsRequired({
            joiningDate: this.joiningDate.gregorian,
            isConActive: this.engagement.isContributorActive,
            isContRequired: this.engagement.skipContract,
            joiningDateHijiri: this.joiningDate.entryFormat === CalendarTypeEnum.HIJRI ? this.joiningDate?.hijiri : null
          });
          if (this.activeTab === 2 || (this.activeTab === 4 && this.engagement.skipContract))
            this.initializeDocumentEdit();
          WizardUtil.initializeWizard(this.formWizardItems, this.activeTab);
          this.loadPersonDetailsComponent(this.contributorType);
          this.isBeneficiary = cont.isBeneficiary;
          this.createEngagementView = true;
          super.fetchFilteredLovList(this.ppaEstablishment);
          if (this.isContractRequired) super.fetchContractLookups();
        })
      )
      .subscribe(noop, noop, noop);
  }
  getAllPeriodsJobData(engagement: EngagementDetails) {
    this.lovDataList = [];
    engagement?.engagementPeriod?.forEach((period, index) => {
      const lovData = new ManageWageLookUp();
      lovData.civilianJobScale = this.civilianJobScale;
      lovData.jobClassLov = this.jobClassLov;
      lovData.startDate = period.startDate;
      this.lovDataList.push(lovData);
      let selectedJobCLassLov: Lov = new Lov();
      selectedJobCLassLov = this.jobClassLov.find(jobClass => jobClass.code === period.jobClassCode);
      if (selectedJobCLassLov && selectedJobCLassLov?.code) {
        this.jobClassValueChangeForPPA(selectedJobCLassLov, period.jobRankCode, index);
      }
    });
  }
  getJobDataForPPA() {
    if (this.ppaEstablishment) {
      // to get civil jobScale for PPA
      this.jobScaleList$.subscribe(jobScale => {
        if (jobScale) {
          this.civilianJobScale = this.establishment?.jobScaleType;
          // jobScale.items.filter(res => {
          //   return res.value.english === 'Civil Job class';
          // })[0]?.code;
          //Job Class List For PPA
          this.contributorService.getJobClass(this.civilianJobScale).subscribe(val => {
            this.jobClassLov = [];
            val.forEach((eachJobType, index) => {
              const lov = new Lov();
              lov.code = eachJobType.jobClassCode;
              lov.value = eachJobType.jobClassName;
              lov.sequence = index;
              this.jobClassLov.push(lov);
            });
            if (this.isValidatorEdit || this.isEditAdmin) {
              this.getAllPeriodsJobData(this.engagement);
            }
          });
        }
      });
    }
  }
  /** Method to initialize document section on edit. */
  initializeDocumentEdit() {
    if (this.isContractRequired)
      concat(
        this.getContractDetails(ContractStatus.VALIDATOR_PENDING).pipe(
          switchMap(() => this.fetchContractClauses(this.contractId))
        ),
        this.getBankDetails()
      ).subscribe({
        error: err => this.showError(err),
        complete: () => this.getRequiredDocForContributor(true, this.checkForBankChange())
      });
    else this.getRequiredDocForContributor(true);
  }
  /** Method to navigate between form wizard steps while clicking on individual wizard icon */
  selectFormWizard(selectedWizardIndex) {
    this.alertService.clearAlerts();
    this.activeTab = selectedWizardIndex;
  }
  /** Method to load person details form dynamically based on selected contributor type */
  loadPersonDetailsComponent(contributorType: string) {
    if (this.contributorType) {
      const componentRef = ContributorHelper.createPersonComponent(contributorType, this);
      if (componentRef) {
        componentRef.instance.contributorSave.subscribe((personDetails: Person) =>
          this.onContributorSave(personDetails)
        );
        componentRef.instance.reset.subscribe(() => this.showCancelTemplate());
      }
    }
  }

  // personal details cancel template
  showCancelTemplate() {
    if ((this.checkPersonalDetailsSaved && !this.isValidatorEdit && !this.isEditAdmin) || this.isDraftNeeded)
      this.showTemplate(this.draftTemplate);
    else this.showTemplate(this.cancelTemplate);
  }

  showDraft() {
    this.isDraftNeeded = true;
    this.person = this.personTemp;
    this.referenceNo = this.transactionTraceId;
    this.loadPersonDetailsComponent(this.contributorType);
    this.hideModal();
  }

  clearDraft() {
    this.isDraftNeeded = false;
    this.loadPersonDetailsComponent(this.contributorType);
    this.notLocationBack = true;
    this.referenceNo = this.transactionTraceId;
    this.cancelAddedContributor(false, this.isDraftNeeded);
    this.hideModal();
    this.referenceNo = null;
    this.engagementId = null;
  }

  cancelDraftRequired() {
    this.location.back();
    this.hideModal();
  }

  /** Method to save/update person details */
  onContributorSave(personDetails: Person) {
    this.isApiTriggered = true;
    this.personDetailsApi = true;
    this.engagementService.setIsPersonApiTriggered(this.personDetailsApi);
    if (this.parentForm.get('personDetails').valid && personDetails) {
      super.getContributorSin(this.person.personId, this.registrationNo, true); // Checking SIN already existing. if already exist will update SIN with new details else create new SIN and save.
      this.contributorDetailsWrapper = ContributorHelper.assembleContributorDetails(
        personDetails,
        this.person,
        this.contributorType,
        this.isEditAdmin || this.isValidatorEdit
      );
      const navigationInd = ContributorHelper.getNavigationIndicator(this.isEditAdmin, this.isValidatorEdit);
      if (this.socialInsuranceNo !== null && this.socialInsuranceNo !== undefined)
        super
          .updateContributor(this.contributorDetailsWrapper, navigationInd)
          .pipe(tap(() => (this.isSaved = true)))
          .subscribe(
            () => {
              this.navigateToNextTab();
              this.personDetailsApi = false;
              this.engagementService.setIsPersonApiTriggered(this.personDetailsApi);
              if (this.draftAvailable && this.engagementId && this.isDraftNeeded) {
                this.engagementService
                  .getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, null, false)
                  .subscribe(res => {
                    this.engagement = res;
                    this.engagement.isContributorActive = this.engagement.leavingDate?.gregorian ? false : true;
                  });
              }
            },
            err => {
              this.personDetailsApi = false;
              this.engagementService.setIsPersonApiTriggered(this.personDetailsApi);
              this.showAlertDetails(err);
            }
          );
      else super.saveContributor(this.contributorDetailsWrapper, this.establishment.registrationNo);
    } else this.showMandatoryFieldsError();
  }
  /** Method to add or remove contract wizard icons */
  checkContractRequired(isContActive?: boolean) {
    this.isContractRequired = ContributorHelper.checkForContractAuthentication(
      this.contributorType,
      this.isValidatorEdit || this.isEditAdmin,
      this.isValidatorEdit ? this.engagement.establishmentLegalEntity.english : this.legalEntity,
      this.backdatingIndicator,
      isContActive,
      this.isGccEstablishment
    );
    this.formWizardItems = this.isContractRequired
      ? WizardUtil.addContractWizards(this.formWizardItems, this.isDocumentsRequired)
      : WizardUtil.removeContractWizards(this.formWizardItems, this.isDocumentsRequired);
  }
  /**Method to show confirmation popup */
  checkConfirmation(): void {
    if (this.modalRef) this.hideModal();
    if (!this.isDocumentsRequired) this.isContractRequired ? this.saveEngagement() : this.showConfirmationTemplate();
    else this.saveEngagement();
    if (this.isContractRequired) {
      if (!this.bankDetails) this.getBankDetails().subscribe(err => this.showError(err));
      if (this.isValidatorEdit)
        this.getContractDetails(ContractStatus.VALIDATOR_PENDING).subscribe(err => this.showError(err));
    }
  }
  /** This method is to save the  engagement details */
  onSaveEngagementDetails(engagementDetails) {
    this.tempEngagementDetails = engagementDetails;
    this.alertService.clearAlerts();
    this.checkBeneficiary();
  }
  /** Method to add or remove document wizard icon based on regular or backdated joining date */
  checkDocumentsRequired(data?) {
    this.isDocumentsRequired = ContributorHelper.checkForDocumentSection(
      this.appToken,
      this.contributorType,
      this.isValidatorEdit || this.isEditAdmin,
      this.systemParams?.REG_CONT_MAX_REGULAR_JOINING_DATE,
      data
    );
    const currentDate = new Date();
    this.monthDifference = data?.joiningDateHijiri
      ? monthDiffHijiri(convertToHijriFormat(data?.joiningDateHijiri), convertToHijriFormat(this.sysDate?.hijiri))
      : monthDiff(startOfMonth(data?.joiningDate), startOfMonth(currentDate));
    if (this.monthDifference <= 1 && !this.isPrivate && this.contributorType === 'SAUDI' && data?.isConActive)
      this.isDocumentsRequired = false;
    this.formWizardItems = this.isDocumentsRequired
      ? WizardUtil.addDocumentWizard(this.formWizardItems)
      : WizardUtil.removeDocumentWizard(this.formWizardItems);
    // this.checkContractRequired(data?.isConActive);
    this.totalTabs = ContributorHelper.getTotalTabs(this.isDocumentsRequired, this.isContractRequired);
  }
  /** Method to save engagement. */
  saveEngagement() {
    this.savetempEngagementDetails = this.tempEngagementDetails;
    // payload required in different format ie (yyyy-mm-dd)
    this.savetempEngagementDetails.engagementDetails.joiningDate.hijiri = convertToHijriFormatAPI(
      this.savetempEngagementDetails.engagementDetails.joiningDate.hijiri
    );
    if (this.savetempEngagementDetails.engagementDetails.leavingDate.hijiri) {
      this.savetempEngagementDetails.engagementDetails.leavingDate.hijiri = convertToHijriFormatAPI(
        this.savetempEngagementDetails.engagementDetails.leavingDate.hijiri
      );
    } else if (!this.savetempEngagementDetails.engagementDetails.leavingDate.gregorian) {
      this.savetempEngagementDetails.engagementDetails.leavingDate.entryFormat = null;
    }
    this.savetempEngagementDetails.wageDetails.forEach(element => {
      /**payload required in different format ie (yyyy-mm-dd) after save and next then return back to
       previous in ui side the format become (yyyy-mm-dd) its affect calculation so there
       convertion not required so check 4th position of string whether its '-' conversion not required
       */
      element.startDate.hijiri
        ? (element.startDate.hijiri =
            element.startDate.hijiri[4] != '-'
              ? convertToHijriFormatAPI(element.startDate.hijiri)
              : element.startDate.hijiri)
        : null;
      element.endDate?.hijiri
        ? (element.endDate.hijiri =
            element.endDate.hijiri[4] != '-' ? convertToHijriFormatAPI(element.endDate.hijiri) : element.endDate.hijiri)
        : null;
      if (element.endDate?.gregorian && element.endDate?.entryFormat === null) {
        element.endDate.entryFormat = this.savetempEngagementDetails.engagementDetails.leavingDate.entryFormat;
      }
      //Commision, Housing benefit, OA null for ppa
      if (this.ppaEstablishment) {
        element.wage.commission = null;
        element.wage.housingBenefit = null;
        element.wage.otherAllowance = null;
      }
    });
    super.saveEngagementDetails(
      this.tempEngagementDetails,
      this.coverageTypeForm.get('english').value ? this.coverageTypeForm.value : null,
      this.isContractRequired
    );
  }

  /** Method to show error alert by key */
  showAlertError(key: string): void {
    key ? this.alertService.showErrorByKey(key) : this.alertService.clearAllErrorAlerts();
  }
  /** This method is used to handle confirm on pop up */
  confirmSubmit() {
    this.hideModal();
    if (this.activeTab === 1) this.saveEngagement();
    else if (this.activeTab === 2) super.submitDocuments(this.parentForm.get('documentsForm.comments').value);
  }
  /**Method to if person is beneficiary and fetch coverage type  */
  checkBeneficiary(): void {
    if (!this.isApiTriggered) {
      this.isApiTriggered = true;
      if (this.monthDifference === 1) this.isbackdated = true;
      if (
        this.isBeneficiary &&
        this.person.ageInHijiri >= this.systemParams.UI_TERMINATION_AGE &&
        this.person.ageInHijiri < this.systemParams.MAX_ELIGIBLE_BENEFICIARY_AGE
      ) {
        this.savetempEngagementDetails = this.tempEngagementDetails;
        // payload required in different format ie (yyyy-mm-dd)
        this.savetempEngagementDetails.engagementDetails.joiningDate.hijiri = convertToHijriFormatAPI(
          this.savetempEngagementDetails.engagementDetails.joiningDate.hijiri
        );
        if (this.savetempEngagementDetails.engagementDetails.leavingDate.hijiri) {
          this.savetempEngagementDetails.engagementDetails.leavingDate.hijiri = convertToHijriFormatAPI(
            this.savetempEngagementDetails.engagementDetails.leavingDate.hijiri
          );
        } else if (!this.savetempEngagementDetails.engagementDetails.leavingDate.gregorian) {
          this.savetempEngagementDetails.engagementDetails.leavingDate.entryFormat = null;
        }
        this.savetempEngagementDetails.wageDetails.forEach(element => {
          /**payload required in different format ie (yyyy-mm-dd) after save and next then return back to
           previous in ui side the format become (yyyy-mm-dd) its affect calculation so there
           convertion not required so check 4th position of string whether its '-' conversion not required
           */
          element.startDate.hijiri
            ? (element.startDate.hijiri =
                element.startDate.hijiri[4] != '-'
                  ? convertToHijriFormatAPI(element.startDate.hijiri)
                  : element.startDate.hijiri)
            : null;
          element.endDate?.hijiri
            ? (element.endDate.hijiri =
                element.endDate.hijiri[4] != '-'
                  ? convertToHijriFormatAPI(element.endDate.hijiri)
                  : element.endDate.hijiri)
            : null;
          if (element.endDate?.gregorian && element.endDate?.entryFormat === null) {
            element.endDate.entryFormat = this.savetempEngagementDetails.engagementDetails.leavingDate.entryFormat;
          }
        });
        this.engagementService
          .getBeneficiaryCoverage(
            this.registrationNo,
            this.socialInsuranceNo,
            setWageDetails(this.tempEngagementDetails)
          )
          .subscribe(
            res => {
              if (res?.length > 1) {
                this.coverageTypesLov = ContributorHelper.assembleCoverageTypeLov(res);
                if (this.isValidatorEdit || this.isEditAdmin)
                  ContributorHelper.setCoverageFormOnEdit(this.engagement, this.coverageTypeForm);
                this.showTemplate(this.selectCoverageTemplate);
              } else {
                this.coverageTypeForm.setValue(res[0]);
                this.checkConfirmation();
              }
            },
            err => {
              this.isApiTriggered = false;
              this.showError(err);
            }
          );
      } else this.checkConfirmation();
    }
  }
  /**Method to reset coverage modal value on cancel */
  resetCoverageForm(): void {
    this.hideModal();
    this.coverageTypeForm.reset();
  }
  /** Method to submit documents */
  onSubmitDocuments(isFinalSubmit: boolean): void {
    if (this.parentForm.get('documentsForm').valid)
      if (this.documentService.checkMandatoryDocuments(this.documents))
        isFinalSubmit ? this.showConfirmationTemplate() : this.verifyDocuments();
      else super.showMandatoryDocumentsError();
    else super.showMandatoryFieldsError();
  }
  /** Method to verify documents. */
  verifyDocuments() {
    if (!this.isApiTriggered) {
      this.isApiTriggered = true;
      this.contributorService
        .submitUploadedDocuments(
          this.registrationNo,
          this.socialInsuranceNo,
          this.engagementId,
          SubmitActions.VERIFY_DOCUMENTS
        )
        .subscribe(
          () => this.navigateToNextTab(),
          err => {
            this.showError(err);
            this.isApiTriggered = false;
          }
        );
    }
  }
  /** Method is to refresh document */
  refreshDocumentItem(doc: DocumentItem): void {
    super.refreshDocument(
      doc,
      this.documentUploadEngagementId,
      DocumentTransactionId.REGISTER_CONTRIBUTOR,
      null,
      this.referenceNo
    );
  }
  /** Method to show confirmation pop up */
  showConfirmationTemplate() {
    this.isApiTriggered = true;
    const initialState = ContributorHelper.assembleInitialState(
      this.person,
      this.tempEngagementDetails ? this.tempEngagementDetails : this.engagement,
      this.isApiTriggered
    );

    this.modalRef = this.modalService.show(
      ContributorConfirmationDcComponent,
      ContributorHelper.getModalConfig(initialState)
    );
    this.modalRef.content.confirmSubmission.subscribe(value => {
      if (value === true) {
        if (this.activeTab === 1) this.saveEngagement();
        else super.submitDocuments(this.parentForm.get('documentsForm.comments').value);
      } else this.isApiTriggered = false;
    });
  }
  /** Method to show template. */
  showTemplate(template: TemplateRef<HTMLElement>) {
    this.isApiTriggered = false;
    this.modalRef = this.modalService.show(template, ContributorHelper.getModalConfig());
  }
  /** Method to get bank details. */
  getBankDetails() {
    return this.contributorService.getBankDetails(this.registrationNo, this.socialInsuranceNo).pipe(
      tap(res => (this.approvedBank = ContributorHelper.assembleBankDetails(res.bankAccountList[0]))),
      switchMap(() =>
        this.contributorService
          .getBankDetailsWorkflowStatus(new Map().set('regNo', this.registrationNo).set('sin', this.socialInsuranceNo))
          .pipe(
            tap(pendingDetails => {
              this.bankDetails = pendingDetails ? pendingDetails : this.approvedBank;
              this.isBankDetailsPending = pendingDetails ? true : false;
            })
          )
      )
    );
  }
  /** Method  to check for bank details change. */
  checkForBankChange() {
    const iban: string = ContributorHelper.getNewIBAN(this.parentForm, this.bankDetails, this.isValidatorEdit);
    if (this.isValidatorEdit && this.isContractRequired && this.checkLegal && this.conTypeSaudi) {
      return true;
    } else {
      return iban && (this.approvedBank ? this.approvedBank.ibanAccountNo : '') !== iban;
    }
  }
  /** Method to save contract details. */
  saveContractDetails(contract: ContractRequest) {
    if (!this.isApiTriggered) {
      this.isApiTriggered = true;
      this.contractService
        .addContractDetails(
          this.registrationNo,
          this.socialInsuranceNo,
          this.engagementId,
          contract,
          this.contractId,
          this.isValidatorEdit
        )
        .pipe(
          switchMap(res => {
            this.contractId = res.contractId;
            return this.fetchContractClauses(res.contractId);
          })
        )
        .subscribe(
          () => this.navigateToNextTab(),
          err => {
            this.showError(err);
            this.isApiTriggered = false;
          }
        );
    }
  }
  /** Method to fetch contract clauses. */
  fetchContractClauses(contractId: number) {
    return this.contractService
      .getListOfClauses(this.registrationNo, this.socialInsuranceNo, this.engagementId, contractId)
      .pipe(tap(res => (this.contractClauses = res)));
  }
  /** Method to save contract clauses. */
  saveContractClauses(contractClauses) {
    if (!this.isApiTriggered) {
      this.contractClauses.contractClause = contractClauses.finalClausesList;
      this.isApiTriggered = true;
      this.contractService
        .saveClauseDetails(
          contractClauses.selectedClauses,
          this.registrationNo,
          this.socialInsuranceNo,
          this.engagementId,
          this.contractId
        )
        .pipe(
          switchMap(() =>
            this.getContractDetails(this.isValidatorEdit ? ContractStatus.VALIDATOR_PENDING : ContractStatus.DRAFT)
          )
        )
        .subscribe(
          () => {
            if (this.isDocumentsRequired) this.getRequiredDocForContributor(true, this.checkForBankChange());
            this.navigateToNextTab();
          },
          err => {
            this.showError(err);
            this.isApiTriggered = false;
          }
        );
    }
  }
  /** Method to get contract details. */
  getContractDetails(status: string) {
    const params = new ContractParams(this.engagementId, status, null);
    return this.contractService.getContracts(this.registrationNo, this.socialInsuranceNo, params).pipe(
      tap(res => {
        this.contractDetails = res.contracts[0];
        this.contractId = this.contractDetails.id;
      })
    );
  }
  /** Method to print contracts. */
  printContract() {
    this.contractService
      .printPreview(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.contractId)
      .subscribe(
        res => downloadFile(ContributorConstants.PRINT_CONTRACT_FILE_NAME, 'application/pdf', res),
        err => this.showError(err)
      );
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllErrorAlerts();
  }
  cancelFileUpload(data) {
    this.cancelAddedContributor(data.docFlag, data.isDraftRequired);
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
    this.dataSharingService.setIsUnclaimed(this.isUnclaimed); 
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
    this.dataSharingService.setIsUnclaimed(this.isUnclaimed); 
  }



}
