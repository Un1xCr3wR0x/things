import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AddressDetails, AddressTypeEnum, isAddressEmpty } from '@gosi-ui/core';

@Component({
  selector: 'est-view-address-transaction-dc',
  templateUrl: './view-address-transaction-dc.component.html',
  styleUrls: ['./view-address-transaction-dc.component.scss']
})
export class ViewAddressTransactionDcComponent implements OnInit, OnChanges {
  readonly nationalType = AddressTypeEnum.NATIONAL;
  readonly poAddressType = AddressTypeEnum.POBOX;
  readonly foriegnType = AddressTypeEnum.OVERSEAS;
  nationalAddress: AddressDetails;
  poBoxAddress: AddressDetails;
  overSeasAddress: AddressDetails;
  isNationalEmpty = false;
  isPoBoxEmpty = false;
  isForeignEmpty = false;
  oldNationalAddress: AddressDetails;
  oldPoBoxAddress: AddressDetails;
  oldOverSeasAddress: AddressDetails;
  isOldNationalEmpty = false;
  isOldPoBoxEmpty = false;
  isOldForeignEmpty = false;

  @Input() addressDetails: AddressDetails[] = [];
  @Input() oldAddressDetails: AddressDetails[] = [];
  @Input() hasPOAddress = true;
  @Input() hasNationalAddress = true;
  @Input() hasOverseasAddress = true;
  @Input() isPaddingRequired = true;

  constructor() {}

  ngOnInit() {
    this.setAddresses();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.addressDetails && changes.addressDetails.currentValue) {
      this.setAddresses();
    }
    if (changes.oldAddressDetails && changes.oldAddressDetails.currentValue) {
      this.setAddresses();
    }
  }

  /**
   * This method is used to set the different input for different components
   */
  setAddresses() {
    this.nationalAddress = this.getAddress(AddressTypeEnum.NATIONAL, this.addressDetails);
    this.poBoxAddress = this.getAddress(AddressTypeEnum.POBOX, this.addressDetails);
    this.overSeasAddress = this.getAddress(AddressTypeEnum.OVERSEAS, this.addressDetails);
    // old

    this.oldNationalAddress = this.getAddress(AddressTypeEnum.NATIONAL, this.oldAddressDetails);
    this.oldPoBoxAddress = this.getAddress(AddressTypeEnum.POBOX, this.oldAddressDetails);
    this.oldOverSeasAddress = this.getAddress(AddressTypeEnum.OVERSEAS, this.oldAddressDetails);

    this.isNationalEmpty = isAddressEmpty(this.nationalAddress);
    this.isPoBoxEmpty = isAddressEmpty(this.poBoxAddress);
    this.isForeignEmpty = isAddressEmpty(this.overSeasAddress);
    // old
    this.isOldNationalEmpty = isAddressEmpty(this.oldNationalAddress);
    this.isOldPoBoxEmpty = isAddressEmpty(this.oldPoBoxAddress);
    this.isOldForeignEmpty = isAddressEmpty(this.oldOverSeasAddress);
  }

  /**
   * Method to get the particular address from array
   * @param type
   */
  getAddress(type, addressDetail: AddressDetails[]): AddressDetails {
    if (addressDetail) {
      return addressDetail.find(address => address.type === type) || new AddressDetails();
    } else {
      return new AddressDetails();
    }
  }
}
