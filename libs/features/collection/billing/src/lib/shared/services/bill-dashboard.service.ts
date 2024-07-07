/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI .
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, AuthTokenService } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BalanceType } from '../enums';
import {
  BalanceSummary,
  BalanceSummaryWrapper,
  BillHistoryWrapper,
  AllocationDetails,
  ContributorCreditAllocation,
  BillHistoryFilterParams,
  EstablishmentAllocationDetails,
  BillDetails,
  MofAllocationDetails,
  AllocationFilterSearch,
  MofAllocationBreakupFilter
} from '../models';
import { ContributorAllocationDetails } from '../models/contributor-allocation-details';
import { ContributorAllocationFilterRequest } from '../models/contributor-allocation-filter-request';
import { BillPeriods } from '@gosi-ui/features/contributor/lib/shared/models/bill-periods';

@Injectable({
  providedIn: 'root'
})
export class BillDashboardService {
  previousUrl: string;
  /**
   * Creates an instance of BillDashboardService
   * @param http HttpClient
   */
  constructor(
    readonly http: HttpClient,
    @Inject(ApplicationTypeToken) private appToken: string,
    readonly tokenService: AuthTokenService
  ) {}

  _paymentReceiptOrigin = false; //Used in receipt-sc
  idNumber: number;

  /** Method to get paymentReceiptOrigin. */
  get paymentReceiptOrigin() {
    return this._paymentReceiptOrigin;
  }
  /** Method to set paymentReceiptOrigin
   * set true only from public bill dashboard
   * false from private bill screen
   * false from receipt menu click on private and public .
   */
  set paymentReceiptOrigin(originFromPublicScreen: boolean) {
    this._paymentReceiptOrigin = originFromPublicScreen;
  }

