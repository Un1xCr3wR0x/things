import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertIconEnum,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  CoreBenefitService,
  CoreContributorService,
  CurrencyToken,
  DocumentService,
  ExchangeRateService,
  GosiCalendar,
  LanguageToken,
  LookupService,
  Person,
  RegistrationNoToken,
  RegistrationNumber,
  StorageService,
  Transaction,
  convertToYYYYMMDD,
  getPersonIdentifier,
  isNIN,
  startOfMonth,
  subtractMonths
} from '@gosi-ui/core';
import { ActiveBenefits, DependentDetails, HeirStatusType, isHeirBenefit } from '@gosi-ui/features/benefits/lib/shared';
import {
  DependentService,
  HeirBenefitService,
  SanedBenefitService,
  UiBenefitsService
} from '@gosi-ui/features/benefits/lib/shared/services';
import { BillingConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { CurrencyArabicShortForm, GccCountry, Months } from '@gosi-ui/features/collection/billing/lib/shared/enums';
import {
  BillDetails,
  CreditBalanceDetails,
  DateFormat,
  EstablishmentHeader,
  UnBillAmount
} from '@gosi-ui/features/collection/billing/lib/shared/models';
import { CreditManagementService, DetailedBillService } from '@gosi-ui/features/collection/billing/lib/shared/services';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared/services';
import { InjuryService, OhService, Pagination, Route } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { RequestLimit, SearchRequest } from '@gosi-ui/foundation-dashboard/src';
import {
  Benefits,
  BillDetailsWrapper,
  EngagementDetails,
  OHResponse,
  SearchEngagementValues,
  VicEngagementDetails
} from '@gosi-ui/foundation-dashboard/src/lib/individual-app/models';
import { CoverageWrapper } from '@gosi-ui/foundation-dashboard/src/lib/individual-app/models/coverage-wrapper';
import { VicContributionDetails } from '@gosi-ui/foundation-dashboard/src/lib/individual-app/models/vic-contribution';
import { IndividualDashboardService } from '@gosi-ui/foundation-dashboard/src/lib/individual-app/services/individual-dashboard.service';
import {
  IndividualSearchDetails,
  TransactionSearchResponse
} from '@gosi-ui/foundation-dashboard/src/lib/search/models';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, Subscription, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ChangePersonScBaseComponent,
  ChangePersonService,
  ManagePersonService,
  OverallEngagementResponse,
  PersonConstants,
  SearchEngagementResponse
} from '../../../shared';
import { pensionReformEligibility } from '@gosi-ui/features/contributor/lib/shared/models/pr-eligibility';

