/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, OnChanges } from '@angular/core';
import { ReceiptDetails, ItemizedReceiptWrapper } from '../../../../shared/models';
import { BilingualText, LovList } from '@gosi-ui/core';
import { FilterParams } from '../../../../shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'blg-itemized-bill-payment-receipt-details-dc',
  templateUrl: './itemized-bill-payment-receipt-details-dc.component.html',
  styleUrls: ['./itemized-bill-payment-receipt-details-dc.component.scss']
})
export class ItemizedBillPaymentReceiptDetailsDcComponent implements OnInit, OnChanges {
  constructor() {}

  /***
   * Local Variable
   */

  itemList: ReceiptDetails[] = [];
  paginationId = 'itemizedReceiptDetails';
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  currentSortColumn: string;
  sortOrder = 'ASC';
  isfilter = false;
  isSearch = false;
  filterParam: FilterParams = new FilterParams();

  /**
   * Input variables
   */
  @Input() ReceiptDetails: ItemizedReceiptWrapper = new ItemizedReceiptWrapper();
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;
  @Input() receiptSort: Observable<LovList>;
  @Input() pageNo: number;
  /**
   * Output variable
   */
  @Output() receiptSelectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() sortListDet = new EventEmitter<{ sortBy: string; sortOrder: string }>();
  @Output() SearchReceiptNo: EventEmitter<object> = new EventEmitter();
  @Output() filter: EventEmitter<object> = new EventEmitter();

  /**
   * Method to fetch detail on initialising the componenet
   */
  ngOnInit(): void {}

  /**
   * Method to fetch detail on changing  the input values
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
    }
    if (changes?.exchangeRate?.currentValue) {
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
    if (
      changes &&
      changes.ReceiptDetails &&
      changes.ReceiptDetails.currentValue &&
      !changes.ReceiptDetails.isFirstChange()
    ) {
      this.itemList = changes.ReceiptDetails.currentValue.receiptDetailDto;
      this.pageDetails.currentPage = this.pageNo + 1;
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    }
    this.itemList = this.ReceiptDetails.receiptDetailDto;
  }

  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.receiptSelectPageNo.emit(this.currentPage - 1);
    }
  }

  /**
   *
   * @param page method to get sorting parameter
   */
  sortList(sortBy) {
    if (sortBy.value.english === 'Receipt Date') {
      this.currentSortColumn = 'TRANSACTION_DATE';
    } else if (sortBy.value.english === 'Receipt Number') {
      this.currentSortColumn = 'RECEIPT_NUMBER';
    } else if (sortBy.value.english === 'Amount Received' || sortBy.value.english === 'Amount') {
      this.currentSortColumn = 'AMOUNT_RECEIVED';
    }

    this.sortListDet.emit({ sortBy: this.currentSortColumn, sortOrder: this.sortOrder });
  }
  sortDirection(order) {
    this.sortOrder = order;
    this.sortListDet.emit({ sortBy: this.currentSortColumn, sortOrder: this.sortOrder });
  }
  /**
   *
   * @param date method to trigger the amount select event
   */
  onSearchReceiptNo(number: string) {
    this.pageDetails.currentPage = 1;
    this.filterParam.parentReceiptNo = number;
    this.isSearch = true;
    this.SearchReceiptNo.emit({
      isSearch: this.isSearch,
      filterParams: this.filterParam
    });
  }
  /**
   * Method to handle filterig receipts.
   * @param filterParams filter params
   */
  filterReceipts(filterParams: FilterParams) {
    this.pageDetails.currentPage = 1;
    if (filterParams) {
      this.isfilter = true;
      this.filter.emit({
        isfilter: this.isfilter,
        filterParams: filterParams
      });
    }
  }
}
