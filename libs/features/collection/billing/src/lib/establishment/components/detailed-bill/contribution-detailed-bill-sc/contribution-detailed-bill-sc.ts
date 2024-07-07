/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  convertToYYYYMMDD,
  ExchangeRateService,
  LookupService,
  LovList,
  startOfMonth,
  StorageService,
  BilingualText,
  CurrencyToken,
  AppConstants,
  downloadFile,
  endOfMonth,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import {
  BillDetails,
  ItemizedBillDetailsWrapper,
  ContributionDetailedBill,
  EstablishmentHeader,
  RequestList,
  ItemizedRejectedOHWrapper,
  ItemizedInstallmentWrapper,
  DetailedBillViolationDetails
} from '../../../../shared/models';
import { BillingRoutingService, DetailedBillService, ReportStatementService } from '../../../../shared/services';
import { LanguageToken } from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject, noop, Observable } from 'rxjs';
import { GccCountry, CurrencyArabicShortForm, LanguageTypeEnum } from '../../../../shared/enums';
import { BillingConstants, ReportConstants } from '../../../../shared/constants';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'blg-contribution-detailed-bill-sc',
  templateUrl: './contribution-detailed-bill-sc.html',
  styleUrls: ['./contribution-detailed-bill-sc.scss']
})
export class ContributionDetailedBillScComponent implements OnInit {
  /** Local Variables */
  creditRequired = false;
  billDetails: BillDetails = new BillDetails();
  itemizedBillList: ItemizedBillDetailsWrapper = new ItemizedBillDetailsWrapper();
  idNumber: number;
  establishmentHeader: EstablishmentHeader = new EstablishmentHeader();
  isAdmin = false;
  gccCurrencyList: LovList;
  currencyType: BilingualText = new BilingualText();
  currencyCurrent: string;
  isGccCountry = false;
  contfileName: string;
  contType: string;
  exchangeRate = 1;
  noOfDays: number;
  selectedDate: string;
  minBillDate: string;
  billStartDate: string;
  contributionDetails: ContributionDetailedBill = new ContributionDetailedBill();
  billNumber = 0;
  pageNo = 0;
  pageSize = 10;
  isMofFlag = false;
  initialStatus = false;
  selectedCurrency: string;
  currentCurrency: string;
  tabDetail;
  Url: string;
  selectedTabName: string;
  entityType: string;
  contributionSortBy: string;
  contributionSortOrder = 'ASC';
  idValue: string;
  name: string;
  lang = 'en';
  languageType: string;
  queryParams = new RequestList();
  isBillNumber = false;
  isContributorDetReq = true;
  violationDetails: DetailedBillViolationDetails = new DetailedBillViolationDetails();
  installmentDetails: ItemizedInstallmentWrapper = new ItemizedInstallmentWrapper();
  errorMessage: BilingualText = new BilingualText();
  initialStartDate: string;
  rejectedOHDetails: ItemizedRejectedOHWrapper = new ItemizedRejectedOHWrapper();
  /** Observables */
  nationality$: Observable<LovList>;
  contributionSort$: Observable<LovList>;
  isClicked: boolean;
  isPPA: boolean;

