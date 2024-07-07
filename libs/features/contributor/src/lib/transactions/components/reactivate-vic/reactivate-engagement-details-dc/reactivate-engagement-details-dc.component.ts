import { Component, Inject, Input,OnInit, Output, SimpleChanges } from '@angular/core';

import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { EngagementType,ManageWageConstants,ContributorConstants,EngagementDetails } from '@gosi-ui/features/contributor/lib/shared';

@Component({
  selector: 'cnt-reactivate-vic-details-dc',
  templateUrl: './reactivate-engagement-details-dc.component.html',
  styleUrls: ['./reactivate-engagement-details-dc.component.scss']
})
export class ReactivateEngagementDetailsDcComponent implements OnInit {
  /** Local variables. */
  lang: string;
  isFutureEndingEngagement: boolean;

  /** Constants */
  typeVic = EngagementType.VIC;

  /** Input variable */
  @Input() engagement: EngagementDetails;

  /** This method creates a instance of EngagementAccordianViewDcComponent. */
  constructor(@Inject(LanguageToken) private language: BehaviorSubject<string>) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(lan => (this.lang = lan));
  }

   /** Method to detect changes in input. */
   ngOnChanges(changes: SimpleChanges) {
    if(changes.engagement && changes.engagement.currentValue){
     console.log('third dc',this.engagement);
     console.log(this.engagement.engagementPeriod);

    }
 }

  identifyEngagementEndingInFuture() {
    if (
      moment(this.engagement.leavingDate.gregorian).isAfter(new Date()) &&
      moment(this.engagement.joiningDate.gregorian).isBefore(new Date())
    )
      this.isFutureEndingEngagement = true;
  }
}

