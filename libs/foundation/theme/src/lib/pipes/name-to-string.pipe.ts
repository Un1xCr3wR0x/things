/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import {
  BaseComponent,
  BilingualText,
  getPersonArabicName,
  getPersonEnglishName,
  LanguageToken,
  Name
} from '@gosi-ui/core';
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
  name: 'nameToString',
  pure: false
})
export class NameToString extends BaseComponent implements PipeTransform, OnDestroy {
  lang = 'en';
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
    this.language.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.lang = response;
    });
  }

  transform(name: Name, showArabicIfEnglishEmpty = false): string {
    if (name && (name.english || name.arabic)) {
      const bilingual = new BilingualText();
      bilingual.arabic = getPersonArabicName(name.arabic);
      bilingual.english = getPersonEnglishName(name.english);
      if (this.lang === 'en') {
        return showArabicIfEnglishEmpty && !bilingual.english ? bilingual.arabic : bilingual.english;
      } else {
        return bilingual.arabic;
      }
    } else {
      return undefined;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
