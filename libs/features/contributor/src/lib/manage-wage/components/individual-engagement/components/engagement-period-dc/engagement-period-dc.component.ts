import { Component, Input, OnInit } from '@angular/core';
import { EngagementDetails, EngagementType } from '@gosi-ui/features/contributor/lib/shared';

@Component({
  selector: 'cnt-engagement-period-dc',
  templateUrl: './engagement-period-dc.component.html',
  styleUrls: ['./engagement-period-dc.component.scss']
})
export class EngagementPeriodDcComponent implements OnInit {
  @Input() engagement: EngagementDetails;
  @Input() lang: string;
  @Input() isTotalShare = true;
  @Input() displayIcon = false;
  /** Constants */
  typeVic = EngagementType.VIC;
  constructor() {}

  ngOnInit(): void {}
}
