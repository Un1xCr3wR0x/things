/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonIdentity, formatDate } from '@gosi-ui/core';
import { Contributor } from '../../models';

@Component({
  selector: 'bnt-contributor-common-dc',
  templateUrl: './contributor-common-dc.component.html',
  styleUrls: ['./contributor-common-dc.component.scss']
})
export class ContributorCommonDcComponent implements OnInit {
  @Input() contributorDetails: Contributor;
  @Input() identity: CommonIdentity | null;
  @Input() iscolsix: boolean;
  @Input() iscolfour: boolean;
  @Input() lang = 'en';
  @Input() identityLabel = '';
  @Input() isStandAlone: false;

  @Output() onContributorIdClicked = new EventEmitter();

  constructor() {}

  onNavigateToContributor() {
    if (!this.isStandAlone) {
      this.onContributorIdClicked.emit();
    }
  }

  ngOnInit(): void {}

  // navigateToInjuryDetails() {
  //   this.navigateToProfile.emit();
  // }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
