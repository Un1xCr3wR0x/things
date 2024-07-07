/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, SimpleChanges, OnChanges, OnInit, Output } from '@angular/core';
import { ItemizedCreditRefund } from '../../../../shared/models';
import { BilingualText } from '@gosi-ui/core';
@Component({
  selector: 'blg-itemized-contributor-refund-dc',
  templateUrl: './itemized-contributor-refund-dc.component.html',
  styleUrls: ['./itemized-contributor-refund-dc.component.scss']
})
export class ItemizedContributorRefundDcComponent implements OnInit, OnChanges {
  // Input Variables
  @Input() creditRefundDetails: ItemizedCreditRefund;
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;
  @Input() tabHeader: string;
  // Output Variables
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();

  // Local Variables
  totalAmount = 0;
  paginationId = 'creditRefund';
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  creditRefundDetail: ItemizedCreditRefund;
  constructor() {}
  ngOnInit(): void {}

  // Method to get values on input changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.creditRefundDetails && changes.creditRefundDetails.currentValue) {
      this.creditRefundDetail = changes.creditRefundDetails.currentValue;
      this.totalAmount = this.creditRefundDetail.totalAmount;
    }
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
    }
    if (changes?.exchangeRate?.currentValue) {
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
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
