import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DependentDetails } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private http: HttpClient) {}

  getDependentDetails() {
    const url = '../../../assets/data/dependent-details.json';
    return this.http.get<DependentDetails[]>(url);
  }
}
