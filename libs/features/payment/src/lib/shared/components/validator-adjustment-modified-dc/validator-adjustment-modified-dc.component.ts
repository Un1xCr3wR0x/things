import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdjustmentDetails } from '../../models';
import { AdjustmentConstants } from '../../constants';

@Component({
  selector: 'pmt-validator-adjustment-modified-dc',
  templateUrl: './validator-adjustment-modified-dc.component.html',
  styleUrls: ['./validator-adjustment-modified-dc.component.scss']
})
export class ValidatorAdjustmentModifiedDcComponent implements OnInit {
  /**Local Variables */
  @Input() activeAdjustments: AdjustmentDetails;
  @Input() limit? = 100;
  @Output() onBenefitDetailsClick = new EventEmitter();
  @Output() onAdjustmentViewClick = new EventEmitter();

  showFlag = false;
  showMoreText = 'ADJUSTMENT.READ-MORE';
  limitvalue: number;
  benefitLimit = 26;

  constructor() {}

  ngOnInit(): void {
    this.limitvalue = this.limit;
  }
  readFull(noteText) {
    this.showFlag = !this.showFlag;
    if (this.showFlag) {
      this.limit = noteText.length;
      this.showMoreText = 'ADJUSTMENT.READ-LESS';
    } else {
      this.limit = this.limitvalue;
      this.showMoreText = 'ADJUSTMENT.READ-MORE';
    }
  }
  navigateBenefitDetails(adjustment) {
    this.onBenefitDetailsClick.emit(adjustment);
  }
  navigateAdjustmentView(adjustment) {
    this.onAdjustmentViewClick.emit(adjustment);
  }
  getActionName(type) {
    if (type === 'Add') {
      return { name: 'ADJUSTMENT.NEW', color: 'primary' };
    } else if (type === 'Modify') {
      return { name: 'ADJUSTMENT.MODIFIED', color: 'info' };
    } else if (type === 'Cancel') {
      return { name: 'ADJUSTMENT.CANCELLED', color: 'danger' };
    } else if (type === 'Recovery') {
      return { name: 'ADJUSTMENT.NEW', color: 'primary' };
    }
  }
  getAdjustmentBalance(adjustment) {
    if (
      adjustment?.actionType?.english === 'Modify' &&
      adjustment?.modificationDetails?.afterModification?.adjustmentAmount &&
      adjustment?.modificationDetails?.beforeModification?.adjustmentAmount
    ) {
      const balance =
        adjustment?.modificationDetails?.afterModification?.adjustmentAmount +
        adjustment?.adjustmentBalance -
        adjustment?.modificationDetails?.beforeModification?.adjustmentAmount;
      return balance;
    } else {
      return adjustment?.adjustmentBalance;
    }
  }
  /** Method to check if the benefit type is saned */
  isBenefitTypeSaned(benefitType: string) {
    return benefitType
      ? benefitType.toLowerCase().includes(AdjustmentConstants.SANED) || benefitType.includes(AdjustmentConstants.UI)
      : false;
  }
}
