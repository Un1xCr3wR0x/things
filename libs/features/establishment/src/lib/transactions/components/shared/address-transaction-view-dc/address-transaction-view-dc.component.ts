import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AddressDetails, AddressTypeEnum, isAddressEmpty, isEmptyObject, isObject } from '@gosi-ui/core';

@Component({
  selector: 'est-address-transaction-view-dc',
  templateUrl: './address-transaction-view-dc.component.html',
  styleUrls: ['./address-transaction-view-dc.component.scss']
})
export class AddressTransactionViewDcComponent implements OnInit, OnChanges {
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
  isNationalAddressChanged: boolean;
  isPoxAddressChanged: boolean;
  isOverseasAddressChanged: boolean;

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

    if (!isAddressEmpty(this.nationalAddress) || !isAddressEmpty(this.oldNationalAddress))
      this.isNationalAddressChanged = !this.isDeepEqual(this.oldNationalAddress, this.nationalAddress);
    if (!isAddressEmpty(this.poBoxAddress) || !isAddressEmpty(this.oldPoBoxAddress))
      this.isPoxAddressChanged = !this.isDeepEqual(this.oldPoBoxAddress, this.poBoxAddress);
    if (!isAddressEmpty(this.overSeasAddress) || !isAddressEmpty(this.oldOverSeasAddress))
      this.isOverseasAddressChanged = !this.isDeepEqual(this.oldOverSeasAddress, this.overSeasAddress);
  }

  isDeepEqual = (object1: Object, object2: Object) => {
    if (isEmptyObject(object1) || isEmptyObject(object2)) return false;

    if (isEmptyObject(object1) && isEmptyObject(object2)) return true;

    const objKeys1 = Object.keys(object1);
    const objKeys2 = Object.keys(object2);
    if (objKeys1.length !== objKeys2.length) return false;

    for (var key of objKeys1) {
      const value1 = object1[key];
      const value2 = object2[key];

      const isObjects = isObject(value1) && isObject(value2);

      if ((isObjects && !this.isDeepEqual(value1, value2)) || (!isObjects && value1 !== value2)) {
        return false;
      }
    }
    return true;
  };

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
