/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Inject, OnDestroy, OnInit, Directive } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  DocumentService,
  TransactionReferenceData,
  Contributor,
  Role,
  LookupService,
  CoreContributorService,
  StorageService,
  LanguageToken,
  RouterDataToken,
  RouterData,
  scrollToTop,
  LovList,
  WizardItem,
  DocumentItem,
  BilingualText,
  Lov,
  UuidGeneratorService,
  RouterService,
  BPMUpdateRequest,
  WorkFlowActions,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber,
  GosiCalendar,
  CoreAdjustmentService,
  CoreBenefitService,
  CalendarService,
  BPMMergeUpdateParamEnum,
  RoleIdEnum,
  BenefitsGosiShowRolesConstants,
  AuthTokenService,
  NotificationService,
  MenuService,
  TransactionService, RouterConstants
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import {
  WorkFlowType,
  UITransactionType,
  BenefitValues,
  ProcessType,
  UIPayloadKeyEnum,
  BenefitStatus
} from '../../enum';
import {
  ManageBenefitService,
  UiBenefitsService,
  HeirBenefitService,
  BankService,
  WizardService,
  DependentService,
  BenefitDocumentService,
  SanedBenefitService,
  ModifyBenefitService,
  QuestionControlService,
  FuneralBenefitService,
  BenefitRequestsService,
  AdjustmentService,
  BypassReassessmentService,
  ContributorService,
  BenefitPropertyService,
  HeirActiveService
} from '../../services';
import { ReturnLumpsumService } from '../../services/return-lumpsum.service';
import { BehaviorSubject, forkJoin, throwError, noop } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { BenefitConstants } from '../../constants';
import {
  AnnuityResponseDto,
  AttorneyDetailsWrapper,
  BenefitResponse,
  EnableRepaymentResponse,
  ImprisonmentDetails,
  HeirDetailsRequest,
  HeirBenefitDetails,
  AnnuityBenefitRequest,
  AgeInNewLaw,
  PersonalInformation,
  BankAccountList,
  PersonBankDetails,
  BankAccount
} from '../../models';
import { Observable } from 'rxjs/internal/Observable';
import { activateWizard } from '@gosi-ui/features/establishment/lib/shared/utils/helper';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import {
  createRequestBenefitForm,
  clearAlerts,
  isTabSlctdInWizard,
  showErrorMessage,
  deepCopy,
  setWorkFlowDataForMerge,
  getServiceType
} from '../../utils/benefitUtil';
import { TranslateService } from '@ngx-translate/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared/services/manage-person.service';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { EventResponseDto, HeirEvent } from '../../models/questions';
import { getAuthorizedGuardianDetails } from '../../../shared/utils/heirOrDependentUtils';
import * as moment from 'moment';
import { catchError, map, filter, tap } from 'rxjs/operators';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared/services/oh.service';

