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
  LanguageToken,
  downloadFile,
  RegistrationNoToken,
  RegistrationNumber,
  GosiCalendar,
  AlertService,
  CalendarTypeEnum
} from '@gosi-ui/core';
import { GccCountry, CurrencyArabicShortForm, LanguageTypeEnum } from '../../../../shared/enums';
import { BillingRoutingService, DetailedBillService, ReportStatementService, MiscellaneousAdjustmentService} from '../../../../shared/services';
import { BillingConstants, ReportConstants, MiscellaneousConstants } from '../../../../shared/constants';
import {
  BillDetails,
  EstablishmentHeader,
  GccCurrency,
  ItemizedBillDetailsWrapper,
  ItemizedAdjustmentWrapper,
  RequestList,
  ItemizedCreditRefund,
  ItemizedRejectedOHWrapper,
  CreditTransferWrapper,
  ItemizedMiscRequest,
  ItemizedMiscResponse, ReceiptWrapper
} from '../../../../shared/models';
import moment from 'moment';
import { Observable, Observer, BehaviorSubject, noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdjutmentDetailedBillBaseScComponent } from '../../../../shared/components/base/adjustment-detailed-bill-base-sc.component';

@Component({
  selector: 'blg-adjustment-detailed-bill-sc',
  templateUrl: './adjustment-detailed-bill-sc.component.html',
  styleUrls: ['./adjustment-detailed-bill-sc.component.scss']
})
export class AdjustmentDetailedBillScComponent extends AdjutmentDetailedBillBaseScComponent implements OnInit {
  /** Local Variables */
  filterSearchDetails: RequestList = new RequestList();
  adjustmentBillDetails: BillDetails = new BillDetails();
  adjustmentItemizedBillList: ItemizedBillDetailsWrapper = new ItemizedBillDetailsWrapper();
  idNumber: number;
  adjustmentEstablishmentHeader: EstablishmentHeader = new EstablishmentHeader();
  gccCurrencyList: LovList;
  currencyList: GccCurrency[] = [];
  billNumber: number;
  billDetails: BillDetails = new BillDetails();
  wageChange: ItemizedAdjustmentWrapper = new ItemizedAdjustmentWrapper();
  periodChange: ItemizedAdjustmentWrapper = new ItemizedAdjustmentWrapper();
  coverageChange: ItemizedAdjustmentWrapper = new ItemizedAdjustmentWrapper();
  registrationChange: ItemizedAdjustmentWrapper = new ItemizedAdjustmentWrapper();
  reactivateRegistrationChange: ItemizedAdjustmentWrapper = new ItemizedAdjustmentWrapper();
  ohRateChange: ItemizedAdjustmentWrapper = new ItemizedAdjustmentWrapper();
  coverageAddition: ItemizedAdjustmentWrapper =new ItemizedAdjustmentWrapper();
  creditRefundChange: ItemizedCreditRefund = new ItemizedCreditRefund();
  creditTransferChange: CreditTransferWrapper = new CreditTransferWrapper();
  contributorRefundChange: ItemizedCreditRefund = new ItemizedCreditRefund();
  currencySelected: BilingualText = new BilingualText();
  errorMessage: BilingualText = new BilingualText();
  creditRefundChangeTotal = 0;
  contributorRefundChangeTotal = 0;
  coverageAdditionTotal = 0;
  rejectedOHDetail: ItemizedRejectedOHWrapper = new ItemizedRejectedOHWrapper();
  miscAdjustmentRequest: ItemizedMiscRequest = new ItemizedMiscRequest();
  miscAdjustmentResponse: ItemizedMiscResponse = new ItemizedMiscResponse();
  startDateCalender: GosiCalendar = new GosiCalendar();
  startDateMisc: Date;
  cancledReceiptDetails: ReceiptWrapper;
  isPPA : boolean;
  /** Observables */
  residentType$: Observable<LovList>;
  adjustmentSort$: Observable<LovList>;
  constructor(
    readonly route: ActivatedRoute,
    readonly lookUpService: LookupService,
    readonly storageService: StorageService,
    readonly billingRoutingService: BillingRoutingService,
    readonly exchangeRateService: ExchangeRateService,
    readonly detailedBillService: DetailedBillService,
    readonly reportStatementService: ReportStatementService,
    readonly alertService: AlertService,
    readonly miscAdjustmentService: MiscellaneousAdjustmentService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    readonly router: Router
  ) {
    super(detailedBillService, router, reportStatementService);
  }
  /* * This method handles initialization tasks.*/
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.currency.subscribe(currentCurrencyKey => {
      this.currentCurrency = currentCurrencyKey;
      if (this.isInitialStatus && currentCurrencyKey) {
        this.currencyValueChange(currentCurrencyKey);
      }
    }, noop);
    this.lookUpService.getGccCurrencyList().subscribe(res => {
      this.gccCurrencyList = res;
    }, noop);
    this.residentType$ = this.lookUpService.getSaudiNonSaudi();
    this.adjustmentSort$ = this.lookUpService.getAdjustmentSortFieldsList();
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params.monthSelected;
      this.billNumber = params.billNumber;
      this.billIssueDate = params.billIssueDate;
      this.isMofFlag = params.mofFlag;
      this.idNumber = params.registerNo;
      this.initialStartDate = params.billStartDate;
    }, noop);
    this.startDateMisc = startOfMonth(moment(new Date(this.selectedDate)).toDate());
    if (this.isMofFlag) {
      this.entityType = 'THIRD_PARTY';
    } else {
      this.entityType = 'ESTABLISHMENT';
    }
    this.isAdmin = true;
    if (!this.isMofFlag) this.idNumber = this.establishmentRegistrationNo.value;
    this.getAdjustmentBillBreakUpService(this.idNumber);
    this.getAdjustmentBillingHeaderService(this.idNumber);
    this.getItemizedBillBackDatedWage(this.idNumber);
    this.getviolationAdjustmentDetails(this.idNumber);
    this.getMiscAdjustmentDetails(this.idNumber);
    this.getCancledPaymentDetails(this.idNumber, this.selectedDate);
  }
  /*** This method to call Bill Breakup Service
   * @param idNo Identification Number*/
  getAdjustmentBillBreakUpService(idNo: number) {
    this.detailedBillService
      .getBillBreakup(idNo, this.billNumber, this.selectedDate, this.entityType)
      .subscribe((res: BillDetails) => {
        this.adjustmentBillDetails = res;
        this.billStartDate = convertToYYYYMMDD(startOfMonth(res.latestBillStartDate?.gregorian)?.toString());
        if (res.initialBillStartDate?.gregorian < res.ameenStartDate?.gregorian)
          this.initialStartDate = convertToYYYYMMDD(startOfMonth(res.ameenStartDate?.gregorian)?.toString());
        else this.initialStartDate = convertToYYYYMMDD(startOfMonth(res.initialBillStartDate?.gregorian)?.toString());
      }, noop);
    this.getInstallmentDetails();
    this.getViolationDetails();
    this.detailedBillService
      .getRejectedOHDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
      .subscribe(
        responseData => {
          this.rejectedOHDetail = responseData;
          if (this.rejectedOHDetail) this.getItemizedTabsetDetails();
        },
        () => {
          this.getItemizedTabsetDetails();
        }
      );
  }
  /* * This method is to call service for Bill Summary*/
  getAdjustmentDashboardBillDetails() {
    this.billingRoutingService.navigateToDashboardBill(
      this.selectedDate,
      this.billNumber,
      false,
      this.initialStartDate,
      this.idNumber
    );
    this.getAdjustmentBillBreakUpService(this.idNumber);
  }
  /** * This method is to get bill details on selected date*/
  getAdjustmentBillDetailsOnSelectedDate(date: string) {
    this.pageNo = 0;
    this.selectedDate = convertToYYYYMMDD(startOfMonth(moment(date).toDate()).toString());
    if (this.selectedDate) {
      if (this.detailedBillService.getBillOnMonthChanges !== undefined)
        this.detailedBillService.getBillOnMonthChanges(this.idNumber, this.selectedDate).subscribe(
          resp => {
            if (resp.bills[0]) {
              this.billNumber = resp.bills[0].billNumber;
              this.isBillNumber = false;
            } else this.isBillNumber = true;
            this.getInstallmentDetails();
            this.getViolationDetails();
            this.detailedBillService
              .getRejectedOHDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
              .subscribe(responseData => {
                this.rejectedOHDetail = responseData;
                if (this.rejectedOHDetail) this.getItemizedTabsetDetails();
              });
            this.detailedBillService
              .getBillBreakup(this.idNumber, this.billNumber, this.selectedDate, this.entityType)
              .subscribe((response: BillDetails) => {
                this.adjustmentBillDetails = response;
                if (
                  this.adjustmentBillDetails.initialBillStartDate?.gregorian <
                  this.adjustmentBillDetails.ameenStartDate?.gregorian
                )
                  this.initialStartDate = convertToYYYYMMDD(
                    startOfMonth(this.adjustmentBillDetails.ameenStartDate?.gregorian)?.toString()
                  );
                else
                  this.initialStartDate = convertToYYYYMMDD(
                    startOfMonth(this.adjustmentBillDetails.initialBillStartDate?.gregorian)?.toString()
                  );
                if (this.adjustmentBillDetails.totalDebitAdjustment === 0) {
                  if (this.adjustmentBillDetails.totalContribution !== 0) {
                    this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
                  } else if (this.adjustmentBillDetails.totalReceiptsAndCredits !== 0) {
                    this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
                  } else if (this.rejectedOHDetail.amount !== 0) {
                    this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
                  } else if (this.installmentDetails.totalInstallmentAmount !== null) {
                    this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
                  } else if (this.violationDetail.totalViolationAmountAggregate > 0) {
                    this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
                  } else this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
                  this.router.navigate([this.adjustUrl], {
                    queryParams: {
                      monthSelected: convertToYYYYMMDD(this.selectedDate),
                      billNumber: this.billNumber,
                      mofFlag: this.isMofFlag,
                      registerNo: this.idNumber,
                      billStartDate: convertToYYYYMMDD(this.initialStartDate)
                    }
                  });
                }
                this.getCancledPaymentDetails(this.idNumber, this.selectedDate);
                this.getItemizedTabsetDetails();             
                this.getAdjustmentDetails(this.filterSearchDetails);
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
  /**  * This method is to call Billing Header service  */
  getAdjustmentBillingHeaderService(idNo: number) {
    this.isInitialStatus = true;
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((res: EstablishmentHeader) => {
      this.adjustmentEstablishmentHeader = res;
      this.isGccCountry = res.gccCountry;
      this.isPPA = res.ppaEstablishment;
      if (this.isGccCountry) {
        Object.keys(GccCountry).forEach(data => {
          if (GccCountry[data] === res.gccEstablishment.country.english) {
            this.selectedCountry = data;
          }
        });
      }
      if (
        this.currentCurrency !== BillingConstants.CURRENCY_SAR.english &&
        this.currentCurrency === this.selectedCountry
      ) {
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.selectedCountry, currentDate)
          .subscribe(key => {
            this.exchangeRate = key;
            this.currencySelected.english = this.selectedCountry;
            this.currencySelected.arabic = CurrencyArabicShortForm[this.currencySelected.english];
          }, noop);
      } else {
        this.currencySelected = BillingConstants.CURRENCY_SAR;
        this.exchangeRate = 1;
      }
    }, noop);
  }
  currencyValueChange(selectedValue: string) {
    if (
      this.currencySelected.english !== selectedValue &&
      selectedValue === this.selectedCountry &&
      this.isGccCountry &&
      selectedValue !== BillingConstants.CURRENCY_SAR.english
    ) {
      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      this.exchangeRateService
        .getExchangeRate(BillingConstants.CURRENCY_SAR.english, selectedValue, currentDate)
        .subscribe(res => {
          this.exchangeRate = res;
          this.currencySelected.english = selectedValue;
          this.currencySelected.arabic = CurrencyArabicShortForm[selectedValue];
        }, noop);
    } else {
      if (selectedValue === BillingConstants.CURRENCY_SAR.english) {
        this.currencySelected.english = BillingConstants.CURRENCY_SAR.english;
        this.currencySelected.arabic = BillingConstants.CURRENCY_SAR.arabic;
        this.exchangeRate = 1;
      } else {
        this.exchangeRate = this.exchangeRate;
        this.currencySelected = this.currencySelected;
      }
    }
  }
  /** Method is used to fetch itemized adjustment details */
  getItemizedBillBackDatedWage(idNo: number) {
    this.detailedBillService
      .getBillBreakup(idNo, this.billNumber, this.selectedDate, this.entityType)
      .subscribe((res: BillDetails) => {
        this.billDetails = res;
        this.detailedBillService
          .getRejectedOHDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
          .subscribe(
            responseData => {
              this.rejectedOHDetail = responseData;
              if (this.rejectedOHDetail) this.getItemizedTabsetDetails();
            },
            () => {
              this.getItemizedTabsetDetails();
            }
          );
        this.billNumber = res.billNo;
        this.getAdjustmentDetails(this.filterSearchDetails);
      }, noop);
  }
  /**  * This method to get adjustment details */
  getAdjustmentDetails(filterSearchDetails?: RequestList) {
    this.getItemizedDebitAdjustmentDetails('WAGE_INCREASE', filterSearchDetails).subscribe(wageChangeRes => {
      this.wageChange = wageChangeRes;
      this.wageChangeTotal = this.wageChange.total;
    }, noop);
    this.getItemizedDebitAdjustmentDetails('PERIOD_INCREASE', filterSearchDetails).subscribe(periodDecreaseRes => {
      this.periodChange = periodDecreaseRes;
      this.periodChangeTotal = this.periodChange.total;
    }, noop);
    this.getItemizedDebitAdjustmentDetails('BACKDATED_COVERAGE_ADDITION', filterSearchDetails).subscribe(
      coverageChangeRes => {
        this.coverageChange = coverageChangeRes;
        this.backdatedCovergeAdditionTotal = this.coverageChange.total;
      },
      noop
    );
    this.getItemizedDebitAdjustmentDetails('BACKDATED_REGISTRATION', filterSearchDetails).subscribe(
      registrationChangeRes => {
        this.registrationChange = registrationChangeRes;
        this.regChangeTotal = this.registrationChange.total;
      },
      noop
    );
    this.getItemizedDebitAdjustmentDetails('REACTIVATE_ENGAGEMENT', filterSearchDetails).subscribe(
      registrationChangeRes => {
        this.reactivateRegistrationChange = registrationChangeRes;
        this.reactivateRegChangeTotal = this.reactivateRegistrationChange.total;
      },
      noop
    );
    this.getItemizedDebitAdjustmentDetails('OH_RATE_INCREASE', filterSearchDetails).subscribe(
      ohRateChangeRes => {
        this.ohRateChange = ohRateChangeRes;
        this.ohRateTotal = this.ohRateChange.total;
      },
      noop
    );
    this.getItemizedDebitAdjustmentDetails('COVERAGE_ADDITION', filterSearchDetails).subscribe(
      coverageAdditionRes => {
        this.coverageAddition = coverageAdditionRes;
        this.coverageAdditionTotal = this.coverageAddition.total;
      },
      noop
    )
    this.getItemizedCreditRefundDetails(this.idNumber, this.selectedDate, 'CONTRIBUTOR').subscribe(
      creditRefundChangeRes => {
        this.contributorRefundChange = creditRefundChangeRes;
        this.contributorRefundChangeTotal = this.contributorRefundChange.totalAmount;
      },
      noop
    );
    this.getItemizedCreditRefundDetails(this.idNumber, this.selectedDate, 'ESTABLISHMENT').subscribe(data => {
      this.creditRefundChange = data;
      this.creditRefundChangeTotal = this.creditRefundChange.totalAmount;
    }, noop);

    this.getItemizedCreditTransferDetails(this.idNumber, this.selectedDate).subscribe(creditTransferRes => {
      this.creditTransferChange = creditTransferRes;
    }, noop);
  }
  /** Method is used to fetch backdated adjustment details */
  getItemizedDebitAdjustmentDetails(
    type: string,
    filterSearchDetails?: RequestList
  ): Observable<ItemizedAdjustmentWrapper> {
    return new Observable((ob: Observer<ItemizedAdjustmentWrapper>): void => {
      this.detailedBillService
        .getItemizedDebitAdjustment(
          this.idNumber,
          this.billNumber,
          this.pageNo,
          this.pageSize,
          type,
          this.entityType,
          this.searchKey,
          filterSearchDetails
        )
        .subscribe((value: ItemizedAdjustmentWrapper) => {
          ob.next(value);
          ob.complete();
        }, noop);
    });
  }
  /** Method is used fetch details based on selected page */
  getselectPageNumber(selectedpageNo: number, type: string) {
    this.pageNo = selectedpageNo;
    this.getItemizedCreditForSelectedPage(type);
  }
  /** Method is used fetch itemized adjustment details based on selected page */
  getItemizedCreditForSelectedPage(type) {
    this.detailedBillService
      .getItemizedDebitAdjustment(
        this.idNumber,
        this.billNumber,
        this.pageNo,
        this.pageSize,
        type,
        this.entityType,
        this.searchKey,
        this.filterSearchDetails
      )
      .subscribe((res: ItemizedAdjustmentWrapper) => {
        if (type === 'WAGE_INCREASE') {
          this.wageChange = res;
        } else if (type === 'PERIOD_INCREASE') {
          this.periodChange = res;
        } else if (type === 'BACKDATED_COVERAGE_ADDITION') {
          this.coverageChange = res;
        } else if (type === 'BACKDATED_REGISTRATION') {
          this.registrationChange = res;
        } else if (type === 'OH_RATE_INCREASE') {
          this.ohRateChange = res;
        }

      }, noop);
  }
  /** * This method is to navigate with new date selected on the mof emp summary page */
  mofCalendarDatechanged(DateChanged: string) {
    this.selectedDate = convertToYYYYMMDD(DateChanged);
    this.detailedBillService.getBillNumber(this.idNumber, this.selectedDate).subscribe(res => {
      this.billNumber = res.bills[0].billNumber;
      if (this.billNumber) {
        this.detailedBillService
          .getBillBreakup(this.idNumber, this.billNumber, this.selectedDate, this.entityType)
          .subscribe((response: BillDetails) => {
            this.billDetails = response;
            if (this.billDetails.totalContribution > 0) {
              this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
            } else if (this.billDetails.totalDebitAdjustment > 0) {
              this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
            } else if (this.billDetails.totalReceiptsAndCredits > 0) {
              this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
            } else if (this.rejectedOHDetail.amount !== 0) {
              this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
            }
            this.router.navigate([this.selectedUrl], {
              queryParams: {
                monthSelected: convertToYYYYMMDD(this.selectedDate),
                mofFlag: this.isMofFlag,
                billNumber: this.billNumber,
                registerNo: this.idNumber,
                billStartDate: convertToYYYYMMDD(this.initialStartDate)
              }
            });
            this.noOfDays = moment(this.selectedDate).daysInMonth();
            this.getItemizedTabsetDetails();
            this.getAdjustmentDetails();
          }, noop);
      }
    }, noop);
  }
  // Method to sort debit tables
  getDebitsSortList(sortList) {
    if (sortList.sortBy && sortList.sortBy.value) {
      if (sortList.sortBy.value.english === 'Contributor Name') {
        if (this.lang === 'en') this.filterSearchDetails.sort.column = 'CONTRIBUTOR_NAME_ENG';
        else this.filterSearchDetails.sort.column = 'CONTRIBUTOR_NAME_ARB';
      } else if (sortList.sortBy.value.english === 'Contributory Wage')
        this.filterSearchDetails.sort.column = 'CONTRIBUTORY_WAGE';
      else if (sortList.sortBy.value.english === 'Adjustment Date')
        this.filterSearchDetails.sort.column = 'ADJUSTMENT_DATE';
      else if (sortList.sortBy.value.english === 'Late Fees') this.filterSearchDetails.sort.column = 'LATE_FEE';
      else if (sortList.sortBy.value.english === 'Total Amount') this.filterSearchDetails.sort.column = 'TOTAL_AMOUNT';
      else if (sortList.sortBy.value.english === 'Period (From)')
        this.filterSearchDetails.sort.column = 'ADJ_FROM_PERIOD';
      else if (sortList.sortBy.value.english === 'Calculation Rate (New)')
        this.filterSearchDetails.sort.column = 'CONTRIBUTORY_WAGE';
    }
    this.filterSearchDetails.sort.direction = sortList.sortOrder;
    this.getAdjustmentDetails(this.filterSearchDetails);
  } // Method to search based on search  values
  getSearchValues(searchValues, type: string) {
    if (type === 'BACKDATED_REGISTRATION') {
      this.regFlag = true;
    } else if (type === 'PERIOD_INCREASE') {
      this.increaseFlag = true;
    } else if (type === 'WAGE_INCREASE') {
      this.wageIncreaseFlag = true;
    } else if (type === 'BACKDATED_COVERAGE_ADDITION') {
      this.coverageFlag = true;
    } else if ( type === 'OH_RATE_INCREASE') {
      this.ohFlag = true;
    } else if (type === 'REACTIVATE_ENGAGEMENT') {
      this.reactivateFlag = true;
    }
    this.searchKey = searchValues;
    this.pageNo = 0;
    this.getAdjustmentDetails(this.filterSearchDetails);
  } // Method to get response based on filter values
  getAdjustmentFilterDetails(filterParams: RequestList, type: string) {
    if (type === 'BACKDATED_REGISTRATION') {
      this.regFlag = true;
    } else if (type === 'PERIOD_INCREASE') {
      this.increaseFlag = true;
    } else if (type === 'WAGE_INCREASE') {
      this.wageIncreaseFlag = true;
    } else if (type === 'BACKDATED_COVERAGE_ADDITION') {
      this.coverageFlag = true;
    } else if ( type === 'OH_RATE_INCREASE') {
      this.ohFlag = true;
    } else if (type === 'REACTIVATE_ENGAGEMENT') {
      this.reactivateFlag = true;
    }
    this.filterSearchDetails = filterParams;
    this.searchKey = undefined;
    this.pageNo = 0;
    this.getAdjustmentDetails(this.filterSearchDetails);
  } /** Method is used fetch details based on selected page */
  getselectPageDetails(selectedpageNo: number, toEntity: string) {
    this.getselectPageDetail(selectedpageNo, this.idNumber, this.selectedDate, toEntity);
  }
   /**
   * This method is to select the page number on pagination
   */
   getselectPage(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getCancledPaymentDetails(this.idNumber, this.selectedDate);
  }
  downloadAdjustmentDetailedBill(val) {
    if (val === 'PDF') {
      this.fileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_AR;
      this.type = 'application/pdf';
    } else {
      this.fileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_AR;
      this.type = 'application/vnd.ms-excel';
    }
    this.reportStatementService
      .downloadDetailedBill('', this.idNumber, this.billNumber, false, this.languageType, val)
      .subscribe(data => {
        downloadFile(this.fileName, this.type, data);
      });
  }
  getMiscAdjustmentDetails(idNumber: number){
    this.startDateCalender.gregorian = this.startDateMisc;
    this.startDateCalender.entryFormat = CalendarTypeEnum.GREGORIAN;
    this.startDateCalender.hijiri = null;
    this.miscAdjustmentRequest.startDate = this.startDateCalender
    this.miscAdjustmentRequest.miscellaneousAdjustmentType = MiscellaneousConstants.MISC_DEBIT;

    this.miscAdjustmentService.getMiscProcessedAdjustment(idNumber, this.miscAdjustmentRequest)
    .pipe(
      tap(res => {
        this.miscAdjustmentResponse = res;
      }),
      catchError(err => {
        this.alertService.showError(err.error.message);
        return throwError(err.error.message);
      })
    )
    .subscribe(noop, noop);
  }

  /* getting cancled payment details */
  getCancledPaymentDetails(idNumber: number, startDate: string){
    this.detailedBillService.getCancledPaymentDetails(idNumber, startDate)
      .subscribe(res => {
        this.cancledReceiptDetails = res;
      },
        err => {
          this.alertService.showError(err.error.message);
          return throwError(err.error.message);
      });
  }
}
