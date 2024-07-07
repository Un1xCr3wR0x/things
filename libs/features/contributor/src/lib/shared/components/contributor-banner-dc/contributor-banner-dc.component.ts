/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BilingualText, getIdentityByType, getPersonNameAsBilingual, ContributorStatus } from '@gosi-ui/core';
import { Contributor } from '../../../shared/models';
import { ContributorConstants } from '../../constants';
import { ContributorBannerFields } from '../../enums';

@Component({
  selector: 'cnt-contributor-banner-dc',
  templateUrl: './contributor-banner-dc.component.html',
  styleUrls: ['./contributor-banner-dc.component.scss']
})
export class ContributorBannerDcComponent implements OnChanges {
  /** Local variables */
  nationalID: number;
  nationalType: string;
  personName: BilingualText;
  typeDate = 'date';
  typeBilingual = 'bilingual';
  typeKey = 'key';
  bannerDetails = [];
  contributorAccount: boolean = true;

  /** Input variables */
  @Input() contributor: Contributor;
  @Input() requiredFields: string[] = ContributorConstants.CONTRIBUTOR_BANNER_COMMON_FIELDS;

  /**
   * Method to handle chnages in input variables.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.contributor && changes.contributor.currentValue) {
      this.setDataForView();
    }
  }

  /** Method to initialize data for view. */
  setDataForView() {
    this.personName = getPersonNameAsBilingual(this.contributor.person.name);
    if (!this.personName.arabic) this.personName.arabic = null;
    this.nationalID = getIdentityByType(
      this.contributor.person.identity,
      this.contributor.person.nationality.english,
      this.contributorAccount
    ).id;
    const nationalType = getIdentityByType(
      this.contributor.person.identity,
      this.contributor.person.nationality.english, 
      this.contributorAccount
    ).idType;
    this.nationalType = 'CONTRIBUTOR.WAGE.' + nationalType;
    this.requiredFields.forEach(field => this.bannerDetails.push(this.getBannerFieldValue(field)));
  }

  /** Method to get banner field value. */
  getBannerFieldValue(fieldKey: string) {
    switch (fieldKey) {
      case ContributorBannerFields.NAME_BILINGUAL:
        return this.assembleFieldValue(fieldKey, 'CONTRIBUTOR.CONTRIBUTOR-NAME', this.personName, this.typeBilingual);
      case ContributorBannerFields.NAME_ENGLISH:
        return this.assembleFieldValue(fieldKey, 'CONTRIBUTOR.CONTRIBUTOR-NAME-EN', this.personName.english);
      case ContributorBannerFields.NAME_ARABIC:
        return this.assembleFieldValue(fieldKey, 'CONTRIBUTOR.CONTRIBUTOR-NAME-AR', this.personName.arabic);
      case ContributorBannerFields.IDENTIFIER:
        return this.assembleFieldValue(fieldKey, this.nationalType, this.nationalID);
      case ContributorBannerFields.DOB:
        return this.assembleFieldValue(
          fieldKey,
          'CONTRIBUTOR.DATE-OF-BIRTH',
          this.contributor.person.birthDate?.gregorian,
          this.typeDate
        );
      case ContributorBannerFields.NATIONALITY:
        return this.assembleFieldValue(
          fieldKey,
          'CONTRIBUTOR.NATIONALITY',
          this.contributor.person.nationality,
          this.typeBilingual
        );
      case ContributorBannerFields.STATUS:
        return this.assembleFieldValue(
          fieldKey,
          'CONTRIBUTOR.STATUS',
          this.contributor.statusType === ContributorStatus.ACTIVE ? 'CONTRIBUTOR.ACTIVE' : 'CONTRIBUTOR.INACTIVE',
          this.typeKey
        );
      case ContributorBannerFields.MARITAL_STATUS:
        return this.assembleFieldValue(
          fieldKey,
          'CONTRIBUTOR.MARITAL-STATUS',
          this.contributor.person.maritalStatus,
          this.typeBilingual
        );
      case ContributorBannerFields.GENDER:
        return this.assembleFieldValue(fieldKey, 'CONTRIBUTOR.GENDER', this.contributor.person.sex, this.typeBilingual);
    }
  }

  /** Method to assemble field value. */
  assembleFieldValue(id: string, label: string, value: string | BilingualText | Date | number, type?: string) {
    return {
      id: id,
      label: label,
      value:
        type === this.typeDate
          ? (value as Date)
          : type === this.typeBilingual
          ? (value as BilingualText)
          : (value as string),
      type: type
    };
  }
}
