/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '@gosi-ui/core';
import { Person } from '@gosi-ui/features/occupational-hazard/lib/shared';
//constants
const ISD_PREFIX_MAPPING = {
  sa: '+966',
  kw: '+965',
  bh: '+973',
  om: '+968',
  qa: '+974',
  ae: '+971'
};

//This component is to set the contact details of the person
@Component({
  selector: 'cim-contact-card-dc',
  templateUrl: './contact-card-dc.component.html',
  styleUrls: ['./contact-card-dc.component.scss']
})
export class ContactCardDcComponent extends BaseComponent implements OnInit {
  //Input variables
  @Input() personDetails: Person;
  @Input() isCsr = false;
  //Output Variables
  @Output() editEvent: EventEmitter<void> = new EventEmitter();

  /**
   * Creates an instance of ContactCardDcComponent
   * @memberof  ContactCardDcComponent
   *
   */
  constructor() {
    super();
  }
  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {}

  //This Method is to get prefix for the corresponsing isd code
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.personDetails.contactDetail?.mobileNo.isdCodePrimary) {
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
