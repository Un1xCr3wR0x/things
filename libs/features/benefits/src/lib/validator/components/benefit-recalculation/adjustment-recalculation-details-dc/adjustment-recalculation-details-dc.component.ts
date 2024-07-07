import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GosiCalendar, formatDate } from '@gosi-ui/core';
import moment from 'moment';
import { BenefitRecalculation, MonthYearLabel } from '../../../../shared';
import { FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'bnt-adjustment-recalculation-details-dc',
  templateUrl: './adjustment-recalculation-details-dc.component.html',
  styleUrls: ['./adjustment-recalculation-details-dc.component.scss']
})
export class AdjustmentRecalculationDetailsDcComponent implements OnInit {
  @Input() benefitRecalculationDetails: BenefitRecalculation;
  @Input() disableDirectPayment;
  @Input() lang;
  @Input() paymentFormArray: FormArray;

  @Output() onOtherBenefitClicked = new EventEmitter();
  @Output() onPreviousAdjustmentsClicked = new EventEmitter();
  @Output() onDirectPaymentSelected = new EventEmitter();

  readonly Math = Math;

  constructor() {}

  ngOnInit(): void {}
  /** Method to navigate to benefit page */
  navigateToProfileBenefit(otherBenefitDetails) {
    if (otherBenefitDetails) {
      this.onOtherBenefitClicked.emit(otherBenefitDetails);
    }
  }
  /** Method to get month label */
  getMonthLabelByPeriod(date: GosiCalendar) {
    let monthLabel = '';
    if (date?.gregorian) {
      monthLabel = Object.values(MonthYearLabel)[moment(date?.gregorian).toDate().getMonth()];
    }
    return monthLabel;
  }
  /** Method to view previous adjustment details */
  onViewPreviousDetails(personId) {
    this.onPreviousAdjustmentsClicked.emit(personId);
  }
  /** Method to get the checked direct payment status */
  onSelected(checked, personId) {
    const directPaymentStatus = { directPayment: checked, personId: personId };
    this.onDirectPaymentSelected.emit(directPaymentStatus);
  }
  /** Method to get pay form */
  getPayForm(directPaymentStatus: boolean) {
    const checked = directPaymentStatus ? directPaymentStatus : false;
    return new FormControl(checked);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
