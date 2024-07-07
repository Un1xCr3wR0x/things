import { Component, OnInit, TemplateRef, HostListener, OnDestroy, SimpleChanges } from '@angular/core';
import {
  DependentDetails,
  BenefitType,
  BenefitDetails,
  HeirBenefitFilter,
  HeirLimit,
  HeirSort,
  HeirStatus,
  HeirStatusType,
  BenefitDetailsHeading,
  PaymentHistoryFilter,
  DependentHistoryFilter,
  DependentSetValues,
  BenefitConstants,
  isHeirBenefit,
  RecalculationConstants,
  AdjustmentPopupDcComponent,
  HeirBenefitList,
  PaymentHistoryDetails,
  ActiveBenefits,
  PersonAdjustmentDetails,
  isLumpsumBenefit,
  EligibilityWarningPopupDcComponent,
  SimisBenefit,
  MainframeBenefit,
  EachHeirDetail,
  PersonalInformation,
  getIdentityLabel,
  UIHistoryDto,
  createDetailForm,
  InjuryDetails,
  AssessmentDetails,
  SimisSanedPaymentHistory,
  PensionReformEligibility
} from '../../shared';
import {
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  Lov,
  LovList,
  ApplicationTypeEnum,
  RoleIdEnum,
  CoreActiveBenefits,
  Transaction,
  TransactionStatus,
  BilingualText,
  BenefitsGosiShowRolesConstants,
  convertToYYYYMMDD,
  LovStatus,
  getIdentityByType,
  DisabilityDetails,
  MedicalAssessment,
  MbAllowance
} from '@gosi-ui/core';
import { PensionBaseComponent } from '../base/pension.base-component';
import { of, forkJoin, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import {
  EventDetails,
  IndividualSessionEvents,
  SessionCalendar,
  SessionRequest
} from '@gosi-ui/features/medical-board';
import moment from 'moment';

@Component({
  selector: 'bnt-pension-active-sc',
  templateUrl: './pension-active-sc.component.html',
  styleUrls: ['./pension-active-sc.component.scss']
})
export class PensionActiveScComponent extends PensionBaseComponent implements OnInit, OnDestroy {
  actionButtonDisabled = true;
  benefitHistoryDetails: BenefitDetails;
  identityValue: DependentDetails[];
  // benefitsGosiShowRolesConstants = BenefitsGosiShowRolesConstants;
  accessForActionPrivate = BenefitsGosiShowRolesConstants.CREATE_PRIVATE;
  accessForActionPublic = BenefitsGosiShowRolesConstants.CREATE_INDIVIDUAL;
  // accessForActionPublic = [RoleIdEnum.SUBSCRIBER];
  eligibleForDependentComponent = false;
  activeAdjustmentsExist = false;
  isIndividualApp: boolean;
  benefitCalculation: BenefitDetails;
  adjustmentEligibility = false;
  isFromJailed = false;
  newTab: boolean;
  paymentAdjustmentDetails: PersonAdjustmentDetails;
  adjustmentEligibilityWarningList: BilingualText[];
  simisPaymentHistory$: Observable<Array<SimisBenefit>>;
  mainframePaymentHistory$: Observable<Array<MainframeBenefit>>;
  simisSanedPaymentHistory$: Observable<SimisSanedPaymentHistory>;
  personDetails: PersonalInformation;
  sanedHistory: UIHistoryDto;
  isDependent = false;
  currentTab = 0;
  isImprisonEdit = false;
  isPersonWithoutId = false;
  responseConfirm: BilingualText;
  assessment: MedicalAssessment[];
  modalRef: BsModalRef;
  //reschedule
  identificationnumber: number;
  identifier: number;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  nin: number;
  virtual: BilingualText = new BilingualText();
  onHold: boolean;
  noSessionscalendar: boolean;
  fieldOfficeList$: Observable<LovList>;
  parentForm: FormGroup = new FormGroup({});
  disabilityDetailsMedical: DisabilityDetails;
  availableArray: Date[] = [];
  locationamb: BilingualText = new BilingualText();
  unavailableArray: Date[] = [];
  sessionCalendar: SessionCalendar = new SessionCalendar();
  selectedDate: string;
  noSessions: boolean;
  totalSessions: number;
  invitenumber: number;
  sessionnumber: number;
  participantsInQueue: number;
  eventDetails: EventDetails[] = [];
  fullyFilled = false;
  passedDate: string;
  sessionRequest: SessionRequest = new SessionRequest();
  setList: boolean;
  sessionTimeList: LovList;
  individualSessionEvents: IndividualSessionEvents[] = [];
  isNoSessions = true;
  isAppPrivate = false;
  isDisabled: boolean;
  isMonthchanged = false;
  selectedMonth: number;
  region$: Observable<LovList>;
  selectedYear: number;
  minDate: Date;
  maxDate: Date;
  assessmentSlotSequence: number;
  assessmentSession: number;
  personalIdentifier: number;
  mbAllowanceDto: MbAllowance = new MbAllowance();

  eligibleForPensionReform: boolean;

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  ngOnInit(): void {
    this.initialiseView();
    this.region$ = this.lookupService.getRegionsList();
    this.selectedDate = convertToYYYYMMDD(moment(new Date()).toDate().toString());
    if (this.benefitPropertyService.getActiveSuccessMessage()) {
      this.alertService.showSuccess(this.benefitPropertyService.getActiveSuccessMessage());
    }
  }
  initialiseView() {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.nin = this.authTokenService.getIndividual();
    this.isImprisonEdit = this.menuService.isUserEntitled(BenefitsGosiShowRolesConstants.VIEW_DETAILS);
    this.routerData.selectWizard = null;
    this.eligibleForDependentComponent = true;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    // fetching selected language
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.route.queryParams.subscribe(params => {
      this.newTab = Boolean(params.newTab);
      this.isFromJailed = params?.fromJailed === 'true';
      this.isDependent = params?.manageDependent === 'true';
      this.getDepTab();
      if (this.newTab) {
        this.acitveBenefit = new ActiveBenefits(
          Number(params.sin),
          Number(params.benReqId),
          { english: params.benefitType, arabic: null },
          null
        );
        this.sin = this.getSin(this.acitveBenefit);
        this.loadData();
      } else if (params?.benefitRequestId) {
        this.sin = this.getSin(this.acitveBenefit);
        this.dependentService.getBenefitHistory(this.sin, params?.benefitRequestId).subscribe(
          res => {
            this.acitveBenefit = res[0];
            this.loadData();
          },
          err => {
            this.showErrorMessage(err);
          }
        );
      } else {
        this.acitveBenefit = this.coreBenefitService.getSavedActiveBenefit();
        this.sin = this.getSin(this.acitveBenefit);
        this.loadData();
      }
    });
  }

  loadData() {
    // accessing the active Benefit details which set which user click on active benefits carousel
    // this.acitveBenefit = this.coreBenefitService.getSavedActiveBenefit();
    this.setStatusValues();
    if (!this.newTab) this.acitveBenefit = this.coreBenefitService.getSavedActiveBenefit();
    if (this.acitveBenefit) {
      // this.sin = this.acitveBenefit.sin;
      this.adjustmentService.socialNumber = this.sin;
      this.benefitRequestId = this.acitveBenefit.benefitRequestId;
      this.benefitType = this.acitveBenefit.benefitType.english;
      this.status = this.setStatusValues(isHeirBenefit(this.benefitType));
      this.referenceNo = null;
      // BenefitDetailsHeading commented as per defect 463830
      this.heading = new BenefitDetailsHeading(this.benefitType).getHeading();
      this.benefit = 'BENEFITS.PENSION';
      // this.getBenefitCalculationByType(this.sin, this.benefitType);
      if (this.benefitType === BenefitType.ui) {
        this.getUiBenefitDetails(this.sin, this.benefitRequestId, this.referenceNo);
      } else {
        this.getActiveBenefitDetails(this.sin, this.benefitRequestId, this.referenceNo);
        if (this.benefitType === BenefitType.retirementPension) {
          // disable restart benefit if modify benfit is in progress
          this.onTransactionTabSelected();
        }
      }

      if (isHeirBenefit(this.benefitType)) {
        //getBenefitHistoryDetails called in getHeirDetails function
        this.getHeirDetails(this.sin, this.benefitRequestId, this.referenceNo, this.status);
        this.getHeirBenefitHistoryDetails(this.sin, this.benefitRequestId);
        this.isHeir = true;
        this.isSaned = false;
      } else if (this.benefitType === BenefitType.ui) {
        //if (!this.isIndividualApp) {
        this.getUiAdjustmentDetails(this.sin, this.benefitRequestId);
        //}
        this.getUiPaymentDetails(this.sin, this.benefitRequestId);
        this.paymentEventsList$ = this.manageBenefitService.getPaymentFilterEventType();
        this.paymentStatusList$ = this.manageBenefitService.getPaymentFilterStatusType();
        this.isHeir = false;
        this.isSaned = true;
      } else {
        this.getSystemParamAndRundate();
        this.getDisabilityAssessment(this.sin, this.benefitRequestId);
        this.getPaymentDetails(this.sin, this.benefitRequestId);
        this.getBenefitHistoryDetails(this.sin, this.benefitRequestId);
        //if (!this.isIndividualApp) {
        this.getAdjustmentDetails(this.sin, this.benefitRequestId);
        //}
        // this.getBeneficiaryAdjustments();
        this.paymentEventsList$ = this.manageBenefitService.getPaymentFilterEventType();
        this.paymentStatusList$ = this.manageBenefitService.getPaymentFilterStatusType();
        this.isHeir = false;
        this.isSaned = false;
      }
      if (!this.isSaned) {
        this.getBenefitCalculationDetails(this.sin, this.benefitRequestId);
      } else {
        this.getUiBenefitcalculation(this.sin, this.benefitRequestId);
      }
      if (isLumpsumBenefit(this.benefitType)) {
        //Todo: use function
        this.isLumpsum = true;
      }
      if (
        this.benefitType === BenefitType.jailedContributorPension ||
        this.benefitType === BenefitType.jailedContributorLumpsum
      ) {
        this.isImprisonment = false;
        this.getImprisonment(this.sin, this.benefitRequestId, this.referenceNo);
      } else {
        this.isImprisonment = false;
      }
    }
    this.getScreenSize();
  }

  get individualAppAccess() {
    return [RoleIdEnum.SUBSCRIBER, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY];
  }

  getSin(acitveBenefit: CoreActiveBenefits) {
    let nin = null;
    if (this.isIndividualApp) {
      nin = this.authTokenService.getIndividual();
    } else {
      this.changePersonService.getSocialInsuranceNo().subscribe(res => {
        // will work only if the user visited overview page
        nin = res;
      });
    }
    return nin ? nin : acitveBenefit?.sin ? acitveBenefit?.sin : null;
  }

  getDepTab() {
    if (this.isDependent) {
      this.currentTab = 1;
    }
  }
  getAdjustmentEligibility() {
    this.uiBenefitsService.getAdjustmentEligiblity(this.getIdentifier(), this.sin).subscribe(eligibleData => {
      this.adjustmentEligibility = eligibleData.eligible;
      this.adjustmentEligibilityWarningList = eligibleData.gosiAdjustmentErrorMessages;
    });
  }
  setStatusValues(isHeir = false) {
    let status;
    if (isHeir) {
      status = [
        HeirStatusType.ACTIVE,
        HeirStatusType.ONHOLD,
        HeirStatusType.REPAY_LUMPSUM,
        HeirStatusType.INITIATED,
        HeirStatusType.REJECTED,
        HeirStatusType.INACTIVE,
        HeirStatusType.WAIVED
      ];
    } else {
      status = [
        HeirStatusType.ACTIVE,
        HeirStatusType.INACTIVE,
        HeirStatusType.ONHOLD,
        HeirStatusType.STOPPED,
        HeirStatusType.WAIVED
      ];
    }
    return status;
  }
  // Fetch active benefit Details
  getActiveBenefitDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.manageBenefitService.getAnnuityBenefitRequestDetail(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.activeBenefitDetails = res;
        this.personalIdentifier = this.activeBenefitDetails?.personId;
        this.eligibleForPensionReform = this.activeBenefitDetails.pensionReformEligibility?.english === PensionReformEligibility.Eligible;
        this.isPersonWithoutId = this.activeBenefitDetails.personWithoutIdentifier ? true : false;
        if (!this.activeBenefitDetails?.nin && this.activeBenefitDetails?.identity) {
          this.activeBenefitDetails.identityValue = checkIqamaOrBorderOrPassport(this.activeBenefitDetails?.identity);
        }
        this.benefeciaryStatus = this.activeBenefitDetails.beneficiaryBenefitStatus?.english;
        this.actionButtonDisabled = false;
        if (this.activeBenefitDetails?.deathDatePresent) this.modifyPensionService.setIsDead(true);
        this.acitveBenefit.benefitStartDate = res.benefitStartDate;
        this.coreBenefitService.setActiveBenefit(this.acitveBenefit);
        this.getPerson(this.activeBenefitDetails?.personId);
        if (!this.isIndividualApp) {
          this.getBeneficiaryAdjustments();
          this.getAdjustmentEligibility();
          this.setActiveAdjustments(this.sin);
        }
        this.eligibleForDependentComponent = res.eligibleForDependentComponent === false ? false : true;
        this.simisPaymentHistory$ = this.manageBenefitService.getSimisPaymentHistory(
          sin,
          benefitRequestId,
          this.activeBenefitDetails.personId
        );
        this.mainframePaymentHistory$ = this.manageBenefitService.getMainframePaymentHistory(sin, benefitRequestId);
        this.simisSanedPaymentHistory$ = this.uiBenefitsService.getSimisSanedPaymentHistory(sin, benefitRequestId);
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  getPerson(personId: number) {
    this.manageBenefitService.getPersonDetailsWithPersonId(personId.toString()).subscribe(personalDetails => {
      if (personalDetails) {
        this.personDetails = personalDetails;
        this.getNinIqamaGccId();
      }
    });
  }

  onNavigateDisabilityAssessment(assessment: InjuryDetails) {
    this.coreAdjustmentService.socialNumber = this.sin;
    this.coreBenefitService.injuryId = this.benefitRequestId;
    this.coreAdjustmentService.identifier = +assessment?.identifier;
    // this.coreBenefitService.assessmentRequestId = assessment?.assessmentId;
    this.coreBenefitService.mbAssessmentId = assessment?.assessmentId;
    this.coreBenefitService.nationalId = assessment?.personId;
    this.coreBenefitService.disabilityType = assessment?.disabilityType;
    this.coreBenefitService.assessmentType =this.disabilityDetailsMedical?.disabilityType;
    this.coreBenefitService.isBenefitRoute = true;
    this.coreBenefitService.setPersonIdReqId({ benefitId: this.benefitRequestId, personId: assessment?.personId });
    this.router.navigate([BenefitConstants.ROUTE_MB_DISABILITY_ASSESSMENT]);
  }
  /** Method to get Assessment Details */

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
  /** Method to fetch benefit calculation details  */
  getBenefitCalculationDetails(sin: number, benefitRequestId: number) {
    if (sin && benefitRequestId) {
      this.manageBenefitService
        .getBenefitCalculationDetailsByRequestId(sin, benefitRequestId)
        .subscribe(calculation => {
          this.benefitCalculation = calculation;
        });
    }
  }
  getUiBenefitcalculation(sin: number, benefitRequestId: number) {
    if (sin && benefitRequestId) {
      this.manageBenefitService.getUiCalculationDetailsByRequestId(sin, benefitRequestId).subscribe(
        calculation => {
          this.benefitCalculation = calculation;
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    }
  }
  // Fetch active benefit Details
  getUiBenefitDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.uiBenefitsService.getUiBenefitRequestDetail(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.activeBenefitDetails = res;
        if (!this.activeBenefitDetails?.nin && this.activeBenefitDetails?.identity) {
          this.activeBenefitDetails.identityValue = checkIqamaOrBorderOrPassport(this.activeBenefitDetails?.identity);
        }
        this.actionButtonDisabled = false;
        if (this.activeBenefitDetails?.deathDatePresent) this.modifyPensionService.setIsDead(true);
        this.acitveBenefit.benefitStartDate = res.benefitStartDate;
        this.coreBenefitService.setActiveBenefit(this.acitveBenefit);
        if (!this.isIndividualApp) {
          this.getPerson(this.activeBenefitDetails?.personId);
          this.getAdjustmentEligibility();
          this.setActiveAdjustments(this.sin);
          this.simisPaymentHistory$ = this.manageBenefitService.getSimisPaymentHistory(
            sin,
            benefitRequestId,
            this.activeBenefitDetails.personId
          );
          this.mainframePaymentHistory$ = this.manageBenefitService.getMainframePaymentHistory(sin, benefitRequestId);
          this.simisSanedPaymentHistory$ = this.uiBenefitsService.getSimisSanedPaymentHistory(sin, benefitRequestId);
        }
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  /**
   *
   * @param sin
   * @param benefitRequestId
   * @param referenceNo
   */
  getDependentDetails(sin: number, benefitRequestId: number, referenceNo: number, status: string[]) {
    if(sin){
      this.dependentService.getDependentDetailsById(sin, benefitRequestId.toString(), referenceNo, status).subscribe(
        res => {
          this.dependentDetails = res;
          this.dependentDetails?.forEach(item => {
            if (item?.identity) {
              item.dependentIdentifier = checkIqamaOrBorderOrPassport(item.identity);
            }
          });
          this.setAvailableStatus(this.dependentDetails);
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    }
  }

  // fetch heir details
  getHeirDetails(sin: number, benefitRequestId: number, referenceNo: number, status: string[]) {
    this.heirService.getHeirById(sin, benefitRequestId.toString(), referenceNo, this.benefitType, status).subscribe(
      res => {
        this.heirDetails = res;
        for (const item of res) {
          this.isModifyEligible = item?.modifyPayeeEligible;
          if (this.isModifyEligible === true) break;
        }
        this.setAvailableStatus(this.heirDetails);
        this.getBenefitHistoryDetails(this.sin, this.benefitRequestId, true);
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  /** Method to fetch payment details **/
  getPaymentDetails(sin: number, benefitRequestId: number) {
    this.manageBenefitService.getPaymentDetails(sin, benefitRequestId).subscribe(res => {
      this.benefitPaymentDetails = res;
      if (this.benefitPaymentDetails) this.getPaymentHistoryDocs(this.benefitPaymentDetails.history);
    });
  }
  /** Method to fetch payment details **/
  getUiPaymentDetails(sin: number, benefitRequestId: number) {
    this.uiBenefitsService.getUiPaymentDetails(sin, benefitRequestId).subscribe(res => {
      this.benefitPaymentDetails = res;
      if (this.benefitPaymentDetails) this.getPaymentHistoryDocs(this.benefitPaymentDetails.history);
    });
  }
  navigateToAdjustmentDetails() {
    this.adjustmentService.identifier =
      this.benefitPaymentDetails?.benefitDetails?.personId || this.activeBenefitDetails?.personId;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: RecalculationConstants.PENSION_ACTIVE }
    });
  }
  /**
   * Dependents/ Heirs status available
   * @param lists
   */
  setAvailableStatus(lists: DependentDetails[]) {
    this.actionButtonDisabled = false;
    if (lists && lists?.length) {
      lists.forEach(eachItem => {
        this.dependentHeirStatusCount[eachItem.status?.english]++;
      });
    }
  }
  /**
   * Dependents/ Heirs status available
   * @param lists
   */
  // setStopHoldPensionStatus(lists: AnnuityResponseDto) {
  //   this.actionButtonDisabled = false;
  //   if (lists) {
  //     this.pensionStatus[lists.status?.english]++;
  //     this.pensionStatus[lists.beneficiaryBenefitStatus?.english]++;
  //   }
  // }
  // fetch heir history
  getHeirBenefitHistoryDetails(sin: number, benefitRequestId: number) {
    this.heirService.getBenefitLists(sin, benefitRequestId).subscribe(
      res => {
        this.heirHistoryDetails = res;
        this.populateHeirDropDownValues(this.heirHistoryDetails);
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  // fetch heir history
  filterHeirBenefitHistoryDetails() {
    this.heirService.filterHeirBenefitByDetail(this.sin, this.benefitRequestId, this.heirFilter).subscribe(
      res => {
        this.heirHistoryDetails = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  // Method to fetch Imprisonment Details
  getImprisonment(sin: number, benefitRequestId: number, referenceNo: number) {
    this.manageBenefitService.getAnnuityBenefitRequestDetail(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.imprisonmentDetails = res;
        this.isImprisonment = false;
        if (this.imprisonmentDetails?.imprisonmentPeriod) {
          this.isImprisonment = this.imprisonmentDetails?.imprisonmentPeriod?.isEditable;
        }
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  getBenefitHistoryDetails(sin: number, benefitRequestId: number, isHeir = false) {
    this.dependentService.getBenefitHistory(sin, benefitRequestId).subscribe(
      res => {
        this.benefitHistoryDetails = res[0];
        if (isHeir) {
          this.heirDetails = this.populateHeirDetailsTableData(this.heirDetails, this.benefitHistoryDetails);
        }
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  // fetch dependent history
  getDependentHistoryDetails(sin: number, benefitRequestId: number) {
    this.dependentService.getDependentHistoryDetails(sin, benefitRequestId).subscribe(
      res => {
        this.dependentHistory = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  /** get scanned documents */
  getScannedDocument(benefitRequestId) {
    this.documentService.getAllDocuments(benefitRequestId).subscribe(
      res => {
        this.scannedDocuments = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  getPaymentHistoryDocs(paymentHistory: PaymentHistoryDetails[]) {
    paymentHistory.forEach(history => {
      if (history?.repaymentDetails?.documents) {
        of(history.repaymentDetails.documents)
          .pipe(
            switchMap(res => {
              return forkJoin(
                res.map(doc => {
                  return this.documentService.refreshDocument(doc, parseInt(doc.transactionId, 10));
                })
              ).pipe(catchError(error => of(error)));
            })
          )
          .subscribe(val => {
            history.repaymentDetails.scannedDocuments = val;
          });
      }
    });
  }

  /*This will navigated to imprisonment modify screen */
  navigateToModifyImprisonment() {
    this.modifyPensionService.setAnnuityDetails(this.imprisonmentDetails);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_IMPRISONMENT_DETAILS]);
  }

  navigateToAddDocuments() {
    this.router.navigate([BenefitConstants.ROUTE_ADD_DOCUMENTS]);
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

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err.error.details && err.error.details.length > 0) {
      this.alertService.showError(null, err.error.details);
    } else {
      this.alertService.showError(err.error.message);
    }
  }
  /** Method to fetch calculate details when benefit request id is available */
  getAnnuityCalculation(sin: number, benefitRequestId: number, referenceNo: number) {
    if (sin && benefitRequestId) {
      this.manageBenefitService
        .getBenefitCalculationDetailsByRequestId(sin, benefitRequestId, referenceNo)
        .subscribe(calculation => {
          this.benefitDetails = calculation;
        });
    }
  }
  /** This method getscalled when selecting the document tab */
  onDocumentTabSelected() {
    this.getScannedDocument(this.benefitRequestId);
  }
  /**  This method getscalled when selecting the dependent details tab */
  onDependentTabSelected() {
    this.getDependentDetails(this.sin, this.benefitRequestId, this.referenceNo, this.status);
    this.getDependentHistoryDetails(this.sin, this.benefitRequestId);
    this.dependentEventsList$ = this.dependentService.getDependentHistoryLOV();
  }
  /** This method getscalled when selecting the payment details tab */
  onPaymentHistoryTabSelected() {
    if (this.benefitType === BenefitType.ui) {
      this.getUiPaymentDetails(this.sin, this.benefitRequestId);
    } else {
      this.getPaymentDetails(this.sin, this.benefitRequestId);
    }
    this.paymentEventsList$ = this.manageBenefitService.getPaymentFilterEventType();
    this.paymentStatusList$ = this.manageBenefitService.getPaymentFilterStatusType();
  }
  /** This method getscalled when selecting the transaction details tab */
  onTransactionTabSelected() {
    if (this.benefitType === BenefitType.ui) {
      this.getUiTransactionHistoryDetails(this.sin, this.benefitRequestId);
    } else {
      this.getTransactionHistoryDetails(this.sin, this.benefitRequestId);
    }
    this.transactionStatusList$ = this.benefitPropertyService.getTransactionStatus();
  }
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
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }
  closePopup() {
    this.commonModalRef.hide();
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal1(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.commonModalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'lg'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
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
  hideModalAccept() {
    if (this.modalRef) this.modalRef.hide();
  }
  /*
   * This methid is to show Modal
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }
  showCommitment(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
    //this.getDocumentsForViewBank();
  }
  /** Route back to previous page */
  routeBack() {
    this.manageBenefitService.socialInsuranceNo = this.sin;
    /** navigating back to page it is navigated from **/
    if (!this.isFromJailed && !this.newTab) {
      this.location.back();
    } else {
      this.router.navigate([
        BenefitConstants.ROUTE_BENEFIT_LIST(
          this.manageBenefitService.registrationNo,
          this.manageBenefitService.socialInsuranceNo
        )
      ]);
    }
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.commonModalRef.hide();
  }
  hideassessmentModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  onDependentEntryCLick(selectedBenefit) {
    if (selectedBenefit) {
      const data = new DependentSetValues(
        selectedBenefit?.identity[0]?.newNin,
        selectedBenefit?.name,
        selectedBenefit?.personId,
        this.sin,
        this.benefitRequestId,
        this.benefitType,
        this.referenceNo
      );
      this.modifyPensionService.setDependentDetails(data);
      this.router.navigate([BenefitConstants.ROUTE_DEPENDENT_DETAILS]);
    }
  }

  showActionButton() {
    if (
      !this.isHeir &&
      !isLumpsumBenefit(this.benefitType) &&
      this.benefitType !== BenefitType.funeralGrant &&
      this.benefitType !== BenefitType.rpaBenefit &&
      this.benefitType !== BenefitType.nonSaudiLumpsum &&
      !this.isIndividualApp
    ) {
      return true;
    }
  }

  navigateToModify() {
    this.modifyPensionService.setAnnuityDetails(this.activeBenefitDetails);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], { queryParams: { isHeir: this.isHeir } });
  }

  populateHeirDetailsTableData(heirDetails: DependentDetails[], benefitHistoryDetails: BenefitDetails) {
    if (heirDetails && benefitHistoryDetails) {
      heirDetails.forEach(heir => {
        const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(heir.identity);
        benefitHistoryDetails.heirBenefitDetails.forEach(heirBenefit => {
          if (heir.identity && heir.identity.length > 0) {
            if (idObj.id === heirBenefit.identifier) {
              heir.lastPaidDate = heirBenefit.lastPaidDate;
              heir.benefitAmount = heirBenefit.benefitAmount;
            }
          }
        });
      });
    }
    return heirDetails;
  }

  filterTransactions(heirFilter?: HeirBenefitFilter) {
    this.heirFilter = heirFilter;
    this.defaultPagination();
    this.defaultSort();
    this.heirRequestSetter();
    this.filterHeirBenefitHistoryDetails();
  }
  /** Method to filter payment history */
  filterPaymentHistory(paymentHistoryFilter: PaymentHistoryFilter) {
    if (this.benefitType === BenefitType.ui) {
      this.uiBenefitsService.filterPaymentHistory(this.sin, this.benefitRequestId, paymentHistoryFilter).subscribe(
        res => {
          this.benefitPaymentDetails = res;
          if (this.benefitPaymentDetails) this.getPaymentHistoryDocs(this.benefitPaymentDetails.history);
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    } else {
      this.manageBenefitService.filterPaymentHistory(this.sin, this.benefitRequestId, paymentHistoryFilter).subscribe(
        res => {
          this.benefitPaymentDetails = res;
          if (this.benefitPaymentDetails) this.getPaymentHistoryDocs(this.benefitPaymentDetails.history);
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    }
  }

  /**
   *
   * Methods to set default Parameters
   */
  defaultPagination() {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.pageDetails = {
      currentPage: this.currentPage,
      goToPage: '1'
    };
  }

  defaultSort() {
    this.selectedOption = 'createdDate';
    this.isDescending = false;
  }

  /**
   * This method is to set the Transaction Request
   */
  heirRequestSetter(): void {
    this.heirRequest.page = new HeirLimit();
    this.heirRequest.page.pageNo = this.currentPage - 1;
    this.heirRequest.page.size = this.itemsPerPage;
    this.heirRequest.sort = new HeirSort();
    this.heirRequest.sort.column = this.selectedOption;
    this.heirRequest.sort.direction = this.isDescending;
    this.heirRequest.filter = new HeirBenefitFilter();
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
  viewAdjustmentModal(eachHistory) {
    this.commonModalRef = this.modalService.show(AdjustmentPopupDcComponent, Object.assign({}, { class: 'modal-lg' }));
    this.commonModalRef.content.paymentHistory = eachHistory;
    this.commonModalRef.content.close.subscribe(() => this.commonModalRef.hide());
    this.commonModalRef.content.onAdjustmentClicked.subscribe(adjustmentId => {
      this.commonModalRef.hide();
      this.navigateToAdjustment(adjustmentId);
    });
    this.commonModalRef.content.onBenefitTypeClicked.subscribe(benefitAdjustment => {
      this.commonModalRef.hide();
      this.navigateToBenefitDetails(benefitAdjustment);
    });
  }
  navigateToBenefitDetails(benefit) {
    this.adjustmentService.benefitType = benefit?.benefitType?.english;
    this.adjustmentService.benefitDetails = benefit;
    this.contributorService.personId = this.getIdentifier();
    this.coreBenefitService.setActiveBenefit(
      new CoreActiveBenefits(benefit?.sin, benefit?.benefitRequestId, benefit?.benefitType, null)
    );
    this.initialiseView();
  }
  getIdentifier() {
    return this.contributorService.personId || this.activeBenefitDetails?.personId;
  }
  getBeneficiaryAdjustments() {
    this.paymentAdjustmentService.adjustmentDetails(this.getIdentifier(), this.sin).subscribe(res => {
      this.paymentAdjustmentDetails = res;
    });
  }
  showEligibilityPopup() {
    this.commonModalRef = this.modalService.show(
      EligibilityWarningPopupDcComponent,
      Object.assign({}, { class: 'modal-md' })
    );
    this.commonModalRef.content.activeAdjustmentsExist = this.activeAdjustmentsExist;
    this.commonModalRef.content.gosiEligibilityWarningMsg = this.adjustmentService.mapMessagesToAlert({
      details: this.adjustmentEligibilityWarningList,
      message: null
    });
    this.commonModalRef.content.onModalCloseBtnClicked.subscribe(() => this.commonModalRef.hide());
  }

  checkIdentity(index: number) {
    if (this.heirDetails) {
      const value = checkIqamaOrBorderOrPassport(this.heirDetails[index]?.identity);
      return value?.id;
    }
  }
  checkIdentityLabel(index: number) {
    if (this.heirDetails) {
      const value = checkIqamaOrBorderOrPassport(this.heirDetails[index]?.identity);
      return getIdentityLabel(value);
    }
  }

  getIdLabel(value) {
    return getIdentityLabel(value);
  }

  loadSanedHistory() {
    this.uiBenefitsService.getSanedHistory(this.sin, this.benefitRequestId).subscribe(res => {
      this.sanedHistory = res;
    });
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.benefitPropertyService.setBenefitAppliedMessage(null);
    this.coreBenefitService.setBenefitAppliedMessage(null);
    this.benefitPropertyService.setActiveSuccessMessage(null);
    this.acitveBenefit = null;
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

        //(this.availableArray);

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
                const arabicchannel = item.channel.arabic;
                const englishchannel = item.channel.english;
                if (res.isSlotsFilled) {
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
  getNinIqamaGccId() {
    this.primaryIdentity =
      this.personDetails.identity != null
        ? getIdentityByType(this.personDetails.identity, this.personDetails.nationality.english)
        : null;
    this.identifier = this.primaryIdentity !== null ? this.primaryIdentity.id : this.sin;
    this.getAssessment();
  }
  getAssessment() {
    if ((this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE)) {
      this.identificationnumber = this.identifier;
    } else {
      this.identificationnumber = this.nin;
    }
    this.assessmentService.getAssessmentDetails(this.identificationnumber).subscribe(res => {
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
  raiseTicket() {}
  getAllowance(assessment: InjuryDetails) {
    this.medicaAssessmentService.getAllowanceDetails(this.identifier, assessment.mbAssessmentReqId).subscribe(
      res => {
        this.mbAllowanceDto = res;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
}
