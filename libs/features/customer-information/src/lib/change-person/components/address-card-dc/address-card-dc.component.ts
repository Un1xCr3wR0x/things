/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddressDetails, AddressTypeEnum, BaseComponent } from '@gosi-ui/core';
//This component is to set the address details of the  person

@Component({
  selector: 'cim-address-card-dc',
  templateUrl: './address-card-dc.component.html',
  styleUrls: ['./address-card-dc.component.scss']
})
export class AddressCardDcComponent extends BaseComponent implements OnInit {
  //Input variables
  @Input() addresses: AddressDetails[] = [];
  @Input() isCsr = false;
  @Input() currentMaiilngAddress: string;

  //Output Variables
  @Output() editEvent: EventEmitter<void> = new EventEmitter();

  constructor() {
    super();
  }
  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
    this.setAddresses();
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
}