  constructor(
    readonly lookUpService: LookupService,
    readonly storageService: StorageService,
    readonly detailedBillService: DetailedBillService,
    readonly billingRoutingService: BillingRoutingService,
    readonly route: ActivatedRoute,
    readonly exchangeRateService: ExchangeRateService,
    readonly reportStatementService: ReportStatementService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    readonly router: Router
  ) {}
  /**This method handles initialization tasks.*/
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    if (this.lang === 'en') this.contributionSortBy = 'CONTRIBUTOR_NAME_ENG';
    else this.contributionSortBy = 'CONTRIBUTOR_NAME_ARB';
    this.currency.subscribe(currentCurrencyKey => {
      this.currentCurrency = currentCurrencyKey;
      if (this.initialStatus && currentCurrencyKey) {
        this.currencyValueChange(currentCurrencyKey);
      }
    }, noop);
    this.nationality$ = this.lookUpService.getSaudiNonSaudi();
    this.contributionSort$ = this.lookUpService.getContributionSortFieldsList();
    this.lookUpService.getGccCurrencyList().subscribe(res => {
      this.gccCurrencyList = res;
    }, noop);
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params.monthSelected
        ? params.monthSelected
        : convertToYYYYMMDD(startOfMonth(new Date()).toString());
      this.billNumber = params.billNumber;
      this.isMofFlag = params.mofFlag;
      this.idNumber = params.registerNo;
      this.minBillDate = params.billIssueDate;
    }, noop);
    if (this.isMofFlag) {
      this.selectedTabName = 'BILLING.CURRENT-MONTH-CONTRIBUTION';
      this.entityType = 'THIRD_PARTY';
    } else {
      this.selectedTabName = 'BILLING.CONTRIBUTION';
      this.entityType = 'ESTABLISHMENT';
    }
    this.noOfDays = moment(this.selectedDate).daysInMonth();
    this.isAdmin = true;
  //  if (!this.isMofFlag) this.idNumber = this.establishmentRegistrationNo.value;
    this.getBillBreakUpService(this.idNumber);
    this.getBillingHeaderDetails(this.idNumber);
  }
  /** This method to call Bill Breakup Service */
  getBillBreakUpService(idNo: number) {
    this.detailedBillService
      .getBillBreakup(idNo, this.billNumber, this.selectedDate, this.entityType)
      .subscribe((res: BillDetails) => {
        this.billDetails = res;
        this.billNumber = res.billNo;
        this.billStartDate = convertToYYYYMMDD(startOfMonth(res.latestBillStartDate?.gregorian)?.toString());
        if (res.initialBillStartDate?.gregorian < res.ameenStartDate?.gregorian) {
          this.initialStartDate = convertToYYYYMMDD(startOfMonth(res.ameenStartDate?.gregorian)?.toString());
        } else {
          this.initialStartDate = convertToYYYYMMDD(startOfMonth(res.initialBillStartDate?.gregorian)?.toString());
        }
        this.getInstallmentDetails();
        this.getViolationDetails();
        this.detailedBillService
          .getRejectedOHDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
          .subscribe(
            responseData => {
              this.rejectedOHDetails = responseData;
              if (this.rejectedOHDetails) this.getTabsetValue();
            },
            () => this.getTabsetValue()
          );
        if (this.isContributorDetReq) this.getItemizedContributionDetails();
      }, noop);
  }
  /*** This method is to get installment details on selected date*/
  getInstallmentDetails() {
    this.detailedBillService.getInstallmentDetails(this.idNumber, this.selectedDate).subscribe(
      responseData => {
        this.installmentDetails = responseData;
        if (this.installmentDetails) this.getTabsetValue();
      },
      () => this.getTabsetValue()
    );
  }
  /*** This method is to get installment details on selected date*/
  getViolationDetails() {
    const endDate = convertToYYYYMMDD(String(endOfMonth(moment(new Date(this.selectedDate)).toDate())));
    this.detailedBillService.getViolationDetails(this.idNumber, this.selectedDate, endDate, 0, this.pageSize).subscribe(
      data => {
        this.violationDetails = data;
        if (this.violationDetails) this.getTabsetValue();
      },
      () => this.getTabsetValue()
    );
  }
  /*** This method to get tabset*/
  getTabsetValue() {
    this.tabDetail = [];
    if (this.billDetails) {
      this.tabDetail.push({
        tabName: this.isMofFlag ? 'BILLING.CURRENT-MONTH-CONTRIBUTION' : 'BILLING.CONTRIBUTION',
        amount: this.billDetails.totalContribution
      });
      this.tabDetail.push({
        tabName: 'BILLING.DEBIT-ADJUSTMENTS',
        amount: this.billDetails.totalDebitAdjustment
      });
      this.tabDetail.push({
        tabName: this.isMofFlag ? 'BILLING.CREDIT-ADJUSTMENTS' : 'BILLING.RECEIPTS-AND-CREDITS',
        amount: this.isMofFlag ? this.billDetails.totalCreditAdjustment : this.billDetails.totalReceiptsAndCredits
      });
      if (this.billDetails.totalLateFee > 0) {
        const obj = {
          tabName: 'BILLING.LATE-PAYMENT-FEES',
          amount: this.billDetails.totalLateFee
        };
        this.tabDetail.push(obj);
      }
      if (this.rejectedOHDetails.amount > 0) {
        const obj = {
          tabName: 'BILLING.REJECTED-OH-CLAIMS',
          amount: this.rejectedOHDetails.amount
        };
        this.tabDetail.push(obj);
      }
      if (this.installmentDetails.currentInstallmentAmount !== null) {
        const obj = {
          tabName: 'BILLING.INSTALLMENT',
          amount: this.installmentDetails.currentInstallmentAmount
        };
        this.tabDetail.push(obj);
      }
      if (this.violationDetails.totalViolationAmountAggregate > 0) {
        this.tabDetail.push({
          tabName: 'BILLING.VIOLATIONS',
          amount: this.violationDetails.totalViolationAmountAggregate
        });
      }
    }
  }
  /*** This method to call itemized contribution Service*/
  getItemizedContributionDetails() {
    if (this.contributionSortBy === undefined || this.contributionSortBy === null) {
      if (this.lang === 'en') this.contributionSortBy = 'CONTRIBUTOR_NAME_ENG';
      else this.contributionSortBy = 'CONTRIBUTOR_NAME_ARB';
    }
    this.detailedBillService
      .getItemizedContribution(
        this.idNumber,
        this.billNumber,
        this.pageNo,
        this.pageSize,
        this.entityType,
        this.contributionSortBy,
        this.contributionSortOrder,
        this.queryParams
      )
      .subscribe((value: ContributionDetailedBill) => {
        if (value !== undefined) {
          this.contributionDetails = value;
        }
      }, noop);
  }
  /*** This method is to call service for Bill Summary*/
  getDashboardBillDetailsForContribution() {
    if (this.isMofFlag) this.billingRoutingService.navigateToMofDetailedBill(this.selectedDate, this.billNumber);
    else
      this.billingRoutingService.navigateToDashboardBill(
        this.selectedDate,
        this.billNumber,
        false,
        this.initialStartDate,
        this.idNumber
      );
    this.isContributorDetReq = false;
    this.getBillBreakUpService(this.idNumber);
  }
  /*** This method is to get bill details on selected date*/
  getContributionBillDetailsOnSelectedDate(dateValue: string) {
    this.pageNo = 0;
    this.selectedDate = convertToYYYYMMDD(startOfMonth(moment(dateValue).toDate()).toString());
    if (this.selectedDate) {
      if (this.detailedBillService?.getBillOnMonthChanges)
        this.detailedBillService.getBillOnMonthChanges(this.idNumber, this.selectedDate).subscribe(
          resp => {
            if (resp && resp.bills[0]) {
              this.isBillNumber = false;
              this.billNumber = resp.bills[0].billNumber;
            } else this.isBillNumber = true;
            this.detailedBillService
              .getRejectedOHDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
              .subscribe(responseData => {
                this.rejectedOHDetails = responseData;
                if (this.rejectedOHDetails) this.getTabsetValue();
              });
            this.getInstallmentDetails();
            this.getViolationDetails();
            this.detailedBillService
              .getBillBreakup(this.idNumber, this.billNumber, this.selectedDate, this.entityType)
              .subscribe((res: BillDetails) => {
                this.billDetails = res;
                if (res.initialBillStartDate?.gregorian < res.ameenStartDate?.gregorian) {
                  this.initialStartDate = convertToYYYYMMDD(startOfMonth(res.ameenStartDate?.gregorian)?.toString());
                } else {
                  this.initialStartDate = convertToYYYYMMDD(
                    startOfMonth(res.initialBillStartDate?.gregorian)?.toString()
                  );
                }
                if (this.billDetails.totalContribution === 0) {
                  if (this.billDetails.totalDebitAdjustment !== 0) {
                    this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
                  } else if (this.billDetails.totalReceiptsAndCredits !== 0) {
                    this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
                  } else if (this.rejectedOHDetails.amount !== 0) {
                    this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
                  } else if (this.installmentDetails.currentInstallmentAmount !== null) {
                    this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
                  } else if (this.violationDetails.totalViolationAmountAggregate > 0) {
                    this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
                  } else {
                    this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
                  }
                  this.router.navigate([this.Url], {
                    queryParams: {
                      monthSelected: convertToYYYYMMDD(this.selectedDate),
                      billNumber: this.billNumber,
                      mofFlag: this.isMofFlag,
                      registerNo: this.idNumber,
                      billStartDate: convertToYYYYMMDD(this.initialStartDate)
                    }
                  });
                }
                this.getTabsetValue();
                this.getItemizedContributionDetails();
              }, noop);
            this.noOfDays = moment(this.selectedDate).daysInMonth();
          },
          err => {
            this.errorMessage = err.error.message;
            this.isBillNumber = true;
          }
        );
    }
  }

  /*** This method is to call Billing Header service*/
  getBillingHeaderDetails(idNo: number) {
    this.initialStatus = true;
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((res: EstablishmentHeader) => {
      this.establishmentHeader = res;
      this.isGccCountry = res.gccCountry;
      this.isPPA = res.ppaEstablishment;
      if (this.isGccCountry) {
        Object.keys(GccCountry).forEach(data => {
          if (GccCountry[data] === res.gccEstablishment.country.english) {
            this.selectedCurrency = data;
          }
        });
      }
      if (
        this.currentCurrency !== BillingConstants.CURRENCY_SAR.english &&
        this.currentCurrency === this.selectedCurrency
      ) {
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.selectedCurrency, currentDate)
          .subscribe(key => {
            this.exchangeRate = key;
            this.currencyType.english = this.selectedCurrency;
            this.currencyType.arabic = CurrencyArabicShortForm[this.currencyType.english];
          });
      } else {
        this.currencyType = BillingConstants.CURRENCY_SAR;
        this.exchangeRate = 1;
      }
    }, noop);
  }

  currencyValueChange(selectedValue: string) {
    if (
      this.currencyType.english !== selectedValue &&
      selectedValue === this.selectedCurrency &&
      this.isGccCountry &&
      selectedValue !== BillingConstants.CURRENCY_SAR.english
    ) {
      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      this.exchangeRateService
        .getExchangeRate(BillingConstants.CURRENCY_SAR.english, selectedValue, currentDate)
        .subscribe(res => {
          this.exchangeRate = res;
          this.currencyType.english = selectedValue;
          this.currencyType.arabic = CurrencyArabicShortForm[selectedValue];
        }, noop);
    } else {
      if (selectedValue === BillingConstants.CURRENCY_SAR.english) {
        this.currencyType.english = BillingConstants.CURRENCY_SAR.english;
        this.currencyType.arabic = BillingConstants.CURRENCY_SAR.arabic;
        this.exchangeRate = 1;
      } else {
        this.exchangeRate = this.exchangeRate;
        this.currencyType = this.currencyType;
      }
    }
  }
  /** This method is to select the page number on pagination*/
  getselectPageNo(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getItemizedContributionDetails();
  }
  /*** This method is to navigate to new tabs*/
  goToNewTabSections(tabSelected: string) {
    if (tabSelected === 'BILLING.DEBIT-ADJUSTMENTS') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
    }
    if (tabSelected === 'BILLING.CONTRIBUTION' || tabSelected === 'BILLING.CURRENT-MONTH-CONTRIBUTION') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
    }
    if (tabSelected === 'BILLING.RECEIPTS-AND-CREDITS' || tabSelected === 'BILLING.CREDIT-ADJUSTMENTS')
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
    if (tabSelected === 'BILLING.LATE-PAYMENT-FEES') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
    }
    if (tabSelected === 'BILLING.REJECTED-OH-CLAIMS') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
    }
    if (tabSelected === 'BILLING.INSTALLMENT') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
    }
    if (tabSelected === 'BILLING.VIOLATIONS') this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
    this.router.navigate([this.Url], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(this.selectedDate),
        billNumber: this.billNumber,
        registerNo: this.idNumber,
        mofFlag: this.isMofFlag,
        billStartDate: convertToYYYYMMDD(this.initialStartDate)
      }
    });
  }
  /*** This method is to navigate with new date selected on the mof emp summary page*/
  mofCalDatechanged(DateChanged: string) {
    this.selectedDate = convertToYYYYMMDD(DateChanged);
    this.detailedBillService.getBillNumber(this.idNumber, this.selectedDate).subscribe(
      res => {
        this.billNumber = res.bills[0].billNumber;
        if (this.billNumber) {
          this.detailedBillService
            .getBillBreakup(this.idNumber, this.billNumber, this.selectedDate, this.entityType)
            .subscribe((response: BillDetails) => {
              this.billDetails = response;
              if (response) {
                if (this.billDetails.totalContribution > 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
                } else if (this.billDetails.totalDebitAdjustment > 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
                } else if (this.billDetails.totalReceiptsAndCredits > 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
                }
                this.router.navigate([this.Url], {
                  queryParams: {
                    monthSelected: convertToYYYYMMDD(this.selectedDate),
                    mofFlag: this.isMofFlag,
                    billNumber: this.billNumber,
                    registerNo: this.idNumber,
                    billStartDate: convertToYYYYMMDD(this.initialStartDate)
                  }
                });
              }
              this.getTabsetValue();
              this.noOfDays = moment(this.selectedDate).daysInMonth();
            }, noop);
        }
        this.getItemizedContributionDetails();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isBillNumber = true;
      }
    );
  }
  // Method to sort based on sorting conditions
  getSortingParams(queryParams: RequestList) {
    this.contributionSortBy = queryParams.sort.column;
    this.contributionSortOrder = queryParams.sort.direction;
    this.getItemizedContributionDetails();
  }
  // Method to search based on search  values
  getContributorSearchValue(searchValue) {
    this.pageNo = 0;
    this.queryParams = searchValue;
    this.getItemizedContributionDetails();
  }
  downloadContributorDetailedBill(val) {
    this.isClicked = true;
    if (val === 'PDF') {
      this.contfileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_AR;
      this.contType = 'application/pdf';
    } else {
      this.contfileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_AR;
      this.contType = 'application/vnd.ms-excel';
    }
    this.reportStatementService
      .downloadBill('', this.idNumber, this.billNumber, false, this.languageType, val)
      .subscribe(data => {
        if (data?.documentName) {
          this.reportStatementService.getDocumentContent(data?.documentName).subscribe(res => {
            if (res) {
              const blobData = this.createExcelFile(res?.content);
              downloadFile(this.contfileName, this.contType, blobData);
              this.isClicked = false;
            }
          });
        } else {
          setTimeout(() => {
            this.downloadContributorDetailedBill(val);
          }, 10000);
        }
      });
  }
  createExcelFile(content) {
    const byteCharacters = atob(content);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512),
        byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {
      type: `application/vnd.ms-excel`
    });
    return blob;
  }
  printContributorDetailedBill() {
    this.reportStatementService
      .downloadDetailedBill('', this.idNumber, this.billNumber, false, this.languageType, 'PDF')
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
