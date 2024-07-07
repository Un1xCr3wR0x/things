/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { GccCountryCode } from '@gosi-ui/core';
import { LabelDcComponent } from '../label-dc/label-dc.component';

/**
 * This is the component to show fields
 *
 * @export
 * @class LabelDcComponent
 * @extends {BaseComponent}
 */
@Component({
  selector: 'gosi-currency-label-dc',
  templateUrl: './currency-label-dc.component.html',
  styleUrls: ['./currency-label-dc.component.scss']
})
export class CurrencyLabelDcComponent extends LabelDcComponent {
  //Input Variables
  @Input() countryCodeFrom: string;
  @Input() countryCodeTo: string;
  @Input() currencyFrom: string;
  @Input() currencyTo: string;
  @Input() countryCode: GccCountryCode;
  @Input() ThreeDecimal = false;
  @Input() ThreeDecimalLabel = false;
  /**
   * Creates an instance of CurrencyLabelDcComponent
   * @memberof  CurrencyLabelDcComponent
   *
   */
  constructor() {
    super();
  }
}
