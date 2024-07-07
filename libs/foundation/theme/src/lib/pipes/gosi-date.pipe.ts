/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Pipe, PipeTransform, Inject, OnDestroy } from '@angular/core';
import moment from 'moment/moment';
import { LanguageToken, BaseComponent, LanguageEnum } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({ name: 'gosiDate', pure: false })
export class GosiDatePipe extends BaseComponent implements PipeTransform, OnDestroy {
  lang = LanguageEnum.ENGLISH;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
    this.language.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.lang = <LanguageEnum>response;
    });
  }
  transform(date: Date | string, format: string = 'dd/mm/yyyy'): string | null {
    let transformedDate: string = null;
    if (date) {
      if (date.toString().toLowerCase().includes('z')) {
        date = new Date(date);
        date.setHours(date.getHours() + new Date().getTimezoneOffset() / 60);
      }
      if (moment(date).isValid()) {
        const dateFormat = this.lang === LanguageEnum.ENGLISH ? format : format.split('').reverse().join('');
        transformedDate = moment(date).format(dateFormat.toUpperCase());
      }
    }
    return transformedDate;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
