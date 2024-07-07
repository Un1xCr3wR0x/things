/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AppConstants,
  checkBilingualTextNull,
  Establishment,
  getPersonArabicName,
  LovList
} from '@gosi-ui/core';
import { ContributorTypesEnum } from '../../../../shared';
import { Contributor } from '../../../../shared/models';

/**
 * This is the component to validate the establishment details
 *
 * @export
 * @class PersonalDetailsDcComponent
 * @extends {BaseComponent}
 */

@Component({
  selector: 'cnt-personal-details-dc',
  templateUrl: './personal-details-dc.component.html',
  styleUrls: ['./personal-details-dc.component.scss']
})
export class PersonalDetailsDcComponent implements OnInit {
  //Input Variables
  @Input() contributor: Contributor;
  @Input() cityList: LovList = null;
  @Input() establishmentDetails: Establishment;
  @Input() registrationNumber: number;
  @Input() canEdit = false;
  @Input() conType: string;
  @Input() isBeneficiary: boolean;

  /**Event emmitters */
  @Output() onEdit: EventEmitter<null> = new EventEmitter<null>(null);

  /** Local Variables. */
  contributorTypeEnum = ContributorTypesEnum;
  arabicName: string;
  englishName: string;

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.arabicName = getPersonArabicName(this.contributor.person.name.arabic);
  }

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
  /** method to emit edit values */
  onEditPersonalDetails() {
    this.onEdit.emit();
  }
}
