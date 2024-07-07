/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GosiCalendar } from '@gosi-ui/core';
import moment from 'moment';
import { MonthYearLabel } from '../../enum';
import { SanedRecalculation } from '../../models';

@Component({
  selector: 'bnt-saned-adjustment-dc',
  templateUrl: './saned-adjustment-dc.component.html',
  styleUrls: ['./saned-adjustment-dc.component.scss']
})
export class SanedAdjustmentDcComponent implements OnInit {
  @Input() sanedRecalculationDetails: SanedRecalculation;
  @Input() lang: string;

  @Input() checkForm: FormGroup;
  @Input() disableDirectPayment = false;

  @Output() onPreviousAdjustmentsClicked = new EventEmitter();

  readonly Math = Math;
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {}
  viewAdjustmentDetails(benefit) {
    this.onPreviousAdjustmentsClicked.emit(benefit);
  }
  /* This method is for getting month labels to display */
  getMonthLabelInAdjustment(date: GosiCalendar) {
    let monthLabel = '';
    if (date?.gregorian) {
      monthLabel = Object.values(MonthYearLabel)[moment(date?.gregorian).toDate().getMonth()];
    }
    return monthLabel;
  }
}
