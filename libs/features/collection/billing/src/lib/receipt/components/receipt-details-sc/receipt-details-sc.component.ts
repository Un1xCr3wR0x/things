/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { AlertService, convertToStringDDMMYYYY } from '@gosi-ui/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  DocumentService,
  ExchangeRateService,
  LovList,
  RoleIdEnum,
  StorageService
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { noop, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BillingConstants } from '../../../shared/constants';
import {
  CurrencyArabic,
  CurrencyArabicShortForm,
  EstablishmentDocumentType,
  GccCountry,
  ReceiptType
} from '../../../shared/enums';
import {
  CurrencyDetails,
  EstablishmentDetails,
  FilterParams,
  PaymentDetails,
  ReceiptWrapper
} from '../../../shared/models';
import { BillDashboardService, ContributionPaymentService, EstablishmentService } from '../../../shared/services';

@Component({
  selector: 'blg-receipt-details-sc',
  templateUrl: './receipt-details-sc.component.html',
  styleUrls: ['./receipt-details-sc.component.scss']
})
export class ReceiptDetailsScComponent implements OnInit {
  /**Local variables. */
  /**Local variables. */
  idNumber: number;
  isAdmin = false;
  receipt: PaymentDetails;
  establishment: EstablishmentDetails;
  documents: DocumentItem[] = [];
  gccFlag: boolean;
  currencyDetails: CurrencyDetails;
  receiptNo: number;
  currencySAR = BillingConstants.CURRENCY_SAR;
  currency: BilingualText;
  isSearchRequired: boolean;
  navigateFlag = false;
  selectedDate: string;
  billNumber: number;
  originFromPublicBillDashBoard: boolean;
  pageNo = 0;
  pageSize = 10;
  isMofReceiptFlag = false;
  filterParams = new FilterParams();
  receiptList: ReceiptWrapper;
  identifier = new FormControl(); //Identifier for searc

  /** Observables */
  receiptModes$: Observable<LovList>;
  receiptStatus$: Observable<LovList>;
  isAppPrivate: boolean;
  accessForCancelReceipt = [RoleIdEnum.GOVERNMENT_COLLECTION_OFFICER, RoleIdEnum.GCC_CSR];
  establishmentType: string;

