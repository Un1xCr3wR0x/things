/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnInit } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import { EngagementType } from '../../../../shared/enums';
import { EngagementDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-engagement-period-accordian-dc',
  templateUrl: './engagement-period-accordian-dc.component.html',
  styleUrls: ['./engagement-period-accordian-dc.component.scss']
})
export class EngagementPeriodAccordianDcComponent implements OnInit {
  /** Local variables. */
  lang: string;
  isFutureEndingEngagement: boolean;

  /** Constants */
  typeVic = EngagementType.VIC;

  /** Input variable */
  @Input() engagement: EngagementDetails;
  @Input() isPREligible: boolean;

  imageClick: boolean;
  isPpa: boolean;

  /** This method creates a instance of EngagementAccordianViewDcComponent. */
  constructor(@Inject(LanguageToken) private language: BehaviorSubject<string>) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(lan => (this.lang = lan));
    this.isPpa = this.engagement?.ppaIndicator ? true : false;
  }

  identifyEngagementEndingInFuture() {
    if (
      moment(this.engagement.leavingDate.gregorian).isAfter(new Date()) &&
      moment(this.engagement.joiningDate.gregorian).isBefore(new Date())
    )
      this.isFutureEndingEngagement = true;
  }
  imageClicked() {
    this.imageClick = true;
  }
}
