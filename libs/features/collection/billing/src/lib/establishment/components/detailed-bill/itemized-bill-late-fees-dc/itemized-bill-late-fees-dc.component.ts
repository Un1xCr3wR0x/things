/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ItemizedLateFeeWrapper } from '../../../../shared/models/itemized-late-fee-wrapper';
import { ItemizedLateFeeDetails } from '../../../../shared/models/itemized-latefee-details';

@Component({
  selector: 'blg-itemized-bill-late-fees-dc',
  templateUrl: './itemized-bill-late-fees-dc.component.html',
  styleUrls: ['./itemized-bill-late-fees-dc.component.scss']
})
export class ItemizedBillLateFeesDcComponent implements OnInit, OnChanges {
  paginationId = 'itemizedLateFee';
  itemsPerPage = 10;
  currentPage = 0;
  lateFeePage = {
    currentPage: 1,
    goToPage: ''
  };
  lang = 'en';
  itemList: ItemizedLateFeeDetails[] = [];
  /**
   * Input variable
   */
  @Input() lateFeeDetails: ItemizedLateFeeWrapper;
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;
  /**
   * output variable
   */
  @Output() selectPage: EventEmitter<number> = new EventEmitter();
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Method to instantiate the component. */
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
  }
  /**
   *
   * @param page method to trigger the page select event
   */
  selectedPage(page: number): void {
    if (this.lateFeePage.currentPage !== page) {
      this.lateFeePage.currentPage = this.currentPage = page;
      this.selectPage.emit(this.currentPage - 1);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes.lateFeeDetails &&
      changes.lateFeeDetails.currentValue &&
      !changes.lateFeeDetails.isFirstChange()
    ) {
      const data = changes.lateFeeDetails.currentValue;
      this.getItemizedValues(data);
    }
    this.getItemizedValues(this.lateFeeDetails);
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
  }
  getItemizedValues(lateFeeDetails: ItemizedLateFeeWrapper) {
    this.itemList = lateFeeDetails.itemizedLateFee;
  }
}
