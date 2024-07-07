import { AbstractControl, ValidatorFn } from '@angular/forms';
import { parsePhoneNumber, CountryCode } from 'libphonenumber-js/max';
import { CountryItem } from '../models/country-item';
import { CountryISO } from '../enums/country-iso';

export function mobileNumberValidator(selectedCountry: CountryItem): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    const value = control.value;
    if (value) {

      let valid = false;
      try {
        const phoneNumber = parsePhoneNumber(
          `+${selectedCountry.dialCode}${value}`,
          <CountryCode>selectedCountry.iso2.toUpperCase()
        );
        if (selectedCountry.iso2.toUpperCase() === CountryISO.AmericanSamoa.toUpperCase()) {
          if (
            phoneNumber.number.includes(`+${selectedCountry.dialCode}${selectedCountry.areaCodes[0]}`) &&
            Number(phoneNumber.number.replace(`+${selectedCountry.dialCode}${selectedCountry.areaCodes[0]}`, '')) !== 0
          )
            valid = true;
        } else if (phoneNumber.country == 'AE' && phoneNumber.nationalNumber.length >= 8 && value.startsWith('5', 0)) {
          valid = true;
        }
        else if (phoneNumber.country == 'OM' && phoneNumber.nationalNumber.length >= 8 && phoneNumber.nationalNumber.startsWith('7', 0)) {
          valid = true;
        }
        else if (phoneNumber.country == 'QA' && phoneNumber.nationalNumber.startsWith('2', 0)) {

          valid = false;
        }
        else if (phoneNumber.country == 'SA' && phoneNumber.nationalNumber.startsWith('5', 0)) {

          valid = true;
        }
        else if (phoneNumber.country == 'KW' ) {
          if(phoneNumber.nationalNumber.startsWith('5', 0) && phoneNumber.nationalNumber.length >= 8){
            valid = true;
          }
          else if(phoneNumber.nationalNumber.startsWith('6', 0) && phoneNumber.nationalNumber.length >= 8){
            valid = true;
          }
          else if(phoneNumber.nationalNumber.startsWith('9', 0) && phoneNumber.nationalNumber.length >= 8){
            valid = true;
          }
          
        }
        else if (phoneNumber.country == 'BH') {
          if(phoneNumber.nationalNumber.length>=8){

   
          if (phoneNumber.nationalNumber.startsWith('666')
          ) {
            valid = false;
          }
          else if (phoneNumber.nationalNumber.startsWith('667')) {
            valid = false;
          }
          else if (phoneNumber.nationalNumber.startsWith('663')) {
            valid = true;
          }
          else if (phoneNumber.nationalNumber.startsWith('669')) {
            valid = true;
          }
          else if (phoneNumber.nationalNumber.startsWith('3')) {
            valid = true;
          }
        }

        }
        else if (
          (phoneNumber.getType() === 'FIXED_LINE_OR_MOBILE' || phoneNumber.getType() === 'MOBILE') &&
          phoneNumber.country
        ) {

          valid = phoneNumber.isValid();
        }
      } catch (e) { }
      return valid ? null : { mask: { invalid: true } };
    }
  };
}
