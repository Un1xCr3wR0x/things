import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { Months } from '../../../../shared/enums';
import { PenalityWavier } from '../../../../shared/models';

@Component({
  selector: 'blg-exceptional-est-late-fee-details-dc',
  templateUrl: './exceptional-est-late-fee-details-dc.component.html',
  styleUrls: ['./exceptional-est-late-fee-details-dc.component.scss']
})
export class ExceptionalEstLateFeeDetailsDcComponent implements OnChanges, OnInit {
  @Input() waiverDetails: PenalityWavier;
  waivedPenaltyPercentage: string;
  amount: number;
  totalGracePeriod = 0;
  arabicName: string;
  //contributorNumber: number;
  englishName: string;
  startMonth: string;
  endMonth: string;
  sameMonthFlag: boolean;
  eligiblePenaltyAmt = 0;
  lang = 'en';

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.waiverDetails && changes.waiverDetails.currentValue) {
      this.waiveOffCalculationDetails();
      this.waivedPenaltyPercentage = this.waiverDetails.waivedPenaltyPercentage + '%';
      this.amount = (this.waiverDetails.eligibleWaiveOffAmount * 100) / this.waiverDetails.waivedPenaltyPercentage;
      if (this.waiverDetails.terms !== null) {
        this.totalGracePeriod = this.waiverDetails.terms.gracePeriod + this.waiverDetails.terms.extendedGracePeriod;
      }
      /*if (this.waiverDetails?.contributorName?.arabic !== undefined) {
      this.arabicName =
        this.waiverDetails.contributorName.arabic.firstName + this.waiverDetails.contributorName.arabic.secondName
          ? this.waiverDetails.contributorName.arabic.secondName
          : '' + this.waiverDetails.contributorName.arabic.thirdName
          ? this.waiverDetails.contributorName.arabic.thirdName
          : '' + this.waiverDetails.contributorName.arabic.familyName;
      this.contributorNumber = this.waiverDetails.contributorNumber;
      this.englishName = this.waiverDetails.contributorName.english.name;
    }*/
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
