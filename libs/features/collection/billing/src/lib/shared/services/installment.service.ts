import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { InstallmentDetails } from '../models/installemt-details';
import { InstallmentRequest } from '../models/installment-request';
import { InstallmentSummary, InstallmentHistory } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InstallmentService {
  registrationNo;
  installmentId;
  /**
   * Creates an instance of InstallmentService
   * @param http HttpClient
   */
  constructor(readonly http: HttpClient) {}
  /**
   *  This method is to Get Establishment Installment Details
   * @param RegistrationNumber
   */
  getInstallmentDetails(
    registrationNo: number,
    guaranteeType?: BilingualText,
    guarantee?: string
  ): Observable<InstallmentDetails> {
    let getInstallmentUrl = `/api/v1/establishment/${registrationNo}/installment-quote`;
    if (guaranteeType && guarantee) {
      getInstallmentUrl = getInstallmentUrl + `?guaranteeCategory=${guarantee}&guaranteeType=${guaranteeType.english}`;
    }
    return this.http.get<InstallmentDetails>(getInstallmentUrl);
  }
  /**
   * This method is to fetch the  Installment
   * @param RegistrationNumber
   * @memberof EstablishmentService
   */
  getInstallmentactive(registrationNo: number, active = false): Observable<InstallmentHistory> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/installment?active=${active}`;
    return this.http.get<InstallmentHistory>(getEstablishmentUrl);
  }
  /** This method is to fetch the installment details by installment id */
  getInstallmentDetailsById(regNo, installmentId): Observable<InstallmentSummary> {
    const installmentDetailsUrl = `/api/v1/establishment/${regNo}/installment/${installmentId}`;
    return this.http.get<InstallmentSummary>(installmentDetailsUrl);
  }
  /**
   * This method is to save credit refund
   * @param registrationNo registration No
   */
  submitInstallmentDetails(registrationNo: number, installmentRequest: InstallmentRequest) {
    const url = `/api/v1/establishment/${registrationNo}/installment`;
    return this.http.post<InstallmentRequest>(url, installmentRequest);
  }

  getValidatorInstallmentDetails(registrationNo: number, installmentNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/installment/${installmentNo}`;
    return this.http.get<InstallmentRequest>(url);
  }
  /**
   * This method is to revert installment details
   */
  revertInstallmentDetails(registrationNo: number, installmentId: number) {
    const url = `/api/v1/establishment/${registrationNo}/installment/${installmentId}/revert`;
    return this.http.put<number>(url, null);
  }
  /**
   * This method is to update installemnt details
   */
  updateInstallmentDetails(registrationNo: number, installmentRequest: InstallmentRequest, installmentNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/installment/${installmentNo}`;
    return this.http.put<InstallmentRequest>(url, installmentRequest);
  }
  /**
   * Setter method for registration number
   */
  public set setRegistrationNo(regNo) {
    this.registrationNo = regNo;
  }

  /**
   * Getter method for registration number
   */
  public get getRegistrationNo() {
    return this.registrationNo;
  }
  /**
   * Setter method for registration number
   */
  public set setInstallmentId(id) {
    this.installmentId = id;
  }
  /**
   * Getter method for registration number
   */
  public get getInstallmentId() {
    return this.installmentId;
  }
}
