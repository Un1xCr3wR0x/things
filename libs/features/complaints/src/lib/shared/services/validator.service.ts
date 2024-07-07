/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuggestionResponse } from '../models/suggestion-response';
import {
  AlertService,
  Person,
  IdentityTypeEnum,
  getPersonNameAsBilingual,
  NIN,
  Iqama,
  bindToObject,
  CryptoService
} from '@gosi-ui/core';
import { catchError, map } from 'rxjs/operators';
import {
  CustomerSummary,
  ComplaintTypeUpdateRequest,
  DepartmentDetails,
  DepartmentDetailsWrapper,
  TransactionSummary,
  ClerkDetails
} from '../models';
import { Establishment } from '@gosi-ui/core';
import { TransactionType } from '../models/transaction-Type-List';
import { ReportingEmployees } from '@gosi-ui/features/complaints/lib/shared/models/reporting-employees';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  baseUrl = '/api/v1';
  /**
   * create an instance of validator service
   * @param http
   * @param alertService
   */
  constructor(readonly http: HttpClient, readonly alertService: AlertService, readonly cryptoService: CryptoService) {}
  /**
   * method to get suggesstion responses
   * @param transactionId
   */
  getSuggestionDetails(transactionId: number): Observable<SuggestionResponse> {
    const url = `${this.baseUrl}/suggestions/${transactionId}`;
    return this.http.get<SuggestionResponse>(url).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }
  /**
   * method to get transaction details
   * @param referenceNo
   */
  getTransactionDetails(businessKey: number): Observable<TransactionSummary> {
    const url = `${this.baseUrl}/complaint/${businessKey}`;
    return this.http.get<TransactionSummary>(url).pipe(
      catchError(error => {
        this.alertService.clearAlerts();
        this.showAlerts(error);
        throw error;
      })
    );
  }
  /**
   * Method to update complaint type and subtype
   * @param complaintRequest
   */
  updateComplaintType(complaintId: number, complaintTypeResponse: ComplaintTypeUpdateRequest) {
    return this.http.put(`${this.baseUrl}/complaint/${complaintId}`, complaintTypeResponse).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }
  /**
   * method to get transaction against details
   * @param transactionId
   */
  getSimisTransactionDetails(transactionId: number) {
    const url = `${this.baseUrl}/transaction/${this.cryptoService.encrypt(transactionId)}/tracking`;
    return this.http.get<TransactionSummary>(url);
  }
  /**
   * method to get person details
   * @param personId
   */
  getPersonDetails(personId: number): Observable<CustomerSummary> {
    const url = `${this.baseUrl}/person/${personId}`;
    return this.http.get(url).pipe(
      map((res: Person) => {
        const customerSummary: CustomerSummary = new CustomerSummary();
        customerSummary.contactId =
          res && res.contactDetail && res.contactDetail.mobileNo && res.contactDetail.mobileNo.primary;
        customerSummary.customerName = getPersonNameAsBilingual(res && res.name);
        customerSummary.emailId =
          res && res.contactDetail && res.contactDetail.emailId && res.contactDetail.emailId.primary;
        if (res && res.identity)
          res.identity.forEach((item, index) => {
            if (item.idType === IdentityTypeEnum.NIN) customerSummary.id = <NIN>res.identity[index];
            else if (item.idType === IdentityTypeEnum.IQAMA) customerSummary.id = <Iqama>res.identity[index];
          });
        return customerSummary;
      })
    );
  }
  /**
   * method to get particular department details
   * @param locationID
   */
  getDepartmentDetails(locationID: number): Observable<DepartmentDetails[]> {
    const url = `${this.baseUrl}/tamam/departmentmaps?locationID=${locationID}`;
    return this.http.get(url).pipe(
      map((response: DepartmentDetailsWrapper) => {
        if (response && response.DeptResp) return response.DeptResp;
      })
    );
  }
  /**
   * method to get particular department clerk details
   * @param departmentId
   */
  getClerkDetails(departmentId: string): Observable<ClerkDetails[]> {
    const url = `${this.baseUrl}/tamam/employeedepartment?departmentId=${departmentId}`;
    return this.http.get<ClerkDetails[]>(url).pipe(
      map(response => {
        const employee = {
          EmployeeDeptResp: ''
        };
        const employeeDeptResp = bindToObject(employee, response).EmployeeDeptResp;
        if (response && employeeDeptResp) {
          const clerkDetails: ClerkDetails[] = [];
          employeeDeptResp.forEach((item, index) => {
            clerkDetails.push(new ClerkDetails(item?.EmployeeUserName, item?.Employee_Name_Ar, item?.Employee_Name_En, index + 1));
          });
          return clerkDetails;
        }
      })
    );
  }

  getEmployeesByHeadDepartmentId(personNumber: number) {
    const url = `${this.baseUrl}/tamam/reportingemployees?personNumber=${personNumber}`;

    return this.http.get<{ GetReportingEmployeeOutput: ReportingEmployees[] }>(url).pipe(
      map(response => {
        if (response) {
          const clerkDetails: ClerkDetails[] = [];
          response.GetReportingEmployeeOutput.forEach((item, index) => {
            clerkDetails.push(new ClerkDetails(item?.Employee_UserName, item?.Employee_Name_En, item?.Employee_Name_Ar, index + 1));
          });
          return clerkDetails;
        }
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
  /**
   *
   * @param registrationNo method to get est details
   */
  getEstablishment(registrationNo: number): Observable<Establishment> {
    const url = `/api/v1/establishment/${registrationNo}`;
    return this.http.get<Establishment>(url);
  }
  /**
   *
   * @param personIdentifier method to get txn list
   */
  getTransactionList(personIdentifier: number): Observable<TransactionSummary[]> {
    const url = `/api/v1/complaint?personIdentifier=${personIdentifier}`;
    return this.http.get<TransactionSummary[]>(url);
  }
  /**
   * Method to get the transaction Type lookups from API
   */
  getTransactionsTypesList() {
    const url = `/api/v1/complaint/gettransactionstypes`;
    return this.http.get<TransactionType[]>(url);
  }
  /**
   * Method to update Transaction Type
   * @param transactionTraceId
   */
  updateTransactionType(
    transactioneId: number,
    isValid: number,
    rightCategory: string,
    rightType: string,
    rightSubType: string
  ) {
    const url = `/api/v1/complaint/${transactioneId}/updatetransactiontype`;
    return this.http
      .put(url, {
        rightCategory: `${rightCategory}`,
        rightType: `${rightType}`,
        rightSubType: `${rightSubType}`,
        isValid: `${isValid}`
      })
      .subscribe();
  }

  getITSMDetails(incidentNumber){
    const url = `/api/v2/support-ticket/get-itsm-details`;
    return this.http.post<any>(url, {incidentNumber:`${incidentNumber}` });
  }
}
