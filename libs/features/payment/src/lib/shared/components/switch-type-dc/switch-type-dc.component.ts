/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pmt-switch-type-dc',
  templateUrl: './switch-type-dc.component.html',
  styleUrls: ['./switch-type-dc.component.scss']
})
export class SwitchTypeDcComponent implements OnInit {
  /**
   * Input variables
   */
  @Input() switchType = 'switch1';
  /**
   * Output variables
   */
  @Output() onSelected = new EventEmitter<string>();
  /**
   * Local variables
   */
  switch1 = 'switch1';
  switch2 = 'switch2';

  constructor() {}

  ngOnInit() {}

  /**
   *
   * @param type
   * Method to change calendar type
   */
  changeType(type) {
    if (type !== this.switchType) {
      this.switchType = type;
      this.onSelected.emit(this.switchType);
    }
  }
}
