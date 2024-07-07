/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { EngagementDetails } from '../../../models';
@Component({
  selector: 'cnt-clauses-wages-dc',
  templateUrl: './clauses-wages-dc.component.html',
  styleUrls: ['./clauses-wages-dc.component.scss']
})
export class ClausesWagesDcComponent implements OnInit {
  @Input() activeEngagement: EngagementDetails;
  @Input() transportationAllowance;

  constructor() {}

  ngOnInit(): void {}
}
