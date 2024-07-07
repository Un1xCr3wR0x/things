/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LookupService,
  StorageService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  AlertService,
  CurrencyToken,
  BilingualText,
  ExchangeRateService,
  LovList,
  downloadFile,
  LanguageToken
} from '@gosi-ui/core';
import { BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';
import { BehaviorSubject, Observable } from 'rxjs';

import { BillingConstants, BreadCrumbConstants, ReportConstants } from '../../../shared/constants';
import { LanguageTypeEnum } from '../../../shared/enums';
import { FilterParams, ReceiptWrapper } from '../../../shared/models';
import {
  BillDashboardService,
  ContributionPaymentService,
  BillingRoutingService,
  DetailedBillService,
  ReportStatementService
} from '../../../shared/services';

@Component({
  selector: 'blg-vic-receipt-sc',
  templateUrl: './vic-receipt-sc.component.html',
  styleUrls: ['./vic-receipt-sc.component.scss']
})
export class VicReceiptScComponent implements OnInit {
  /**Local variables. */
  hideVerification: string;
  sinNo: number;
  isInitialCurrencyChange = true;
  identifier = new FormControl(); //Identifier for search
  receiptList: ReceiptWrapper;
  currentCurrency = 'SAR';
  filterParams = new FilterParams();
  filterValues = new FilterParams();
  isAppPrivate = true;
  navigateFlag = false;
  selectedDate: string;
  originFromPublicBillDashBoard: boolean;
  pageNo = 0;
  pageSize = 10;
  isMofReceiptFlag = false;
  isVicReceipt = true;
  searchFlag = false;
  selectedCurrency: string;
  exchangeRate = 1;
  isGccEstablishment: boolean;
  registrationNo: number;
  previousSelectedCurrency: string;
  registrationStatus: BilingualText = new BilingualText();
  exchangeRateValue = 1;
  isFirstSerach = false;
  filterPage = 0;
  lang = 'en';
  languageType: string;
  isSearch = false;
  sortedDirection = 'ASC';
  sortedField: string = 'TRANSACTION_DATE';
  initialStartDate: string;
  @ViewChild('brdcmb', { static: false })
  cntBillingBrdcmb: BreadcrumbDcComponent;
  /** Observables */
  receiptModes$: Observable<LovList>;
  receiptSortFields$: Observable<LovList>;
  receiptStatus$: Observable<LovList>;
  individualApp = false;
  resultFlag: boolean = true;

  /**
   * Creates an instance of ReceiptScComponent
   * @param storageService  storage service
   * @param documentService document service
   * @param establishmentService establishment service
   * @param route route
   * @param lookupService lookup service
   *  @param contributionPaymentService contribution payment service
   */
  constructor(
    readonly storageService: StorageService,
    readonly detailedBillService: DetailedBillService,
    readonly billDashboardService: BillDashboardService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly reportStatementService: ReportStatementService,
    readonly route: ActivatedRoute,
    readonly exchangeRateService: ExchangeRateService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly router: Router,
    readonly billingRoutingService: BillingRoutingService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location
  ) {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  /** This method handles initializaton task. */
  ngOnInit() {
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.individualApp = true;
    }
    this.alertService.clearAlerts();
    this.getLookupValues();
    this.route.queryParams.subscribe(params => {
      this.isSearch = params.isSearch;
      this.sinNo = params.idNo;
      if (params.pageNo) {
        this.pageNo = Number(params.pageNo);
        this.searchFlag = params.searchFlag;
        this.sinNo = params.idNo;
      }
      if (params.idNo) {
        this.getVicReceiptList();
      } else {
        this.resultFlag = false;
      }
    });
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.originFromPublicBillDashBoard = this.billDashboardService.paymentReceiptOrigin;
  }
  ngAfterViewInit() {
    if (this.individualApp) {
      this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.RECEIPT_BREADCRUMB_VALUES;
    }
  }
  /** Method to get lookup values. */
  getLookupValues() {
    this.receiptModes$ = this.lookupService.getReceiptMode();
    this.receiptStatus$ = this.lookupService.getReceiptStatus();
    this.receiptSortFields$ = this.lookupService.getReceiptSortFields();
  }

  getVicReceiptListOnload() {
    this.sinNo = Number(this.identifier.value);
    this.getVicReceiptList();
  }

  /**
   * Method to get receipt list for the entity.
   * @param filterParams filterParams
   */
  getVicReceiptList(filterParams?) {
    if (filterParams?.isSearch) {
      this.filterValues.parentReceiptNo = filterParams.filterParams.parentReceiptNo;
      this.pageNo = 0;
    } else if (filterParams?.isfilter) {
      this.filterValues.receiptFilter.receiptDate.endDate = filterParams.filterParams.receiptFilter.receiptDate.endDate;
      this.filterValues.receiptFilter.maxAmount = filterParams.filterParams.receiptFilter.maxAmount;
      this.filterValues.receiptFilter.receiptDate.startDate =
        filterParams.filterParams.receiptFilter.receiptDate.startDate;
      this.filterValues.receiptFilter.minAmount = filterParams.filterParams.receiptFilter.minAmount;
      this.pageNo = 0;
    }
    if (this.isFirstSerach && filterParams) {
      this.isFirstSerach = false;
      this.filterValues.parentReceiptNo = filterParams.parentReceiptNo;
    }
    if (filterParams) {
      this.filterValues = this.filterValues;
    } else {
      if (this.navigateFlag && this.filterParams.parentReceiptNo) {
        this.filterValues.parentReceiptNo = null;
      }
      this.filterValues.receiptFilter.receiptDate.endDate = null;
      this.filterValues.receiptFilter.receiptDate.startDate = null;
    }
    if (!this.searchFlag) {
    }
    this.registrationNo = this.sinNo;
    this.detailedBillService
      .getVicReceiptList(
        this.sinNo,
        this.filterValues,
        this.pageNo,
        this.pageSize,
        this.sortedField,
        this.sortedDirection
      )
      .subscribe(res => {
        this.receiptList = res;
        if (res) {
          this.resultFlag = true;
        } else {
          this.resultFlag = false;
        }
      });
  }

  /**
   * Method to get receipt details.
   * @param receiptNo receipt number
   */
  getVicReceiptDetails(receiptNo: number) {
    this.router.navigate([BillingConstants.VIC_RECEIPT_DETAILS_ROUTE], {
      queryParams: {
        receiptNo: receiptNo,
        pageNo: this.pageNo,
        sinNo: this.sinNo
      }
    });
  }

  /** Method to navigate back to billdashboarrd */
  navigateBackToVicBillDashBoard() {
    const fromVicPage = true;
    // this.billingRoutingService.navigateToDashboardBill(
    //   this.selectedDate,
    //   this.sinNo,
    //   fromVicPage,
    //   this.initialStartDate
    // );
    this.billDashboardService.paymentReceiptOrigin = false;
    this.location.back();
  }

  /**
   * This method is to select the page number on pagination
   */
  getselectPageNo(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getVicReceiptList(this.filterValues);
  }
  /**
   * This method is to download the transaction
   */
  downloadVicTransaction(receiptNo: number) {
    this.reportStatementService.generateVicReciept(this.sinNo, receiptNo, this.languageType).subscribe(data => {
      downloadFile(ReportConstants.PRINT_BILL_FILE_NAME, 'application/pdf', data);
    });
  }
  printVicTransaction(receiptNo: number) {
    this.reportStatementService.generateVicReciept(this.sinNo, receiptNo, this.languageType).subscribe(res => {
      const file = new Blob([res], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  }
  /**
   * This method is to sget sort field value
   */
  getSortedFieldDetails(sortedField) {
    this.sortedField = sortedField;
    this.getVicReceiptList(this.filterValues);
  }
  // This method is used to get sorting direction.
  getSortedDirection(sortedDirection) {
    this.sortedDirection = sortedDirection;
    this.getVicReceiptList(this.filterValues);
  }
}
