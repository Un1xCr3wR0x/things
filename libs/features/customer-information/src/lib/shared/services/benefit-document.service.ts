import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DocumentService } from '@gosi-ui/core/lib/services/document.service';
import {
  WizardItem,
  DocumentItem,
  bindToObject,
  CryptoService,
  ApplicationTypeToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { BenefitConstants } from '../constants/benefits/benefit-constants';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { ModifyBenefitService } from './modify-benefit.service';

@Injectable({
  providedIn: 'root'
})
export class BenefitDocumentService {
  isIndividualApp = false;

  private readonly documentScannedUrl = '/api/v1/document/scanned-documents';
  constructor(
    private http: HttpClient,
    readonly router: Router,
    readonly documentService: DocumentService,
    readonly modifyBenefitService: ModifyBenefitService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly cryptoService: CryptoService
  ) {}
  //TODO Add Comments
  addDocumentIcon(wizardItems: WizardItem[]) {
    if (wizardItems.length < 3) {
      wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    }
    return [...wizardItems];
  }
  /** getting documents for pension */
  getReqDocs(
    sin: number,
    benefitRequestId: number,
    referenceNo?: number,
    isBackdated?: boolean
  ): Observable<DocumentItem[]> {
    return this.getRequiredDocuments(sin, benefitRequestId, referenceNo, isBackdated).pipe(
      switchMap(res => {
        if (res.length) {
          return forkJoin(
            res.map(doc => {
              return this.documentService.refreshDocument(doc, benefitRequestId, null, null, referenceNo);
            })
          ).pipe(catchError(error => of(error)));
        } else {
          return of(res);
        }
      })
    );
  }
  /** getting required documents  */
  getRequiredDocuments(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    isBackdated = false
  ): Observable<DocumentItem[]> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/req-docs`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    params = params.set('isBackdated', isBackdated.toString());
    return this.http
      .get<DocumentItem[]>(url, { params })
      .pipe(map(docs => docs.map(doc => bindToObject(new DocumentItem(), doc))));
  }
  /** for calling the required docs on the validator screen */
  getValidatorDocuments(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    transactionKey: string,
    transactionType: string
  ) {
    return this.getRequiredDocuments(sin, benefitRequestId, referenceNo).pipe(
      switchMap(res => {
        return forkJoin(
          res.map(doc => {
            return this.documentService.refreshDocument(
              doc,
              benefitRequestId,
              transactionKey,
              transactionType,
              referenceNo
            );
          })
        ).pipe(catchError(error => of(error)));
      })
    );
  }

  /** for calling the required docs on the validator screen */
  getUploadedDocuments(
    benefitRequestId: number,
    transactionKey: string,
    transactionType: string,
    referenceNo?: number
  ) {
    return this.documentService.getRequiredDocuments(transactionKey, transactionType).pipe(
      switchMap(res => {
        return forkJoin(
          res.map(doc => {
            return this.documentService.refreshDocument(
              doc,
              benefitRequestId,
              transactionKey,
              transactionType,
              referenceNo
            );
          })
        ).pipe(catchError(error => of(error)));
      })
    );
  }
  /** for calling the required docs for Modify payee validator screen */
  getModifyPayeeDocuments(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    transactionKey: string,
    transactionType: string
  ) {
    return this.modifyBenefitService.getReqDocsForModifyPayee(sin, benefitRequestId, referenceNo).pipe(
      switchMap(res => {
        return forkJoin(
          res.map(doc => {
            return this.documentService.refreshDocument(
              doc,
              benefitRequestId,
              transactionKey,
              transactionType,
              referenceNo
            );
          })
        ).pipe(catchError(error => of(error)));
      })
    );
  }
  /** for calling the required docs for Stop Benefitvalidator screen */
  getStopBenefitDocuments(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    transactionKey: string,
    transactionType: string
  ) {
    return this.modifyBenefitService.getReqDocsForStopBenefit(sin, benefitRequestId, referenceNo).pipe(
      switchMap(res => {
        return forkJoin(
          res.map(doc => {
            return this.documentService.refreshDocument(
              doc,
              benefitRequestId,
              transactionKey,
              transactionType,
              referenceNo
            );
          })
        ).pipe(catchError(error => of(error)));
      })
    );
  }
  /** To get all documents in a benefit request */
  getAllDocuments(transactionId: number) {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    const encryptedTransactionId = this.cryptoService.encrypt(transactionId);
    let params = new HttpParams();
    if (transactionId) {
      if (!this.isIndividualApp) {
        params = params.set('transactionId', transactionId.toString());
      } else params = params.set('transactionId', encryptedTransactionId);
    }
    return this.http.get<DocumentItem[]>(this.documentScannedUrl, { params }).pipe(
      switchMap(res => {
        return forkJoin(
          res.map(doc => {
            return this.documentService.refreshDocument(doc, transactionId);
          })
        ).pipe(catchError(error => of(error)));
      })
    );
  }
  /** Method to download add commitment file */
  downloadAddCommitment(sin: number) {
    const url = `/api/v1/contributor/${sin}/benefit/bank-account/add-commitment/certificate`;
    return this.http.get(url, {
      responseType: 'blob'
    });
  }
  fetchDocs(requestId: number, refrerenceNumber: number, transactionNumber: string, transactionName: string) {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    const encryptedTransactionId = this.cryptoService.encrypt(requestId);
    const encryptedReferenceNo = this.cryptoService.encrypt(refrerenceNumber);
    let url = `/api/v1/document/scanned-documents?`;
    if (requestId) {
      if (!this.isIndividualApp) {
        url += `transactionId=${requestId}`;
      } else {
        url += `transactionId=${encryptedTransactionId}`;
      }
    }
    if (refrerenceNumber) {
      if (!this.isIndividualApp) {
        url += `&referenceNo=${refrerenceNumber}`;
      } else {
        url += `&referenceNo=${encryptedReferenceNo}`;
      }
    }
    if (transactionNumber) {
      url += `&transactionNumber=${transactionNumber}`;
    }
    if (transactionName) {
      url += `&transactionName=${transactionName}`;
    }
    return this.http.get<DocumentItem[]>(url).pipe(map(docs => docs.map(doc => bindToObject(new DocumentItem(), doc))));
  }
}
