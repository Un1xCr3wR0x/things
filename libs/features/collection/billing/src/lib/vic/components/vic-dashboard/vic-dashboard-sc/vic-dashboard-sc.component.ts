/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ArabicName,
  BilingualText,
  CalendarService,
  ContributorToken,
  ContributorTokenDto,
  convertToStringDDMMYYYY,
  convertToYYYYMMDD,
  downloadFile,
  LanguageToken,
  LookupService,
  startOfMonth,
  subtractMonths,
  LovList,
  Lov,
  endOfMonth,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { BillingConstants, ReportConstants } from '../../../../shared/constants';
import { LanguageTypeEnum } from '../../../../shared/enums';
import { BillDetails, BillDropMonth, BillHistoryWrapper, BillPeriods } from '../../../../shared/models';
import { BillDashboardService, BillingRoutingService, ReportStatementService } from '../../../../shared/services';

@Component({
  selector: 'blg-vic-dashboard-sc',
  templateUrl: './vic-dashboard-sc.component.html',
  styleUrls: ['./vic-dashboard-sc.component.scss']
})
export class VicDashboardScComponent implements OnInit, OnDestroy {
  /** Local Variables */
  lang = 'en';
  billHistory: BillHistoryWrapper = new BillHistoryWrapper();
  languageType: string;
  alertFlag = false;
  sinNumber: number;
  billNumber: number;
  billDetails: BillDetails = new BillDetails();
  monthSelectedDate: string;
  vicDetailsFlag = true;
  nameEng: string;
  nameArb: ArabicName = new ArabicName();
  firstStartDate: Date;
  firstStartDateHijiri: string;
  gregorianDate: Date;
  isBillNumber = false;
  errorMessage: BilingualText = new BilingualText();
  isDisable = false;
  isLoaded = false;
  hijiriDate: string;
  selectedDateFormat: string;
  billPeriodLov: LovList;
  billPeriods: BillPeriods = new BillPeriods();
  currentStartDate: string;
  currentEndDate: string;
  pageSize = 10;
  billHistoryDetails: BillHistoryWrapper = new BillHistoryWrapper();
  page=0;
  selectFlag:Object;
  isReactivate: boolean;
  
