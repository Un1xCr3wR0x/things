/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NationalityTypeEnum, BilingualText, dayDiff } from '@gosi-ui/core';
import { Injury } from '../../models';

@Component({
  selector: 'oh-injury-detail-dc',
  templateUrl: './injury-detail-dc.component.html',
  styleUrls: ['./injury-detail-dc.component.scss']
})
export class InjuryDetailDcComponent implements OnChanges {
  /**
   * Input variables
   */
  @Input() injuryDetails: Injury;
  @Input() idCode: string;

  /**
   * Local variables
   */
  latitude = 24.894801;
  longitiude = 46.610461;
  showCity: boolean;
  delayedDays: number;
  delayedDaysWithCurrentDay: number;
  labelForReason: string;
  showReopenReason: boolean;
  payee: BilingualText = new BilingualText();
  labelForReasonEmployer: string;

  /**
   *Method to detect changes in input
   * @param changes Capturing input on changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.injuryDetails && changes.injuryDetails.currentValue) {
      this.latitude = Number(changes.injuryDetails.currentValue.latitude);
      this.longitiude = Number(changes.injuryDetails.currentValue.longitude);
      if (this.injuryDetails?.country) {
        if (this.injuryDetails?.country?.english === NationalityTypeEnum.SAUDI_NATIONAL) {
          this.showCity = true;
        } else {
          this.showCity = false;
        }
      }
      this.checkWorkFlowStatus();
      this.setLabelForReasonForDelay();
    }
  }
  setLabelForReasonForDelay() {
    if (
      this.injuryDetails?.employeeInformedDate !== undefined ||
      (null && this.injuryDetails?.injuryDate !== undefined) ||
      null
    ) {
      this.delayedDays = this.getDateDifference(
        this.injuryDetails?.injuryDate.gregorian,
        this.injuryDetails?.employeeInformedDate.gregorian
      );
      if (this.delayedDays >= 7) {
        this.labelForReason = 'OCCUPATIONAL-HAZARD.REASON-FOR-DELAY-CONTRIBUTOR';
      }
    }
    if (
      this.injuryDetails.employeeInformedDate !== undefined ||
      (null && this.injuryDetails?.injuryDate === undefined) ||
      null
    ) {
      this.delayedDaysWithCurrentDay = this.getDateDifference(
        this.injuryDetails?.employeeInformedDate.gregorian,
        this.injuryDetails?.employerInformedDate.gregorian
      );
      if (this.delayedDaysWithCurrentDay >= 3) {
        this.labelForReason = 'OCCUPATIONAL-HAZARD.REASON-FOR-DELAY-EMPLOYER';
      }
    }
    if (this.delayedDays >= 7 && this.delayedDaysWithCurrentDay >= 3) {
      this.labelForReason = 'OCCUPATIONAL-HAZARD.REASON-FOR-DELAY-BOTH';
    }
    if (this.injuryDetails?.initiatedBy === 2005) {
      this.labelForReason = 'OCCUPATIONAL-HAZARD.REASON-FOR-DELAY-CONTRIBUTOR';
      this.labelForReasonEmployer = 'OCCUPATIONAL-HAZARD.REASON-FOR-DELAY-EMPLOYER'
    }
  }
  getDateDifference(dateFrom: Date, dateto: Date) {
    const delayedDays = dayDiff(dateFrom, dateto);
    return delayedDays;
  }
  /*To check Reopen workflow Status is approved*/
  checkWorkFlowStatus() {
    if (
      this.injuryDetails.workFlowStatus === 2033 ||
      this.injuryDetails.workFlowStatus === 2034 ||
      this.injuryDetails.workFlowStatus === 2035 ||
      this.injuryDetails.workFlowStatus === 2036
    ) {
      this.showReopenReason = true;
    }
  }
  /**
   * get payee
   */
  getPayee() {
    if (this.injuryDetails.allowancePayee === 2) {
      this.payee.english = 'Contributor';
      this.payee.arabic = 'المشترك';
      return this.payee;
    } else if (this.injuryDetails.allowancePayee === 1) {
      this.payee.english = 'Establishment';
      this.payee.arabic = 'منشأة';
      return this.payee;
    }
  }
}
