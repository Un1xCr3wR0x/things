/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { dayDiff } from '@gosi-ui/core/lib/utils';
import moment from 'moment-timezone';

export class DateFormat {
  year: number = undefined;
  month: number = undefined;
  day: number = undefined;
  totalDays: number = undefined;
}

/**
 *
 * @param dateFrom parameter to get the from date
 * @param dateTo parameter to get the from date
 * to find the difference between days
 */

export const dateCalculation = function (dateFrom, dateTo) {
  const day: DateFormat[] = [];
  let startDate = moment(dateFrom.gregorian);
  const endDate = moment(dateTo.gregorian);
  let total = 0;
  const daysDifference = endDate.diff(startDate, 'days');
  let totalDaysInMonth = startDate.daysInMonth();
  let totalDays = startDate.daysInMonth();
  let startDayDiff = startDate.toDate().getUTCDate();
  startDayDiff = totalDaysInMonth + 1 - startDayDiff;
  let startyear = startDate.year();
  let month = startDate.month() + 1;
  const endYear = endDate.year();
  const endMonth = endDate.month() + 1;
  const endDay = endDate.toDate().getUTCDate();
  const totalEndDays = endDate.daysInMonth();
  if (endMonth === month && endYear === startyear) {
    startDayDiff = dayDiff(dateFrom.gregorian, dateTo.gregorian) + 1;
  }
  day.push({ year: startyear, month: month, day: startDayDiff, totalDays: totalDays });
  total = total + startDayDiff;
  startDate = startDate.add(startDayDiff, 'days');
  while (total + endDay < daysDifference) {
    startyear = startDate.year();
    month = startDate.month() + 1;
    totalDaysInMonth = startDate.daysInMonth();
    startDayDiff = totalDaysInMonth;
    totalDays = totalDaysInMonth;

    day.push({ year: startyear, month: month, day: startDayDiff, totalDays: totalDays });
    total = total + startDayDiff;
    startDate = startDate.add(startDayDiff + 1, 'days');
  }
  if (endMonth !== month || endYear !== startyear) {
    day.push({ year: endYear, month: endMonth, day: endDay, totalDays: totalEndDays });
  }
  return day;
};

export const comments = function (key, routerData?, isTranscation?, assignedTo?) {
  let date = new Date(key.resolvedDate?.gregorian);
  let currentDate = new Date();
  date.setHours(date.getHours() + currentDate.getTimezoneOffset() / 60);
  const resolvedDate = { gregorian: date, hijiri: '' };
  date = new Date(key.requestedDate?.gregorian);
  currentDate = new Date();
  date.setHours(date.getHours() + currentDate.getTimezoneOffset() / 60);
  const receivedDate = { gregorian: date, hijiri: '' };
  let list = null;
  list = {
    userName: {
      english: routerData?.assigneeId,
      arabic: routerData?.assigneeId
    },
    role: {
      english: routerData?.assignedRole,
      arabic: routerData?.assignedRole
    },
    tpaName: key.user,
    tpaRole: key.role,
    comments: key?.requestComments,
    receiveComments: key?.clarificationComments,
    serviceId: key?.serviceId,
    createdDate: receivedDate,
    allowanceId: key?.allowanceId,
    receivedDate: resolvedDate,
    documents: null
  };
  if (isTranscation) {
    list.userName.english = assignedTo;
    list.userName.arabic = assignedTo;
    list.role.english = 'Auditor';
    list.role.arabic = 'Auditor';
  }
  return list;
};
