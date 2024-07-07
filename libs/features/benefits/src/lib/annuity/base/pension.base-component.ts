import { OnInit, Directive, Inject, OnDestroy } from '@angular/core';
import {
  ModifyBenefitService,
  HeirBenefitService,
  DependentService,
  ReturnLumpsumService,
  ManageBenefitService,
  BenefitDocumentService,
  UiBenefitsService,
  InjuryService,
  BenefitActionsService,
  BypassReassessmentService,
  BenefitPropertyService,
  AdjustmentService,
  SanedBenefitService
} from '../../shared/services';
import {
  CoreAdjustmentService,
  CoreContributorService,
  AlertService,
  DocumentService,
  ApplicationTypeToken,
  LanguageToken,
  LovList,
  DocumentItem,
  GosiCalendar,
  RouterData,
  RouterDataToken,
  RoleIdEnum,
  downloadFile,
  TransactionService as TransactionRoutingService,
  CoreBenefitService,
  CoreActiveBenefits,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  RouterConstants,
  IdentityTypeEnum,
  Transaction,
  TransactionStatus,
  formatDate,
  ApplicationTypeEnum,
  AuthTokenService,
  BenefitsGosiShowRolesConstants,
  MenuService,
  MedicalAssessmentService,
  LookupService,
  MedicalboardAssessmentService
} from '@gosi-ui/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { BenefitType, HeirStatusType, AdjustmentStatus, BenefitStatus } from '../../shared/enum';
import {
  AnnuityResponseDto,
  PaymentDetail,
  DependentDetails,
  HeirBenefitList,
  BenefitDetails,
  HeirBenefitDetails,
  DependentTransaction,
  HeirBenefitFilter,
  HeirHistoryRequest,
  TransactionHistoryDetails,
  TransactionsDetails,
  AdjustmentDetailsDto,
  AdjustmentDetails,
  Benefits,
  InjuryDetails,
  BenefitResponse,
  HeirStatus,
  DependentHistoryFilter,
  TransactionHistoryFilter,
  ActiveBenefits,
  SubmitRequest,
  showErrorMessage
} from '../../shared';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { BenefitConstants, EventsConstants, RecalculationConstants } from '../../shared/constants';
import { getIdentityLabel } from '../../shared/utils';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { MedicalBoardService, SessionCalendarService } from '@gosi-ui/features/medical-board';

@Directive()
export abstract class PensionBaseComponent implements OnInit, OnDestroy {
  activeAdjustmentsExist = false;
  BenefitType = BenefitType;
  documentList: DocumentItem[] = [];
  acitveBenefit: CoreActiveBenefits;
  activeBenefitDetails: AnnuityResponseDto;
  benefitPaymentDetails: PaymentDetail;
  benefitRequestId: number;
  referenceNo: number;
  sin: number;
  dependentDetails: DependentDetails[];
  heirDetails: DependentDetails[];
  benefit: string;
  heirHistoryDetails: HeirBenefitList[] = [];
  heirBenefitDetails: HeirBenefitDetails;
  disabilityDetails: InjuryDetails[];
  benefitResponse: BenefitResponse;
  benefitType: string;
  benefeciaryStatus: string;
  lang = 'en';
  commonModalRef: BsModalRef;
  isModifyEligible: boolean;
  isSmallScreen: boolean;
  isAppPrivate = false;
  heading: string;
  benefitDetails: BenefitDetails;
  isSaned: boolean;
  isHeir: boolean;
  isImprisonment: boolean;
  isLumpsum: boolean;
  dependentHistory: DependentTransaction[];
  imprisonmentDetails: AnnuityResponseDto;
  paymentEventsList$: Observable<LovList>;
  paymentStatusList$: Observable<LovList>;
  transactionStatusList$: Observable<LovList>;
  dependentEventsList$: Observable<LovList>;
  heirFilter: HeirBenefitFilter = new HeirBenefitFilter();
  heirRequest: HeirHistoryRequest = <HeirHistoryRequest>{};
  heirList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(null);
  scannedDocuments: DocumentItem[];
  status: string[] = [];
  statusEnums = HeirStatusType;
  pensionStatus = {
    [HeirStatusType.ACTIVE]: 0,
    [HeirStatusType.ON_HOLD]: 0,
    [HeirStatusType.STOPPED]: 0,
    [HeirStatusType.WAIVED]: 0,
    [HeirStatusType.INACTIVE]: 0
  };

