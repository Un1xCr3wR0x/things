/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, Input, SimpleChanges, OnChanges } from '@angular/core';
import { LanguageToken, BilingualText } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { CalculationWrapper } from '../../models';
import * as moment from 'moment';

@Component({
  selector: 'oh-conveyance-allowance-dc',
  templateUrl: './conveyance-allowance-dc.component.html',
  styleUrls: ['./conveyance-allowance-dc.component.scss']
})
export class ConveyanceAllowanceDcComponent implements OnInit, OnChanges {
  //Local Variables
  lang = 'en';
  conveyanceStartDay: Date;
  conveyanceEndDay: Date;
  conveyanceVisitedDay: Date;
  daysDifference: number;
  flag = false;
  isVisitsLesser = false;
  isVisitsGreater = false;
  noOfVisits: number;
  totalAllowance: number;
  //Input Variables
  @Input() calculationWrapper: CalculationWrapper;
  @Input() validatorView = false;
  @Input() treatmentType: BilingualText;

  /**
   * Creating Instance
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * This method if for initialization tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /**
   * This method is detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.calculationWrapper) {
      this.calculationWrapper = changes.calculationWrapper.currentValue;
      this.getConveyanceAllowance();
    }
  }
  /**
   * This method is to get conveyance allowance details
   */
  getConveyanceAllowance() {
    if (this.calculationWrapper && this.calculationWrapper.allowanceBreakup) {
      const startDate = moment(this.calculationWrapper.allowanceBreakup.startDate.gregorian);
      this.conveyanceStartDay = startDate.toDate();
      const endDate = moment(this.calculationWrapper.allowanceBreakup.endDate.gregorian);
      this.conveyanceEndDay = endDate.toDate();
      this.daysDifference = endDate.diff(startDate, 'days');
      if (this.daysDifference === 0 && this.treatmentType.english === 'InPatient') {
        this.flag = false;
        this.isVisitsLesser = true;
        this.noOfVisits = 1;
      } else {
        this.isVisitsLesser = false;
        this.isVisitsGreater = true;
        this.flag = true;
        this.noOfVisits = this.calculationWrapper.allowanceBreakup.noOfVisits;
      }
      this.totalAllowance = this.calculationWrapper.allowanceBreakup.totalAllowance;
    }
  }
}