@Component({
  selector: 'cim-profile-overview-sc',
  templateUrl: './profile-overview-sc.component.html',
  styleUrls: ['./profile-overview-sc.component.scss']
})
export class ProfileOverviewScComponent extends ChangePersonScBaseComponent implements OnInit {
  identifier: number;
  personId: number;
  personIdentifier: number;
  sin: number;
  personDtls: Person[] = [];
  personDetailsModified: Person;
  transactionDetails: Transaction[] = [];
  limitItem: RequestLimit = new RequestLimit();
  itemsPerPage = 10;
  engagementDetails: EngagementDetails[];
  activeBenefitsList: ActiveBenefits[] = [];
  overallEngagementResponse: OverallEngagementResponse;
  ohResponse: OHResponse;
  totalRecords: number;
  contributorResponse: IndividualSearchDetails;
  currencyType = PersonConstants.CURRENCY_SAR;
  benefitsEligibility: Benefits[] = [];
  annuityBenefits: Benefits[] = [];
  uibenefits: Benefits;
  tabIndicator = 0;
  idNumber: number;
  paidAmount = 0;
  unpaidBalance = 0;
  balanceDue = 0;
  months = Months;
  monthSelectedDate: string;
  billDetails: BillDetails = new BillDetails();
  availableCreditBalance = 0;
  currentDate: DateFormat = new DateFormat();
  previousDateValue: DateFormat = new DateFormat();
  creditDate: DateFormat = new DateFormat();
  currentMonth = '';
  previousMonthValue = '';
  unPaidAmount = 0;
  billNumber = 0;
  excessPaidFlag = false;
  creditAmount = 0;
  creditBalance = false;
  lastBillAmount = 0;
  creditMonth = '';
  billAmountDateValue: Date;
  receiptCreditDate: Date;
  totalCreditBalance = 0;
  entityType = 'ESTABLISHMENT';
  isAdmin = false;
  selectedValue: string;
  currentCurrency: string;
  showMinimumRequired = false;
  billBalanceDetail: BillDetails;
  exchangeRate = 1;
  unBillAmount: UnBillAmount;
  isGccCountry: boolean;
  isMofFlag = false;
  isBillNumber: boolean;
  overallEngagements: EngagementDetails[];
  engagementList: SearchEngagementValues;
  billHistory: BillDetailsWrapper = new BillDetailsWrapper();
  vicCoverageDetails: VicContributionDetails;
  vicEngagementDetails: VicEngagementDetails;
  benefitType: string;
  status: string[] = [];
  dependentDetails: DependentDetails[];
  colorCode = 0;
  searchRequest: SearchRequest;
  selectedChart = ''; //holds the name of the section in chart user clicked on
  lang = 'en';
  contributionValues: SearchEngagementResponse;
  isVic: string;
  isContributorActive: boolean;
  vicRefundDetials: CreditBalanceDetails;
  showRefundVicBtn: boolean;
  showBillSummary: boolean;
  contributionBreakup: [];
  activeEngagementDetails: EngagementDetails[];
  sinSubscription: Subscription;
  onlyNin: number;
  estRegNo: number;
  systemRunDate: GosiCalendar;
  vicIndicator: EngagementDetails;
  activeEngagementPpa = false;
  AnyEngagementNotPpa = false;
  hideButtonForPpa = false;
  ppaEstablishment: boolean;
  pensionReformEligibility: pensionReformEligibility;
  isPREligible: boolean;
  isPrivate: boolean;
  message: BilingualText;
  isPensionEligible: boolean = false;
  modalRef: BsModalRef;
  @ViewChild('isPensionEligibileModal', { static: true }) isPensionEligibileModal: TemplateRef<HTMLElement>;
  icon: AlertIconEnum;
  age: number;
  labelStyle = {
    value: { color: '#008000' }
  };
  pensionReformEligible: string;
  liveStatus: boolean;
  servicePeroid: number;
  nin: number;
  isNin: boolean;



  constructor(
    readonly changePersonService: ChangePersonService,
    readonly lookService: LookupService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly documentService: DocumentService,
    readonly activatedRoute: ActivatedRoute,
    public modalService: BsModalService,
    readonly individualAppDashboardService: IndividualDashboardService,
    readonly contributorService: ContributorService,
    readonly router: Router,
    readonly detailedBillService: DetailedBillService,
    readonly alertService: AlertService,
    readonly creditManagementService: CreditManagementService,
    readonly storageService: StorageService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    readonly exchangeRateService: ExchangeRateService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly injuryService: InjuryService,
    readonly dashboardService: DashboardSearchService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly manageService: ManagePersonService,
    readonly coreContributorService: CoreContributorService,
    readonly dependentService: DependentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly ohService: OhService,
    readonly uiBenefitService: UiBenefitsService,
    readonly heirBenefitService: HeirBenefitService,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber
  ) {
    super(
      changePersonService,
      dashboardSearchService,
      contributorService,
      lookService,
      appToken,
      alertService,
      documentService,
      modalService,
      activatedRoute
    );
  }

