/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  bindToObject,
  DocumentItem,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  bindToForm
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError, of } from 'rxjs';
import {
  ActivatedRouteStub,
  ComplicationMockService,
  ContributorMockService,
  DocumentServiceStub,
  InjuryMockService,
  ModalServiceStub,
  OhMockService,
  Form,
  personDataReim,
  documentArray,
  scanDocuments,
  scanDocumentsReim,
  ReimbId,
  genericErrorOh,
  ReimbursementRequestData,
  TabsMockComponent,
  injuryHistoryTestData,
  contactDatas
} from 'testing';
import { ComplicationService, ContributorService, InjuryService, OhService } from '../../../shared/services';
import { ReimbursementClaimsScComponent } from './reimbursement-claims-sc.component';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { OhClaimsService } from '../../services/oh-claims.service';
import { ReimbursementRequestDetails } from '../../models';
import { BrowserModule } from '@angular/platform-browser';

let activatedRoute: ActivatedRouteStub;
activatedRoute = new ActivatedRouteStub();
activatedRoute.setParamMap({
  registrationNo: 12334,
  socialInsuranceNo: 601336235,
  injuryId: 1001956028,
  complicationId: 223344,
  injuryNo: 11111,
  reimbId: 123,
  transactionId: 23355
});

describe('ReimbursementClaimsScComponent', () => {
  let component: ReimbursementClaimsScComponent;
  let fixture: ComponentFixture<ReimbursementClaimsScComponent>;
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
      declarations: [ReimbursementClaimsScComponent],
      providers: [
        FormBuilder,
        BsModalRef,
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: OhService, useClass: OhMockService },
        { provide: OhClaimsService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: TabsetComponent, useClass: TabsMockComponent },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        }
        //{ provide: ActivatedRoute, useValue: activatedRoute }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReimbursementClaimsScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ReimbursementClaimsScComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(' ngOnInit', () => {
    it('should  ngOnInit', () => {
      component.isEdit = true;
      component.reimbId = 123;
      component.referenceNo = 1234;
      spyOn(component, 'getDocumentCategory');
      spyOn(component, 'initializeWizardItems');
      spyOn(component, 'getReimbursementDetails');
      component.ngOnInit();
      expect(component.getDocumentCategory).toHaveBeenCalled();
      expect(component.initializeWizardItems).toHaveBeenCalled();
      //expect(component.getReimbursementDetails).toHaveBeenCalled();
    });
  });
  describe('nextForm', () => {
    it('should fetch next form', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.initializeWizardItems();
      expect(component.reimbursementWizardItem).not.toBe(null);
    });
  });
  describe('show cancel template', () => {
    it('should show cancel template', () => {
      spyOn(component.modalService, 'show');
      component.showCancelTemplate();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe(' setData', () => {
    it('should  call setData', () => {
      spyOn(component, 'setData').and.callThrough();
      component.setData();
      expect(component.setData).toHaveBeenCalled();
    });
  });
  describe('test suite for previousForm', () => {
    it('It should navigate to previous section', () => {
      component.reimbursementWizard = new ProgressWizardDcComponent();
      component.currentTab = 0;
      component.totalTabs = 2;
      component.previousForm();
      expect(component.currentTab).toEqual(-1);
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.modalRef = new BsModalRef();
      spyOn(component, 'nextForm');
      component.cancelModal();
      expect(component.nextForm).toHaveBeenCalled();
    });
  });
  describe('nextForm', () => {
    it('should fetch next form', () => {
      component.currentTab = 1;
      component.totalTabs = 2;
      component.reimbursementWizard = new ProgressWizardDcComponent();
      component.nextForm();
      expect(component.currentTab).not.toBe(null);
    });
  });

  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      component.id = 1;
      component.referenceNo = 56435;
      const document: DocumentItem = bindToObject(new DocumentItem(), documentArray[0]);
      spyOn(component, 'refreshDocument');
      spyOn(component.documentService, 'refreshDocument');
      component.refreshDocument(document);
      expect(component.refreshDocument).toHaveBeenCalled();
    });
  });
  describe('show cancel template', () => {
    it('should show cancel template', () => {
      const TemplateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showModal(TemplateRef, 'lg');
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('confirm cancel', () => {
    it('should confirm cancellation', () => {
      const forms = new Form();
      component.contactForm = forms.getContactMockForm();
      component.amountForm = forms.getAmountForm();
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.modalRef = new BsModalRef();
      spyOn(component, 'cancelModal');
      spyOn(component.modalRef, 'hide');
      component.cancelModal();
      expect(component.cancelModal).toHaveBeenCalled();
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      const forms = new Form();
      component.contactForm = forms.getContactMockForm();
      component.amountForm = forms.getAmountForm();
      component.modalRef = new BsModalRef();
      component.decline();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('selectWizard', () => {
    it('should selectWizard', () => {
      component.selectWizard(2);
      expect(component.currentTab).toEqual(2);
    });
  });
  describe('selectedpayeeList', () => {
    it('should selectedpayeeList', () => {
      const forms = new Form();
      component.payeeListForm = forms.createPayeeListForm();
      component.payeeListForm.addControl(
        'payeeType',
        new FormControl({ arabic: 'شيك شخصي ', english: 'Establishment Number' })
      );
      component.selectedpayeeList('Contributor');
      expect(component.payee).toEqual(2);
    });
  });
  describe('selectedpayeeList', () => {
    it('should selectedpayeeList', () => {
      const forms = new Form();
      component.payeeListForm = forms.createPayeeListForm();
      component.payeeListForm.addControl(
        'payeeType',
        new FormControl({ arabic: 'شيك شخصي ', english: 'Establishment Number' })
      );
      component.selectedpayeeList('Establishment');
      expect(component.payee).toEqual(1);
    });
  });
  describe('selectedbooleanList', () => {
    it('should selectedbooleanList', () => {
      component.selectedbooleanList('Yes');
      expect(component.isTreatmentWithinSaudiArabia).toEqual(true);
    });
  });
  describe('submitClaims', () => {
    it('should documentScanList', () => {
      spyOn(component.router, 'navigate');
      component.documentScanList = scanDocuments;
      const form = new Form();
      component.commentsReimb = form.createRejectInjuryForm();
      component.submitClaim();
      expect(component.scanSucess).not.toEqual(null);
    });
  });
  describe('saveRequest', () => {
    it('should saveRequest', () => {
      component.isEdit = true;
      component.documentScanList = scanDocuments;
      component.currentTab = 2;
      component.totalTabs = 2;
      component.reimbursementWizard = new ProgressWizardDcComponent();
      const forms = new Form();
      component.contactForm = forms.getContactMockForm();
      component.amountForm = forms.getAmountForm();
      //component.contactForm.addControl('contactDetail', new FormGroup({contactModeForm}));
      component.contactForm.get('contactDetail').get('mobileNo').get('primary').setValue(contactDatas.primary);
      component.contactForm
        .get('contactDetail')
        .get('mobileNo')
        .get('isdCodePrimary')
        .setValue(contactDatas.isdCodePrimary);
      component.contactForm
        .get('contactDetail')
        .get('emailId')
        .get('primary')
        .setValue(personDataReim.contactDetail.emailId.primary);
      component.isTreatmentWithinSaudiArabia = true;
      component.payee = 2;
      component.uuid = '6e916bfc-5b86-496c-b109-49545d66977';
      component.reimbId = 1234;
      spyOn(component.ohservice, 'updateReimbursementClaim').and.returnValue(of(1234));
      component.saveRequest();
      expect(component.reimbId).toBe(1234);
    });
    it('should throw error', () => {
      const forms = new Form();
      component.contactForm = forms.getContactMockForm();
      component.amountForm = forms.getAmountForm();
      component.isEdit = true;
      spyOn(component.ohservice, 'updateReimbursementClaim').and.returnValue(throwError(genericErrorOh));
      component.contactForm.get('contactDetail').get('mobileNo').get('primary').setValue(contactDatas.primary);
      component.contactForm
        .get('contactDetail')
        .get('mobileNo')
        .get('isdCodePrimary')
        .setValue(contactDatas.isdCodePrimary);
      component.contactForm
        .get('contactDetail')
        .get('emailId')
        .get('primary')
        .setValue(personDataReim.contactDetail.emailId.primary);
      spyOn(component.alertService, 'showError');
      component.saveRequest();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('saveRequest', () => {
    it('should saveRequest Scenario2', () => {
      component.isEdit = false;
      component.documentScanList = scanDocuments;
      component.currentTab = 2;
      component.totalTabs = 2;
      component.reimbursementWizard = new ProgressWizardDcComponent();
      const forms = new Form();
      component.contactForm = forms.getContactMockForm();
      component.amountForm = forms.getAmountForm();
      component.isTreatmentWithinSaudiArabia = true;
      component.payee = 2;
      component.uuid = '6e916bfc-5b86-496c-b109-49545d66977';
      component.reimbId = 1234;
      spyOn(component.ohservice, 'addReimbursementClaim').and.returnValue(of(ReimbId));
      component.saveRequest();
      expect(component.reimbursementDetails).toBe(ReimbId);
    });
  });
  describe('saveRequest', () => {
    it('should saveRequest Error Scenario2', () => {
      component.isEdit = true;
      component.documentScanList = scanDocuments;
      component.currentTab = 2;
      component.totalTabs = 2;
      component.reimbursementWizard = new ProgressWizardDcComponent();
      const forms = new Form();
      component.contactForm = forms.getContactMockForm();
      component.amountForm = forms.getAmountForm();
      //bindToForm(component.contactForm, personDataReim.contactDetail);
      component.contactForm
        .get('contactDetail')
        .get('mobileNo')
        .get('isdCodePrimary')
        .setValue(contactDatas.isdCodePrimary);
      component.contactForm.get('contactDetail').get('mobileNo').get('primary').setValue(contactDatas.primary);
      component.contactForm.get('contactDetail').get('emailId').get('primary').setValue(null);
      spyOn(component.alertService, 'showError');
      spyOn(component, 'saveRequest');
      component.saveRequest();
      expect(component.saveRequest).toHaveBeenCalled();
    });
    it('should throw error for save', () => {
      const forms = new Form();
      component.contactForm = forms.getContactMockForm();
      component.amountForm = forms.getAmountForm();
      component.contactForm.get('contactDetail').get('mobileNo').get('primary').setValue(contactDatas.primary);
      component.contactForm
        .get('contactDetail')
        .get('mobileNo')
        .get('isdCodePrimary')
        .setValue(contactDatas.isdCodePrimary);
      component.contactForm.get('contactDetail').get('emailId').get('primary').setValue(null);
      component.isEdit = true;
      component.reimbursementWizard = new ProgressWizardDcComponent();
      spyOn(component.ohservice, 'updateReimbursementClaim').and.returnValue(throwError(genericErrorOh));
      spyOn(component.alertService, 'showError');
      component.saveRequest();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  it('should showErrorMessage', () => {
    spyOn(component.alertService, 'showError');
    component.showErrorMessage({ error: 'error' });
    expect(component.alertService.showError).toHaveBeenCalled();
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
  describe('submitClaim', () => {
    it('should submitClaim1', () => {
      component.socialInsuranceNo = 601336235;
      component.registrationNo = 10000602;
      component.complicationId = 123456;
      component.isEdit = true;
      const form = new Form();
      spyOn(component.router, 'navigate');
      component.commentsReimb = form.createRejectInjuryForm();
      component.reimbursementDetails = ReimbId;
      spyOn(component, 'submitClaim');
      spyOn(component.claimService, 'submitReimbursement');
      component.documentScanList = scanDocumentsReim;
      component.submitClaim();
      expect(component.feedBackMessage).not.toBe(null);
    });
  });
  describe('submitClaim', () => {
    it('should submitClaim2', () => {
      component.id = 123;
      component.reimbursementDetails = ReimbId;
      spyOn(component.router, 'navigate');
      component.documentScanList = scanDocuments;
      const form = new Form();
      component.commentsReimb = form.createRejectInjuryForm();
      //component.documentScanList = scanDocumentsReim;
      component.isEdit = true;
      component.scanSucess = true;
      const sucessMessage = {
        english: 'معـلّـق',
        arabic: 'Pending'
      };
      component.complicationId = injuryHistoryTestData.complicationId;
      component.registrationNo = injuryHistoryTestData.registrationNo;
      component.socialInsuranceNo = injuryHistoryTestData.selectedSIN;
      component.injuryId = injuryHistoryTestData.injuryId;
      component.ohService.setInjuryNumber(injuryHistoryTestData.injuryId);
      spyOn(component, 'submitClaim');
      spyOn(component.claimService, 'submitReimbursement').and.returnValue(of(sucessMessage));
      component.documentScanList = scanDocumentsReim;
      component.submitClaim();
      expect(component.complicationId).not.toBe(null);
    });
  });
  describe('submitClaim', () => {
    it('should submitClaim', () => {
      component.id = 123;
      component.reimbursementDetails = ReimbId;
      component.scanSucess = true;
      spyOn(component.router, 'navigate');
      const form = new Form();
      component.commentsReimb = form.createRejectInjuryForm();
      component.documentScanList = scanDocumentsReim;
      spyOn(component.claimService, 'submitReimbursement').and.callThrough();
      component.submitClaim();
      expect(component.claimService.submitReimbursement).toHaveBeenCalled();
    });
  });
  describe('selectedbooleanList', () => {
    it('should selectedbooleanList', () => {
      component.selectedbooleanList('No');
      expect(component.isTreatmentWithinSaudiArabia).toEqual(false);
    });
  });
  describe('getReimbursementDetails', () => {
    it('should getReimbursementDetails', () => {
      component.socialInsuranceNo = 601336235;
      component.registrationNo = 10000602;
      component.complicationId = 223344;
      component.injuryId = 1001956028;
      component.reimbId = ReimbId.reimbursementId;
      const forms = new Form();
      component.payeeListForm = forms.createPayeeListForm();
      component.payeeListForm.addControl(
        'payeeType',
        new FormControl({ arabic: 'شيك شخصي ', english: 'Establishment Number' })
      );
      spyOn(component, 'getReimbursementDetails');
      spyOn(component.claimService, 'getReimbClaim').and.returnValue(
        of(bindToObject(new ReimbursementRequestDetails(), ReimbursementRequestData))
      );
      component.getReimbursementDetails();
      expect(component.reimbDetails).not.toBe(null);
    });
  });

  describe('refresh doc', () => {
    it('should refresh document', () => {
      spyOn(component.documentService, 'refreshDocument').and.callThrough();
      component.refreshDocument(new DocumentItem());
      expect(component.documentService.refreshDocument).toHaveBeenCalled();
    });
  });
});
