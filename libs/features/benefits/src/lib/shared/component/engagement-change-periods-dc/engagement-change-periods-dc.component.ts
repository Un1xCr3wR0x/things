import { BenefitType, DateMonthYearLabel, MonthYearLabel } from '../../../shared/enum';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { GosiCalendar, monthDiff } from '@gosi-ui/core';

import { isLumpsumBenefit } from '../../utils/benefitUtil';
import moment from 'moment';

@Component({
  selector: 'bnt-engagement-change-periods-dc',
  templateUrl: './engagement-change-periods-dc.component.html',
  styleUrls: ['./engagement-change-periods-dc.component.scss']
})
export class EngagementChangePeriodsDcComponent implements OnInit {
  @Input() benefitDetails;
  @Input() benefitRecalculationDetails;
  @Input() lang = 'en';
  @Input() isTransactionCompleted = false;

  @Output() onCalculationBtnClicked = new EventEmitter();
  @Output() onViewPaymentClicked = new EventEmitter();
  @Output() onViewPaymentHistoryClicked = new EventEmitter();

  monthDifference = monthDiff;
  isLumpsum: boolean;
  BenefitType = BenefitType;

  readonly Math = Math;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.benefitDetails) {
      this.isLumpsum = isLumpsumBenefit(this.benefitDetails?.benefitType?.english);
    }
  }
  showBenefitCalculation() {
    this.onCalculationBtnClicked.emit(null);
  }
  /** Method to navigate to view payment history */
  onViewPaymentHistory(benefitDetails) {
    this.onViewPaymentClicked.emit(benefitDetails);
  }
  /* This method is for getting month labels to display */
  getMonthLabelInRejoining(date: GosiCalendar) {
    let monthLabel = '';
    if (date?.gregorian) {
      monthLabel = Object.values(MonthYearLabel)[moment(date?.gregorian).toDate().getMonth()];
    }
    return monthLabel;
  }
  getDayMonthLabel(date: GosiCalendar) {
    let dayMonthLabel = '';
    if (date?.gregorian) {
      dayMonthLabel = Object.values(DateMonthYearLabel)[moment(date?.gregorian).toDate().getMonth()];
    }
    return dayMonthLabel;
  }
  onViewPaymentHistoryFromRejoining(recalculationDetails) {
    this.onViewPaymentHistoryClicked.emit(recalculationDetails);
  }
  /** Method to emit an event to open how to calculate modal */
  onHowToCalculateRejoining(period) {
    this.onCalculationBtnClicked.emit(period);
  }
}