  dependentHeirStatusCount = {
    [HeirStatusType.ACTIVE]: 0,
    [HeirStatusType.ONHOLD]: 0,
    [HeirStatusType.STOPPED]: 0,
    [HeirStatusType.WAIVED]: 0,
    [HeirStatusType.INACTIVE]: 0
  };
  noAccessRoles = [
    RoleIdEnum.CLM_MGR,
    RoleIdEnum.MC_OFFICER,
    RoleIdEnum.ROLE_DOCTOR,
    RoleIdEnum.GCC_ADMIN,
    RoleIdEnum.BRANCH_ADMIN,
    RoleIdEnum.REG_ADMIN,
    RoleIdEnum.CNT_ADMIN,
    RoleIdEnum.OH_ADMIN,
    RoleIdEnum.GD_MS_OS,
    RoleIdEnum.VIOLATION_COMMITTEE_HEAD,
    RoleIdEnum.VIOLATION_COMMITTEE_MEMBER,
    RoleIdEnum.WORK_INJURIES_OCUPATIONAL_DISEASES_DOCTOR,
    RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST,
    RoleIdEnum.COMPLAINT_CLERK
  ];
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
  ifTransactionHistory = false;
  assessmentId: number;
  transactionHistoryDetails: TransactionHistoryDetails;
  transactions: TransactionsDetails[];
  noSearchResult = false;
  noFilterResult = false;
  statuses: Observable<LovList>;
  systemParameter: SystemParameter;
  systemRunDate: GosiCalendar;
  adjustmentDetailsData: AdjustmentDetailsDto;
  adjustmentDetails: AdjustmentDetails[];
  annuitybenefits: Benefits[] = [];
  addCommitmentDocs: DocumentItem;
  isIndividualApp: boolean;
  returnLumpsumAccess = BenefitsGosiShowRolesConstants.VIEW_DETAILS;
  restoreLumpsumAccess = BenefitsGosiShowRolesConstants.CREATE_PRIVATE;
  retirementForm: FormGroup;
  modifyBenefitInProgress = false;
  restartInProgress = false;

