/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { HoldPensionDetails } from '../../shared';

@Component({
  selector: 'bnt-reassessment-benefit-details-dc',
  templateUrl: './reassessment-benefit-details-dc.component.html',
  styleUrls: ['./reassessment-benefit-details-dc.component.scss']
})
export class ReassessmentBenefitDetailsDcComponent implements OnInit {
  //Input Variables
  @Input() benefitDetails: HoldPensionDetails;
  @Input() benefitType: string;
  constructor() {}

  ngOnInit(): void {}
}
