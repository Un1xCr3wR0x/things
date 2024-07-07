/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConstants, checkBilingualTextNull, ContributorStatus } from '@gosi-ui/core';
import { Contributor } from '../../../../shared/models';

//TODO: component is already there in add contributor reuse the same
@Component({
  selector: 'cnt-contributor-personal-details-dc',
  templateUrl: './contributor-personal-details-dc.component.html',
  styleUrls: ['./contributor-personal-details-dc.component.scss']
})
export class ContributorPersonalDetailsDcComponent implements OnInit {
  statusType = ContributorStatus.ACTIVE;
  //TODO: structure the code properly
  constructor() {}
  @Input() contributor = new Contributor();
  @Input() canEdit;
  @Input() age: number;
  @Input() isBeneficiary: boolean;

  //Output variables
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  ngOnInit(): void {}

  //TODO: already there in the utils
  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }

  //TODO: where is the comment
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.contributor.person.contactDetail.mobileNo.isdCodePrimary) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  // method to emit edit values
  onEditPersonalDetails() {
    this.onEdit.emit();
  }
}
