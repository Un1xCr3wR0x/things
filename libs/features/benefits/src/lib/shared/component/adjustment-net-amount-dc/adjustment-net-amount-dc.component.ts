/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BenefitRecalculation } from '../../models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'bnt-adjustment-net-amount-dc',
  templateUrl: './adjustment-net-amount-dc.component.html',
  styleUrls: ['./adjustment-net-amount-dc.component.scss']
})
export class AdjustmentNetAmountDcComponent implements OnInit {
  @Input() benefitRecalculationDetails: BenefitRecalculation;
  @Input() hidePayment: Boolean = false;
  @Input() checkForm: FormGroup;
  @Input() disableDirectPayment = false;
  @Input() pageName: string;

  @Output() onPreviousAdjustmentsClicked = new EventEmitter();

  readonly Math = Math;

  constructor() {}

  ngOnInit(): void {}
  /** Method to view adjustment details */
  viewRecalculateAdjustmentDetails() {
    this.onPreviousAdjustmentsClicked.emit();
  }
}
