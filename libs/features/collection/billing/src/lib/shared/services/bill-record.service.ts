/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, Environment, EnvironmentToken } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillRecords, DebitCreditDetails } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BillRecordService {
  baseUrlPrivate = this.environment.simisDenodoUrl; //'http://10.4.130.176:9090';
  baseUrlPublic = this.environment.simisDenodoUrl;
  /**
   *
   * @param http
   */
  constructor(
    readonly http: HttpClient,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(EnvironmentToken) private environment: Environment
  ) {}
  /**
   * Method to get the old records
   * @param registrationNo
   */
  getRecords(registrationNo: number) {
    const url =
      this.appToken === ApplicationTypeEnum.PRIVATE
        ? `/api/v1/em_virtual_visit_proxy/server/customer360/bv_establishment_details/views/bv_establishment_details?$filter="P_REGISTRATIONNUMBER"+in+${registrationNo}`
        : `/api/v1/em_virtual_visit_proxy/server/customer360/bv_establishment_details/views/bv_establishment_details?$filter="P_REGISTRATIONNUMBER"+in+${registrationNo}`;
    return this.http.get<BillRecords>(url).pipe(map(res => res.elements));
  }
  /**
   * Method to get the account details
   * @param mappingId
   */
  getAccountRecords(mappingId: number): Observable<DebitCreditDetails> {
    const url =
      this.appToken === ApplicationTypeEnum.PRIVATE
        ? `/api/v1/em_virtual_visit_proxy/server/customer360/bv_monthly_debit_credit_details/views/bv_monthly_debit_credit_details?$filter="P_ESTACCMAPPINGID"+in+${mappingId}`
        : `/api/v1/em_virtual_visit_proxy/server/customer360/bv_monthly_debit_credit_details/views/bv_monthly_debit_credit_details?$filter="P_ESTACCMAPPINGID"+in+${mappingId}`;
    return this.http.get<BillRecords>(url).pipe(map(res => res.elements[0]));
  }
  /**
   * Method to get the receipt details
   * @param mappingId
   */
  getReceiptsRecords(mappingId: number) {
    const url =
      this.appToken === ApplicationTypeEnum.PRIVATE
        ? `/api/v1/em_virtual_visit_proxy/server/customer360/bv_receipts_of_month/views/bv_receipts_of_month?$filter="P_ESTACCMAPPINGID"+in+${mappingId}`
        : `/api/v1/em_virtual_visit_proxy/server/customer360/bv_receipts_of_month/views/bv_receipts_of_month?$filter="P_ESTACCMAPPINGID"+in+${mappingId}`;
    return this.http.get<BillRecords>(url).pipe(map(res => res.elements));
  }
  /**
   * Method to get the wage details
   * @param mappingId
   */
  getWageRecords(mappingId: number) {
    const url =
      this.appToken === ApplicationTypeEnum.PRIVATE
        ? `/api/v1/em_virtual_visit_proxy/server/customer360/bv_monthly_debit_credit_details/views/bv_monthly_debit_credit_details?$filter="P_ESTACCMAPPINGID"+in+${mappingId}`
        : `/api/v1/em_virtual_visit_proxy/server/customer360/bv_monthly_debit_credit_details/views/bv_monthly_debit_credit_details?$filter="P_ESTACCMAPPINGID"+in+${mappingId}`;

    return this.http.get<BillRecords>(url).pipe(map(res => res.elements[0]));
  }
  /**
   * Method to get the allocation details
   * @param mappingId
   */
  getAllocationRecords(mappingId: number) {
    const url =
      this.appToken === ApplicationTypeEnum.PRIVATE
        ? `/api/v1/em_virtual_visit_proxy/server/customer360/bv_monthly_debit_credit_details/views/bv_monthly_debit_credit_details?$filter="P_ESTACCMAPPINGID"+in+${mappingId}`
        : `/api/v1/em_virtual_visit_proxy/server/customer360/bv_monthly_debit_credit_details/views/bv_monthly_debit_credit_details?$filter="P_ESTACCMAPPINGID"+in+${mappingId}`;

    return this.http.get<BillRecords>(url).pipe(map(res => res.elements[0]));
  }
  /**
   * Method to get the adjustment records
   * @param mappingId
   */
  getAdjustmentDetails_s2(mappingId: number) {
    const url =
      this.appToken === ApplicationTypeEnum.PRIVATE
        ? `${this.baseUrlPrivate}/server/customer360/bv_adjustment_details_s2/views/bv_adjustment_details_s2?%24filter="P_ESTACCMAPPINGID"+in+${mappingId}`
        : `${this.baseUrlPublic}/server/customer360/bv_adjustment_details_s2/views/bv_adjustment_details_s2?%24filter="P_ESTACCMAPPINGID"+in+${mappingId}`;

    return this.http.get<BillRecords>(url).pipe(map(res => res.elements));
  }
  /**
   * Method to get the adjustment details
   * @param mappingId
   */
  getAdjustmentType_s001(mappingId: number) {
    const url =
      this.appToken === ApplicationTypeEnum.PRIVATE
        ? `${this.baseUrlPrivate}/server/customer360/bv_adjustment_details_adj_type_1001/views/bv_adjustment_details_adj_type_1001?%24filter="P_ESTACCMAPPINGID"+in+${mappingId}`
        : `${this.baseUrlPublic}/server/customer360/bv_adjustment_details_adj_type_1001/views/bv_adjustment_details_adj_type_1001?%24filter="P_ESTACCMAPPINGID"+in+${mappingId}`;
    return this.http.get<BillRecords>(url).pipe(map(res => res.elements));
  }
  getAdjustmentType_s002(mappingId: number) {
    const url =
      this.appToken === ApplicationTypeEnum.PRIVATE
        ? `${this.baseUrlPrivate}/server/customer360/bv_adjustment_details_adj_type_1002/views/bv_adjustment_details_adj_type_1002?%24filter="P_ESTACCMAPPINGID"+in+${mappingId}`
        : `${this.baseUrlPublic}/server/customer360/bv_adjustment_details_adj_type_1002/views/bv_adjustment_details_adj_type_1002?%24filter="P_ESTACCMAPPINGID"+in+${mappingId}`;
    return this.http.get<BillRecords>(url).pipe(map(res => res.elements));
  }
  getAdjustmentType_s0034(mappingId: number) {
    const url =
      this.appToken === ApplicationTypeEnum.PRIVATE
        ? `${this.baseUrlPrivate}/server/customer360/bv_adjustment_details_adj_type_1004_1003/views/bv_adjustment_details_adj_type_1004_1003?%24filter="P_ESTACCMAPPINGID"+in+${mappingId}`
        : `${this.baseUrlPublic}server/customer360/bv_adjustment_details_adj_type_1004_1003/views/bv_adjustment_details_adj_type_1004_1003?%24filter="P_ESTACCMAPPINGID"+in+${mappingId}`;
    return this.http.get<BillRecords>(url).pipe(map(res => res.elements));
  }
  /**
   * Method to get the adjustment total
   * @param mappingId
   */
  getAdjustmentTotal(mappingId: number) {
    const url =
      this.appToken === ApplicationTypeEnum.PRIVATE
        ? `${this.baseUrlPrivate}/server/customer360/bv_adjustment_total/views/bv_adjustment_total?$filter="P_ESTACCMAPPINGID"+in+${mappingId}`
        : `/api/v1/em_virtual_visit_proxy/server/customer360/bv_adjustment_total/views/bv_adjustment_total?$filter="P_ESTACCMAPPINGID"+in+${mappingId}`;

    return this.http.get<BillRecords>(url).pipe(map(res => res.elements));
  }
}
