/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConstants, BaseComponent, Establishment, LovList } from '@gosi-ui/core';

@Component({
  selector: 'est-establishment-details-dc',
  templateUrl: './establishment-details-dc.component.html',
  styleUrls: ['./establishment-details-dc.component.scss']
})
export class EstablishmentDetailsDcComponent extends BaseComponent implements OnInit {
  //Input Variables
  @Input() establishment: Establishment = null;
  @Input() isGCC = false;
  @Input() nationalityList: LovList = null;
  @Input() canEdit = true;
  @Input() isBranch = false;
  @Input() showCrn = false;
  @Input() showModifiedLegend = false;
  @Input() highlightStartDate = false;
  @Input() highlightLicense = false;
  @Input() highlightLiceseExpDate = false;
  @Input() highlightLicenseNo = false;
  @Input() highlightLicenseAuth = false;
  @Input() highlightLicenseIssDate = false;
  @Input() highlightLegalEntity = false;
  @Input() highlightActivityType = false;
  @Input() highlightEstEngName = false;
  @Input() highlightMailingAddressChange = false;
  @Input() highlightNationalAddress = false;
  @Input() highlightPoAddress = false;
  @Input() highlightEmail = false;
  @Input() highlightMobileNo = false;
  @Input() highlightTelephone = false;
  @Input() highlightExtension = false;
  @Input() highlightUnifiedNaionalNumber = false;
  @Input() highlightCrNumber = false;
  

  @Output() onEdit: EventEmitter<null> = new EventEmitter();
  /**
   * Creates an instance of ValidateEstablishmentDetailsDcComponent
   * @memberof  ValidateEstablishmentDetailsDcComponent
   *
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.establishment) {
      if (this.establishment.gccEstablishment !== null && this.establishment.gccCountry === true) {
        this.isGCC = true;
      } else {
        this.isGCC = false;
      }
    }
  }

  getISDCodePrefix() {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.establishment.contactDetails.mobileNo.isdCodePrimary) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  // method to emit edit values
  onEditEstDetails() {
    this.onEdit.emit();
  }
}
