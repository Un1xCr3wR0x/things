/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  LovList,
  LookupService,
  DocumentService,
  DocumentItem,
  CurrencyToken,
  StorageService,
  downloadFile,
  LanguageToken
} from '@gosi-ui/core';
import {
  BillDashboardService,
  DetailedBillService,
  BillingRoutingService,
  ReportStatementService
} from '../../../shared/services';
import { ReceiptWrapper, FilterParams, PaymentDetails } from '../../../shared/models';
import { LanguageTypeEnum, ReceiptMode } from '../../../shared/enums';
import { map } from 'rxjs/operators';
import { BillingConstants, ReportConstants } from '../../../shared/constants';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'blg-mof-receipt-sc',
  templateUrl: './mof-receipt-sc.component.html',
  styleUrls: ['./mof-receipt-sc.component.scss']
})
export class MofReceiptScComponent implements OnInit {
  /**Local variables. */

  receiptList: ReceiptWrapper;
  isMofReceiptFlag = false;
  isVicReceipt = false;
  idNo = 1;
  filterParams = new FilterParams();
  pageNo = 0;
  pageSize = 10;
  lang = 'en';
  languageType = LanguageTypeEnum.ENGLISH_LANGUAGE;
  originFromPublicBillDashBoard: boolean;
  receiptNo: number;
  receipt: PaymentDetails;
  documents: DocumentItem[] = [];
  selectedCurrency: string;
  currentCurrency = 'SAR';
  filterValueDetails: FilterParams = new FilterParams();
  isSearch = false;
  sortedDirection = 'ASC';
  enitytType = 'THIRD_PARTY';
  sortedField: string;

  /** Observables */
  receiptModes$: Observable<LovList>;
  receiptSortFields$: Observable<LovList>;
  receiptStatus$: Observable<LovList>;
  receiptModesFilter$: Observable<LovList>;
  esatblishmentType: string;
  isParam = false;
    
  constructor(
    readonly lookupService: LookupService,
    readonly billDashboardService: BillDashboardService,
    readonly detailedBillService: DetailedBillService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly billingRoutingService: BillingRoutingService,
    readonly reportStatementService: ReportStatementService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly storageService: StorageService
  ) {}

