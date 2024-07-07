import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'singleFormat'
})
export class FilterPipe implements PipeTransform {
  transform(value: string): string {
    const dateFormats = ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY/MM/DD', 'YYYY-MM-DD'];
    let formattedDate = value;

    for (const format of dateFormats) {
      const dateObj = moment(value, format, true);
      if (dateObj.isValid()) {
        formattedDate = dateObj.format('DD-MM-YYYY');
        break;
      }
    }

    return formattedDate;
  }
}
