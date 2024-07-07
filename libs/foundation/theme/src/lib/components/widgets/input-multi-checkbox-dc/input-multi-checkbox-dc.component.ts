/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'gosi-input-multi-checkbox-dc',
  templateUrl: './input-multi-checkbox-dc.component.html',
  styleUrls: ['./input-multi-checkbox-dc.component.scss']
})
export class InputMultiCheckboxDcComponent {
  /**Input variables */
  @Input() options: Array<BilingualText>;
  @Input() control: FormGroup;
  /**Output variables */
  @Output() check: EventEmitter<BilingualText> = new EventEmitter();

  constructor() {}

  getSelectedOptions() {
    //emit array of option checked
    const selectedOrderIds = this.control.value.items
      .map((v, i) => (v ? this.options[i] : null))
      .filter(v => v !== null);
    this.check.emit(selectedOrderIds);
  }
  get formData() {
    return <FormArray>this.control.get('items');
  }
}
