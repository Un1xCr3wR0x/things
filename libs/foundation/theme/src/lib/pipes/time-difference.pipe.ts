/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Inject, Pipe, PipeTransform } from '@angular/core';
import { LanguageToken, BaseComponent, KeyValue } from '@gosi-ui/core';
import moment from 'moment/moment';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * This pipe class is used to display time difference
 *
 * @export
 * @class TimeDifferencePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'timeDifference',
  pure: false
})
export class TimeDifferencePipe extends BaseComponent implements PipeTransform {
  lang = 'en';
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
    this.language.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.lang = response;
    });
  }

  transform(value: Date | string): KeyValue {
    const currentDate = new Date();
    const date = new Date(value);
    // date.setHours(date.getHours() + currentDate.getTimezoneOffset() / 60);
    let dayDifference = 0;
    if (date) {
      dayDifference = moment(currentDate).diff(date, 'days');
      if (dayDifference === 0) {
        const timeDifference = moment(currentDate).diff(date, 'hour');
        if (timeDifference === 0) {
          const minuteDiff = moment(currentDate).diff(date, 'minutes');
          if (minuteDiff === 0) {
            return { key: 'THEME.TIME-DIFF.NOW' };
          } else if (minuteDiff === 1) {
            return { key: 'THEME.TIME-DIFF.ONE-MINUTE' };
          } else if (minuteDiff === 2) {
            return { key: 'THEME.TIME-DIFF.TWO-MINUTE' };
          } else if (minuteDiff > 2 && minuteDiff <= 10) {
            return { key: 'THEME.TIME-DIFF.MINUTE-3-TO-10', value: minuteDiff };
          } else if (minuteDiff > 10) {
            return { key: 'THEME.TIME-DIFF.MINUTE-GT-10', value: minuteDiff };
          }
        } else if (timeDifference === 1) {
          return { key: 'THEME.TIME-DIFF.ONE-HOUR' };
        } else if (timeDifference === 2) {
          return { key: 'THEME.TIME-DIFF.TWO-HOUR' };
        } else if (timeDifference > 2 && timeDifference <= 10) {
          return { key: 'THEME.TIME-DIFF.HOUR-3-TO-10', value: timeDifference };
        } else if (timeDifference > 10) {
          return { key: 'THEME.TIME-DIFF.HOUR-GT-10', value: timeDifference };
        }
      } else if (dayDifference === 1) {
        return { key: 'THEME.TIME-DIFF.YESTERDAY', value: moment(date).format('LT') };
      } else {
        return { key: moment(date).format('lll') };
      }
    }
  }
}
