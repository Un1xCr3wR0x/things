/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Inject, Pipe, PipeTransform } from '@angular/core';
import { GosiCalendar, CalendarTypeEnum, LanguageEnum, LanguageToken, BaseComponent } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Pipe({
  name: 'dateType',
  pure: false
})
export class DateTypePipe extends BaseComponent implements PipeTransform {
  lang = LanguageEnum.ENGLISH;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
    this.language.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.lang = <LanguageEnum>response;
    });
  }

  transform(date: GosiCalendar, format = 'dd/mm/yyyy') {
    if (date && date.entryFormat) {
      if (date.entryFormat === CalendarTypeEnum.GREGORIAN && date.gregorian)
        return this.convertDate(date.gregorian, format);
      else if (date.entryFormat === CalendarTypeEnum.HIJRI && date.hijiri) {
        if (this.lang === LanguageEnum.ENGLISH) {
          return date.hijiri.split('-').reverse().join('/');
        } else {
          return date.hijiri.split('-').join('/');
        }
      } else if (date.hijiri || date.gregorian) {
        if (date.gregorian) {
          return this.convertDate(date.gregorian, format);
        } else {
          if (this.lang === LanguageEnum.ENGLISH) {
            return date.hijiri.split('-').reverse().join('/');
          } else {
            return date.hijiri.split('-').join('/');
          }
        }
      } else return null;
    } else if (date && date.gregorian) return this.convertDate(date.gregorian, format);
    else return null;
  }

  convertDate(date: Date | string, format: string) {
    let transformedDate: string = null;
    if (date) {
      if (date.toString().toLowerCase().includes('z')) {
        date = new Date(date);
        date.setHours(date.getHours() + new Date().getTimezoneOffset() / 60);
      }
      if (moment(date).isValid()) {
        const dateFormat = this.lang === LanguageEnum.ENGLISH ? format : format.split('').reverse().join('');
        transformedDate = moment(date).format(dateFormat.toUpperCase());
      }
    }
    return transformedDate;
  }
}
