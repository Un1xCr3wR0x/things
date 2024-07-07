/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getArabicName, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { EstablishmentDetails } from '../../../../shared/models';
import { VicContributorDetails } from '../../../../shared/models/vic-contributor-details';

@Component({
  selector: 'blg-establishment-header-info-dc',
  templateUrl: './establishment-header-info-dc.component.html',
  styleUrls: ['./establishment-header-info-dc.component.scss']
})
export class EstablishmentHeaderInfoDcComponent implements OnChanges, OnInit {
  //Local Variables
  arabicName: string;
  lang = 'en';
  contributorStatus: string;

  @Input() establishmentDetails?: EstablishmentDetails;
  @Input() contributorDetails?: VicContributorDetails;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.contributorStatus = changes.contributorDetails?.currentValue?.statusType
      ? 'BILLING.ACTIVE'
      : 'BILLING.INACTIVE';
    if (changes?.contributorDetails?.currentValue) {
      this.arabicName = getArabicName(changes.contributorDetails?.currentValue?.person?.name.arabic);
    }
  }
}