@Directive()
export abstract class BenefitBaseScComponent extends BaseComponent implements OnInit, OnDestroy {
  //   Basic identifiers
  maxDate: Date;
  personId: number;
  workflowType: WorkFlowType;
  registrationNo: number;
  socialInsuranceNo: number;
  complicationId: number;
  engagementId: number;
  // requestId: number;
  injuryNumber: number;
  repayId: number;
  // Domain variables
  canReturn = false;
  canRequestClarification = false;
  returnToEstAdmin = false;
  canReject = false;
  canEdit = false;
  rolesEnum = Role;
  uiConst = BenefitConstants;
  transactionType: UITransactionType;
  // Local variables
  bankNameList: Lov;
  benefitReasonList$: Observable<LovList>;
  documentForm: FormGroup = new FormGroup({});
  isSelectedReasonOthers = false;
  authPersonId: number;
  channel: string;
  isWorkflow: boolean;
  commonModalRef: BsModalRef;
  // isValidator: boolean;
  processType: string;
  referenceNo: number;
  pensionModify = false;
  heirPensionModify = false;
  benefitRequestId: number;
  benefitsForm = new FormGroup({});
  annuityResponse = new AnnuityResponseDto();
  payeeList: LovList = new LovList([]);
  paymentMethodList$: Observable<LovList>;
  currentTab = 0;
  isReopenCase = false;
  comments: string;
  benefitType: string;
  role: string;
  isReadOnly = false;
  requiredDocs: DocumentItem[];
  RequestDocumentList$: Observable<DocumentItem[]>;
  reqdocumentList = [];
  benefitResponse: BenefitResponse;
  restoreResponse: EnableRepaymentResponse;
  isCsr = false;
  saveApiResp: BilingualText;
  isAppPrivate = false;
  isAppMb = false;
  lang = 'en';
  transactionReferenceData?: TransactionReferenceData[];
  contributor: Contributor;
  hasModifyIndicator = false;
  idCode: string;
  showComments: boolean;
  showOtpError: boolean;
  isChequeScanned: boolean;
  isPaymentScanned: boolean;
  requestDetails = new AnnuityBenefitRequest();
  //pagination variables
  currentPage = 0;
  contributorType: string;
  pageSize = 5;
  totalSize: number;
  declarationDone: boolean;
  inspectionList: Observable<LovList>;
  imprissionmentDetails: ImprisonmentDetails;
  cityList$: Observable<LovList>;
  countryList$: Observable<LovList>;
  waiveTowardsList$: Observable<LovList>;
  heirDetailsData: HeirDetailsRequest;
  systemParameter: SystemParameter;
  events$: Observable<EventResponseDto> = new BehaviorSubject(new EventResponseDto());
  // eventsBackdated$: Observable<HeirEvent[]>;
  attorneyDetailsWrapper = <AttorneyDetailsWrapper[]>[];
  guardianList = <AttorneyDetailsWrapper[]>[];
  guardianDetails = new PersonalInformation();
  systemRunDate: GosiCalendar;
  isPension: boolean;
  contributorPersonId;
  ageInNewLaw: AgeInNewLaw[];
  preSelectedAuthperson: AttorneyDetailsWrapper[];
  isIndividualApp: boolean;
  isCertificateExpired = false;
  bankAccountList: BankAccountList;
  bankDetailsArray: BankAccountList[] = [];
  listYesNo$: Observable<LovList>;
  validatorAccess = BenefitsGosiShowRolesConstants.VALIDATOR_ROLES;
  validatorOptionAccess = BenefitsGosiShowRolesConstants.VALIDATOR_OPTION_ROLES;
  //validatorAccess = [RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,RoleIdEnum.NEW_VALIDATOR,RoleIdEnum.FC];
  viewModify = BenefitsGosiShowRolesConstants.CSR_MODIFY;
  viewOnly = BenefitsGosiShowRolesConstants.BENEFIT_READ;
  validatorSaned = BenefitsGosiShowRolesConstants.SANED_VALIDATOR;
  validatorSanedSuspend = BenefitsGosiShowRolesConstants.SANED_SUSPEND;
  validatorRecalculation = BenefitsGosiShowRolesConstants.VALIDATOR_ONE_FC;
  contributorVisitAccess = BenefitsGosiShowRolesConstants.CONTRIBUTOR_VISIT_ACCESS;
  viewDirectPayment = BenefitsGosiShowRolesConstants.DIRECT_PAYMENT_ACCESS;
  viewHistory = BenefitsGosiShowRolesConstants.BENEFIT_VIEW_DETAILS;
  disableSubmitButton: boolean;
  directPaymentHistory = BenefitsGosiShowRolesConstants.DIRECT_PAYMENT_HISTORY;

  reRoute: string;
  private _hasCompleted = false;

