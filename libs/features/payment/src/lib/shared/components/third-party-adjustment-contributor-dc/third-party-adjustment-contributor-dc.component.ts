/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { formatDate } from '@gosi-ui/core';
import { AdjustmentDetails } from '../../models';
@Component({
  selector: 'pmt-third-party-adjustment-contributor-dc',
  templateUrl: './third-party-adjustment-contributor-dc.component.html',
  styleUrls: ['./third-party-adjustment-contributor-dc.component.scss']
})
export class ThirdPartyAdjsutmentContributorDcComponent implements OnInit {
  constructor() {}
  // Input values
  @Input() adjustmentValues: AdjustmentDetails;
  @Input() lang = 'en';
  // Local Values
  // Output values
  @Output() navigateOnLinkClick: EventEmitter<null> = new EventEmitter();

  ngOnInit(): void {}

  navigateOn() {
    this.navigateOnLinkClick.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
