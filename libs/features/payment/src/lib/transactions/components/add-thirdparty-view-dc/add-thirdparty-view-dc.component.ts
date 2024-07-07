/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { AdjustmentConstants, AdjustmentDetails, BeneficiaryList, BenefitDetails, PayeeDetails } from '../../../shared';

@Component({
  selector: 'pmt-add-thirdparty-view-dc',
  templateUrl: './add-thirdparty-view-dc.component.html',
  styleUrls: ['./add-thirdparty-view-dc.component.scss']
})
export class AddThirdpartyViewDcComponent implements OnInit {
  constructor() {}
  // Input Variables
  @Input() adjustmentResponse: AdjustmentDetails;
  @Input() benefitResponse: BenefitDetails;
  @Input() payeeResponse: PayeeDetails;
  @Input() payeebankName: BilingualText;
  // Output Variables
  @Output() navigateToBenefitViewPage: EventEmitter<BilingualText> = new EventEmitter();
  // Local Variables
  sanedPension = AdjustmentConstants.SANED_PENSION;
  bankTransfer = AdjustmentConstants.BANK_TRANSFER;
  ngOnInit(): void {}

  navToBenefitView(type) {
    this.navigateToBenefitViewPage.emit(type);
  }
}
