/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, SimpleChanges, OnChanges, Inject, OnInit } from '@angular/core';

import { getArabicName, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { Months } from '../../../shared/enums';
import { EstablishmentDetails, PenalityWavier } from '../../../shared/models';

@Component({
  selector: 'blg-exceptional-penalty-details-dc',
  templateUrl: './exceptional-penalty-details-dc.component.html',
  styleUrls: ['./exceptional-penalty-details-dc.component.scss']
})
export class ExceptionalPenaltyDetails implements OnInit, OnChanges {
  // Input Variables
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() isPPA: boolean;
  @Input() waiverDetails: PenalityWavier;
  @Input() editFlag: boolean;
  @Input() vicExceptionalFlag: boolean;

  // Local Variables
  sameMonthFlag: boolean;
  startMonth: string;
  endMonth: string;
  waiveOffEligible = 0;
  eligiblePenaltyAmt = 0;
  amount = 0;
  waivedPenaltyPercentage: string;
  lang = 'en';
  totalGracePeriod = 0;
  arabicName: string;
  contributorNumber: number;
  englishName: string;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /**
   * This method is toget details on intialising the task
   */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /**
   * This method is to detect changes in input property.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.waiverDetails && changes.waiverDetails.currentValue) {
      this.waiveOffCalculationDetails();
      this.waivedPenaltyPercentage = this.waiverDetails.waivedPenaltyPercentage + '%';
      this.amount = (this.waiverDetails.eligibleWaiveOffAmount * 100) / this.waiverDetails.waivedPenaltyPercentage;
      if (this.waiverDetails.terms !== null) {
        this.totalGracePeriod = this.waiverDetails.terms.gracePeriod + this.waiverDetails.terms.extendedGracePeriod;
      }
      if (this.waiverDetails?.contributorName?.arabic !== undefined) {
        this.contributorNumber = this.waiverDetails.contributorNumber;
        this.englishName = this.waiverDetails.contributorName.english.name;
        this.arabicName = getArabicName(changes.waiverDetails?.currentValue?.contributorName?.arabic);
      }
      this.startMonth = this.getMonths(this.waiverDetails.waiverStartDate.gregorian);
      this.endMonth = this.getMonths(this.waiverDetails.waiverEndDate.gregorian);
      if (this.startMonth === this.endMonth) {
        this.sameMonthFlag = true;
      } else {
        this.sameMonthFlag = false;
      }
    }
  }
  /**
   * Method to get month from a given date
   * @param date date
   */
  getMonths(date: Date): string {
    return Object.values(Months)[moment(date).toDate().getMonth()];
  }
  // Method to get waive off calculation details
  waiveOffCalculationDetails() {
    this.eligiblePenaltyAmt =
      this.waiverDetails.waiverPeriodPenaltyAmount * (this.waiverDetails.waivedPenaltyPercentage / 100);
  }
}
