/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { checkSumValidation } from './common';

/**
 * Method to check whether string is NIN
 * @param nin
 */
export const isNIN = function (nin: string) {
  let valid = false;
  if (nin.length === 10) {
    const digitOne = +nin.substring(0, 1);
    const lastDigit = +nin.substring(9, 10);
    if (digitOne !== 1) {
      valid = false;
    } else {
      const digitNine = +nin.substring(8, 9);
      const digitEight = +nin.substring(7, 8);
      const digitSeven = +nin.substring(6, 7);
      const digitSix = +nin.substring(5, 6);
      const digitFive = +nin.substring(4, 5);
      const digitFour = +nin.substring(3, 4);
      const digitThree = +nin.substring(2, 3);
      const digitTwo = +nin.substring(1, 2);
      const sumOfDigits = digitNine * 1 + digitSeven * 10 + digitFive * 100 + digitThree * 1000 + digitOne * 10000;
      let twiceTheSum = '' + sumOfDigits * 2;
      if (twiceTheSum.length === 5) {
        twiceTheSum = '0' + twiceTheSum;
      }
      const newDigitSix = +twiceTheSum.substring(5, 6);
      const newDigitFive = +twiceTheSum.substring(4, 5);
      const newDigitFour = +twiceTheSum.substring(3, 4);
      const newDigitThree = +twiceTheSum.substring(2, 3);
      const newDigitTwo = +twiceTheSum.substring(1, 2);
      const newDigitOne = +twiceTheSum.substring(0, 1);
      const newSumOfDigits =
        newDigitSix +
        digitEight +
        newDigitFive +
        digitSix +
        newDigitFour +
        digitFour +
        newDigitThree +
        digitTwo +
        newDigitTwo +
        newDigitOne;

      let eString = '' + newSumOfDigits;
      if (eString.length === 1) {
        eString = '0' + eString;
      }

      const newSumOfDigits2 = +eString.substring(0, 1);
      const finalSum = (newSumOfDigits2 + 1) * 10;
      let difference = finalSum - newSumOfDigits;
      const result = '' + difference;
      if (difference > 9) {
        difference = +result.substring(1, 2);
      }
      if (lastDigit === difference) {
        valid = true;
      }
    }
  } else {
    valid = null;
  }
  return valid;
};
/**
 * Method to check to check whether string is Border Number
 * @param borderNo
 */
export const isBorderNumber = function (borderNo: string) {
  let valid = false;
  if (borderNo.length === 10) {
    const digitOne = +borderNo.substring(0, 1);
    if (digitOne === 3 || digitOne === 4 || digitOne === 5 || digitOne === 6 || digitOne === 7) {
      valid = checkSumValidation(borderNo);
    } else {
      valid = false;
    }
  } else {
    valid = null;
  }
  return valid;
};
/**
 * Method to check whether string is Iqama number
 * @param iqama
 */
export const isIqamaNumber = function (iqama: string) {
  let valid = false;
  if (iqama.length === 10) {
    const digitOne = +iqama.substring(0, 1);
    if (digitOne !== 2) {
      valid = false;
    } else {
      valid = checkSumValidation(iqama);
    }
  } else {
    valid = null;
  }
  return valid;
};
/**
 * Method to check whether string is Unified National Number
 * @param unifiedNo
 */
export const isUnifiedNationalNumber = function (unifiedNo: string) {
  let valid = false;
  if (unifiedNo.length === 10) {
    const firstDigit = +unifiedNo.substring(0, 1);
    if (firstDigit !== 7) {
      valid = false;
    } else {
      valid = true;
    }
  } else {
    valid = false;
  }
  return valid;
};
