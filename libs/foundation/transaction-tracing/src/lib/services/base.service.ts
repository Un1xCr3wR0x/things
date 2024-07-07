import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  readonly interceptUrl = `/denodo-api`;

  getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append(`x-api`, `false`);
    return headers;
  }
}
