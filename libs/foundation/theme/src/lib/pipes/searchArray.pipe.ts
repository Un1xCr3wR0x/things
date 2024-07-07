/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Pipe, PipeTransform, Inject } from '@angular/core';
import { LanguageToken, BaseComponent } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * This pipe class is used to display english or arabic value
 *
 * @export
 * @class BilingualTextPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'searchArrayText',
  pure: false
})
export class SearchArraytPipe extends BaseComponent implements PipeTransform {
  lang = 'en';
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
    this.language.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.lang = response;
    });
  }

  transform(items: object[], filter: { english: ''; arabic: '' }): object {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item['title'].indexOf(filter.english) !== -1);
  }
}
