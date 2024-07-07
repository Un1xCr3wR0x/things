/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  CalendarService,
  CoreContributorService,
  DocumentService,
  LanguageEnum,
  LanguageToken,
  LookupService,
  LovList,
  OccupationList,
  RouterData,
  RouterDataToken,
  StorageService,
  WorkflowService,
  convertToYYYYMMDD,
  downloadFile,
  isNIN,
  startOfMonth,
  subtractMonths
} from '@gosi-ui/core';
import { BillHistoryWrapper, UnBillAmount } from '@gosi-ui/features/collection/billing/lib/shared/models';
import {
  BillDashboardService,
  CreditManagementService,
  DetailedBillService
} from '@gosi-ui/features/collection/billing/lib/shared/services';
import { RpaSchemaTypes } from '@gosi-ui/features/contributor/lib/shared/enums/rpa-schema-types';
import { EmployerList } from '@gosi-ui/features/contributor/lib/shared/models/employer-list';
import { pensionReformEligibility } from '@gosi-ui/features/contributor/lib/shared/models/pr-eligibility';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { PersonConstants } from '@gosi-ui/features/customer-information/lib/shared/constants/person-constants';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ContributorBaseScComponent } from '../../../../shared/components';
import { ContributorConstants, ContributorRouteConstants } from '../../../../shared/constants';
import { ContributorActionEnum, EngagementType } from '../../../../shared/enums';
import {
  BillDetails,
  ContractParams,
  ContractWrapper,
  DropDownItems,
  EngagementDetails,
  EngagementFilter,
  RpaAggregationRequestAvailable,
  SearchEngagementResponse
} from '../../../../shared/models';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  RpaServices
} from '../../../../shared/services';

@Component({
  selector: 'cnt-unified-engagement-sc',
  templateUrl: './unified-engagement-sc.component.html',
  styleUrls: ['./unified-engagement-sc.component.scss']
})
export class UnifiedEngagementScComponent extends ContributorBaseScComponent implements OnInit, OnDestroy {
  /**Local variables */
  activeEngagements: EngagementDetails[];
  overallEngagements: EngagementDetails[];
  nin: number;
  isNin: boolean;
  isAbsherVerified: boolean;
  userRoles: string[];
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  paginationId = 'engagement-history'; // Pagination id
  itemsPerPage = 4;
  isCollapsed = true;
  isAdmin = false;
  billBalanceDetail: BillDetails;
  unBillAmount: UnBillAmount;
  isGccCountry: boolean;
  isBillNumber: boolean;
  monthSelectedDate: string;
  billDetails: BillDetails = new BillDetails();
  availableCreditBalance = 0;
  selectedValue: string;
  currentCurrency: string;
  exchangeRate = 1;
  currencyType = PersonConstants.CURRENCY_SAR;
  totalCreditBalance = 0;
  billNumber = 0;
  entityType = 'ESTABLISHMENT';
  isVic = false;
  idNumber: number;
  isIndividualProfile: string;
  firstStartDateHijiri: string;
  billHistory: BillHistoryWrapper = new BillHistoryWrapper();
  firstStartDate: Date;
  sinNumber: number;
  lang = 'en';
  unPaid = false;
  occupationList$: Observable<OccupationList>;
  employerList$: Observable<EmployerList>;
  showBillSummary: boolean;
  showRefundVicBtn: boolean;
  modalRef: BsModalRef;

  /** Constants */
  typeRegular = EngagementType.REGULAR;
  showAbsherTemplate: boolean;
  filterChecked: boolean;
  onlyNin: number;
  isPREligible = false;
  pensionReformEligibility: pensionReformEligibility;

  // RPA
  actionDropDown: DropDownItems[];
  dropDownList: Array<DropDownItems> = [];
  rpaSchemaType: RpaSchemaTypes = RpaSchemaTypes.GOSI_FIRST_SCHEMA;
  rpaAggregationRequestAvailable: RpaAggregationRequestAvailable;
  rpaDetails: SearchEngagementResponse;
  isActiveInGosi: boolean;
  isHavingInprogressTransaction: string;
  eligibility: boolean = true;
  // CAncel RPa
  cancelEngagment: SearchEngagementResponse;
  cancelReasonList: LovList;
  aggregationRequestID: number;
  flag: boolean = false;
  message: BilingualText;
  @ViewChild('cancelRpaAggregation') cancelRpaAggregationModal;

