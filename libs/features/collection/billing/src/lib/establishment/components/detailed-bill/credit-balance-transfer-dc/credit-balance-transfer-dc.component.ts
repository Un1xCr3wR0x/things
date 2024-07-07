import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { CreditTransferWrapper } from '../../../../shared/models/credit-tansfer-wrapper';

@Component({
  selector: 'blg-credit-balance-transfer-dc',
  templateUrl: './credit-balance-transfer-dc.component.html',
  styleUrls: ['./credit-balance-transfer-dc.component.scss']
})
export class CreditBalanceTransferDcComponent implements OnInit, OnChanges {
  /*Input Variable*/
  @Input() creditTransfers: CreditTransferWrapper;
  @Input() tabHeader: string;
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;
  @Input() fromPage;

  // Output Variables
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();

  /*Local Variables*/
  creditTransfer: CreditTransferWrapper;
  length: number;
  totalAmount = 0;
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  paginationId = 'creditTransfer';

  constructor() {}
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes.creditTransfers &&
      changes.creditTransfers.currentValue &&
      !changes.creditTransfers.isFirstChange()
    ) {
      this.creditTransfer = changes.creditTransfers.currentValue;
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
