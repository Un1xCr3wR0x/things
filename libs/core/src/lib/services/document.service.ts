/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpErrorResponse, HttpEvent, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ProfileWrapper } from '@gosi-ui/features/customer-information/lib/shared/models';
import { PersonalInformation } from '@gosi-ui/features/customer-information/lib/shared/models/benefits';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApplicationTypeEnum } from '../enums';
import {
  BilingualText,
  DocumentByte,
  DocumentIndividualItem,
  DocumentItem,
  DocumentList,
  DocumentResponseItem,
  DocumentResponseWrapper,
  Environment,
  RasedDoc
} from '../models';
import { ApplicationTypeToken, EnvironmentToken } from '../tokens';
import { bindToObject } from '../utils/objects';
import { CryptoService } from './crypto.service';
import { DocumentBaseService } from './document.base-service';

/**
 * The service class to perform document related things.
 * @class DocumentService
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentService extends DocumentBaseService {
  private readonly documentListUrl = '/api/v1/document/req-doc';
  private readonly multipleDocListUrl = '/api/v1/document/req-docs'; // Remove after api unification
  private readonly documentItemUrl = '/api/v1/document';
  private readonly getDocumentUrl = '/api/v2/get-file/filebyname';
  private readonly documentScannedUrl = '/api/v1/document/scanned-documents';
  private readonly fileUploadUrl = `/api/v1/document/upload`;
  private readonly uploadedDocUrl = '/api/v1/document/uploaded-documents';
  selectedIndex: number;
  isIndividualApp = false;

  /**
   * Creates an instance of DocumentService.
   * @param {HttpClient} http
   * @memberof DocumentService
   */
  constructor(
    readonly http: HttpClient,
    @Inject(EnvironmentToken) readonly environment: Environment,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly cryptoService: CryptoService
  ) {
    super(environment);
  }

  /**
   * This method is fetch Document List to be uploaded.
   * @memberof DocumentService
   */
  getRequiredDocuments(transactionID: string, transationType: string | string[]): Observable<DocumentItem[]> {
    // Remove after api unification
    const queryParams =
      typeof transationType === 'string'
        ? {
            transactionId: transactionID,
            type: transationType
          }
        : {
            transaction: transactionID,
            types: transationType
          };
    return this.http
      .get<DocumentItem[]>(typeof transationType === 'string' ? this.documentListUrl : this.multipleDocListUrl, {
        params: queryParams
      })
      .pipe(map(docs => docs.map(doc => bindToObject(new DocumentItem(), doc))));
  }

  getRequiredDocumentsEinspection(
    transactionID: string,
    transationType: string | string[]
  ): Observable<DocumentItem[]> {
    const queryParams = {
      transaction: transactionID,
      types: transationType
    };
    return this.http
      .get<DocumentItem[]>(this.multipleDocListUrl, {
        params: queryParams
      })
      .pipe(map(docs => docs.map(doc => bindToObject(new DocumentItem(), doc))));
  }

  /**
   * Method to get the document content
   * @param documentName
   * @param transactionId
   * @param businessTransaction
   * @param businessTransactionType
   * @param referenceNo
   * @param documentStatus
   * @param uuid
   * @param sequenceNo
   * @param identifier
   */
  getDocumentContentId(
    documentName: string,
    transactionId: number,
    businessTransaction?: string,
    businessTransactionType?: string,
    referenceNo?: number,
    documentStatus?: string,
    uuid?: string,
    sequenceNo?: number,
    identifier?: string,
    documentTypeId?: number
    ): Observable<DocumentResponseItem> {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    const encryptedTransactionId = this.cryptoService.encrypt(transactionId);
    const encryptedReferenceNo = this.cryptoService.encrypt(referenceNo);
    let url = `${this.documentScannedUrl}?documentType=${documentName}`;
    if (transactionId && transactionId !== null) {
      if (!this.isIndividualApp) {
        url += `&transactionId=${transactionId}`;
      } else {
        url += `&transactionId=${encryptedTransactionId}`;
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
    if (documentStatus && documentStatus !== null) {
      url += `&approvalStatus=${documentStatus}`;
    }
    if (uuid && uuid !== null) {
      url += `&uuid=${uuid}`;
    }
    if (sequenceNo && sequenceNo !== null) {
      url += `&sequenceNo=${sequenceNo}`;
    }
    if (identifier && identifier !== null) {
      url += `&identifier=${identifier}`;
    }
    if (documentTypeId) {
      url += `&documentTypeId=${documentTypeId}`;
    }
    return this.http.get<DocumentResponseItem[]>(url).pipe(
      map(res => {
        if (res[0].id) {
          return res[0];
        }
      }),
      catchError(() => {
        return of(null);
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
    const encryptedTransactionId = this.cryptoService.encrypt(transactionId);
    const encryptedReferenceNo = this.cryptoService.encrypt(referenceNo);
    const url = `${this.documentScannedUrl}`;
    let params = new HttpParams();
    if (transactionId && transactionId !== null) {
      !this.isIndividualApp
        ? (params = params.set('transactionId', transactionId.toString()))
        : (params = params.set('transactionId', encryptedTransactionId.toString()));
    }
    if (businessTransaction && businessTransaction !== null) {
      params = params.set('businessTransaction', businessTransaction.toString());
    }
    if (businessTransactionType && businessTransactionType !== null) {
      params = params.set('businessTransactionType', businessTransactionType.toString());
    }
    if (referenceNo && referenceNo !== null) {
      !this.isIndividualApp
        ? (params = params.set('referenceNo', referenceNo.toString()))
        : (params = params.set('referenceNo', encryptedReferenceNo.toString()));
    }
    // let url = `${this.documentScannedUrl}?`;
    // if (transactionId) {
    //   if (!this.isIndividualApp) {
    //     url += `transactionId=${transactionId}`;
    //   } else {
    //     url += `transactionId=${encryptedTransactionId}`;
    //   }
    // }
    // if (businessTransaction && businessTransaction !== null) {
    //   url += `&businessTransaction=${businessTransaction}`;
    // }
    // if (businessTransactionType && businessTransactionType !== null) {
    //   url += `&businessTransactionType=${businessTransactionType}`;
    // }
    // if (referenceNo && referenceNo !== null) {
    //   if (!this.isIndividualApp) {
    //     url += `&referenceNo=${referenceNo}`;
    //   } else {
    //     url += `&referenceNo=${encryptedReferenceNo}`;
    //   }
    // }
    return this.http.get<DocumentResponseItem[]>(url, { params }).pipe(
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
      catchError(error => of(error))
    );
  }
  // Method to get the Old document uploaded in Ameen
  getOldDocuments(identifier, businessTransaction?, transcationType?, referenceNo?): Observable<DocumentItem[]> {
    return this.getOldDocumentContentId(identifier, businessTransaction, transcationType, referenceNo).pipe(
      switchMap(response => {
        if (response) {
          return forkJoin(
            response.map(doc => {
              if (response) {
                return this.getDocumentContent(doc.contentId).pipe(
                  map(documentResponse => {
                    return this.setContentToDocument(doc, documentResponse);
                  }),
                  catchError(() => {
                    return of(doc);
                  })
                );
              }
            })
          ).pipe(
            map(docs => this.removeDuplicateDocs(docs.filter(item => item.documentContent))),
            catchError(error => of(error))
          );
        }
      })
    );
  }
  getMultipleDocuments(
    identifier?,
    businessTransaction?,
    businessTransactionType?,
    referenceNo?
  ): Observable<DocumentItem[]> {
    return this.getOldDocumentContentId(
      identifier ? identifier : null,
      businessTransaction ? businessTransaction : null,
      businessTransactionType ? businessTransactionType : null,
      referenceNo ? referenceNo : null
    ).pipe(
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
        ).pipe(
          map(docs => this.removeDuplicateDocs(docs)),
          catchError(error => of(error))
        );
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
   * @param businessKey business key of transaction
   * @param documentType english name of the document type
   */
  deleteDocument(
    businessKey: number,
    documentType: string,
    referenceNo?: number,
    uuid?: string,
    sequenceNumber?: number,
    identifier?: string,
    documentTypeId?: number
  ): Observable<DocumentResponseItem> {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    const encryptedBusinessKey = this.cryptoService.encrypt(businessKey);
    const encryptedReferenceNo = this.cryptoService.encrypt(referenceNo);
    let url = `${this.documentScannedUrl}?documentType=${documentType}`;
    if (!this.isIndividualApp) {
      if (businessKey) url = url + `&businessKey=${businessKey}`;
      if (referenceNo) url = url + `&referenceNo=${referenceNo}`;
    } else {
      if (businessKey) url = url + `&businessKey=${encryptedBusinessKey}`;
      if (referenceNo) url = url + `&referenceNo=${encryptedReferenceNo}`;
    }
    if (uuid) url = url + `&uuid=${uuid}`;
    if (sequenceNumber) url = url + `&sequenceNo=${sequenceNumber}`;
    if (identifier) url = url + `&identifier=${identifier}`;
    if (documentTypeId) url = url + `&documentTypeId=${documentTypeId}`;
    return this.http.patch<DocumentResponseItem>(url, null);
  }
  // Method to upload file
  uploadFile(document: DocumentItem): Observable<HttpEvent<{ dDocName: string; message: BilingualText }>> {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    const encryptedBusinessKey = this.cryptoService.encrypt(document.businessKey);
    const encryptedReferenceNo = this.cryptoService.encrypt(document.referenceNo);
    let formData = {};
    const url = `/api/v2/file-upload/checkinuniversal`;
    // if (!this.isIndividualApp) {
    formData = {
      businessKey: document.businessKey,
      transactionId: document.transactionId,
      docTitle: document.name.english,
      referenceNo: document.referenceNo,
      sequenceNo: document.sequenceNumber,
      fileContent: document.documentContent,
      fileName: document.fileName,
      uuid: document.uuid,
      identifier: document.identifier,
      documentTypeId: document.documentTypeId,
      userAccessList:
      document.userAccessList && document.userAccessList.length > 0 ? `,${document.userAccessList.map(item => `${item}(R)`).join(',')}` : '',
      allowPublicAccess: document.allowPublicAccess
  };
    // } else {
    //   formData = {
    //     businessKey: encryptedBusinessKey,
    //     transactionId: document.transactionId,
    //     docTitle: document.name.english,
    //     referenceNo: encryptedReferenceNo,
    //     sequenceNo: document.sequenceNumber,
    //     fileContent: document.documentContent,
    //     fileName: document.fileName,
    //     uuid: document.uuid,
    //     identifier: document.identifier,
    //     documentTypeId: document.documentTypeId,
    //     userAccessList:
    //       document.userAccessList && document.userAccessList.length > 0 ? `,${document.userAccessList.join(',')}` : ''
    //   };
    // }
    if (document.description) {
      Object.assign(formData, { description: document.description });
    }
    return this.http.post<{ dDocName: string; message: BilingualText }>(url, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  /** Method to get person by id. */
  getPersonById(personId: number) {
    const url = `/api/${personId}`;
    return this.http.get<PersonalInformation>(url).pipe(
      tap(res => {
        //  debugger;
      }),
      catchError(err => this.handleError(err))
    );
  }

  /** Method to handle error while service call fails */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  /**
   * This method is used to get the document uploaded or scanned from DB
   * @param transactionKey
   * @param transationType
   * @param identifier
   */
  getDocuments(
    transactionKey: string,
    transationType: string | string[],
    identifier: number,
    referenceNo?: number,
    status?: string,
    uuid?: string,
    sequenceNo?: number,
    customDocs?: DocumentItem[]
  ): Observable<DocumentItem[]> {
    const requiredDocs: Observable<DocumentItem[]> =
      customDocs?.length > 0 ? of(customDocs) : this.getRequiredDocuments(transactionKey, transationType);
    return requiredDocs?.pipe(
      switchMap(res => {
        return forkJoin(
          res?.map(doc => {
            return this.refreshDocument(
              doc,
              identifier ? identifier : doc.businessKey,
              transactionKey,
              typeof transationType === 'string' ? transationType : null,
              referenceNo,
              status,
              uuid,
              sequenceNo
            );
          })
        ).pipe(
          map(docs => this.removeDuplicateDocs(docs)),
          catchError(error => of(error))
        );
      })
    );
  }

  getProfileDetails(personId: number) {
    if (personId) {
      const url = `/api/v1/profile/${personId}`;
      return this.http.get<ProfileWrapper>(url);
    }
  }

  /** To get all documents in a benefit request */
  getAllDocuments(transactionId: number, referenceNo?: number, businessId?: number) {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    let params = new HttpParams();
    if (!this.isIndividualApp) {
      if (transactionId) {
        params = params.set('transactionId', transactionId.toString());
      }
      if (referenceNo) {
        params = params.append('referenceNo', referenceNo.toString());
      }
      if (businessId) {
        params = params.append('businessKey', businessId.toString());
      }
    } else {
      const encryptedBusinessKey = this.cryptoService.encrypt(businessId);
      const encryptedReferenceNo = this.cryptoService.encrypt(referenceNo);
      const encryptedTransactionId = this.cryptoService.encrypt(transactionId);
      {
        if (transactionId) {
          params = params.set('transactionId', encryptedTransactionId);
        }
        if (referenceNo) {
          params = params.append('referenceNo', encryptedReferenceNo);
        }
        if (businessId) {
          params = params.append('businessKey', encryptedBusinessKey);
        }
      }
    }
    return this.http
      .get<DocumentItem[]>(this.documentScannedUrl, { params })
      .pipe(
        switchMap(res => {
          return forkJoin(
            res.map(document => {
              if (document?.id) {
                return this.getDocumentContent(document?.id)
                  .pipe(
                    map(documentResponse => {
                      return this.setContentToDocument(document, documentResponse);
                    })
                  )
                  .pipe(catchError(errr => of(errr)));
              } else {
                return of(document);
              }
            })
          ).pipe(catchError(error => of(error)));
        })
      )
      .pipe(catchError(err => of(err)));
  }

  /**
   * Method to get the content and bind to document item
   * @param document
   * @param businessId
   * @param businessTransaction
   * @param businessTransactionType
   * @param referenceNo
   * @param documentStatus
   */
  refreshDocument(
    document: DocumentItem,
    businessId: number,
    businessTransaction?: string,
    businessTransactionType?: string,
    referenceNo?: number,
    documentStatus?: string,
    uuid?: string,
    sequenceNo?: number
  ): Observable<DocumentItem> {
    return this.getDocumentContentId(
      document.name.english,
      businessId,
      businessTransaction,
      businessTransactionType,
      referenceNo,
      documentStatus,
      uuid,
      sequenceNo,
      document.identifier,
      document.documentTypeId
    ).pipe(
      switchMap(doc => {
        if (doc?.id) {
          return this.getDocumentContent(doc.id).pipe(
            map(documentResponse => {
              return this.setContentToDocument(document, documentResponse, doc);
            })
          );
        } else {
          return of(document);
        }
      })
    );
  }

  /**
   * Method to bind content to document
   * @param document
   * @param documentContentReponse
   */
  setContentToDocument(document: DocumentItem, documentContentReponse: DocumentResponseItem, doc?: DocumentResponseItem): DocumentItem {
    document.fileName = documentContentReponse.fileName;
    document.documentContent = documentContentReponse.content;
    if(doc){
      document.documentAddedBy = doc?.documentAddedBy;
      document.documentUploaderIdentifier = doc?.documentUploaderIdentifier;
      document.allowPublicAccess = doc?.allowPublicAccess;
      document.referenceNo = doc?.transactionTraceId;
      }
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

  /**
   * This method is fetch Document details.
   * To be removed
   * @memberof DocumentService
   */
  getDocumentItem(documentName: string, uniqueId: number): Observable<DocumentItem> {
    return this.http.get<DocumentItem>(`${this.documentItemUrl}/${documentName}?transactionId=${uniqueId}`);
  }

  /**
   * Method to get url for connecting to wcc/printer drvier
   * @param businessKey
   * @param transactionId
   * @param documentName
   * @param uuid
   */
  getWccScanUrl(
    businessKey,
    transactionId,
    documentName,
    uuid,
    referenceNo?,
    referenceIds?: number[],
    sequenceNo?: number,
    userAccessList?: string[],
    identifier?: string,
    documentTypeId?: number,
    description?: string
  ): string {
    let oracleUrl = `oraclecapture://CaptureWorkspace=Scan Demo&ClientProfile=Scan Demo Profile&CaptureDriver=CAPTURE_IMPORT_DRIVER&CaptureSource=Import Source&SignOutOnRelease=0&Transaction ID=${transactionId}&Document Type=${documentName}`;
    if (businessKey) {
      oracleUrl += `&Business Key=${businessKey}`;
    }
    if (referenceIds && referenceIds.length > 0) {
      oracleUrl += `&Reference No=${referenceIds.join(',')}`;
    } else if (referenceNo) {
      oracleUrl += `&Reference No=${referenceNo}`;
    }
    if (uuid) {
      oracleUrl += `&UUID=${uuid}`;
    }
    if (sequenceNo) {
      oracleUrl += `&Sequence No=${sequenceNo}`;
    }
    if (sequenceNo) {
      oracleUrl += `&Identifier=${identifier}`;
    }
    if (userAccessList && userAccessList.length >= 0) {
      oracleUrl += `&User Access List=${userAccessList.join(',')}`;
    }
    if (documentTypeId) {
      oracleUrl += `&DocumentType ID=${documentTypeId}`;
    }
    return oracleUrl;
  }
  /**
   * Delete the unwanted documents
   * @param registrationNo
   * @param documents
   * @param referenceNo
   * @param uuid
   */
  deleteDocuments(
    registrationNo: number,
    documents: DocumentItem[],
    referenceNo?: number,
    uuid?: string
  ): Observable<DocumentResponseItem[]> {
    return documents?.length > 0
      ? forkJoin(
          documents.map(document =>
            this.deleteDocument(
              registrationNo,
              document?.name?.english,
              referenceNo,
              uuid,
              document.sequenceNumber,
              document.identifier
            ).pipe(catchError(() => of(null)))
          )
        )
      : of([]);
  }
  /** Method to get Rased documents */
  getRasedDocuments(
    type: string,
    referenceNo: number | string,
    referenceType?: string,
    visitId?: string
  ): Observable<DocumentItem[]> {
    const rasedUrl = `/api/v1/rased-document/${type}`;
    let params = new HttpParams().set('referenceNo', referenceNo.toString());
    if (referenceType) params = params.set('referenceType', referenceType);
    if (visitId) params = params.set('fan', visitId);
    return this.http.get<RasedDoc[]>(rasedUrl, { params }).pipe(
      tap(docs => docs.filter(doc => doc.documentUrl !== '.pdf')),
      switchMap((res: RasedDoc[]) => {
        return forkJoin(res.map(doc => this.getDocumentByteArray(type, doc)));
      })
    );
  }
  /** Method to get document byte array. */
  getDocumentByteArray(type: string, document: RasedDoc): Observable<DocumentItem> {
    const docByteUrl = `/api/v1/rased-document/${type}/doc-byte?url=${document.documentUrl}`;
    return this.http.get<DocumentByte>(docByteUrl).pipe(
      map(res => {
        return bindToObject(new DocumentItem(), {
          documentContent: res.docByte,
          name: { english: 'Inspection Report', arabic: 'تقرير التفتيش' },
          fileName: document.documentName,
          documentType: document.documentType
        });
      })
    );
  }

  getDocumentList(
    transactionId: number,
    businessTransaction?: string,
    businessTransactionType?: string,
    pageNo?: number,
    pageSize?: number,
    fromDate?: string,
    toDate?: string,
    docTypeIdFilterValues?: number[],
    addedBy?: string[],
    searchKey?: string,
    uuid?: string
  ): Observable<DocumentList[]> {
    let url = `${this.uploadedDocUrl}?pageNo=${pageNo}&pageSize=${pageSize}`;
    if (transactionId && transactionId !== null) {
      url += `&transactionId=${transactionId}`;
    }
    if (businessTransaction && businessTransaction !== null) {
      url += `&businessTransaction=${businessTransaction}`;
    }
    if (businessTransactionType && businessTransactionType !== null) {
      url += `&businessTransactionType=${businessTransactionType}`;
    }
    if (uuid && uuid !== null) {
      url += `&uuid=${uuid}`;
    }
    if (fromDate && fromDate !== null) {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate && toDate !== null) {
      url += `&toDate=${toDate}`;
    }
    if (searchKey && searchKey !== null) {
      url += `&docContentIdOrDesc=${searchKey}`;
    }
    if (docTypeIdFilterValues && docTypeIdFilterValues.length > 0) {
      docTypeIdFilterValues.map(value => {
        url += `&docTypeIdFilterValues=${value}`;
      });
    }
    if (addedBy && addedBy.length > 0) {
      addedBy.map((value: string) => {
        url += `&addedByFilterValues=${value}`;
      });
    }
    return this.http
      .get<DocumentList>(url)
      .pipe(
        switchMap(res => {
          return forkJoin(
            res.documentList.map((document, index) => {
              if (document?.id) {
                return this.getDocumentContent(document?.id)
                  .pipe(
                    map(documentResponse => {
                      res.documentList[index] = this.setContentToDocument(document, documentResponse);
                      return res;
                    })
                  )
                  .pipe(catchError(errr => of(errr)));
              } else {
                return of(res);
              }
            })
          ).pipe(catchError(error => of(error)));
        })
      )
      .pipe(catchError(err => of(err)));
  }

  getAllDocumentsOfIndividual(
    businessTransaction?: string,
    businessTransactionType?: string,
    identifier?: number,
    pageNo?: number,
    pageSize?: number,
    fromDate?: string,
    toDate?: string,
    docTypeIdFilterValues?: number[],
    addedBy?: string[],
    searchKey?: string
  ): Observable<DocumentList[]> {
    let url = `${this.uploadedDocUrl}?pageNo=${pageNo}&pageSize=${pageSize}`;
    if (businessTransaction && businessTransaction !== null) {
      url += `&businessTransaction=${businessTransaction}`;
    }
    if (businessTransactionType && businessTransactionType !== null) {
      url += `&businessTransactionType=${businessTransactionType}`;
    }
    if (identifier && identifier !== null) {
      url += `&identifier=${identifier}`;
    }
    if (fromDate && fromDate !== null) {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate && toDate !== null) {
      url += `&toDate=${toDate}`;
    }
    if (searchKey && searchKey !== null) {
      url += `&docContentIdOrDesc=${searchKey}`;
    }
    if (docTypeIdFilterValues && docTypeIdFilterValues.length > 0) {
      docTypeIdFilterValues.map(value => {
        url += `&docTypeIdFilterValues=${value}`;
      });
    }
    if (addedBy && addedBy.length > 0) {
      addedBy.map((value: string) => {
        url += `&addedByFilterValues=${value}`;
      });
    }
    return this.http
      .get<DocumentList>(url)
      .pipe(
        switchMap(res => {
          return forkJoin(
            res.documentList.map((document, index) => {
              if (document?.id) {
                return this.getDocumentContent(document?.id)
                  .pipe(
                    map(documentResponse => {
                      res.documentList[index] = this.setContentToDocument(document, documentResponse);
                      return res;
                    })
                  )
                  .pipe(catchError(errr => of(errr)));
              } else {
                return of(document);
              }
            })
          ).pipe(catchError(error => of(error)));
        })
      )
      .pipe(catchError(err => of(err)));
  }

  /**
   * Method to bind content to document
   * @param document
   * @param documentContentReponse
   */
  setIndividualContentToDocument(
    document: DocumentIndividualItem,
    documentContentReponse: DocumentResponseItem
  ): DocumentIndividualItem {
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
  /** To get all documents in a benefit request */
  getEveryDocuments(transactionId: number, referenceNo?: number, businessType?:string) {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    let params = new HttpParams();
    if (!this.isIndividualApp) {
      if (transactionId) {
        params = params.set('transactionId', transactionId.toString());
      }
      if (referenceNo) {
        params = params.append('referenceNo', referenceNo.toString());
      }
      if (businessType) {
        params = params.append('businessTransaction', businessType.toString());
      }
    }
    return this.http
      .get<DocumentItem[]>(this.documentScannedUrl, { params })
      .pipe(
        switchMap(res => {
          return forkJoin(
            res.map(document => {
              if (document?.id) {
                return this.getDocumentContent(document?.id)
                  .pipe(
                    map(documentResponse => {
                      return this.setContentToDocument(document, documentResponse);
                    })
                  )
                  .pipe(catchError(errr => of(errr)));
              } else {
                return of(document);
              }
            })
          ).pipe(catchError(error => of(error)));
        })
      )
      .pipe(catchError(err => of(err)));
  }
  documentCheckBoxRemove(
    businessKey: string,
    documentType: string,
    referenceNo?: number,
    uuid?: string,
    sequenceNumber?: number,
    identifier?: string,
    documentTypeId?: number,
  ): Observable<DocumentResponseItem> {
    let url = `/api/v1/document/remove-public-access?documentType=${documentType}`;
      if (referenceNo) url = url + `&referenceNo=${referenceNo}`;
    if (uuid) url = url + `&uuid=${uuid}`;
    if (businessKey) url = url + `&businessKey=${businessKey}`;
    if (sequenceNumber) url = url + `&sequenceNo=${sequenceNumber}`;
    if (identifier) url = url + `&identifier=${identifier}`;
    if (documentTypeId) url = url + `&documentTypeId=${documentTypeId}`;
    return this.http.patch<DocumentResponseItem>(url, null);
  }

}
