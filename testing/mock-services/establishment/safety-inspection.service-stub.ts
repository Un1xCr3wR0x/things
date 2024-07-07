import { Injectable } from '@angular/core';
import {
  DocumentByte,
  OHQueryParam,
  OhUpdateRequest,
  QueryParam,
  RasedDoc,
  ReinspectionRequest,
  SafetyInspectionService
} from '@gosi-ui/features/establishment';
import { of, throwError } from 'rxjs';
import { genericError, genericOhRateResponse } from 'testing';
import {
  contributorData,
  genericInspectionResponse,
  requiredUploadDocumentResponseMock,
  transactionFeedbackMockData
} from 'testing/test-data';

@Injectable()
export class SafetyInspectionStubService extends SafetyInspectionService {
  getEstablishmentOHRate(regNo: number, params: OHQueryParam) {
    if (regNo || params) {
      return of(genericOhRateResponse);
    } else {
      return throwError(genericError);
    }
  }

  getEstablishmentInspectionDetails(registrationNo: number, queryParams: QueryParam[]) {
    if (queryParams.length > 0) {
      return of(genericInspectionResponse);
    } else {
      return throwError(genericError);
    }
  }

  getRequiredUploadDocuments(registrationNo: number, queryParams: QueryParam[]) {
    if (queryParams.length > 0) {
      return of(requiredUploadDocumentResponseMock);
    } else {
      return throwError(genericError);
    }
  }

  getDocumentByteArray(urlReq) {
    if (urlReq) {
      return of(new DocumentByte());
    } else {
      return throwError(genericError);
    }
  }

  updateOHRate(registrationNo: number, OHUpdateRequest: OhUpdateRequest) {
    if (registrationNo || OHUpdateRequest) {
      return of(transactionFeedbackMockData);
    } else {
      return throwError(genericError);
    }
  }
  createReinspection(reinspectionRequest: ReinspectionRequest) {
    if (reinspectionRequest) {
      return of(transactionFeedbackMockData);
    } else {
      return throwError(genericError);
    }
  }
  getContributorBySin(socialinsuranceNo: number) {
    if (socialinsuranceNo) {
      return of(contributorData);
    } else {
      return throwError(genericError);
    }
  }

  getRasedDoc() {
    return of([new RasedDoc()]);
  }
}
