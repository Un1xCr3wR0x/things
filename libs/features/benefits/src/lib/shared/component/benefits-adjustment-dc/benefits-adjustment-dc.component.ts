/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { BenefitsAdjustmentWrapper } from '../../models';

@Component({
  selector: 'bnt-benefits-adjustment-dc',
  templateUrl: './benefits-adjustment-dc.component.html',
  styleUrls: ['./benefits-adjustment-dc.component.scss']
})
export class BenefitsAdjustmentDcComponent implements OnInit {
  //Input Variables
  @Input() lumpsumAdjustmentsWrapper: BenefitsAdjustmentWrapper;
  @Input() isValidator: boolean;
  constructor() {}

  ngOnInit(): void {}
}
