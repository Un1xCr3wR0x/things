/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EligibilityMonthsAmount } from '../../models';

@Component({
  selector: 'bnt-eligible-months-dc',
  templateUrl: './eligible-months-dc.component.html',
  styleUrls: ['./eligible-months-dc.component.scss']
})
export class EligibleMonthsDcComponent implements OnInit {
  @Input() eligibleMonthsAmounts: EligibilityMonthsAmount[];
  @Output() close = new EventEmitter();

  constructor() {}

  /**
   * This method is for initialization tasks
   */
  ngOnInit(): void {}

  /**
   * This method is for hiding model
   */
  hideModal() {
    this.close.emit();
  }
}
