/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { reopenTrans } from '../components/transaction-summary-dc/transaction-summary-dc.component';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '@gosi-ui/core';
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(
    readonly http: HttpClient,
    readonly alertService: AlertService) { }

    onSubmit(complaintId: any, reopenObj: reopenTrans): Observable<any> {
      
      return this.http.put(`/api/v1/complaint/${complaintId}/complaint-reopen`, reopenObj).pipe(
        catchError(error => {
          this.showAlerts(error);
          throw error;
        })
      );
    }

     /**
   * method to show alerts
   * @param error
   */
  showAlerts(error) {
    this.alertService.showError(error.error.message);
  }
}
