/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */

import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Contributor, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'blg-contributor-details-dc',
  templateUrl: './contributor-details-dc.component.html',
  styleUrls: ['./contributor-details-dc.component.scss']
})
export class ContributorDetailsDcComponent implements OnInit, OnChanges {
  /**Local Variables */
  arabicName: string;
  nationalID: number;
  dateOfBirth: Date = new Date();
  lang = 'en';
  contributorStatus = 'BILLING.ACTIVE';

  //**----Inputs ---------------- */
  @Input() contributorDetails: Contributor;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.contributorDetails?.currentValue) this.contributorDetails = changes?.contributorDetails?.currentValue;
    this.arabicName =
      changes.contributorDetails?.currentValue?.person?.name.arabic?.firstName +
      ' ' +
      changes.contributorDetails?.currentValue?.person?.name.arabic?.secondName +
      ' ' +
      changes.contributorDetails?.currentValue?.person?.name.arabic?.thirdName +
      ' ' +
      changes.contributorDetails?.currentValue?.person?.name.arabic?.familyName;
    this.dateOfBirth = this.contributorDetails?.person?.birthDate.gregorian;
    this.contributorStatus = this.contributorDetails?.hasActiveTerminatedOrCancelled
      ? 'BILLING.TERMINATED'
      : 'BILLING.ACTIVE';
  }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
}
