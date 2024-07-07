/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output, Inject, SimpleChanges } from '@angular/core';
import {
  AddressDetails,
  AddressTypeEnum,
  BaseComponent,
  Person,
  LanguageToken,
  FamilyDetails,
  getPersonArabicName,
  getPersonEnglishName,
  BilingualText
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
const ISD_PREFIX_MAPPING = {
  sa: '+966',
  kw: '+965',
  bh: '+973',
  om: '+968',
  qa: '+974',
  ae: '+971'
};
//This component is to set the address details of the  person

@Component({
  selector: 'cim-address-card-dc',
  templateUrl: './address-card-dc.component.html',
  styleUrls: ['./address-card-dc.component.scss']
})
export class AddressCardDcComponent extends BaseComponent implements OnInit {
  selectedLang: string;

  //Input variables
  @Input() personDetails: Person;
  @Input() familyDetails: FamilyDetails;
  @Input() addresses: AddressDetails[] = [];
  @Input() isCsr = false;
  @Input() currentMaiilngAddress: string;

  //Output Variables
  @Output() editEvent: EventEmitter<void> = new EventEmitter();
  familyMemberName: string;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }
  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
    this.setAddresses();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.familyDetails && changes.familyDetails.currentValue) {
      this.familyDetails = changes.familyDetails.currentValue;
      this.language.subscribe(language => (this.selectedLang = language));
    }
  }

  setAddresses() {
    const addressArray = [];
    addressArray.push(this.getAddress(AddressTypeEnum.NATIONAL));
    addressArray.push(this.getAddress(AddressTypeEnum.POBOX));
    addressArray.push(this.getAddress(AddressTypeEnum.OVERSEAS));
    this.addresses = [...addressArray];
  }

  /**
   * Method to get the particular address from array
   * @param type
   */
  getAddress(type): AddressDetails {
    if (this.addresses) {
      return this.addresses.find(address => address.type === type) || new AddressDetails();
    } else {
      return new AddressDetails();
    }
  }

  // Method to emit edit details

  editEventDetails() {
    this.editEvent.emit();
  }

  navigateToAddress() {}

  //This Method is to get prefix for the corresponsing isd code
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.familyDetails?.contactDetail.mobileNo.isdCodePrimary) {
        prefix = ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
}
