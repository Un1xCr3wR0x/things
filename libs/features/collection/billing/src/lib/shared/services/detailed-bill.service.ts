import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BillDetails,
  BillHistoryWrapper,
  EstablishmentHeader,
  ItemizedAdjustmentWrapper,
  RequestList,
  ContributionDetailedBill,
  FilterParams,
  ReceiptWrapper,
  ItemizedContributionMonthWrapper,
  PaymentDetails,
  AllocationDetails,
  ItemizedCreditRefund,
  ItemizedRejectedOHWrapper,
  ChangeEngagement,
  ItemizedInstallmentWrapper,
  DetailedBillViolationDetails
} from '../models';
import { CreditTransferWrapper } from '../models/credit-tansfer-wrapper';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { convertToYYYYMMDD } from '@gosi-ui/core';
import { MofItemizedContributionFilter } from '../models/mof-itemized-contribution-filter';
import { ItemizedLateFeeWrapper } from '../models/itemized-late-fee-wrapper';
import { ItemizedBillCreditAdjustmentWrapper } from '../models/itemized-bill-credit-adjustment-wrapper';
import { LateFeeWaiveOff } from '../models/late-fee-waiveoff';
import {
  MedicalInsuranceBeneficiaryDetailsWrapper
} from "@gosi-ui/features/collection/billing/lib/shared/models/medical-insurance-beneficiary-details-wrapper";
import {
  MedicalInsuranceBeneficiaryDetails
} from "@gosi-ui/features/collection/billing/lib/shared/models/medical-insurance-beneficiary-details";

@Injectable({
  providedIn: 'root'
})
export class DetailedBillService {
  receipts: string;
  /*** Creates an instance of DetailedBillService   */
  constructor(readonly http: HttpClient) {}
  /*** This method is to get Bill Breakup details*/
  getBillBreakup(regNumber: number, billNo: number, startDate: string, entityType: string): Observable<BillDetails> {
    if (regNumber !== null) {
      return this.http.get<BillDetails>(
        `/api/v1/establishment/${regNumber}/bill/${billNo}/bill-summary?startDate=${startDate}&entityType=${entityType}`
      );
    }
  }
  /*** This method is to get bill number*/
  getBillNumber(registerNo: number, startDate: string, pageLoad?: boolean): Observable<BillHistoryWrapper> {
    let billHistory = `/api/v1/establishment/${registerNo}/bill?includeBreakUp=false&startDate=${startDate}`;
    if (pageLoad) {
      billHistory = `/api/v1/establishment/${registerNo}/bill?includeBreakUp=false&startDate=${startDate}&pageLoad=${pageLoad}`;
    }
    return this.http.get<BillHistoryWrapper>(billHistory).pipe(map(res => res));
  }
  /*** This method is to get bill number*/
  getBillOnMonthChanges(registerNo: number, startDate: string, pageLoad?: boolean): Observable<BillHistoryWrapper> {
    let billHistory = `/api/v1/establishment/${registerNo}/bill?includeBreakUp=false&startDate=${startDate}`;
    if (pageLoad) {
      billHistory = `/api/v1/establishment/${registerNo}/bill?includeBreakUp=false&startDate=${startDate}&pageLoad=${pageLoad}`;
    }
    return this.http.get<BillHistoryWrapper>(billHistory).pipe(map(res => res));
  }

