import { ArabicName } from '../models';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/** This method is to check if the given object is type of string. */
export const isString = function (arg) {
  return typeof arg === 'string';
};

/** This method is to check if the given argument is type of object. */
export const isObject = function (arg) {
  return arg && typeof arg === 'object';
};

/** This method is to check if the given object is empty or not. */
export const isEmptyObject = function (arg) {
  return arg && Object.keys(arg).length === 0;
};

/**
 * This method is to check if the data is null or not
 * @param control
 */
export const checkNull = function (control) {
  if (!control || control === null || control === '' || control === 0) return true;
  else return false;
};

/**
 * This method is to check if the bilingaul text value is null or not
 * @param control
 */
export const checkBilingualTextNull = function (control) {
  if (!control || control === null || control.toString().trim() === '' || control === 0) {
    return true;
  } else {
    if (control.english === null && control.arabic === null) {
      return true;
    } else return false;
  }
};

/**
 * Method to bind data to the object
 * @param object
 * @param data
 */
export const bindToObject = function (object, data) {
  if (data && object && data !== null) {
    Object.keys(object).forEach(key => {
      if (key in data) {
        object[key] = data[key];
      }
    });
  }
  return { ...object };
};

/**
 * Return the merged value of arabic name(first+second+third+familyName) if first name is not null
 * @param arabicName : ArabicName
 */
export const getArabicName = function (arabicName: ArabicName) {
  let ownerName = null;

  if (arabicName.firstName) {
    ownerName =
      arabicName.firstName +
      ' ' +
      isEmpty(arabicName.secondName) +
      ' ' +
      isEmpty(arabicName.thirdName) +
      ' ' +
      isEmpty(arabicName.familyName);
  }

  return ownerName;
};

/**
 * This method is used to return entity value if not null else empty value
 * @param entity : string
 */
export const isEmpty = function (entity: string) {
  return entity || '';
};

export const checkEmpty = function (entity) {
  return entity === null || entity === undefined || entity === '' ? true : false;
};
