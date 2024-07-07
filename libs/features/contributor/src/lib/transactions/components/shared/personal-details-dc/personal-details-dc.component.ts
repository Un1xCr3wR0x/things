import { Component, Input, OnInit } from '@angular/core';
import { AppConstants, checkBilingualTextNull, ContributorStatus, getPersonArabicName } from '@gosi-ui/core';
import { Contributor, ContributorTypesEnum, Establishment } from '@gosi-ui/features/contributor';

@Component({
  selector: 'cnt-personal-details-dc',
  templateUrl: './personal-details-dc.component.html',
  styleUrls: ['./personal-details-dc.component.scss']
})
export class PersonalDetailsDcComponent implements OnInit {
  statusType = ContributorStatus.ACTIVE;

  /** Local Variables. */
  contributorTypeEnum = ContributorTypesEnum;
  arabicName: string;
  englishName: string;
  //Input Variables;
  @Input() contributor: Contributor;
  @Input() establishmentDetails: Establishment;
  @Input() registrationNumber: number;
  @Input() canEdit = false;
  @Input() conType: string;
  @Input() isBeneficiary: boolean;
  @Input() TrasCont;
  @Input() regCBTR;
  @Input() age: number;
  constructor() {}
  /**
   *    Method to initialze the component.
   */
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
}
