
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ContributorGlobalSearch } from '../models/contributor-global-search';
import { Establishment, EstablishmentQueryParams } from '../models';
import { Transactions } from '../models/transaction-globalsearch';

@Injectable({
    providedIn: 'root'
  })
  export class GlobalSearchService {

    contributorSearchList=[];
    estGlobalSearchList=[];
    transGlobalSearchList=[];

    constructor(readonly http: HttpClient) {}

    getContributorGlobalSearch(identity):Observable<ContributorGlobalSearch[]>{
        const url=`/api/v1/contributor-search?searchKey=${identity}`;
        return this.http.get<ContributorGlobalSearch[]>(url);
      }
   /**
   * This method is to fetch the Transaction with transaction trace number
   * @param TraceNumber
   */
    getTransactionGlobalSearch(TraceNumber: number): Observable<Transactions> {
    const getTransactionUrl = `/api/v1/transaction-search/${TraceNumber}`;
      return this.http.get<Transactions>(getTransactionUrl);
    }

        /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentService
   */
  getEstablishment(registrationNo: number, queryParams?: EstablishmentQueryParams): Observable<Establishment> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}`;
    if (queryParams) {
      return this.http.get<Establishment>(getEstablishmentUrl, {
        params: this.getParams(undefined, queryParams, new HttpParams())
      });
    } else {
      return this.http.get<Establishment>(getEstablishmentUrl);
    }
  }

  /**
 * Method to get the params from object
 * @param key - param key :- value is object initally pass key as undefined
 * @param value - object or param value
 * @param params - http params instance
 */
 getParams(key: string, value, params: HttpParams): HttpParams {
    if (Array.isArray(value)) {
      // params = params.append(key, value.join(', '));
      value.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(itemKey => {
            params = this.getParams(key ? key + '.' + itemKey : itemKey, item[itemKey], params);
          });
        } else {
          params = params.append(`${key}`, item);
        }
      });
      return params;
    } else if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(valueKey => {
        params = this.getParams(key ? key + '.' + valueKey : valueKey, value[valueKey], params);
      });
      return params;
    } else if (value !== undefined && value !== null) {
      if (params?.get(key)) {
        return params.append(`${key}`, value);
      } else {
        return params.set(key, value);
      }
    } else {
      return params;
    }
  }

  } 