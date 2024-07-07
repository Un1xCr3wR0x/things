/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, HostListener, Inject, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActiveHeirBase } from '../base/active-heir.base';
import {
  BenefitDetailsHeading,
  ModifyBenefitService,
  HeirBenefitList,
  HeirBenefitService,
  HeirBenefitFilter,
  HeirLimit,
  HeirSort,
  HeirHistoryRequest,
  ManageBenefitService,
  BenefitDocumentService,
  HeirStatusType,
  DependentDetails,
  DependentService,
  BenefitDetails,
  BenefitConstants,
  HeirActiveService,
  DependentHistoryFilter,
  HeirStatus,
  BenefitType,
  isHeirLumpsum,
  EachHeirDetail,
  ParamId,
  InjuryDetails,
  BypassReassessmentService,
  InjuryService,
  UiBenefitsService, BenefitStatus, BenefitPropertyService, DirectPaymentService, PensionReformEligibility, SanedBenefitService
} from '../../shared';
import {
  LanguageToken,
  Lov,
  LovList,
  AlertService,
  ApplicationTypeToken,
  RouterDataToken,
  RouterData,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  RouterConstants,
  CoreBenefitService,
  formatDate,
  RoleIdEnum,
  CoreAdjustmentService,
  ApplicationTypeEnum,
  BenefitsGosiShowRolesConstants,
  MedicalAssessmentService,
  BilingualText,
  convertToYYYYMMDD,
  LookupService,
  LovStatus,
  AuthTokenService,
  DisabilityDetails,
  MedicalAssessment
} from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EventDetails,
  IndividualSessionEvents,
  MedicalBoardService,
  SessionCalendar,
  SessionCalendarService,
  SessionRequest
} from '@gosi-ui/features/medical-board';
import moment from 'moment';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'bnt-active-heir-benefit-sc',
  templateUrl: './active-heir-benefit-sc.component.html',
  styleUrls: ['./active-heir-benefit-sc.component.scss']
})
export class ActiveHeirBenefitScComponent extends ActiveHeirBase implements OnInit, OnDestroy {
  accessForActionPrivate = BenefitsGosiShowRolesConstants.CREATE_PRIVATE;
  accessForActionPublic = BenefitsGosiShowRolesConstants.CREATE_INDIVIDUAL;
  accessForCSR = [RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE];
  isHeirLumpsum = isHeirLumpsum;
  benefitHistoryDetails: BenefitDetails;
  heirFilter: HeirBenefitFilter = new HeirBenefitFilter();
  heirRequest: HeirHistoryRequest = <HeirHistoryRequest>{};
  assessment: MedicalAssessment[];
  dependentEventsList$: Observable<LovList>;
  responseConfirm: BilingualText;
  isModifyEligible: boolean;
  actionButtonDisabled = true;
  dependentHeirStatusCount = {
    [HeirStatusType.ACTIVE]: 0,
    [HeirStatusType.ON_HOLD]: 0,
    [HeirStatusType.STOPPED]: 0,
    [HeirStatusType.WAIVED]: 0,
    [HeirStatusType.INACTIVE]: 0
  };
  benefeciaryStatus: string;
  benefitWageDetail: EachHeirDetail;
  disabilityDetails: InjuryDetails[] = [];
  isIndividualApp = false;
  isPersonWithoutId = false;
  modifyBenefitInProgress = false;
  restartBenefitInprogress = false;
  modifyPayeeInprogress = false;
  isEnableDirectPymnt: boolean = true;
  /**
   * Pagination variables
   */
  totalItems;
  itemsPerPage = 10;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  selectedOption: string;
  isDescending = false;
  ownerFilters;
  paramId: ParamId;
  eligibleForPensionReform = false;
  //reschedule
  isAppPrivate = false;
  fieldOfficeList$: Observable<LovList>;
  parentForm: FormGroup = new FormGroup({});
  disabilityDetailsMedical: DisabilityDetails;
  availableArray: Date[] = [];
  locationamb: BilingualText = new BilingualText();
  unavailableArray: Date[] = [];
  sessionCalendar: SessionCalendar = new SessionCalendar();
  selectedDate: string;
  noSessions: boolean;
  virtual: BilingualText = new BilingualText();
  onHold: boolean;
  noSessionscalendar: boolean;
  totalSessions: number;
  invitenumber: number;
  sessionnumber: number;
  participantsInQueue: number;
  eventDetails: EventDetails[] = [];
  fullyFilled = false;
  passedDate: string;
  sessionRequest: SessionRequest = new SessionRequest();
  setList: boolean;
  identificationnumber: number;
  identityno: any;
  nin: number;
  sessionTimeList: LovList;
  individualSessionEvents: IndividualSessionEvents[] = [];
  isNoSessions = true;
  isDisabled: boolean;
  isMonthchanged = false;
  selectedMonth: number;
  region$: Observable<LovList>;
  selectedYear: number;
  minDate: Date;
  maxDate: Date;
  assessmentSlotSequence: number;
  assessmentSession: number;

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  constructor(
    readonly alertService: AlertService,
    readonly sessionCalendarService: SessionCalendarService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly medicalBoardService: MedicalBoardService,
    readonly lookupService: LookupService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly assessmentService: MedicalAssessmentService,
    readonly dependentService: DependentService,
    readonly directPaymentService: DirectPaymentService,
    readonly heirService: HeirBenefitService,
    readonly heirActiveService: HeirActiveService,
    readonly manageBenefitService: ManageBenefitService,
    readonly modifyPensionService: ModifyBenefitService,
    readonly modalService: BsModalService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly location: Location,
    readonly router: Router,
    readonly bypassReaassessmentService: BypassReassessmentService,
    readonly authTokenService: AuthTokenService,
    // readonly injuryService: InjuryService,
    public route: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly coreBenefitService: CoreBenefitService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly uiBenefitsService: UiBenefitsService,
    readonly benefitPropertyService: BenefitPropertyService
  ) {
    super(
      alertService,
      benefitDocumentService,
      dependentService,
      heirService,
      heirActiveService,
      manageBenefitService,
      modifyPensionService,
      modalService,
      sanedBenefitService,
      location,
      router,
      bypassReaassessmentService,
      appToken,
      language,
      routerData,
      adjustmentService,
      uiBenefitsService
    );
  }

  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.getSystemParamAndRundate();
    this.route.queryParams.subscribe(params => {
      this.sin = this.isIndividualApp ? this.authTokenService.getIndividual() : Number(params.sin);
      this.benefitRequestId = Number(params.benReqId);
      this.referenceNo = Number(params.referenceNumber);
      this.benefitType = params.benefitType;
      this.newTab = Boolean(params.newTab);
    });
    if (this.newTab && this.sin && this.benefitRequestId) {
      this.getActiveBenefitDetails(this.sin, this.benefitRequestId, this.referenceNo);
      this.getHeirBenefitDetails(this.sin, this.benefitRequestId);
      if (!this.isIndividualApp) {
        this.getHeirBenefitHistoryDetails(this.sin, this.benefitRequestId);
      }
      this.heading = new BenefitDetailsHeading(this.benefitType).getHeading();
      this.dependentEventsList$ = this.dependentService.getDependentHistoryLOV();
    }
    // accessing the active Benefit details which set which user click on active benefits carousel
    this.acitveBenefit = this.coreBenefitService.getSavedActiveBenefit();
    if (this.acitveBenefit) {
      this.sin = this.isIndividualApp
        ? this.authTokenService.getIndividual()
        : this.acitveBenefit.sin || this.acitveBenefit.contributorSin;
      this.benefitRequestId = this.acitveBenefit.benefitRequestId;
      this.benefitType = this.acitveBenefit.benefitType.english;
      this.heading = new BenefitDetailsHeading(this.benefitType).getHeading();
      if (this.sin && this.benefitRequestId) {
        this.getActiveBenefitDetails(this.sin, this.benefitRequestId, this.referenceNo);
        this.getHeirBenefitDetails(this.sin, this.benefitRequestId);
        if (!this.isIndividualApp) {
          this.getHeirBenefitHistoryDetails(this.sin, this.benefitRequestId);
        }
        this.calculateBenefit(this.sin, this.benefitRequestId);
      }

      this.dependentEventsList$ = this.dependentService.getDependentHistoryLOV();
    }
    this.nin = this.authTokenService.getIndividual();
    this.manageBenefitService.assessmentidentity$.subscribe(data => {
      this.identityno = data;
      if ((this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE)) {
        this.identificationnumber = this.identityno;
      } else {
        this.identificationnumber = this.nin;
      }
    });
    //if(this.activeBenefitDetails?.identityValue?.id || this.identificationnumber) this.getAssessment();
    // this.region$ = this.lookupService.getRegionList();
    // this.selectedDate = convertToYYYYMMDD(moment(new Date()).toDate().toString());
    // this.getOfficeLists();
    if (this.newTab && this.sin && this.benefitRequestId) {
      this.getActiveBenefitDetails(this.sin, this.benefitRequestId, this.referenceNo);
      this.getHeirBenefitDetails(this.sin, this.benefitRequestId);
      this.getHeirBenefitHistoryDetails(this.sin, this.benefitRequestId);
      this.heading = new BenefitDetailsHeading(this.benefitType).getHeading();
      this.dependentEventsList$ = this.dependentService.getDependentHistoryLOV();
    }
    // accessing the active Benefit details which set which user click on active benefits carousel
    this.region$ = this.lookupService.getRegionsList();
    this.selectedDate = convertToYYYYMMDD(moment(new Date()).toDate().toString());
    this.getOfficeLists();
    this.checkForDirectPayment();
  }
  checkForDirectPayment() {
    this.directPaymentService.checkForDirectPayment(this.sin, this.referenceNo).subscribe(res => {
      if (res != null) {
        this.isEnableDirectPymnt = res;
      }
    });
  }
  getAssessment() {
    this.assessmentService
      .getAssessmentDetails(
        this.activeBenefitDetails?.identityValue?.id
          ? this.activeBenefitDetails?.identityValue?.id
          : this.identificationnumber
      )
      .subscribe(res => {
        this.assessment = res;
        this.getDisabiltyAssessmentDetails(this.assessment[0].assessmentRequestId);
        this.invitenumber = this.assessment[0].inviteeId;
        this.locationamb = this.assessment[0].location;
        if (this.assessment[0].medicalBoardType.english === 'Appeal Medical Board') {
          this.getOfficeListsmB();
        } else {
          this.getOfficeLists();
        }
      });
  }
  getOfficeListsmB() {
    const location = this.locationamb;
    this.fieldOfficeList$ = this.transformBilingualtoLov(location);
  }
  transformBilingualtoLov(bilingualText: BilingualText): Observable<LovList> {
    const lov: Lov = {
      value: bilingualText,
      sequence: 1,
      items: [],
      disabled: false
    };
    const lovlist: LovList = new LovList([lov]);
    return new Observable(observer => {
      observer.next(lovlist);
      observer.complete();
    });
  }
  confirmInvitation(assessment) {
    this.alertService.clearAlerts();
    this.hideassessmentModal();
    this.assessmentService.acceptAssessmentInvite(assessment.sessionId, assessment.inviteeId).subscribe(
      res => {
        this.responseConfirm = res;
        this.alertService.showSuccess(res);
        this.getAssessment();
      },
      err => this.showErrorMessage(err)
    );
  }

  /** Method to show modal. */
  /** This method is to trigger show modal event
   * @param template
   */
  showModalAccept(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /*
   * This method is to trigger hide modal
   */
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  hideassessmentModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  // fetch heir details
  getHeirBenefitDetails(sin: number, benefitRequestId: number) {
    const status = isHeirLumpsum(this.benefitType)
      ? [
          HeirStatusType.ACTIVE,
          HeirStatusType.STOPPED,
          HeirStatusType.ON_HOLD,
          HeirStatusType.WAIVED_TOWARDS_GOSI,
          HeirStatusType.WAIVED_TOWARDS_HEIR,
          HeirStatusType.PAID_UP
        ]
      : [
          HeirStatusType.ACTIVE,
          HeirStatusType.STOPPED,
          HeirStatusType.ON_HOLD,
          HeirStatusType.WAIVED_TOWARDS_GOSI,
          HeirStatusType.WAIVED_TOWARDS_HEIR
        ];
    this.heirService.getHeirBenefit(sin, benefitRequestId?.toString(), null, status, true).subscribe(
      res => {
        this.heirDetails = res;
        for (const item of res) {
          this.isModifyEligible = item?.modifyPayeeEligible;
          if (this.isModifyEligible === true) break;
        }
        this.setAvailableStatus(this.heirDetails);
        this.getBenefitHistoryDetails(this.sin, this.benefitRequestId);
        // this.checkIdentity();
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  // Fetch active benefit Details
  getActiveBenefitDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.manageBenefitService.getAnnuityBenefitRequestDetail(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.activeBenefitDetails = res;
        this.eligibleForPensionReform =
          this.activeBenefitDetails.pensionReformEligibility?.english === PensionReformEligibility.Eligible;
        if (
          res.benefitType.english === BenefitType.retirementPension ||
          res.benefitType.english === BenefitType.heirMissingPension ||
          res.benefitType.english === BenefitType.heirDeathPension ||
          res.benefitType.english === BenefitType.heirDeathPension2 ||
          res.benefitType.english === BenefitType.heirPension
        ) {
          this.benefitPropertyService.getTransactionHistoryDetails(sin, benefitRequestId).subscribe(
            history => {
              this.modifyBenefitInProgress =
                history?.transactions.filter(item => {
                  return (
                    item?.transactionType.english.toLowerCase().includes('add/modify') &&
                    item?.status.english === BenefitStatus.INPROGRESS
                  );
                }).length > 0;
              this.restartBenefitInprogress =
                history?.transactions.filter(item => {
                  return (
                    item?.transactionType.english.toLowerCase().includes('restart') &&
                    item?.status.english === BenefitStatus.INPROGRESS
                  );
                }).length > 0;
              this.modifyPayeeInprogress =
                history?.transactions.filter(item => {
                  return (
                    item?.transactionType.english.toLowerCase().includes('modify heirs payment and payee details') &&
                    item?.status.english === BenefitStatus.INPROGRESS
                  );
                }).length > 0;
            },
            err => {
              this.showErrorMessage(err);
            }
          );
        }
        this.manageBenefitService.assessmentidentityvalue(res.identity[0]['newNin']);
        this.isPersonWithoutId = this.activeBenefitDetails.personWithoutIdentifier ? true : false;
        if (this.activeBenefitDetails?.identity)
          this.activeBenefitDetails.identityValue = checkIqamaOrBorderOrPassport(this.activeBenefitDetails?.identity);
        if (this.activeBenefitDetails?.identityValue?.id || this.identificationnumber) this.getAssessment();
        this.benefeciaryStatus = this.activeBenefitDetails.beneficiaryBenefitStatus?.english;
        if (this.benefitType === "Survivor's Pension" || this.benefitType === "Survivor's Pension(Missing Worker)") {
          this.heading = new BenefitDetailsHeading(this.activeBenefitDetails?.benefitType?.english).getHeading();
        }
        // this.setStopHoldPensionStatus(this.activeBenefitDetails);
        this.actionButtonDisabled = false;
        this.acitveBenefit = { ...this.acitveBenefit, benefitStartDate: res?.benefitStartDate };
        this.coreBenefitService.setActiveBenefit(this.acitveBenefit);
        this.personId = this.activeBenefitDetails?.personId;
        this.getAdjustmentDetails(this.sin, this.benefitRequestId, false);
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  getBenefitHistoryDetails(sin: number, benefitRequestId: number) {
    this.dependentService.getBenefitHistory(sin, benefitRequestId).subscribe(
      res => {
        this.benefitHistoryDetails = res[0];
        // this.heirDetails = this.populateHeirDetailsTableData(this.heirDetails, this.benefitHistoryDetails);
        // else {
        //   if (this.benefitHistoryDetails?.beneficiaryBenefitStatus?.english === this.statusEnums.WAIVED)
        //     this.pensionStatus[this.statusEnums.WAIVED]++;
        //   else if (this.benefitHistoryDetails?.beneficiaryBenefitStatus?.english === this.statusEnums.ON_HOLD)
        //     this.pensionStatus[this.statusEnums.ON_HOLD]++;
        //   else if (this.benefitHistoryDetails?.beneficiaryBenefitStatus?.english === this.statusEnums.STOPPED)
        //     this.pensionStatus[this.statusEnums.STOPPED]++;
        // }
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  // populateHeirDetailsTableData(heirDetails: DependentDetails[], benefitHistoryDetails: BenefitDetails) {
  //   if (heirDetails && benefitHistoryDetails) {
  //     heirDetails.forEach(heir => {
  //       if (heir?.identity) {
  //         const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(heir.identity);
  //         benefitHistoryDetails.heirBenefitDetails.forEach(heirBenefit => {
  //           if (heir.identity && heir.identity.length > 0) {
  //             if (idObj.id === heirBenefit.identifier) {
  //               heir.lastPaidDate = heirBenefit.lastPaidDate;
  //               heir.benefitAmount = heirBenefit.benefitAmount;
  //             }
  //           }
  //         });
  //       }
  //     });
  //   }
  //   return heirDetails;
  // }

  /**
   * Dependents/ Heirs status available
   * @param lists
   */
  setAvailableStatus(lists: DependentDetails[]) {
    this.actionButtonDisabled = false;
    if (lists && lists?.length) {
      lists.forEach(eachItem => {
        this.dependentHeirStatusCount[eachItem.eligibilityStatus?.english]++;
      });
    }
  }

  getHeirBenefitHistoryDetails(sin: number, benefitRequestId: number) {
    this.paramId = {
      sin: sin,
      benefitRequestId: benefitRequestId,
      transactionTraceId: this.referenceNo
    };
    this.heirService.getHeirBenefitHistory(sin, benefitRequestId).subscribe(
      res => {
        this.heirHistoryDetails = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  calculateBenefit(sin: number, benefitRequestId: number) {
    this.manageBenefitService.getBenefitCalculationDetailsByRequestId(sin, benefitRequestId).subscribe(
      res => {
        this.benefitCalculation = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  /** Populate heir dropdown list */
  populateHeirDropDownValues(heirDetails: HeirBenefitList[]) {
    const list: Lov[] = [];
    heirDetails.forEach((heir, index) => {
      const nameInEnglish = heir.name.english;
      const nameInArabic = heir.name.arabic;
      list.push({
        value: {
          english: nameInEnglish,
          arabic: nameInArabic
        },
        code: heir.personId,
        sequence: index
      });
      this.heirList.next(new LovList(list));
    });
  }

  /** ********************* Heir Filter Related Functions ***************************** */

  filterHeirHistory(heirHistoryFilter: DependentHistoryFilter) {
    this.heirService.filterHeirHistory(this.sin, this.benefitRequestId, heirHistoryFilter).subscribe(
      res => {
        this.heirHistoryDetails = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  /** ********************************* */

  navigateToHeirDetails(personId) {
    const activeHeirDetail = {
      personId: personId,
      sin: this.sin,
      benefitRequestId: this.benefitRequestId,
      benefitType: this.benefitType
    };
    this.heirActiveService.setActiveHeirDetails(activeHeirDetail);
    this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_DETAILS]);
  }

  viewContributorDetails() {
    if (!this.isIndividualApp) {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }

  navigateToModifyHeir() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], { queryParams: { isHeir: true } });
  }

  //new functions
  modifyBenefit() {
    this.router.navigate([RouterConstants.ROUTE_MODIFY_BENEFIT_PAYMENT]);
  }

  setStatusValues() {
    let status;
    status = [
      HeirStatusType.ACTIVE,
      HeirStatusType.ON_HOLD,
      HeirStatusType.REPAY_LUMPSUM,
      HeirStatusType.INITIATED,
      HeirStatusType.REJECTED,
      HeirStatusType.INACTIVE,
      HeirStatusType.WAIVED
    ];
    return status;
  }

  startBenefitWaive() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
      queryParams: { actionType: HeirStatus.START_WAIVE, isHeir: this.isHeir }
    });
  }

  stopBenefitWaive() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
      queryParams: { actionType: HeirStatus.STOP_WAIVE, isHeir: this.isHeir }
    });
  }

  navigateToModify() {
    // this.modifyPensionService.setAnnuityDetails(this.activeBenefitDetails);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], { queryParams: { isHeir: this.isHeir } });
  }

  holdHeirDependent() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
      queryParams: { actionType: HeirStatus.HOLD, isHeir: this.isHeir }
    });
  }

  restartHeirDependent() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
      queryParams: { actionType: HeirStatus.RESTART, isHeir: this.isHeir }
    });
  }

  makeDirectPayment() {
    this.directPaymentService.getHeirListForDirectPayment(this.sin, this.referenceNo).subscribe(
      res => {
        if (res?.heirs?.length > 0 && this.isEnableDirectPymnt) {
          this.router.navigate([BenefitConstants.ROUTE_HEIR_DIRECT_PAYMENT]);
        }
      },
      err => {
        if (err.status === 422) {
          this.alertService.showError(err.error.details[0].message);
        }
        // this.showErrorMessage(err);
      }
    );
  }

  stopHeirDependent() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
      queryParams: { actionType: HeirStatus.STOP, isHeir: this.isHeir }
    });
  }

  /** this fn will be automatically executed when user leave/redirect from the page */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }

  getDateFormat(lang) {
    return formatDate(lang);
  }

  /** this method is to show other benefits and wage details */
  showBenefitWageDetails(templateRef: TemplateRef<HTMLElement>, benefitWageDetail: EachHeirDetail) {
    this.benefitWageDetail = benefitWageDetail;
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }

  /** this method is to show other benefits and wage details */
  showDisabilityPopup(templateRef: TemplateRef<HTMLElement>, disabilityDetails: EachHeirDetail) {
    this.bypassReaassessmentService.getDisabilityDetails(this.sin, this.benefitRequestId).subscribe(
      res => {
        res?.assessmentDetails?.forEach(eachAssessment => {
          if (eachAssessment.personId === disabilityDetails?.heirDetails?.personId) {
            this.disabilityDetails = res?.assessmentDetails;
          }
        });
      },
      err => {
        this.showErrorMessage(err);
      }
    );
    // this.injuryService.getInjuryDetails().subscribe(res => {
    //   this.disabilityDetails = [];
    //   this.disabilityDetails.push(res);
    // });
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }

  closePopup() {
    this.modalRef.hide();
  }

  navigateToProfile(sin: number) {
    const url = '#' + BenefitConstants.ROUTE_BENEFIT_LIST(null, sin);
    window.open(url, '_blank');
  }

  routeBack() {
    if (!this.newTab) {
      this.location.back();
    } else {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)]);
    }
  }
  confirmrescheduleInvitation() {
    this.alertService.clearAlerts();
    this.finalCancelreschedule();
    this.assessmentService.acceptAssessmentRescheduleInvite(this.sessionnumber, this.invitenumber).subscribe(
      res => {
        this.responseConfirm = res;
        this.alertService.showSuccess(res);
        this.getAssessment();
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  navigateToAddHeirAdjustment() {
    if (this.adjustmentEligibility) {
      this.adjustmentService.identifier = this.activeBenefitDetails.personId;
      this.adjustmentService.socialNumber = this.sin;
      this.adjustmentService.benefitRequestNumber = this.benefitRequestId;
      this.router.navigate(['/home/adjustment/heir-adjustment']);
    } else {
      this.showEligibilityPopup();
    }
  }
  hideAcceptreschedule() {
    if (this.modalRef) this.modalRef.hide();
  }
  getOfficeLists() {
    this.fieldOfficeList$ = this.lookupService.getFieldOfficeList().pipe(
      map((lovList: LovList) => {
        if (lovList) {
          lovList.items.forEach(item => {
            item.value.arabic = item.value.arabic.trim();
            item.value.english = item.value.english.trim();
          });
          return lovList;
        }
      })
    );
  }
  BindAssessmentTime(value: LovStatus) {
    if (this.isAppPrivate) {
      //console.log(value);
      this.assessmentSlotSequence = value.sequence;
      this.assessmentSession = value.code;
      this.sessionnumber = value.code;
      this.virtual = value.channel;
      const status = value?.status;
      if (status.english === 'Hold' || status.arabic === 'معلق') {
        this.onHold = true;
      } else {
        this.onHold = false;
      }
    } else {
      //console.log(value);
      this.assessmentSlotSequence = value.sequence;
      this.assessmentSession = value.code;
      this.sessionnumber = value.code;
      this.virtual = value.channel;
    }
  }
  getLocation(value: BilingualText) {
    //console.log(value);

    this.sessionRequest.filter.fieldOffice = [];
    this.sessionRequest.filter.fieldOffice.push(value);
    // this.sessionFilter.specialty=[{english: 'Anesthesia', arabic: 'التخدير'
    // }]
    // this.sessionRequest.filter = this.sessionFilter;
  }
  onEventChange(value: Date) {
    //console.log(value);
    this.fullyFilled = false;
    this.unavailableArray.forEach(item => {
      if (convertToYYYYMMDD(item.toString()) === convertToYYYYMMDD(value.toString())) {
        this.fullyFilled = true;
      }
    });
    // this.sessionFilter.listOfDoctorType = [{ english: 'Visiting Doctor', arabic: '' }];
    if (value) {
      this.passedDate = convertToYYYYMMDD(value.toString());
      this.getIndividualSessionDetails(this.passedDate, this.sessionRequest);
    }
  }
  onLocationListModified(value: BilingualText) {
    this.sessionRequest.filter.fieldOffice = [];
    this.sessionRequest.filter.fieldOffice.push(value);
    this.selectedMonth = moment(new Date()).toDate().getMonth() + 1;
    this.selectedYear = moment(new Date()).toDate().getFullYear();
    this.getCurrentMonthDetails(this.selectedMonth, this.selectedYear, this.sessionRequest);
  }
  onDateChange(value: Date) {
    this.selectedMonth = value.getMonth() + 1;
    this.selectedYear = value.getFullYear();
    this.getCurrentMonthDetails(this.selectedMonth, this.selectedYear, this.sessionRequest);
  }
  getDisabiltyAssessmentDetails(mbAssessmentRequestId: number) {
    this.medicalBoardService.getDisabilityDetails(this.identificationnumber, mbAssessmentRequestId).subscribe(
      res => {
        this.disabilityDetailsMedical = res;
        this.disabilityDetailsMedical.specialtyList.forEach(items => {
          this.sessionRequest.filter.specialty.push(items.specialty);
          items.subSpecialty.forEach(res => {
            this.sessionRequest.filter.subSpecialty.push({
              english: res.english,
              arabic: res.arabic
            });
          });
        });
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }
  getCurrentMonthDetails(currentMonth: number, currentYear: number, sessionRequest?: SessionRequest) {
    this.sessionCalendarService.getRescheduleSessionDetails(currentMonth, currentYear, sessionRequest).subscribe(
      res => {
        this.sessionCalendar = res;

        this.availableArray = [];
        this.unavailableArray = [];

        if (!this.sessionCalendar?.sessionForLocSpecEndDate || !this.sessionCalendar?.sessionForLocSpecStartDate) {
          this.noSessionscalendar = true;
          this.minDate = new Date();
          this.maxDate = new Date();
          this.noSessions = true;
        } else if (moment(new Date(this.sessionCalendar?.sessionForLocSpecEndDate.gregorian)).diff(new Date()) < 0)
          this.minDate = new Date();
        else if (moment(new Date()).month() + 1 - currentMonth == 0)
          this.minDate = moment(this.sessionCalendar?.sessionForLocSpecStartDate.gregorian).toDate();
        this.maxDate = moment(this.sessionCalendar?.sessionForLocSpecEndDate.gregorian).toDate();
        if (this.sessionCalendar?.sessionForLocSpecEndDate || this.sessionCalendar?.sessionForLocSpecStartDate) {
          this.noSessionscalendar = false;
        }

        //console.log(this.availableArray);

        if (this.sessionCalendar.sessionDetails) {
          //console.log(this.sessionCalendar.sessionDetails);

          this.sessionCalendar?.sessionDetails?.forEach(item => {
            if (item.isSlotsAvailable == true && item.dateString >= this.selectedDate) {
              const date = new Date(item.dateString);

              this.availableArray.push(date);
            } else {
              if (item.dateString >= this.selectedDate) {
                const date = new Date(item.dateString);
                this.unavailableArray.push(date);
              }
            }
          });
          this.noSessions = false;
          if (this.availableArray.length === 0 && this.unavailableArray.length === 0) {
            this.noSessions = true;
          }
        }
        //console.log(this.availableArray);

        this.totalSessions = res.totalCount;
        this.participantsInQueue = res.participantsInQueue;
        this.eventDetails = new Array(this.sessionCalendar?.sessionDetails?.length);
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }
  getIndividualSessionDetails(selectedDate: string, sessionRequest?: SessionRequest) {
    this.sessionCalendarService.getRescheduleDateSessionDetails(selectedDate, sessionRequest).subscribe(
      res => {
        this.individualSessionEvents = res;
        this.isNoSessions = false;
        if (this.individualSessionEvents?.length === 0) this.isNoSessions = true;
        if (!this.fullyFilled) {
          this.isDisabled = false;
          this.sessionTimeList = new LovList([]);
          const sessionTimeList = new LovList([]);
          const lovarr: LovStatus[] = [];
          this.individualSessionEvents.forEach((item, index) => {
            this.setList = true;
            if (item.maximumBeneficiaries !== item.noOfParticipants) {
              item.sessionSlotDetails.forEach((res, j) => {
                if (res.isSlotsFilled) {
                  const arabicchannel = item.channel.arabic;
                  const englishchannel = item.channel.english;
                  const sessionTime = res.slotTime.english;
                  const arTime = sessionTime.split('-');
                  if (arTime[0].indexOf('AM') >= 0) {
                    {
                      arTime[0] = arTime[0].replace('AM', '');
                      arTime[0] = arTime[0] + 'م';
                    }
                  } else if (arTime[0].indexOf('PM') >= 0) {
                    {
                      arTime[0] = arTime[0].replace('PM', '');
                      arTime[0] = arTime[0] + 'ص';
                    }
                  }
                  if (arTime[1].indexOf('AM') >= 1) {
                    {
                      arTime[1] = arTime[1].replace('AM', '');
                      arTime[1] = arTime[1] + 'م';
                    }
                  } else if (arTime[1].indexOf('PM') >= 1) {
                    {
                      arTime[1] = arTime[1].replace('PM', '');
                      arTime[1] = arTime[1] + 'ص';
                    }
                  }
                  const arabicTime = arTime[0] + '-' + arTime[1];
                  // this.sessionTimeList.push(sessionTime);
                  lovarr.forEach(item => {
                    if (sessionTime === item.value.english) {
                      this.setList = false;
                    }
                  });
                  if (this.setList) {
                    {
                      lovarr.push({
                        sequence: res.slotSequence,
                        value: { english: sessionTime, arabic: arabicTime },
                        code: item.sessionId,
                        status: item?.status,
                        channel: { english: arabicchannel, arabic: englishchannel }
                      });
                    }
                  }
                  sessionTimeList.items = lovarr;
                }
              });
            } else {
              const arabicchannel = item.channel.arabic;
              const englishchannel = item.channel.english;
              const sessionTime = item.sessionSlotDetails[0].slotTime.english;
              const arTime = sessionTime.split('-');
              if (arTime[0].indexOf('AM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('AM', '');
                  arTime[0] = arTime[0] + 'م';
                }
              } else if (arTime[0].indexOf('PM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('PM', '');
                  arTime[0] = arTime[0] + 'ص';
                }
              }
              if (arTime[1].indexOf('AM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('AM', '');
                  arTime[1] = arTime[1] + 'م';
                }
              } else if (arTime[1].indexOf('PM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('PM', '');
                  arTime[1] = arTime[1] + 'ص';
                }
              }
              const arabicTime = arTime[0] + '-' + arTime[1];
              // this.sessionTimeList.push(sessionTime);
              lovarr.forEach(item => {
                if (sessionTime === item.value.english) {
                  this.setList = false;
                }
              });
              if (this.setList) {
                {
                  lovarr.push({
                    sequence: item.sessionSlotDetails[0].slotSequence,
                    value: { english: sessionTime, arabic: arabicTime },
                    code: item.sessionId,
                    status: item?.status,
                    channel: { english: arabicchannel, arabic: englishchannel }
                  });
                }
              }
              sessionTimeList.items = lovarr;
            }
          });
          this.sessionTimeList = sessionTimeList;
          // console.log(this.sessionTimeList);
        } else {
          {
            this.sessionTimeList = new LovList([]);
            const sessionTimeList = new LovList([]);
            const lovarr: LovStatus[] = [];
            this.individualSessionEvents.forEach((item, index) => {
              const arabicchannel = item.channel.arabic;
              const englishchannel = item.channel.english;
              const sessionTime = item.sessionSlotDetails[0]?.slotTime.english;
              const arTime = sessionTime.split('-');
              if (arTime[0].indexOf('AM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('AM', '');
                  arTime[0] = arTime[0] + 'م';
                }
              } else if (arTime[0].indexOf('PM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('PM', '');
                  arTime[0] = arTime[0] + 'ص';
                }
              }
              if (arTime[1].indexOf('AM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('AM', '');
                  arTime[1] = arTime[1] + 'م';
                }
              } else if (arTime[1].indexOf('PM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('PM', '');
                  arTime[1] = arTime[1] + 'ص';
                }
              }
              const arabicTime = arTime[0] + '-' + arTime[1];

              lovarr.push({
                sequence: item.sessionSlotDetails[0].slotSequence,
                value: { english: sessionTime, arabic: arabicTime },
                code: item.sessionId,
                status: item?.status,
                channel: { english: arabicchannel, arabic: englishchannel }
              });
              sessionTimeList.items = lovarr;
            });
            this.sessionTimeList = sessionTimeList;
            // console.log(this.sessionTimeList);
            if (this.fullyFilled) {
              this.isDisabled = true;
            } else {
              this.isDisabled = false;
            }
          }
        }
      },
      err => {
        this.isNoSessions = true;
        this.alertService.showError(err.error?.message);
      }
    );
    this.isMonthchanged = false;
  }
  onNavigateDisabilityAssessment(assessment: InjuryDetails) {
    this.coreAdjustmentService.socialNumber = this.sin;
    this.coreBenefitService.injuryId = this.benefitRequestId;
    this.coreAdjustmentService.identifier = +assessment?.identifier;
    // this.coreBenefitService.assessmentRequestId = assessment?.assessmentId;
    this.coreBenefitService.mbAssessmentId = assessment?.assessmentId;
    this.coreBenefitService.nationalId = assessment?.personId;
    this.coreBenefitService.disabilityType = assessment?.disabilityType;
    this.coreBenefitService.assessmentType = this.disabilityDetailsMedical?.disabilityType;
    this.coreBenefitService.isBenefitRoute = true;
    this.coreBenefitService.setPersonIdReqId({ benefitId: this.benefitRequestId, personId: assessment?.personId });
    this.router.navigate([BenefitConstants.ROUTE_MB_DISABILITY_ASSESSMENT]);
    this.modalRef.hide();
  }
  showreschedule(eventData: any): void {
    const temp = eventData.temp;
    const assessmentreschedule = eventData.medicalAssessmentreschedule;
    this.assessment = assessmentreschedule;
    this.alertService.clearAlerts();
    this.noSessions = false;
    this.onHold = false;
    this.noSessionscalendar = false;
    this.modalRef = this.modalService.show(temp, assessmentreschedule);
  }
  showModalReschedule(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  hiderescheduleModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  finalCancelreschedule() {
    if (this.modalRef) this.modalRef.hide();
  }
  raiseTicket() {}
}
