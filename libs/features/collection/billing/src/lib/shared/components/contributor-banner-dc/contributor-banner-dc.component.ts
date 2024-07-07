/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageToken } from '@gosi-ui/core';

@Component({
  selector: 'blg-contributor-banner-dc',
  templateUrl: './contributor-banner-dc.component.html',
  styleUrls: ['./contributor-banner-dc.component.scss']
})
export class ContributorBannerDcComponent implements OnInit {
  /** Input variables. */
  @Input() contributorName;
  @Input() sinNo: number;
  @Input() amount: number;

  lang = 'en';
  name: string;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
      if (this.lang === 'en' && this.contributorName.contributorNameEng !== undefined) {
        this.name = this.contributorName.contributorNameEng;
      } else {
        this.name = this.contributorName.contributorNameArb;
      }
    });
  }
}
