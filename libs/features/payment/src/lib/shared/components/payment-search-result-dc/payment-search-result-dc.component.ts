/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'pmt-payment-search-result-dc',
  templateUrl: './payment-search-result-dc.component.html',
  styleUrls: ['./payment-search-result-dc.component.scss']
})
export class PaymentSearchResultDcComponent implements OnChanges {
  readonly oneResult = 'PAYMENT.SEARCH-RESULT-ONE-COUNT';
  readonly twoResults = 'PAYMENT.SEARCH-RESULT-TWO-COUNT';
  readonly threeToTen = 'PAYMENT.SEARCH-RESULT-THREE-COUNT';
  readonly moreThanEleven = 'PAYMENT.SEARCH-RESULT-ELEVEN-COUNT';

  searchResultMsg: string;

  @Input() value: string;
  @Input() count: number;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.count) {
      this.setResultMessage();
    }
  }

  setResultMessage() {
    if (!this.count || this.count === 1) {
      this.searchResultMsg = this.oneResult;
    } else if (this.count === 2) {
      this.searchResultMsg = this.twoResults;
    }
    if (this.count >= 3 && this.count <= 10) {
      this.searchResultMsg = this.threeToTen;
    } else {
      this.searchResultMsg = this.moreThanEleven;
    }
  }
}
