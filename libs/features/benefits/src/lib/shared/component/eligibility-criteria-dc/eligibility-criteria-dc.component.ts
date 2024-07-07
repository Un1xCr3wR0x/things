/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { Benefits, EligibilityResponse } from '../../models';

@Component({
  selector: 'bnt-eligibility-criteria-dc',
  templateUrl: './eligibility-criteria-dc.component.html',
  styleUrls: ['./eligibility-criteria-dc.component.scss']
})
export class EligibilityCriteriaDcComponent implements OnInit {
  /**
   * Input Variables
   */
  @Input() benefitInfo: Benefits;
  @Input() isSaned: boolean;
  @Input() benefitRequestCancelled = false;

  benefitType: BilingualText;
  failedCount: number;
  totalCount: number;
  failedEligibilities: EligibilityResponse[] = [];
  passedEligibilities: EligibilityResponse[] = [];

  @Output() close = new EventEmitter();

  constructor() {}

  /**
   * This method is for initialization tasks
   */
  ngOnInit(): void {
    this.benefitType = this.benefitInfo?.benefitType;
    this.failedCount = this.benefitInfo?.failedEligibilityRules;
    this.totalCount = this.benefitInfo?.totalEligibilityRules;
    this.benefitInfo?.eligibilityRules.forEach(item => {
      if (!item.eligible) {
        this.failedEligibilities.push(item);
      } else {
        this.passedEligibilities.push(item);
      }
    });
  }

  /**
   * This method is for hiding model
   */
  hideModal() {
    this.close.emit();
  }
}
