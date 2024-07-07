/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import {
  Adjustment,
  AdjustmentConstants,
  AdjustmentDetails,
  BeneficiaryList,
  BenefitDetails,
  PayeeDetails
} from '@gosi-ui/features/payment/lib/shared';
@Component({
  selector: 'pmt-third-party-adjustment-benefit-dc',
  templateUrl: './third-party-adjustment-benefit-dc.component.html',
  styleUrls: ['./third-party-adjustment-benefit-dc.component.scss']
})
export class ThirdPartyAdjsutmentBenefitDcComponent implements OnInit {
  constructor() {}
  // Input Values
  @Input() adjustmentValues: AdjustmentDetails;
  @Input() benefitValues: BeneficiaryList;
  @Input() payeebankName: BilingualText;
  @Input() payeeDetails: PayeeDetails;
  @Input() initialAmount: number;
  @Input() subsequentAmount: number;
  @Input() dependentAmount: number;
  @Input() helperAmount: number;
  @Input() basicBenefitAmount: number;
  @Input() benefitAmount: number;
  @Input() benefitAmountAfterDeduction: number;
  @Input() benefitStatus: BilingualText;

  // Local Values
  adjustment: AdjustmentDetails;
  values: Adjustment;
  benefit: BenefitDetails[];
  sanedPension = AdjustmentConstants.SANED_PENSION;
  bankTransfer = AdjustmentConstants.BANK_TRANSFER;
  // Output values
  @Output() navigateToBenefitViewPage: EventEmitter<BilingualText> = new EventEmitter();
  ngOnInit(): void {}

  navigateToBenefitView(type) {
    this.navigateToBenefitViewPage.emit(type);
  }
}
