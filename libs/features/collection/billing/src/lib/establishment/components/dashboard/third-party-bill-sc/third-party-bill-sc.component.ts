/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import {
  convertToYYYYMMDD,
  startOfMonth,
  subtractMonths,
  BilingualText,
  downloadFile,
  LanguageToken
} from '@gosi-ui/core';
import { BalanceSummary, BillDetails, GccCurrency, ItemizedContributionMonthWrapper } from '../../../../shared/models';
import {
  BillDashboardService,
  ContributionPaymentService,
  DetailedBillService,
  ReportStatementService
} from '../../../../shared/services';
import { BillingConstants, ReportConstants } from '../../../../shared/constants';
import { FormControl } from '@angular/forms';
import moment, { months } from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, noop } from 'rxjs';
import { LanguageTypeEnum } from '../../../../shared/enums';

@Component({
  selector: 'blg-third-party-bill-sc',
  templateUrl: './third-party-bill-sc.component.html',
  styleUrls: ['./third-party-bill-sc.component.scss']
})
export class ThirdPartyBillScComponent implements OnInit {
  /** Local Variables */

  exchangeRate = 1;
  billDetails: BillDetails = new BillDetails();
  mofEstablishmentBill: BillDetails = new BillDetails();
  itemizedContributionMonth: ItemizedContributionMonthWrapper = new ItemizedContributionMonthWrapper();
  balanceSummaryList: BalanceSummary[] = [];
  currencyType: BilingualText = BillingConstants.CURRENCY_SAR;
  isAdmin = false;
  currentCurrency: GccCurrency = new GccCurrency();
  isGccCountry = false;
  isMofFlag = true;
  lang = 'en';
  languageType: string;
  initialLoad = false;
  billDate: string;
  contributorId = new FormControl();
  idNumber = 1;
  itemizedDataFlag = false;
  noOfDays: number;
  monthSelectedDate: string;
  billStartDate: Date;
  errorMessage: BilingualText = new BilingualText();
  isNoBill = false;
  isDisable = false;
  isNoBillMonthMof = false;
  selectedTabName: string;
  pdfImgSrc = 'assets/images/downloadicons/pdf-on-green-bg-normal.svg';
  excelImgSrc = 'assets/images/downloadicons/xcel-on-green-bg-normal.svg';
  printImgSrc = 'assets/images/downloadicons/print-on-green-bg-normal.svg';
  establishmentType = 'GOSI';
  tabDetails;
  
  constructor(
    readonly billDashboardService: BillDashboardService,
    readonly detailedBillService: DetailedBillService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly reportStatementService: ReportStatementService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  /**
   * This method handles initialization tasks.
   *
   * @memberof MofScComponent
   */
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.monthSelected || params.establishmentType) {
        this.monthSelectedDate = params.monthSelected
          ? params.monthSelected
          : convertToYYYYMMDD(startOfMonth(new Date()).toString());
          this.establishmentType = params.establishmentType;
          this.selectedTabName = this.establishmentType === 'GOSI' ? 'BILLING.GOSI' : 'BILLING.PPA';
                } else {
        this.initialLoad = true;
        
        this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1)).toString());
        //this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(new Date()).toString());
        this.selectedTabName = 'BILLING.GOSI';
      }
      this.getDate(this.monthSelectedDate, true,this.establishmentType);
      this.setTabDetails();
    }, noop);
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
  }
  setTabDetails() {
    this.tabDetails = [];
    if (this.mofEstablishmentBill) {
      this.tabDetails.push({
        tabName: 'BILLING.GOSI',
        amount: this.mofEstablishmentBill.mofCurrentBalanceGosi
      });
      this.tabDetails.push({
        tabName:  'BILLING.PPA',
        amount: this.mofEstablishmentBill.mofCurrentBalancePpa
      });
  }
}

  /**
   * This method is to get date to set max and min date
   */
  getDate(dateValue: string, pageLoad: boolean, establishmentType?: string) {
    this.billDate = convertToYYYYMMDD(startOfMonth(moment(dateValue).toDate()).toString());   
    if (this.billDate) {
      this.monthSelectedDate = this.billDate;
      this.detailedBillService.getMofEstablishmentBill(this.billDate,establishmentType, pageLoad ).subscribe(
        (res: BillDetails) => {
          this.mofEstablishmentBill = res;
          this.billStartDate = res.billStartDate?.gregorian;
          this.isMofFlag = true;
          this.itemizedDataFlag = true;
          this.isAdmin = true;
          this.isNoBill = false;
          this.setTabDetails();
        },
        err => {
          this.errorMessage = err.error.message;
          if (this.errorMessage?.english === BillingConstants.ERROR_MESSAGE_MONTH) this.isNoBillMonthMof = true;
          else if (this.errorMessage?.english === BillingConstants.ERROR_MESSAGE) this.isDisable = true;
          this.isNoBill = true;
        },
        noop
      );
    }
  }
  getEstablishmentType(estType: string){
    this.establishmentType = estType;
    this.getDate(this.monthSelectedDate, true, this.establishmentType);
    this.setTabDetails();
  }
  downloadThirdPartyTransaction() {
    this.reportStatementService
      .generateBillReport(
        convertToYYYYMMDD(this.billStartDate.toString()),
        this.idNumber,
        this.mofEstablishmentBill?.billNo,
        true,
        this.languageType
      )
      .subscribe(data => {
        downloadFile(ReportConstants.PRINT_BILL_FILE_NAME, 'application/pdf', data);
      });
  }
  printThirdPartyTransaction() {
    this.reportStatementService
      .generateBillReport(
        convertToYYYYMMDD(this.billStartDate.toString()),
        Number(this.idNumber),
        Number(this.mofEstablishmentBill?.billNo),
        true,
        this.languageType
      )
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }

  /**
   * This method is used to navigate back to mof detailed bill page
   */
  getBillingSummary() {
    this.router.navigate([BillingConstants.ROUTE_DETAILED_BILL_MOF], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(this.monthSelectedDate),
        billStartDate: convertToYYYYMMDD(this.mofEstablishmentBill?.billStartDate?.gregorian.toString()),
        initialStartDate: convertToYYYYMMDD(this.mofEstablishmentBill?.initialBillStartDate?.gregorian.toString()),
        establishmentType: this.establishmentType
      }
    });
    this.itemizedDataFlag = true;
  }
  navigateToBillHistoryMof() {
    this.router.navigate([BillingConstants.ROUTE_BILL_HISTORY_MOF], {
      queryParams: {
        establishmentType: this.establishmentType
      }
    });
  }
  navigateToBillaAllocattionMof(){
    this.router.navigate([BillingConstants.ROUTE_BILL_ALLOCATION_MOF], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(this.monthSelectedDate),
        maxBilldate: convertToYYYYMMDD(this.mofEstablishmentBill?.issueDate?.gregorian?.toString()),
        establishmentType: this.establishmentType
      }
    });
  }
  goToMofReceiptHistory() {
    this.router.navigate([BillingConstants.MOF_RECEIPT_LIST_ROUTE], {
      queryParams: {
        isSearch: true,
        establishmentType: this.establishmentType
      }
    });
    this.billDashboardService.paymentReceiptOrigin = true;
  }
}
