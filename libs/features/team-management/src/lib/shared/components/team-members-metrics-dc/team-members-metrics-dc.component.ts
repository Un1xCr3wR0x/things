/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tm-team-members-metrics-dc',
  templateUrl: './team-members-metrics-dc.component.html',
  styleUrls: ['./team-members-metrics-dc.component.scss']
})
export class TeamMembersMetricsDcComponent implements OnInit {
  /**
   * input variables
   */
  @Input() active = 0;
  @Input() onLeave = 0;
  constructor() {}

  ngOnInit(): void {}
}
