import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GosiCalendar } from '@gosi-ui/core';
import {
  VicContributionDetails,
  VicEngagementDetails,
  VicEngagementPeriod
} from '@gosi-ui/features/contributor/lib/shared';
import moment from 'moment';

@Component({
  selector: 'cnt-vic-details-dc',
  templateUrl: './vic-details-dc.component.html',
  styleUrls: ['./vic-details-dc.component.scss']
})
export class VicDetailsDcComponent implements OnInit, OnChanges {
  @Input() vicContributionDto: VicContributionDetails;
  @Input() vicEngagementDto: VicEngagementDetails;
  @Input() wageUpdateSuccess?: false;
  joiningDate: GosiCalendar;
  startDate: GosiCalendar;
  engagementPeriod: VicEngagementPeriod;
  currentEngagementPeriod: VicEngagementPeriod;
  latestEngagementPeriod: VicEngagementPeriod;
  isEligibileReqDate: boolean;
  @Output() update: EventEmitter<null> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.wageUpdateSuccess?.currentValue) {
      this.disableUpdateButton();
    }
    if (changes && changes?.vicContributionDto && changes?.vicContributionDto?.currentValue) {
      this.vicContributionDto = changes?.vicContributionDto?.currentValue;
    }
    if (changes && changes?.vicEngagementDto && changes?.vicEngagementDto?.currentValue) {
      this.vicEngagementDto = changes?.vicEngagementDto?.currentValue;
      if (this.vicEngagementDto?.engagementPeriod) {
        const latestEngagementPeriodStartDate = moment(
          this.vicEngagementDto?.engagementPeriod[0]?.startDate?.gregorian?.toString()
        );
        if (latestEngagementPeriodStartDate.isAfter(moment(new Date().toString()))) {
          this.currentEngagementPeriod = this.vicEngagementDto?.engagementPeriod[1];
        } else {
          this.currentEngagementPeriod = this.vicEngagementDto?.engagementPeriod[0];
        }
        this.joiningDate = this.vicEngagementDto?.joiningDate;
        this.engagementPeriod = this.vicEngagementDto?.engagementPeriod[1];
        this.startDate = this.currentEngagementPeriod?.startDate;
        const requestDateFormat = moment(this.vicEngagementDto?.engagementPeriod[0]?.startDate?.gregorian?.toString());
        this.isEligibileReqDate = requestDateFormat.isSameOrAfter(moment(new Date().toString()));
        this.latestEngagementPeriod = this.vicEngagementDto?.engagementPeriod[0];
      }
    }
  }
  disableUpdateButton() {
    if (this.wageUpdateSuccess) {
      setTimeout(() => {
        this.wageUpdateSuccess = false;
      }, 60000);
    }
  }
  navigateToModify() {
    this.update.emit();
  }
}
