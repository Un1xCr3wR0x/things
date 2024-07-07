/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { BaseComponent, BilingualText, LanguageToken } from '@gosi-ui/core';
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
  name: 'bilingualText',
  pure: false
})
export class BilingualTextPipe extends BaseComponent implements PipeTransform, OnDestroy {
  lang = 'en';
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
    this.language.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.lang = response;
    });
  }

  transform(object: BilingualText | string, showArabicIfEnglishEmpty = false) {
    if (object !== undefined && object !== null) {
      if (object['english'] !== undefined || object['arabic'] !== undefined) {
        if (this.lang === 'en') {
          const english = showArabicIfEnglishEmpty && !object['english'] ? object['arabic'] : object['english'];
          return english;
        } else if (this.lang === 'ar') {
          return object['arabic'];
        }
      } else {
        return object;
      }
    } else {
      return null;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
