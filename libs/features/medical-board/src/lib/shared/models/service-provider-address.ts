import { BilingualText } from '@gosi-ui/core';

export class ServiceProviderAddressDto {
  area: string;
  country: BilingualText;
  district: BilingualText;
  street: string;
  village: BilingualText;
  hospitalName?: BilingualText;
}
