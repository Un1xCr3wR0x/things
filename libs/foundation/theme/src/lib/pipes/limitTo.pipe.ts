import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo'
})
export class LimitToPipe implements PipeTransform {
  transform(value: string, limit: number): string {
    const trail = '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
