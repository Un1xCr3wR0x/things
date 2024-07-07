import { Component, Input, OnInit } from '@angular/core';
import { AppConstants, checkBilingualTextNull } from '@gosi-ui/core';
import { ContributorTypesEnum } from '../../../shared/enums';

@Component({
  selector: 'cnt-contractpersonaldetailsdc',
  templateUrl: './contractpersonaldetailsdc.component.html',
  styleUrls: ['./contractpersonaldetailsdc.component.scss']
})
export class ContractpersonaldetailsDcComponent implements OnInit {
  @Input() contributor;
  @Input() conType: string;
  @Input() cancelEngamentView;
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
}
