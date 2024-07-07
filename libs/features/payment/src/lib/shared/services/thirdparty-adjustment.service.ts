import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  AdjustmentQueryParams,
  Messages,
  EligibilityDetails,
  PayeeQueryParams,
  AdjustmentDetails,
  PayeeDetails,
  PayeeDetailsWrapper,
  CreateTpaRequest,
  SaveAdjustmentResponse,
  MonthlyDeductionEligibility,
  Payment,
  BeneficiaryList
} from '../models';
import { forkJoin, Observable, of } from 'rxjs';
import {
  WorkflowService,
  AlertTypeEnum,
  Alert,
  DocumentResponseItem,
  DocumentItem,
  DocumentResponseWrapper,
  ApplicationTypeToken,
  CryptoService,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Contributor } from '@gosi-ui/features/occupational-hazard/lib/shared/models/contributor';
@Injectable({
  providedIn: 'root'
})
export class ThirdpartyAdjustmentService {
  isIndividualApp = false;

  constructor(
    private http: HttpClient,
    readonly workflowService: WorkflowService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly cryptoService: CryptoService
  ) {}
  private readonly documentScannedUrl = '/api/v1/document/scanned-documents';
  private readonly getDocumentUrl = '/api/v2/get-file/filebyname';
  /**
   * Method to get the params from object
   * @param queryKey - param key :- value is object initally pass key as undefined
   * @param QueryValue - object or param value
   * @param params - http params instance
   */
  getParams(queryKey: string, QueryValue, params: HttpParams): HttpParams {
    if (Array.isArray(QueryValue)) {
      // params = params.append(key, value.join(', '));
      QueryValue.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(itemKey => {
            params = this.getParams(queryKey ? queryKey + '.' + itemKey : itemKey, item[itemKey], params);
          });
        } else {
          params = params.append(`${queryKey}`, item);
        }
      });
      return params;
    } else if (typeof QueryValue === 'object' && QueryValue !== null) {
      Object.keys(QueryValue).forEach(valueKey => {
        params = this.getParams(queryKey ? queryKey + '.' + valueKey : valueKey, QueryValue[valueKey], params);
      });
      return params;
    } else if (QueryValue !== undefined && QueryValue !== null) {
      if (params?.get(queryKey)) {
        return params.append(`${queryKey}`, QueryValue);
      } else {
        return params.set(queryKey, QueryValue);
      }
    } else {
      return params;
    }
  }

  /**
   * Method to get the payee list
   * @param params
   */
  getPayeeDetails(params: PayeeQueryParams): Observable<PayeeDetailsWrapper> {
    const url = `/api/v1/party/third-party-details`;
    const httpParams = this.getParams(undefined, params, new HttpParams());
    return this.http.get<PayeeDetailsWrapper>(url, { params: httpParams });
  }

  // Method to fetch tpa eligibility details
  getTpaEligibility(beneficiaryId, sin): Observable<EligibilityDetails> {
    const url = `/api/v1/beneficiary/${beneficiaryId}/adjustment/${sin}/eligibility`;
    return this.http.get<EligibilityDetails>(url);
  }

  /**
   * Methiod to get the tpa adjustmwnt list
   * @param identifier
   * @param params
   */
  getTpaAdjustmentsDetails(identifier: number, params: AdjustmentQueryParams, sin): Observable<AdjustmentDetails> {
    const adjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment/${sin}?isTpa=true`;
    const httpParams = this.getParams(undefined, params, new HttpParams());
    return this.http.get<AdjustmentDetails>(adjustmentUrl, { params: httpParams });
  }

  mapMessagesToAlert(warningMessages: Messages, type: AlertTypeEnum = AlertTypeEnum.WARNING): Alert {
    const alert = new Alert();
    alert.message = undefined;
    alert.type = type;
    alert.dismissible = false;
    alert.details = warningMessages?.details.map(val => {
      return { ...new Alert(), ...{ message: val } };
    });
    return alert;
  }

  /**
   * Methiod to save tpa
   * @param identifier
   * @param request
   */
  saveThirdPartyAdjustment(
    identifier: number,
    request: CreateTpaRequest,
    isModify = false,
    sin
  ): Observable<SaveAdjustmentResponse> {
    const tpaUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${sin}/maintain-adjustment?isModify=${isModify}`;
    return this.http.post<SaveAdjustmentResponse>(tpaUrl, request);
  }
  /**
   * Methiod to get the payee details for tpa validator view
   * @param identifier
   */
  getValidatorPayeeDetails(payeeId: number): Observable<PayeeDetails> {
    const payeeUrl = `/api/v1/party/${payeeId}/third-party-details`;
    return this.http.get<PayeeDetails>(payeeUrl);
  }

  /**
   * Method to submit TPA
   * @param identifier
   * @param adjModificationId
   * @param referenceNumber
   * @param comments
   */
  submitAdjustmentDetails(
    identifier: number,
    adjModificationId: number,
    referenceNumber: number,
    comments: string,
    sin
  ) {
    const submitAdjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${sin}/maintain-adjustment/${adjModificationId}`;
    return this.http.patch(submitAdjustmentUrl, {
      referenceNo: referenceNumber,
      comments: comments,
      tpa: true
    });
  }

  // This method is used to get tpa validator adjustment details
  getThirdPartyAdjustmentValidatorDetails(
    personId: number,
    adjModificationId: number,
    isTpa: boolean,
    sin
  ): Observable<AdjustmentDetails> {
    const validatorUrl = `/api/v1/beneficiary/${personId}/adjustment-modification/${sin}/maintain-adjustment/${adjModificationId}?isTpa=${isTpa}`;
    return this.http.get<AdjustmentDetails>(validatorUrl);
  }

  getAdjustmentDetails(personId: number, sin: number): Observable<AdjustmentDetails> {
    const adjustmentUrl = `/api/v1/beneficiary/${personId}/adjustment/${sin}?isTpa=true`;
    return this.http.get<AdjustmentDetails>(adjustmentUrl);
  }

  // This method is used to get tpa validator adjustment details
  getAdjustmentMonthlyDeductionEligibilty(personId: number, sin): Observable<MonthlyDeductionEligibility> {
    const url = `/api/v1/beneficiary/${personId}/adjustment-modification/${sin}/maintain-adjustment/monthly-deduction`;
    return this.http.get<MonthlyDeductionEligibility>(url);
  }

  /**
   * Methiod to save tpa
   * @param identifier
   * @param request
   */
  saveValidatorAdjustmentEdit(
    identifier: number,
    request: CreateTpaRequest,
    adjModificationId: number,
    sin
  ): Observable<SaveAdjustmentResponse> {
    const tpaUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${sin}/maintain-adjustment/${adjModificationId}`;
    return this.http.put<SaveAdjustmentResponse>(tpaUrl, request);
  }

  /**
   * Method to revert the transaction
   * @param identifier
   * @param adjModificationId
   */
  revertTransaction(identifier: number, adjModificationId: number, referenceNo: number, sin, uuid?: string) {
    let tpaUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${sin}/maintain-adjustment/revert`;
    if (referenceNo || uuid || adjModificationId) {
      const params = [];
      if (adjModificationId) {
        params.push(`adjModificationId=${adjModificationId}`);
      }
      if (referenceNo) {
        params.push(`referenceNo=${referenceNo}`);
      }
      if (uuid) {
        params.push(`uuid=${uuid}`);
      }
      tpaUrl = tpaUrl + '?' + params.join('&');
    }
    return this.http.put(tpaUrl, {});
  }
  // This method is used to get tpa validator adjustment details
  getPaymentDetails(personId: number, adjustmentId: number, sin): Observable<Payment[]> {
    const url = `/api/v1/beneficiary/${personId}/adjustment/${sin}/payment-details/${adjustmentId}`;
    return this.http.get<Payment[]>(url);
  }
  // Method to get the Old document uploaded in Ameen
  getAllDocuments(identifier, businessTransaction?, transcationType?, referenceNo?): Observable<DocumentItem[]> {
    return this.getOldDocumentContentId(identifier, businessTransaction, transcationType, referenceNo).pipe(
      switchMap(response => {
        return forkJoin(
          response.map(doc => {
            if (response) {
              return this.getDocumentContent(doc.contentId).pipe(
                map(documentResponse => {
                  return this.setContentToDocument(doc, documentResponse);
                })
              );
            }
          })
        );
      })
    );
  }

  // Method to get the document content for Old Documents
  getOldDocumentContentId(
    transactionId?: number,
    businessTransaction?: string,
    businessTransactionType?: string,
    referenceNo?: number
  ): Observable<DocumentItem[]> {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    const encryptedBusinessKey = this.cryptoService.encrypt(transactionId);
    const encryptedReferenceNo = this.cryptoService.encrypt(referenceNo);
    let url = `${this.documentScannedUrl}?`;
    if (transactionId) {
      if (!this.isIndividualApp) {
        url += `transactionId=${transactionId}`;
      } else {
        url += `transactionId=${encryptedBusinessKey}`;
      }
    }
    if (businessTransaction && businessTransaction !== null) {
      url += `&businessTransaction=${businessTransaction}`;
    }
    if (businessTransactionType && businessTransactionType !== null) {
      url += `&businessTransactionType=${businessTransactionType}`;
    }
    if (referenceNo && referenceNo !== null) {
      if (!this.isIndividualApp) {
        url += `&referenceNo=${referenceNo}`;
      } else {
        url += `&referenceNo=${encryptedReferenceNo}`;
      }
    }
    return this.http.get<DocumentResponseItem[]>(url).pipe(
      map(res => {
        if (res) {
          res.forEach(result => {
            result.fileName = result.documentName;
            result.contentId = result.id;
            result.sequenceNumber = result.sequenceNo;
          });
          return res;
        }
      }),
      catchError(() => {
        return of(null);
      })
    );
  }
  /**
   * This method is fetch Document content.
   * @memberof DocumentService
   */
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
   * Method to bind content to document
   * @param document
   * @param documentContentReponse
   */
  setContentToDocument(document: DocumentItem, documentContentReponse: DocumentResponseItem): DocumentItem {
    document.fileName = documentContentReponse.fileName;
    document.documentContent = documentContentReponse.content;
    document.started = false;
    if (document.documentContent && document.documentContent !== 'NULL') {
      document.valid = true;
      document.uploadFailed = false;
    }
    if (documentContentReponse.id) {
      document.contentId = documentContentReponse.id;
    }
    if (documentContentReponse.sequenceNo) {
      document.sequenceNumber = documentContentReponse.sequenceNo;
    }
    return document;
  }

  getPersonById(personId): Observable<Contributor> {
    if (personId) {
      const url = `/api/v1/contributor?personId=${personId}`;
      return this.http.get<Contributor>(url);
    }
  }
  getBeneficiaryDetails(identifier, sin): Observable<BeneficiaryList> {
    const beneficiaryUrl = `/api/v1/beneficiary/${identifier}/benefit/${sin}?isTpa=true`;
    return this.http.get<BeneficiaryList>(beneficiaryUrl);
  }
}
