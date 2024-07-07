/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  BPMUpdateRequest,
  CaptchaService,
  CoreBenefitService,
  DocumentItem,
  DocumentService,
  InspectionReferenceType,
  InspectionService,
  InspectionTypeEnum,
  isNIN,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  OccupationList,
  OTPService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  startOfDay,
  startOfMonth,
  UuidGeneratorService,
  WizardItem,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { forkJoin } from 'rxjs';

import { BreadCrumbConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { BreadcrumbDcComponent, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';

import { EngagementPeriod } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WageDetailFormBase } from '@gosi-ui/foundation/form-fragments';
import moment from 'moment';
import { Contributor } from '@gosi-ui/features/contributor/lib/shared/models/contributor';
import {
  ContractAuthConstant,
  ContractAuthenticationService,
  ContributorConstants,
  ContributorRouteConstants,
  ContributorService,
  DocumentTransactionId,
  DocumentTransactionType,
  EngagementBasicDetails,
  EngagementDetails,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  SystemParameter,
  TransactionId,
  ViolationRequest
} from '@gosi-ui/features/contributor/lib/shared';

@Component({
  selector: 'modify-joining-leaving-date-sc',
  styleUrls: ['./modify-joining-leaving-date-sc.component.scss'],
  templateUrl: './modify-joining-leaving-date-sc.component.html'
})
export class ModifyJoiningLeavingDateScComponent extends WageDetailFormBase implements OnInit, OnChanges {
  engagementWizardItems: WizardItem[] = [];
  currentTab = 0;
  counter = 0;
  isPeriodEditInProgress = false;
  isWageDetailsUpdate = false;
  isCurrentMonth = false;
  contributor: Contributor;
  isJoiningDateChanged: boolean;
  periodChanged = false;

  isValid: boolean;
  referenceNo: any;
  uuid: string;
  Otp: string = null;
  errorRes: BilingualText;
  personIdentifier: number;
  captcha: string;
  captchaId: number;
  xCaptcha: string;
  nin: number;
  isNexttab = false;
  occupationLovList: LovList = new LovList([]);
  modifyEngagement: EngagementBasicDetails = new EngagementBasicDetails();
  EngagementType: string;
  joiningDate;
  leavingDate;
  wageDetailsForm: FormGroup;
  isNin: boolean;
  currentEngagmentDetails: any;
  validUuid = false;
  newEngagementDate;
  Engagementstatus: string;
  currentDate: any;
  showError = false;
  showSuccess = false;
  uniqueOccupation: EngagementPeriod[] = [];
  basicWage = 0;
  housingwage = 0;
  commision = 0;
  otherAllowance = 0;
  contributoryWage = 0;
  applicableFrom: Date;
  startDate: any;
  hijriDate: any;
  date = new Date();
  isSaudiPerson = false;
  engagementForm: FormGroup = new FormGroup({});
  updatedEngagement: EngagementDetails;
  // @Output() wageDetailsFormToVerify: EventEmitter<Object> = new EventEmitter();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  engagementId: number;
  socialInsuranceNo: number;
  lang: string;
  isEngagementVerified = false;
  otpError: BilingualText = new BilingualText();
  otpUnathorizedError: BilingualText = new BilingualText();
  engagementDetails: EngagementDetails;
  leavingReasonlist$: Observable<LovList>;
  occupationList$: Observable<OccupationList>;
  @ViewChild('brdcmb', { static: false })
  cntBillingBrdcmb: BreadcrumbDcComponent;
  engagementResponses;
  successMessage: BilingualText;
  @ViewChild('engagementWizard', { static: false })
  engagementWizard: ProgressWizardDcComponent;
  isDataloaded: boolean = false;
  isModifyWageAndOccupation: boolean = false;
  savedWageDetailsForm: FormGroup;
  isWageSave: boolean = false;
  MessageType: BilingualText = new BilingualText();
  // otpResetFlag : boolean;
  /** Observables */
  leavingReasonList$: Observable<LovList>;
  workTypeList$: Observable<LovList>;
  yesOrNoList$: Observable<LovList>;
  systemParameter: SystemParameter;
  isApiTriggered: boolean;
  editMode: boolean = false;
  payload: any;
  registrationNumber: any;
  requestId: any;
  referanceNumber: number;
  state: any;
  isWageUpdate: boolean;
  registrationNo: any;
  previousOutcome: any;
  roleId: any;
  violationDetails: ViolationRequest;
  isModifyWage: boolean;
  violationType: any;
  violationSubType: any;
  documents: DocumentItem[];
  fieldActivityNo: string;
  parentForm: FormGroup = new FormGroup({});
  cancelEngBusinessKey: any;
  isAnyDoc = false;
  violationRes;
  status: BilingualText;
  documentsByteArray = [];
  isApiTrigger: boolean = true;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly manageWageService: ManageWageService,
    readonly contributorService: ContributorService,
    readonly modalService: BsModalService,
    readonly lookUpService: LookupService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly authTokenService: AuthTokenService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly contractService: ContractAuthenticationService,
    readonly contractAuthenticationService: ContractAuthenticationService,
    readonly captchaService: CaptchaService,
    readonly otpService: OTPService,
    readonly coreBenefitService: CoreBenefitService,
    public fb: FormBuilder,
    readonly inspectionService: InspectionService,
    readonly workFlowService: WorkflowService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private uuidGeneratorService: UuidGeneratorService
  ) {
    super(fb);
  }
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.initializeParameters();
    // this.uuid = this.uuidGeneratorService.getUuid();
    this.wageDetailsForm = super.createWageDetailsForm();
    this.cancelEngBusinessKey = TransactionId.CHANGE_ENGAGEMENT_VIOLATION;
    this.nin = this.socialInsuranceNo;
    this.initializeWizards();
    this.alertService.clearAlerts();
    let acitveBenefit = this.coreBenefitService.getSavedActiveBenefit();

    if (acitveBenefit) {
      this.socialInsuranceNo = acitveBenefit.sin;
    }
    // this.route.queryParams.subscribe(params => {
    //   this.EngagementType = params.EngagementType;
    //   this.joiningDate = params.joiningDate;
    //   this.leavingDate = params.leavingDate;
    //   this.engagementId = params.engagementId;
    //   this.Engagementstatus = params.status;
    // });
    this.getSystemParameters();
    this.getUser();

    this.occupationList$ = this.lookUpService.getOccupationList();
    this.yesOrNoList$ = this.lookUpService.getYesOrNoList();
    this.getRasedDoc();
  }

  /** Method to initialize edit mode data */
  initializeParameters() {
    this.readDataFromToken(this.routerDataToken);
  }

  /** Method to read data from token. */
  readDataFromToken(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.registrationNo) this.registrationNo = payload.registrationNo;
      if (payload.socialInsuranceNo) this.socialInsuranceNo = payload.socialInsuranceNo;
      if (payload.requestId) this.requestId = payload.requestId;
      if (payload.referenceNo) this.referenceNo = payload.referenceNo;
      if (payload.previousOutcome) this.previousOutcome = payload.previousOutcome;
      if (payload.roleId) this.roleId = payload.roleId;
    }
    this.getViolationData();
  }

  /* Method to get the violation data */
  getViolationData() {
    forkJoin([
      this.contractAuthenticationService.getViolationRequest(this.registrationNo, this.requestId),
      this.getInspectionFieldActivityNumber()
    ]).subscribe(
      ([data]) => {
        this.violationDetails = data;
        this.engagementId = data['engagementId'];
        if (
          this.violationDetails.violationType &&
          this.violationDetails.violationSubType.english === 'Modify Wage And Occupation'
        ) {
          this.isModifyWage = true;
          this.violationType = DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION;
          this.violationSubType = DocumentTransactionType.CHANGE_ENGAGEMENT_VIOLATION_UPDATE_WAGE;
        }
        if (this.violationType && this.violationSubType) {
          this.getRequiredDocument(
            this.violationType,
            this.violationSubType,
            this.state === WorkFlowActions.UPDATE,
            this.requestId
          );
        }
        this.getEngagement();
      },
      err => {
        if (err.error) {
          this.alertService.showError(err.error.message);
        }
      }
    );
  }
  /** Method to get required document list. */
  getRequiredDocument(workFLowType: string, transactionType: string[], isRefreshRequired = false, requestId) {
    this.documentService.getRequiredDocuments(workFLowType, transactionType).subscribe(
      res => {
        this.documents = this.documentService.removeDuplicateDocs(res);
        if (isRefreshRequired)
          this.documents.forEach(doc => {
            this.refreshDocument(doc, workFLowType, requestId);
          });
        // this.filterDocumentBasedOnKashef()
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }

  /**
   * Method to refresh documents after scan.
   * @param doc document
   */
  refreshDocument(doc: DocumentItem, workFlowType, requestId) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(doc, requestId !== undefined ? requestId : null, workFlowType, null, this.referanceNumber)
        .subscribe(res => {
          doc = res;
          if (!this.isAnyDoc && doc?.documentContent) {
            this.isAnyDoc = true;
          }
        });
    }
  }

  /** Method to get field activity number. */
  getInspectionFieldActivityNumber() {
    return this.inspectionService.getInspectionByTransactionId(this.referenceNo, this.socialInsuranceNo).pipe(
      tap(res => {
        if (res && res.length > 0) this.fieldActivityNo = res[0].fieldActivityNumber;
      })
    );
  }

  ngAfterViewInit() {
    // if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
    //   if (this.EngagementType === "JoiningDate") {
    //     this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.MODIFY_JOINNING_BREADCRUMB_VALUES;
    //   } else if (this.EngagementType === "Cancelengagement") {
    //     this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.CANCEL_BREADCRUMB_VALUES;
    //   } else if (this.EngagementType === "LeavingDate") {
    //     this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.MODIFY_LEAVING_BREADCRUMB_VALUES;
    //   } else if (this.EngagementType === "Terminateengagement") {
    //     this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.TERMINATE_BREADCRUMB_VALUES;
    //   } else if (this.EngagementType === "Modifywageandoccupation") {
    //     this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.MODIFY_WAGE_AND_OCCUPATION;
    //     this.isModifyWageAndOccupation = true
    //   }
    // }
  }
  /** Method to get system parameter like maximum backdated joining date. */
  getSystemParameters() {
    this.contributorService.getSystemParams().subscribe(res => {
      this.systemParameter = new SystemParameter().fromJsonToObject(res);
      //console.log('sc sys param', this, this.systemParameter);
    });
  }

  getUser() {
    this.contributorService.getUserStatus(this.nin).subscribe(res => {
      if (res) {
        //console.log(res.contributorType);
        this.isSaudiPerson = res.contributorType === 'SAUDI' ? true : false;
        //  this.deathdate=res.person.deathDate;
        //  this.mob=res.person.contactDetail.mobileNo.primary;
        //  this.mob=this.mob.substring(this.mob.length -4)
        // console.log(this.mob);
      }
      err => {
        // this.errorRes = err['error']['message'];
      };
    });
  }

  /** Method to initialize the navigation wizard. */
  initializeWizards() {
    this.engagementWizardItems = this.getWizards();
    this.engagementWizardItems[0].isDisabled = false;
    this.engagementWizardItems[0].isActive = true;
  }
  /** Method to get wizard items */
  getWizards() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(ContributorConstants.ENGAGEMENT_DETAILS, 'briefcase'));
    wizardItems.push(new WizardItem(ContributorConstants.DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  /** Method to enable navigation through wizard. */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
    if (this.currentTab === 0 && this.EngagementType === 'Modifywageandoccupation') {
      this.setWageDetailsValue(this.savedWageDetailsForm);
    }
    if (this.currentTab === 1 && this.EngagementType === 'Modifywageandoccupation') {
      // this.otpResetFlag = false;
      this.isNexttab = true;
    }
  }

  setWageDetailsValue(savedWageDetailsForm: FormGroup) {
    this.wageDetailsForm
      .get('formSubmissionDate')
      .get('gregorian')
      .setValue({
        gregorian: savedWageDetailsForm.get('formSubmissionDate').get('gregorian').value,
        hijiri: savedWageDetailsForm.get('formSubmissionDate').get('hijiri').value
      });

    this.wageDetailsForm.get('startDate').setValue({
      gregorian: savedWageDetailsForm.get('startDate').get('gregorian').value,
      hijiri: savedWageDetailsForm.get('startDate').get('hijiri').value
    });
    this.wageDetailsForm.get('endDate').setValue({
      gregorian: savedWageDetailsForm.get('endDate').get('gregorian').value,
      hijiri: savedWageDetailsForm.get('endDate').get('hijiri').value
    });

    this.wageDetailsForm.get('wage').setValue({
      basicWage: savedWageDetailsForm.get('wage').get('basicWage').value,
      commission: savedWageDetailsForm.get('wage').get('commission').value,
      housingBenefit: savedWageDetailsForm.get('wage').get('housingBenefit').value,
      otherAllowance: savedWageDetailsForm.get('wage').get('otherAllowance').value,
      contributoryWage: savedWageDetailsForm.get('wage').get('contributoryWage').value,
      totalWage: savedWageDetailsForm.get('wage').get('totalWage').value
    });

    this.wageDetailsForm.get('occupation').setValue({
      english: savedWageDetailsForm.get('occupation').get('english').value,
      arabic: savedWageDetailsForm.get('occupation').get('arabic').value
    });

    this.wageDetailsForm.get('contributorAbroad').setValue({
      english: savedWageDetailsForm.get('contributorAbroad').get('english').value,
      arabic: savedWageDetailsForm.get('contributorAbroad').get('arabic').value
    });
  }

  saveWage(event) {
    //console.log(event.engagementPeriod);
    this.modifyEngagement.violationPeriodRequests = event.engagementPeriod;
    this.isWageSave = true;
    this.postEngagementValue(event);
  }

  saveandNext(evnt: any) {
    //this.wageDetailsForm.value = evnt?.value;
    //this.currentTab = 1;
    this.newEngagementDate = evnt?.value?.engagementDate?.gregorian;
    this.modifyEngagement.comments = null;
    this.modifyEngagement.leavingReason.english = evnt.value.leavingReason.english;
    this.modifyEngagement.leavingReason.arabic = evnt.value.leavingReason.arabic;
    this.modifyEngagement.leavingDate.gregorian = this.leavingDate;
    this.modifyEngagement.leavingDate.hijiri = null;
    this.modifyEngagement.joiningDate.gregorian = this.joiningDate;
    this.modifyEngagement.joiningDate.hijiri = null;
    this.modifyEngagement.violationSubType = null;
    this.modifyEngagement.violationType = null;
    this.submitEngagementDate();
  }

  /** Method to modify engagement periods changes in wage. */
  modifyEngagementWage(engagement: EngagementDetails) {
    if (this.engagementForm.get('engagementDetails')?.valid) {
      this.updatedEngagement = engagement;
    }
  }
  submitEngagementDate() {
    this.manageWageService.openEngagementDate(this.nin, this.engagementId, this.modifyEngagement).subscribe(
      res => {
        this.currentTab = 1;
        this.isNexttab = true;
        this.nextTab();
      },
      error => {
        this.alertService.showError(error.error.message);
      }
    );
  }

  /** Method to navigate back to home page */
  navigateBackToHome(): void {
    this.router.navigate(['/home/contributor/individual/contributions']);
  }

  /* get captcha based on nin */
  getCaptcha() {
    this.alertService.clearAlerts();
    this.captchaService.getCaptchaCode(this.personIdentifier).subscribe(
      data => {
        this.captcha = data['captcha'];
        this.captchaId = data['captchaId'];
      },
      err => {
        if (err?.error?.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        } else this.errorRes = err['error']['message'];
      }
    );
  }
  
  /** Method to validate contract details. */
  validateContractDetails() {
    this.contractService.validateContract(this.referenceNo).subscribe(
      data => {
        this.personIdentifier = data?.personIdentifier;
        this.getCaptcha();
      },
      error => {
        this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
      }
    );
  }

  /* On continue click validate NIN and captcha. */
  sendOTP(captchaDetails) {
    this.alertService.clearAlerts();
    this.isValid = false;
    this.contractService.identifier = captchaDetails.identity;
    this.contractService.validateCaptchaContract(this.referenceNo, captchaDetails.identity).subscribe(
      data => {
        this.isValid = data ? true : false;
      },
      err => {
        if (err?.status === 401) {
          this.uuid = err['error']['uuid'];
          this.isValid = true;
        } else {
          this.errorRes = err['error']['message'];
        }
      }
    );
  }

  /* on verify click verify OTP. */
  verifyOTP(otpValue) {
    this.Otp = otpValue;
    if (this.EngagementType === 'Modifywageandoccupation') {
      // this.postEngagementValue();
      this.submitEngagementDate();
    } else {
      this.submitEngagementDate();
    }
  }

  /** Method to cancel login. */
  cancelLogin() {
    if (this.referenceNo) {
      this.validateContractDetails();
    } else {
      this.alertService.clearAllInfoAlerts();
      this.alertService.clearAllSuccessAlerts();
      this.alertService.clearAllWarningAlerts();
      this.alertService.clearAllErrorAlerts();
      this.router.navigate(['/home/contributor/individual/contributions']);
    }
  }

  /** Method to relaod. */
  reload() {
    window.location.reload();
  }
  /** Method to to show error alert */
  showErrorAlert(key: string) {
    this.alertService.showErrorByKey(key);
  }

  showMandatoryAlert() {
    this.showError = true;
    this.alertService.showMandatoryErrorMessage();
  }

  /** Method to resend otp. */
  // reSendOTP() {
  //   this.otpService.reSendOTP(this.uuid, false).subscribe({
  //     error: err => (this.errorRes = err['error']['message'])
  //   });
  // }
  reSendOTP() {
    this.otpService.reSendOTP(this.uuid, false).subscribe(
      data => {
        this.otpUnathorizedError = data['message'];
        this.otpError = new BilingualText();
        // this.alertService.showInfo(data['message']);
      },
      err => {
        this.errorRes = err['error']['message'];
      }
    );
  }
  /**Method to fetch engagement */
  getEngagement() {
    this.contributorService.getEngagementDetails(this.socialInsuranceNo, this.engagementId).subscribe(data => {
      this.engagementDetails = data;
      //console.log('eng sc 1', this.engagementDetails.engagementPeriod);

      //this.engagementDetails.engagementPeriod = []; // Initialize as an empty array
      // this.violationDetails.periodChangeSummary.forEach((summary, index) => {
      //   this.engagementDetails.engagementPeriod = this.engagementDetails.engagementPeriod.concat(summary.requestedWage);
      // });
      this.engagementDetails.engagementPeriod = this.violationDetails?.wageSummary;

      // Iterate through each summary in periodChangeSummary
      // this.violationDetails.periodChangeSummary.forEach((summary, index) => {
      //   // Iterate through each requestedWage in the current summary
      //   summary.requestedWage.forEach(requestedWageItem => {
      //     // Find the index of the matching engagementPeriodItem in engagementPeriod
      //     const matchingIndex = this.engagementDetails.engagementPeriod.findIndex(
      //       engagementPeriodItem => engagementPeriodItem.id === requestedWageItem.id
      //     );
      //     if (matchingIndex !== -1) {
      //       // Update the value in engagementDetails.engagementPeriod array
      //       this.engagementDetails.engagementPeriod[matchingIndex] = requestedWageItem;
      //       // Values are equal, perform your desired action here
      //     }
      //   });
      // });
      //console.log('eng sc 2', this.engagementDetails.engagementPeriod);
      this.fetchEngagementDetails();
    });
  }
  /** Method to navigate to next section of the screen. */
  nextTab() {
    this.alertService.clearAlerts();
    this.engagementWizard.setNextItem(this.currentTab);
    this.isEngagementVerified = false;
    scrollToTop();
  }

  routeBack() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAlerts();
    window.history.back();
  }

  getContributionSelection(contribution: any) {
    //console.log(contribution);
    //console.log(this.wageDetailsForm);
  }

  onBlur() {
    super.calculateTotalWage(this.wageDetailsForm);
  }

  occupationToLov(occupation: any): Lov {
    return { value: occupation.value, sequence: occupation.sequence };
  }

  fetchEngagementDetails(): void {
    this.contributorService.getEngagementFullDetails(this.nin).subscribe(res => {
      this.currentEngagmentDetails = res;
      //console.log(res);
      this.isDataloaded = true;
      this.basicWage = res.activeEngagements[0]?.engagementPeriod[0]?.wage?.basicWage;
      this.commision = res.activeEngagements[0]?.engagementPeriod[0]?.wage?.commission;
      this.contributoryWage = res.activeEngagements[0]?.engagementPeriod[0]?.wage?.contributoryWage;
      this.housingwage = res.activeEngagements[0]?.engagementPeriod[0]?.wage?.housingBenefit;
      this.otherAllowance = res.activeEngagements[0]?.engagementPeriod[0]?.wage?.otherAllowance;
      this.startDate = res.activeEngagements[0]?.engagementPeriod[0]?.startDate?.gregorian;
      this.hijriDate = res.activeEngagements[0]?.engagementPeriod[0]?.startDate?.hijiri;
      this.currentDate = new Date();

      const list = new LovList([]);
      const occupationSet = new Set<string>();
      let count = 0;
      this.currentEngagmentDetails.overallEngagements.forEach(values => {
        values.engagementPeriod?.forEach((data, index) => {
          if (data?.occupation) {
            const occKey = JSON.stringify(data.occupation);
            if (!occupationSet.has(occKey)) {
              occupationSet.add(occKey);
              this.uniqueOccupation.push(data);
            }
          }
        });
      });

      this.occupationList$.subscribe((occupationList: OccupationList) => {
        const filteredItems: Lov[] = occupationList?.items
          // .filter(item =>
          //   this.uniqueOccupation.some(overallItem => item.value.english === overallItem.occupation.english)
          // )
          .map(this.occupationToLov);

        this.occupationLovList = new LovList(filteredItems);
        // this.isDataloaded = true
      });
      //console.log(this.occupationLovList);
      //console.log(this.wageDetailsForm);
    });
  }

  calculateTotalWage() {
    super.calculateTotalWage(this.wageDetailsForm);
  }

  ngOnChanges(changes: SimpleChanges) {
    // to filter occupation list for non saudi with excluded occupation list

    if (
      changes.currentEngagmentDetails &&
      changes.currentEngagmentDetails.currentValue &&
      this.currentEngagmentDetails.joiningDate
    ) {
      const firstOfMonth = new Date(startOfMonth(this.firstDay));
      if (new Date(this.currentEngagmentDetails.joiningDate.gregorian) > firstOfMonth) {
        this.applicableFrom = this.currentEngagmentDetails.joiningDate.gregorian;
      } else {
        this.applicableFrom = firstOfMonth;
      }
      if (this.wageDetailsForm) {
        this.patchWageDetailsForm();
      }
    }
  }

  patchWageDetailsForm() {
    if (this.currentEngagmentDetails) {
      this.wageDetailsForm.patchValue(this.currentEngagmentDetails.engagementPeriod[0]);
      this.currentEngagmentDetails.engagementPeriod[0].startDate.gregorian = new Date(this.applicableFrom);
      this.wageDetailsForm.get('startDate').patchValue(this.currentEngagmentDetails.engagementPeriod[0].startDate);
      this.wageDetailsForm.updateValueAndValidity();
      this.wageDetailsForm.markAsPristine();
    }
  }

  postEngagementValue(engagement: EngagementDetails) {
    if(this.isApiTrigger){
      this.isApiTrigger = false;
      this.updatedEngagement = engagement;
      this.modifyEngagement.violationType = 'Modify Engagement';
      this.modifyEngagement.violationSubType = 'Modify Wage And Occupation';
      this.modifyEngagement.wageViolationId =
      this.violationDetails.periodChangeSummary[0].requestedWage[0].wageViolationId;
      this.modifyEngagement.requestId = this.requestId;
      this.manageWageService.saveandnextEngagementDate(this.registrationNo,this.nin, this.engagementId, this.modifyEngagement).subscribe(
          violationRes => {
            this.isApiTrigger = true;
            this.currentTab = 1;
            this.isNexttab = true;
            this.nextTab();
          },
          err => {
            this.isApiTrigger = true;
            this.alertService.showError(err.error.message);
          }
        );
    }
  }

  confirmEngagement(routerDataToken) {
    if(this.isApiTrigger){
      this.isApiTrigger = false;
      const workflowData = new BPMUpdateRequest();
      workflowData.taskId = routerDataToken.taskId;
      workflowData.user = routerDataToken.assigneeId;
      workflowData.outcome = WorkFlowActions.SUBMIT;
      this.manageWageService.openEngagementDateEinsp(this.registrationNo,this.nin, this.engagementId,this.requestId, this.modifyEngagement).subscribe(
        res => {
          if(res){
            this.updateTaskWorkFlow(workflowData);
            this.isApiTrigger = true;
          }
        },
        error => {
          this.isApiTrigger = true;
          this.alertService.showError(error.error.message);
        }
      );
    }
  }

  /** Method to update task workflow */
  updateTaskWorkFlow(workflowData: BPMUpdateRequest) {
    this.workFlowService.updateTaskWorkflow(workflowData, WorkFlowActions.SUBMIT).subscribe(res => {
      if(res){
      this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-SUBMIT-MESSAGE', null, 5);
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
      }
    },
    error => {
      this.alertService.showError(error.error.message);
    }
    );
  }

  postEngagement() {
    this.manageWageService
      .submitEngagementDate(this.nin, this.engagementId, this.Otp, this.uuid, this.modifyEngagement) 
      .subscribe(
        (res: any) => {},
        error => {
          // if(!this.uuid){
          //   this.uuid = error['error']['uuid'];
          // }
          if (this.uuid) this.validUuid = true;
          if (error.status !== 422 && error.status !== 401) {
            this.showError = true;
            this.alertService.showError(error.error.message, error.error.details);
          } else if (error.status === 401) {
            //console.log(error);
            this.uuid = error['error']['uuid'];
            this.currentTab = 1;
            this.isNexttab = true;
            this.nextTab();
            (this.otpUnathorizedError = error.error.message), error.error.details;
          } else {
            this.otpUnathorizedError = new BilingualText();
            (this.otpError = error.error.message), error.error.details;
          }
        }
      );
    // let payload = {
    //   "occupation": this.savedWageDetailsForm.get("occupation").value,
    //   "wage":       this.savedWageDetailsForm.get("wage").value,
    //   "violationType": "Modify Engagement",
    //   "violationSubType":"Modify Wage And Occupation",
    //   "comments": "",
    //   "startDate": {
    //     "gregorian": new Date(this.savedWageDetailsForm.get('startDate').get('gregorian').value),
    //     "hijiri": null
    //   }
    // }
    // this.contributorService
    // .updateWageAndOccupation(this.nin, this.engagementId, payload, this.Otp, this.uuid)
    // .subscribe(
    //   res => {
    //     this.showSuccess = true;
    //     this.successMessage = res.message;
    //     this.alertService.showSuccess(this.formatSuccessMessage(res));
    //     this.navigateBackToHome();

    //   },
    //   error => {
    //     this.currentTab=1;
    //     this.isNexttab=true;
    //     this.nextTab();
    //     if(!this.uuid){
    //       this.uuid = error['error']['uuid'];
    //     }
    //     if (this.uuid) this.validUuid = true;
    //     if (error.status !== 422 && error.status !== 401) {
    //       this.showError = true;
    //       this.alertService.showError(error.error.message, error.error.details);
    //     } else if (error.status === 401){
    //       this.otpUnathorizedError = error.error.message, error.error.details
    //     } else {
    //       this.otpUnathorizedError = new BilingualText();
    //       this.otpError = error.error.message, error.error.details
    //     }
    //   }
    // );
  }
  /* Format success message for contributor*/
  formatSuccessMessage(res: any): BilingualText {
    return {
      arabic: res.message.arabic.replace('{0}', this.nin).replace('{1}', res.referenceNo.toString()),
      english: res.message.english.replace('{0}', this.nin).replace('{1}', res.referenceNo.toString())
    };
  }

  /** Method to change period editing flag. */
  togglePeriodEditFlag(flag: boolean) {
    this.isPeriodEditInProgress = flag;
  }

  joiningDateChangeCheck(flag: boolean) {
    this.isJoiningDateChanged = flag;
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
        // this.isAppPublic &&    individual app
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
        // this.isAppPublic &&  individual app
        this.isJoiningDateChanged != true
      ) {
        return true;
      } else {
        return false;
      }
    }
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
          this.isApiTriggered = false;
          this.showError = true;
          this.alertService.showError(err.error.message, err.error.details);
        }
      );
    //   this.hasWorkFlow = true;
    //   console.log('edited', this.hasWorkFlow);
    //console.log(engagement);
    //console.log(engagement.engagementDuration.noOfMonths);
    this.isWageDetailsUpdate = this.checkDetails(engagement);
    //   // console.log("checkDetails  ",this.isWageDetailsUpdate);
    //   if (this.isWageDetailsUpdate) {
    //     this.initializeWizard(false);
    //   } else {
    //     this.initializeWizard(this.hasWorkFlow || this.isEditMode);
    //   }
  }

  cancelTransaction() {
    this.router.navigate([ContributorRouteConstants.ROUTE_MANAGE_COMPLIANCE_VALIDATOR]);
  }


    /** Method to get Rased Documents */
    getRasedDoc() {
      this.documentService
        .getRasedDocuments(
          InspectionTypeEnum.EMPLOYEE_AFFAIRS,
          this.socialInsuranceNo,
          InspectionReferenceType.CONTRIBUTOR,
          this.fieldActivityNo
        )
        .subscribe(res => (this.documentsByteArray = res));
    }
}
