import { AddressTypeEnum } from '../enums';
import { AddressDetails } from './address-details';
import { Name } from './name';

export class FamilyDetailsRequest {
  name: Name = new Name();
  addresses: AddressDetails[] = [];
  currentMailingAddress: string = AddressTypeEnum.NATIONAL;
}
