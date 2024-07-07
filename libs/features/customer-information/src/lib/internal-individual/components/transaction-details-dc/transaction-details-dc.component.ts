import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Transaction } from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';

@Component({
  selector: 'cim-transaction-details-dc',
  templateUrl: './transaction-details-dc.component.html',
  styleUrls: ['./transaction-details-dc.component.scss']
})
export class TransactionDetailsDcComponent implements OnInit {
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
