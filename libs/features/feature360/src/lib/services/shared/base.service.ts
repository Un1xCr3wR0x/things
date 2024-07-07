import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  readonly interceptUrl = '/denodo-api';

  getDate(inputDate) {
    return moment(new Date(inputDate)).format('YYYY-MMM-DD');
  }

  getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append('x-api', 'false');
    return headers;
  }
}
