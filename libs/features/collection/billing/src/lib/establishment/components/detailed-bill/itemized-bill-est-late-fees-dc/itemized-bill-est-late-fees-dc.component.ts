/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ItemizedLateFee } from '../../../../shared/models';

@Component({
  selector: 'blg-itemized-bill-est-late-fees-dc',
  templateUrl: './itemized-bill-est-late-fees-dc.component.html',
  styleUrls: ['./itemized-bill-est-late-fees-dc.component.scss']
})
export class ItemizedBillEstLateFeesDcComponent implements OnInit, OnChanges {
  lang = 'en';
  itemList: ItemizedLateFee = new ItemizedLateFee();
  /**
   * Input variable
   */
  @Input() lateFeeDetails: ItemizedLateFee;
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
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes.lateFeeDetails &&
      changes.lateFeeDetails.currentValue &&
      !changes.lateFeeDetails.isFirstChange()
    ) {
      this.lateFeeDetails = changes.lateFeeDetails.currentValue;
    }
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
  }
}
