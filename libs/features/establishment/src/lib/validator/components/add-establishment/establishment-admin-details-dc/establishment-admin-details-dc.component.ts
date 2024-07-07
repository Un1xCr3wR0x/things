/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { AppConstants, BaseComponent, checkBilingualTextNull, NationalityTypeEnum } from '@gosi-ui/core';
import { Admin, EstablishmentConstants } from '../../../../shared';

/**
 * This is the component to validate the establishment admin details
 *
 * @export
 * @class EstablishmentAdminDetailsDcComponent
 * @extends {BaseComponent}
 */
@Component({
  selector: 'est-establishment-admin-details-dc',
  templateUrl: './establishment-admin-details-dc.component.html',
  styleUrls: ['./establishment-admin-details-dc.component.scss']
})
export class EstablishmentAdminDetailsDcComponent extends BaseComponent implements AfterContentInit {
  //Input Variables
  @Input() establishmentAdminDetails: Admin = null;
  @Input() canEdit = true;
  @Input() isGCC = false;

  //Output variable
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  saudiNationality = false;
  gccNationality = false;
  others = false;
  name: string;

  /**
   * Creates an instance of ValidateEstablishmentAdminDetailsDcComponent
   * @memberof  ValidateEstablishmentAdminDetailsDcComponent
   *
   */
  constructor() {
    super();
  }

  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }

  ngAfterContentInit() {
    this.getIdentifierType();
    this.getAdminName();
  }

  // this method is used to match the identifier corresponding to nationality
  getIdentifierType() {
    if (
      this.establishmentAdminDetails &&
      this.establishmentAdminDetails.person &&
      this.establishmentAdminDetails.person.nationality
    ) {
      if (this.establishmentAdminDetails.person.nationality.english === NationalityTypeEnum.SAUDI_NATIONAL) {
        this.saudiNationality = true;
      } else if (
        EstablishmentConstants.GCC_NATIONAL.indexOf(this.establishmentAdminDetails.person.nationality.english) !== -1
      ) {
        this.gccNationality = true;
      } else {
        this.others = true;
      }
    }
  }

  getAdminName() {
    if (this.establishmentAdminDetails.person) {
      if (this.establishmentAdminDetails.person.name && this.establishmentAdminDetails.person.name.arabic) {
        if (this.establishmentAdminDetails.person.name.arabic.firstName) {
          this.name =
            this.establishmentAdminDetails.person.name.arabic.firstName +
            ' ' +
            this.orEmpty(this.establishmentAdminDetails.person.name.arabic.secondName) +
            ' ' +
            this.orEmpty(this.establishmentAdminDetails.person.name.arabic.thirdName) +
            ' ' +
            this.orEmpty(this.establishmentAdminDetails.person.name.arabic.familyName);
        }
      }
    }
  }

  /**
   * This method is used to return entity value if not null else empty value
   */
  orEmpty = function (entity) {
    return entity || '';
  };

  //This Method is to get prefix for the corresponsing isd code
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.establishmentAdminDetails.person.contactDetail.mobileNo.isdCodePrimary) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  // method to emit edit values
  onEditEstAdminDetails() {
    this.onEdit.emit();
  }
}