  get registrationNo() {
    return this.idNumber;
  }
  set registartionNo(registerNo: number) {
    this.idNumber = registerNo;
  }

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
    if (registerNo !== null) {
      const billHistory =
        pageNo === undefined || pageSize === undefined
          ? `/api/v1/establishment/${registerNo}/bill?endDate=${endDate}&includeBreakUp=${includeBreakUp}&startDate=${startDate}`
          : `/api/v1/establishment/${registerNo}/bill?endDate=${endDate}&includeBreakUp=${includeBreakUp}&pageNo=${pageNo}&pageSize=${pageSize}&startDate=${startDate}`;
      return this.http.get<BillHistoryWrapper>(billHistory);
    }
  }
  /**
   * This method is to get Bill History Details
   * @param idNumber Identification Number
   * @param endDate End Date of bill period
   * @param startDate Start Date of bill period
   * @param admin Admin flag
   */
  getBillHistorySearch(
    registerNo: number,
    includeBreakUp: boolean,
    pageNo?: number,
    pageSize?: number,
    filterParams?: BillHistoryFilterParams
  ): Observable<BillHistoryWrapper> {
    let billHistory = `/api/v1/establishment/${registerNo}/bill?includeBreakUp=${includeBreakUp}&pageNo=${pageNo}&pageSize=${pageSize}`;
    if (filterParams.billDate.startDate) {
      billHistory = billHistory + `&startDate=${filterParams.billDate.startDate}`;
    }
    if (filterParams.billDate.endDate) {
      billHistory = billHistory + `&endDate=${filterParams.billDate.endDate}`;
    }
    if (filterParams.adjustmentIndicator) {
      billHistory = billHistory + `&adjustmentIndicator=${filterParams.adjustmentIndicator}`;
    }
    if (filterParams.rejectedOHInducator) {
      billHistory = billHistory + `&rejectedOhIndicator=${filterParams.rejectedOHInducator}`;
    }
    if (filterParams.violtaionIndicator) {
      billHistory = billHistory + `&violationIndicator=${filterParams.violtaionIndicator}`;
    }
    if (filterParams.paymentStatus) {
      filterParams.paymentStatus.forEach(key => {
        billHistory = billHistory + `&paymentStatus=${key.english}`;
      });
    }
    if (filterParams.settlementDate.endDate) {
      billHistory = billHistory + `&settlementEndDate=${filterParams.settlementDate.endDate}`;
    }
    if (filterParams.settlementDate.startDate) {
      billHistory = billHistory + `&settlementStartDate=${filterParams.settlementDate.startDate}`;
    }
    if (filterParams.amount) {
      billHistory = billHistory + `&amount=${filterParams.amount}`;
    }
    if (filterParams.maxBillAmount >= 0 || filterParams.maxBillAmount !== undefined) {
      billHistory = billHistory + `&maxBillAmount=${filterParams.maxBillAmount}`;
    }
    if (filterParams.minBillAmount >= 0 || filterParams.minBillAmount !== undefined) {
      billHistory = billHistory + `&minBillAmount=${filterParams.minBillAmount}`;
    }
    return this.http.get<BillHistoryWrapper>(billHistory);
  }

  /**
   * This method is to get Bill History Mof Details
   * @param pageNo
   * @param pageSize
   */
  getBillHistoryMof(
    endDate: string,
    establishmentType: string,
    startDate: string,
    pageNo?: number,
    pageSize?: number,
  ): Observable<BillHistoryWrapper> {
    const billHistory = `/api/v1/paying-establishment/1/bill-history?endDate=${endDate}&pageNo=${pageNo}&pageSize=${pageSize}&startDate=${startDate}&establishmentType=${establishmentType}`;
    return this.http.get<BillHistoryWrapper>(billHistory);
  }
  /**
   * This method is to search for Bill History Mof Details
   * @param pageNo
   * @param pageSize
   */
  getBillHistoryMofSearchFilter(params: BillHistoryFilterParams): Observable<BillHistoryWrapper> {
    let baseUrl = `/api/v1/paying-establishment/1/bill-history?`;

    baseUrl = baseUrl + `&startDate=${params.billDate.startDate}&endDate=${params.billDate.endDate}`;
    baseUrl = this.hasValidValue(params.pageNo) ? (baseUrl = baseUrl + `&pageNo=${params.pageNo}`) : baseUrl;
    baseUrl = this.hasValidValue(params.pageSize) ? (baseUrl = baseUrl + `&pageSize=${params.pageSize}`) : baseUrl;
    baseUrl = this.hasValidValue(params.amount) ? (baseUrl = baseUrl + `&amount=${params.amount}`) : baseUrl;
    baseUrl = this.hasValidValue(params.settlementDate.startDate)
      ? (baseUrl = baseUrl + `&settlementStartDate=${params.settlementDate.startDate}`)
      : baseUrl;
    baseUrl = this.hasValidValue(params.settlementDate.endDate)
      ? (baseUrl = baseUrl + `&settlementEndDate=${params.settlementDate.endDate}`)
      : baseUrl;
    baseUrl = this.hasValidValue(params.minBillAmount)
      ? (baseUrl = baseUrl + `&minBillAmount=${params.minBillAmount}`)
      : baseUrl;
    baseUrl = this.hasValidValue(params.maxBillAmount)
      ? (baseUrl = baseUrl + `&maxBillAmount=${params.maxBillAmount}`)
      : baseUrl;
    baseUrl = this.hasValidValue(params.minCreditAmount)
      ? (baseUrl = baseUrl + `&minCreditAmount=${params.minCreditAmount}`)
      : baseUrl;
    baseUrl = this.hasValidValue(params.maxCreditAmount)
      ? (baseUrl = baseUrl + `&maxCreditAmount=${params.maxCreditAmount}`)
      : baseUrl;
    baseUrl = this.hasValidValue(params.minNoOfEstablishment)
      ? (baseUrl = baseUrl + `&minNoOfEstablishment=${params.minNoOfEstablishment}`)
      : baseUrl;
    baseUrl = this.hasValidValue(params.maxNoOfEstablishment)
      ? (baseUrl = baseUrl + `&maxNoOfEstablishment=${params.maxNoOfEstablishment}`)
      : baseUrl;
    baseUrl = this.hasValidValue(params.minNoOfActiveContributor)
      ? (baseUrl = baseUrl + `&minNoOfActiveContributor=${params.minNoOfActiveContributor}`)
      : baseUrl;
    baseUrl = this.hasValidValue(params.maxNoOfActiveContributor)
      ? (baseUrl = baseUrl + `&maxNoOfActiveContributor=${params.maxNoOfActiveContributor}`)
      : baseUrl;
    baseUrl = this.hasValidValue(params.adjustmentIndicator)
      ? baseUrl + `&adjustmentIndicator=${params.adjustmentIndicator}`
      : baseUrl;
    if (params.paymentStatus.length) {
      params.paymentStatus.forEach(key => {
        baseUrl = baseUrl + `&paymentStatus=${key.english}`;
      });
    }
    return this.http.get<BillHistoryWrapper>(baseUrl);
  }
  /**
   * This method is to get Account Summary details
   * @param startDate
   * @param admin
   * @param idNumber
   */
  hasValidValue(value) {
    return value !== null && value !== undefined ? true : false;
  }
  /**
   * This method is to get Bill History Details
   * @param idNumber Identification Number
   * @param endDate End Date of bill period
   * @param startDate Start Date of bill period
   * @param admin Admin flag
   */
  getBillHistoryVic(
    sin: number,
    endDate: string,
    startDate: string,
    includeBreakUp: boolean,
    pageNo?: number,
    pageSize?: number
  ): Observable<BillHistoryWrapper> {
    const billHistoryVic =
      pageNo === undefined || pageSize === undefined
        ? `/api/v1/contributor/${sin}/bill`
        : `/api/v1/contributor/${sin}/bill?endDate=${endDate}&includeBreakUp=${includeBreakUp}&pageNo=${pageNo}&pageSize=${pageSize}&startDate=${startDate}`;
    return this.http.get<BillHistoryWrapper>(billHistoryVic);
  }

  /**
   * This method is to search for Bill History Mof Details
   * @param pageNo
   * @param pageSize
   */
  getBillHistoryVicSearchFilter(params: BillHistoryFilterParams, sin: number): Observable<BillHistoryWrapper> {
    let apiBaseUrl = `/api/v1/contributor/${sin}/bill?&includeBreakUp=true`;

    apiBaseUrl = apiBaseUrl + `&startDate=${params.billDate.startDate}&endDate=${params.billDate.endDate}`;
    apiBaseUrl = this.hasValidValue(params.pageNo)
      ? (apiBaseUrl = apiBaseUrl + `&pageNo=${params.pageNo}`)
      : apiBaseUrl;
    apiBaseUrl = this.hasValidValue(params.pageSize)
      ? (apiBaseUrl = apiBaseUrl + `&pageSize=${params.pageSize}`)
      : apiBaseUrl;
    apiBaseUrl = this.hasValidValue(params.amount)
      ? (apiBaseUrl = apiBaseUrl + `&amount=${params.amount}`)
      : apiBaseUrl;
    apiBaseUrl = this.hasValidValue(params.settlementDate.startDate)
      ? (apiBaseUrl = apiBaseUrl + `&settlementStartDate=${params.settlementDate.startDate}`)
      : apiBaseUrl;
    apiBaseUrl = this.hasValidValue(params.settlementDate.endDate)
      ? (apiBaseUrl = apiBaseUrl + `&settlementEndDate=${params.settlementDate.endDate}`)
      : apiBaseUrl;
    apiBaseUrl = this.hasValidValue(params.minBillAmount)
      ? (apiBaseUrl = apiBaseUrl + `&minBillAmount=${params.minBillAmount}`)
      : apiBaseUrl;
    apiBaseUrl = this.hasValidValue(params.maxBillAmount)
      ? (apiBaseUrl = apiBaseUrl + `&maxBillAmount=${params.maxBillAmount}`)
      : apiBaseUrl;
    apiBaseUrl = this.hasValidValue(params.adjustmentIndicator)
      ? apiBaseUrl + `&adjustmentIndicator=${params.adjustmentIndicator}`
      : apiBaseUrl;
    if (params.paymentStatus.length) {
      params.paymentStatus.forEach(key => {
        apiBaseUrl = apiBaseUrl + `&paymentStatus=${key.english}`;
      });
    }
    return this.http.get<BillHistoryWrapper>(apiBaseUrl);
  }
  /**
   * This method is to get Account Summary details
   * @param startDate
   * @param admin
   * @param idNumber
   */
  getAccountSummary(startDate: string, admin: boolean, idNumber?: number): Observable<BalanceSummary[]> {
    let accountSummary = '';

    if (this.appToken === ApplicationTypeEnum.PUBLIC && admin) {
      accountSummary = `/api/v1/establishment/bill/${idNumber}/account-summary?startDate=${startDate}`;
    } else if (this.appToken === ApplicationTypeEnum.PUBLIC && !admin) {
      accountSummary = `/api/v1/contributor/bill/${idNumber}/account-summary?startDate=${startDate}`;
    } else if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      accountSummary = `/api/v1/paying-establishment/${idNumber}/account-summary?startDate=${startDate}`;
    }
    return this.http
      .get<BalanceSummaryWrapper>(accountSummary)
      .pipe(map(response => this.createAccountSummaryData(response.balanceSummary)));
  }

  /**
   * This method is to create bill summary data.
   * @param list
   */
  createAccountSummaryData(list: BalanceSummary[]) {
    //Creating the summary details in the required order
    const billSummaries = [new BalanceSummary(), new BalanceSummary(), new BalanceSummary(), new BalanceSummary()];

    if (list) {
      list.forEach(balance => {
        if (balance.balanceType.toLowerCase() === BalanceType.OpeningBalance.toLowerCase()) {
          billSummaries[0] = balance;
        } else if (balance.balanceType.toLowerCase() === BalanceType.CurrentMonthAmount.toLowerCase()) {
          billSummaries[1] = balance;
        } else if (balance.balanceType.toLowerCase() === BalanceType.ReceiptsAndCredit.toLowerCase()) {
          billSummaries[2] = balance;
        } else if (balance.balanceType.toLowerCase() === BalanceType.ClosingBalance.toLowerCase()) {
          billSummaries[3] = balance;
        }
      });
    }
    return billSummaries;
  }

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

  /**
   * This method is to get contributor credit allocation details
   * @param billNo
   * @param pageNo
   * @param pageSize
   * @param regNo
   */
  getAllocationCredit(
    regNumber: number,
    billNo: number,
    pageNo: number,
    pageSize: number,
    searchKey?: string,
    filterParams?: ContributorAllocationFilterRequest,
    responsiblePayee?
  ): Observable<ContributorCreditAllocation> {
    let allocationCredit = `/api/v1/establishment/${regNumber}/bill/${billNo}/allocation?pageNo=${pageNo}&pageSize=${pageSize}&responsiblePayee=${responsiblePayee}`;
    allocationCredit = searchKey ? allocationCredit + `&searchKey=${searchKey}` : allocationCredit;
    if (filterParams !== undefined) {
      if (filterParams.minBillAmount !== undefined) {
        allocationCredit = allocationCredit + `&minDebitAmount=${filterParams.minBillAmount}`;
      }
      if (filterParams.maxBillAmount >= 0 || filterParams.maxBillAmount !== undefined) {
        allocationCredit = allocationCredit + `&maxDebitAmount=${filterParams.maxBillAmount}`;
      }
      if (filterParams.minAllocatedAmount >= 0 || filterParams.minAllocatedAmount !== undefined) {
        allocationCredit = allocationCredit + `&minAllocatedAmount=${filterParams.minAllocatedAmount}`;
      }
      if (filterParams.maxAllocatedAmount >= 0 || filterParams.maxAllocatedAmount !== undefined) {
        allocationCredit = allocationCredit + `&maxAllocatedAmount=${filterParams.maxAllocatedAmount}`;
      }
      if (filterParams.minBalanceAfterAllocation >= 0 || filterParams.minBalanceAfterAllocation !== undefined) {
        allocationCredit = allocationCredit + `&minBalanceAmount=${filterParams.minBalanceAfterAllocation}`;
      }
      if (filterParams.maxBalanceAfterAllocation >= 0 || filterParams.maxBalanceAfterAllocation !== undefined) {
        allocationCredit = allocationCredit + `&maxBalanceAmount=${filterParams.maxBalanceAfterAllocation}`;
      }
    }
    return this.http.get<ContributorCreditAllocation>(allocationCredit);
  }

  getIndividualcontributorAllocationDetails(
    regNumber: number,
    sin: string,
    billNo: number
  ): Observable<ContributorAllocationDetails> {
    const individualAllocationDetails = `/api/v1/establishment/${regNumber}/contributor/${sin}/bill/${billNo}/allocation-summary`;
    return this.http.get<ContributorAllocationDetails>(individualAllocationDetails);
  }

  // This method is used to get mof establishment allocation details *
  getMofEstablishmentAllocationDetails(
    mofRegNumber: number,
    receiptNo: number,
    pageNo: number,
    pageSize: number,
    regNumber?: number,
    filterParam?: MofAllocationBreakupFilter
  ): Observable<EstablishmentAllocationDetails> {
    let establishmentAllocationDetails = `/api/v1/paying-establishment/${mofRegNumber}/payment/${receiptNo}/receipt-breakup?pageNo=${pageNo}&pageSize=${pageSize}`;
    if (regNumber !== undefined) {
      establishmentAllocationDetails = establishmentAllocationDetails + `&registrationNo=${regNumber}`;
    }
    if (filterParam !== undefined) {
      if (filterParam.maxAmount !== null) {
        establishmentAllocationDetails =
          establishmentAllocationDetails + `&maxAllocationAmount=${filterParam.maxAmount}`;
      }
      if (filterParam.minAmount !== null) {
        establishmentAllocationDetails =
          establishmentAllocationDetails + `&minAllocationAmount=${filterParam.minAmount}`;
      }
      if (filterParam.allocationDate.startDate !== null) {
        establishmentAllocationDetails =
          establishmentAllocationDetails + `&minAllocationDate=${filterParam.allocationDate.startDate}`;
      }
      if (filterParam.allocationDate.endDate !== null) {
        establishmentAllocationDetails =
          establishmentAllocationDetails + `&maxAllocationDate=${filterParam.allocationDate.endDate}`;
      }
    }
    return this.http.get<EstablishmentAllocationDetails>(establishmentAllocationDetails);
  }
  // This method is used to get mof allocation details *
  getMofAllocationDetails(requestDetails: AllocationFilterSearch,establishmentType: string) {
    let baseUrl = `/api/v1/paying-establishment/1/allocation-summary?startDate=${requestDetails.selectedDate}&establishmentType=${establishmentType}`;
    baseUrl =
      this.hasValidValue(requestDetails.pageNo) || this.hasValidValue(requestDetails.pageSize)
        ? baseUrl + `&pageNo=${requestDetails.pageNo}&pageSize=${requestDetails.pageSize}`
        : baseUrl;
    baseUrl = this.hasValidValue(requestDetails.searchKey)
      ? baseUrl + `&searchKey=${requestDetails.searchKey}`
      : baseUrl;
    baseUrl =
      this.hasValidValue(requestDetails.minDebitAmount) || this.hasValidValue(requestDetails.maxDebitAmount)
        ? baseUrl + `&minDebitAmount=${requestDetails.minDebitAmount}&maxDebitAmount=${requestDetails.maxDebitAmount}`
        : baseUrl;
    baseUrl =
      this.hasValidValue(requestDetails.minAllocatedAmount) || this.hasValidValue(requestDetails.maxAllocatedAmount)
        ? baseUrl +
          `&minAllocatedAmount=${requestDetails.minAllocatedAmount}&maxAllocatedAmount=${requestDetails.maxAllocatedAmount}`
        : baseUrl;
    baseUrl =
      this.hasValidValue(requestDetails.minBalanceAmount) || this.hasValidValue(requestDetails.maxBalanceAmount)
        ? baseUrl +
          `&minBalanceAmount=${requestDetails.minBalanceAmount}&maxBalanceAmount=${requestDetails.maxBalanceAmount}`
        : baseUrl;
    return this.http.get<MofAllocationDetails>(baseUrl);
  }
  // This method is used to get vic bill breakup details *
  getVicBillBreakup(sinNumber: number, billNo: number): Observable<BillDetails> {
    return this.http.get<BillDetails>(`/api/v1/contributor/${sinNumber}/bill/${billNo}/bill-summary`);
  }
  /**
   * This method is to get bill number
   * @param idNumber Identification Number
   * @param admin Admin flag
   */
  getBillNumber(sinNumber: number, startDate: string, pageLoad?: boolean): Observable<BillHistoryWrapper> {
    let billHistory = `/api/v1/contributor/${sinNumber}/bill?includeBreakUp=false&startDate=${startDate}`;
    if (pageLoad) {
      billHistory = `/api/v1/contributor/${sinNumber}/bill?includeBreakUp=false&startDate=${startDate}&pageLoad=${pageLoad}`;
    }
    return this.http.get<BillHistoryWrapper>(billHistory);
  }

  getBillYearAndMonths(nin: number): Observable<BillPeriods> {
    let url = `/api/v1/contributor/${nin}/bill/bill-periods`;
    return this.http.get<BillPeriods>(url);
  }
  /**
   * Method to get receipts of the entity.
   * @param regNo registration number
   */
  getContributorAllocationDetails(
    regNumber: number,
    billNo: number,
    sin: number,
    responsiblePayee?: string
  ): Observable<ContributorAllocationDetails> {
    let allocationDetails = `/api/v1/establishment/${regNumber}/bill/${billNo}/contributor/${sin}/allocation-summary`;
    allocationDetails = responsiblePayee
      ? allocationDetails + `?responsiblePayee=${responsiblePayee}`
      : allocationDetails;
    return this.http.get<ContributorAllocationDetails>(allocationDetails);
  }
  setPreviousUrl(previousUrl: string) {
    this.previousUrl = previousUrl;
  }
  getPreviousUrl() {
    return this.previousUrl;
  }
}
