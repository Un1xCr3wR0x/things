/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionFeedback } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { SecondedDetails } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SecondedService {
  constructor(private http: HttpClient) {}

  /**
   * Method to submit seconded details.
   * @param registrationNumber registration number
   * @param secondedId seconded id
   * @param payload payload
   */
  submitSecondedDetails(registrationNumber: number, payload: SecondedDetails): Observable<TransactionFeedback> {
    const url = `/api/v1/establishment/${registrationNumber}/seconded`;
    return this.http.put<TransactionFeedback>(url, payload);
  }

  /**
   * Method to get seconded details of the establishment.
   * @param registrationNo registartion number
   * @param secondedId seconded id
   */
  getSecondedDetails(registrationNo: number, secondedId: number): Observable<SecondedDetails> {
    const url = `/api/v1/establishment/${registrationNo}/seconded/${secondedId}`;
    return this.http.get<SecondedDetails>(url);
  }

  /**
   * Method to revert the transaction on validator edit.
   * @param registrationNo registration number
   * @param secondedId seconded id
   */
  revertTransaction(registrationNo: number, secondedId: number) {
    const url = `/api/v1/establishment/${registrationNo}/seconded/${secondedId}/revert`;
    return this.http.put<null>(url, []);
  }
}
