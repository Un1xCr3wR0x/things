import { DocumentItem, DocumentResponseItem } from '@gosi-ui/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {
  documentListItemArray,
  documentResonseItem,
  fileUploadTestData
} from 'testing/test-data/core/document-service';
import { documentList, genericError } from '../../test-data';

export class DocumentServiceStub {
  documentList = [];

  fileContent: BehaviorSubject<any> = new BehaviorSubject<any>(fileUploadTestData);

  documentListItemList: BehaviorSubject<any> = new BehaviorSubject<any>(documentListItemArray);
  /**
   * Mock method for getDocumentList
   * @param transactionId
   * @param transationType
   */
  getRequiredDocuments(transactionId, transationType) {
    if (transactionId || transationType) {
      return of(documentList);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Mock method for getCaptured Document
   * @param name
   * @param registrationNumber
   */
  getDocumentContentId(name, registrationNumber) {
    if (name || registrationNumber) {
      return this.documentListItemList.asObservable();
    } else {
      return throwError(genericError);
    }
  }
  /**
   * Mock method for getOld Document
   * @param name
   * @param registrationNumber
   */
  getOldDocumentContentId(name, registrationNumber) {
    if (name || registrationNumber) {
      return this.documentListItemList.asObservable();
    } else {
      return throwError(genericError);
    }
  }
  /**
   * Mock method for getDocumentItem
   * @param documentName
   * @param registrationNumber
   */
  getDocumentItem(documentName, registrationNumber) {
    if (documentName || registrationNumber) {
      return of(documentList);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Mock method for deleteDocument
   * @param registrationNo
   * @param documentName
   */
  deleteDocument(registrationNo, documentName) {
    if (registrationNo || documentName) {
      return of(null);
    }
    return of(null);
  }

  getDocumentContent(contentId: string) {
    return of(documentResonseItem);
  }

  setContentToDocument(document: DocumentItem, docResponse: DocumentResponseItem) {
    return document;
  }

  bindtoDocList(documentResponse: DocumentResponseItem, item: DocumentItem) {
    if (documentResponse || item) {
    }
  }
  bindtoDocumentList(documentResponse: DocumentResponseItem, item: DocumentItem) {
    if (documentResponse || item) {
    }
  }
  refreshDocument(item: DocumentItem, identifier) {
    if (item || identifier) {
      return of(documentList[0]);
    } else return throwError(genericError);
  }

  getDocuments(
    transactionKey: string,
    transationType: string | string[],
    identifier: number,
    referenceNo?: number,
    status?: string,
    uuid?: string
  ): Observable<DocumentItem[]> {
    if (transactionKey || transationType || identifier || referenceNo || status || uuid) {
      return of(documentListItemArray);
    } else {
      return throwError(genericError);
    }
  }
  getOldDocuments(identifier: any, key) {
    if (key || identifier) {
      return of(documentListItemArray);
    } else {
      return throwError(genericError);
    }
  }

  getAllDocuments() {}

  /**
   * Method to get url for connecting to wcc/printer drvier
   * @param businessKey
   * @param transactionId
   * @param documentName
   * @param uuid
   */
  getWccScanUrl(businessKey, transactionId, documentName, uuid): string {
    return `oraclecapture://CaptureWorkspace=Scan Demo&ClientProfile=Scan Demo Profile&CaptureDriver=CAPTURE_IMPORT_DRIVER&CaptureSource=Import Source&SignOutOnRelease=0&Business Key=${businessKey}&Transaction ID=${transactionId}&Document Type=${documentName}&uuid=${uuid}`;
  }

  checkMandatoryDocuments() {
    return true;
  }

  getMultipleDocuments(bussinessId, type, transactionRefNo) {
    if (bussinessId || type || transactionRefNo) {
    }
    return of(documentListItemArray);
  }

  deleteDocuments(
    registrationNo: number,
    documents: DocumentItem[],
    referenceNo?: number,
    uuid?: number
  ): Observable<DocumentResponseItem[]> {
    if (registrationNo || documents || referenceNo || uuid) {
      return of([null]);
    }
    return throwError(genericError);
  }

  getRasedDocuments() {
    return of([]);
  }

  getDocumentByteArray() {
    return of(new DocumentItem());
  }

  removeDuplicateDocs(docs: DocumentItem[]) {
    return docs;
  }
}
