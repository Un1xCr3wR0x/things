import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText, Contributor, TransactionFeedback } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import {
  ContributorDetailsList,
  DocumentByte,
  InspectionDetails,
  OHQueryParam,
  OHRate,
  OhUpdateRequest,
  QueryParam,
  RasedDoc,
  ReinspectionRequest,
  RequiredUploadDocumentsResponse,
  SafetyCheckData,
  SafetyCheckListQuestionare,
  SafetyCheckListResponse
} from '../models';
import { getParams } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class SafetyInspectionService {
  registrationNo: number;
  estbalishmentOHRate: OHRate;
  inspectionDetails: InspectionDetails;

  constructor(readonly http: HttpClient) { }

  /**
   *
   * @param registrationNo metho to get the oh details
   * @param params
   */
  getEstablishmentOHRate(registrationNo: number, params: OHQueryParam): Observable<OHRate> {
    const httpParams = getParams(undefined, params, new HttpParams());
    const url = `/api/v1/establishment/${registrationNo}/oh-rates`;
    return this.http.get<OHRate>(url, { params: httpParams });
  }

  /**
   * Method to get inspection details
   * @param inspectionId
   */
  getEstablishmentInspectionDetails(registrationNo: number, queryParams: QueryParam[]): Observable<InspectionDetails> {
    let params = new HttpParams();
    if (queryParams) {
      queryParams.forEach(queryParam => {
        params = params.append(queryParam.queryKey, queryParam.queryValue?.toString());
      });
    }
    const url = `/api/v1/establishment/${registrationNo}/inspection-details`;
    return this.http.get<InspectionDetails>(url, { params: params });
  }

  /**
   * methid to update the OH rate
   * @param registrationNo
   * @param OHUpdateRequest
   */
  updateOHRate(registrationNo: number, OHUpdateRequest: OhUpdateRequest): Observable<TransactionFeedback> {
    const url = `/api/v1/establishment/${registrationNo}/oh-rate`;
    return this.http.put<TransactionFeedback>(url, OHUpdateRequest);
  }

  /**
   * methid to update the OH rate
   * @param registrationNo
   * @param OHUpdateRequest
   */
  createReinspection(reinspectionRequest: ReinspectionRequest): Observable<TransactionFeedback> {
    const url = `/api/v1/establishment/${reinspectionRequest.registrationNumber}/reinspection`;
    return this.http.post<TransactionFeedback>(url, reinspectionRequest);
  }

  /**
   * Method to get rsed documents
   */
  getRasedDoc(registrationNo: number): Observable<RasedDoc[]> {
    const url = '/api/v1/rased-document/SC?referenceNo=' + registrationNo;
    return this.http.get<RasedDoc[]>(url);
  }

  getDocumentByteArray(urlReq: string): Observable<DocumentByte> {
    const url = '/api/v1/rased-document/SC/doc-byte?url=' + urlReq;
    return this.http.get<DocumentByte>(url);
  }
  /**
   * Method to get required upload documents
   * @param inspectionId
   */
  getRequiredUploadDocuments(
    registrationNo: number,
    queryParams: QueryParam[]
  ): Observable<RequiredUploadDocumentsResponse> {
    let params = new HttpParams();
    queryParams.forEach(queryParam => {
      params = params.append(queryParam.queryKey, queryParam.queryValue.toString());
    });
    const url = `/api/v1/establishment/${registrationNo}/rased-documents`;
    return this.http.get<RequiredUploadDocumentsResponse>(url, { params });
  }

  /** This method is used to get contributor details using social insurance number */
  getContributorBySin(socialinsuranceNo: number): Observable<Contributor> {
    const url = `/api/v1/contributor/${socialinsuranceNo}`;
    return this.http.get<Contributor>(url);
  }

  /**
   * Method to get the contributor under the establishment
   * @param regNo
   * @param sin
   */
  getContributorWithRegNo(regNo: number, sin: number): Observable<Contributor> {
    const url = `/api/v1/establishment/${regNo}/contributor/${sin}`;
    return this.http.get<Contributor>(url);
  }

  /**
   * method to save the uploaded documents
   * @param registrationNo
   * @param fieldActivityNo
   * @param contributors
   * @param referenceNo
   */
  saveUploadedDocuments(
    registrationNo: number,
    fieldActivityNo: string,
    contributors: ContributorDetailsList[],
    referenceNo: number
  ): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/rased-documents`;
    const request = {
      contributorDetails: contributors.map(contributor => {
        if (contributor?.partyId) {
          return {
            socialInsuranceNo: contributor?.partyId.toString()
          }
        }
        else {
          return {
            socialInsuranceNo: contributor?.nationalId.toString()
          }
        };
      }),
      fieldActivityNo: fieldActivityNo,
      referenceNo: referenceNo
    };
    return this.http.put<BilingualText>(url, request);
  }
  submitSafetyCheckTransaction(estRegNo: number, evaluationReason: string): Observable<TransactionFeedback> {
    const url = `/api/v1/establishment/${estRegNo}/safety-check-request`;
    const data = {
      evaluationReason: evaluationReason
    };
    return this.http.post<TransactionFeedback>(url, data);
  }
  /**
   * Method to get the admin safety check list
   */
  getSafetyCheckList(regNo: number, referenceNo?: number): Observable<SafetyCheckListQuestionare> {
    let params = new HttpParams();
    if (referenceNo > 0) {
      params = getParams('referenceNo', referenceNo, params);
    }
    const url = `/api/v1/establishment/${regNo}/safety-checklist`;
    return this.http.get<SafetyCheckListQuestionare>(url, { params });
  }

  /**
   * Method to get the admin safety check list
   */
  getEstablishmentSafetyData(
    regNo: number,
    referenceNo?: number,
    getTransactionSpecificData = false
  ): Observable<SafetyCheckData> {
    // let params = new HttpParams();
    // if (referenceNo > 0) {
    //   params = getParams('referenceNo', referenceNo, params);
    // }
    let url = `/api/v1/establishment/${regNo}/safety-check/${referenceNo}`;
    if (getTransactionSpecificData) {
      url += `?isLatestSubmission=true`;
    }
    return this.http.get<SafetyCheckData>(url);
  }
  /**
   * Method to save the admin safety check list entries
   */
  saveSafetyCheckList(
    regNo: number,
    responseData: SafetyCheckListResponse,
    isSubmit = false
  ): Observable<TransactionFeedback> {
    const url = `/api/v1/establishment/${regNo}/safety-check-request/${responseData?.referenceNumber}/submit?isFinalSubmit=${isSubmit}`;
    return this.http.put<TransactionFeedback>(url, responseData);
  }
}