  constructor(
    readonly sanedBenefitService: SanedBenefitService,
    readonly medicalBoardService: MedicalBoardService,
    readonly lookupService: LookupService,
    readonly sessionCalendarService: SessionCalendarService,
    readonly modifyPensionService: ModifyBenefitService,
    public contributorService: CoreContributorService,
    public benefitActionsService: BenefitActionsService,
    readonly dependentService: DependentService,
    readonly heirService: HeirBenefitService,
    readonly router: Router,
    public route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly injuryService: InjuryService,
    readonly returnLumpsumService: ReturnLumpsumService,
    readonly heirBenefitService: HeirBenefitService,
    readonly manageBenefitService: ManageBenefitService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly documentService: DocumentService,
    readonly uiBenefitsService: UiBenefitsService,
    readonly bypassReaassessmentService: BypassReassessmentService,
    readonly assessmentService: MedicalAssessmentService,
    readonly location: Location,
    readonly modalService: BsModalService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly txnService: TransactionRoutingService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly benefitPropertyService: BenefitPropertyService,
    readonly paymentAdjustmentService: AdjustmentService,
    readonly authTokenService: AuthTokenService,
    readonly changePersonService: ChangePersonService,
    readonly menuService: MenuService,
    readonly medicaAssessmentService: MedicalboardAssessmentService
  ) {}

  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
  }
  getSystemParamAndRundate() {
    this.manageBenefitService.getSystemParams().subscribe(res => {
      this.systemParameter = new SystemParameter().fromJsonToObject(res);
    });
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
    });
  }
  navigateToModifyCommitment() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_COMMITMENT]);
    this.alertService.clearAllSuccessAlerts();
  }

  confirmAddCommitemnt() {
    this.router.navigate([BenefitConstants.ROUTE_ADD_COMMITMENT]);
    this.commonModalRef.hide();
  }
  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }
  removeCommitment() {
    this.router.navigate([BenefitConstants.ROUTE_REMOVE_COMMITMENT]);
  }
  viewCommitment() {}
  /**
   *
   * @param document
   */
  openImage() {
    this.benefitDocumentService.downloadAddCommitment(this.sin).subscribe(
      document => {
        downloadFile(EventsConstants.DOWNLOAD_FILE_NAME, 'application/pdf', document);
      },
      err => {
        this.commonModalRef.hide();
        this.showError(err);
      }
    );
  }
  getInjuryAssessment(sin: number, benefitRequestId: number) {
    this.injuryService.getDisabilityDetails(sin, benefitRequestId).subscribe(
      res => {
        this.disabilityDetails = res?.assessmentDetails;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  showError(error: HttpErrorResponse) {
    error.error.message
      ? this.alertService.showError(error.error.message)
      : error.status === 400
      ? this.alertService.showErrorByKey('BENEFITS.CERTIFICATE-ERROR')
      : this.alertService.showErrorByKey('BENEFITS.SORRY-AN-ERROR');
  }
  getDisabilityAssessment(sin: number, benefitRequestId: number) {
    this.bypassReaassessmentService.getDisabilityDetails(sin, benefitRequestId).subscribe(
      res => {
        this.disabilityDetails = res?.assessmentDetails;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  onAccept(assessmentId: number) {
    this.bypassReaassessmentService.accceptMedicalAssessment(this.sin, this.benefitRequestId, assessmentId).subscribe(
      res => {
        this.benefitResponse = res;
        this.router.navigate([BenefitConstants.ROUTE_ASSESSMENT_DISPLAY], {
          queryParams: {
            assessmentId: assessmentId
          }
        });
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  onAppeal(appealTimelineDto) {
    this.sanedBenefitService.setDisabilityAssessmentId(appealTimelineDto.assessmentId);
    this.sanedBenefitService.setSocialInsuranceNumber(this.sin);
    this.sanedBenefitService.setBenefitRequestId(this.benefitRequestId);
    this.sanedBenefitService.setNin(this.acitveBenefit?.nin);
    this.commonModalRef?.hide();
    this.router.navigate(['home/benefits/saned/appealAssessment']); // this.bypassReaassessmentService
    //   .appealMedicalAssessment(this.sin, this.benefitRequestId, appealTimelineDto?.assessmentId)
    //   .subscribe(
    //     res => {
    //       this.benefitResponse = res;
    //     },
    //     err => this.alertService.showError(err.error.message)
    //   );
    // if (!appealTimelineDto?.isAssessment) {
    //   window.open('https://gositest.gosi.ins/GOSIOnline/ContactUs_Request?userType=2001&requestType=2022&locale=en_US');
    // }
    //window.open('https://www.gosi.gov.sa/GOSIOnline/ContactUs_Request?userType=2001&requestType=2022&locale=en_US');
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
  // Method to fetch Annuity benefits
  getAnnuityBenefits(socialInsuranceNumber: number, benefitType: string) {
    this.manageBenefitService.getAnnuityBenefits(socialInsuranceNumber).subscribe(data => {
      this.annuitybenefits = data;
    });
  }
  holdHeirDependent() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
      queryParams: { actionType: HeirStatus.HOLD, isHeir: this.isHeir }
    });
  }
  holdBenefit() {
    this.router.navigate([BenefitConstants.ROUTE_HOLD_BENEFIT], {
      queryParams: { actionType: HeirStatus.HOLD, isHeir: this.isHeir }
    });
  }
  restartHeirDependent() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
      queryParams: { actionType: HeirStatus.RESTART, isHeir: this.isHeir }
    });
  }
  restartBenefit() {
    this.router.navigate([BenefitConstants.ROUTE_RESTART_PENSION]);
  }
  stopHeirDependent() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
      queryParams: { actionType: HeirStatus.STOP, isHeir: this.isHeir }
    });
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
  stopBenefit() {
    this.router.navigate([BenefitConstants.ROUTE_STOP_BENEFIT]);
  }
  modifyBenefit() {
    this.router.navigate([RouterConstants.ROUTE_MODIFY_BENEFIT_PAYMENT]);
  }
  suspendSanedBenefit() {
    this.router.navigate([BenefitConstants.ROUTE_SANED_SUSPEND_BENEFIT], {
      queryParams: { sin: this.sin, benefitRequestId: this.benefitRequestId }
    });
  }
  //Method to search a transaction from transaction history table
  onSearchTransactionId(transactionHistoryFilter: TransactionHistoryFilter) {
    if (this.benefitType === BenefitType.ui) {
      this.uiBenefitsService
        .filterTransactionHistory(this.sin, this.benefitRequestId, transactionHistoryFilter)
        .subscribe(
          res => {
            this.transactionHistoryDetails = res;
            this.transactions = this.transactionHistoryDetails.transactions;
          },
          err => {
            this.showErrorMessage(err);
          }
        );
    } else {
      this.benefitPropertyService
        .filterTransactionHistory(this.sin, this.benefitRequestId, transactionHistoryFilter)
        .subscribe(
          res => {
            this.transactionHistoryDetails = res;
            this.transactions = this.transactionHistoryDetails.transactions;
          },
          err => {
            this.showErrorMessage(err);
          }
        );
    }
  }
  // Fetch transactionHistoryDetails
  getTransactionHistoryDetails(sin: number, benefitRequestId: number) {
    this.benefitPropertyService.getTransactionHistoryDetails(sin, benefitRequestId).subscribe(
      res => {
        this.transactionHistoryDetails = res;
        if(this.benefitType === BenefitType.retirementPension){
          this.modifyBenefitInProgress = this.transactionHistoryDetails.transactions.filter(item=>{
              return item.transactionType.english.toLowerCase().includes('add/modify') && item.status.english === BenefitStatus.INPROGRESS
                          }).length > 0;
          this.restartInProgress = this.transactionHistoryDetails?.transactions.filter(item=>{
              return item?.transactionType?.english.toLowerCase().includes('restart benefit') && item?.status?.english === BenefitStatus.INPROGRESS
                          }).length > 0;
        }
        this.transactions = this.transactionHistoryDetails.transactions;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  // Fetch transactionHistoryDetails
  getUiTransactionHistoryDetails(sin: number, benefitRequestId: number) {
    this.uiBenefitsService.getUiTransactionHistoryDetails(sin, benefitRequestId).subscribe(
      res => {
        this.transactionHistoryDetails = res;
        this.transactions = this.transactionHistoryDetails.transactions;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  transactionHistoryFilter(transactionHistoryFilter: TransactionHistoryFilter) {
    if (this.benefitType === BenefitType.ui) {
      this.uiBenefitsService
        .filterTransactionHistory(this.sin, this.benefitRequestId, transactionHistoryFilter)
        .subscribe(
          res => {
            this.transactionHistoryDetails = res;
            this.transactions = this.transactionHistoryDetails.transactions;
          },
          err => {
            this.showErrorMessage(err);
          }
        );
    } else {
      this.benefitPropertyService
        .filterTransactionHistory(this.sin, this.benefitRequestId, transactionHistoryFilter)
        .subscribe(
          res => {
            this.transactionHistoryDetails = res;
            this.transactions = this.transactionHistoryDetails.transactions;
          },
          err => {
            this.showErrorMessage(err);
          }
        );
    }
  }
  filterDependentHistory(dependentHistoryFilter: DependentHistoryFilter) {
    this.dependentService.filterDependentHistory(this.sin, this.benefitRequestId, dependentHistoryFilter).subscribe(
      res => {
        this.dependentHistory = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  // Fetch transactionHistoryDetails
  getAdjustmentDetails(sin: number, benefitRequestId: number) {
    this.benefitPropertyService.getAdjustmentDetails(sin, benefitRequestId).subscribe(
      (res: AdjustmentDetailsDto) => {
        this.adjustmentDetailsData = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  /** Method to set Active Adjustment */
  setActiveAdjustments(sin) {
    this.paymentAdjustmentService
      .getAdjustmentsByDualStatus(
        this.contributorService.personId || this.activeBenefitDetails?.personId,
        RecalculationConstants.ACTIVE,
        RecalculationConstants.NEW,
        sin
      )
      .subscribe(adjustmentDetail => {
        if (adjustmentDetail && adjustmentDetail.adjustments && adjustmentDetail.adjustments.length)
          this.activeAdjustmentsExist = true;
      });
  }
  // adjustment details for saned benefits
  getUiAdjustmentDetails(sin: number, benefitRequestId: number) {
    this.uiBenefitsService.getUiAdjustmentDetails(sin, benefitRequestId).subscribe(
      res => {
        this.adjustmentDetailsData = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  getFilteredAdjustment(adjustments) {
    return adjustments.filter(
      adjustment =>
        adjustment?.adjustmentStatus?.english === AdjustmentStatus.NEW ||
        adjustment?.adjustmentStatus?.english === AdjustmentStatus.ACTIVE ||
        adjustment?.adjustmentStatus?.english === AdjustmentStatus.ON_HOLD
    );
  }

  clearAllAlerts() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
  /** Method to handle c;aring alerts before component destroyal . */
  ngOnDestroy() {
    this.clearAllAlerts();
  }
  navigateToAddModify() {
    this.adjustmentService.type = null;
    this.adjustmentService.identifier = this.activeBenefitDetails?.personId || this.contributorService.personId;
    this.router.navigate(['/home/adjustment/add-modify']);
  }
  navigateToAddAdjustment() {
    this.adjustmentService.type = null;
    this.adjustmentService.identifier = this.contributorService.personId || this.activeBenefitDetails?.personId;
    this.router.navigate(['/home/adjustment/create']);
  }
  /** this function will redirect you to the restore lumpsum page*/
  navigateToRestoreLumpsum() {
    this.router.navigate([BenefitConstants.ROUTE_RESTORE_LUMPSUM_BENEFIT]);
  }
  /** this function will redirect you to the return lumpsum page*/
  navigateToReturnLumpsum() {
    this.router.navigate([BenefitConstants.ROUTE_RETURN_LUMPSUM_BENEFIT]);
  }
  goToTransaction(transaction: Transaction) {
    // param is TransactionDetails
    if (transaction.status.english.toUpperCase() !== TransactionStatus.DRAFT.toUpperCase()) {
      this.txnService.navigate(transaction);
    }
  }
  navigateToAdjustment(adjustmentId: number) {
    this.adjustmentService.identifier = this.contributorService.personId || this.activeBenefitDetails?.personId;
    this.router.navigate(['/home/adjustment/benefit-adjustment'], {
      queryParams: {
        adjustmentId: adjustmentId
      }
    });
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  navigateToInjurypage() {
    this.coreBenefitService.setActiveBenefit(this.acitveBenefit);
    this.router.navigate([BenefitConstants.ROUTE_INJURY_DETAILS]);
  }
}