  /** This method handles initializaton task. */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params.isSearch){
        this.isParam = true;
       this.esatblishmentType = params.establishmentType;
      }
     else this.isParam = false;
      if (params.pageNo) {
        this.pageNo = Number(params.pageNo);
      }
          });
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.originFromPublicBillDashBoard = this.billDashboardService.paymentReceiptOrigin;
    this.getLookupValues();
    this.isSearch = true;
    this.getMofReceiptList();
  }

  /**
   * Method to get receipt list for the establishment under MOF.
   * @param
   */
  getMofReceiptList(filterParams?) {
    if (filterParams?.isSearch) this.filterValueDetails.parentReceiptNo = filterParams.filterParams.parentReceiptNo;
    else if (filterParams?.isfilter) {
      this.filterValueDetails.receiptFilter.receiptDate.endDate =
        filterParams.filterParams.receiptFilter.receiptDate.endDate;
      this.filterValueDetails.receiptFilter.receiptDate.startDate =
        filterParams.filterParams.receiptFilter.receiptDate.startDate;
      this.filterValueDetails.receiptFilter.endDate = filterParams.filterParams.receiptFilter.endDate;
      this.filterValueDetails.receiptFilter.startDate = filterParams.filterParams.receiptFilter.startDate;
      this.filterValueDetails.receiptFilter.receiptMode = filterParams.filterParams.receiptFilter.receiptMode;
      this.filterValueDetails.receiptFilter.status = filterParams.filterParams.receiptFilter.status;
      this.filterValueDetails.receiptFilter.minAmount = filterParams.filterParams.receiptFilter.minAmount;
      this.filterValueDetails.receiptFilter.maxAmount = filterParams.filterParams.receiptFilter.maxAmount;
      this.pageNo = 0;
    }

    if (this.isSearch && filterParams) {
      this.isSearch = false;
      this.filterValueDetails.parentReceiptNo = filterParams.parentReceiptNo;
    }
    if (filterParams) {
      this.filterValueDetails = this.filterValueDetails;
    } else {
      this.filterValueDetails.parentReceiptNo = null;
      this.filterValueDetails.receiptFilter.endDate = null;
      this.filterValueDetails.receiptFilter.startDate = null;
      this.filterValueDetails.receiptFilter.receiptMode = null;
      this.filterValueDetails.receiptFilter.status = null;
      this.filterValueDetails.receiptFilter.receiptDate.endDate = null;
      this.filterValueDetails.receiptFilter.receiptDate.startDate = null;
    }

    this.isMofReceiptFlag = true;
    this.detailedBillService
      .getReceipts(
        this.idNo,
        this.filterValueDetails,
        this.enitytType,
        this.pageNo,
        this.pageSize,
        this.isMofReceiptFlag,
        this.sortedField,
        this.sortedDirection,
        this.esatblishmentType,
        this.isParam
      )
      .subscribe(res => {
        this.receiptList = res;
      }); 
        }
  /** Method to get lookup values. */
  getLookupValues() {
    this.receiptModes$ = this.lookupService.getReceiptMode();
    this.filterReceiptMode();
    this.receiptStatus$ = this.lookupService.getReceiptStatus();
    this.receiptSortFields$ = this.lookupService.getReceiptSortFields();
  }

  filterReceiptMode() {
    if (this.receiptModes$) {
      this.receiptModesFilter$ = this.receiptModes$.pipe(
        map(list => {
          if (list) {
            return new LovList(list.items.filter(lov => lov.value.english !== ReceiptMode.CASH_DEPOSIT));
          }
          return list;
        })
      );
    }
  }
  /**
   * Method to get receipt details.
   * @param receiptNo receipt number
   */
  getMofReceiptDetails(receiptNo: number) {
    this.receiptNo = receiptNo;
    this.router.navigate([BillingConstants.MOF_RECEIPT_DETAILS_ROUTE], {
      queryParams: {
        receiptNo: receiptNo,
        pageNo: this.pageNo,
        mof: true
      }
    });
  }
  downloadMofTransaction(receiptNo: number) {
    this.reportStatementService
      .generatePaymentsReport(this.idNo, receiptNo, this.isMofReceiptFlag, this.languageType)
      .subscribe(data => {
        downloadFile(ReportConstants.PRINT_BILL_FILE_NAME, 'application/pdf', data);
      });
  }
  printMofTransaction(receiptNo: number) {
    this.reportStatementService
      .generatePaymentsReport(Number(this.idNo), Number(receiptNo), this.isMofReceiptFlag, this.languageType)
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
  /**
   * This method is to select the page number on pagination
   */
  getselectPageNoforMof(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getMofReceiptList(this.filterParams);
  }
  /**
   * Method to navigate to mof receipt allocation breakup screen
   */
  navigateToReceiptBreakup(receiptNo: number) {
    this.router.navigate([BillingConstants.MOF_RECEIPT_ALLOCATION_BREAKUP], {
      queryParams: {
        receiptNo: receiptNo
      }
    });
  }
  /**
   * This method is used to get field values for sorting
   */
  getSortedFieldDetailsForMof(sortedField) {
    this.sortedField = sortedField;
    this.getMofReceiptList(this.filterParams);
  }
  // This method is used to get sorting direction.
  getMofSortedDirection(sortedDirection) {
    this.sortedDirection = sortedDirection;
    this.getMofReceiptList(this.filterParams);
  }
  /** Method to navigate back to billdashboarrd */
  navigateBackToMofBillDashBoard() {
    this.billingRoutingService.navigateToMofDashboardBill(this.esatblishmentType);
    this.billDashboardService.paymentReceiptOrigin = false;
  }
}
