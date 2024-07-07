import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment/moment';
import { GosiCalendar } from '@gosi-ui/core';

@Pipe({ name: 'dateType', pure: false })
export class DateTypePipeMock implements PipeTransform {
  lang = 'en';

  transform(date: GosiCalendar) {
    if (date && date.entryFormat) {
      if (date.entryFormat === 'GREGORIAN' && date.gregorian) return this.convertDate(date.gregorian);
      else if (date.entryFormat === 'HIJRI' && date.hijiri) return date.hijiri.split('-').reverse().join('/');
      else return null;
    } else if (date && date.gregorian) return this.convertDate(date.gregorian);
    else return null;
  }

  convertDate(date: Date | string) {
    const format = 'dd/mm/yyyy';
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
