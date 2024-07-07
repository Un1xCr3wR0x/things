import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthTokenService, DocumentResponseWrapper, DocumentResponseItem } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { ItemizedLateFee, LateFeeReversalDetails } from '../models';
import { ViolationAdjustmentDetails } from '../models/violation-adjustment-details';
import { map } from 'rxjs/operators';
import { DocModel } from '../models/docModel';

@Injectable({
  providedIn: 'root'
})
export class ReportStatementService {
  constructor(readonly http: HttpClient, readonly tokenService: AuthTokenService) {}
  private readonly getDocumentUrl = '/api/v2/get-file/filebyname';

  /**
   * Method to generate credit refund statement report
   * @param registrationNo
   * @param socialInsuranceNo
   */
  generateCreditRefundStatement(registrationNo: number, socialInsuranceNo: number, language: string) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/credit-refund-report?language=${language}`;
    const token = this.tokenService.getAuthToken();
    return this.http.get(url, {
      responseType: 'blob',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` }
    });
  }
  /**
   *  Method to generate vic allocation statement report
   * @param sin
   * @param billnumber
   */
  generateVicAllocationReport(sin: number, billnumber: number, language: string) {
    const url = `/api/v1/contributor/${sin}/bill/${billnumber}/allocation-report?language=${language}`;
    const token = this.tokenService.getAuthToken();
    return this.http.get(url, {
      responseType: 'blob',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` }
    });
  }

  getDocumentContent(contentId: string): Observable<DocumentResponseItem> {
    const formData = { dDocName: contentId };
    return this.http.post<DocumentResponseWrapper>(this.getDocumentUrl, formData).pipe(
      map((res: DocumentResponseWrapper) => {
        const documentResponseItem = new DocumentResponseItem();
        documentResponseItem.fileName = res?.file?.name;
        documentResponseItem.content = res?.file?.content;
        documentResponseItem.id = contentId;
        return documentResponseItem;
      })
    );
  }
  /**
   * Method to download transaction
   * @param startDate
   * @param idNumber
   */
  downloadDetailedBill(
    startDate: string,
    idNumber: number,
    billNumber: number,
    isMOF,
    language: string,
    contentType: string
  ) {
    const url = isMOF
      ? `/api/v1/paying-establishment/${idNumber}/itemized-bill-report?language=${language}&startDate=${startDate}`
      : `/api/v1/establishment/${idNumber}/bill/${billNumber}/itemized-report?language=${language}`;
    const token = this.tokenService.getAuthToken();
    return this.http.get(url, {
      responseType: 'blob',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` }
    });
  }
  downloadBill(startDate: string, idNumber: number, billNumber: number, isMOF, language: string, contentType: string) {
    const url = isMOF
      ? `/api/v1/paying-establishment/${idNumber}/itemized-bill-report?language=${language}&startDate=${startDate}`
      : `/api/v1/establishment/${idNumber}/bill/${billNumber}/itemized-report-schedule?language=${language}`;
    return this.http.get<DocModel>(url);
  }
  generateVicBills(sin: number, billnumber: number, language: string) {
    const url = `/api/v1/contributor/${sin}/bill/${billnumber}/report?language=${language}`;
    const token = this.tokenService.getAuthToken();
    return this.http.get(url, {
      responseType: 'blob',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` }
    });
  }
  /**
   * Method to print transaction
   * @param receiptNumber
   * @param idNumber
   */
  generatePaymentsReport(receiptNumber: number, idNumber: number, isMOF = false, language: string) {
    const url = isMOF
      ? `/api/v1/paying-establishment/${receiptNumber}/payment/${idNumber}/payment-report?language=${language}`
      : `/api/v1/establishment/${receiptNumber}/payment/${idNumber}/payment-report?language=${language}`;
    const token = this.tokenService.getAuthToken();
    return this.http.get(url, {
      responseType: 'blob',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` }
    });
  }
  generateVicReciept(sin: number, parentReceiptNumber: number, language: string) {
    const url = `/api/v1/contributor/${sin}/payment/${parentReceiptNumber}/payment-report?language=${language}`;
    const token = this.tokenService.getAuthToken();
    return this.http.get(url, {
      responseType: 'blob',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` }
    });
  }
  /**
   * Method to download transaction
   * @param startDate
   * @param startDate
   */
  downloadAllocationBill(startDate: string, idNumber: number, billNumber: number, isMOF, language: string) {
    const url = isMOF
      ? `/api/v1/paying-establishment/${idNumber}/allocation-report?language=${language}&startDate=${startDate}`
      : `/api/v1/establishment/${idNumber}/bill/${billNumber}/allocation-report?language=${language}`;
    const token = this.tokenService.getAuthToken();
    return this.http.get(url, {
      responseType: 'blob',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` }
    });
  }
  generateBillReport(startDate: string, idNumber: number, billNumber: number, isMOF = false, language: string) {
    const url = isMOF
      ? `/api/v1/paying-establishment/${idNumber}/bill-report?language=${language}&startDate=${startDate}`
      : `/api/v1/establishment/${idNumber}/bill/${billNumber}/report?language=${language}`;
    const token = this.tokenService.getAuthToken();
    return this.http.get(url, {
      responseType: 'blob',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` }
    });
  }
  getBillingDetailsJson() {
    const Billdetails = `assets/jsons/bill-details.json`;
    return this.http.get<[]>(Billdetails);
  }
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

  /** * This method is to get Late Fee reversal **/
  getLateFeeReversalDetails(regNo: number, startDate?: string): Observable<LateFeeReversalDetails> {
    const url = `/api/v1/establishment/${regNo}/installment-compliance-waiver?startDate=${startDate}`;
    return this.http.get<LateFeeReversalDetails>(url);
  }

  /**
   * This method is to get contribution itemized details.
   * @param billNo
   * @param regNo
   */
  getItemizedLateEstFee(regNo: number, billNo: number): Observable<ItemizedLateFee> {
    const LateFeeEstDetailedBill = `/api/v1/establishment/${regNo}/bill/${billNo}/bill-item/est-latefee`;
    return this.http.get<ItemizedLateFee>(LateFeeEstDetailedBill);
  }
  getCancelPaymentLateFee(regNo: number, billNo: number): Observable<ItemizedLateFee> {
    const CancelPaymentDetailedBill = `/api/v1/establishment/${regNo}/bill/${billNo}/bill-item/cancel-receipt-latefee`;
    return this.http.get<ItemizedLateFee>(CancelPaymentDetailedBill);
  }
}
