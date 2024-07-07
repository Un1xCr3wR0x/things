/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output, Inject, SimpleChanges, OnChanges } from '@angular/core';
import { LovList, LanguageToken, Lov } from '@gosi-ui/core';
import { Observable } from 'rxjs/internal/Observable';
import { FilterParams, ReceiptWrapper } from '../../../shared/models';
import { BehaviorSubject } from 'rxjs';
import { ReceiptApprovalStatus } from '../../../shared/enums/receipt-approval-status';

@Component({
  selector: 'blg-receipt-list-view-dc',
  templateUrl: './receipt-list-view-dc.component.html',
  styleUrls: ['./receipt-list-view-dc.component.scss']
})
export class ReceiptListViewDcComponent implements OnInit, OnChanges {
  /** Local variables. */
  filterParam: FilterParams = new FilterParams();
  sortedColumn: string;
  lang = 'en';
  itemsPerPage = 10;
  currentPage = 0;
  exchangeValue = 1;
  isfilter = false;
  isSearch = false;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  paginationId = 'receiptList';
  currentCurrencyLable: string;
  status: string;
  sortOrder = 'ASC';
  sortedField: string;
  sortList: LovList;

  /** Input variables. */
  @Input() exchangeRate: number;
  @Input() currentCurrency = 'SAR';
  @Input() receiptList: ReceiptWrapper;
  @Input() receiptModes: Observable<LovList>;
  @Input() receiptStatus: Observable<LovList>;
  @Input() receiptSortFields: Observable<LovList>;
  @Input() originFromPublicBillDashBoard: boolean;
  @Input() isMofReceiptFlag: boolean;
  @Input() isVicReceipt: boolean;
  @Input() resultFlag: boolean;
  @Input() pageNo: number;
  @Input() isReceiptSearch = false;

  /** Output variables. */
  @Output() search: EventEmitter<object> = new EventEmitter();
  @Output() filter?: EventEmitter<object> = new EventEmitter();
  @Output() receipt: EventEmitter<any> = new EventEmitter();
  @Output() navigateToBillDashBoard?: EventEmitter<null> = new EventEmitter();
  @Output() print?: EventEmitter<number> = new EventEmitter();
  @Output() download?: EventEmitter<number> = new EventEmitter();
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() navigateToReceiptBreakup?: EventEmitter<number> = new EventEmitter();
  @Output() sortItemSelected?: EventEmitter<string> = new EventEmitter();
  @Output() sortListValues?: EventEmitter<string> = new EventEmitter();

  /** Creates an instance of CancelReceiptScComponent. */
  constructor(@Inject(LanguageToken) private language: BehaviorSubject<string>) {}
  /** Initializes the component. */
  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
    this.receiptSortFields.subscribe(sortlist => (this.sortList = sortlist));
    this.filterParam.receiptFilter.endDate = null;
    this.filterParam.receiptFilter.startDate = null;
    this.filterParam.receiptFilter.receiptMode = null;
    this.filterParam.receiptFilter.status = null;
    this.status = ReceiptApprovalStatus.FULLY_ALLOCATED;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.receiptList && changes.receiptList.currentValue && !changes.receiptList.isFirstChange()) {
      this.receiptList = changes.receiptList.currentValue;

      if (this.isfilter) {
        this.pageDetails.currentPage = this.currentPage = 1;
      }
    }
    if (changes && changes.pageNo && changes.pageNo.currentValue) {
      // this.pageDetails.currentPage = this.currentPage = this.pageNo + 1;
    }
    if (changes?.currentCurrency?.currentValue) {
      this.currentCurrencyLable = 'BILLING.' + changes.currentCurrency.currentValue;
    }
    if (changes?.exchangeRate?.currentValue) {
      this.exchangeValue = this.exchangeRate;
    }
    if (this.isReceiptSearch && changes?.pageNo) {
      this.pageDetails.currentPage = this.pageNo + 1;
    }
  }
  /**
   * Method to handle search on key up.
   * @param receiptNo receipt number
   */
  onKeyUp(receiptNo: string) {
    this.pageDetails.currentPage = 1;
    if (receiptNo.length > 2 || receiptNo.length === 0) {
      this.filterParam.parentReceiptNo = receiptNo;
      this.isSearch = true;
      this.search.emit({
        isSearch: this.isSearch,
        filterParams: this.filterParam
      });
    }
  }

  /**
   * Method to handle search on clicking search icon.
   * @param receiptNo receipt number
   */
  onSearch(receiptNo: string) {
    this.pageDetails.currentPage = 1;
    this.filterParam.parentReceiptNo = receiptNo;
    this.isSearch = true;
    this.search.emit({
      isSearch: this.isSearch,
      filterParams: this.filterParam
    });
  }

  /**
   * Method to handle filterig receipts.
   * @param filterParams filter params
   */
  filterReceipts(filterParams: FilterParams) {
    if (filterParams) {
      this.isfilter = true;
      this.filter.emit({
        isfilter: this.isfilter,
        filterParams: filterParams
      });
    }
  }

  /**
   * Method to get receipt details.
   * @param receiptNo receipt number
   */
  getReceipt(receiptNo: number, registrationNo: number) {
    if (this.isReceiptSearch) {
      const details = { receiptNo, registrationNo };
      this.receipt.emit(details);
    } else {
      if (receiptNo) {
        this.receipt.emit(receiptNo);
      }
    }
  }
  /**
   * Method to navigate back to bill dashboard
   */
  navigateBackToBillDashBoard() {
    this.navigateToBillDashBoard.emit();
  }
  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.isfilter = false;
      this.selectPageNo.emit(this.currentPage - 1);
    }
  }

  /**
   *
   * @param receiptNo method to print receipt
   */

  printReceipt(receiptNo: number) {
    if (receiptNo) this.print.emit(receiptNo);
  }

  /**
   *
   * @param receiptNo method to download receipt
   */
  downloadReceipt(receiptNo: number) {
    if (receiptNo) this.download.emit(receiptNo);
  }

  // This method is used to navigate to receipt breakup view
  routeToBreakup(receiptNo: number) {
    if (receiptNo) {
      this.navigateToReceiptBreakup.emit(receiptNo);
    }
  }
  // This method is used to get sorting order direction
  sortDirection(sortOrder) {
    this.sortOrder = sortOrder;
    this.sortListValues.emit(this.sortOrder);
  }
  // This method is used to get receipt sort filed details
  sortedItem(receiptSortField: Lov) {
    if (receiptSortField.value.english === 'Receipt Date' || receiptSortField.value.arabic === 'تاريخ الإيصال') {
      this.sortedField = 'TRANSACTION_DATE';
    } else if (receiptSortField.value.english === 'Receipt Number' || receiptSortField.value.arabic === 'رقم الإيصال') {
      this.sortedField = 'RECEIPT_NUMBER';
    } else if (receiptSortField.value.english === 'Amount' || receiptSortField.value.arabic === 'المبلغ') {
      this.sortedField = 'AMOUNT_RECEIVED';
    }
    this.sortItemSelected.emit(this.sortedField);
  }
}
