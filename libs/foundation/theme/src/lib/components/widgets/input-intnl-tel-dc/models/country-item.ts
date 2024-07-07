import { BilingualText } from '@gosi-ui/core';
import { CountryISO } from '../enums/country-iso';

export class CountryItem {
  name: BilingualText;
  iso2: CountryISO;
  dialCode: string;
  priority: number;
  areaCodes: string;
  placeholder: string;
  exampleNumberEn: string;
  exampleNumberAr: string;
}
