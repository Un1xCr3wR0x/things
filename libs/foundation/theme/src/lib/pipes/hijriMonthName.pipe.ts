import { Inject, Pipe, PipeTransform } from '@angular/core';
import { BaseComponent, LanguageEnum, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({
  name: 'monthNameHijri',
  pure: false
})
export class MonthNamePipe extends BaseComponent implements PipeTransform {
  monthstr: String = '';
  sep: any;
  lang = LanguageEnum.ENGLISH;
  monthsEn = [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Awwal',
    'Jumada al-Thani',
    'Rajab',
    'Shaban',
    'Ramadan',
    'Shawwal',
    'Dhu al-Qadah',
    'Dhu al-Hijjah'
  ];

  monthsAr = [
    'ٱلْمُحَرَّم',
    'صَفَر',
    'رَبِيع ٱلْأَوَّل',
    'رَبِيع ٱلثَّانِي',
    'جُمَادَىٰ ٱلْأُولَىٰ',
    'جُمَادَىٰ ٱلثَّانِيَة',
    'رَجَب',
    'شَعْبَان',
    'رَمَضَان',
    'شَوَّال',
    'ذُو ٱلْقَعْدَة',
    'ذُو ٱلْحِجَّة'
  ];

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
    this.language.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.lang = <LanguageEnum>response;
    });
  }
  transform(value: any, format: string): any {
    this.sep = this.findSeperator(value);
    const dateSplitList = value.split(this.sep);
    const month = dateSplitList[1];
    this.monthstr = this.lang == 'en' ? this.monthsEn[Number(month) - 1] : this.monthsAr[Number(month) - 1];

    if (format == 'dd/mm/yyyy' || format == 'dd-mm-yyyy') {
      const date = dateSplitList[0];
      const year = dateSplitList[2];
      return date + ' ' + this.monthstr + ' ' + year;
    } else if (format == 'yyyy/mm/dd' || format == 'yyyy-mm-dd') {
      const year = dateSplitList[0];
      const date = dateSplitList[2];
      return year + ' ' + this.monthstr + ' ' + date;
    } else if (format == 'mm/yyyy' || format == 'mm-yyyy') {
      const year = dateSplitList[2];
      return this.monthstr + ' ' + year;
    }
  }

  findSeperator(value: any) {
    if (value.indexOf('-') > 0) {
      return '-';
    } else if (value.indexOf('/') > 0) {
      return '/';
    } else {
      return null;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
