/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent, Alert } from '@gosi-ui/core';

@Component({
  selector: 'cim-success-feedback-dc',
  templateUrl: './success-feedback-dc.component.html',
  styleUrls: ['./success-feedback-dc.component.scss']
})
export class SuccessFeedbackDcComponent extends BaseComponent implements OnInit {
  //Input Variables
  @Input() feedBackMessage: Alert;

  /**
   * Creates an instance of SuccessFeedbackDcComponent
   * @memberof  SuccessFeedbackDcComponent
   *
   */
  constructor() {
    super();
  }

  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {}
}
