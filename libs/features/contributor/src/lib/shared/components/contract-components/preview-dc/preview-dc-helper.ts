/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ContractAuthConstant } from '../../../constants';

export class PreviewDcHelper {
  monthBilingual;
  yearBilingual;
  /** Method to get month */
  getMonth(month) {
    if (month === 0) {
      this.monthBilingual = { english: '', arabic: '' };
    } else if (month === 1) {
      this.monthBilingual = { english: month + ' month', arabic: 'شهر' };
    } else if (month === 2) {
      this.monthBilingual = { english: month + ' months', arabic: 'شهرين' };
    } else if (month > 2 && month < 11) {
      this.monthBilingual = { english: month + ' months', arabic: 'أشهر ' + month };
    } else if (month > 10) {
      this.monthBilingual = { english: month + ' months', arabic: 'شهر ' + month };
    }
    return this.monthBilingual;
  }
  /** Method to get day */
  getDays(day) {
    if (day === 1) {
      return { english: day + ' day', arabic: 'يوم' };
    } else if (day === 2) {
      return { english: day + ' days', arabic: 'يومين' };
    } else if (day > 2 && day < 11) {
      return { english: day + ' days', arabic: 'أيام ' + day };
    } else if (day > 10) {
      return { english: day + ' days', arabic: 'يوم ' + day };
    }
  }
  /** Method to get hours */
  getHours(hour) {
    if (hour === 1) {
      return { english: hour + ' hour', arabic: 'يوم واحد' };
    } else if (hour === 2) {
      return { english: hour + ' hours', arabic: 'يومين' };
    } else if (hour > 2 && hour < 11) {
      return { english: hour + ' hours', arabic: 'أيام ' + hour };
    } else if (hour > 10) {
      return { english: hour + ' hours', arabic: 'يوماً ' + hour };
    }
  }
  /** Method to get contract period */
  contractPeriodBilingual(year, month) {
    this.getMonth(month);
    this.getYear(year);
    if (this.yearBilingual && this.monthBilingual) {
      const andOpEn = year > 0 && month > 0 ? ' and ' : '';
      const andOpAr = year > 0 && month > 0 ? ' وبين ' : '';
      return ContractAuthConstant.setBilingualText(
        this.yearBilingual.english + andOpEn + this.monthBilingual.english,
        this.yearBilingual.arabic + andOpAr + this.monthBilingual.arabic
      );
    }
  }
  getYear(year) {
    if (year === 0) {
      this.yearBilingual = { english: '', arabic: '' };
    } else if (year === 1) {
      this.yearBilingual = { english: year + ' year', arabic: 'السنوات' };
    } else if (year > 1) {
      this.yearBilingual = { english: year + ' years', arabic: 'السنوا ' + year };
    }
  }
  /** Method to get work unit */
  getWorkUnit(standard) {
    if (standard === 'Per Day') {
      return { english: 'DAILY', arabic: 'اليومية' };
    } else {
      return { english: 'WEEKLY', arabic: 'الأسبوعية' };
    }
  }
}
