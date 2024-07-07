/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to compare and order two date values in descending order.
 *
 * @export
 * @class DateOrderPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'orderByDate',
  pure: true
})
export class DateOrderPipe implements PipeTransform {
  transform(value: Object[], sortBy: string): Object {
    if (value) {
      return value.sort((a, b) => {
        if (!a[sortBy]) {
          throw new Error(`Incorrect orderByDate property`);
        }

        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return dateB - dateA;
      });
    }
    return '';
  }
}
