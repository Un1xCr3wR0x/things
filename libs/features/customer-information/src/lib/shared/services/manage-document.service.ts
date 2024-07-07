import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contract } from '../models/contract';
import { Observable } from 'rxjs';
import { DocumentUploadResponse } from '../models';
import { IndividualDocumentUploadRequest } from '@gosi-ui/features/establishment/lib/shared';

@Injectable({
  providedIn: 'root'
})
export class ManageDocumentService {
  constructor(private http: HttpClient) {}

  /**
   * Method to get the contracts
   */
  getContracts(registrationNo: string, socialInsuranceNo: number): Observable<Contract[]> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/contracts`;
    return this.http.get<Contract[]>(url);
  }

  uploadIndividualDoc(
    personIdentifier: number,
    docUploadRequest: IndividualDocumentUploadRequest
  ): Observable<DocumentUploadResponse> {
    const url = `/api/v1/person/${personIdentifier}/document-trace`;
    return this.http.put<DocumentUploadResponse>(url, docUploadRequest);
  }
}
