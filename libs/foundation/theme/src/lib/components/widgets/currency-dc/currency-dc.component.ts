/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyToken, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { GCCCurrencyList } from './gcc-currency';

@Component({
  selector: 'gosi-currency-dc',
  templateUrl: './currency-dc.component.html',
  styleUrls: ['./currency-dc.component.scss']
})
export class CurrencyDcComponent implements OnInit, OnChanges {
  /**
   * Input Variables
   */
  @Input() selectedCountry = GCCCurrencyList.BAHRAIN_CURRENCY_CODE;
  @Input() IsGCC = true;
  /**
   * Local Variables
   */
  gccList = GCCCurrencyList.GCC_LIST;
  selectedLang = 'en';
  saudiCurrencyKey: string = GCCCurrencyList.SAUDI_CURRENCY_CODE.key;
  currencyText = GCCCurrencyList.SAUDI_CURRENCY_CODE.label;
  isIcon = true;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>
  ) {}

  ngOnInit() {
    this.language.subscribe(lang => {
      this.selectedLang = lang;
    });
    this.currency.subscribe(currentCurrencyKey => {
      const currentCurrency = GCCCurrencyList.GCC_LIST.find(item => item.key === currentCurrencyKey);
      this.setCurrency(currentCurrency);
    });
    /**
     *  if (this.IsGCC)
      this.gccList = GCCCurrency.GCC_LIST.filter(
        item => this.selectedCountry.key === item.key || item.key === this.saudiCurrencyKey
      );
     */
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.selectedCountry && changes.selectedCountry.currentValue) {
      /**
       *  if (this.IsGCC)
        this.gccList = GCCCurrency.GCC_LIST.filter(
          item => this.selectedCountry.key === item.key || item.key === this.saudiCurrencyKey
        );
       */
    }
  }

  /**
   *
   * @param currency
   *  Method to change currency
   */
  changeCurrency(currency) {
    this.currency.next(currency.key);
  }
  /**
   * Method to set  current currency
   * @param currency
   */
  setCurrency(currency) {
    if (currency.key === this.saudiCurrencyKey) {
      this.isIcon = true;
      return;
    } else this.isIcon = false;
    this.currencyText = currency.label;
  }
}
