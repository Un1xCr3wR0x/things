/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BreakUp } from '../../models';
import { CalculationWrapper } from '../../models/calculation-wrapper';
import { DateFormat } from '../../models/date';
import { DailyWageCalculationDcComponent } from '..';

@Component({
  selector: 'oh-daily-wage-validator-widget',
  templateUrl: './daily-wage-validator-widget-dc.component.html',
  styleUrls: ['./daily-wage-validator-widget-dc.component.scss']
})
export class DailyWageValidatorWidgetComponent extends DailyWageCalculationDcComponent implements OnChanges {
  constructor() {
    super();
  }
  /**
   * Input Variables
   */
  @Input() calculationWrapper: CalculationWrapper;
  @Input() contributorWage: string;
  @Input() day: DateFormat[];
  dailyWage: BreakUp[] = [];
  dailyAllowance: BreakUp[] = [];

  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.day) {
      this.day = changes.day.currentValue;
    }
    this.calculationWrapper.allowanceBreakup.breakUpDetails.forEach(element => {
      if (element.type === 'Daily Wage') {
        this.dailyWage.push(element);
      }
      if (element.type === 'Daily Allowance') {
        this.dailyAllowance.push(element);
      }
    });
    if (changes && changes.contributorWage) {
      this.contributorWage = changes.contributorWage.currentValue;
    }
    if (changes && changes.calculationWrapper) {
      this.calculationWrapper = changes.calculationWrapper.currentValue;
    }
  }
}
