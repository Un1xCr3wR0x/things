import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GosiCalendar } from '@gosi-ui/core';
import { ContributionCategory } from '@gosi-ui/features/contributor';
import moment from 'moment';
import { CoveragePeriodWrapper, VicContributionDetails, VicEngagementDetails, VicEngagementPeriod } from '../../models';

@Component({
  selector: 'dsb-vic-contribution-details-dc',
  templateUrl: './vic-contribution-details-dc.component.html',
  styleUrls: ['./vic-contribution-details-dc.component.scss']
})
export class VicContributionDetailsDcComponent implements OnInit, OnChanges {
  @Input() vicCoverageDetails: VicContributionDetails;
  @Input() vicEngagementDetails: VicEngagementDetails;
  @Input() isTotalShare = false;
  @Input() displayIcon = true;
  @Input() isAppProfile: boolean;
  @Input() isVic?: boolean;
  @Input() lang: string;
  @Input() showEngHistory = false;
  @Input() isPREligible: boolean;
  
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  joiningDate: GosiCalendar;
  engagementPeriod: VicEngagementPeriod;
  contributionDetails: CoveragePeriodWrapper;
  cov = null;
  annuity = ContributionCategory.ANNUITY;
  PPAnnuity = ContributionCategory.PENSION_REFORM_ANNUITY
  oh = ContributionCategory.OH;
  ui = ContributionCategory.UI;
  isEligibileReqDate: boolean;
  secondLastPeriod: VicEngagementPeriod;
  paidMonths: number | undefined;
  unPaidMonths: number | undefined;
  imageClick = false;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.vicCoverageDetails && changes.vicCoverageDetails.currentValue) {
      this.vicCoverageDetails = changes.vicCoverageDetails.currentValue;
      if (
        this.vicCoverageDetails.totalContributionMonths !== undefined &&
        this.vicCoverageDetails.totalContributionMonths !== undefined
      ) {
        this.paidMonths = this.vicCoverageDetails.totalContributionMonths;
        this.unPaidMonths = this.vicCoverageDetails.numberOfUnPaidMonths;
      }
    }
    if (changes && changes.vicEngagementDetails && changes.vicEngagementDetails.currentValue) {
      this.vicEngagementDetails = changes.vicEngagementDetails.currentValue;
      this.engagementPeriod = this.vicEngagementDetails?.engagementPeriod[0];
      this.joiningDate = this.vicEngagementDetails?.engagementPeriod[
        this.vicEngagementDetails?.engagementPeriod?.length - 1
      ]?.startDate;
      const requestDateFormat = moment(
        this.vicEngagementDetails?.engagementPeriod[0]?.startDate?.gregorian?.toString()
      );
      this.isEligibileReqDate = requestDateFormat.isSameOrAfter(moment(new Date().toString()));
      this.secondLastPeriod = this.vicEngagementDetails?.engagementPeriod[1];
    }
  }

  imageClicked() {
    this.imageClick = true;
  }
  navigateToEngagement() {
    if (this.imageClick != true) {
      this.navigate.emit();
    }
    this.imageClick = false;
  }
}
