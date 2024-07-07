/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment/moment';

@Pipe({ name: 'gosiDate', pure: false })
export class GosiDatePipeMock implements PipeTransform {
  lang = 'en';
  transform(date: Date | string, format: string = 'dd/mm/yyyy'): string | null {
    let transformedDate: string = null;
    if (date) {
      if (date.toString().toLowerCase().includes('z')) {
        date = new Date(date);
        date.setHours(date.getHours() + new Date().getTimezoneOffset() / 60);
      }
      if (moment(date).isValid()) {
        const dateFormat = this.lang === 'en' ? format : format.split('').reverse().join('');
        transformedDate = moment(date).format(dateFormat.toUpperCase());
      }
    }
    return transformedDate;
  }
}
