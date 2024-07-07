import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {
  docsForExternalUser,
  docsForInternalUser,
  docsScannedByInternalUser,
  docsUploadedByExternalUser,
  mandatoryCheckDocumentList
} from 'testing/test-data/core/document-service';
import {
  changePersonTransactionIdenifier,
  changePersonTransactionKey,
  changePersonTransactionType,
  documentResonseItemListStub
} from 'testing/test-data/features/registration/establishment/base/test-data';
import { DocumentItem, DocumentResponseItem } from '../models';
import { ApplicationTypeToken, EnvironmentToken } from '../tokens';
import { DocumentService } from './document.service';
import {
  deleteDocResponse,
  docListResp,
  documentContentReponseWithContentId,
  documentContentReponseWithoutContentId,
  documentWithContentId,
  documentWithoutContentId,
  getCapDocResponse,
  getDocItemResponse,
  getDocListResponse
} from './document.service.test-data';
import { AppConstants } from '../constants';
export class DocumentServiceMoke extends DocumentService {}
describe('DocumentService', () => {
  let documentService: DocumentService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DocumentService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080', wccScanBaseUrl: AppConstants.DOCUMENT_CAPTURE_BASE_URL }
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ]
    });
    documentService = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });
  describe('should test document service', () => {
    it('should expect document service', () => {
      expect(documentService).toBeTruthy();
    });

    it('should document item', () => {
      const name = 'documentName';
      const id = 123;
      documentService.getDocumentItem(name, id).subscribe(get => {
        expect(get).toBe(getDocItemResponse);
      });
      const req = httpMock.expectOne(`/api/v1/document/${name}?transactionId=${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(getDocItemResponse);
    });

    it('should get captured document without passing optional parameters', () => {
      const name = 'documentName';
      const registrationNumber = 123;
      const documentScannedUrl = '/api/v1/document/scanned-documents';
      documentService
        .getDocumentContentId(name, registrationNumber, null, null, null, null, null, null)
        .subscribe(get => {
          expect(get).toEqual(getCapDocResponse[0].id);
        });
      const req = httpMock.expectOne(`${documentScannedUrl}?documentType=${name}&transactionId=${registrationNumber}`);
      expect(req.request.method).toBe('GET');
      req.flush(getCapDocResponse);
    });

    it('should return null observable during get captured document error occurred', () => {
      const name = 'documentName';
      const registrationNumber = 123;
      const documentScannedUrl = '/api/v1/document/scanned-documents';
      documentService
        .getDocumentContentId(name, registrationNumber, null, null, null, null, null, null, null)
        .subscribe(
          get => {},
          error => {
            expect(error).toEqual(null);
          }
        );
      const req = httpMock.expectOne(`${documentScannedUrl}?documentType=${name}&transactionId=${registrationNumber}`);
      expect(req.request.method).toBe('GET');
      req.flush(throwError(null));
    });

    it('should get captured document', () => {
      const name = 'documentName';
      const registrationNumber = 123;
      const documentScannedUrl = '/api/v1/document/scanned-documents';
      const businessTransaction = 'business';
      const businessTransactionType = 'business';
      const referenceNo = 12345;
      const documentStatus = 'status';
      const uuid = 'uuid';
      documentService
        .getDocumentContentId(
          name,
          registrationNumber,
          businessTransaction,
          businessTransactionType,
          referenceNo,
          documentStatus,
          uuid,
          null
        )
        .subscribe(get => {
          expect(get).toEqual(getCapDocResponse[0].id);
        });
      const req = httpMock.expectOne(
        `${documentScannedUrl}?documentType=${name}&transactionId=${registrationNumber}&businessTransaction=${businessTransaction}&businessTransactionType=${businessTransactionType}&referenceNo=${referenceNo}&approvalStatus=${documentStatus}&uuid=${uuid}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(getCapDocResponse);
    });

    it('should get document content', () => {
      const response = new DocumentResponseItem();
      response.fileName = getDocItemResponse?.fileName;
      response.content = getDocItemResponse?.content;
      const id = '123';
      documentService.getDocumentContent(id).subscribe(get => {
        expect(get?.id).toEqual(id);
      });
      const req = httpMock.expectOne(`/api/v2/get-file/filebyname`);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });
    xit('should get document oldDocumentcontent', () => {
      const transactionId = 123456;
      const businessTransaction = 'business';
      const businessTransactionType = 'business';
      const referenceNo = 12345;
      const documentScannedUrl = '/api/v1/document/scanned-documents';
      documentService
        .getOldDocumentContentId(transactionId, businessTransaction, businessTransactionType, referenceNo)
        .subscribe(get => {
          expect(get).toBe(null);
        });
      const req = httpMock.expectOne(
        `${documentScannedUrl}?transactionId=${transactionId}&businessTransaction=${businessTransaction}&businessTransactionType=${businessTransactionType}&referenceNo=${referenceNo}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(getDocItemResponse);
    });
    // it('should get document oldDocumentcontent with bussiness transaction', () => {
    //   const transactionId = 123456;
    //   const businessTransaction='businessTransaction';
    //   const documentScannedUrl = '/api/v1/document/scanned-documents';
    //   documentService.getOldDocumentContentId(transactionId,businessTransaction).subscribe(get => {
    //     expect(get).toHaveBeenCalled();
    //   });
    //   const req = httpMock.expectOne(`${documentScannedUrl}?transactionId=${transactionId}&businessTransaction=${businessTransaction}`);
    //   expect(req.request.method).toBe('GET');
    //   req.flush(getCapDocResponse);
    // });

    it('should delete document using business key and document type', () => {
      const type = 'type';
      const key = 123;
      const documentScannedUrl = '/api/v1/document/scanned-documents';
      documentService.deleteDocument(key, type).subscribe(get => {
        expect(get.documentName).toEqual('string');
      });
      const req = httpMock.expectOne(`${documentScannedUrl}?documentType=${type}&businessKey=${key}`);
      expect(req.request.method).toBe('PATCH');
      req.flush(deleteDocResponse);
    });
    it('should fetch document list', () => {
      const transactionId = '4565';
      const documentListUrl = '/api/v1/document/req-doc';
      const type = 'type';
      const testUrl = `${documentListUrl}?transactionId=${transactionId}&type=${type}`;
      documentService.getRequiredDocuments(transactionId, type).subscribe(val => {
        expect(val.length).toEqual(1);
      });
      const task = httpMock.expectOne(encodeURI(testUrl));
      expect(task.request.method).toBe('GET');
      task.flush(docListResp);
    });
  });

  describe('Get All Documents with content', () => {
    xit('should get the documents with content', async () => {
      spyOn(documentService, 'getRequiredDocuments').and.returnValue(of(getDocListResponse));
      spyOn(documentService, 'getDocumentContentId').and.returnValue(of(documentResonseItemListStub[0].id));
      spyOn(documentService, 'getDocumentContent').and.returnValue(of(documentResonseItemListStub[0]));
      documentService.getDocuments(
        changePersonTransactionKey,
        changePersonTransactionType,
        changePersonTransactionIdenifier
      );
      expect(documentService['documentList'].length).toBe(1);
    });
  });

  describe('check mandatory documents', () => {
    it('should check mandatory docs scanned or uploaded', () => {
      let documentList: DocumentItem[] = [];
      mandatoryCheckDocumentList.forEach(item => {
        documentList.push(new DocumentItem().fromJsonToObject(item));
      });
      const isValid = documentService.checkMandatoryDocuments(documentList);

      expect(isValid).toBeFalsy();
    });

    it('should return WccScanUrl when businessKey, transactionId, documentName, uuid, referenceNo passed ', () => {
      const businessKey = '12345';
      const transactionId = '12345';
      const documentName = 'document';
      const uuid = 'abc123';
      const referenceNo = '12345';
      const oracleUrl = `${AppConstants.DOCUMENT_CAPTURE_BASE_URL}CaptureWorkspace=Scan Demo&ClientProfile=Scan Demo Profile&CaptureDriver=CAPTURE_TWAIN_DRIVER&CaptureSource=PaperStream IP fi-7160&SignOutOnRelease=0&Transaction ID=${transactionId}&Document Type=${documentName}&Business Key=${businessKey}&Reference No=${referenceNo}&UUID=${uuid}`;
      const oracleUrlReturned = documentService.getWccScanUrl(
        businessKey,
        transactionId,
        documentName,
        uuid,
        referenceNo
      );
      expect(oracleUrlReturned).toBe(oracleUrl);
    });
    it('should return WccScanUrl when businessKey, transactionId, documentName, referenceIds passed ', () => {
      const businessKey = '12345';
      const transactionId = '12345';
      const documentName = 'document';
      const referenceIds = [12345, 3245];
      const oracleUrl = `${
        AppConstants.DOCUMENT_CAPTURE_BASE_URL
      }CaptureWorkspace=Scan Demo&ClientProfile=Scan Demo Profile&CaptureDriver=CAPTURE_TWAIN_DRIVER&CaptureSource=PaperStream IP fi-7160&SignOutOnRelease=0&Transaction ID=${transactionId}&Document Type=${documentName}&Business Key=${businessKey}&Reference No=${referenceIds.join(
        ','
      )}`;
      const oracleUrlReturned = documentService.getWccScanUrl(businessKey, transactionId, documentName, null, null, [
        12345,
        3245
      ]);
      expect(oracleUrlReturned).toBe(oracleUrl);
    });
    it('should return WccScanUrl when businessKey, transactionId, documentName passed ', () => {
      const businessKey = '12345';
      const transactionId = '12345';
      const documentName = 'document';
      const oracleUrl = `${AppConstants.DOCUMENT_CAPTURE_BASE_URL}CaptureWorkspace=Scan Demo&ClientProfile=Scan Demo Profile&CaptureDriver=CAPTURE_TWAIN_DRIVER&CaptureSource=PaperStream IP fi-7160&SignOutOnRelease=0&Transaction ID=${transactionId}&Document Type=${documentName}&Business Key=${businessKey}`;
      const oracleUrlReturned = documentService.getWccScanUrl(
        businessKey,
        transactionId,
        documentName,
        null,
        null,
        null
      );
      expect(oracleUrlReturned).toBe(oracleUrl);
    });
    it('should return bind document with passing content and id', () => {
      expect(documentService.setContentToDocument(new DocumentItem(), documentContentReponseWithContentId)).toEqual(
        documentWithContentId
      );
    });
    it('should return bind document without passing content and id', () => {
      expect(documentService.setContentToDocument(new DocumentItem(), documentContentReponseWithoutContentId)).toEqual(
        documentWithoutContentId
      );
    });
    it('should get OldDocuments', () => {
      const identifier = 1234;
      const businessTransaction = 'test';
      spyOn(documentService, 'getOldDocumentContentId').and.callThrough();
      documentService.getOldDocuments(identifier, businessTransaction);
      expect(documentService.getOldDocumentContentId).toHaveBeenCalled();
    });
  });
  describe('Get Require Documents ', () => {
    it('fetch 5 documents with 2 duplicates for Internal Users ', () => {
      const docs = documentService.removeDuplicateDocs(docsForInternalUser);
      expect(docs?.length).toBe(3);
    });
    it('fetch 3 documents with no duplicates for external Users ', () => {
      const docs = documentService.removeDuplicateDocs(docsForExternalUser);
      expect(docsForExternalUser.length).toBe(2);
      expect(docs.length).toBe(2);
    });
    it('fetch 5 documents uploaded by External User for Internal User ', () => {
      const docs = documentService.removeDuplicateDocs(docsUploadedByExternalUser);
      expect(docs.length).toBe(3);
      expect(docs.filter(item => (item.parentDocumentId ? true : false)).length).toBe(2);
    });
    it('fetch 5 documents scanned by Internal User for Internal User ', () => {
      const docs = documentService.removeDuplicateDocs(docsScannedByInternalUser);
      expect(docs.length).toBe(3);
      expect(docs.filter(item => (item.parentDocumentId ? false : true)).length).toBe(3);
    });
  });
});
