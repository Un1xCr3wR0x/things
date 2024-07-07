import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'periodToArabic'
})
export class PeriodToArabicPipe implements PipeTransform {
  transform(time: string): string {
    if (!time) {
      return '';
    }
    const period = time.slice(-2);
    const [hour, minute] = time.slice(0, -2).split(':');

    const arabicPeriod = period && period.toLowerCase() === 'am' ? 'ص' : 'م';
    const formmattedTime = ` ${hour}:${minute} ${arabicPeriod} `;
    return formmattedTime;
  }
}