  constructor(
    readonly alertService: AlertService,
    readonly storageService: StorageService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly establishmentService: EstablishmentService,
    readonly exchangeRateService: ExchangeRateService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly billDashboardService: BillDashboardService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  /** This method handles initializaton task. */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.receiptNo = params.receiptNo;
      this.pageNo = params.pageNo;
      this.isMofReceiptFlag = params.mof;
      this.idNumber = params.idNo;
    });

    this.alertService.clearAlerts();

    this.isSearchRequired = this.checkSearchRequired();
    if (this.isMofReceiptFlag) this.idNumber = 1;
    this.getReceiptDetails(this.receiptNo);
  }
  /** Method to check whether search is required. */
  checkSearchRequired() {
    //Search is required for Field Office and Contributor
    return this.isAppPrivate;
  }
  /**
   * Method to get documents based on receipt mode.
   * @param receiptNo receipt number
   * @param docType document type
   */
  getDocuments(receiptNo: number, docType: string): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(BillingConstants.SCAN_TRANSACTION_ID, docType, receiptNo).pipe(
      tap(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    );
  }
  /**
   * Method to get receipt details.
   * @param receiptNo receipt number
   */
  getReceiptDetails(receiptNo: number) {
    if (!this.isMofReceiptFlag) {
      this.receiptNo = receiptNo;
      this.contributionPaymentService
        .getReceiptDetails(this.idNumber, receiptNo, false, ReceiptType.PARENT_RECEIPT)
        .pipe(
          tap(res => {
            this.receipt = res;
            this.establishmentService.getEstablishment(this.idNumber).subscribe(data => {
              this.establishment = new EstablishmentDetails().fromJsonToObject(data);
              this.accessForCancelReceipt = this.accessForCancelReceipt.filter(item =>
                this.establishment.gccCountry === true ? item === RoleIdEnum.GCC_CSR : item === RoleIdEnum.GOVERNMENT_COLLECTION_OFFICER
              );
              if (this.establishment.gccEstablishment != null) {
                this.gccFlag = true;
              }
              if (this.gccFlag && (this.currencySAR.english != this.receipt.amountReceived.currency)) {
                this.getConversionRate(this.receipt.amountReceived.currency);
              }
            });
          }),
          switchMap(res => {
            if (res.receiptMode.english !== BillingConstants.SADAD_NETWORK)
              return this.getDocuments(
                Number(res.parentReceiptNo),
                EstablishmentDocumentType[res.receiptMode.english.replace(/\s/g, '_').toUpperCase()]
              );
          })
        )
        .subscribe(noop, noop);
    } else {
      this.receiptNo = receiptNo;
      this.contributionPaymentService
        .getReceiptDetails(this.idNumber, receiptNo, true, ReceiptType.PARENT_RECEIPT)
        .pipe(
          tap(res => {
            this.receipt = res;
            if(res?.mofIndicator === BillingConstants.MOF_GOSI_ESTABLISHMENT)
            this.establishmentType = 'GOSI';
            if(res?.mofIndicator === BillingConstants.MOF_PPA_ESTABLISHMENT)
            this.establishmentType = 'PPA';
          }),
          switchMap(res => {
            if (res.receiptMode.english !== BillingConstants.SADAD_NETWORK)
              return this.getDocuments(
                receiptNo,
                EstablishmentDocumentType[res.receiptMode.english.replace(/\s/g, '_').toUpperCase()]
              );
          })
        )
        .subscribe(noop, noop);
    }
  }

  // This method is used to get GCC currency rate
  getConversionRate(currencyCode: string) {
    const currencyValue = new CurrencyDetails();
    const gccCurrency: BilingualText = new BilingualText();
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const txnDate=moment(this.receipt.transactionDate.gregorian).format('YYYY-MM-DD');
    this.exchangeRateService.getExchangeRate(currencyCode, this.currencySAR.english,txnDate).subscribe(res => {
      currencyValue.exchangeRate = res;
      currencyValue.convertedAmount = Number(
        parseFloat((this.receipt.amountReceived.amount * currencyValue.exchangeRate).toString()).toFixed(3)
      );
      currencyValue.convertedAllocationAmount = Number(
        parseFloat((this.receipt.amountAllocated.amount * currencyValue.exchangeRate).toString()).toFixed(3)
      );
      Object.keys(GccCountry).forEach(key => {
        if (key === currencyCode) {
          currencyValue.currencyCode.english = key;
          currencyValue.currencyCode.arabic = CurrencyArabicShortForm[key];
          gccCurrency.english = key;
          gccCurrency.arabic = CurrencyArabic[key];
        }
      });
      this.currencyDetails = currencyValue;
      this.currency = gccCurrency;
    });
  }
  /** Method to navigate back. */
  navigateBack() {
    this.navigateFlag = true;
    if (!this.isMofReceiptFlag && !history.state.searchDetails) {
      this.router.navigate([BillingConstants.RECEIPT_LIST_ROUTE], {
        queryParams: {
          pageNo: this.pageNo,
          searchFlag: true,
          idNo: this.idNumber
        }
      });
    } else if(history.state.searchDetails){
      this.router.navigate([BillingConstants.RECEIPT_SEARCH_ROUTE], {
        state: history.state
      })
    } else {
      this.router.navigate([BillingConstants.MOF_RECEIPT_LIST_ROUTE], {
        queryParams: {
          pageNo: this.pageNo
        }
      });
    }
  }
  /**
   * Method to navigate to cancel receipt details
   * @param receiptNo receipt number
   * @param docType document type
   */
  navigateToCancelReceipt(receiptNo: number) {
    this.contributionPaymentService.receiptNumber = receiptNo;
    this.contributionPaymentService.registrationNumber = this.idNumber;
    this.router.navigate(['home/billing/payment/cancel-establishment-payment']);
  }
  /**
   * Method to navigate to cancel receipt details
   * @param receiptNo receipt number
   * @param docType document type
   */
  getMofAllocationBreakupDetails() {
    this.router.navigate(['home/billing/receipt/mof/allocationDetails'], {
      queryParams: {
        receiptNo: this.receiptNo
      }
    });
  }
}
