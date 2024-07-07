/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'blg-itemized-bill-tabset-dc',
  templateUrl: './itemized-bill-tabset-dc.component.html',
  styleUrls: ['./itemized-bill-tabset-dc.component.scss']
})
export class ItemizedBillTabsetDcComponent implements OnChanges {
  constructor() {}

  /* Input Variables */
  @Input() selectedTab: string;
  @Input() tabSet;
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;

  /* Output Variables */
  @Output() tabSelected: EventEmitter<string> = new EventEmitter();

  /* Method to fetch data on input changes*/
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.tabSet?.currentValue) {
      this.tabSet = changes.tabSet.currentValue;
    }
    if (changes?.selectedTab?.currentValue) {
      this.selectedTab = changes.selectedTab.currentValue;
    }
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
    }
    if (changes?.exchangeRate?.currentValue) {
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
  }

  /* Method to active tab on clicking*/
  activeTab(tabSelected: string) {
    this.tabSelected.emit(tabSelected);
  }
}
