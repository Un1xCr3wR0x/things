import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AllocationDetails } from '../../models/establishments/allocation-details';
import { BillDetails } from '../../models/establishments/bill-details';
import { BillHistoryWrapper } from '../../models/establishments/bill-history-wrapper';
import { CreditBalanceDetails } from '../../models/establishments/credit-balance-details';
import { DetailedBillViolationDetails } from '../../models/establishments/detailed-bill-violation-details';
import { InstallmentHistory } from '../../models/establishments/installment-history';
import { InstallmentSummary } from '../../models/establishments/installment-summary';
import { ItemizedInstallmentWrapper } from '../../models/establishments/itemized-installment-wrapper';
import { ItemizedRejectedOHWrapper } from '../../models/establishments/itemized-rejected-OH-wrapper';
import { ViolationAdjustmentDetails } from '../../models/establishments/violation-adjustment-details';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class FinancialDetailService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /*
from detailed-bill.service.ts
*/
  /*** This method is to get bill number*/
  getBillNumber(registerNo: number, startDate: string, pageLoad?: boolean): Observable<BillHistoryWrapper> {
    let billHistory = `/api/v1/establishment/${registerNo}/bill?includeBreakUp=false&startDate=${startDate}`;
    if (pageLoad) {
      billHistory = `/api/v1/establishment/${registerNo}/bill?includeBreakUp=false&startDate=${startDate}&pageLoad=${pageLoad}`;
    }
    return this.http.get<BillHistoryWrapper>(billHistory).pipe(map(res => res));
  }

  /*
  from detailed-bill.service.ts
  */
  /*** This method is to get Bill Breakup details*/
  getBillBreakup(regNumber: number, billNo: number, startDate: string, entityType: string): Observable<BillDetails> {
    return this.http.get<BillDetails>(
      `/api/v1/establishment/${regNumber}/bill/${billNo}/bill-summary?startDate=${startDate}&entityType=${entityType}`
    );
  }

  /*
  from detailed-bill.service.ts
  */
  /*** This method is to get rejectedOH itemized details.*/
  getInstallmentDetails(regNo: number, startDate: string): Observable<ItemizedInstallmentWrapper> {
    const rejectedOHDetailedBill = `/api/v1/establishment/${regNo}/installment/summary?startDate=${startDate}`;
    return this.http.get<ItemizedInstallmentWrapper>(rejectedOHDetailedBill);
  }
  getRejectedOHDetails(
    regNo: number,
    startDate: string,
    pageNo: number,
    pageSize: number
  ): Observable<ItemizedRejectedOHWrapper> {
    const rejectedOHDetailedBill = `/api/v1/establishment/${regNo}/oh-recovery?pageNo=${pageNo}&pageSize=${pageSize}&startDate=${startDate}`;
    return this.http.get<ItemizedRejectedOHWrapper>(rejectedOHDetailedBill);
  }

  /*
  from detailed-bill.service.ts
  */
  /** * This method is to get Late Fee Wavier **/
  getViolationDetails(
    regNo: number,
    startDate: string,
    endDate: string,
    pageNo?: number,
    pageSize?: number
  ): Observable<DetailedBillViolationDetails> {
    let url = `/api/v1/establishment/${regNo}/contributor-violation?startDate=${startDate}&endDate=${endDate}`;
    if (pageNo && pageSize) {
      url = url + `&pageNo=${pageNo}&pageSize=${pageSize}`;
    }
    return this.http.get<DetailedBillViolationDetails>(url);
  }

  /*
  from bill-dashboard.service.ts
  */
  /**
   * This method is to get Bill History Details
   * @param idNumber Identification Number
   * @param endDate End Date of bill period
   * @param startDate Start Date of bill period
   * @param admin Admin flag
   */
  getBillHistory(
    registerNo: number,
    endDate: string,
    startDate: string,
    includeBreakUp: boolean,
    pageNo?: number,
    pageSize?: number
  ): Observable<BillHistoryWrapper> {
    const billHistory =
      pageNo === undefined || pageSize === undefined
        ? `/api/v1/establishment/${registerNo}/bill?endDate=${endDate}&includeBreakUp=${includeBreakUp}&startDate=${startDate}`
        : `/api/v1/establishment/${registerNo}/bill?endDate=${endDate}&includeBreakUp=${includeBreakUp}&pageNo=${pageNo}&pageSize=${pageSize}&startDate=${startDate}`;
    return this.http.get<BillHistoryWrapper>(billHistory);
  }

  /*
  from bill-dashboard.service.ts
  */
  /**
   * Method to get receipts of the entity.
   * @param regNo registration number
   */
  getAllocationDetails(regNumber: number, billNo: number, responsiblePayee?: string): Observable<AllocationDetails> {
    let allocationDetails = `/api/v1/establishment/${regNumber}/bill/${billNo}/allocation-summary`;
    allocationDetails = responsiblePayee
      ? allocationDetails + `?responsiblePayee=${responsiblePayee}`
      : allocationDetails;

    return this.http.get<AllocationDetails>(allocationDetails);
  }

  /*
  from installment.service.ts
  */
  /**
   * This method is to fetch the  Installment
   * @param RegistrationNumber
   * @memberof EstablishmentService
   */
  getInstallmentactive(registrationNo: number, active = false): Observable<InstallmentHistory> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/installment?active=${active}`;
    return this.http.get<InstallmentHistory>(getEstablishmentUrl);
  }

  /*
  from installment.service.ts
  */
  /** This method is to fetch the installment details by installment id */
  getInstallmentDetailsById(regNo, installmentId): Observable<InstallmentSummary> {
    const installmentDetailsUrl = `/api/v1/establishment/${regNo}/installment/${installmentId}`;
    return this.http.get<InstallmentSummary>(installmentDetailsUrl);
  }

  /*
  from report-statement.service.ts
  */
  /** * This method is to get Late Fee Wavier **/
  getViolationAdjustmentDetails(
    regNo: number,
    startDate?: string,
    enddate?: string,
    type?: string,
    pageNo?: number,
    pageSize?: number
  ): Observable<ViolationAdjustmentDetails> {
    const url =
      type !== undefined
        ? `/api/v1/establishment/${regNo}/contributors?startDate=${startDate}&endDate=${enddate}&violationVariance=${type}&pageNo=${pageNo}&pageSize=${pageSize}`
        : `/api/v1/establishment/${regNo}/contributors`;
    return this.http.get<ViolationAdjustmentDetails>(url);
  }

  /*
  from credit-management.service.ts
  */
  /**
   * This method is to get available credit balance
   * @param regNumber Registration Number
   */
  getAvailableCreditBalance(registerNo: number): Observable<CreditBalanceDetails> {
    const creditBalanceUrl = `/api/v1/establishment/${registerNo}/account`;
    return this.http.get<CreditBalanceDetails>(creditBalanceUrl);
  }
}
