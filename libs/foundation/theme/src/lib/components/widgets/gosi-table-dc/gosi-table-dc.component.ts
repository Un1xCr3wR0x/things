/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { InputBaseComponent } from '@gosi-ui/core';
import { getErrorMsg } from '@gosi-ui/core';

/**
 * This component is to handle input text fields.
 *
 * @export
 * @class GosiTableDcComponent
 * @extends {InputBaseComponent}
 */
@Component({
  selector: 'gosi-table-dc',
  templateUrl: './gosi-table-dc.component.html',
  styleUrls: ['./gosi-table-dc.component.scss']
})
export class GosiTableDcComponent extends InputBaseComponent implements OnInit {
  /**
   * Creates an instance of GosiTableDcComponent.
   * @memberof GosiTableDcComponent
   */
  constructor() {
    super();
  }
  ngOnInit() {}

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
}
