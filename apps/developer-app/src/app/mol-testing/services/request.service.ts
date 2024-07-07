import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  body$: BehaviorSubject<string> = new BehaviorSubject(null);
  constructor(readonly http: HttpClient) {}

  postData(url, body, isXml = false) {
    const headersnew = new HttpHeaders(isXml ? { 'Content-Type': 'application/json' } : {});
    return this.http.post(url, body, { headers: headersnew });
  }
}
