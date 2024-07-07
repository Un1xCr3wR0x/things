/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { AnnuityResponseDto } from '../../models';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-imprisonment-detail-dc',
  templateUrl: './imprisonment-detail-dc.component.html',
  styleUrls: ['./imprisonment-detail-dc.component.scss']
})
export class ImprisonmentDetailDcComponent implements OnInit {
  @Input() imprisonmentDetails: AnnuityResponseDto;
  @Input() lang = 'en';
  constructor() {}

  ngOnInit(): void {}
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
