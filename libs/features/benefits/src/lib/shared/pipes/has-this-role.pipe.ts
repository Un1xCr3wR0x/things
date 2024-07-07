import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hasThisRole'
})
export class HasThisRolePipe implements PipeTransform {
  transform(assignedRole: string, roles: string[]): boolean {
    return roles.indexOf(assignedRole) !== -1;
  }
}