  /** Creates an instance of UnifiedEngagementScComponent. */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly establishmentService: EstablishmentService,
    readonly coreContributorService: CoreContributorService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly contractService: ContractAuthenticationService,
    readonly workflowService: WorkflowService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly lookupSerice: LookupService,
    readonly modalService: BsModalService,
    readonly manageWageService: ManageWageService,
    readonly authTokenService: AuthTokenService,
    readonly router: Router,
    readonly detailedBillService: DetailedBillService,
    readonly creditManagementService: CreditManagementService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly storageService: StorageService,
    readonly billDashboardService: BillDashboardService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly changePersonService: ChangePersonService,
    readonly activatedRoute: ActivatedRoute,
    readonly calendarService: CalendarService,
    readonly rpaService: RpaServices
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

  /** Metho to initialize the component. */
  ngOnInit(): void {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.flag = this.rpaService.flag;
    if (this.flag) this.message = this.rpaService.message;
    this.getOptionList();
    this.lookupSerice.getCancelRpaReasons().subscribe(res => {
      this.cancelReasonList = res;
    });

    let details = this.changePersonService.getPersonInformation();
    // this.personId = details.personId;
    this.socialInsuranceNo = this.coreContributorService.selectedSIN;
    this.nin = this.coreContributorService.nin;
    if (this.nin) this.isNin = isNIN(this.nin.toString());
    this.getUserRoles();
    this.isIndividualProfile = this.storageService.getLocalValue('individualProfile');
    if (this.isIndividualProfile) {
      this.activatedRoute.parent.parent.paramMap.subscribe(params => {
        if (params.get('personId') && (this.storageService.getSessionValue('idType') == 'NIN' || 'IQAMA')) {
          this.nin = Number(params.get('personId'));
        }
        if (params.get('personId') && this.storageService.getSessionValue('idType') == 'NIN') {
          this.onlyNin = Number(params.get('personId'));
        }
      });
      this.changePersonService.getSocialInsuranceNo().subscribe(res => {
        this.socialInsuranceNo = res;
        this.coreContributorService.selectedSIN = this.socialInsuranceNo;
        this.idNumber = this.nin;
        if (this.nin) this.isNin = isNIN(this.nin.toString());
        if (this.socialInsuranceNo) {
          this.getContributor();
          this.fetchEngagementDetails();
          this.getCancelRpaDetails();
          this.getRpaEngagementDetails();
        }
        this.checkPREligibility(); //comment #forDisable 
      });
      this.occupationList$ = this.lookupSerice.getAllOccupationList();
      this.employerList$ = this.contributorService.getContributorEmployersList(this.nin);
    }
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    if (!this.isIndividualProfile && this.socialInsuranceNo) {
      this.getContributor();
      this.fetchEngagementDetails();
    }
    //this.getVicBillBreakupDetails(this.personId);
  }
  /** Method to get user roles. */
  getUserRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    if (gosiscp) this.userRoles = gosiscp?.[0]?.role?.map(r => r.toString());
  }

  /** Method to get contributor details */
  getContributor() {
    this.contributorService
      .getContributorBySin(this.socialInsuranceNo) //, new Map().set('absherVerificationRequired', false)) #ProductionFix
      .subscribe(res => {
        this.contributor = res;
        // this.isVic=res.vicIndicator;
      });
  }

  /** Method to fetch engagements. */
  fetchEngagementDetails(): void {
    this.manageWageService.searchEngagement(this.socialInsuranceNo, this.nin).subscribe({
      next: res => {
        if (res) {
          if (res?.activeEngagements) {
            this.activeEngagements = res.activeEngagements;
            this.coreContributorService.unifiedRegNo = res?.activeEngagements?.[0]?.registrationNo;
          }

          //Engagement with cancellation reason as Transfer to another branch is not required in profile view.
          if (res?.overallEngagements) {
            res.overallEngagements.forEach(item => {
              item.engagementType === EngagementType.VIC && this.onlyNin
                ? this.getVicBillBreakupDetails(this.onlyNin)
                : null;
            });
            //If only vic engagements are present no need to get contracts
            res.overallEngagements.every(
              item => item => item.engagementType === EngagementType.VIC || item.ppaIndicator === true
            )
              ? (this.overallEngagements = res.overallEngagements)
              : this.getEngagementWithContract(res.overallEngagements).subscribe(
                  engagement =>
                    (this.overallEngagements = engagement.filter(
                      item =>
                        (item.cancellationReason &&
                          item.cancellationReason.english !== ContributorConstants.CANCEL_DUE_TO_TRANSFER_REASON) ||
                        !item.cancellationReason
                    ))
                );
          }
        }
      }
    });
  }

  /** Method to get engagement details with contract. */
  getEngagementWithContract(engagements: EngagementDetails[]) {
    return forkJoin(
      engagements
        .filter(
          item => item.engagementType === EngagementType.REGULAR || item.engagementType === EngagementType.PART_TIMER
        )
        .map(eng => {
          return this.contractService
            .getContracts(
              eng.registrationNo,
              this.socialInsuranceNo,
              new ContractParams(eng.engagementId, null, null, 4, 0)
            )
            .pipe(
              catchError(() => of(new ContractWrapper())),
              map(response => {
                eng.contracts = response['contracts'];
                return eng;
              })
            );
        })
    ).pipe(
      tap(res => {
        engagements.forEach(
          eng => (eng.contracts = res.find(item => item.engagementId === eng.engagementId)?.contracts)
        );
      }),
      map(() => engagements)
    );
  }

  /** This method is to navigate to transaction based on actions.  */
  navigateToSelectedOptions(selectedItems): void {
    if (selectedItems?.selectedValue === ContributorActionEnum.ADD_CONTRACT) {
      this.contributorService
        .getContributorBySin(this.socialInsuranceNo, new Map().set('absherVerificationRequired', false))
        .subscribe(
          res => {
            this.isAbsherVerified = ContributorConstants.ValidABSHERVerificationStatus.includes(
              res.person.absherVerificationStatus
            );
            if (!this.isAbsherVerified) {
              this.showAbsherTemplate = true;
            } else {
              this.handleSelectedOptions(selectedItems);
            }
          },
          err => this.alertService.showError(err?.error?.message)
        );
    } else {
      this.handleSelectedOptions(selectedItems);
    }
  }

  handleSelectedOptions(selectedItems) {
    if (this.overallEngagements[selectedItems.index].engagementType === EngagementType.VIC) {
      this.setParametersForVic(this.overallEngagements[selectedItems.index]);
      this.handleVicActions(selectedItems.selectedValue);
    } else {
      this.setParametersForNormalEngagement(this.overallEngagements[selectedItems.index]);
      this.handleNormalEngagementActions(selectedItems.selectedValue);
    }
  }

  /** Method to set parameters for Vic. */
  setParametersForVic(engagement: EngagementDetails): void {
    this.manageWageService.socialInsuranceNo = this.coreContributorService.selectedSIN;
    this.manageWageService.engagementId = engagement.engagementId;
  }

  /** Method to handle VIC actions. */
  handleVicActions(action: string): void {
    if (action === ContributorActionEnum.TERMINATE) {
      this.router.navigate([ContributorRouteConstants.ROUTE_VIC_TERMINATE]);
    } else if (action === ContributorActionEnum.CANCEL) {
      this.router.navigate([ContributorRouteConstants.ROUTE_VIC_CANCEL]);
    } else if (action === ContributorActionEnum.MODIFY) {
      this.router.navigate([ContributorRouteConstants.ROUTE_VIC_WAGE_UPDATE]);
    } else if (action === ContributorActionEnum.RE_ACTIVATE) {
      this.checkReactivateEligibility();
    }
  }

  /** Method to set parameters for normal contributor. */
  setParametersForNormalEngagement(engagement: EngagementDetails): void {
    this.manageWageService.unifiedProfileIndicator = true;
    this.manageWageService.registrationNo = engagement.registrationNo;
    this.manageWageService.socialInsuranceNo = this.coreContributorService.selectedSIN;
    this.manageWageService.engagementId = engagement.engagementId;
    this.manageWageService.isPpa = engagement?.ppaIndicator;
  }

  /** Method to handle normal engagement actions */
  handleNormalEngagementActions(action: string): void {
    switch (action) {
      case ContributorActionEnum.MODIFY:
        this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT]);
        break;
      case ContributorActionEnum.TERMINATE:
        this.router.navigate([ContributorRouteConstants.ROUTE_TERMINATE_CONTRIBUTOR]);
        break;
      case ContributorActionEnum.CANCEL:
        this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_ENGAGEMENT]);
        break;
      case ContributorActionEnum.TRANSFER:
        this.router.navigate([ContributorRouteConstants.ROUTE_TRANSFER_INDIVIDUAL_ENGAGEMENT]);
        break;
      case ContributorActionEnum.ADD_CONTRACT:
        this.router.navigate([ContributorRouteConstants.ROUTE_ADD_CONTRACT]);
        break;
      case ContributorActionEnum.CONTRACT_DETAILS:
        this.router.navigate([ContributorRouteConstants.ROUTE_VIEW_CONTRACT]);
        break;
      case ContributorActionEnum.RAISE_OBJECTION: // Raise Objection Only for PPA
        this.router.navigate([]);
        break;
      case ContributorActionEnum.RE_ACTIVATE:
        this.checkReactivateEngagementEligibility();
        break;
      case ContributorActionEnum.MODIFY_COVERAGE:
        this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT], {
          queryParams: {
            isModifyCoverage: true
          }
        });
      default:
        break;
    }
  }

  /** Method to check pension-reform-eligibility. */
  checkPREligibility() {
    if(this.isNin && this.isPrivate){ 
      this.contributorService.checkEligibilityNin(this.nin).subscribe(res => {
        this.pensionReformEligibility = res;
        if (res.pensionReformEligible === 'Not Eligible' || res.pensionReformEligible === 'Impacted') {
          this.isPREligible = false;
        } else {
          this.isPREligible = true;
        }
      });
    }
  }
  /** Method to navigate to current wage update screen for vic / normal contributor. */
  navigateToUpdateCurrentWage(index: number, fromCollapsed = false): void {
    index = fromCollapsed ? index + 1 : index;
    if (this.activeEngagements[index].engagementType === EngagementType.VIC) {
      this.setParametersForVic(this.activeEngagements[index]);
      this.router.navigate([ContributorRouteConstants.ROUTE_VIC_WAGE_UPDATE]);
    } else if (this.activeEngagements[index].engagementType === EngagementType.REGULAR) {
      this.setParametersForNormalEngagement(this.activeEngagements[index]);
      this.manageWageService.setCurrentEngagment = this.activeEngagements[index];
      if (this.isIndividualProfile) {
        const navigationExtras: NavigationExtras = { state: { page: 'individualProfile' } };
        this.router.navigate([ContributorRouteConstants.ROUTE_UPDATE_INDIVIDUAL_WAGE], navigationExtras);
      } else this.router.navigate([ContributorRouteConstants.ROUTE_UPDATE_INDIVIDUAL_WAGE]);
    } else if (
      this.activeEngagements[index].engagementType === EngagementType.PPA_REGULAR ||
      this.activeEngagements[index].engagementType === EngagementType.PPA_GCC ||
      this.activeEngagements[index].engagementType === EngagementType.MILITARY
    ) {
      this.manageWageService.setCurrentEngagment = this.activeEngagements[index];
      this.setParametersForPpa(this.activeEngagements[index]);
      this.router.navigate([ContributorRouteConstants.ROUTE_UPDATE_INDIVIDUAL_WAGE]);
    }
  }

  /** Method to paginate through engagements. */
  paginateEngagements(pageNumber: number) {
    if (this.pageDetails.currentPage !== pageNumber) this.pageDetails.currentPage = pageNumber;
  }

  /** Method to handle tasks on component destroy. */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
  //individual app
  //
  getVicBillBreakupDetails(idNo) {
    this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1)).toString());
    if (idNo) {
      this.alertService.clearAlerts();
      // this.sinNumber = idNo;
      this.isVic = true;
      this.billDashboardService.getBillNumber(idNo, this.monthSelectedDate, true).subscribe(res => {
        if (res) {
          this.billHistory = res;
          this.billNumber = res.bills[0].billNumber;
          this.isBillNumber = false;
          this.billDashboardService
            .getVicBillBreakup(this.onlyNin, this.billNumber)
            .subscribe((response: BillDetails) => {
              this.billDetails = response;
              this.showBillSummary = true;
            });
        }
      });
    }
  }
  navigateToBill() {
    this.router.navigate(['/home/billing/vic/dashboard'], {
      queryParams: {
        idNo: this.personId,
        monthSelected: this.monthSelectedDate,
        isDashboard: 'true'
      }
    });
  }

  navigateToRefund() {
    this.router.navigate(['/home/billing/credit-transfer/vic-refund-credit-balance/request'], {
      queryParams: {
        idNo: this.changePersonService.getSIN()
      }
    });
  }

  navgiateBack() {
    this.router.navigate(['/home/billing/vic/dashboard'], {
      queryParams: {
        idNo: this.idNumber,
        monthSelected: this.monthSelectedDate,
        isDashboard: 'false'
      }
    });
  }
  engagementFilterValues(filterParam?: EngagementFilter) {
    if (filterParam === null) this.fetchEngagementDetails();
    else {
      this.contributorService.getEngagementFilterDetails(this.nin, filterParam).subscribe(res => {
        this.overallEngagements = res.overallEngagements;
        this.filterChecked = true;
        res?.overallEngagements?.forEach(eng => {
          eng.engagementPeriod = eng.engagementPeriod.filter(engPeriod =>
            moment(engPeriod.startDate.gregorian).isSameOrBefore(new Date())
          );
        });
      });
      this.pageDetails.currentPage = 1;
    }
  }
  navigateToBillDashboard() {
    this.router.navigate(['/home/billing/vic/dashboard'], {
      queryParams: {
        idNo: this.nin,
        isDashboard: 'false'
      }
    });
  }
  calculateDebitAmount(res) {
    if (res === 0 && this.isIndividualProfile) this.unPaid = true;
  }
  onExcelEngagementsList() {
    let fileName: string = '';
    if (this.lang === LanguageEnum.ENGLISH) {
      fileName = ContributorConstants.DOWNLOAD_ALL_CONTRIBUTOR_ENGAGEMENT_FILE_NAME.english;
    } else {
      fileName = ContributorConstants.DOWNLOAD_ALL_CONTRIBUTOR_ENGAGEMENT_FILE_NAME.arabic;
    }
    this.contributorService
      .generateContributorEngagementExcelReport(this.socialInsuranceNo, this.lang)
      .subscribe(data => {
        downloadFile(fileName + '.xlsx', 'application/vnd.ms-excel', data);
      });
  }
  /** Method to set parameters for PPA engs. */
  setParametersForPpa(engagement: EngagementDetails): void {
    this.manageWageService.socialInsuranceNo = this.coreContributorService.selectedSIN;
    this.manageWageService.engagementId = engagement.engagementId;
    this.manageWageService.registrationNo = engagement.registrationNo;
  }

  checkReactivateEngagementEligibility() {
    this.manageWageService
      .reactivateEligibility(
        this.manageWageService.registrationNo,
        this.manageWageService.socialInsuranceNo,
        this.manageWageService.engagementId
      )
      .subscribe(
        res => {
          this.router.navigate([ContributorRouteConstants.ROUTE_REACTIVATE_ENGAGEMENT]);
        },
        err => this.alertService.showError(err?.error?.message, err?.error?.details)
      );
  }

  getRpaEngagementDetails() {
    this.contributorService.getEngagementFullDetails(this.socialInsuranceNo).subscribe(res => {
      this.rpaDetails = res;
      this.getOptionList();
      this.getCancelOptions();
    });
  }
  // Cancel RPA
  getCancelOptions() {
    if (this.cancelEngagment?.eligibleForCancelAggregation && this.rpaDetails?.aggregationRequestFSExist) {
      this.dropDownList.push(this.getDropDownItems('CONTRIBUTOR.CANCEL-RPA-FIRST-SCHEME', null, 'merge-arrows.svg'));
      if (this.isHavingInprogressTransaction) {
        this.dropDownList[0].disabled = true;
        this.dropDownList[0].toolTipParam = this.isHavingInprogressTransaction;
        this.dropDownList[0].toolTipValue = 'CONTRIBUTOR.RPA.LIVE-TRANSACTION';
      }
    } else if (this.cancelEngagment?.eligibleForCancelAggregation && this.rpaDetails?.aggregationRequestLSExist) {
      this.dropDownList.push(this.getDropDownItems('CONTRIBUTOR.CANCEL-RPA-LAST-SCHEME', null, 'merge-arrows.svg'));
      if (this.isHavingInprogressTransaction) {
        this.dropDownList[0].disabled = true;
        this.dropDownList[0].toolTipParam = this.isHavingInprogressTransaction;
        this.dropDownList[0].toolTipValue = 'CONTRIBUTOR.RPA.LIVE-TRANSACTION';
      }
    }
    // this.dropDownList.push(this.getDropDownItems('CONTRIBUTOR.CANCEL-RPA-FIRST-SCHEME', null, 'merge-arrows.svg'));
    // this.dropDownList.push(this.getDropDownItems('CONTRIBUTOR.CANCEL-RPA-LAST-SCHEME', null, 'merge-arrows.svg'));
  }
  getCancelRpaDetails() {
    this.rpaService.getEngagementFullDetailsCancelRpa(this.socialInsuranceNo, true).subscribe(res => {
      this.cancelEngagment = res;
      this.aggregationRequestID = this.cancelEngagment?.aggregationRequestId;
    });
  }

  submitCancel(value) {
    const payload = {
      identifier: this.socialInsuranceNo,
      rpaRequestId: this.cancelEngagment?.aggregationRequestId,
      cancellationReason: value,
      editFlow: false,
      cancellationRequestId: this.cancelEngagment?.cancellationRequestId
    };
    this.rpaService.submitCancellationReason(payload).subscribe(
      res => {
        this.alertService.showSuccess(res.message);
      },
      err => {
        this.alertService.showError(err?.error?.message);
      }
    );
  }

  // RPA
  getOptionList() {
    this.rpaAggregationRequestAvailable = new RpaAggregationRequestAvailable();
    this.rpaAggregationRequestAvailable.age = this.rpaDetails?.age;
    this.rpaAggregationRequestAvailable.aggregationRequestLSDate = this.rpaDetails?.aggregationRequestLSDate;
    this.rpaAggregationRequestAvailable.isAggregationRequestFSExist = this.rpaDetails?.aggregationRequestFSExist;
    this.rpaAggregationRequestAvailable.isActiveInPPA = this.rpaDetails?.activeInPPA;
    this.rpaAggregationRequestAvailable.isOverlapBetweenGosiAndPPA = this.rpaDetails?.overlapBetweenGosiAndPPA;
    this.rpaAggregationRequestAvailable.isAggregationRequestLSExist = this.rpaDetails?.aggregationRequestLSExist;
    this.rpaAggregationRequestAvailable.totalLumpSumsPaidDays = this.rpaDetails?.totalLumpSumsPaidDays;
    this.rpaAggregationRequestAvailable.totalLumpSumsPaidMonths = this.rpaDetails?.totalLumpSumsPaidMonths;
    this.rpaAggregationRequestAvailable.dataSourceCompletionStatus = this.rpaDetails?.dataSourceCompletionStatus != (null || undefined)? this.rpaDetails?.dataSourceCompletionStatus : false ;

    this.isActiveInGosi = this.rpaDetails?.activeEngagements[0]?.ppaIndicator === false;
    this.isHavingInprogressTransaction = this.rpaDetails?.isHavingInprogressTransaction;
    // Aggregate btn #forDisable rpa in case of disable
    if(this.nin && this.isNin && this.isPrivate ) this.rpaService.checkEligibility(this.nin).subscribe(
      res=>{
        if(res.pensionReformEligible == 'Eligible') this.eligibility = false;
    //     setTimeout(() => {       
          if (this.rpaAggregationRequestAvailable != null && this.eligibility) {
            if (!this.isRPAAggregateBtnHidden(this.rpaAggregationRequestAvailable)) {
              if(!(this.dropDownList.find(item=>item.key ===  'CONTRIBUTOR.ENTER-RPA-FIRST-SCHEME' )))
              {
                this.dropDownList.push(
                this.getDropDownItems(
                  'CONTRIBUTOR.ENTER-RPA-FIRST-SCHEME',
                  '',
                  'merge-arrows.svg',
                  this.isRPAAggregateBtnDisable(this.rpaAggregationRequestAvailable) != null,
                  this.isRPAAggregateBtnDisable(this.rpaAggregationRequestAvailable),
                  this.isHavingInprogressTransaction
                )
               );
              }
              if(!(this.dropDownList.find(item=>item.key === 'CONTRIBUTOR.ENTER-RPA-LAST-SCHEME')))
              {
              this.dropDownList.push(
                this.getDropDownItems(
                  'CONTRIBUTOR.ENTER-RPA-LAST-SCHEME',
                  '',
                  'merge-arrows.svg',
                  this.isRPAAggregateBtnDisablePPA(this.rpaAggregationRequestAvailable) != null,
                  this.isRPAAggregateBtnDisablePPA(this.rpaAggregationRequestAvailable),
                  this.isHavingInprogressTransaction
                )
              );
              }
            }
          }
        // }, 2000);
        
      }
    )
   

  }

