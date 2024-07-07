/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertService, BilingualText } from '@gosi-ui/core';
import { catchError } from 'rxjs/operators';
import { SuggestionWrapper, SearchRequest } from '../models';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  baseUrl = '/api/v1/suggestions';
  /**
   * create an instance of suggestion service
   * @param http
   * @param alertService
   * @param datePipe
   */
  constructor(readonly http: HttpClient, readonly alertService: AlertService, readonly datePipe: DatePipe) {}
  /***
   * method to show alerts
   */
  showAlerts(error) {
    this.alertService.showError(error.error.message);
  }
  /**
   * method to get suggesstion details with sort,filter,search and pagination
   * @param searchRequest
   */
  getSuggestionList(searchRequest: SearchRequest) {
    let suggestionUrl = '';

    suggestionUrl = `${this.baseUrl}?page.pageNo=${searchRequest.limit.pageNo}&page.size=${searchRequest.limit.pageSize}`;
    if (searchRequest.searchKey) {
      suggestionUrl += `&searchKey=${searchRequest.searchKey}`;
    }
    if (searchRequest.sort.column && searchRequest.sort.direction)
      suggestionUrl += `&sort.column=${searchRequest.sort.column}&sort.direction=${searchRequest.sort.direction}`;
    if (searchRequest.filter.status && searchRequest.filter.status.length > 0) {
      searchRequest.filter.status.map((value: BilingualText) => {
        suggestionUrl += `&filter.listOfStatus=${value.english}`;
      });
    }
    if (searchRequest.filter.fromDate && searchRequest.filter.toDate) {
      suggestionUrl += `&filter.fromDate=${this.datePipe.transform(
        searchRequest.filter.fromDate,
        'dd-MM-yyyy'
      )}&filter.toDate=${this.datePipe.transform(searchRequest.filter.toDate, 'dd-MM-yyyy')}`;
    }
    return this.http.get<SuggestionWrapper>(suggestionUrl, {}).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }
}
