/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { convertDateToYYYYMMDD, convertToYYYYMMDD, startOfDay } from '@gosi-ui/core';
import { SystemParams } from '../enums/system-params';

/**
 * Class for system params
 */
export class SystemParameter {
  REG_CONT_MAX_BACKDATED_JOINING_DATE: Date = new Date();

  REG_CONT_MIN_START_DATE_G_PPA: Date = new Date();
  REG_CONT_MAX_END_DATE_H_PPA: any = undefined;

  REG_CONT_MAX_REGULAR_JOINING_DATE: Date = new Date();
  CHNG_ENG_MAX_BACKDATED_JOINING_DATE: Date = new Date();
  CHNG_ENG_MAX_BACKDATED_PERIOD_START_DATE: Date = new Date();
  CHNG_ENG_MAX_REGULAR_PERIOD_START_DATE: Date = new Date();
  OLD_LAW_DATE: Date = new Date();

  TERMINATE_ENG_MAX_BACKDATED_JOINING_DATE: Date = new Date();
  TERMINATE_ENG_MAX_REGULAR_JOINING_DATE: Date = new Date();

  REG_CONT_MAX_BACKDATED_PERIOD_IN_MONTHS_GOL: number = undefined;
  REG_CONT_MAX_REGULAR_PERIOD_IN_MONTHS_GOL: number = undefined;
  CHNG_ENG_MAX_BACKDATED_PERIOD_IN_MONTHS_GOL: number = undefined;
  CHNG_ENG_MAX_BACKDATED_WAGE_PERIOD_IN_MONTHS_GOL: number = undefined;
  CHNG_ENG_MAX_REGULAR_WAGE_PERIOD_IN_MONTHS_GOL: number = undefined;
  TERMINATE_ENG_MAX_BACKDATED_PERIOD_IN_MONTHS_GOL: number = undefined;
  TERMINATE_ENG_MAX_REGULAR_PERIOD_IN_MONTHS_GOL: number = undefined;

  REG_CONT_MAX_BACKDATED_PERIOD_IN_MONTHS_FO: number = undefined;
  REG_CONT_MAX_REGULAR_PERIOD_IN_MONTHS_FO: number = undefined;
  CHNG_ENG_MAX_BACKDATED_PERIOD_IN_MONTHS_FO: number = undefined;
  CHNG_ENG_MAX_BACKDATED_WAGE_PERIOD_IN_MONTHS_FO: number = undefined;
  CHNG_ENG_MAX_REGULAR_WAGE_PERIOD_IN_MONTHS_FO: number = undefined;
  TERMINATE_ENG_MAX_BACKDATED_PERIOD_IN_MONTHS_FO: number = undefined;
  TERMINATE_ENG_MAX_REGULAR_PERIOD_IN_MONTHS_FO: number = undefined;
  DEPENDENT_STUDENT_SON_BAR_AGE_MIN: number = undefined;
  DEPENDENT_SON_MAX_AGE: number = undefined;
  RETIREMENT_AGE: number = undefined;
  MIN_MONTHS_MISSING_CONTRIBUTOR: number = undefined;

  UI_TERMINATION_AGE: number = undefined;
  MAX_ELIGIBLE_BENEFICIARY_AGE: number = undefined;
  BACKDATED_PENSION_REQUEST_IN_MONTHS: number = undefined;
  BACKDATED_NON_OCC_PENSION_REQUEST_IN_MONTHS: number = undefined;
  EINSPECTION_MAX_BACKDATED_JOINING_DATE: Date = undefined;
  BILL_BATCH_INDICATOR: number = undefined;
  PPA_CALENDAR_SHIFT_DATE: Date = undefined;
  PENSION_REFORM_EFFECTIVE_DATE: Date = undefined;

  fromJsonToObject(json) {
    json.forEach(key => {
      if (key.name in new SystemParameter()) {
        if (SystemParams[key.name])
          this[key.name] = new Date(convertToYYYYMMDD(startOfDay(new Date(key.value)).toString()));
        else if (key.name === 'REG_CONT_MIN_START_DATE_G_PPA')
          this[key.name] = startOfDay(new Date(convertDateToYYYYMMDD(key.value)));
        else if (key.name === 'REG_CONT_MAX_END_DATE_H_PPA') this[key.name] = key.value;
        else this[key.name] = Number(key.value);
      }
    });
    return this;
  }
}
