/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdjustmentConstants, ThirdPartyAdjustmentList } from '../../../shared';
import { BilingualText } from '@gosi-ui/core';
@Component({
  selector: 'pmt-manage-thirdparty-view-dc',
  templateUrl: './manage-thirdparty-view-dc.component.html',
  styleUrls: ['./manage-thirdparty-view-dc.component.scss']
})
export class ManageThirdpartyViewDcComponent implements OnInit {
  constructor() {}
  // Input values
  @Input() thirdPartyAdjustmentList: Map<number, ThirdPartyAdjustmentList>;
  // Output values
  @Output() navigateToAdjustment: EventEmitter<number> = new EventEmitter();
  @Output() navigateToBenefitView: EventEmitter<BilingualText> = new EventEmitter();
  @Output() onPreviousThirdPartyAdjustments = new EventEmitter();
  // Local Variables
  otherReasons = AdjustmentConstants.MANAGE_ADJUSTMENT_OTHER_RESONS;
  actionTypeAdd = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.ADD.english;
  actionTypeModify = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY.english;
  actionTypeHold = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.HOLD.english;
  actionTypeStop = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.STOP.english;
  actionTypeReactivate = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.REACTIVATE.english;
  readMoreFlag = false;
  sanedPension = AdjustmentConstants.SANED_PENSION;
  bankTransfer = AdjustmentConstants.BANK_TRANSFER;
  showMore = 'ADJUSTMENT.READ-FULL-NOTE';
  limitvalue: number;
  limit = 100;
  ngOnInit(): void {
    this.limitvalue = this.limit;
  }
  navigateToAdjustmentDetailScreen(adjId) {
    this.navigateToAdjustment.emit(adjId);
  }
  navigateToBenefit(type) {
    this.navigateToBenefitView.emit(type);
  }
  readFullNotes(noteText) {
    this.readMoreFlag = !this.readMoreFlag;
    if (this.readMoreFlag) {
      this.limit = noteText.length;
      this.showMore = 'ADJUSTMENT.READ-LESS-NOTE';
    } else {
      this.limit = this.limitvalue;
      this.showMore = 'ADJUSTMENT.READ-FULL-NOTE';
    }
  }
}
