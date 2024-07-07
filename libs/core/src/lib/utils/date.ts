/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import moment from 'moment-timezone';
/**
 * This function is used to format date into YYYY-MM-DD.
 *
 * @param date
 */
export const convertToYYYYMMDD = function (date: string) {
  if (date) {
    return moment(date).tz('Asia/Riyadh').format('YYYY-MM-DD');
  }
  return null;
};

/**
 * This function is used to format date into YYYY-MM-DD.
 * input date should be of format dd/mm/yyyy
 * @param date
 */
export const convertDateToYYYYMMDD = function (date: string) {
  if (date) {
    const parsedDate = moment(date, 'DD/MM/YYYY');
    return moment(parsedDate).tz('Asia/Riyadh').format('YYYY-MM-DD');
  }
  return null;
};
/**
 * This function is used to format date into DD-MM-YY.
 *
 * @param date
 */
export const convertToDDMMYY = function (date: string) {
  if (date) {
    const formats = ['YYYY/MM/DD', 'M/D/YYYY', 'M/D/YY'];
    if (moment(date, formats, true).isValid()) {
      return moment(date, formats, true).format('DD-MM-YY');
    } else {
      return date;
    }
  }
  return null;
};

/**
 * This function is used to format date into DD-MM-YYYY.
 *
 * @param date
 */
export const convertToStringDDMMYYYY = function (date: string) {
  if (date) {
    return moment(date).tz('Asia/Riyadh').format('DD/MM/YYYY');
  }
  return null;
};

/**
 * This function is used to format date into YYYY-MM-DD.
 *
 * @param date
 */
export const convertToStringYYYYMMDD = function (date: string) {
  if (date) {
    return moment(date).tz('Asia/Riyadh').format('YYYY/MM/DD');
  }
  return null;
};

/**
 *
 * @param dateFrom parameter to get the from date
 * @param dateTo parameter to get the from date
 * to find the difference between month
 */
export const monthDiff = function (dateFrom, dateTo) {
  let months;
  months = moment(dateTo).diff(moment(dateFrom), 'months', true);
  return months <= 0 ? 0 : months;
};

/**
 *
 * @param dateFrom parameter to get the from date
 * @param dateTo parameter to get the from date
 * to find the difference between days
 */

export const dayDiff = function (dateFrom: Date, dateTo: Date) {
  let day;
  const startDate = moment(dateFrom).startOf('day');
  const endDate = moment(dateTo).startOf('day');
  day = endDate.diff(startDate, 'days');
  return day <= 0 ? 0 : day;
};

/**
 *
 * @param start parameter to get the from date
 * @param end parameter to get the from date
 * to find the difference between days
 */

export const dayDifference = function (start: Date, end: Date) {
  const startDate = moment(start).startOf('day');
  const endDate = moment(end).startOf('day');
  const difference = endDate.diff(startDate, 'days');
  return difference;
};

/**
 * this method is used to reduce the UTC Offset from the date
 * @param date
 */
export const startOfDay = function (date: Date) {
  if (date) {
    const offsetDate = moment(date).clone().startOf('day');
    return moment.utc(offsetDate.format('YYYY-MM-DDTHH:mm:ss')).toDate();
  } else {
    return null;
  }
};

/**
 * this method is used to reduce the UTC Offset from the date
 * @param date
 */
export const endOfDay = function (date: Date) {
  if (date) {
    const offsetDate = moment(date).clone().endOf('day');
    return moment.utc(offsetDate.format('YYYY-MM-DDTHH:mm:ss')).toDate();
  } else {
    return null;
  }
};

/**
 * this method is used to reduce the UTC Offset from the date and set date to last date of the month
 * @param date
 */
export const endOfMonth = function (date: Date, isZoneRequired?) {
  if (date) {
    if (isZoneRequired) {
      const offsetDate = moment(date).tz('Asia/Riyadh').clone().endOf('month').startOf('day');
      return moment(offsetDate.format('YYYY-MM-DDTHH:mm:ss')).tz('Asia/Riyadh').toDate();
    } else {
      const offsetDate = moment(date).clone().endOf('month').startOf('day');
      return moment.utc(offsetDate.format('YYYY-MM-DDTHH:mm:ss')).toDate();
    }
  }
};

/**
 * this method is used to make the start of the month
 * @param date
 */
export const startOfMonth = function (date: Date, isZoneRequired?) {
  if (date) {
    if (isZoneRequired) {
      const offsetDate = moment(date).tz('Asia/Riyadh').clone().startOf('month').startOf('day');
      return moment(offsetDate.format('YYYY-MM-DD')).tz('Asia/Riyadh').toDate();
    } else {
      const offsetDate = moment(date).clone().startOf('month').startOf('day');
      return moment.utc(offsetDate.format('YYYY-MM-DD')).toDate();
    }
  }
};

