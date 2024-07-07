/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BilingualText } from '@gosi-ui/core';
import { VicEngagementDetails } from '../../models';

/**
 * Component for showing the feedback
 *
 * @export
 * @class FeedbackDcComponent *
 * @implements {OnInit}
 */
@Component({
  selector: 'cnt-vic-feedback-dc',
  templateUrl: './vic-feedback-dc.component.html',
  styleUrls: ['./vic-feedback-dc.component.scss']
})
export class VicFeedbackDcComponent {
  /** Local variables */
  coverageAnnuity = 'Annuity';
  pensionReformAnnuity = 'Pension Reform Annuity';
  coverageOH = 'Occupational Hazard';
  coverageUI = 'Unemployment Insurance';

  /** Input variables */
  @Input() messageToDisplay: string = null;
  @Input() engagementDetails: VicEngagementDetails;
  @Input() hideAddContributor: boolean;

  /** Output variables */
  @Output() addContributor: EventEmitter<null> = new EventEmitter();

  /** This method is used to initialise the component */
  constructor(readonly router: Router) {}

  /** This method is used to go to first screen */
  cntresetToFirstForm() {
    this.addContributor.emit();
  }

  /** Check for the given the coverage */
  checkCoverage(coverages: BilingualText[], type: string) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === type) return true;
      }
    }
    return false;
  }

  /** Method to navigate to home. */
  goToHome() {
    this.router.navigate(['/home']);
  }
}
