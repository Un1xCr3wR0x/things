/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { RequestLimit } from '../../../../shared';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';
import { Transaction } from '@gosi-ui/core';

@Component({
  selector: 'dsb-transaction-entries-dc',
  templateUrl: './transaction-entries-dc.component.html',
  styleUrls: ['./transaction-entries-dc.component.scss']
})
export class TransactionEntriesDcComponent implements OnInit, OnChanges {
  /*
   * Input Variables
   */
  @Input() transactionEntry: Transaction[];
  @Input() isRecent = false;
  @Input() transactionSearchCount: number;
  @Input() limitItem: RequestLimit = new RequestLimit();

  //Output Variables
  @Output() limit: EventEmitter<RequestLimit> = new EventEmitter();
  @Output() txnNavigation: EventEmitter<Transaction> = new EventEmitter();

  //Viewchild components
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  /*
   * Local variables
   */
  item: Transaction;
  txnPagination = 'txnPagination';
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  itemsPerPage = 10;
  constructor() {}

  ngOnInit(): void {}
  /**
   * method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.transactionEntry && changes.transactionEntry.currentValue)
      this.transactionEntry = changes.transactionEntry.currentValue;
    if (changes && changes.transactionSearchCount && changes.transactionSearchCount.currentValue)
      this.transactionSearchCount = changes.transactionSearchCount.currentValue;
    if (changes && changes.limitItem && changes.limitItem.currentValue) {
      this.limitItem = changes.limitItem.currentValue;
      this.pageDetails.currentPage = this.pageDetails.goToPage = this.limitItem.pageNo + 1;
    }
  }
  /**
   * method to trigger select page event
   * @param pageNo
   */
  selectPage(pageNo: number) {
    if (pageNo - 1 !== this.limitItem.pageNo) {
      this.pageDetails.currentPage = pageNo;
      this.limitItem.pageNo = pageNo - 1;
      this.onLimit();
    }
  }
  /**
   * method to trigger select limit event
   */
  private onLimit() {
    this.limit.emit(this.limitItem);
  }
  /**
   * method to reset pagination
   */
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.limitItem.pageNo = 0;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
  /**
   * This method is to navigate to domain transaction details page
   * @param item
   */
  transactionNavigation(item: Transaction) {
    this.txnNavigation.emit(item);
  }
}
