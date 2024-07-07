import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { ItemizedBillCreditAdjustmentWrapper } from '../../../../shared/models/itemized-bill-credit-adjustment-wrapper';

@Component({
  selector: 'blg-itemized-bill-credit-adjustment-details-dc',
  templateUrl: './itemized-bill-credit-adjustment-details-dc.component.html',
  styleUrls: ['./itemized-bill-credit-adjustment-details-dc.component.scss']
})
export class ItemizedBillCreditAdjustmentDetailsDcComponent implements OnInit, OnChanges {
  /**---Local Variables--- */
  paginationId = 'itemizedContributionMonth';
  creditAdjustmentTotal = 0;
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  @Input() creditAdjustmentDetails: ItemizedBillCreditAdjustmentWrapper;
  @Input() establishmentType: string;
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;
  @Input() pageNo: number;

  // Output Variables
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() regNo: EventEmitter<number> = new EventEmitter();

  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.creditAdjustmentDetails?.currentValue) {
      this.creditAdjustmentTotal = 0;
      this.creditAdjustmentDetails = changes.creditAdjustmentDetails.currentValue;
      this.creditAdjustmentDetails.thirdPartyItemizedBillBreakDown.forEach(item => {
        this.creditAdjustmentTotal += item.thirdPartyContributionShare.total;
      });
    }
    if (changes?.pageNo?.currentValue) {
      this.pageDetails.currentPage = changes.pageNo.currentValue;
    }
  }
  ngOnInit(): void {}
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
