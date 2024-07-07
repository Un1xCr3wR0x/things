import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numToPositive'
})
export class NumToPositive implements PipeTransform {
  transform(value: number): number {
    return Math.abs(value);
  }
}
