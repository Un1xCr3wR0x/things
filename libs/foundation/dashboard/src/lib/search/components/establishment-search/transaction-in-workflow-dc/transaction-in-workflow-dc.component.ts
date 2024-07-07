/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output, ViewChild } from '@angular/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { Transaction } from '@gosi-ui/core';
@Component({
  selector: 'dsb-transaction-in-workflow-dc',
  templateUrl: './transaction-in-workflow-dc.component.html',
  styleUrls: ['./transaction-in-workflow-dc.component.scss']
})
export class TransactionInWorkflowDcComponent implements OnInit, OnChanges {
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  currentPage = 1;
  itemsPerPage = 10;
  //Input variables
  @Input() transactionDetails: Transaction[];
  @Input() totalRecords: number;
  //Output Variables
  @Output() limit: EventEmitter<number> = new EventEmitter();
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  constructor() {}

  ngOnInit(): void {}
  /**
   *
   * @param changes This method is used to handle the changes in the input variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.transactionDetails && changes.transactionDetails?.currentValue)
      this.transactionDetails = changes?.transactionDetails?.currentValue;
    if (changes && changes.totalRecords && changes.totalRecords.currentValue)
      this.totalRecords = changes.totalRecords.currentValue;

    this.transactionDetails = this.transactionDetails.slice(0, 2);
    this.totalRecords = 2;
  }
  navigateTo() {
    this.navigate.emit();
  }
  /**
   * method to trigger select page event
   * @param pageNo
   */
  selectPage(pageNo: number) {
    this.pageDetails.currentPage = this.currentPage = pageNo;
    this.limit.emit(pageNo);
  }
}
