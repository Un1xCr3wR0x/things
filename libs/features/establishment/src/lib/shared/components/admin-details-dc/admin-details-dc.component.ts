/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppConstants, CommonIdentity, GenderEnum, getIdentityByType, Person } from '@gosi-ui/core';

@Component({
  selector: 'est-admin-details-dc',
  templateUrl: './admin-details-dc.component.html',
  styleUrls: ['./admin-details-dc.component.scss']
})
export class AdminDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  rotatedeg = 360;
  identity: CommonIdentity;
  femaleGender = GenderEnum.FEMALE;

  /**
   * Input variables
   */
  @Input() translateFromModule = 'ESTABLISHMENT.';
  @Input() admin: Person;
  @Input() canReplace: boolean;
  @Input() canDelete: boolean;

  /**
   * Output variables
   */
  @Output() replaceAdmin: EventEmitter<null> = new EventEmitter();
  @Output() deleteAdmin: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.identity = getIdentityByType(this.admin.identity, this.admin.nationality.english);
    this.identity.idType = this.translateFromModule + this.identity.idType;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.admin) {
      this.admin = changes.admin.currentValue;
      this.identity = getIdentityByType(this.admin.identity, this.admin.nationality.english);
      this.identity.idType = this.translateFromModule + this.identity.idType;
    }
  }

  /**
   * Method to get the isd code prefix
   */
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.admin.contactDetail.mobileNo.isdCodePrimary) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }

  /**
   * Method to emit replace event
   */

  replaceEstAdmin() {
    this.replaceAdmin.emit();
  }
  /**
   * Method to emit delete event
   */
  onDeleteAdmin() {
    this.deleteAdmin.emit();
  }
}