  /*** This method is to get Billing Header details*/
  getBillingHeader(idNumber: number, admin: boolean): Observable<EstablishmentHeader> {
    let billingHeader = '';
    if (admin && idNumber !== null) {
      billingHeader = `/api/v1/establishment/${idNumber}`;
    } /* else {
      billingHeader = ``;
    } */
    return this.http.get<EstablishmentHeader>(billingHeader);
  }
  /*** This method is to get adjustment itemized details.*/
  getItemizedDebitAdjustment(
    regNo: number,
    billNo: number,
    pageNo: number,
    pageSize: number,
    type: string,
    entityType: string,
    searchKey?: string,
    filterSearchDetails?: RequestList
  ): Observable<ItemizedAdjustmentWrapper> {
    let receiptAndCreditsDetailedBill = `/api/v1/establishment/${regNo}/bill/${billNo}/bill-item/adjustment?pageNo=${pageNo}&pageSize=${pageSize}&type=${type}&responsiblePayee=${entityType}`;

    if (filterSearchDetails.sort.column !== undefined) {
      receiptAndCreditsDetailedBill = receiptAndCreditsDetailedBill + `&sortBy=${filterSearchDetails.sort.column}`;
    }

    if (filterSearchDetails.sort.direction !== undefined) {
      receiptAndCreditsDetailedBill =
        receiptAndCreditsDetailedBill + `&sortOrder=${filterSearchDetails.sort.direction}`;
    }
    if (searchKey !== undefined) {
      receiptAndCreditsDetailedBill = receiptAndCreditsDetailedBill + `&searchKey=${searchKey}`;
    }
    if (filterSearchDetails.maxContributoryWage !== undefined || filterSearchDetails.maxContributoryWage >= 0) {
      receiptAndCreditsDetailedBill =
        receiptAndCreditsDetailedBill + `&maxContributoryWage=${filterSearchDetails.maxContributoryWage}`;
    }
    if (filterSearchDetails.minContributoryWage !== undefined || filterSearchDetails.minContributoryWage >= 0) {
      receiptAndCreditsDetailedBill =
        receiptAndCreditsDetailedBill + `&minContributoryWage=${filterSearchDetails.minContributoryWage}`;
    }
    if (filterSearchDetails.maxTotal !== undefined || filterSearchDetails.maxTotal >= 0) {
      receiptAndCreditsDetailedBill = receiptAndCreditsDetailedBill + `&maxTotal=${filterSearchDetails.maxTotal}`;
    }
    if (filterSearchDetails.minTotal !== undefined || filterSearchDetails.minTotal >= 0) {
      receiptAndCreditsDetailedBill = receiptAndCreditsDetailedBill + `&minTotal=${filterSearchDetails.minTotal}`;
    }
    if (filterSearchDetails.period.startDate !== undefined) {
      receiptAndCreditsDetailedBill =
        receiptAndCreditsDetailedBill + `&minPeriodFrom=${filterSearchDetails.period.startDate}`;
    }
    if (filterSearchDetails.period.endDate !== undefined) {
      receiptAndCreditsDetailedBill =
        receiptAndCreditsDetailedBill + `&maxPeriodFrom=${filterSearchDetails.period.endDate}`;
    }
    if (filterSearchDetails.saudiPerson !== undefined) {
      receiptAndCreditsDetailedBill = receiptAndCreditsDetailedBill + `&saudiPerson=${filterSearchDetails.saudiPerson}`;
    }
    return this.http.get<ItemizedAdjustmentWrapper>(receiptAndCreditsDetailedBill);
  }
  /**
   * This method is to get contribution itemized details.
   * @param billNo
   * @param pageNo
   * @param pageSize
   * @param regNo
   */
  getItemizedContribution(
    regNo: number,
    billNo: number,
    pageNo: number,
    pageSize: number,
    entityType: string,
    sortBy: string,
    sortOrder: string,
    searchKey: RequestList
  ): Observable<ContributionDetailedBill> {
    let contributionDetailedBill = `/api/v1/establishment/${regNo}/bill/${billNo}/bill-item/contribution?pageNo=${pageNo}&pageSize=${pageSize}&responsiblePayee=${entityType}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    if (searchKey.search !== undefined) {
      contributionDetailedBill = contributionDetailedBill + `&searchKey=${searchKey.search}`;
    }
    if (searchKey.maxContributionUnit !== undefined) {
      contributionDetailedBill = contributionDetailedBill + `&maxContributionUnit=${searchKey.maxContributionUnit}`;
    }
    if (searchKey.minContributionUnit !== undefined) {
      contributionDetailedBill = contributionDetailedBill + `&minContributionUnit=${searchKey.minContributionUnit}`;
    }
    if (searchKey.maxContributoryWage !== undefined) {
      contributionDetailedBill = contributionDetailedBill + `&maxContributoryWage=${searchKey.maxContributoryWage}`;
    }
    if (searchKey.minContributoryWage !== undefined) {
      contributionDetailedBill = contributionDetailedBill + `&minContributoryWage=${searchKey.minContributoryWage}`;
    }
    if (searchKey.maxTotal !== undefined) {
      contributionDetailedBill = contributionDetailedBill + `&maxTotal=${searchKey.maxTotal}`;
    }
    if (searchKey.minTotal !== undefined) {
      contributionDetailedBill = contributionDetailedBill + `&minTotal=${searchKey.minTotal}`;
    }
    if (searchKey.saudiPerson !== undefined) {
      contributionDetailedBill = contributionDetailedBill + `&saudiPerson=${searchKey.saudiPerson}`;
    }
    return this.http.get<ContributionDetailedBill>(contributionDetailedBill);
  }
  /**
   * Method to get receipts of the entity.
   * @param regNo registration number   : Observable<ItemizedBillCreditAdjustmentWrapper>
   */
  getCreditAdjustment(
    establishmentType: string,
    regNo: number,
    startDate: string,
    pageNo: number,
    pageSize: number
  ): Observable<ItemizedBillCreditAdjustmentWrapper> {
    const url = `/api/v1/paying-establishment/${regNo}/itemized-credit-adjustment?pageNo=${pageNo}&pageSize=${pageSize}&startDate=${startDate}&establishmentType=${establishmentType}`;
    return this.http
      .get<ItemizedBillCreditAdjustmentWrapper>(url)
      .pipe(map((response: ItemizedBillCreditAdjustmentWrapper) => response));
  }
  /**
   * Method to get receipts of the entity.
   * @param regNo registration number   : Observable<ItemizedBillCreditAdjustmentWrapper>
   */
  getDebitAdjustment(
    establishmentType: string,
    billStartDate: string,
    pageNo: number,
    pageSize: number
  ): Observable<ItemizedBillCreditAdjustmentWrapper> {
    const mofId = 1;
    const url = `/api/v1/paying-establishment/${mofId}/itemized-debit-adjustment?pageNo=${pageNo}&pageSize=${pageSize}&startDate=${billStartDate}&establishmentType=${establishmentType}`;
    return this.http
      .get<ItemizedBillCreditAdjustmentWrapper>(url)
      .pipe(map((response: ItemizedBillCreditAdjustmentWrapper) => response));
  }
  /**
   * Method to get receipts of the entity.
   * @param regNo registration number
   */
  getReceipts(    
    regNo: number,
    filterParams: FilterParams,
    entityType: string,
    pageNo: number,
    pageSize: number,
    isMofReceiptFlag?: boolean,
    sortBy?: string,
    sortOrder?: string,
    establishmentType?: string,
    isParam?: boolean
      ): Observable<ReceiptWrapper> {
    const receipt = this.getReceipt(
      establishmentType,
      regNo,
      filterParams,
      entityType,
      pageNo,
      pageSize,
      isMofReceiptFlag,
      sortBy,
      sortOrder,
      isParam
    );
    return this.http.get<ReceiptWrapper>(receipt).pipe(map((response: ReceiptWrapper) => response));
  }
  /**
   * Method to get the query params
   * @param regNo
   * @param admin
   * @param filterParams
   */
  getReceipt(
    establishmentType: string,
    regNo: number,
    filterParams: FilterParams,
    entityType: string,
    pageNo: number,
    pageSize: number,
    isMofReceiptFlag: boolean,
    sortBy: string,
    sortOrder: string,
    isParam: boolean
  ) {
    
    // const entityType = isMofReceiptFlag ? 'THIRD_PARTY' : 'ESTABLISHMENT';
    if(isParam) {
      this.receipts = `/api/v1/paying-establishment/${regNo}/payment?pageNo=${pageNo}&pageSize=${pageSize}&establishmentType=${establishmentType}`;
    } else this.receipts = `/api/v1/paying-establishment/${regNo}/payment?pageNo=${pageNo}&pageSize=${pageSize}`;
  if( !isMofReceiptFlag )
      this.receipts =  `/api/v1/establishment/${regNo}/payment?pageNo=${pageNo}&pageSize=${pageSize}&responsiblePayee=${entityType}`;
    if (filterParams.receiptFilter.approvalStatus) {
      filterParams.receiptFilter.approvalStatus.forEach(key => {
       this.receipts = this.receipts + `&approvalStatus=${key.english}`;
              });
    }
    if (filterParams.receiptFilter.endDate) {
      const endDate = convertToYYYYMMDD(String(filterParams.receiptFilter.endDate.gregorian));
      this.receipts =this.receipts + `&endDate=${endDate}`;
          }
    if (filterParams.receiptFilter.receiptDate.endDate) {
      const receiptEndDate = filterParams.receiptFilter.receiptDate.endDate;
      this.receipts =this.receipts + `&receiptEndDate=${receiptEndDate}`;
          }

    if (filterParams.receiptFilter.minAmount !== undefined) {
      this.receipts =this.receipts + `&maxAmount=${filterParams.receiptFilter.maxAmount}`;
          }
    if (filterParams.receiptFilter.minAmount !== undefined) {
      this.receipts =this.receipts + `&minAmount=${filterParams.receiptFilter.minAmount}`;
          }
    if (filterParams.receiptFilter.receiptMode) {
      filterParams.receiptFilter.receiptMode.forEach(key => {
        this.receipts =this.receipts + `&receiptMode=${key.english}`;
              });
    }
    if (filterParams.receiptFilter.startDate) {
      const startDate = convertToYYYYMMDD(String(filterParams.receiptFilter.startDate.gregorian));
      this.receipts =this.receipts + `&startDate=${startDate}`;
          }
    if (filterParams.receiptFilter.receiptDate.startDate) {
      const receiptStartDate = filterParams.receiptFilter.receiptDate.startDate;
      this.receipts =this.receipts + `&receiptStartDate=${receiptStartDate}`;
          }

    if (filterParams.receiptFilter.status) {
      filterParams.receiptFilter.status.forEach(key => {
        this.receipts =this.receipts + `&status=${key.english}`;
              });
    }
    if (filterParams.parentReceiptNo) {
      this.receipts =this.receipts + `&receiptNo=${filterParams.parentReceiptNo}`;
          }
    if (sortBy !== undefined) {
      this.receipts =this.receipts+ `&sortBy=${sortBy}`;
          }
    if (sortOrder !== undefined)this.receipts =this.receipts + `&sortOrder=${sortOrder}`;
    return this.receipts;
  }
  /**
   * Method to get the query params
   * @param regNo
   * @param admin
   * @param filterParams
   */
  getVicReceiptList(
    sinNo: number,
    filterParams?: FilterParams,
    pageNo?: number,
    pageSize?: number,
    sortBy?: string,
    sortOrder?: string
  ) {
    let vicReceiptList = `/api/v1/contributor/${sinNo}/payment?pageNo=${pageNo}&pageSize=${pageSize}`;
    if (filterParams.receiptFilter.receiptDate.endDate) {
      const receiptEndDate = filterParams.receiptFilter.receiptDate.endDate;
      vicReceiptList = vicReceiptList + `&receiptEndDate=${receiptEndDate}`;
    }
    if (filterParams.receiptFilter.minAmount !== undefined) {
      vicReceiptList = vicReceiptList + `&maxAmount=${filterParams.receiptFilter.maxAmount}`;
    }
    if (filterParams.receiptFilter.minAmount !== undefined) {
      vicReceiptList = vicReceiptList + `&minAmount=${filterParams.receiptFilter.minAmount}`;
    }
    if (filterParams.receiptFilter.receiptDate.startDate) {
      const receiptStartDate = filterParams.receiptFilter.receiptDate.startDate;
      vicReceiptList = vicReceiptList + `&receiptStartDate=${receiptStartDate}`;
    }
    if (filterParams.parentReceiptNo) {
      vicReceiptList = vicReceiptList + `&receiptNo=${filterParams.parentReceiptNo}`;
    }
    if (sortBy !== undefined) {
      vicReceiptList = vicReceiptList + `&sortBy=${sortBy}`;
    }
    if (sortOrder !== undefined) {
      vicReceiptList = vicReceiptList + `&sortOrder=${sortOrder}`;
    }
    return this.http.get<ReceiptWrapper>(vicReceiptList);
  }

  /**
   * This method is to get mof establishment bill details
   * @param startDate start date
   */
  getMofEstablishmentBill(startDate: string, establishmentType: string,pageLoad = false): Observable<BillDetails> {
    const itemizedBillBreakup = `/api/v1/paying-establishment/1/bill?startDate=${startDate}&pageLoad=${pageLoad}&establishmentType=${establishmentType}`;
    return this.http.get<BillDetails>(itemizedBillBreakup);
  }
  /**
   * This method is to get mof establishment bill details
   * @param startDate start date
   * @param pageNo page No
   * @param pageSize page Size
   */

  getMofContributionMonth(
    startDate: string,
    pageNo: number,
    pageSize: number,
    establishmentType: string,
    sortOrder?: string,
    sortBy?: string,
    serach?: string,
    filtertValues?: MofItemizedContributionFilter
  ): Observable<ItemizedContributionMonthWrapper> {
    let thirdPartyItemizedBillBreakDown = `/api/v1/paying-establishment/1/bill-itemized?pageNo=${pageNo}&pageSize=${pageSize}&startDate=${startDate}&sortOrder=${sortOrder}&sortBy=${sortBy}&establishmentType=${establishmentType}`;
    if (serach !== undefined) {
      thirdPartyItemizedBillBreakDown = thirdPartyItemizedBillBreakDown + `&searchKey=${serach}`;
    }
    if (filtertValues !== undefined) {
      if (filtertValues.minAnnuityAmount !== undefined) {
        thirdPartyItemizedBillBreakDown =
          thirdPartyItemizedBillBreakDown + `&minAnnuity=${filtertValues.minAnnuityAmount}`;
      }
      if (filtertValues.maxAnnuityAmount !== undefined) {
        thirdPartyItemizedBillBreakDown =
          thirdPartyItemizedBillBreakDown + `&maxAnnuity=${filtertValues.maxAnnuityAmount}`;
      }
      if (filtertValues.minUiAmount !== undefined) {
        thirdPartyItemizedBillBreakDown = thirdPartyItemizedBillBreakDown + `&minUi=${filtertValues.minUiAmount}`;
      }
      if (filtertValues.maxUiAmount !== undefined) {
        thirdPartyItemizedBillBreakDown = thirdPartyItemizedBillBreakDown + `&maxUi=${filtertValues.maxUiAmount}`;
      }
      if (filtertValues.minOhAmount !== undefined) {
        thirdPartyItemizedBillBreakDown = thirdPartyItemizedBillBreakDown + `&minOh=${filtertValues.minOhAmount}`;
      }
      if (filtertValues.maxOhAmount !== undefined) {
        thirdPartyItemizedBillBreakDown = thirdPartyItemizedBillBreakDown + `&maxOh=${filtertValues.maxOhAmount}`;
      }
      if (filtertValues.minTotalAmount !== undefined) {
        thirdPartyItemizedBillBreakDown = thirdPartyItemizedBillBreakDown + `&minTotal=${filtertValues.minTotalAmount}`;
      }
      if (filtertValues.maxTotalAmount !== undefined) {
        thirdPartyItemizedBillBreakDown = thirdPartyItemizedBillBreakDown + `&maxTotal=${filtertValues.maxTotalAmount}`;
      }
      if (filtertValues.adjustmentIndicator) {
        thirdPartyItemizedBillBreakDown =
          thirdPartyItemizedBillBreakDown + `&adjustmentIndicator=${filtertValues.adjustmentIndicator}`;
      }
    }

    return this.http.get<ItemizedContributionMonthWrapper>(thirdPartyItemizedBillBreakDown);
  }
  getVicReceiptDetList(sinNo: number, receiptNo: number): Observable<PaymentDetails> {
    const getVicReceiptDetList = `/api/v1/contributor/${sinNo}/payment/${receiptNo}`;
    return this.http.get<PaymentDetails>(getVicReceiptDetList);
  }
  /**
   * This method is to get vic credit allocation details
   * @param sinNo social insurance number
   * @param billNo bill Number
   */
  getVicCreditDetails(sinNo: number, billNo: number): Observable<AllocationDetails> {
    const getVicCreditDetails = `/api/v1/contributor/${sinNo}/bill/${billNo}/allocation-summary`;
    return this.http.get<AllocationDetails>(getVicCreditDetails);
  }
  /**
   * This method is to get contribution itemized details.
   * @param billNo
   * @param pageNo
   * @param pageSize
   * @param regNo
   */
  getItemizedLateFee(
    regNo: number,
    billNo: number,
    pageNo: number,
    pageSize: number
  ): Observable<ItemizedLateFeeWrapper> {
    const LateFeeDetailedBill = `/api/v1/establishment/${regNo}/bill/${billNo}/bill-item/lateFee?pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<ItemizedLateFeeWrapper>(LateFeeDetailedBill);
  }
  /** * This method is to get itemised  redit refund details. **/
  getItemizedCreditRefundDetails(
    regNo: number,
    pageNo: number,
    pageSize: number,
    startDate: string,
    toEntity: string
  ): Observable<ItemizedCreditRefund> {
    const LateFeeDetailedBill = `/api/v1/establishment/${regNo}/credit-refund?pageNo=${pageNo}&pageSize=${pageSize}&startDate=${startDate}&toEntity=${toEntity}`;
    return this.http.get<ItemizedCreditRefund>(LateFeeDetailedBill);
  }
  /** * This method is to get itemised  credit transfer details. **/
  getCreditTransferDetails(
    fromToIndicator: string,
    pageNo: number,
    pageSize: number,
    startDate: string,
    regNo: number,
    toEntity: string
  ): Observable<CreditTransferWrapper> {
    const url = `/api/v1/establishment/${regNo}/credit-transfer?fromToIndicator=${fromToIndicator}&pageNo=${pageNo}&pageSize=${pageSize}&startDate=${startDate}&toEntity=${toEntity}`;
    return this.http.get<CreditTransferWrapper>(url);
  }
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
  getItemizedLatefeesDetails(
    billNumber: number,
    regNo: number,
    pageNo: number,
    pageSize: number,
    isCreditAdjustment
  ): Observable<ChangeEngagement> {
    const itemizedlatefeesurl = `/api/v1/establishment/${regNo}/bill/${billNumber}/bill-item/change-engagement?isCreditAdjustment=${isCreditAdjustment}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<ChangeEngagement>(itemizedlatefeesurl);
  }
  /** * This method is to get Late Fee Wavier **/
  getLateFeeWavier(regNo: number, startDate: string): Observable<LateFeeWaiveOff> {
    const lateFeeWavier = `/api/v1/establishment/${regNo}/penalty-waiver?startDate=${startDate}`;
    return this.http.get<LateFeeWaiveOff>(lateFeeWavier);
  }
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
  getRejectedOHRecoveryDetails(
    regNo: number,
    startDate: string,
    pageNo: number,
    pageSize: number
  ): Observable<ItemizedRejectedOHWrapper> {
    const rejectedOHDRecoveryetailedBill = `/api/v1/establishment/${regNo}/oh-recovery/cancelled-item?pageNo=${pageNo}&pageSize=${pageSize}&startDate=${startDate}`;
    return this.http.get<ItemizedRejectedOHWrapper>(rejectedOHDRecoveryetailedBill);
  }

  getReceiptsBySearchCriteria(
    refrenceNo: number,
    pageNo: number,
    pageSize: number,
    isAdvancedSearch: boolean,
    filterValues: FilterParams
  ) {
    let url;
    if (!isAdvancedSearch) {
      url = `/api/v1/receipts?ReferenceNumber=${refrenceNo}&pageNo=${pageNo}&pageSize=${pageSize}`;
    } else {
      const filter = filterValues.receiptFilter;
      url = `/api/v1/receipts?ReferenceNumber=0&pageNo=${pageNo}&pageSize=${pageSize}`;
      if (filter.referenceNumber !== undefined) {
        url = url + `&referenceNo=${filter.referenceNumber}`;
      }
      if (filter.registrationNo !== undefined) {
        url = url + `&registrationNumber=${filter.registrationNo}`;
      }
      if (filter.startDate.gregorian !== undefined) {
        url = url + `&startDate=${convertToYYYYMMDD(String(filter.startDate.gregorian))}`;
      }
      if (filter.endDate.gregorian !== undefined) {
        url = url + `&endDate=${convertToYYYYMMDD(String(filter.endDate.gregorian))}`;
      }
      if (filter.minAmount !== undefined) {
        url = url + `&minAmount=${filter.minAmount}`;
      }
      if (filter.maxAmount !== undefined) {
        url = url + `&maxAmount=${filter.maxAmount}`;
      }
      if (filter.receiptMode !== undefined) {
        url = url + `&receiptMode=${filter.receiptMode}`;
      }
      if (filter.chequeNumber !== undefined) {
        url = url + `&chequeNumber=${filter.chequeNumber}`;
      }
      if (filterValues.parentReceiptNo !== undefined) {
        url = url + `&receiptNo=${filterValues.parentReceiptNo}`;
      }
    }
    return this.http.get<ReceiptWrapper>(url);
  }
  getCancledPaymentDetails(idNumber: number, startDate: string){
    const url = `/api/v1/establishment/${idNumber}/cancelled-receipt?startDate=${startDate}`;
    return this.http.get<ReceiptWrapper>(url);
  }

  getMedicalInsuranceDetails( regNo: number , startDate: string){
    const url = `/api/v1/establishment/${regNo}/medical-insurance-adjustment?startDate=${startDate}`;
    return this.http.get<MedicalInsuranceBeneficiaryDetailsWrapper>(url);
  }

}
