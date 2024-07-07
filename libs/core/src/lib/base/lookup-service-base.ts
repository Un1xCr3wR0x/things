/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Lov, LovList } from '../models';

export abstract class LookUpServiceBase {
  /** Local Variables */
  private lovMap = new Map<string, BehaviorSubject<LovList>>();
  protected lovBaseUrl = '/api/v1/lov';

  constructor(readonly http: HttpClient) {}

  /**
   * Method to get lookup values with category and domain
   * @param category is available in LookupCategory
   * @param domain is available in LookupDomainName or can be dynamic value
   */
  protected getLookupByCategoryAndDomain(
    category: string,
    domain: string,
    headerParam?: HttpHeaders
  ): Observable<LovList> {
    const options = {
      params: {
        category: category,
        domainName: domain
      },
      headers: headerParam
    };
    let lookupSubject = this.lovMap.get(category + '-' + domain);
    if (lookupSubject) {
      return lookupSubject.asObservable();
    } else {
      lookupSubject = new BehaviorSubject<LovList>(null);
      this.lovMap.set(category + '-' + domain, lookupSubject);
      this.http
        .get<Lov[]>(this.lovBaseUrl, options)
        .pipe(
          map(response => new LovList(response)),
          catchError(() => {
            this.lovMap.delete(category + '-' + domain);
            return this.handleError(`Lookup -- ${category}-${domain} fetch failed. Please try again later.`);
          })
        )
        .subscribe(response => {
          lookupSubject.next(response);
        });
      return lookupSubject.asObservable();
    }
  }

  /**
   * Method to get lookup values with category and domain
   * @param category is available in LookupCategory
   * @param domain is available in LookupDomainName or can be dynamic value
   */
  protected getLookupByDomainAndGender(category: string, domain: string, gender: string): Observable<LovList> {
    const options = {
      params: {
        category: category,
        domainName: domain,
        gender: gender
      }
    };
    let lookupSubject = this.lovMap.get(category + '-' + domain + ' ' + gender);
    if (lookupSubject) {
      return lookupSubject.asObservable();
    } else {
      lookupSubject = new BehaviorSubject<LovList>(null);
      this.lovMap.set(category + '-' + domain + ' ' + gender, lookupSubject);
      this.http
        .get<Lov[]>(this.lovBaseUrl, options)
        .pipe(
          map(response => new LovList(response)),
          catchError(() => {
            return this.handleError(`Lookup -- ${category}-${domain}-${gender} fetch failed. Please try again later.`);
          })
        )
        .subscribe(response => {
          lookupSubject.next(response);
        });
      return lookupSubject.asObservable();
    }
  }

  /**
   * Method to get lookup values with path and domain
   * @param path available in LookupPath enum
   * @param category
   */
  protected getLookupByPath(path: string, params?: HttpParams, fullPath = false): Observable<LovList> {
    const options = {
      params
    };
    let mapKey = path;
    if (params) {
      mapKey = mapKey + params.toString();
    }
    let lookupSubject = this.lovMap.get(mapKey);
    if (lookupSubject) {
      return lookupSubject.asObservable();
    } else {
      lookupSubject = new BehaviorSubject<LovList>(null);
      this.lovMap.set(mapKey, lookupSubject);
      let lovPath = path;
      if (!fullPath) {
        lovPath = path ? this.lovBaseUrl + '/' + path : this.lovBaseUrl;
      }
      this.http
        .get<Lov[]>(lovPath, options)
        .pipe(
          map(response => new LovList(response)),
          catchError(() => {
            return this.handleError(`${this.lovBaseUrl}\/${path} fetch failed. Please try again later.`);
          })
        )
        .subscribe(response => {
          lookupSubject.next(response);
        });
      return lookupSubject.asObservable();
    }
  }

  /**
   * This method is to handle error response.
   */
  protected handleError(msg: string) {
    return throwError(msg);
  }

  /**
   * Method to clear lovMap
   */
  clearLovMap(category: string, domain: string) {
    this.lovMap.delete(category + '-' + domain);
  }
  /**
   * 
   * @param category 
   * @param domain 
   * @returns Lov[]
   */
  protected getLovLookupByCategoryAndDomain(category: string, domain: string): Observable<Lov[]> {
    const url = `/api/v1/lov?category=${category}&domainName=${domain}`;
    return this.http.get<Lov[]>(url);
  }
}
