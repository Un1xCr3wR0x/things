/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  DocumentItem,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  CoreBenefitService,
  CoreActiveBenefits
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { documentListItemArray, DocumentServiceStub, ModalServiceStub } from 'testing';
import {
  BenefitConstants,
  BenefitDocumentService,
  UITransactionType,
  AnnuityResponseDto,
  ManageBenefitService,
  BenefitResponse,
  ModifyBenefitService,
  ImprisonmentVerifyResponse
} from '../../shared';
import { ImprisonmentModifyScComponent } from './imprisonment-modify-sc.component';
import { DateTypePipe } from '@gosi-ui/foundation-theme/src';
import { DateTypePipeMock } from '../../shared/Mock/date-type-pipe-mock';

describe('ImprisonmentModifyScComponent', () => {
  let component: ImprisonmentModifyScComponent;
  let fixture: ComponentFixture<ImprisonmentModifyScComponent>;
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments'
  ]);
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAnnuityBenefitRequestDetail',
    'registrationNo',
    'socialInsuranceNo',
    'updateAnnuityWorkflow'
  ]);
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.updateAnnuityWorkflow.and.returnValue(of(new BenefitResponse()));
  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', [
    'getRequiredDocuments',
    'refreshDocument',
    'getAllDocuments'
  ]);
  documentServicespy.getRequiredDocuments.and.returnValue(of([new DocumentItem()]));
  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  documentServicespy.getAllDocuments.and.returnValue(of(new DocumentItem()));
  const coreBenefitServiceSpy = jasmine.createSpyObj<CoreBenefitService>('CoreBenefitService', [
    'getSavedActiveBenefit'
  ]);
  coreBenefitServiceSpy.getSavedActiveBenefit.and.returnValue(
    new CoreActiveBenefits(122343, 454565, { arabic: 'التعطل عن العمل (ساند)', english: 'Pension Benefits' }, 2323)
  );
  const modifyPensionServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'getAnnuityDetails',
    'updateImprisonmentDetails',
    'getReqDocsForModifyImprisonment',
    'submitImprisonmentModifyDetails'
  ]);
  modifyPensionServiceSpy.getAnnuityDetails.and.returnValue(new AnnuityResponseDto());
  modifyPensionServiceSpy.updateImprisonmentDetails.and.returnValue(of(new ImprisonmentVerifyResponse()));
  modifyPensionServiceSpy.getReqDocsForModifyImprisonment.and.returnValue(of([new DocumentItem()]));
  modifyPensionServiceSpy.submitImprisonmentModifyDetails.and.returnValue(of(new ImprisonmentVerifyResponse()));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ImprisonmentModifyScComponent, DateTypePipeMock],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: CoreBenefitService, useValue: coreBenefitServiceSpy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: DateTypePipe,
          useClass: DateTypePipeMock
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: ModifyBenefitService, useValue: modifyPensionServiceSpy },
        { provide: DocumentService, useValue: documentServicespy },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprisonmentModifyScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
      expect(component.getDocumentRelatedValues).not.toEqual(null);
    });
  });
  describe('createImprisonmentForm', () => {
    it('should createImprisonmentForm', () => {
      component.createImprisonmentForm();
      expect(component.createImprisonmentForm).toBeDefined();
    });
  });
  describe('submit', () => {
    it('should submit', () => {
      const customDate = {
        gregorian: new Date('2021-04-10T00:00:00.000Z'),
        hijiri: '1442-08-28',
        entryFormat: 'GREGORIAN'
      };
      component.imprisonmentForm = new FormGroup({
        enteringDate: new FormControl({ value: customDate }),
        releaseDate: new FormControl({ value: customDate }),
        prisoner: new FormControl({ value: true }),
        hasCertificate: new FormGroup({ english: new FormControl({ value: 'Yes' }) })
      });
      component.uploadDocumentForm = new FormGroup({
        comments: new FormControl({ value: '' })
      });
      component.inImprisonmentEditMode = false;
      expect(component.imprisonmentForm.valid && component.uploadDocumentForm.valid).toBeDefined();
      expect(component.inImprisonmentEditMode).toBeFalse();
      component.submit();
      expect(component.submit).toBeDefined();
    });
  });
  describe('initialiseViewForEdit', () => {
    it('should initialiseViewForEdit', () => {
      const payload = {
        sin: 502351249,
        benefitRequestId: 100036,
        referenceNo: 1000045428,
        channel: {
          arabic: '',
          english: 'unknown'
        },
        role: 'Validator 1'
      };
      component.initialiseViewForEdit(payload);
      expect(component.initialiseViewForEdit).not.toBe(null);
    });
  });
  describe(' docUploadStatus', () => {
    it('should  docUploadStatus', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      const customDate = {
        gregorian: new Date('2021-04-10T00:00:00.000Z'),
        hijiri: '1442-08-28',
        entryFormat: 'GREGORIAN'
      };
      component.imprisonmentForm = new FormGroup({
        enteringDate: new FormControl({ value: customDate }),
        releaseDate: new FormControl({ value: customDate }),
        prisoner: new FormControl({ value: true }),
        hasCertificate: new FormGroup({ english: new FormControl({ value: 'Yes' }) })
      });
      component.uploadDocumentForm = new FormGroup({
        comments: new FormControl({ value: '' })
      });
      component.docUploadStatus(document);
      expect(component.documentList).not.toBeNull();
    });
  });
  describe(' checkSubmitDisable', () => {
    it('should checkSubmitDisable', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      const customDate = {
        gregorian: new Date('2021-04-10T00:00:00.000Z'),
        hijiri: '1442-08-28',
        entryFormat: 'GREGORIAN'
      };
      component.imprisonmentForm = new FormGroup({
        enteringDate: new FormControl({ value: customDate }),
        releaseDate: new FormControl({ value: customDate }),
        prisoner: new FormControl({ value: true }),
        hasCertificate: new FormGroup({ english: new FormControl({ value: 'Yes' }) })
      });
      component.uploadDocumentForm = new FormGroup({
        comments: new FormControl({ value: '' })
      });
      component.inImprisonmentEditMode = false;
      expect(component.imprisonmentForm.valid && component.uploadDocumentForm.valid).toBeDefined();
      component.checkSubmitDisable(document);
      expect(component.checkSubmitDisable).not.toBeNull();
    });
  });
  describe('setMinimumDate', () => {
    it('should  setMinimumDate', () => {
      const imprisonmentDetails = new AnnuityResponseDto();
      component.setMinimumDate(imprisonmentDetails);
      expect(component.setMinimumDate).toBeDefined();
    });
  });
  describe(' verifyReleaseDate', () => {
    it('should verifyReleaseDate', () => {
      component.verifyReleaseDate();
      const customDate = {
        gregorian: new Date('2021-04-10T00:00:00.000Z'),
        hijiri: '1442-08-28',
        entryFormat: 'GREGORIAN'
      };
      component.imprisonmentForm = new FormGroup({
        enteringDate: new FormControl({ value: customDate }),
        releaseDate: new FormControl({ value: customDate }),
        prisoner: new FormControl({ value: true }),
        hasCertificate: new FormGroup({ english: new FormControl({ value: 'Yes' }) })
      });
      component.uploadDocumentForm = new FormGroup({
        comments: new FormControl({ value: '' })
      });
      component.inImprisonmentEditMode = false;
      expect(component.imprisonmentForm.valid && component.uploadDocumentForm.valid).toBeDefined();
      expect(component.inImprisonmentEditMode).toBeFalse();
      expect(component.verifyReleaseDate).toBeDefined();
    });
  });
  describe('reset', () => {
    it('should reset', () => {
      component.reset();
      expect(component.reset).toBeDefined();
    });
  });
  describe('saveWorkflowInEdit', () => {
    it('should saveWorkflowInEdit', () => {
      const comments = 'comment';
      spyOn(component, 'saveWorkflowInEdit');
      component.saveWorkflowInEdit(comments);
      expect(component.saveWorkflowInEdit).toBeDefined();
    });
  });

  describe('saveWorkflowInEdit', () => {
    it('should saveWorkflowInEdit', () => {
      const comments = 'comment';
      spyOn(component, 'saveWorkflowInEdit');
      component.saveWorkflowInEdit(comments);
      expect(component.saveWorkflowInEdit).toBeDefined();
    });
  });
  // describe('checkMandatoryDocuments', () => {
  //   it('should checkMandatoryDocuments', () => {
  //     component.isAppPrivate = true;
  //     spyOn(component, 'checkDocumentScanned');
  //     component.checkDocumentScanned();
  //     expect(component.checkDocumentScanned).toBeDefined();
  //     component.isAppPrivate = false;
  //     spyOn(component, 'checkDocumentUploaded');
  //     component.checkDocumentUploaded();
  //     expect(component.checkDocumentUploaded).toBeDefined();
  //     component.checkMandatoryDocuments();
  //   });
  // });
  describe('showErrorMessage', () => {
    it('should et show error message', () => {
      const messageKey = { english: 'test', arabic: 'test' };
      component.alertService.showError(messageKey);
      expect(component.showErrorMessage).toBeDefined();
    });
  });
  describe('  getUploadedDocuments', () => {
    it('should   getUploadedDocuments', () => {
      const transactionKey = UITransactionType.RESTORE_LUMPSUM_BENEFIT;
      const transactionType = UITransactionType.FO_REQUEST_SANED;
      component.getUploadedDocuments();
      component.benefitDocumentService
        .getUploadedDocuments(component.benefitRequestId, transactionKey, transactionType, component.referenceNo)
        .subscribe(res => {
          component.documentList = res;
        });
      expect(component.getUploadedDocuments).toBeDefined();
    });
  });
  describe('showErrorMessage', () => {
    it('Should call showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('popUp', () => {
    it('should popUp', () => {
      component.modalRef = new BsModalRef();
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      component.popUp(templateRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  xdescribe('confirmCancel', () => {
    it('should confirmCancel', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
      component.confirmCancel();
    });
  });
  describe('showError', () => {
    it('should call alert service', () => {
      spyOn(component.alertService, 'showError');
      component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('goToTop', () => {
    it('should goToTop', () => {
      component.goToTop();
      expect(component.goToTop).toBeDefined();
    });
  });
  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocument(document);
      expect(component.refreshDocument).not.toBeNull();
    });
  });
});
