import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe class is used to display english or arabic value
 *
 * @export
 * @class BilingualTextPipe
 * @implements {PipeTransform}
 */
const englishText = 'English';

@Pipe({
  name: 'numToPositive',
  pure: false
})
export class NumToPositiveTextPipeMock implements PipeTransform {
  transform(num: number): number {
    return Math.abs(num);
  }
}
