/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'cnt-engagement-timeline-dc',
  templateUrl: './engagement-timeline-dc.component.html',
  styleUrls: ['./engagement-timeline-dc.component.scss']
})
export class EngagementTimelineDcComponent implements OnInit {
  constructor() {}

  @Input() isFirstItem = false;
  @Input() isLastItem = false;
  ngOnInit(): void {}
}
