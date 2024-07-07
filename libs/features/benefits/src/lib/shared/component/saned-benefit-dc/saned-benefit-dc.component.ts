/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GosiCalendar, formatDate } from '@gosi-ui/core';
import moment from 'moment';
import { MonthYearLabel } from '../../enum';
import { SanedRecalculation } from '../../models';
@Component({
  selector: 'bnt-saned-benefit-dc',
  templateUrl: './saned-benefit-dc.component.html',
  styleUrls: ['./saned-benefit-dc.component.scss']
})
export class SanedBenefitDcComponent implements OnInit {
  @Input() sanedRecalculationDetails: SanedRecalculation;
  @Input() lang: string;

  @Output() onCalculationBtnClicked = new EventEmitter();
  @Output() onViewPaymentHistoryClicked = new EventEmitter();

  readonly Math = Math;
  constructor() {}

  ngOnInit(): void {}
  /** Method to emit an event to open how to calculate modal */
  onHowToCalculate(calculationPeriod) {
    this.onCalculationBtnClicked.emit(calculationPeriod);
  }
  /** Method to navigate to payment history */
  onViewPaymentHistory(benefit) {
    this.onViewPaymentHistoryClicked.emit(benefit);
  }
  /** Method to get Adjustment type */
  getAdjustmentType(adjustmentAmount) {
    return adjustmentAmount > 0 ? 'BENEFITS.CREDIT' : adjustmentAmount < 0 ? 'BENEFITS.DEBIT' : '';
  }
  /* This method is for getting month labels to display */
  getMonthLabel(date: GosiCalendar) {
    let monthLabel = '';
    if (date?.gregorian) {
      monthLabel = Object.values(MonthYearLabel)[moment(date?.gregorian).toDate().getMonth()];
    }
    return monthLabel;
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
