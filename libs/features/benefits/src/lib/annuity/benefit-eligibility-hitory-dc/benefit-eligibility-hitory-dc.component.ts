/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bnt-benefit-eligibility-hitory-dc',
  templateUrl: './benefit-eligibility-hitory-dc.component.html',
  styleUrls: ['./benefit-eligibility-hitory-dc.component.scss']
})
export class BenefitEligibilityHitoryDcComponent implements OnInit {
  @Input() lang = 'en';
  eligibilityHistoryDetails;

  constructor() {}

  ngOnInit(): void {}
}
