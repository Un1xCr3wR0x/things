/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonIdentity, formatDate } from '@gosi-ui/core';
import { AttorneyDetailsWrapper, Contributor, HoldBenefitDetails } from '../../models';

@Component({
  selector: 'bnt-commitment-payment-details-dc',
  templateUrl: './commitment-payment-details-dc.component.html',
  styleUrls: ['./commitment-payment-details-dc.component.scss']
})
export class CommitmentPaymentDetailsDcComponent implements OnInit {
  @Input() modifyCommitment: HoldBenefitDetails;
  @Input() benefitAttorney: AttorneyDetailsWrapper;
  @Input() authorizedIdentity: CommonIdentity | null;
  @Input() contributorDetails: Contributor;
  @Input() identity: CommonIdentity | null;
  @Input() isModifyBank: boolean;
  @Input() lang = 'en';
  @Output() onContributorIdClicked = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  getDateFormat(lang) {
    return formatDate(lang);
  }
  onNavigateToContributor() {
    this.onContributorIdClicked.emit();
  }
}