/**
   * This function used to show/hide RPA aggregate button
   * @param rpaRequest
   * @return {boolean}
   */
  isRPAAggregateBtnHidden(rpaRequest: RpaAggregationRequestAvailable): boolean {
    return (
      rpaRequest.age > 59 ||
      rpaRequest.age < 18 ||
      rpaRequest.isAggregationRequestFSExist ||
      rpaRequest.totalLumpSumsPaidDays > 0 ||
      rpaRequest.totalLumpSumsPaidMonths > 0 ||
      rpaRequest.isAggregationRequestLSExist
    );
  }

  /**
   * This function used to disable RPA aggregate button
   * @param rpaRequest
   * @return {boolean}
   */
  isRPAAggregateBtnDisable(rpaRequest: RpaAggregationRequestAvailable): string | null {
    let totalContributionInMonth: number = this.getTotalContributionInMonth();
    if (rpaRequest.isOverlapBetweenGosiAndPPA) {
      return 'CONTRIBUTOR.RPA.OVERLAPPING-ENGAGEMENT';
    }
    // if (
    //   totalContributionInMonth < 12 &&
    //   this.isActiveInGosi &&
    //   !rpaRequest.isActiveInPPA &&
    //   this.isHavingInprogressTransaction
    // ) {
    //   return 'CONTRIBUTOR.RPA.LESS-THAN-ONE-YEAR-AND-GOSI-AND-PPA-LIVE-TRANSACTION';
    // }
    // if (
    //   totalContributionInMonth < 12 &&
    //   this.isActiveInGosi &&
    //   this.isHavingInprogressTransaction
    // ) {
    //   return 'CONTRIBUTOR.RPA.LESS-THAN-ONE-YEAR-NOT-ACTIVE-GOSI-LIVE-TRANSACTION';
    // }
    // if (
    //   totalContributionInMonth < 12 &&
    //   !rpaRequest.isActiveInPPA &&
    //   this.isHavingInprogressTransaction
    // ) {
    //   return 'CONTRIBUTOR.RPA.LESS-THAN-ONE-YEAR-NOT-ACTIVE-PPA-LIVE-TRANSACTION';
    // }
    // if (this.isActiveInGosi && !rpaRequest.isActiveInPPA && this.isHavingInprogressTransaction) {
    //   return 'CONTRIBUTOR.RPA.NOT-ACTIVE-IN-PPA-AND-GOSI-LIVE-TRANSACTION';
    // }
    // if (totalContributionInMonth < 12 && !rpaRequest.isActiveInPPA && this.isActiveInGosi) {
    //   return 'CONTRIBUTOR.RPA.LESS-THAN-ONE-YEAR-AND-GOSI-AND-PPA';
    // }
    // if (this.isActiveInGosi && !rpaRequest.isActiveInPPA) {
    //   return 'CONTRIBUTOR.RPA.NOT-ACTIVE-IN-PPA-AND-GOSI';
    // }
    // // if (this.isActiveInGosi && this.isHavingInprogressTransaction) {
    //   return 'CONTRIBUTOR.RPA.ACTIVE-IN-GOSI-LIVE-TRANSACTION';
    // }
    // if (!rpaRequest.isActiveInPPA && this.isHavingInprogressTransaction) {
    //   return 'CONTRIBUTOR.RPA.NOT-ACTIVE-IN-PPA-LIVE-TRANSACTION';
    // }
    if (!rpaRequest.isActiveInPPA) {
      return 'CONTRIBUTOR.NOT-ACTIVE-IN-PPA';
    }
    if (this.isActiveInGosi) {
      return 'CONTRIBUTOR.ACTIVE-IN-GOSI';
    }
    if (totalContributionInMonth < 12) {
      return 'CONTRIBUTOR.RPA.LESS-THAN-ONE-YEAR-GOSI'; 
    }
    if (this.isHavingInprogressTransaction) {
      return 'CONTRIBUTOR.RPA.LIVE-TRANSACTION';
    }
    return null;
  }

  /**
   * This function used to disable RPA aggregate button
   * @param rpaRequest
   * @return {boolean}
   */
     isRPAAggregateBtnDisablePPA(rpaRequest: RpaAggregationRequestAvailable): string | null {
      let totalContributionInMonth: number = this.rpaDetails?.totalPpaContributionMonth;
      if (rpaRequest.isOverlapBetweenGosiAndPPA) {
        return 'CONTRIBUTOR.RPA.OVERLAPPING-ENGAGEMENT';
      }
      // if (
      //   totalContributionInMonth < 12 &&
      //   this.isActiveInGosi &&
      //   !rpaRequest.isActiveInPPA &&
      //   this.isHavingInprogressTransaction
      // ) {
      //   return 'CONTRIBUTOR.RPA.LESS-THAN-ONE-YEAR-AND-GOSI-AND-PPA-LIVE-TRANSACTION';
      // }
      // if (
      //   totalContributionInMonth < 12 &&
      //   this.isActiveInGosi &&
      //   this.isHavingInprogressTransaction
      // ) {
      //   return 'CONTRIBUTOR.RPA.LESS-THAN-ONE-YEAR-NOT-ACTIVE-GOSI-LIVE-TRANSACTION';
      // }
      // if (
      //   totalContributionInMonth < 12 &&
      //   !rpaRequest.isActiveInPPA &&
      //   this.isHavingInprogressTransaction
      // ) {
      //   return 'CONTRIBUTOR.RPA.LESS-THAN-ONE-YEAR-NOT-ACTIVE-PPA-LIVE-TRANSACTION';
      // }
      // if (this.isActiveInGosi && !rpaRequest.isActiveInPPA && this.isHavingInprogressTransaction) {
      //   return 'CONTRIBUTOR.RPA.NOT-ACTIVE-IN-PPA-AND-GOSI-LIVE-TRANSACTION';
      // }
      // if (totalContributionInMonth < 12 && !rpaRequest.isActiveInPPA && this.isActiveInGosi) {
      //   return 'CONTRIBUTOR.RPA.LESS-THAN-ONE-YEAR-AND-GOSI-AND-PPA';
      // }
      // if (!this.isActiveInGosi && rpaRequest.isActiveInPPA) {
      //   return 'CONTRIBUTOR.RPA.NOT-ACTIVE-IN-GOSI-AND-PPA';
      // }
      // if (this.isActiveInGosi && this.isHavingInprogressTransaction) {
      //   return 'CONTRIBUTOR.RPA.ACTIVE-IN-GOSI-LIVE-TRANSACTION';
      // }
      // if (!rpaRequest.isActiveInPPA && this.isHavingInprogressTransaction) {
      //   return 'CONTRIBUTOR.RPA.NOT-ACTIVE-IN-PPA-LIVE-TRANSACTION';
      // }
      if (rpaRequest.dataSourceCompletionStatus? false :!this.isActiveInGosi) {
        return 'CONTRIBUTOR.NOT-ACTIVE-IN-GOSI';
      }
      if (rpaRequest.isActiveInPPA) {
        return 'CONTRIBUTOR.ACTIVE-IN-PPA';
      }
      if (totalContributionInMonth < 12) {
        return 'CONTRIBUTOR.RPA.LESS-THAN-ONE-YEAR-PPA'; 
      }
      if (this.isHavingInprogressTransaction) {
        return 'CONTRIBUTOR.RPA.LIVE-TRANSACTION';
      }
      return null;
    }



  /**
   * This function used to get total contribution in month
   * @return {number}
   */
  getTotalContributionInMonth(): number {
    return this.rpaDetails?.totalGOSIContributionMonths + this.rpaDetails?.totalVicContributionMonths;
  }

  getDropDownItems(
    key: string,
    icon,
    urlParam?: string,
    disabled: boolean = false,
    toolTipValue: string | number | null = undefined,
    toolTipParam: string | number | null = undefined
  ): DropDownItems {
    return {
      key: key,
      id: key,
      value: undefined,
      icon: icon,
      disabled: disabled,
      toolTipValue: toolTipValue,
      toolTipParam: toolTipParam,
      url: 'assets/icons/' + urlParam
    };
  }

  handleSelectOption(option: string) {
    this.alertService.clearAlerts();
    switch (option) {
      case 'CONTRIBUTOR.ENTER-RPA-FIRST-SCHEME':
        this.rpaSchemaType = RpaSchemaTypes.GOSI_FIRST_SCHEMA;
        this.routerDataToken.schema = RpaSchemaTypes.GOSI_FIRST_SCHEMA;
        this.routerDataToken.priority = this.socialInsuranceNo;
        this.checkEligibility();
        break;
      case 'CONTRIBUTOR.ENTER-RPA-LAST-SCHEME':
        this.rpaSchemaType = RpaSchemaTypes.GOSI_LAST_SCHEMA;
        this.routerDataToken.schema = RpaSchemaTypes.GOSI_LAST_SCHEMA;
        this.routerDataToken.priority = this.socialInsuranceNo;
        this.checkEligibility();
        break;
      case 'CONTRIBUTOR.CANCEL-RPA-FIRST-SCHEME':
        console.log('Cancel 1st');
        this.showModal(this.cancelRpaAggregationModal);
        break;
      case 'CONTRIBUTOR.CANCEL-RPA-LAST-SCHEME':
        this.showModal(this.cancelRpaAggregationModal);
        break;
    }
  }
  checkReactivateEligibility() {
    this.manageWageService
      .reactivateVicEligibility(this.manageWageService.socialInsuranceNo, this.manageWageService.engagementId)
      .subscribe(
        res => {
          console.log(res);
          this.router.navigate([ContributorRouteConstants.ROUTE_VIC_REACTIVATE]);
        },
        err => this.alertService.showError(err?.error?.message)
      );
  }

  checkEligibility() {
    this.rpaService
      .verifyEligibility(this.socialInsuranceNo, this.rpaSchemaType == 1 ? 'First scheme' : 'Last Scheme')
      .subscribe(
        res => {
          this.router.navigate([ContributorRouteConstants.ROUTE_ENTER_RPA]);
        },
        err => this.alertService.showError(err?.error?.message, err?.error?.details)
      );
  }
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: `modal-lg modal-dialog-centered` }));
  }
  hideModal() {
    this.modalRef?.hide();
  }

  routeTotransactionHistory() {
    this.alertService.clearAlerts();
    this.router.navigate(['home/transactions/list/history']);
  }
}
