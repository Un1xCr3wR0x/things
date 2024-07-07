import { Component, Input, OnInit } from '@angular/core';
// import { ContributorConstants, DropDownItems, EngagementDetails } from '@gosi-ui/features/contributor';
import { ContributorConstants } from '@gosi-ui/features/contributor/lib/shared/constants';
import { DropDownItems } from '@gosi-ui/features/contributor/lib/shared/models/drop-down';
import { EngagementDetails } from '@gosi-ui/features/contributor/lib/shared/models/engagement-details';

@Component({
  selector: 'cnt-overall-engagement-details-dc',
  templateUrl: './overall-engagement-details-dc.component.html',
  styleUrls: ['./overall-engagement-details-dc.component.scss']
})
export class OverallEngagementDetailsDcComponent implements OnInit {
  @Input() lang: string;
  @Input() engagementDetails: EngagementDetails[];
  @Input() actionList: DropDownItems[];
  @Input() individualApp: boolean;

  /** Constants */
  ENGAGEMENTS_INACTIVE = ContributorConstants.ENGAGEMENT_INACTIVE_STATUS;
  ENGAGEMENTS_ACTIVE = ContributorConstants.ENGAGEMENT_ACTIVE_STATUS;
  ENGAGEMENTS_CANCELLED = ContributorConstants.ENGAGEMENT_CANCELLED_STATUS;
  CANCEL_IN_PROGRESS = ContributorConstants.CANCEL_ENGAGEMENT_PROGRESS_STATUS;
  constructor() {}

  ngOnInit(): void {}
  selectedItem(selectedValue: EngagementDetails) {}
}
