import { Pipe, PipeTransform } from "@angular/core";


/**
 * This pipe class is used to display english or arabic value
 *
 * @export
 * @class BilingualTextPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'englishkeyText',
    pure: false
  })
  export class EnglishKeyPipe implements PipeTransform {
    transform(key : string) {
      const equalIndex = key.indexOf('=');
      if ( equalIndex !== -1) {
        const englishvalue = key.substring(0, equalIndex).trim();
        if( englishvalue!== null && englishvalue !== "") {
            return englishvalue;
        }
      }
      return key;
    }

  }