/**
 * this method is used to make the start of the year
 * @param date
 */
export const startOfYear = function (date: Date) {
  if (date) {
    const offsetDate = moment(date).clone().startOf('year').startOf('day');
    return moment.utc(offsetDate.format('YYYY-MM-DDTHH:mm:ss')).toDate();
  } else return null;
};

/**
 * Method to add specified no of days from the given date
 * @param date date to be converted
 * @param noOfDays no of days to be added
 */
export const addDays = function (date: Date, noOfDays: number): Date {
  if (date) {
    const offsetDate = moment(date);
    const newDate = offsetDate.clone().add(noOfDays, 'day');
    return newDate.toDate();
  }
};

/**
 * Method to subtract specified no of days from the given date
 * @param date date to be converted
 * @param noOfDays no of days to be subtracted
 */
export const subtractDays = function (date: Date, noOfDays: number): Date {
  if (date) {
    const offsetDate = moment(date);
    const newDate = offsetDate.clone().subtract(noOfDays, 'day');
    return newDate.toDate();
  }
};

/**
 * Method to subtract specified no of months from the given date
 * @param date date to be converted
 * @param noOfMonths no of months to be subtracted
 */
export const subtractMonths = function (date: Date, noOfMonths: number, isZoneRequired?) {
  if (date) {
    if (isZoneRequired) {
      const offsetDate = moment(date).tz('Asia/Riyadh').clone().subtract(noOfMonths, 'month');
      return moment(offsetDate.format('YYYY-MM-DD')).tz('Asia/Riyadh').toDate();
    } else {
      const offsetDate = moment(date).tz('Asia/Riyadh');
      const newDate = offsetDate.clone().subtract(noOfMonths, 'month');
      return newDate.toDate();
    }
  }
};

/**
 * Method to subtract specified number of years from the given date.
 * @param date date to be converted
 * @param noOfYears no of years to be subtracted
 */
export const subtractYears = function (date: Date, noOfYears: number) {
  if (date) {
    const offsetDate = moment(date);
    const newDate = offsetDate.clone().subtract(noOfYears, 'year');
    return newDate.toDate();
  }
};

/**
 * Method to subtract specified no of months from the given date
 * @param date date to be converted
 * @param noOfMonths no of months to be subtracted
 */
export const addMonths = function (date: Date, noOfMonths: number) {
  if (date) {
    const offsetDate = moment(date);
    const newDate = offsetDate.clone().add(noOfMonths, 'month');
    return newDate.toDate();
  }
};

/**
 * Method to add specified number of years from the given date.
 * @param date date to be converted
 * @param noOfYears no of years to be added
 */
export const addYears = function (date: Date, noOfYears: number) {
  if (date) {
    const offsetDate = moment(date);
    const newDate = offsetDate.clone().add(noOfYears, 'year');
    return newDate.toDate();
  }
};
/**
 * Method to convert hijiri date to specified date format
 * @param date date to be converted
 *
 */
export const hijiriToJSON = function (date: string) {
  if (date) {
    const dateArr = date.split('/');
    const year = parseInt(dateArr[2], null);
    const month = parseInt(dateArr[1], null);
    const day = parseInt(dateArr[0], null);
    return year + '-' + month + '-' + day;
  }
};
// Output format type : 01/01/1435 - DD/MM/YYYY hijiriToHDate

export const convertToHijriFormat = function (date: string) {
  if (date) {
    let formatType: 'slash' | 'hyphen';
    let splitType: '/' | '-';
    if (date.includes('/')) {
      formatType = 'slash';
      splitType = '/';
    } else if (date.includes('-')) {
      formatType = 'hyphen';
      splitType = '-';
    } else {
      throw new Error('Invalid date format. Date must contain either "/" or "-".');
    }
    const dateArr = date.split(splitType);
    let year, month, day;
    if (formatType === 'slash') {
      day = dateArr[0].padStart(2, '0');
      month = dateArr[1].padStart(2, '0');
      year = dateArr[2];
      return year + '-' + month + '-' + day;
    } else if (formatType === 'hyphen') {
      year = dateArr[0];
      month = dateArr[1].padStart(2, '0');
      day = dateArr[2].padStart(2, '0');
      return day + '/' + month + '/' + year;
    }
  }
  return '';
};

