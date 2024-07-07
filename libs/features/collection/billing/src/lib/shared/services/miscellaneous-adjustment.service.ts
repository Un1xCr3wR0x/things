import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MiscellaneousRequest, ItemizedMiscResponse, ItemizedMiscRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MiscellaneousAdjustmentService {
  constructor(readonly http: HttpClient) {}

  revertAdjustmentDocumentDetails(registrationNo: number, requestNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/credit-refund/${requestNo}/revert`;
    return this.http.put<number>(url, null);
  }
  /**
   * This method is to save credit refund
   * @param registrationNo registration No
   */
  submitMiscellaneousDetails(registrationNo: number, miscellaneousRequest: MiscellaneousRequest) {
    const url = `/api/v1/establishment/${registrationNo}/misc-adjustment`;
    return this.http.post<MiscellaneousRequest>(url, miscellaneousRequest);
  }

  /**
   * This method is to save credit refund
   * @param registrationNo registration No
   */
  updateMiscellaneousDetails(
    registrationNo: number,
    referenceNumber: number,
    miscellaneousRequest: MiscellaneousRequest
  ) {
    const url = `/api/v1/establishment/${registrationNo}/misc-adjustment/${referenceNumber}`;
    return this.http.put<MiscellaneousRequest>(url, miscellaneousRequest);
  }

  /** This Method is to get MS adjustment data for view*/
  getValidatorMiscellaneousDetails(registrationNo: number, referenceNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/misc-adjustment/${referenceNo}`;
    return this.http.get<MiscellaneousRequest>(url);
  }

  /** This Method is to get processed misc to view in detaild bill */
  getMiscProcessedAdjustment(registrationNo: number, itemizedMiscRequest: ItemizedMiscRequest) {
    const url = `/api/v1/establishment/${registrationNo}/misc-adjustment/processed-adjustments`;
    return this.http.put<ItemizedMiscResponse>(url, itemizedMiscRequest);
  }

  /** This Method is to revert adjustment details */
  revertAdjustmentDetails(registrationNo: number, referenceNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/misc-adjustment/${referenceNo}/revert`;
    return this.http.put<number>(url, null);
  }
}
