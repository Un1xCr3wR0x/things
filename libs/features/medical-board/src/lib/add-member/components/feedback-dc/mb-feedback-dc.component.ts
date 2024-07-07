/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'mb-feedback-dc',
  templateUrl: './mb-feedback-dc.component.html',
  styleUrls: ['./mb-feedback-dc.component.scss']
})
export class MbFeedbackDcComponent implements OnInit {
  @Input() transactionMessage: BilingualText = null;
  @Input() transactionTraceId: number = null;
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  /**
   * Creates an instance of FeedbackDcComponent
   */
  constructor() {}

  /**
   * This method handles the initialization tasks.
   *
   * @memberof FeedbackDcComponent
   */
  ngOnInit() {}
}
