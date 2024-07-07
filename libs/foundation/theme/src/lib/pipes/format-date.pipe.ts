/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Pipe, PipeTransform, Inject, OnDestroy } from '@angular/core';
import { LanguageToken, BaseComponent, LanguageEnum } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({ name: 'formatDate', pure: false })
export class FormatDatePipe extends BaseComponent implements PipeTransform, OnDestroy {
  lang = LanguageEnum.ENGLISH;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
    this.language.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.lang = <LanguageEnum>response;
    });
  }

  /** this pipe will take a string and convert all date
   * in the string to yyyy/mm/dd format in arabic screen */
  transform(desc: string): string | null {
    if (!desc) {
      return desc;
    }
    let result = desc;
    if (this.lang === LanguageEnum.ENGLISH) {
      return result;
    } else {
      const data = desc.match(/\d{2}(\D)\d{2}\1\d{4}/g);
      const transformedDate = { ...data };
      if (data?.length > 0) {
        data.forEach((date, i) => {
          const [day, month, year] = date.split('/');
          transformedDate[i] = [year, month, day].join('/');
        });
        data.forEach((date, i) => {
          result = result.replace(date, transformedDate[i]);
        });
      }
      return result;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
