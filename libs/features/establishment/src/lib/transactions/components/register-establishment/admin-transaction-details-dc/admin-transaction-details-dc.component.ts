import { Component, Input, OnInit } from '@angular/core';
import { AppConstants, checkBilingualTextNull, getArabicName } from '@gosi-ui/core';
import { Admin } from '@gosi-ui/features/establishment';

@Component({
  selector: 'est-admin-transaction-details-dc',
  templateUrl: './admin-transaction-details-dc.component.html',
  styleUrls: ['./admin-transaction-details-dc.component.scss']
})
export class AdminTransactionDetailsDcComponent implements OnInit {
  //Input Variables
  @Input() estAdminDetails: Admin = null;
  @Input() isGCC = false;
  name: string;
  constructor() {}

  ngOnInit(): void {}
  /**
   * This method is to check if the data is null or not
   * @param control
   */

  getAdminName(estAdminDetails) {
    let adminName = null;
    if (estAdminDetails && estAdminDetails.person.name.arabic.firstName) {
      adminName = getArabicName(estAdminDetails.person.name.arabic);
    }
    return adminName;
  }
  /**
   * This method is used to return entity value if not null else empty value
   */
  orEmpty = function (entity) {
    return entity || '';
  };
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
  //This Method is to get prefix for the corresponsing isd code
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.estAdminDetails?.person?.contactDetail?.mobileNo?.isdCodePrimary) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
}
