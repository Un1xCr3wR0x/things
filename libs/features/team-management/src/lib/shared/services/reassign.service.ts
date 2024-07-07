import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BulkReassignHistory } from '../models/bulk-reassign-history';
import { ReassignedTransactionWrapper } from '../models/reassigned-transaction-wrapper';
import { NoofReassignedTransactions } from '../models/noof-reassigned-transaction';
import { BulkReassignMannual } from '../models/bulk-reassign-manually';

@Injectable({
  providedIn: 'root'
})
export class ReassignService {

  constructor(
    readonly http: HttpClient,) { }

  /**
   * method to get bulk reassign history details
   */
  getBulkReassignHistory(page:any, sort: any, order: any, filter: any): Observable<BulkReassignHistory> {
    const url = `/api/v1/transaction/internal/reassign-history`;
    let params = new HttpParams();

    params = params.set('page.pageNo', page);
    params = params.set('page.size', '10');
    if (sort)
      params = params.set('sort.column', sort.toString());
    if (order)
      params = params.set('sort.direction', order.toString());
    if (filter)
      params = params.set('filter.status', filter)
    return this.http.get<BulkReassignHistory>(url, { params });
  }


  searchBulkReassignHistory(page:any, sort: any, order: any, filter: any,searchType:any,searchData): Observable<BulkReassignHistory> {
    const url = `/api/v1/transaction/internal/reassign-history`;
    let params = new HttpParams();
    params = params.set('page.pageNo', page);
    params = params.set('page.size', '10');
    if (sort)
      params = params.set('sort.column', sort.toString());
    if (order)
      params = params.set('sort.direction', order.toString());
    if (filter)
      params = params.set('filter.status', filter)
    if(searchType == "trnsactionID"  && searchData != null) {
      params = params.set('filter.transactionTraceId', searchData);
    }
    if(searchType == "sourceEmployee" && searchData != null) {
      params = params.set('filter.sourceUserId', searchData);
    }
    if(searchType == "targetEmployee"  && searchData != null) {
      params = params.set('filter.targetUserId', searchData);
    }
    if(searchType == "applicant"  && searchData != null){ 
      params = params.set('filter.requestedBy', searchData);
    }
    return this.http.get<BulkReassignHistory>(url, { params });
  }

   

  /**
   * method to get employee details
   */
  getEmployeeDetails(empID: any) {
    const url = `/api/v1/private-user/${empID}/profile`;
    let params = new HttpParams();
    params = params.set('type', '1');
    // if (page) params = params.set('page', page.toString());
    return this.http.get<ReassignedTransactionWrapper>(url, { params });
  }

  /**
   * method to get target employee details
   */
  getTargetEmployeeDetails(empID: any) {
    const url = `/api/v1/private-user/${empID}/profile`;
    let params = new HttpParams();
    params = params.set('type', '1');
    // if (page) params = params.set('page', page.toString());
    return this.http.get<ReassignedTransactionWrapper>(url, { params });
  }

  /**
  * method to reassign transactions
  */
  reassignTransaction(roles: any, empId: any, targetEmpID: any) {
    const url = `/api/v1/transaction/internal/reassign`;
    let bulkData : BulkReassignMannual = new BulkReassignMannual();
    bulkData.sourceId = empId;
    bulkData.targetId = targetEmpID;
    bulkData.groups = roles;
    
    return this.http.post<any>(url, bulkData);
  }

  /**
  * method to reassign transactions using csv
  */
  csvReassignTransaction(list){
    const url = `/api/v1/transaction/internal/bulk-reassign`;
    return this.http.post<any>(url, list);
  }

   /**
  * method for getting no of transactions
  */
   getTransactionCount(empId: any) {
    const url = `/api/v1/transaction/internal/private-user/${empId}/task-count`;
    return this.http.get<NoofReassignedTransactions>(url);
   }
}
