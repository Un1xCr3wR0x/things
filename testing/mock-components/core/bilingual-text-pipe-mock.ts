import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe class is used to display english or arabic value
 *
 * @export
 * @class BilingualTextPipe
 * @implements {PipeTransform}
 */
const englishText = 'English';
const arabicText = 'Arabic';

@Pipe({
  name: 'bilingualText',
  pure: false
})
export class BilingualTextPipeMock implements PipeTransform {
  transform(object: string, showArabicIfEnglishEmpty = false): string {
    if (showArabicIfEnglishEmpty) {
      return object + arabicText;
    }
    return object + englishText;
  }
}
