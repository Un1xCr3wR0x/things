import { TestBed } from '@angular/core/testing';

import { AdjustmentDocumentService } from './adjustment-document.service';
import { DocumentService, DocumentItem } from '@gosi-ui/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('AdjustmentDocumentService', () => {
  let service: AdjustmentDocumentService;
  const documentServiceSpy = jasmine.createSpyObj<DocumentService>('DocumentService', [
    'getRequiredDocuments',
    'refreshDocument'
  ]);
  documentServiceSpy.getRequiredDocuments.and.returnValue(of([new DocumentItem(), new DocumentItem()]));
  documentServiceSpy.refreshDocument.and.returnValue(of(new DocumentItem()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: DocumentService, useValue: documentServiceSpy }]
    });
    service = TestBed.inject(AdjustmentDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should getUploadedDocuments', () => {
    expect(service.getUploadedDocuments(1234, '123', 'adjustment')).not.toEqual(null);
  });
});
