import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReEmploymentDetails, MonthYearLabel, AnnuityResponseDto } from '../../../../shared';
import { GosiCalendar, monthDiff, formatDate } from '@gosi-ui/core';
import moment from 'moment';
@Component({
  selector: 'bnt-rejoining-benefit-dc',
  templateUrl: './rejoining-benefit-dc.component.html',
  styleUrls: ['./rejoining-benefit-dc.component.scss']
})
export class RejoiningBenefitDcComponent implements OnInit {
  @Input() lang: string;
  @Input() benefitDetails: AnnuityResponseDto;
  @Input() benefitRecalculationDetails: ReEmploymentDetails;
  @Input() subResource: string;

  @Output() onViewPaymentHistoryClicked = new EventEmitter();
  @Output() onCalculationBtnClicked = new EventEmitter();
  @Output() onEngagementDetailsClicked = new EventEmitter();
  finalAvgWage = true;
  monthDifference = monthDiff;

  readonly Math = Math;
  constructor() {}

  ngOnInit(): void {}
  onViewPaymentHistoryFromRejoining(recalculationDetails) {
    this.onViewPaymentHistoryClicked.emit(recalculationDetails);
  }
  /** Method to emit an event to open how to calculate modal */
  onHowToCalculateRejoining(period) {
    this.onCalculationBtnClicked.emit(period);
  }
  /* This method is for getting month labels to display */
  getMonthLabelInRejoining(date: GosiCalendar) {
    let monthLabel = '';
    if (date?.gregorian) {
      monthLabel = Object.values(MonthYearLabel)[moment(date?.gregorian).toDate().getMonth()];
    }
    return monthLabel;
  }
  /** Method to navigate to engagement details */
  onEngagementDetails() {
    this.onEngagementDetailsClicked.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