  /**
   *
 * Creates an instance of BillingScComponent

   * @param lookUpService
   * @param storageService
   * @param establishmentBillService
   * @param route
   */
  constructor(
    readonly billDashboardService: BillDashboardService,
    readonly alertService: AlertService,
    readonly billingRoutingService: BillingRoutingService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly reportStatementService: ReportStatementService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    @Inject(ContributorToken) readonly contributorToken: ContributorTokenDto,
    readonly calendarService: CalendarService,
    readonly lookupService: LookupService,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {}
  /**
   * This method handles initialization tasks.
   *
   * @memberof BillingScComponent
   */
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });

    this.currentEndDate = convertToYYYYMMDD(endOfMonth(subtractMonths(new Date(), 1)).toString());
    this.currentStartDate = '1980-01-01';


    this.route.queryParams.subscribe(params => {
      this.sinNumber = params.idNo;

      this.vicDetailsFlag = !params.isSearch;
      this.selectedDateFormat = params.entryFormat;
      if (params.monthSelected) {
        this.isLoaded = false;
        this.monthSelectedDate = params.monthSelected;
        this.getHijiriDate(this.monthSelectedDate);
      } else {
        this.isLoaded = true;
        this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1)).toString());
      }
      if (params.billNumber) {
        this.getVicBillBreakupDetails(params.billNumber);
      } else this.getVicBillBreakupDetails(this.contributorToken.nin ? this.contributorToken.nin : params.idNo);
    });
    this.selectFlag=this.routerData.content;
  }
  //  This method is used to get the vic bill break up details
  getVicBillBreakupDetails(idNo) {
    if (idNo) {
      this.alertService.clearAlerts();
      this.sinNumber = idNo;
      this.billDashboardService.getBillYearAndMonths(idNo).subscribe(
        response => {
          this.billPeriods = response;
          this.createYearAndMonthLov(response);
        });
    
      this.billDashboardService.getBillNumber(idNo, this.monthSelectedDate, true).subscribe(
        res => {
          if (res) {
            this.billHistory = res;
            this.billNumber = res.bills[0].billNumber;
            this.isBillNumber = false;
            this.billDashboardService.getVicBillBreakup(idNo, this.billNumber).subscribe((response: BillDetails) => {
              this.billDetails = response;
              this.isReactivate = response.reactivateFlag;
              this.firstStartDate = response.billStartDate?.gregorian;
              this.firstStartDateHijiri = convertToStringDDMMYYYY(response.billStartDate?.hijiri)?.toString();
              if (response.name.english.name !== undefined) {
                this.nameEng = response.name.english.name;
              }
              this.nameArb = response.name.arabic;
              this.vicDetailsFlag = false;
              if (!this.vicDetailsFlag) {
                if(this.isReactivate) this.alertService.showWarningByKey('BILLING.REACTIVATE-VIC-WARNING');
                else this.alertService.showWarningByKey('BILLING.VIC-WARNING');
              }
            });

            this.billDashboardService
              .getBillHistoryVic(idNo, this.currentEndDate, this.currentStartDate, true, this.page, this.pageSize)
              .subscribe((response: BillHistoryWrapper) => {
                this.billHistoryDetails = response;
            });

          }
        },
        err => {
          this.isBillNumber = true;
          this.errorMessage = err.error.message;
          if (this.errorMessage.english === BillingConstants.ERROR_MESSAGE) {
            this.isDisable = true;
          }
          this.vicDetailsFlag = true;
          this.alertService.showError(err.error.message);
        }
      );
    }
  }
  createYearAndMonthLov(billPeriods: BillPeriods){
    const items: Lov[] = [];
    billPeriods.billMonths.forEach((element, i) => {
      const lookUpValue = new Lov();
      lookUpValue.code = element.year;
      lookUpValue.sequence = i;
      const yearBilingual = new BilingualText();
      yearBilingual.arabic = element.year.toString();
      yearBilingual.english = element.year.toString();
      lookUpValue.value = yearBilingual;
      lookUpValue.items = this.createMonthLov(element.months);
      items.push(lookUpValue);
    });
    this.billPeriodLov = new LovList(items);
  }
  createMonthLov(monthList: BillDropMonth[]){
    const items: Lov[] = [];
    monthList.forEach((element, i) => {
      const lookUpValue = new Lov();
      lookUpValue.sequence = i;
      lookUpValue.value = element.months;
      items.push(lookUpValue);
    });
    return items;
  }
  getGregorianDate(hijriDate: string) {   
    this.calendarService.getGregorianDate(hijriDate).subscribe(res => {
      this.gregorianDate = res.gregorian;
      this.getVicBillDetailsOnSelectedDate(moment(new Date(this.gregorianDate)).toDate()?.toString());
    });
  }
  getHijiriDate(hijiri: string) {
    this.lookupService.getHijriDate(moment(new Date(hijiri)).toDate()).subscribe(res => {
      this.hijiriDate = res.hijiri;
    });
  }
  /**
   * This method is to get bill details on selected date
   */
  getVicBillDetailsOnSelectedDate(dateValue: string) {   
    const date = new Date(dateValue);
    this.monthSelectedDate = convertToYYYYMMDD(date.toString());
    if (this.monthSelectedDate) {
      this.billDashboardService.getBillNumber(this.sinNumber, this.monthSelectedDate, false).subscribe(
        res => {
          this.billHistory = res;
          this.billNumber = res.bills[0].billNumber;
          this.isBillNumber = false;
          this.billDashboardService
            .getVicBillBreakup(this.sinNumber, this.billNumber)
            .subscribe((response: BillDetails) => {
              this.billDetails = response;
            });
        },
        err => {
          this.isBillNumber = true;
          this.errorMessage = err.error.message;
          if (this.errorMessage.english === BillingConstants.ERROR_MESSAGE) {
            this.isDisable = true;
          }
        }
      );
    }
  }
  downloadVicBill() {
    this.reportStatementService
      .generateVicBills(Number(this.sinNumber), this.billNumber, this.languageType)
      .subscribe(data => {
        downloadFile(ReportConstants.PRINT_BILL_FILE_NAME, 'application/pdf', data);
      });
  }
  printVicBill() {
    this.reportStatementService
      .generateVicBills(Number(this.sinNumber), this.billNumber, this.languageType)
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
  navigateToVicBillHistory() {
    this.billingRoutingService.navigateToVicBillHistory(this.sinNumber);
  }

  goToVicReceiptHistory() {
    this.router.navigate([BillingConstants.ROUTE_VIC_RECIEPT], {
      queryParams: {
        isSearch: true,
        idNo: Number(this.sinNumber)
      }
    });
    this.billDashboardService.paymentReceiptOrigin = true;
  }

  ngOnDestroy() {
    this.alertService.clearAlerts();
  }
}
