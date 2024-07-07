import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contract } from '../models/contract';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageDocumentService {
  constructor(private http: HttpClient) {}

  /**
   * Method to get the contracts
   */
  getContracts(registrationNo: string, socialInsuranceNo: number): Observable<Contract[]> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/contracts`;
    return this.http.get<Contract[]>(url);
  }
}
