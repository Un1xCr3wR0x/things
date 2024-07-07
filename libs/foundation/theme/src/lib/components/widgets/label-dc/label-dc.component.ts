/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent, checkBilingualTextNull } from '@gosi-ui/core';

/**
 * This is the component to show fields
 *
 * @export
 * @class LabelDcComponent
 * @extends {BaseComponent}
 */
@Component({
  selector: 'gosi-label-dc',
  templateUrl: './label-dc.component.html',
  styleUrls: ['./label-dc.component.scss']
})
export class LabelDcComponent extends BaseComponent {
  lighterLabel = '#999999';

  //Input Variables
  @Input() control: string;
  @Input() label: string;
  @Input() labelsuffix: string;
  @Input() date: boolean;
  @Input() ignoreLabel: boolean;
  @Input() id;
  @Input() value = null;
  @Input() isBackgroundWhite: boolean;
  @Input() isLink = false;
  @Input() noMargin = false;
  @Input() upperCase = false;
  @Input() isArabic = false; // is the label arabic text
  @Input() helpText: string;
  @Input() flipInRtl = false; // In cases where prefix + control should be control + prefix (eg: 4-1554 => 1554-4)
  @Input() customStyle;
  /**
   * Output variables
   */
  @Output() select: EventEmitter<string> = new EventEmitter();

  /**
   * Creates an instance of LabelDcComponent
   * @memberof  LabelDcComponent
   *
   */
  constructor() {
    super();
  }

  /**
   * This method is used to check if the input control is null or empty
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }

  /**
   *
   * @param value Select event if the value is a link
   */
  selectItem(value) {
    this.select.emit(value);
  }
}
