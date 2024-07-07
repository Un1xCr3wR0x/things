/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { AnnuityResponseDto, DependentDetails, MiscellaneousPaymentRequest } from '../../../shared';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-contributor-details-dc',
  templateUrl: './contributor-details-dc.component.html',
  styleUrls: ['./contributor-details-dc.component.scss']
})
export class ContributorDetailsDcComponent implements OnInit {
  @Input() contributorDetails: AnnuityResponseDto;
  @Input() heirAccordianPresent: boolean;
  @Input() heirList: DependentDetails[];
  @Input() lang: string;
  @Input() isPaymentDetailsPresent = false;
  @Input() isModificationDetailsPresent = false;
  @Input() isHold = false;
  @Input() isStartBenefit = false;
  @Input() validDetails: MiscellaneousPaymentRequest;
  @Input() isPaymentDetailsAccordianPresent = false;

  constructor() {}

  ngOnInit(): void {}
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
