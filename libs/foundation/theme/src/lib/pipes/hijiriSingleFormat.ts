import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTypeHijiri'
})
export class SingleFormatPipe implements PipeTransform {
  transform(date: string): string {
    return date.split('-').reverse().join('/');
  }
}
