/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AppConstants,
  LookupService,
  LovList,
  StorageService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  AlertService,
  CurrencyToken,
  BilingualText,
  ExchangeRateService,
  downloadFile,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { BillingConstants } from '../../../shared/constants';
import { FilterParams, ReceiptWrapper, EstablishmentHeader } from '../../../shared/models';
import {
  BillDashboardService,
  ContributionPaymentService,
  BillingRoutingService,
  DetailedBillService,
  ReportStatementService
} from '../../../shared/services';
import { GccCountry, LanguageTypeEnum } from '../../../shared/enums';
import moment from 'moment-timezone';
import { ReportConstants } from '../../../shared/constants/report-constants';

@Component({
  selector: 'blg-receipt-sc',
  templateUrl: './receipt-sc.component.html',
  styleUrls: ['./receipt-sc.component.scss']
})
export class ReceiptScComponent implements OnInit {
  /**Local variables. */
  sortedDirection = 'ASC';
  sortedField: string;
  resultFlag = false;
  idNumber: number;
  isInitialCurrencyChange = true;
  identifier = new FormControl(); //Identifier for search
  receiptList: ReceiptWrapper;
  currentCurrency = 'SAR';
  filterParams = new FilterParams();
  filterValues = new FilterParams();
  isAppPrivate = true;
  isSearchRequired: boolean;
  navigateFlag = false;
  selectedDate: string;
  billNumber: number;
  originFromPublicBillDashBoard: boolean;
  pageNo = 0;
  pageSize = 10;
  isMofReceiptFlag = false;
  isVicReceipt = false;
  searchFlag = false;
  selectedCurrency: string;
  exchangeRate = 1;
  isGccEstablishment: boolean;
  registrationNo: number;
  lang = 'en';
  enitytType = 'ESTABLISHMENT';
  languageType: string;
  previousSelectedCurrency: string;
  registrationStatus: BilingualText = new BilingualText();
  exchangeRateValue = 1;
  isFirstSerach = false;
  filterPage = 0;
  isSearch = false;
  initialStartDate: string;
  /** Observables */
  receiptModes$: Observable<LovList>;
  receiptStatus$: Observable<LovList>;
  receiptSortFields$: Observable<LovList>;

