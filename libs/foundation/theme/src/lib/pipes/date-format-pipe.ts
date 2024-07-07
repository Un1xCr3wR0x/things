/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment/moment';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(date: Date | string, format: string = 'YYYY-MM-DD'): string | null {
    if (date === 'Invalid Date') {
      return 'Invalid date format specified as input for date format pipe.';
    }
    /**Check if input date is valid and get delimeter used
     * Example : new Date('dd/mm/yyyy') is invalid
     * Example : new Date('dd-mm-yyyy') is invalid
     */
    const isDatevalid = moment(date).isValid();
    const isFormatHyphen = date.toString().indexOf('-');
    const isFormatSlash = date.toString().indexOf('/');
    let inputDateFormat;
    let dateSpr = '';
    if (isFormatHyphen > 0) {
      dateSpr = '-';
    } else if (isFormatSlash > 0) {
      dateSpr = '/';
    }

    if (isDatevalid) {
      inputDateFormat = moment(date).format(format.toUpperCase());
    } else {
      inputDateFormat = this.toDate(date, dateSpr);
      inputDateFormat = moment(inputDateFormat).format(format.toUpperCase());
    }

    return inputDateFormat;
  }

  toDate(dateStr, dateSpr) {
    const [day, month, year] = dateStr.split(dateSpr);
    return new Date(year, month - 1, day);
  }
}