  constructor(
    readonly uiBenefitService: UiBenefitsService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly fb: FormBuilder,
    readonly manageBenefitService: ManageBenefitService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly returnLumpsumService: ReturnLumpsumService,
    readonly dependentService: DependentService,
    readonly modifyBenefitService: ModifyBenefitService,
    readonly funeralBenefitService: FuneralBenefitService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly bankService: BankService,
    readonly wizardService: WizardService,
    readonly heirBenefitService: HeirBenefitService,
    readonly heirActiveService: HeirActiveService,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly location: Location,
    readonly lookUpService: LookupService,
    public contributorService: CoreContributorService,
    readonly storageService: StorageService,
    readonly router: Router,
    public route: ActivatedRoute,
    readonly translate: TranslateService,
    public modifyPensionService: ModifyBenefitService,
    readonly adjustmentService: AdjustmentService,
    readonly adjustmentPaymentService: CoreAdjustmentService,
    public manageService: ManagePersonService,
    readonly qcs: QuestionControlService,
    readonly authTokenService: AuthTokenService,
    public benefitRequestsService: BenefitRequestsService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly routerService: RouterService,
    readonly bypassReaassessmentService: BypassReassessmentService,
    public contributorDomainService: ContributorService,
    readonly coreBenefitService: CoreBenefitService,
    readonly benefitPropertyService: BenefitPropertyService,
    readonly calendarService: CalendarService,
    readonly ohService: OhService,
    readonly notificationService: NotificationService,
    readonly menuService: MenuService,
    readonly transactionService: TransactionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.isAppMb = this.appToken === ApplicationTypeEnum.MBASSESSMENT_APP;
    this.socialInsuranceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.SIN);
    if (this.manageService.contributor$) {
      this.manageService.contributor$
        .pipe(
          filter(res => res !== null),
          tap(res => {
            if (res.person.personId) {
              this.contributorService.personId = res.person.personId;
            }
          })
        )
        .subscribe(noop);
    }
  }

  /** Initializing cityList variable */
  initialiseCityLookup() {
    this.cityList$ = this.lookUpService.getCityList();
  }

  /** Initializing countryList variable */
  initialiseCountryLookup() {
    this.countryList$ = this.lookUpService.getCountryList();
  }

  /** Initializing waive towards benefit variables */
  initialiseWaivedTowardsLookup() {
    this.waiveTowardsList$ = this.lookUpService.getWaiveBenefitTowardsList();
  }

  /** Initializing waive towards heir variables */
  initialiseWaivedHeirTowardsLookup() {
    this.waiveTowardsList$ = this.lookUpService.getWaiveHeirTowardsList();
  }

  initialisePayeeType() {
    this.lookUpService.initialisePayeeType().subscribe(payee => {
      this.payeeList = payee;
    });
  }

  initPaymentMethod() {
    this.paymentMethodList$ = this.lookUpService.initialisePaymentMode();
  }

  initHeirBenefitReasons() {
    this.benefitReasonList$ = this.heirBenefitService.getBenefitReasonList();
  }

  initYesOrNoLookup() {
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
  }

  //  This method is to hide the modal reference
  hideModal() {
    if (this.commonModalRef) {
      this.commonModalRef.hide();
    }
  }

  /** Wrapper method to scroll to top of modal*/
  goToTop() {
    scrollToTop();
  }

  // @param err This method to show the page level error
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }

  // BACK BUTTON Route while displaying an injury
  routeBack() {
    if (
      this.annuityResponse.status?.english === BenefitStatus.ACTIVE &&
      this.routerData?.assignedRole !== this.rolesEnum.VALIDATOR_1
    ) {
      this.manageBenefitService
        .deleteTransaction(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
        .subscribe(() => {
          this.goToTop();
        });
    }
    this.location.back();
  }

  getAttorneyDetailsById(id: number | string, agentId?: number, getGuardianDetails?: boolean) {
    this.manageBenefitService.getPersonDetailsWithPersonId(id.toString()).subscribe(personDetails => {
      const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(personDetails.identity);
      this.getAttorneyByIdentifier(idObj.id, agentId, getGuardianDetails);
    });
  }

  getAttorneyByIdentifier(id: number, agentId?: number, getGuardianDetails?: boolean) {
    this.manageBenefitService.getAttorneyDetails(id).subscribe(res => {
      // this.attorneyDetailsWrapper = res;
      this.attorneyDetailsWrapper = getAuthorizedGuardianDetails(res, this.systemRunDate).authorizedPersonDetails;
      this.guardianList = getAuthorizedGuardianDetails(res, this.systemRunDate).guardianPersonDetails;
      if (agentId && this.attorneyDetailsWrapper.length) {
        this.preSelectedAuthperson = this.attorneyDetailsWrapper.filter(item => item.personId === agentId);
        this.authPersonId = agentId;
        if (this.preSelectedAuthperson.length > 0) {
          this.isCertificateExpired = false;
        } else {
          this.isCertificateExpired = true;
          this.setCertificateIssue(this.isCertificateExpired);
        }
      }
      if (getGuardianDetails && res?.authorizationList[0]?.custodian) {
        this.getGuardianDetails(res?.authorizationList[0]?.custodian?.id?.toString());
      }
    });
  }

  setCertificateIssue(isCertificateExpired) {
    if (isCertificateExpired) {
      if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1) {
        this.alertService.showWarningByKey('BENEFITS.CERTIFICATE-EXPIRY-WARNING-VAL1');
      } else {
        this.alertService.showWarningByKey('BENEFITS.CERTIFICATE-EXPIRY-WARNING-VAL2');
      }
    }
  }

  getAttorneyList(identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber>, getGuardianDetails?: boolean) {
    if (identity) {
      const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(identity);
      if (idObj) {
        this.getAttorneyByIdentifier(idObj.id, null, getGuardianDetails);
      }
    }
  }

  getGuardianDetails(guardianId: string) {
    this.manageBenefitService.getPersonDetailsWithPersonId(guardianId).subscribe(personalDetails => {
      if (personalDetails) {
        this.guardianDetails = personalDetails;
      }
    });
  }

  /** Initializing component variables */
  initVariables(isPension = false) {
    this.isWorkflow = false;
    this.isPension = isPension;
    // this.isValidator = false;
    this.processType = 'apply';
    this.referenceNo = null;
    // this.isDocTabActive = false;
    this.heirBenefitService.setHeirUpdateWarningMsg(false);
    this.initialisePayeeType();
    this.initialiseCityLookup();
    this.initialiseCountryLookup();
    this.initPaymentMethod();
    this.initHeirBenefitReasons();
    if (this.benefitPropertyService.getAnnuityStatus() !== BenefitConstants.NEW_BENEFIT) {
      this.benefitRequestId = this.manageBenefitService.requestId;
      this.referenceNo = this.benefitPropertyService.getReferenceNo();
    }
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    if (this.contributorService.registartionNo) {
      this.registrationNo = this.contributorService.registartionNo;
    } else {
      this.registrationNo = this.uiBenefitService.getRegistrationNo();
    }

    if (this.isIndividualApp) {
      this.socialInsuranceNo = this.authTokenService.getIndividual()
        ? this.authTokenService.getIndividual()
        : this.socialInsuranceNo;
    } else {
      this.socialInsuranceNo = this.contributorService.selectedSIN
        ? this.contributorService.selectedSIN
        : this.uiBenefitService.getSocialInsuranceNo();
    }
    this.benefitPropertyService.setAnnuityStatus(BenefitConstants.NEW_BENEFIT);
    this.benefitsForm = createRequestBenefitForm(this.isAppPrivate, this.fb);
    if (!this.socialInsuranceNo) {
      this.route.queryParams.subscribe(params => {
        this.socialInsuranceNo = params.socialInsuranceNo;
      });
    }
    if (this.isAppPrivate) {
      this.transactionType = UITransactionType.FO_REQUEST_SANED;
    } else {
      this.transactionType = UITransactionType.GOL_REQUEST_SANED;
    }
  }

  /** Initializing component variables Validator flow*/

  //This method is to get all the required docs
  getDocuments(transactionKey: string, transactionType: string, benefitRequestId: number, referenceNo?: number) {
    this.documentService.getDocuments(transactionKey, transactionType, benefitRequestId, referenceNo).subscribe(res => {
      this.requiredDocs = res;
    });
  }

  /* To get Requested Documents*/
  requestedDocumentList(transactionId: string, transactionType: string) {
    this.RequestDocumentList$ = this.documentService.getRequiredDocuments(transactionId, transactionType);
    this.RequestDocumentList$.subscribe((documents: DocumentItem[]) => {
      this.requiredDocs = documents;
      this.reqdocumentList = this.requiredDocs;
      // if (this.requiredDocs) {
      //   for (const doc of this.requiredDocs) {
      //     let reqdocumentTemp = documents.filter(item => item.name.english !== BenefitValues.Others);
      //     reqdocumentTemp = reqdocumentTemp.filter(item => (item.required === true));
      //     this.reqdocumentList.push(reqdocumentTemp);
      //   }
      // }
    });
  }

  /** This method is to go back to Benefits tab */
  goBackToBenefits() {
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
    this.routeBack();
  }

  showSuccessMessage(message) {
    if (message) {
      this.benefitPropertyService.setBenefitAppliedMessage(message);
    }
  }

  /**  Method to get the person id */
  getPersonId(): string {
    // if (this.manageBenefitService.authPersonId) {
    //   return this.manageBenefitService.authPersonId.toString();
    // } else
    if (this.benefitPropertyService.personId) {
      return this.benefitPropertyService.personId.toString();
    } else if (this.contributorPersonId) {
      return this.contributorPersonId;
    } else if (this.contributorService.personId) {
      return this.contributorService.personId.toString();
    } else {
      // this.contributorService.personId = Number(this.storageService.getLocalValue('personId'));
      return this.storageService.getLocalValue('personId');
    }
  }

  /**
   *
   * @param iBanCode
   */
  getBank(iBanCode) {
    this.lookUpService.getBank(iBanCode).subscribe(
      res => (this.bankNameList = res.items[0]),
      err => this.showError(err)
    );
  }

  showFormValidation() {
    if (this.isWorkflow && this.appToken === ApplicationTypeEnum.PUBLIC && this.processType === ProcessType.REOPEN) {
      this.alertService.clearAlerts();
    } else {
      this.alertService.clearAlerts();
      this.alertService.showMandatoryErrorMessage();
    }
  }

  /** Method to perform feedback call after scanning. */
  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.isChequeScanned = false;
      this.isPaymentScanned = false;
      this.documentService
        .refreshDocument(document, this.benefitRequestId, null, null, this.referenceNo)
        .subscribe(res => {
          if (res) {
            document = res;
          }
        });
    }
  }

  /** This method is to make Apply enable/disable on declaration   */
  changeCheck(event) {
    this.declarationDone = event.target.checked;
    if (this.declarationDone) {
      this.alertService.clearAllErrorAlerts();
      this.alertService.clearAllWarningAlerts();
    } else {
      this.alertService.clearAlerts();
      this.alertService.showWarningByKey('BENEFITS.DECLARE-CHECK-MSG');
    }
  }

  showActionButtons(currentTab: number, wizards: WizardItem[]) {
    let show = true;
    if (
      isTabSlctdInWizard(BenefitConstants.UI_DOCUMENTS, currentTab, wizards) ||
      isTabSlctdInWizard(BenefitConstants.CONTACT_DETAILS, currentTab, wizards) ||
      isTabSlctdInWizard(BenefitConstants.DEPENDENTS_DETAILS, currentTab, wizards) ||
      isTabSlctdInWizard(BenefitConstants.HEIR_DETAILS, currentTab, wizards) ||
      isTabSlctdInWizard(BenefitConstants.REASON_FOR_BENEFIT, currentTab, wizards) ||
      isTabSlctdInWizard(BenefitConstants.IMPRISONMENT_DETAILS, currentTab, wizards) ||
      isTabSlctdInWizard(BenefitConstants.MODIFY_DETAILS, currentTab, wizards)
    ) {
      show = false;
    }
    return show;
  }

  isTabSlctdInWizard(key: string, currentTab: number, wizardItems: WizardItem[]) {
    return isTabSlctdInWizard(key, currentTab, wizardItems);
  }

  nextForm(
    tabset: TabsetComponent,
    wizardComp: ProgressWizardDcComponent,
    selectKey?: string,
    navigateToPage?: string[]
  ) {
    scrollToTop();
    this.alertService.clearAlerts();
    if (selectKey && wizardComp) {
      //To preselect a tab / validator scren
      let selectTab: number;
      wizardComp.wizardItems.forEach((eachItem, index) => {
        if (eachItem.key === selectKey) {
          selectTab = index;
        }
      });
      this.currentTab = selectTab || 0;
      wizardComp.setNextItem(this.currentTab);
    } else {
      this.currentTab++;
      if (wizardComp && wizardComp.wizardItems && this.currentTab >= wizardComp.wizardItems.length) {
        if (navigateToPage) {
          this.router.navigate(navigateToPage, { state: { loadPageWithLabel: 'BENEFITS' } });
        } else {
          this.routeBack();
        }
        // this.isBenefitListingPage = true;
      } else {
        if (wizardComp && tabset) {
          if (tabset.tabs.length > 0 && tabset.tabs[this.currentTab]) {
            tabset.tabs[this.currentTab].active = true;
          }
          wizardComp.setNextItem(this.currentTab);
        } else {
          this.routeBack();
        }
      }
    }
  }

  selectWizard(index: number, tabset: TabsetComponent, wizardItems: WizardItem[]) {
    this.alertService.clearAlerts();
    this.currentTab = index || 0;
    wizardItems = activateWizard(wizardItems, index);
    this.restrictProgressBar(wizardItems);
  }

  restrictProgressBar(wizardItems: WizardItem[]) {
    this.wizardService.restrictProgress(this.currentTab, wizardItems);
  }

  goToPreviousForm(tabset: TabsetComponent, wiardComp: ProgressWizardDcComponent) {
    scrollToTop();
    this.currentTab--;
    if (this.currentTab < tabset.tabs.length) {
      tabset.tabs[this.currentTab].active = true;
    }
    this.alertService.clearAlerts();
    if (wiardComp) {
      wiardComp.setNextItem(this.currentTab);
    }
  }

  confirm() {
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
    this.commonModalRef.hide();
    const id = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
    const sin = +this.routerData.idParams.get(UIPayloadKeyEnum.SIN);
    const referenceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.REFERENCE_NO);
    if (
      this.annuityResponse.status?.english !== BenefitStatus.DRAFT &&
      this.routerData?.assignedRole === this.rolesEnum.VALIDATOR_1 &&
      id &&
      sin
    ) {
      this.manageBenefitService.revertAnnuityBenefit(sin, id, referenceNo).subscribe(
        () => {
          // this.routeBack();
          this.transactionComplete();
        },
        () => {
          this.goToTop();
        }
      );
    } else if (
      this.annuityResponse.status?.english === BenefitStatus.ACTIVE &&
      this.routerData?.assignedRole !== this.rolesEnum.VALIDATOR_1
    ) {
      this.manageBenefitService
        .deleteTransaction(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
        .subscribe(
          () => {
            // this.routeBack();
            this.transactionComplete();
          },
          () => {
            this.goToTop();
          }
        );
    } else {
      // this.routeBack();
      this.transactionComplete();
    }
  }

  transactionComplete(){
    this.setTransactionComplete();
    if (this.reRoute) {
      this.router.navigate([this.reRoute]);
    } else {
      this.routeBack();
    }
  }

  setTransactionComplete() {
    this._hasCompleted = true;
  }

  get hasCompleted() {
    return this._hasCompleted;
  }

  getSystemParam() {
    this.manageBenefitService.getSystemParams().subscribe(
      res => {
        this.systemParameter = new SystemParameter().fromJsonToObject(res);
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  getSystemRunDate() {
    this.manageBenefitService.getSystemRunDate().subscribe(
      res => {
        this.systemRunDate = res;
        this.maxDate = moment(res.gregorian).toDate();
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit(comment: { comments: string }, reasonForLateRequest?: boolean) {
    const workflowData = setWorkFlowDataForMerge(this.routerData, this.benefitsForm, null);
    workflowData.assignedRole = this.role;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    workflowData.comments = comment?.comments || '';
    if (reasonForLateRequest) {
      workflowData.updateMap.set(BPMMergeUpdateParamEnum.BENEFIT_LATE_REQUEST_REASON_CHANGED, true);
    }
    this.manageBenefitService.updateAnnuityWorkflow(workflowData, reasonForLateRequest).subscribe(
      () => {
        if (reasonForLateRequest) {
          this.alertService.showSuccessByKey('BENEFITS.SEC-MANAGER-SUCCESS-MSG');
        } else {
          this.alertService.showSuccessByKey('BENEFITS.VAL-SANED-SUCCESS-MSG');
        }
        this.manageBenefitService.navigateToInbox();
      },
      err => {
        this.disableSubmitButton = false;
        showErrorMessage(err, this.alertService);
      }
    );
  }

  getRelationShipByGender(sex: BilingualText, eligibleForPensionReform = false) {
    return this.lookUpService.getAnnuitiesRelationshipByGender(sex?.english.toUpperCase(), eligibleForPensionReform);
  }

  viewContributorDetails() {
    if (!this.isIndividualApp) {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }

  navigateToAdjustmentDetailsHeir(event: HeirBenefitDetails) {
    this.adjustmentPaymentService.identifier = event?.personId;
    this.adjustmentPaymentService.socialNumber = event?.sin;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
  }

  isThisAgeInNewLaw(isAgesInNewLaw: AgeInNewLaw[]) {
    //System parameter name is wrong OLD_LAW_DATE -> New law starting date
    // const birthDate = moment(dob);
    // const dateOnAge = birthDate.add(age, 'M');
    // return dateOnAge.isSameOrAfter(moment(this.systemParameter.OLD_LAW_DATE.toString()));
    // return dateOnAge.isSameOrAfter(moment(newLawDate));
    forkJoin(
      isAgesInNewLaw.map(ageAndDob =>
        this.calendarService.addToHijiriDate(ageAndDob.hijiriDob, ageAndDob.year).pipe(
          map(response => {
            const clonedObj = deepCopy(ageAndDob);
            clonedObj.yearAddedDate = response;
            clonedObj.inNewLaw = moment(response.gregorian).isSameOrAfter(
              moment(this.systemParameter.OLD_LAW_DATE.toString())
            );
            return clonedObj;
          }),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
      )
    ).subscribe((p: AgeInNewLaw[]) => {
      this.ageInNewLaw = [].concat(...p);
    });
  }

  /** Method to fetch bank details of a person*/
  getBankDetails(personId = null, bankAccount?: PersonBankDetails, index?: number) {
    // this.bankDetails = new PersonBankDetails();
    const contrId = this.getPersonId();
    if (personId && personId !== contrId) {
      this.authPersonId = +personId;
    } else {
      this.authPersonId = null;
    }
    let identifier;
    if (personId?.listOfPersons && personId?.listOfPersons[0]?.personId) {
      identifier = personId?.listOfPersons[0]?.personId;
    } else if (personId) {
      identifier = personId;
    } else {
      identifier = contrId;
    }
    // const identifier = personId ? personId : contrId;
    // let identifier = identifier ? identifier : personId?.listOfPersons[0]?.personId;
    // const serviceType = this.benefitType ? getServiceType(this.benefitType) : null;

    //Defect 495926
    // if (this.referenceNo) {
    // CLM BANK API INTEGRATION CHANGED
    //service type only for bank with refno
    // this.bankService.getBankAccountList(+identifier, this.referenceNo, serviceType).subscribe(bankRes => {
    //   let savedBankDetails = null;
    //   if (bankRes?.bankAccountList?.length) {
    //     // Only one account will be there
    //     savedBankDetails = bankRes;
    //     savedBankDetails.bankAccountList[0].savedAccount = true;
    //   }
    this.bankService.getBankAccountList(+identifier, null, null).subscribe(res => {
      const bankList = res || new BankAccountList();
      if (bankAccount) {
        const duplicate = bankList?.bankAccountList.findIndex(
          item => item.ibanBankAccountNo === bankAccount.ibanBankAccountNo
        );
        if (duplicate >= 0) {
          bankList.bankAccountList[duplicate].savedAccount = true;
        } else {
          bankAccount.savedAccount = true;
          bankList?.bankAccountList.push(bankAccount);
        }
      } else if (this.annuityResponse.bankAccount?.ibanBankAccountNo) {
        const duplicate = bankList?.bankAccountList.findIndex(
          item => item.ibanBankAccountNo === this.annuityResponse.bankAccount.ibanBankAccountNo
        );
        if (duplicate >= 0) {
          bankList.bankAccountList[duplicate].savedAccount = true;
        } else {
          this.annuityResponse.bankAccount.savedAccount = true;
          bankList?.bankAccountList.push(this.annuityResponse.bankAccount);
        }
      }
      // bankList.bankAccountList = bankList.bankAccountList.filter((item, index, self) => self.indexOf(item) === index);
      this.bankAccountList = deepCopy(bankList);
      this.bankDetailsArray[index] = deepCopy(bankList);
    });
    // });
    // CLM BANK API INTEGRATION CHANGED
    // this.bankAccountList = {
    //   bankAccountList: [this.annuityResponse?.bankAccount]
    // }

    // } else {
    //   this.bankService.getBankAccountList(+identifier, null, null).subscribe(bankList => {
    //     this.bankAccountList = bankList;
    //   });
    // }
  }

  ngOnDestroy() {
    this.alertService.clearAllWarningAlerts();
  }
}
