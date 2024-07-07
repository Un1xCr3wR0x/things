import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemizedGovernmentReceiptsRequest } from '../models/Itemized-government-receipts-request';
import { ItemizedGovernmentReceiptsResponse } from '../models/Itemized-government-receipts-response';
import { RecordGovernmentPaymentResponse } from '../models/record-government-payment-response';

@Injectable({
  providedIn: 'root'
})
export class RecordGovernmentReceiptsService {
  constructor(readonly http: HttpClient) {}

  getUploadedReceipts(pageNo, pageSize, refrenceNo) {
    let url = `/api/v1/uploadReceipt?pageNo=${pageNo}&pageSize=${pageSize}`;
    if (refrenceNo) {
      url = url + `&referenceNo=${refrenceNo}`;
      return this.http.get<ItemizedGovernmentReceiptsResponse>(url);
    } else {
      return this.http.get<ItemizedGovernmentReceiptsResponse>(url);
    }
  }

  uploadReceipts(receipts) {
    let url = `/api/v1/uploadReceipt`;
    return this.http.post(url, receipts, { responseType: 'text' });
  }
}
