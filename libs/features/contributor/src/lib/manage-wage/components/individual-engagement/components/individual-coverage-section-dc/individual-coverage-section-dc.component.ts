/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, Inject } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { ContributionCategory } from '@gosi-ui/features/contributor/lib/shared/enums';
import { EngagementPeriod } from '@gosi-ui/features/contributor/lib/shared/models';
import { BehaviorSubject } from 'rxjs';
//TODO: rename to some small name
@Component({
  selector: 'cnt-individual-coverage-section-dc',
  templateUrl: './individual-coverage-section-dc.component.html',
  styleUrls: ['./individual-coverage-section-dc.component.scss']
})
export class IndividualCoverageSectionDcComponent {
  /** Input variables  */
  @Input() engagementPeriod: EngagementPeriod;
  @Input() displayIcon = false;
  @Input() isTotalShare = false;
  annuity = ContributionCategory.ANNUITY;
  oh = ContributionCategory.OH;
  ui = ContributionCategory.UI;
  /**Local Variables */
  lang: string;

  /**This method is used to create a instance of CoverageContributoryWageSectionDcComponent */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }
}
