import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GosiCalendar } from '@gosi-ui/core';
import moment from 'moment';
import { DateMonthYearLabel, MonthYearLabel } from '../../../../shared/enum';

@Component({
  selector: 'bnt-recalculate-adjustment-dc',
  templateUrl: './recalculate-adjustment-dc.component.html',
  styleUrls: ['./recalculate-adjustment-dc.component.scss']
})
export class RecalculateAdjustmentDcComponent implements OnInit {
  @Input() benefitRecalculationDetails;
  @Input() hidePayment: Boolean = false;
  @Input() checkForm: FormGroup;
  @Input() disableDirectPayment = false;
  @Input() lang: string;
  @Input() isDebitRequired: Boolean = true;

  @Output() onPreviousAdjustmentsClicked = new EventEmitter();

  readonly Math = Math;
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {}
  /** Method to get month label */
  getMonthLabelByPeriod(date: GosiCalendar) {
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
  /** Method to view previous adjustment details */
  onViewPreviousDetails() {
    this.onPreviousAdjustmentsClicked.emit();
  }
}
