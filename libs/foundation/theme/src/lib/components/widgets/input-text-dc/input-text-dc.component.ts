/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputBaseComponent, getErrorMsg } from '@gosi-ui/core';

/**
 * This component is to handle input text fields.
 *
 * @export
 * @class InputTextDcComponent
 * @extends {InputBaseComponent}
 */
@Component({
  selector: 'gosi-input-text-dc',
  templateUrl: './input-text-dc.component.html',
  styleUrls: ['./input-text-dc.component.scss']
})
export class InputTextDcComponent extends InputBaseComponent {
  @Input() showReset = false;
  @Input() extraLabel: string;

  @Output() reset = new EventEmitter<null>();
  showClearButton: boolean;

  /**
   * Creates an instance of InputTextDcComponent.
   * @memberof InputTextDcComponent
   */
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  setErrorMsgs(control) {
    const error = getErrorMsg(control, this.label, this.invalidSelection);
    this.errorMsg.next(error);
  }
  onInputChange(searchValue: string): void {
    if (searchValue) {
      this.showClearButton = true;
    } else {
      this.showClearButton = false;
    }
  }
  resetFilter() {
    this.showClearButton = false;
    this.reset.emit();
  }
}