  ngOnInit(): void {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.language.subscribe(lang => (this.lang = lang));
    this.currency.subscribe(key => {
      this.selectedValue = key;
      if (key) {
        this.currencyExchange(key);
      }
    });
    this.ppaEstablishment = this.dashboardSearchService.ppaEstablishment;
    this.coreBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
    });
    this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1)).toString());
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      if (params.get('personId')) {
        if (params) this.personId = Number(params.get('personId'));
        if (this.storageService.getSessionValue('idType') == 'NIN') {
          this.onlyNin = Number(params.get('personId'));
        }
        if (this.storageService.getSessionValue('idType') == 'NIN' || 'IQAMA') {
          this.personIdentifier = Number(params.get('personId'));
          this.getIndividualDetailsWithIdentifier();
        }
        if (this.onlyNin) this.isNin = isNIN(this.onlyNin.toString()); 
        this.checkEligibility();
        this.sinSubscription = this.changePersonService.getSocialInsuranceNo().subscribe(res => {
          this.sin = res;
          if (this.sin) {
            this.ohService.setSocialInsuranceNo(this.sin);
            this.coreContributorService.selectedSIN = this.sin;
            this.getIndividualDetailsWithSin();
            this.sinSubscription.unsubscribe();
          }
        });

        this.heirBenefitService.getHeirActiveBenefits(this.personIdentifier).subscribe(
          res => {
            this.activeBenefitsList = [...this.activeBenefitsList, ...res];
          },
          _ => {}
        );

        this.changePersonService.getPersonInfo().subscribe(res => {
          this.personDetailsModified = res;
        });
        this.enableFunctionalitites();

        // this.getProfileDetails(this.sin);
        this.initialContributionBreakup(this.contributionBreakup);
      }
    });
  }

  enableFunctionalitites() {
    if (this.personDetailsModified) {
      this.personDetailsModified.identity = [...getPersonIdentifier(this.personDetailsModified)];
    }
  }

  /** Method to check pension-reform-eligibility. */
  checkEligibility() {
    if(this.isPrivate && this.onlyNin && this.isNin){
      this.contributorService.checkEligibilityNin(this.onlyNin).subscribe(res => {
        if(this.isPrivate && res){
          this.icon = AlertIconEnum.QUESTION;
          this.isPensionEligible = true;
        }
        this.pensionReformEligibility = res;
        if (res.pensionReformEligible === 'Not Eligible' || res.pensionReformEligible === 'Impacted') {
          this.isPREligible = false;
        } else {
          this.isPREligible = true;
        }
      },
      (error) => {
        if (error.status === 400) {
          if(this.isPrivate){
            if (error.error.message.english !== "No contributor found please enter the correct identifier.") {
            this.alertService.showInfo(error.error.message);
            }
          }  
        } else {
          console.error('Unexpected error:', error); 
        }
      }
      );
    }
  }
    /**
   * This method is to show the modal reference.
   * @param commonModalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.commonModalRef.hide();
  }


  checkVIC() {
    this.manageService.searchContributor(null, this.sin, true).subscribe(res => {
      this.isVic = res.vicIndicator ? 'yes' : 'no';
    });
  }

  navigateToEngagement() {
    // this.changePersonService.setMenuIndex(2);
    this.router.navigate([`/home/profile/individual/internal/${this.personId}/engagements`]);
  }

  navigateToReportOH() {
    // this.changePersonService.setMenuIndex(6);
    this.router.navigate(['home/oh/injury/add']);
    //this.router.navigate([`/home/profile/individual/internal/${this.personId}/occupational-hazards`]);
  }
  // navigateToAddInjury() {
  // this.ohService.setSocialInsuranceNo(this.identifier);
  // this.ohService.setInjuryId(null);
  // this.registrationNo = this.ohService.getRegistrationNumber();
  // this.ohService.setRegistrationNo(this.registrationNo);
  // this.router.navigate([RouteConstants.ROUTE_INJURY_ADD]);

  //   this.router.navigate(['home/oh/injury/add']);
  // }

  getBillingHeaderDetails(idNo: number) {
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((res: EstablishmentHeader) => {
      this.isGccCountry = res.gccCountry;
      if (this.isGccCountry) {
        Object.keys(GccCountry).forEach(data => {
          if (GccCountry[data] === res.gccEstablishment.country?.english) {
            this.currentCurrency = data;
          }
        });
      }
      if (
        this.selectedValue !== BillingConstants.CURRENCY_SAR?.english &&
        this.currentCurrency === this.selectedValue
      ) {
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR?.english, this.currentCurrency, currentDate)
          .subscribe(key => {
            this.exchangeRate = key;
            this.currencyType.english = this.currentCurrency;
            this.currencyType.arabic = CurrencyArabicShortForm[this.currencyType?.english];
          });
      } else {
        this.currencyType = BillingConstants.CURRENCY_SAR;
        this.exchangeRate = 1;
      }
    });
  }
  /**
   * Method to get bill details on selected date
   * @param idNo
   * @param pageLoad
   */
  getBillDetailsOnSelectedDate() {
    if (this.monthSelectedDate) {
      if (this.detailedBillService.getBillOnMonthChanges !== undefined)
        this.detailedBillService.getBillOnMonthChanges(this.idNumber, this.monthSelectedDate, false).subscribe(res => {
          if (res.bills[0]) {
            this.billNumber = res.bills[0].billNumber;
            this.isBillNumber = false;
          } else this.isBillNumber = true;
        });
    }
  }
  /**
   * Method to get bill number
   * @param idNo
   * @param pageLoad
   */
  getBillNumber(idNo: number, pageLoad) {
    this.detailedBillService.getBillNumber(idNo, this.monthSelectedDate, pageLoad).subscribe(res => {
      this.billNumber = res.bills[0].billNumber;
      this.getBillBreakUpService(idNo);
    });
  }
  /**
   * This method to call Bill Breakup Service
   * @param idNo Identification Number
   */
  getBillBreakUpService(idNo: number) {
    this.detailedBillService
      .getBillBreakup(idNo, this.billNumber, this.monthSelectedDate, this.entityType)
      .subscribe((res: BillDetails) => {
        this.billBalanceDetail = res;
        this.unBillAmount = this.billDetails.unBilledAmount;
        this.getBillDetails();
      });
  }
  /**
   * Method to format Dates Bill Balance
   * @param date date
   */
  formatDatesBillBalance(date: Date): DateFormat {
    const formattedDate: DateFormat = new DateFormat();
    formattedDate.date = this.getDayFromDate(date);
    formattedDate.year = this.getYearFromDate(date);
    return formattedDate;
  }
  /**
   * Method to get day from a given date
   * @param date date
   */
  getDayFromDate(date: Date): string {
    return moment(date).toDate().getDate().toString();
  }

  /**
   * Method to get month from a given date
   * @param date date
   */
  getMonthFromDate(date: Date): string {
    return Object.keys(Months)[moment(date).toDate().getMonth()];
  }
  /**
   * Method to get year from a given date
   * @param date date
   */
  getYearFromDate(date: Date): string {
    return moment(date).toDate().getFullYear().toString();
  }
  getAvailableBalanceDetails(regNumber: number) {
    this.creditManagementService.getAvailableCreditBalance(regNumber).subscribe(datas => {
      if (datas && datas?.totalCreditBalance > 0) {
        this.totalCreditBalance = datas.totalCreditBalance;
      }
    });
  }
  currencyExchange(selectedCurrency: string) {
    if (
      this.currencyType?.english !== selectedCurrency &&
      selectedCurrency === this.currentCurrency &&
      this.isGccCountry &&
      selectedCurrency !== BillingConstants.CURRENCY_SAR?.english
    ) {
      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      this.exchangeRateService
        .getExchangeRate(BillingConstants.CURRENCY_SAR?.english, selectedCurrency, currentDate)
        .subscribe(res => {
          this.exchangeRate = res;
          this.currencyType.english = selectedCurrency;
          this.currencyType.arabic = CurrencyArabicShortForm[selectedCurrency];
        });
    } else {
      if (selectedCurrency === BillingConstants.CURRENCY_SAR?.english) {
        if (this.currencyType) {
          this.currencyType.english = BillingConstants.CURRENCY_SAR?.english;
          this.currencyType.arabic = BillingConstants.CURRENCY_SAR.arabic;
        }
        this.exchangeRate = 1;
      } else {
        this.exchangeRate = this.exchangeRate;
        this.currencyType = this.currencyType;
      }
    }
  }
  /**
   * Method to get bill details
   */
  getBillDetails() {
    this.billAmountDateValue = moment(this.billBalanceDetail?.issueDate.gregorian).toDate();
    this.receiptCreditDate = moment(this.billBalanceDetail?.issueDate.gregorian).add(1, 'day').toDate();
    this.previousDateValue = this.formatDatesBillBalance(this.billAmountDateValue);
    this.previousMonthValue = this.getMonthFromDate(this.billAmountDateValue);
    this.previousMonthValue = 'BILLING.' + 'CALENDAR.' + this.previousMonthValue.toUpperCase();
    this.creditMonth = this.getMonthFromDate(this.receiptCreditDate);
    this.creditMonth = 'BILLING.' + 'CALENDAR.' + this.creditMonth.toUpperCase();
    this.creditDate = this.formatDatesBillBalance(this.receiptCreditDate);
    this.unPaidAmount = this.billBalanceDetail?.balanceDue - this.billBalanceDetail.paidAmount;
    this.showMinimumRequired =
      !this.isMofFlag &&
      this.billBalanceDetail !== undefined &&
      this.billBalanceDetail?.minimumPaymentRequiredForMonth !== null
        ? true
        : false;

    if (this.balanceDue < this.billBalanceDetail.paidAmount) {
      this.creditAmount =
        this.billBalanceDetail.paidAmount -
        this.billBalanceDetail.balanceDue -
        this.billBalanceDetail?.creditBalanceTransferredOrRefunded;
      this.excessPaidFlag = true;
      if (this.isMofFlag) {
        this.creditAmount = this.billBalanceDetail.paidAmount - this.billBalanceDetail.balanceDue;
      }
    }
    if (this.balanceDue < 0) {
      this.lastBillAmount = Math.abs(this.balanceDue);
      this.unPaidAmount = this.balanceDue + this.paidAmount;
      this.creditBalance = true;
    }
    if (this.balanceDue - this.paidAmount > 0) {
      this.unpaidBalance = this.balanceDue - this.paidAmount;
    } else {
      this.availableCreditBalance = this.paidAmount - this.balanceDue;
    }
  }
  /**
   * Method to switch bill breakup view.
   * @param id tab id
   */
  switchBreakupView(id) {
    this.tabIndicator = id?.tabIndicator;
    this.selectedChart = id?.selectedChart;
    if (this.selectedChart === 'GOSI' || this.selectedChart === 'المؤسسة العامة للتأمينات الاجتماعية') {
      this.colorCode = 0;
    } else if (this.selectedChart === 'PPA' || this.selectedChart === 'التسويات') {
      this.colorCode = 1;
    } else if (this.selectedChart === 'VIC' || this.selectedChart === 'مشترك إختياري') {
      this.colorCode = 2;
    }
  }
  /**initial colour code*/
  initialContributionBreakup(summary) {
    if (summary?.length > 0) {
      if (
        summary?.[0].amount > 0 &&
        (summary?.[0].type.english === 'GOSI' || summary?.[0].type.arabic === 'الاشتراكات')
      ) {
        this.selectedChart = 'GOSI';
        this.colorCode = 0;
      } else if (
        summary?.[1].amount > 0 &&
        (summary?.[1].type.english === 'PPA' || summary?.[1].type.arabic === 'التسويات')
      ) {
        this.selectedChart = 'PPA';
        this.colorCode = 1;
      } else if (
        summary?.[2].amount > 0 &&
        (summary?.[2].type.english === 'VIC' || summary?.[2].type.arabic === 'إصابات العمل المرفوضة')
      ) {
        this.selectedChart = 'VIC';
        this.colorCode = 2;
      }
    }
  }

  getIndividualDetailsWithSin() {
    this.getBenefits(this.sin);
    this.fetchEngagementDetails(this.sin);
    this.fetchOhDetails(this.sin);
    this.fetchContributorDetails(this.sin?.toString());
    this.getTransactionDetails(this.personIdentifier, this.sin);
    this.getBenefitEligibilityDetails();
  }

  getIndividualDetailsWithIdentifier() {
    // this.getPersonRoles(this.personIdentifier ? this.personIdentifier : this.sin);
    if (this.onlyNin) this.getVicBillBreakupDetails(this.onlyNin);
  }

  getBenefitEligibilityDetails() {
    forkJoin([
      this.individualAppDashboardService.getAnnuityBenefits(this.sin),
      this.uiBenefitService.getUIBenefits(this.sin)
    ]).subscribe(res => (this.benefitsEligibility = res[0].concat(res[1])));
  }

  // getAnnuityEligibilityDetails() {
  //   this.individualAppDashboardService.getAnnuityBenefits(this.sin).subscribe(
  //     res => {
  //       this.annuityBenefits = res;
  //     },
  //     // err => {
  //     //   this.alertService.showError(err.error.message);
  //     // }
  //   );
  // }

  // getUiEligibilityDetails() {
  //   this.uiBenefitService.getUIBenefits(this.sin).subscribe(
  //     data => {
  //       this.uibenefits = data;
  //     }
  //   )
  // }

  setEligibilities() {
    this.benefitsEligibility = this.annuityBenefits.concat(this.uibenefits);
    //console.log('benefitsEligibility', this.benefitsEligibility);
  }

  fetchContributorDetails(sin: string) {
    this.individualAppDashboardService.getIndividualDetails(sin).subscribe(res => {
      this.contributorResponse = res;
      this.isContributorActive = res.statusType == 'ACTIVE' ? true : false;
      this.getContributorRefundDetails(this.sin, this.isContributorActive);
    });
  }
  fetchOhDetails(sin: number) {
    let pagination = new Pagination();
    pagination.page.pageNo = 0;
    pagination.page.size = 50;
    this.individualAppDashboardService.getOccupationalDetailsForIndividual(sin, pagination).subscribe(res => {
      this.ohResponse = res;
      this.ohService.setRoute(Route.INDIVIDUAL_PROFILE_OVERVIEW);
    });
  }
  getEngagementDetails(sin: number) {
    this.individualAppDashboardService.getEngagementDetails(sin).subscribe(
      res => {
        this.activeEngagementDetails = res;
        this.activeEngagementDetails.forEach(item => {
          this.idNumber = item.registrationNo;
          if (this.idNumber) {
            this.getBillingDetails(this.idNumber);
          }
          // if (item.engagementId)
          //   this.getCoverage(this.identifier, item.engagementId, item.registrationNo).subscribe(response => {
          //     item.coverageDetails = response.currentPeriod;
          //   });
        });
      }
      // err => this.alertService.showError(err.error.message)
    );
  }
  // fetchEngagementDetails(identifier: number): void {
  //   this.contributorService.getEngagementFullDetails(identifier).subscribe(res => {
  //     this.contributionValues = res;
  //   });
  // }
  fetchEngagementDetails(sin: number) {
    this.individualAppDashboardService.getEngagementFullDetails(sin).subscribe(res => {
      this.engagementDetails = res.activeEngagements;
      this.overallEngagements = res.overallEngagements;
      this.engagementList = res;
      if (this.engagementDetails.length > 0) {
        this.engagementDetails.forEach(item => {
          this.estRegNo = item.registrationNo;
          this.activeEngagementPpa = item?.ppaIndicator;
          this.ohService.setRegistrationNo(this.estRegNo);
          this.coreContributorService.registartionNo = this.estRegNo;
          this.manageService._establishmentRegNo.next(item.registrationNo);
          this.isVic = item?.vicIndicator ? 'yes' : 'no';
          if (item.engagementId)
            if (item?.vicIndicator) {
              this.getVicCoverage(this.personIdentifier, item.engagementId).subscribe(response => {
                this.vicCoverageDetails = response;
              });
              this.getVicEngagement(this.personIdentifier, item.engagementId).subscribe(res => {
                this.vicEngagementDetails = res;
              });
            } else {
              this.getCoverage(sin, item.engagementId).subscribe(response => {
                item.coverageDetails = response.currentPeriod;
              });
            }
        });
      } else if (this.overallEngagements.length > 0) {
        this.overallEngagements.forEach(item => {
          this.isVic = item?.vicIndicator ? 'yes' : 'no';
          this.estRegNo = item.registrationNo;
          this.ohService.setRegistrationNo(this.estRegNo);
          this.coreContributorService.registartionNo = this.estRegNo;
          this.manageService._establishmentRegNo.next(item.registrationNo);
        });
      }
      if (this.overallEngagements.length > 0)
        if (this.overallEngagements.findIndex(item => item.ppaIndicator === false) >= 0) {
          this.AnyEngagementNotPpa = true;
        }
      //PPA
      if (this.ppaEstablishment) {
        this.hideButtonForPpa = true;
      } else {
        if (this.activeEngagementPpa && !this.AnyEngagementNotPpa) {
          this.hideButtonForPpa = true;
        } else if (this.engagementDetails.length == 0 && this.overallEngagements.length == 0) {
          this.hideButtonForPpa = false;
        } else if (this.engagementDetails.length == 0) {
          this.hideButtonForPpa = !this.AnyEngagementNotPpa ? true : false;
        } else if (this.overallEngagements.length == 0 && this.activeEngagementPpa) {
          this.hideButtonForPpa = true;
        }
      }
      // if (this.onlyNin && this.isVic == 'yes') this.getVicBillBreakupDetails(this.onlyNin);
      this.vicIndicator = this.engagementDetails.find(obj => {
        return obj.vicIndicator === true;
      });
      if (this.vicIndicator == undefined) {
        this.vicIndicator = this.overallEngagements.find(obj => {
          return obj.vicIndicator === true;
        });
      }
      if (this.vicIndicator != undefined) {
        if (this.onlyNin) this.getVicBillBreakupDetails(this.onlyNin);
      }
    });
  }
  getVicBillBreakupDetails(idNo) {
    if (idNo) {
      //this.alertService.clearAlerts();
      this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1)).toString());
      this.individualAppDashboardService.getBillNumber(idNo, this.monthSelectedDate, true).subscribe(
        res => {
          if (res) {
            this.billHistory = res;
            this.billNumber = res.bills[0].billNumber;
            this.isBillNumber = false;
            this.individualAppDashboardService
              .getVicBillBreakup(idNo, this.billNumber)
              .subscribe((response: BillDetails) => {
                this.billDetails = response;
                this.showBillSummary = true;
              });
          }
        },
        err => {
          this.isBillNumber = true;
          // this.alertService.showError(err.error.message);
        }
      );
    }
  }
  getVicEngagement(nin: number, engagementId: number): Observable<VicEngagementDetails> {
    return this.individualAppDashboardService.getVicEngagementById(nin, engagementId).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
  getVicCoverage(nin: number, engagementId: number): Observable<VicContributionDetails> {
    return this.individualAppDashboardService.getVicContributionDetails(nin, engagementId).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  getBenefits(identifier: number) {
    const status = ['Active', 'Draft', 'In Progress'];
    this.sanedBenefitService.getBenefitsWithStatus(identifier, status).subscribe(response => {
      this.activeBenefitsList = [...this.activeBenefitsList, ...response];
      this.activeBenefitsList.forEach((benefit, index) => {
        this.benefitType = benefit.benefitType.english;
        this.status = this.setStatusValues(isHeirBenefit(this.benefitType));
        this.getDependentDetails(index, benefit.sin, benefit.benefitRequestId, null, this.status);
      });
    });
  }

  /** removing benefits from individual profile */
  // getBenefits(sin: number) {
  //   const status = ['Active', 'Draft', 'In Progress'];
  //   this.sanedBenefitService.getBenefitsWithStatus(sin, status).subscribe(response => {
  //     this.activeBenefitsList = response;
  //     this.activeBenefitsList.forEach((benefit, index) => {
  //       this.benefitType = benefit.benefitType.english;
  //       this.status = this.setStatusValues(isHeirBenefit(this.benefitType));
  //       this.getDependentDetails(index, benefit.sin, benefit.benefitRequestId, null, this.status);
  //     })
  //   });
  // }

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

  getDependentDetails(index: number, sin: number, benefitRequestId: number, referenceNo: number, status: string[]) {
    if(sin){
      this.dependentService.getDependentDetailsById(sin, benefitRequestId.toString(), referenceNo, status).subscribe(
        res => {
          this.dependentDetails = res;
          this.activeBenefitsList[index].dependentDetails = this.dependentDetails;
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    }
  }
  // getDependentDetails(index: number, sin: number, benefitRequestId: number, referenceNo: number, status: string[]) {
  //   this.dependentService.getDependentDetailsById(sin, benefitRequestId.toString(), referenceNo, status).subscribe(
  //     res => {
  //       this.dependentDetails = res;
  //       this.activeBenefitsList[index].dependentDetails = this.dependentDetails;
  //     },
  //   );
  // }

  getBillingDetails(idNumber: number) {
    if (idNumber) {
      this.getBillNumber(idNumber, true);
      this.getAvailableBalanceDetails(idNumber);
      this.getBillDetailsOnSelectedDate();
      this.getBillingHeaderDetails(idNumber);
    }
  }

  /** Method to get Refund account details */
  getContributorRefundDetails(sin: number, status: boolean) {
    // this.creditManagementService.getContirbutorRefundDetails(sin, status).subscribe(data => {
    //   this.vicRefundDetials = data;
    //   if (this.vicRefundDetials.totalCreditBalance !== 0) {
    //     this.showRefundVicBtn = true;
    //   }
    // });
  }

  getCoverage(sin: number, engagementId: number): Observable<CoverageWrapper> {
    return this.individualAppDashboardService.getContributoryCoverage(sin, engagementId).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
  /**
   *  navigate to establishment txns
   */
  navigateToList() {
    // this.changePersonService.setMenuIndex(1);
    this.router.navigate([`home/profile/individual/internal/${this.personId}/transaction-history`]);
  }
  /* method for pagination
   * @param limitItem
   */
  onSelectPage(page: number) {
    this.limitItem.pageNo = page - 1;
    this.limitItem.pageSize = this.itemsPerPage;
    this.getTransactionDetails(this.personIdentifier, this.sin);
  }
  /**
   * method to get searched transaction details
   */
  getTransactionDetails(personId: number, sin: number) {
    this.searchRequest = new SearchRequest();
    this.searchRequest.limit = this.limitItem;
    this.dashboardSearchService
      .getIndividualTransactions(personId, sin, this.searchRequest)
      .subscribe((transactionResponse: TransactionSearchResponse) => {
        if (transactionResponse && transactionResponse.listOfTransactionDetails) {
          this.dashboardSearchService.setIndividualTransactionDetails(transactionResponse);
          let filteredTransaction = transactionResponse.listOfTransactionDetails.filter(
            item => item.status.english == 'In Progress'
          );
          this.transactionDetails = filteredTransaction.slice(0, 2);
        }
        this.totalRecords = transactionResponse.totalRecords;
      });
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
        idNo: this.sin
      }
    });
  }

  navigateToWage() {
    this.router.navigate(['/home/contributor/engagement/wage-breakup']);
  }

  ngOnDestroy() {
    this.showError = false;
    this.alertService.clearAlerts();
  }
}
