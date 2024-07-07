import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AddressDetails, AddressTypeEnum, isAddressEmpty } from '@gosi-ui/core';

@Component({
  selector: 'frm-view-address-dc',
  templateUrl: './view-address-dc.component.html',
  styleUrls: ['./view-address-dc.component.scss']
})
export class ViewAddressDcComponent implements OnInit, OnChanges {
  readonly nationalType = AddressTypeEnum.NATIONAL;
  readonly poAddressType = AddressTypeEnum.POBOX;
  readonly foriegnType = AddressTypeEnum.OVERSEAS;
  nationalAddress: AddressDetails;
  poBoxAddress: AddressDetails;
  overSeasAddress: AddressDetails;
  isNationalEmpty = false;
  isPoBoxEmpty = false;
  isForeignEmpty = false;

  @Input() addressDetails: AddressDetails[] = [];
  @Input() hasAddressDetailsLabel = true;
  @Input() showEdit = false;
  @Input() hasPOAddress = true;
  @Input() hasNationalAddress = true;
  @Input() hasOverseasAddress = true;
  @Input() currentMailingAddress = '';
  @Input() isPaddingRequired = true;

  @Output() editEvent: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.setAddresses();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.addressDetails && changes.addressDetails.currentValue) {
      this.setAddresses();
    }
  }

  /**
   * This method is used to set the different input for different components
   */
  setAddresses() {
    this.nationalAddress = this.getAddress(AddressTypeEnum.NATIONAL);
    this.poBoxAddress = this.getAddress(AddressTypeEnum.POBOX);
    this.overSeasAddress = this.getAddress(AddressTypeEnum.OVERSEAS);

    this.isNationalEmpty = isAddressEmpty(this.nationalAddress);
    this.isPoBoxEmpty = isAddressEmpty(this.poBoxAddress);
    this.isForeignEmpty = isAddressEmpty(this.overSeasAddress);
  }

  /**
   * Method to get the particular address from array
   * @param type
   */
  getAddress(type): AddressDetails {
    if (this.addressDetails) {
      return this.addressDetails.find(address => address.type === type) || new AddressDetails();
    } else {
      return new AddressDetails();
    }
  }

  // Method to emit edit details

  editEventDetails() {
    this.editEvent.emit();
  }
}
