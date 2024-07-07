import { AddressTypeEnum } from '@gosi-ui/core';

export class AddressDCHelper {
  AddressList = [
    {
      type: AddressTypeEnum.NATIONAL,
      english: 'National Address',
      arabic: 'العنوان الوطني'
    },
    {
      type: AddressTypeEnum.POBOX,
      english: 'PO Box Address',
      arabic: 'العنوان البريدي'
    },
    {
      type: AddressTypeEnum.OVERSEAS,
      english: 'Overseas Address',
      arabic: 'العنوان في الخارج'
    }
  ];
  addressOrder = [
    {
      type: AddressTypeEnum.NATIONAL,
      index: 0
    },
    {
      type: AddressTypeEnum.POBOX,
      index: 1
    },
    {
      type: AddressTypeEnum.OVERSEAS,
      index: 2
    }
  ];
  /**
   * method to map address types
   * @param type
   */
  mapAddressType(type: string) {
    let item;
    this.AddressList.forEach(element => {
      if (element.english === type || element.type === type) item = element;
    });
    return item;
  }
  getOrder(type: string): number {
    let order;
    this.addressOrder.forEach(element => {
      if (element.type === type) order = element.index;
    });
    return order;
  }
}
