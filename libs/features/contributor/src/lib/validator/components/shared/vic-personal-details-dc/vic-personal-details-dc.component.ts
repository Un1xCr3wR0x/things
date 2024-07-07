/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AppConstants, BilingualText, ContributorStatus, getPersonNameAsBilingual, NIN } from '@gosi-ui/core';
import { Contributor } from '../../../../shared/models';

@Component({
  selector: 'cnt-vic-personal-details-dc',
  templateUrl: './vic-personal-details-dc.component.html',
  styleUrls: ['./vic-personal-details-dc.component.scss']
})
export class VicPersonalDetailsDcComponent implements OnChanges {
  /** Local variables */
  personName: BilingualText;
  isdCodePrefix: string;
  newNIN: number;
  statusType = ContributorStatus.ACTIVE;

  /** Input variables */
  @Input() contributor: Contributor;
  @Input() canEdit: boolean;
  @Input() age: number;
  @Input() isMobileOnly = false;
  @Input() isBeneficiary: boolean;
  @Input() showContributorStatus = false;

  /** Output variables */
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  /** Method to handle changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.contributor && changes.contributor.currentValue) {
      this.personName = getPersonNameAsBilingual(this.contributor.person.name);
      this.isdCodePrefix = this.getISDCodePrefix();
      if (this.contributor.person.identity && this.contributor.person.identity.length > 0)
        this.contributor.person.identity.forEach(identity => {
          if (identity.idType === 'NIN') this.newNIN = (<NIN>identity).newNin;
        });
    }
  }

  /** Method to get ISD code prefix. */
  getISDCodePrefix() {
    let prefix = '';
    if (this.contributor.person.contactDetail)
      Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
        if (key === this.contributor.person.contactDetail.mobileNo.isdCodePrimary) {
          prefix = AppConstants.ISD_PREFIX_MAPPING[key];
        }
      });
    return prefix;
  }

  /** Method to handle edit. */
  onEditPersonalDetails() {
    this.onEdit.emit();
  }
}
