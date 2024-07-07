import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  AdjustmentConstants,
  AdjustmentDetails,
  BeneficiaryList,
  ThirdPartyAdjustmentList,
  ThirdPartyBankAccount
} from '@gosi-ui/features/payment/lib/shared';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'pmt-third-party-adjustment-benefit-modified-dc',
  templateUrl: './third-party-adjustment-benefit-modified-dc.component.html',
  styleUrls: ['./third-party-adjustment-benefit-modified-dc.component.scss']
})
export class ThirdPartyAdjustmentBenefitModifiedDcComponent implements OnInit {
  /**Input Variables */
  @Input() adjustmentValues: AdjustmentDetails;
  @Input() bankDetails: ThirdPartyBankAccount;
  @Input() benefitList: BeneficiaryList;
  @Input() thirdPartyAdjustmentList: Map<number, ThirdPartyAdjustmentList>;

  // Output values
  @Output() navigateToAdjustmentDetail: EventEmitter<number> = new EventEmitter();
  @Output() navigateToBenefitViewPage: EventEmitter<BilingualText> = new EventEmitter();
  @Output() onPreviousThirdPartyAdjustmentsClicked = new EventEmitter();

  /**Local Variables */
  readMore = false;
  sanedPension = AdjustmentConstants.SANED_PENSION;
  bankTransfer = AdjustmentConstants.BANK_TRANSFER;
  showMoreText = 'ADJUSTMENT.READ-FULL-NOTE';
  limitvalue: number;
  limit = 100;
  otherReasons = AdjustmentConstants.MANAGE_ADJUSTMENT_OTHER_RESONS;
  actionTypeAdd = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.ADD.english;
  actionTypeModify = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY.english;
  actionTypeHold = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.HOLD.english;
  actionTypeStop = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.STOP.english;
  actionTypeReactivate = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.REACTIVATE.english;

  constructor() {}

  ngOnInit(): void {
    this.limitvalue = this.limit;
  }
  readFullNote(noteText) {
    this.readMore = !this.readMore;
    if (this.readMore) {
      this.limit = noteText.length;
      this.showMoreText = 'ADJUSTMENT.READ-LESS-NOTE';
    } else {
      this.limit = this.limitvalue;
      this.showMoreText = 'ADJUSTMENT.READ-FULL-NOTE';
    }
  }

  navigateToAdjustmentDetailScreen(adjId) {
    this.navigateToAdjustmentDetail.emit(adjId);
  }
  navigateToBenefitView(type) {
    this.navigateToBenefitViewPage.emit(type);
  }
}
