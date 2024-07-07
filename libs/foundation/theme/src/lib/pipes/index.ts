/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/** This file is used to export the pipe implementations in this folder. */
import { BilingualTextPipe } from './bilingual-text.pipe';
import { DateFormatPipe } from './date-format-pipe';
import { DateOrderPipe } from './date-order.pipe';
import { DateTypePipe } from './date-type.pipe';
import { FormArrayFilterPipe } from './formArray-filter.pipe';
import { LimitToPipe } from './limitTo.pipe';
import { NameToString } from './name-to-string.pipe';
import { NumToPositive } from './num-to-positive.pipe';
import { SearchArraytPipe } from './searchArray.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { TimeDifferencePipe } from './time-difference.pipe';
import { GosiDatePipe } from './gosi-date.pipe';
import { MonthNamePipe } from './hijriMonthName.pipe';
import { FilterPipe } from './singleFormat-hijri';
import { SingleFormatPipe } from './hijiriSingleFormat';
import { DateTypePipe1 } from './hijiriGregorianFormat';
import { FormatDatePipe } from './format-date.pipe';
import { ArabicKeyPipe } from './arabic-key.pipe';
import { EnglishKeyPipe } from './english-key.pipe';
import { SafePipe } from './safe.pipe';

export const PIPES = [
  DateOrderPipe,
  TimeAgoPipe,
  BilingualTextPipe,
  TimeDifferencePipe,
  LimitToPipe,
  SearchArraytPipe,
  DateFormatPipe,
  FormArrayFilterPipe,
  NameToString,
  NumToPositive,
  DateTypePipe,
  GosiDatePipe,
  MonthNamePipe,
  FilterPipe,
  SingleFormatPipe,
  DateTypePipe1,
  FormatDatePipe,
  ArabicKeyPipe,
  EnglishKeyPipe,
  SafePipe
];

export * from './bilingual-text.pipe';
export * from './date-format-pipe';
export * from './date-order.pipe';
export * from './date-type.pipe';
export * from './formArray-filter.pipe';
export * from './limitTo.pipe';
export * from './name-to-string.pipe';
export * from './num-to-positive.pipe';
export * from './searchArray.pipe';
export * from './time-ago.pipe';
export * from './time-difference.pipe';
export * from './gosi-date.pipe';
export * from './hijriMonthName.pipe';
export * from './singleFormat-hijri';
export * from './hijiriSingleFormat';
export * from './hijiriGregorianFormat';
export * from './format-date.pipe';
export * from './format-date.pipe';
export * from './arabic-key.pipe';
export * from './english-key.pipe';
export * from './safe.pipe';
