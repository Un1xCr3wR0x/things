/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cnt-engagement-view-dc',
  templateUrl: './engagement-view-dc.component.html',
  styleUrls: ['./engagement-view-dc.component.scss']
})
export class EngagementViewDcComponent implements OnInit {
  @Input() engagement;
  @Input() isValidator;
  @Input() violationDetails;
  @Input() isModifyCoverage = false;
  constructor() {}

  ngOnInit(): void {}
}
