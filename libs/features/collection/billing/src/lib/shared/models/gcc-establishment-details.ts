import { BilingualText } from '@gosi-ui/core';

export class GccEstablishmentDetails {
  country: BilingualText = new BilingualText();
  gccCountry = false;
  registrationNo: string = undefined;

  fromJsonToObject(json) {
    Object.keys(new GccEstablishmentDetails()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
