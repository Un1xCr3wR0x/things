/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Inject, SimpleChanges, OnChanges } from '@angular/core';
import { PenalityWavier } from '../../../shared/models';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'blg-vic-contributor-details-dc',
  templateUrl: './vic-contributor-details-dc.component.html',
  styleUrls: ['./vic-contributor-details-dc.component.scss']
})
export class VicContributorDetailsDcComponent implements OnInit, OnChanges {
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  // Local Variables
  lang = 'en';
  arabicName: string;
  // Input variables
  @Input() wavierDetails: PenalityWavier;

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.wavierDetails.currentValue) {
      this.arabicName =
        changes.wavierDetails.currentValue.contributorName?.arabic?.firstName +
        ' ' +
        changes.wavierDetails.currentValue.contributorName?.arabic?.secondName +
        ' ' +
        changes.wavierDetails.currentValue.contributorName?.arabic?.thirdName +
        ' ' +
        changes.wavierDetails.currentValue.contributorName?.arabic?.familyName;
    }
  }
}
