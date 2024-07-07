import { Pipe, PipeTransform } from "@angular/core";


/**
 * This pipe class is used to display english or arabic value
 *
 * @export

 * @implements {PipeTransform}
 */
@Pipe({
    name: 'arabickeyText',
    pure: false
  })
  export class ArabicKeyPipe implements PipeTransform {
    transform(key : string) {
      const equalIndex = key.indexOf('=');
      if ( equalIndex !== -1) {
        const arabicvalue = key.substring(equalIndex+1, key.length-1).trim();
        if( arabicvalue!== null && arabicvalue !== "") {
            return arabicvalue;
        }
      }
      return key;
    }

  }