/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-timezone';

const thousand = 1000;

/**
 * This pipe class is used to convert a timestamp in milliseconds to elaspsed time format.
 *
 * @export
 * @class TimeAgoPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'timeAgo',
  pure: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(milliseconds: number): Object {
    if (milliseconds) {
      const timetoformat = moment.unix(milliseconds / thousand);
      return moment(timetoformat).toNow(true);
    }
    return '';
  }
}
