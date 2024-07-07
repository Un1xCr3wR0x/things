/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, Inject } from '@angular/core';
import { EngagementPeriod } from '../../../../shared/models';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

//TODO: rename to some small name
@Component({
  selector: 'cnt-coverage-contributory-wage-section-dc',
  templateUrl: './coverage-contributory-wage-section-dc.component.html',
  styleUrls: ['./coverage-contributory-wage-section-dc.component.scss']
})
export class CoverageContributoryWageSectionDcComponent {
  /** Input variables  */
  @Input() engagementPeriod: EngagementPeriod;
  @Input() displayIcon = false;
  @Input() isTotalShare = false;
  @Input() isIndividualProfile = false;
  @Input() isVic?: boolean;

  /**Local Variables */
  lang: string;

  /**This method is used to create a instance of CoverageContributoryWageSectionDcComponent */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }
}