  /**
   * Creates an instance of ReceiptScComponent
   * @param storageService  storage service
   * @param contributionPaymentService contribution payment service
   * @param establishmentService establishment service
   * @param route route
   * @param documentService document service
   * @param lookupService lookup service
   */
  constructor(
    readonly storageService: StorageService,
    readonly detailedBillService: DetailedBillService,
    readonly billDashboardService: BillDashboardService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly route: ActivatedRoute,
    readonly lookupService: LookupService,
    readonly router: Router,
    readonly exchangeRateService: ExchangeRateService,
    readonly alertService: AlertService,
    readonly reportStatementService: ReportStatementService,
    readonly billingRoutingService: BillingRoutingService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  /** This method handles initializaton task. */
  ngOnInit() {
    this.alertService.clearAllErrorAlerts();
    this.idNumber = this.establishmentRegistrationNo.value;
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params.monthSelected;
      if(params.monthSelected) {
      this.isSearch = params.isSearch;
      this.billNumber = params.billNumber
      this.initialStartDate = params.initialStartDate;
      this.idNumber = params.registerNo;
      }
            if (params.pageNo) {
        this.pageNo = Number(params.pageNo);
        this.searchFlag = params.searchFlag;
        this.idNumber = params.idNo;
      }
    });
    this.initialiseWithRoute();
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });

    this.originFromPublicBillDashBoard = this.billDashboardService.paymentReceiptOrigin;
    this.getLookupValues();
    this.isSearchRequired = this.checkSearchRequired();
    if (!this.searchFlag && !this.idNumber) {
      this.idNumber = this.getKeyValue();
    }
    if (this.idNumber || this.searchFlag) {
      this.isFirstSerach = true;
      this.getReceiptList();
    }
    if (this.isSearch) {
      this.isSearchRequired = false;
      this.idNumber = this.establishmentRegistrationNo.value;
      this.getReceiptList();
    }
    this.currency.subscribe(currentCurrencyKey => {
      this.selectedCurrency = currentCurrencyKey;
      this.getRegistrationStatus();
      if (!this.isInitialCurrencyChange) {
        this.getCurrencyExchangeRate(this.selectedCurrency);
      }
    });
  }
  initialiseWithRoute() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params && params.get('registrationNo')) {
        this.idNumber = Number(params.get('registrationNo'));
      }
    });
  }
  /** Method to get the key value for search. */
  getKeyValue() {
    if (!this.isAppPrivate) return this.establishmentRegistrationNo.value;
    //If registartion number is already present, search is not required
    else if (this.isSearchRequired && this.contributionPaymentService.registrationNumber) {
      this.isSearchRequired = false;
      const registrationNumber = this.contributionPaymentService.registrationNumber;
      //clearing values from service after navigating back from cancel receipt
      this.contributionPaymentService.registrationNumber = undefined;
      this.contributionPaymentService.receiptNumber = undefined;
      return registrationNumber;
    }
  }

  /** Method to get lookup values. */
  getLookupValues() {
    this.receiptModes$ = this.lookupService.getReceiptMode();
    this.receiptStatus$ = this.lookupService.getReceiptStatus();
    this.receiptSortFields$ = this.lookupService.getReceiptSortFields();
  }

  /** Method to check whether search is required. */
  checkSearchRequired() {
    //Search is required for Field Office and Contributor
    return this.isAppPrivate;
  }

  /**
   * Method to get receipt list for the entity.
   * @param filterParams filterParams
   */
  getReceiptList(filterParams?) {
    if (filterParams?.isSearch) {
      this.filterValues.parentReceiptNo = filterParams.filterParams.parentReceiptNo;
      this.pageNo = 0;
    } else if (filterParams?.isfilter) {
      this.filterValues.receiptFilter.receiptDate.endDate = filterParams.filterParams.receiptFilter.receiptDate.endDate;
      this.filterValues.receiptFilter.receiptDate.startDate =
        filterParams.filterParams.receiptFilter.receiptDate.startDate;
      this.filterValues.receiptFilter.endDate = filterParams.filterParams.receiptFilter.endDate;
      this.filterValues.receiptFilter.startDate = filterParams.filterParams.receiptFilter.startDate;
      this.filterValues.receiptFilter.receiptMode = filterParams.filterParams.receiptFilter.receiptMode;
      this.filterValues.receiptFilter.status = filterParams.filterParams.receiptFilter.status;
      this.filterValues.receiptFilter.minAmount = filterParams.filterParams.receiptFilter.minAmount;
      this.filterValues.receiptFilter.maxAmount = filterParams.filterParams.receiptFilter.maxAmount;
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
      this.filterValues.receiptFilter.endDate = null;
      this.filterValues.receiptFilter.startDate = null;
      this.filterValues.receiptFilter.receiptDate.endDate = null;
      this.filterValues.receiptFilter.receiptDate.startDate = null;
      this.filterValues.receiptFilter.receiptMode = null;
      this.filterValues.receiptFilter.status = null;
    }
    if (!this.searchFlag) {
      if (this.isSearchRequired && !this.idNumber) {
        this.idNumber = Number(this.identifier.value);
      }
    }
    this.registrationNo = this.idNumber;
    this.detailedBillService
      .getReceipts(
        this.idNumber,
        this.filterValues,
        this.enitytType,
        this.pageNo,
        this.pageSize,
        this.isMofReceiptFlag,
        this.sortedField,
        this.sortedDirection
      )
      .subscribe(res => {
        this.receiptList = res;
        if (res) {
          this.resultFlag = true;
        }
      });
  }
  printTransaction(receiptNo: number) {
    this.reportStatementService
      .generatePaymentsReport(Number(this.idNumber), Number(receiptNo), false, this.languageType)
      .subscribe(res => {
        if (res) {
          const file = new Blob([res], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      });
  }
  downloadTransaction(receiptNo: number) {
    this.reportStatementService
      .generatePaymentsReport(this.registrationNo, receiptNo, false, this.languageType)
      .subscribe(data => {
        downloadFile(ReportConstants.PRINT_BILL_FILE_NAME, 'application/pdf', data);
      });
  }

  /**
   * Method to get receipt details.
   * @param receiptNo receipt number
   */
  getReceiptDetails(receiptNo: number) {
    this.router.navigate([BillingConstants.RECEIPT_DETAILS_ROUTE], {
      queryParams: {
        receiptNo: receiptNo,
        pageNo: this.pageNo,
        idNo: this.idNumber
      }
    });
  }

  /** Method to navigate back to billdashboarrd */
  navigateBackToBillDashBoard() {
    this.billingRoutingService.navigateToDashboardBill(
      this.selectedDate,
      this.billNumber,
      false,
      this.initialStartDate,
      this.idNumber
    );
    this.billDashboardService.paymentReceiptOrigin = false;
  }

  /**
   * This method is to select the page number on pagination
   */
  getselectPageNo(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getReceiptList(this.filterValues);
  }
  /* Method to get Registration status  for header component*/
  getRegistrationStatus() {
    this.isInitialCurrencyChange = false;
    this.detailedBillService.getBillingHeader(this.registrationNo, true).subscribe((res: EstablishmentHeader) => {
      this.registrationStatus = res.status;
      if (res.gccEstablishment) {
        this.isGccEstablishment = res.gccEstablishment.gccCountry;
        Object.keys(GccCountry).forEach(data => {
          if (GccCountry[data] === res.gccEstablishment.country.english) {
            this.previousSelectedCurrency = data;
          }
        });
        if (this.previousSelectedCurrency === this.selectedCurrency) {
          const currentDate = moment(new Date()).format('YYYY-MM-DD');
          this.exchangeRateService
            .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.previousSelectedCurrency, currentDate)
            .subscribe(response => {
              this.exchangeRateValue = response;
              this.getCurrencyExchangeRate(this.selectedCurrency);
            });
        }
      }
    });
  }
  /** Method to get  currency exchange rate change */
  getCurrencyExchangeRate(newSelectedCurrency: string) {
    if (this.isGccEstablishment) {
      if (newSelectedCurrency === BillingConstants.CURRENCY_SAR.english) {
        this.exchangeRateValue = 1;
        this.currentCurrency = newSelectedCurrency;
      } else if (newSelectedCurrency === this.previousSelectedCurrency) {
        this.currentCurrency = this.previousSelectedCurrency;
      }
    } else {
      this.exchangeRateValue = 1;
    }
  }
  /**
   * This method is used to get field values for sorting
   */
  getEstSortFields(sortedField) {
    this.sortedField = sortedField;
    this.getReceiptList(this.filterValues);
  }
  // This method is used to get sorting direction.
  getEstSortedDirection(sortedDirection) {
    this.sortedDirection = sortedDirection;
    this.getReceiptList(this.filterValues);
  }
}
