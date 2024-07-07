import { Inject, Pipe, PipeTransform } from '@angular/core';
import { BaseComponent, GosiCalendar, LanguageEnum, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({
  name: 'monthTranslator',
  pure: false
})
export class DateTypePipe1 extends BaseComponent implements PipeTransform {
  lang = LanguageEnum.ENGLISH;
  transform(date: GosiCalendar) {
    if (date && date.entryFormat) {
      if (date.entryFormat === 'GREGORIAN' && date.gregorian) {
        const gregorianDate = new Date(date.gregorian);
        return this.formatDate(gregorianDate);
      } else if (date.entryFormat === 'HIJIRA' && date.hijiri) {
        return this.formatHijiriDate(date.hijiri);
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
    this.language.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.lang = <LanguageEnum>response;
    });
  }

  private formatDate(date: Date): string {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthNamesAr = [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر'
    ];

    const year = date.getFullYear();
    const month = this.lang == 'en' ? monthNames[date.getMonth()] : monthNamesAr[date.getMonth()];

    return `${month} ${year}`;
  }

  private formatHijiriDate(hijiriDate: string): string {
    // Assuming that the hijiriDate format is "YYYY-MM-DD"
    const [year, month] = hijiriDate.split('-');
    return `${this.getHijiriMonthName(+month)} ${year}`;
  }

  private getHijiriMonthName(month: number): string {
    const hijiriMonthNames = [
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
    const hijiriMonthNamesAr = [
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

    return this.lang == 'en' ? hijiriMonthNames[month - 1] : hijiriMonthNamesAr[month - 1];
  }
}
