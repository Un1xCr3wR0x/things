import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ItemizedBillCreditAdjustmentWrapper } from '../../../../shared/models/itemized-bill-credit-adjustment-wrapper';

@Component({
  selector: 'blg-itemized-bill-debit-adjustment-dc',
  templateUrl: './itemized-bill-debit-adjustment-dc.component.html',
  styleUrls: ['./itemized-bill-debit-adjustment-dc.component.scss']
})
export class ItemizedBillDebitAdjustmentDcComponent implements OnInit, OnChanges {
  paginationId = 'itemizedDebitAdjustment';
  debitAdjustmentTotal = 0;
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  @Input() debitAdjustmentDetails: ItemizedBillCreditAdjustmentWrapper;
  @Input() establishmentType: string;
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() regNo: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.debitAdjustmentDetails?.currentValue) {
      this.debitAdjustmentTotal = 0;
      this.debitAdjustmentDetails = changes.debitAdjustmentDetails.currentValue;
      this.debitAdjustmentDetails.thirdPartyItemizedBillBreakDown.forEach(item => {
        this.debitAdjustmentTotal += item.thirdPartyContributionShare.total;
      });
    }
    if (changes?.pageNo?.currentValue) {
      this.pageDetails.currentPage = changes.pageNo.currentValue;
    }
  }
  getCreditDetails(regNo: number) {
    this.regNo.emit(regNo);
  }
  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.selectPageNo.emit(this.currentPage - 1);
    }
  }
}
