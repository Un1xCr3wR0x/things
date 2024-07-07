/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { Person } from '../../../shared/models';
import { ValidatorConstants } from '../../../shared/constants';
import { ContactDetails } from '@gosi-ui/core';

@Component({
  selector: 'oh-vtr-contact-details-dc',
  templateUrl: './contact-details-dc.component.html',
  styleUrls: ['./contact-details-dc.component.scss']
})
export class ContactDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() contributorDetails: Person;
  //TODO: remove unused methods
  ngOnInit() {}
  /**
   *
   * @param changes Capturing contributoDetails on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contributorDetails) {
      this.contributorDetails = changes.contributorDetails.currentValue;
      if (this.contributorDetails && !this.contributorDetails.contactDetail) {
        this.contributorDetails.contactDetail = new ContactDetails();
      }
    }
  }
  /**
   * Setting ISD code
   */
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(ValidatorConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.contributorDetails.contactDetail.mobileNo.isdCodePrimary) {
        prefix = ValidatorConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
}
