/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to filter formArray with multi-selectable values.
 *
 * @export
 * @class FormArrayFilterPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'formArrayFilterPipe',
  pure: true
})
export class FormArrayFilterPipe implements PipeTransform {
  filteredRes = [];
  transform(formArray: object[], selectedValues: string[], key: string): object[] {
    if (formArray === []) return [];
    if (!formArray) return [];
    if (!selectedValues) return [];
    if (selectedValues === []) return [];
    this.filteredRes = formArray.filter(
      res => selectedValues.map(val => val['english']).indexOf(res['value'][key].toString()) > -1
    );
    return this.filteredRes;
  }
}
