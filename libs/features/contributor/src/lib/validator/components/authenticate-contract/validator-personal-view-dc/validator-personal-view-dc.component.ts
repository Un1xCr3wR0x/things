/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppConstants, checkBilingualTextNull } from '@gosi-ui/core';
import { ContributorTypesEnum } from '../../../../shared';
@Component({
  selector: 'cnt-validator-personal-view-dc',
  templateUrl: './validator-personal-view-dc.component.html',
  styleUrls: ['./validator-personal-view-dc.component.scss']
})
export class ValidatorPersonalViewDcComponent implements OnInit {
  @Input() contributor;
  @Input() conType: string;
  @Input() canEdit = false;
  @Input() cancelEngamentView;
  @Output() onPersonalEditClicked: EventEmitter<null> = new EventEmitter<null>();
  contributorTypeEnum = ContributorTypesEnum;

  constructor() {}

  ngOnInit(): void {}
  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
  /**Method to fetch isd code */
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.contributor.person.contactDetail.mobileNo.isdCodePrimary) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  onPersonalEdit() {
    this.onPersonalEditClicked.emit();
  }
}
