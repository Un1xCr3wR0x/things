/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AbstractControl } from '@angular/forms';
import moment from 'moment';
import { FieldError } from '../models';
import { convertToStringDDMMYYYY } from './date';

/**
 * This function is to display customized error message for form validation.
 */
export const getErrorMsg = function (
  control: AbstractControl,
  invalid?: string,
  type?: string,
  format?: string,
  example?: string
): FieldError {
  const errors = control['errors'];
  if (errors === null) {
    return null;
  } else if (errors.required) {
    //Error Message For Mandatory Fields
    return {
      error: 'CORE.THIS-FIELD-IS-REQUIRED'
    };
  } else if (errors.min && type == 'number' && errors.min.actual === 0) {
    return {
      error: 'CORE.GREATER-THAN-ZERO',
      value: 0
    };
  } else if (errors.min) {
    return {
      error: 'CORE.VALUE-MUST-BE-ATLEAST',
      value: errors.min.min - 1
    };
  } else if (errors.max) {
    return {
      error: 'CORE.VALUE-MUST-BE-ATMOST',
      value: errors.max.max + 1
    };
  }
  //greaterthan and lessthan validations for numbers
  else if (errors.greaterThan) {
    return {
      error: 'CORE.GREATERTHAN-OR-EQUAL-TO',
      value: errors.greaterThan.greaterThanValue
    };
  } else if (errors.lessThan) {
    return {
      error: 'CORE.LESSTHAN-OR-EQUAL-TO',
      value: errors.lessThan.lessThanValue
    };
  } else if (errors.zeroValidator) {
    return {
      error: 'CORE.VALUE-MUST-BE-ATLEAST',
      value: errors.zeroValidator.greaterThanValue
    };
  } else if (errors.zeroMinValidator) {
    return {
      error: 'CORE.VALUE-MUST-BE-ZERO',
      value: errors.zeroMinValidator.greaterThanValue
    };
  }
  // Validation for balance amount negative in payment
  else if (errors.balanceAmountNegative && !errors.balanceAmountNegative.valid) {
    return {
      error: 'CORE.BALANCE-AMOUNT-NEGATIVE'
    };
  }
  // Validation error message for precise length validator
  else if (errors.preciseLength) {
    const length = errors.preciseLength.length;
    if ((type && type === 'number') || (errors.pattern && errors.pattern.requiredPattern === '^[0-9]+$')) {
      let error = null;
      if (length === 1) {
        error = 'CORE.MUST-BE-1-DIGIT';
      } else if (length === 2) {
        error = 'CORE.MUST-BE-2-DIGIT';
      } else if (length <= 10) {
        error = 'CORE.MUST-BE-3TO10-DIGIT';
      } else if (length > 10) {
        error = 'CORE.MUST-BE-GT10-DIGIT';
      }
      return {
        error: error,
        length: errors.preciseLength.length
      };
    } else {
      let error = null;
      if (length === 1) {
        error = 'CORE.MUST-BE-1-CHAR';
      } else if (length === 2) {
        error = 'CORE.MUST-BE-2-CHAR';
      } else if (length <= 10) {
        error = 'CORE.MUST-BE-3TO10-CHAR';
      } else if (length > 10) {
        error = 'CORE.MUST-BE-GT10-CHAR';
      }
      return {
        error: error,
        length: errors.preciseLength.length
      };
    }
  } else if (errors.invalidLength) {
    if ((type && type === 'number') || (errors.pattern && errors.pattern.requiredPattern === '^[0-9]+$')) {
      let error = null;
      error = 'CORE.MUST-BE-7TO8-DIGIT';
      return {
        error: error,
        length: errors.invalidLength.min,
        value: errors.invalidLength.max
      };
    } else {
      let error = null;
      error = 'CORE.MUST-BE-GT10-CHAR-ATLEST';
      return {
        error: error,
        length: errors.invalidLength.min
      };
    }
  }

  //Validation for Minimum Length
  else if (errors.minlength) {
    const length = errors.minlength.requiredLength;
    const actualLength = errors.minlength.actualLength;
    if (invalid.startsWith('BILLING')) {
      if (actualLength < length) {
        let error = 'CORE.MUST-BE-GTL-DIGIT';
        return {
          error: error,
          length: length
        };
      }
    } else {
      if ((type && type === 'number') || (errors.pattern && errors.pattern.requiredPattern === '^[0-9]+$')) {
        let error = null;
        if (length === 1) {
          error = 'CORE.MUST-BE-1-DIGIT-ATLEST';
        } else if (length === 2) {
          error = 'CORE.MUST-BE-2-DIGIT-ATLEST';
        } else if (length <= 10) {
          error = 'CORE.MUST-BE-3TO10-DIGIT-ATLEST';
        } else if (length > 10) {
          error = 'CORE.MUST-BE-GT10-DIGIT-ATLEST';
        }
        return {
          error: error,
          length: length
        };
      } else {
        let error = null;
        if (length === 1) {
          error = 'CORE.MUST-BE-1-CHAR-ATLEST';
        } else if (length === 2) {
          error = 'CORE.MUST-BE-2-CHAR-ATLEST';
        } else if (length <= 10) {
          error = 'CORE.MUST-BE-3TO10-CHAR-ATLEST';
        } else if (length > 10) {
          error = 'CORE.MUST-BE-GT10-CHAR-ATLEST';
        }
        return {
          error: error,
          length: length
        };
      }
    }
  }
  //Validation for Maximum Length
  else if (errors.maxlength && invalid.startsWith('BILLING')) {
    const length = errors.maxlength.requiredLength;
    const actualLength = errors.maxlength.actualLength;
    let error = null;
    if (actualLength > length) {
      error = 'CORE.MUST-BE-LTL-DIGIT';
      return {
        error: error,
        length: length
      };
    }
  }
  //Validation for Maximum Length
  else if (errors.maxlength && invalid.startsWith('BILLING')) {
    const length = errors.maxlength.requiredLength;
    const actualLength = errors.maxlength.actualLength;
    let error = null;
    if (actualLength > length) {
      error = 'CORE.MUST-BE-LTL-DIGIT';
      return {
        error: error,
        length: length
      };
    }
  } else if (errors.mask) {
    return {
      error: 'CORE.INVALID-MOBILE',
      requiredFormat: example
    };
  }

  // Validation for Email ID
  else if (errors.email) {
    return {
      error: 'CORE.INVALID-EMAIL'
    };
  }
  //Validation Error Message For Invalid Selection
  else if (errors.invalidSelection) {
    return {
      error: 'CORE.INVALID-SELECTION',
      invalidSelection: invalid
    };
  }
  //intl-tel-mob validation error
  else if (errors.validatePhoneNumber) {
    if (!errors.validatePhoneNumber.valid) {
      return {
        error: 'CORE.FORMAT-ERROR',
        requiredFormat: format
      };
    }
  }
  //Error Message for Numberic Field
  else if (errors.pattern && errors.pattern.requiredPattern === '^[0-9]+$') {
    return {
      error: 'CORE.NUMERIC-ONLY'
    };
  }
  //Error Message for Alpha Numberic Field
  else if (errors.pattern && errors.pattern.requiredPattern === '^[a-zA-Z0-9]+$') {
    return {
      error: 'CORE.ALPHA-NUMERIC-ONLY'
    };
  } else if (errors.alphabetFirst) {
    return {
      error: 'CORE.ALPHABET-FIRST'
    };
  } else if (
    errors.pattern &&
    errors.pattern.requiredPattern ===
      '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])([A-Za-z][a-zA-Z0-9!@#$%^&]{8,})$'
  ) {
    return {
      error: 'CORE.INVALID-PASSWORD'
    };
  } else if (errors.misMatch) {
    return {
      error: 'CORE.PASSWORD-MISMATCH'
    };
  } else if (errors.isMatch) {
    return {
      error: 'CORE.PASSWORD-ISMATCH'
    };
  } else if (errors.ibanMisMatch) {
    return {
      error: 'CORE.IBAN-MISMATCH'
    };
  } else if (errors.passwordUpperCase) {
    return {
      error: 'CORE.PASSWORD-UPPERCASE'
    };
  } else if (errors.passwordLowerCase) {
    return {
      error: 'CORE.PASSWORD-LOWERCASE'
    };
  } else if (errors.passwordNumeric) {
    return {
      error: 'CORE.PASSWORD-NUMERIC'
    };
  } else if (errors.passwordSpecial) {
    return {
      error: 'CORE.PASSWORD-SPECIAL'
    };
  }

  //Error Message for Alpha Numberic Field
  else if (errors.pattern && errors.pattern.requiredPattern === '^[^0-9]+$') {
    return {
      error: 'CORE.ALPHA-ONLY'
    };
  }
  //Error Message for special characters with alphanumeric
  else if (errors.pattern && errors.pattern.requiredPattern === '^(?=.*[a-zA-Z0-9]).{0,}$') {
    return {
      error: 'CORE.NO-SPECIAL-CHARACTER-ONLY',
      requiredFormat: format
    };
  } else if (errors.pattern && errors.pattern.requiredPattern === '^([ء-ي]+[\\s]?)+$') {
    return {
      error: 'CORE.ARABIC-CHARS-ONLY'
    };
  } else if (errors.pattern && errors.pattern.requiredPattern === '^([ء-ي]+[\\s]?)+$') {
    return {
      error: 'CORE.ARABIC-CHARS-ONLY'
    };
  }
  //Error Message For Invalid National Identification Number
  else if (errors.invalidNIN) {
    return {
      error: 'CORE.INVALID-NATIONAL-ID'
    };
  }
  //Error message for invalid iqama number
  else if (errors.invalidIqama) {
    return {
      error: 'CORE.INVALID-IQAMA'
    };
  }
  //Error message for invalid border number
  else if (errors.invalidBorderNo) {
    return {
      error: 'CORE.INVALID-BORDERNUMBER'
    };
  }
  //Error message for invalid iBan number
  else if (errors.invalidIBan) {
    return {
      error: 'CORE.INVALID-IBAN'
    };
  }
  //Error message for invalid unified number
  else if (errors.invalidUnifiedNo) {
    return {
      error: 'CORE.INVALID-UNIFIED-NUMBER'
    };
  }
  //Error message for invalid recruitment number
  else if (errors.invalidRecruitment) {
    return {
      error: 'CORE.INVALID-RECRUITMENT'
    };
  } else if (errors.minDate) {
    let minDate: string = null;
    if (errors.minDate.isMonthPicker) {
      minDate = convertToStringDDMMYYYY(moment(errors.minDate.minDateValue).subtract(1, 'month').toString());
      minDate = minDate.slice(3, minDate.length);
    } else {
      minDate = convertToStringDDMMYYYY(moment(errors.minDate.minDateValue).subtract(1, 'days').toString());
    }
    return {
      error: 'CORE.MIN-DATE',
      inputValue: convertToStringDDMMYYYY(errors.minDate.controlValue),
      validatorValue: minDate
    };
  }
  //Error message for hijri min date
  else if (errors.hijriMinDate) {
    return {
      error: 'CORE.DATE-ON-OR-AFTER',
      inputValue: convertToStringDDMMYYYY(errors.hijriMinDate.controlValue),
      validatorValue: convertToStringDDMMYYYY(errors.hijriMinDate.minDateValue)
    };
  } else if (errors.maxDate) {
    let maxDate: string = null;
    if (errors.maxDate.isMonthPicker) {
      maxDate = convertToStringDDMMYYYY(moment(errors.maxDate.maxDateValue).add(1, 'month').toString());
      maxDate = maxDate.slice(3, maxDate.length);
    } else {
      maxDate = convertToStringDDMMYYYY(moment(errors.maxDate.maxDateValue).add(1, 'days').toString());
    }
    return {
      error: 'CORE.MAX-DATE',
      inputValue: convertToStringDDMMYYYY(errors.maxDate.controlValue),
      validatorValue: maxDate
    };
  }
  //Error Message For Invalid National Identification Number
  else if (errors?.bsDate || errors[0]?.bsDate) {
    //Error Message For Minimum Date Allowed
    const error = errors.bsDate ? errors : errors[0];
    if (error.bsDate.minDate) {
      return {
        error: 'CORE.MIN-DATE',
        inputValue: convertToStringDDMMYYYY(error.bsDate.minDate),
        validatorValue:
          type === 'date'
            ? convertToStringDDMMYYYY(moment(error.bsDate.minDate).add(1, 'days').toString())
            : moment(error.bsDate.minDate).subtract(1, 'month').format('MM/YYYY')
      };
    }
    //Error Message For Maximum Date Allowed
    else if (error.bsDate.maxDate) {
      return {
        error: 'CORE.MAX-DATE',
        inputValue: convertToStringDDMMYYYY(error.bsDate.maxDate),
        validatorValue:
          type === 'date'
            ? convertToStringDDMMYYYY(moment(error.bsDate.maxDate).add(1, 'days').toString())
            : moment(error.bsDate.maxDate).add(1, 'month').format('MM/YYYY')
      };
    } else {
      return {
        error: 'CORE.INVALID-DATE'
      };
    }
  } else if (errors.minDate) {
    return {
      error: 'CORE.MIN-DATE',
      inputValue: convertToStringDDMMYYYY(errors.minDate.controlValue),
      validatorValue: convertToStringDDMMYYYY(moment(errors.minDate.minDateValue).subtract(1, 'days').toString())
    };
  } else if (errors.maxDate) {
    return {
      error: 'CORE.MAX-DATE',
      inputValue: convertToStringDDMMYYYY(errors.maxDate.controlValue),
      validatorValue: convertToStringDDMMYYYY(moment(errors.maxDate.maxDateValue).subtract(1, 'days').toString())
    };
  }

  //Error Message For Minimum Date Allowed
  else if (errors['Mask error']) {
    return {
      error: 'CORE.FORMAT-ERROR',
      requiredFormat: format
    };
  } else if (errors.inCorrectValue) {
    return {
      error: 'CORE.THIS-FIELD-IS-REQUIRED'
    };
  } else if (errors.invalidHijiri) {
    return {
      error: 'CORE.INVALID-DATE'
    };
  } else if (errors.mask?.requiredMask) {
    return {
      error: 'CORE.FORMAT-ERROR',
      requiredFormat: format
    };
  }
  // error if user select a date between a mentioned period. works for both hijiri and gregorian. both dates in DD/MM/YYYY format
  else if (errors.insideDateRange) {
    return {
      error: 'CORE.INSIDE-DATE-RANGE-ERROR',
      inputValue: errors.insideDateRange?.startDate, // range start date
      validatorValue: errors.insideDateRange?.endDate //range end date
    };
  }
  //Error Message for Numberic Field
  else if (errors.pattern && errors.pattern.requiredPattern === '^[0-9.٠١٢٣٤٥٦٧٨٩+-]+$') {
    return {
      error: 'CORE.NUMERIC-ONLY'
    };
  }
  //Error Message for Alpha Numberic Field
  else if (errors.pattern && errors.pattern.requiredPattern === '^[a-zA-Z0-9.,۰۱۲۳٤٥٦٧۸۹ء-ي ]+$') {
    return {
      error: 'CORE.ALPHA-NUMERIC-ONLY'
    };
  } else if (errors.invalidDropdownValue) {
    return {
      error: 'CORE.INVALID-DROP-DOWN-ERROR'
    };
  }
};
