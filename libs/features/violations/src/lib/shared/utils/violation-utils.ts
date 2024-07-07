/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';
import { ViolationsEnum } from '../enums';
import { ContributorDetails } from '../models';

/**
 * Method to check whether contributor details are saved.
 * @param contributorList
 */
export function checkContributorsSaved(contributorList: ContributorDetails[]): boolean {
  let isSaved = true;
  contributorList.forEach(element => {
    if (!element?.isSaved) isSaved = false;
  });
  return isSaved;
}

export function checkIfAllExcluded(contributorList: ContributorDetails[]): boolean {
  let allExcluded = true;
  contributorList.forEach(element => {
    if (!element?.isNoPenalty) allExcluded = false;
  });
  return allExcluded;
}

export function getDateFormat(entryFormat: string): string {
  if (entryFormat === '' || entryFormat === null || entryFormat === undefined) return ViolationsEnum.DATE_GREGORIAN;
  const format = entryFormat?.trim()?.toUpperCase();
  return format[0] === 'H' ? ViolationsEnum.DATE_HIJIRI : ViolationsEnum.DATE_GREGORIAN;
}

export function getDateFormatFromCalendar(calendar: GosiCalendar): string {
  if (calendar?.hijiri) return ViolationsEnum.DATE_HIJIRI;
  else return ViolationsEnum.DATE_GREGORIAN;
}

export function getKeyByValue<T extends object, U extends keyof T>(obj: T, value: T[U]): U | undefined {
  return Object.keys(obj).find(key => obj[key as U] === value) as U | undefined;
}
