/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */ import { Pipe, PipeTransform } from '@angular/core';
import { BilingualText, Name } from '@gosi-ui/core';
import { bilingualWrapperResponse } from 'testing/test-data';
/**
 * This pipe class is used to display english or arabic value
 *
 * @export
 * @class BilingualTextPipe
 * @implements {PipeTransform}
 */
const englishText = 'English';
@Pipe({
  name: 'nameToString',
  pure: false
})
export class NameToStringPipeMock implements PipeTransform {
  transform(name: Name, showArabicIfEnglishEmpty = false): string {
    if (name && showArabicIfEnglishEmpty) {
      const bilingual = new BilingualText();
      bilingual.arabic = '';
      bilingual.english = 'name';
      return bilingual.english;
    } else return '';
  }
}
