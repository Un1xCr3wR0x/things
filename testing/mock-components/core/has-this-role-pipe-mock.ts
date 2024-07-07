import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hasThisRole'
})
export class HasThisRolePipeMock implements PipeTransform {
  transform(): boolean {
    return true;
  }
}
