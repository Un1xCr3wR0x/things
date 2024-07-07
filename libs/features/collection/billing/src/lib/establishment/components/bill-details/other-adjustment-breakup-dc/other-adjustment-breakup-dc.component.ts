/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AdjustmentTotal } from '../../../../shared/models';

@Component({
  selector: 'blg-other-adjustment-breakup-dc',
  templateUrl: './other-adjustment-breakup-dc.component.html',
  styleUrls: ['./other-adjustment-breakup-dc.component.scss']
})
export class OtherAdjustmentBreakupDcComponent implements OnInit, OnChanges {
  @Input() adjustmentTotal: AdjustmentTotal[];
  //Input Variables
  adjustmentDetails;
  isTypeAvailable = false;
  adjustmentTotalData;
  adjustmentList;
  tempList;
  numbers = new Array(8);
  flag: number;
  constructor() {}

  ngOnInit() {}
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.adjustmentDetails = [
      {
        AdjustmentType: 1005,
        typeName: 'BILLING.FREE-PENALTY'
      },
      {
        AdjustmentType: 1007,
        typeName: 'BILLING.MISCELLANEOUS-DEBIT'
      },
      {
        AdjustmentType: 1006,
        typeName: 'BILLING.MISCELLANEOUS-CREDIT'
      },
      {
        AdjustmentType: 1008,
        typeName: 'BILLING.ESTABLISHMENT-CLOSURE'
      },
      {
        AdjustmentType: 1014,
        typeName: 'BILLING.CLOSURE-CREDIT-TRANSFER'
      },
      {
        AdjustmentType: 1025,
        typeName: 'BILLING.REQUEST-CREDIT-BALANCE-ADJUSTMENT'
      },
      {
        AdjustmentType: 1013,
        typeName: 'BILLING.REQUEST-CREDIT-BALANCE-ADJUSTMENT'
      },
      {
        AdjustmentType: 1009,
        typeName: 'BILLING.WRITE-OFF'
      },
      {
        AdjustmentType: [1020, 1010],
        typeName: 'BILLING.MIGRATED-DATA-CREDIT-ADJUSTMENT'
      },
      {
        AdjustmentType: 0,
        typeName: ''
      },
      {
        AdjustmentType: 1022,
        typeName: 'BILLING.GCC-PENALTY'
      },
      {
        AdjustmentType: 1024,
        typeName: 'BILLING.OTHERS'
      },
      {
        AdjustmentType: 1023,
        typeName: 'BILLING.OTHERS'
      }
    ];
    let adjustmentType;
    // to set the array of adjustment if there is no match.
    const defaultAdjustment = 1010;
    if (changes && changes.adjustmentTotal) {
      this.adjustmentTotal = changes.adjustmentTotal.currentValue;
      for (const data of this.adjustmentDetails) {
        this.isTypeAvailable = false;
        for (const result of this.adjustmentTotal) {
          // check if the AdjustmentType is instance of array
          if (data.AdjustmentType instanceof Array) {
            data.AdjustmentType.forEach(adj => {
              if (adj === result.ADJUSTMENTTYPE) {
                adjustmentType = result.ADJUSTMENTTYPE;
                this.isTypeAvailable = true;
                this.adjustmentTotalData = result;
                return true;
              }
            });
            data.AdjustmentType = adjustmentType === undefined ? defaultAdjustment : adjustmentType;
          } else {
            if (result.ADJUSTMENTTYPE === data.AdjustmentType) {
              this.isTypeAvailable = true;
              this.adjustmentTotalData = result;
            }
          }
          this.checkType(data);
        }
      }
      this.setAdjustmentList();
    }
  }
  checkType(data) {
    if (this.isTypeAvailable) {
      data['oh'] = {
        debit: this.adjustmentTotalData.IND === 'DEBIT' ? this.adjustmentTotalData.TotalOHContribution : 0,
        credit: this.adjustmentTotalData.IND === 'CREDIT' ? this.adjustmentTotalData.TotalOHContribution : 0
      };
      data['ui'] = {
        debit: this.adjustmentTotalData.IND === 'DEBIT' ? this.adjustmentTotalData.TotalUIContribution : 0,
        credit: this.adjustmentTotalData.IND === 'CREDIT' ? this.adjustmentTotalData.TotalUIContribution : 0
      };
      data['annuity'] = {
        debit: this.adjustmentTotalData.IND === 'DEBIT' ? this.adjustmentTotalData.TotalAnnuityContribution : 0,
        credit: this.adjustmentTotalData.IND === 'CREDIT' ? this.adjustmentTotalData.TotalAnnuityContribution : 0
      };
      data['ohPenalty'] = {
        debit: this.adjustmentTotalData.IND === 'DEBIT' ? this.adjustmentTotalData.TotalOHPenalty : 0,
        credit: this.adjustmentTotalData.IND === 'CREDIT' ? this.adjustmentTotalData.TotalOHPenalty : 0
      };
      data['uipenalty'] = {
        debit: this.adjustmentTotalData.IND === 'DEBIT' ? this.adjustmentTotalData.TotalUIPenalty : 0,
        credit: this.adjustmentTotalData.IND === 'CREDIT' ? this.adjustmentTotalData.TotalUIPenalty : 0
      };
      data['annuityPenalty'] = {
        debit: this.adjustmentTotalData.IND === 'DEBIT' ? this.adjustmentTotalData.TotalAnnuityPenalty : 0,
        credit: this.adjustmentTotalData.IND === 'CREDIT' ? this.adjustmentTotalData.TotalAnnuityPenalty : 0
      };
      data['misc'] = {
        debit:
          this.adjustmentTotalData.IND === 'DEBIT'
            ? this.adjustmentTotalData.Others + this.adjustmentTotalData.Others2
            : 0,
        credit:
          this.adjustmentTotalData.IND === 'CREDIT'
            ? this.adjustmentTotalData.Others + this.adjustmentTotalData.Others2
            : 0
      };
      data['total'] = {
        debit:
          this.adjustmentTotalData.IND === 'DEBIT'
            ? this.adjustmentTotalData.TotalContributionandPenalty + this.adjustmentTotalData.Others2
            : 0,
        credit:
          this.adjustmentTotalData.IND === 'CREDIT'
            ? this.adjustmentTotalData.TotalContributionandPenalty + this.adjustmentTotalData.Others2
            : 0
      };
    } else {
      data['oh'] = {
        debit: 0,
        credit: 0
      };
      data['ui'] = {
        credit: 0,
        debit: 0
      };
      data['annuity'] = {
        debit: 0,
        credit: 0
      };
      data['ohPenalty'] = {
        credit: 0,
        debit: 0
      };
      data['uipenalty'] = {
        debit: 0,
        credit: 0
      };
      data['annuityPenalty'] = {
        credit: 0,
        debit: 0
      };
      data['misc'] = {
        debit: 0,
        credit: 0
      };
      data['total'] = {
        credit: 0,
        debit: 0
      };
    }
  }
  setAdjustmentList() {
    this.adjustmentList = [];
    if (this.adjustmentList.length === 0) {
      this.adjustmentList.push(this.adjustmentDetails[0]);
    }
    for (let i = 1; i < this.adjustmentDetails.length; i++) {
      this.flag = 0;
      for (let j = 0; j < this.adjustmentList.length; j++) {
        if (this.adjustmentDetails[i].typeName === this.adjustmentList[j].typeName) {
          this.flag = 1;
          this.tempList = [];
          this.tempList['AdjustmentType'] = this.adjustmentDetails[i].AdjustmentType;
          this.tempList['typeName'] = this.adjustmentDetails[i].typeName;
          this.tempList['oh'] = {
            debit: this.adjustmentDetails[i].oh.debit + this.adjustmentList[j].oh.debit,
            credit: this.adjustmentDetails[i].oh.credit + this.adjustmentList[j].oh.credit
          };
          this.tempList['ui'] = {
            debit: this.adjustmentDetails[i].ui.debit + this.adjustmentList[j].ui.debit,
            credit: this.adjustmentDetails[i].ui.credit + this.adjustmentList[j].ui.credit
          };
          this.tempList['annuity'] = {
            debit: this.adjustmentDetails[i].annuity.debit + this.adjustmentList[j].annuity.debit,
            credit: this.adjustmentDetails[i].annuity.credit + this.adjustmentList[j].annuity.credit
          };
          this.tempList['ohPenalty'] = {
            debit: this.adjustmentDetails[i].ohPenalty.debit + this.adjustmentList[j].ohPenalty.debit,
            credit: this.adjustmentDetails[i].ohPenalty.credit + this.adjustmentList[j].ohPenalty.credit
          };
          this.tempList['uipenalty'] = {
            debit: this.adjustmentDetails[i].uipenalty.debit + this.adjustmentList[j].uipenalty.debit,
            credit: this.adjustmentDetails[i].uipenalty.credit + this.adjustmentList[j].uipenalty.credit
          };
          this.tempList['annuityPenalty'] = {
            debit: this.adjustmentDetails[i].annuityPenalty.debit + this.adjustmentList[j].annuityPenalty.debit,
            credit: this.adjustmentDetails[i].annuityPenalty.credit + this.adjustmentList[j].annuityPenalty.credit
          };
          this.tempList['misc'] = {
            debit: this.adjustmentDetails[i].misc.debit + this.adjustmentList[j].misc.debit,
            credit: this.adjustmentDetails[i].misc.credit + this.adjustmentList[j].misc.credit
          };
          this.tempList['total'] = {
            debit: this.adjustmentDetails[i].total.debit + this.adjustmentList[j].total.debit,
            credit: this.adjustmentDetails[i].total.credit + this.adjustmentList[j].total.credit
          };
        } else {
          this.flag = 0;
        }
      }
      if (this.flag === 0) {
        this.adjustmentList.push(this.adjustmentDetails[i]);
      }
      if (this.flag === 1) {
        this.adjustmentList.splice(this.adjustmentList.length - 1, 1);
        this.adjustmentList.push(this.tempList);
      }
    }
  }
}
