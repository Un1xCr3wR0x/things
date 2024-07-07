/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  bindToObject,
  DocumentItem
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { OhClaimsService } from '../../shared/services/oh-claims.service';
import { UploadDocumentsScComponent } from './upload-documents-sc.component';
import {
  DocumentServiceStub,
  AlertServiceStub,
  ModalServiceStub,
  OhMockService,
  ActivatedRouteStub,
  documentArray,
  scanDocuments,
  scanDocumentsReim,
  Form
} from 'testing';
let activatedRoute: ActivatedRouteStub;
activatedRoute = new ActivatedRouteStub();
activatedRoute.setParamMap({
  registrationNumber: 12334,
  socialInsuranceNo: 601336235,
  injuryId: 1001956028,
  complicationId: 223344,
  injuryNo: 11111,
  reimbId: 23
});
describe('UploadDocumentsScComponent', () => {
  let component: UploadDocumentsScComponent;
  let fixture: ComponentFixture<UploadDocumentsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserDynamicTestingModule
      ],
      declarations: [UploadDocumentsScComponent],
      providers: [
        { provide: OhClaimsService, useClass: OhMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'Private' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadDocumentsScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(UploadDocumentsScComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the component', () => {
    spyOn(component, 'getDocumentCategory');
    component.ngOnInit();
    expect(component.getDocumentCategory).toHaveBeenCalled();
  });
  it('should getDocumentCategory', () => {
    spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
    component.getDocumentCategory();
    expect(component.documentList$).not.toBeNull();
  });
  describe('getDocumentCategory', () => {
    it('should getDocument Category', () => {
      spyOn(component, 'getDocumentCategory');
      component.getDocumentCategory();
      expect(component.getDocumentCategory).toHaveBeenCalled();
    });
  });
  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      component.caseId = 1;
      component.referenceNo = 56435;
      const document: DocumentItem = bindToObject(new DocumentItem(), documentArray[0]);
      spyOn(component.documentService, 'refreshDocument').and.callThrough();
      component.refreshDocument(document);
      expect(component.documentService.refreshDocument).toHaveBeenCalled();
    });
  });
  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      component.caseId = 1;
      component.referenceNo = 56435;
      const document: DocumentItem = bindToObject(new DocumentItem(), documentArray[0]);
      spyOn(component, 'refreshDocument').and.callThrough();
      component.refreshDocument(document);
      expect(component.refreshDocument).toHaveBeenCalled();
    });
  });
  describe('show cancel template', () => {
    it('should show cancel template', () => {
      spyOn(component.modalService, 'show');
      component.showCancelTemplate();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.decline();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('submitClaims', () => {
    it('should documentScanList', () => {
      component.documentScanList = scanDocuments;
      component.submitClaim();
      expect(component.scanSucess).not.toEqual(null);
    });
  });
  describe('confirm cancel', () => {
    it('should confirm cancellation', () => {
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('submitClaim', () => {
    it('should submitClaim', () => {
      component.caseId = 123;
      const form = new Form();
      component.comments = form.createRejectInjuryForm();
      component.documentScanList = scanDocumentsReim;
      spyOn(component, 'submitClaim');
      spyOn(component.claimService, 'submitReimbursement');
      component.documentScanList = scanDocumentsReim;
      component.submitClaim();
      expect(component.feedBackMessage).not.toBe(null);
    });
  });
  describe('submitClaim', () => {
    it('should submitClaim', () => {
      component.caseId = 123;
      component.scanSucess = true;
      const form = new Form();
      component.comments = form.createRejectInjuryForm();
      component.documentScanList = scanDocumentsReim;
      spyOn(component.claimService, 'submitReimbursement').and.callThrough();
      component.submitClaim();
      expect(component.claimService.submitReimbursement).toHaveBeenCalled();
    });
  });
});
