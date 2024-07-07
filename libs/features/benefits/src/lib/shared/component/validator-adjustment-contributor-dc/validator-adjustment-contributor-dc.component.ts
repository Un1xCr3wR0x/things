/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonIdentity, formatDate, checkIqamaOrBorderOrPassport } from '@gosi-ui/core';
import { AnnuityResponseDto } from '../../models';
import { getIdentityLabel } from '../../utils';

@Component({
  selector: 'bnt-validator-adjustment-contributor-dc',
  templateUrl: './validator-adjustment-contributor-dc.component.html',
  styleUrls: ['./validator-adjustment-contributor-dc.component.scss']
})
export class ValidatorAdjustmentContributorDcComponent implements OnInit {
  @Input() canEdit: Boolean = false;
  @Input() personDetails: AnnuityResponseDto;
  @Input() lang = 'en';

  @Output() onEditClicked = new EventEmitter();
  @Output() onContributorIdClicked = new EventEmitter();

  identity: CommonIdentity | null;
  identityLabel = '';

  constructor() {}
  ngOnInit(): void {
    this.getIdentity();
  }

  editAddAdjustmentDetails() {
    this.onEditClicked.emit();
  }
  onNavigateToContributor() {
    this.onContributorIdClicked.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }

  getIdentity() {
    this.identity = checkIqamaOrBorderOrPassport(this.personDetails?.identity);
    this.identityLabel = getIdentityLabel(this.identity);
  }
}
