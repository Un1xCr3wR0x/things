/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactDetails } from '@gosi-ui/core';
//constants
const ISD_PREFIX_MAPPING = {
  sa: '+966',
  kw: '+965',
  bh: '+973',
  om: '+968',
  qa: '+974',
  ae: '+971'
};
@Component({
  selector: 'frm-view-contact-dc',
  templateUrl: './view-contact-dc.component.html',
  styleUrls: ['./view-contact-dc.component.scss']
})
export class ViewContactDcComponent implements OnInit {
  //Input variables
  @Input() contactDetails: ContactDetails;
  @Input() isCsr = false;
  @Input() hideTelephone = true;
  @Input() negativeMobileMargin = true;
  //Output Variables
  @Output() editEvent: EventEmitter<void> = new EventEmitter();

  /**
   * Creates an instance of ViewContactDcComponent
   * @memberof  ViewContactDcComponent
   *
   */
  constructor() {}
  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {}

  //This Method is to get prefix for the corresponsing isd code
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.contactDetails.mobileNo.isdCodePrimary) {
        prefix = ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  // Method to emit edit details

  editEventDetails() {
    this.editEvent.emit();
  }
}
