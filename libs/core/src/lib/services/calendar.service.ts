/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CalendarTypeHijiriGregorian } from '../models/calendar-hijiri-gregorian';
import { GosiCalendar } from '../models/gosi-calendar';
import { convertToHijriFormatAPI, convertToYYYYMMDD } from '../utils/date';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  [x: string]: any;
  /** Creates an instance of calendar service. */
  constructor(private http: HttpClient) {}

  /** Method to add years, months, days to a given hijiri date. */
  addToHijiriDate(hijiriDate: string, years: number, months: number = 0, days: number = 0): Observable<GosiCalendar> {
    const url = `/api/v1/calendar/add-hijiri`;
    const params = new HttpParams()
      .set('hijiriDate', hijiriDate)
      .set('years', years.toString())
      .set('months', months.toString())
      .set('days', days.toString());
    return this.http.get<GosiCalendar>(url, { params });
  }
    /** Method to add years, months, days to a given gregorian date. */
    addToGregorianDate(gregorianDate: string, years: number, months: number = 0, days: number = 0): Observable<GosiCalendar> {
      const url = `/api/v1/calendar/add-gregorian`;
      const params = new HttpParams()
        .set('gregorianDate', gregorianDate)
        .set('years', years.toString())
        .set('months', months.toString())
        .set('days', days.toString());
      return this.http.get<GosiCalendar>(url, { params });
    }
  /** Method to get the Hijri Date for corresponding Gregorian Date */
  getGregorianDate(hirjiDate: string): Observable<GosiCalendar> {
    if (hirjiDate) {
      const url = `/api/v1/calendar/gregorian?hijiri=${convertToHijriFormatAPI(hirjiDate)}`;
      return this.http.get<GosiCalendar>(url);
    } else {
      return of<GosiCalendar>();
    }
  }
  getHijiriDate(gregorian: any): Observable<GosiCalendar> {
    if (gregorian) {
      const url = `/api/v1/calendar/hijiri?gregorian=${convertToYYYYMMDD(gregorian)}`;
      return this.http.get<GosiCalendar>(url);
    } else {
      return of<GosiCalendar>();
    }
  }
  /** Method to get the hijiriAgeInMonths */
  getHijiriAgeInMonths(
    dobGregorian: CalendarTypeHijiriGregorian,
    dobHijiri: CalendarTypeHijiriGregorian
  ): Observable<number> {
    const url = `/api/v1/calendar/calculate-age-months-based-on-Hijrah`;
    let params = new HttpParams();
    if (dobGregorian?.gregorian) {
      params = params.set('dateOfBirthG', moment(dobGregorian?.gregorian).format('YYYY-MM-DD'));
    }
    if (dobHijiri?.hijiri) {
      params = params.set('dateOfBirthH', convertToHijriFormatAPI(dobHijiri?.hijiri));
    }
    return this.http.get<number>(url, { params });
  }
  /** Method to get the hijiriAgeInMonths */
  getHijiriAge(dobGregorian: GosiCalendar | CalendarTypeHijiriGregorian, asOnDate: GosiCalendar): Observable<number> {
    //YYYY-MM-DD
    const url = `/api/v1/calendar/calculate-age-based-on-Hijrah`;
    let params = new HttpParams();
    if (dobGregorian?.gregorian) {
      params = params.set('dateOfBirth', moment(dobGregorian?.gregorian).format('YYYY-MM-DD'));
    }else{
      params = params.set('dateOfBirth', convertToHijriFormatAPI(dobGregorian?.hijiri));
    }
    if (asOnDate?.gregorian) {
      params = params.set('asOnDate', moment(asOnDate?.gregorian).format('YYYY-MM-DD'));
    }
    return this.http.get<number>(url, { params });
  }
  /** getting system run date */
  getSystemRunDate(): Observable<GosiCalendar> {
    return this.http.get<GosiCalendar>(`/api/v1/calendar/run-date`).pipe(catchError(err => this.handleError(err)));
  }
  /*** Method to handle error while service call fails*
   *  @param error*/

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