export const convertToHijriFormatAPI = function (date: string) {
  if (date) {
    let formatType: 'slash' | 'hyphen';
    let splitType: '/' | '-';
    if (date.includes('/')) {
      formatType = 'slash';
      splitType = '/';
    } else if (date.includes('-')) {
      formatType = 'hyphen';
      splitType = '-';
    } else {
      throw new Error('Invalid date format. Date must contain either "/" or "-".');
    }
    const dateArr = date.split(splitType);
    let year, month, day;
    if (formatType === 'slash') {
      day = dateArr[0].padStart(2, '0');
      month = dateArr[1].padStart(2, '0');
      year = dateArr[2];
    } else if (formatType === 'hyphen') {
      year = dateArr[0];
      month = dateArr[1].padStart(2, '0');
      day = dateArr[2].padStart(2, '0');
    }
    return year + '-' + month + '-' + day;
  }
  return '';
};

/**
 * Method to convert hijiri date to specified date format
 * @param date date to be converted
 *
 */
export const jsonToHijiri = function (date: string) {
  if (date) {
    const dateArr = date.split('/');
    const year = parseInt(dateArr[2], null);
    const month = parseInt(dateArr[1], null);
    const day = parseInt(dateArr[0], null);
    return day + '/' + month + '/' + year;
  }
};
/**
 * Method to convert hijiri date to specified date format
 * @param date date to be converted
 *
 */
export const parseToHijiri = function (date: string) {
  if (date) {
    const dateArr = date.split('-');
    const year = parseInt(dateArr[0], null);
    const month = parseInt(dateArr[1], null);
    const day = parseInt(dateArr[2], null);
    return day + '/' + month + '/' + year;
  }
};
/**
 * Method to convert hijiri date to specified date format
 * @param date date to be converted
 *
 */
export const parseToHijiriFromApi = function (date: string) {
  if (date) {
    const dateArr = date.split('-');
    const year = dateArr[0];
    const month = dateArr[1];
    const day = dateArr[2];
    return day + '/' + month + '/' + year;
  }
};
export function convertToDateFromHijiri(hijiriDate: string): Date {
  if (hijiriDate) {
    const formatedDate = hijiriToJSON(hijiriDate);
    return new Date(moment(formatedDate).format());
  } else return new Date();
}

/**
 * Method to convert Local date to Arabic date
 * @param date date to be converted
 *
 */
export function localToArabicDate(date: Date) {
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  const newDate = new Date(utcTime + 180 * 60000);
  return newDate;
}

/**
 * Method to convert Arabic date to Local date
 * @param date date to be converted
 *
 */
export function arabicToLocalDate(date: Date) {
  const utcTime = date.getTime() + -180 * 60000;
  const newDate = new Date(utcTime + 3600000 * -(date.getTimezoneOffset() / 60));
  return newDate;
}

export const formatDate = lang => {
  return lang === 'ar' ? 'yyyy/MM/dd' : 'dd/MM/yyyy';
};

/**
 * Method to start of month specified hijiri date format
 * @param date date to be converted
 *
 */
export const startOfMonthHijiri = function (date: string) {
  if (date) {
    const dateArr = date.split('/');
    const year = dateArr[2];
    const month = dateArr[1];
    const day = '01';
    return day + '/' + month + '/' + year;
  }
};

/**
 * Method to start of month specified hijiri date format
 * @param date date to be converted
 *
 */
declare const require;

export const endOfMonthHijiri = function (date: string) {
  let day = '01';
  if (date) {
    const dateArr = date.split('/');
    const year = parseInt(dateArr[2], null);
    const month = parseInt(dateArr[1], null);
    const daysList = require('../../assets/jsons/hijiri-data.json');
    const yearData = daysList?.days.find(data => data.UMALQURAYEAR === year);
    const monthLabel = 'DAYSINHIJMONTH' + month;
    Object.keys(yearData).forEach(key => {
      if (key === monthLabel) {
        day = yearData[key];
      }
    });
    return day + '/' + month + '/' + year;
  }
};

/**
 *
 * @param dateFrom parameter to get the from date
 * @param dateTo parameter to get the from date
 * with format dd/mm/yyyy
 * to find the difference between month
 */
export const monthDiffHijiri = function (dateFrom, dateTo) {
  const startDateArr = startOfMonthHijiri(dateFrom).split('/');
  const startYear = parseInt(startDateArr[2], null);
  const startMonth = parseInt(startDateArr[1], null);
  const endDateArr = startOfMonthHijiri(dateTo).split('/');
  const endYear = parseInt(endDateArr[2], null);
  const endMonth = parseInt(endDateArr[1], null);
  let months;
  const yearDiffInMonths = (endYear - startYear) / 12;
  months = yearDiffInMonths + Math.abs(endMonth - startMonth);
  return months <= 0 ? 0 : months;
};
