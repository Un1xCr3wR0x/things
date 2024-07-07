/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  RouterConstants,
  bindToForm
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  ComplicationMockService,
  ContributorMockService,
  DocumentServiceStub,
  genericErrorOh,
  initializeTheViewFCApprover,
  initializeTheViewGDS,
  initializeTheViewValidator1,
  initializeTheViewValidator2,
  InjuryMockService,
  OhMockService,
  CoreEstablishmentServiceStub,
  validator1ForReopen,
  Form,
  contributorsTestData,
  injuryHistoryTestData,
  initializeTheViewDoctor,
  reportInjuryFormData
} from 'testing';
import {
  ComplicationService,
  ContributorService,
  InjuryService,
  OhService,
  EstablishmentService
} from '../../../shared/services';
import { ReopenInjuryScComponent } from './reopen-injury-sc.component';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { Route } from '../../../shared';
describe('ReopenInjuryScComponent', () => {
  let component: ReopenInjuryScComponent;
  let fixture: ComponentFixture<ReopenInjuryScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        BrowserDynamicTestingModule,
        ModalModule.forRoot()
      ],
      declarations: [ReopenInjuryScComponent],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        BsModalService,
        BsModalRef,
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: RouterDataToken,
          useValue: new RouterData().fromJsonToObject(routerMockToken)
        },
        { provide: EstablishmentService, useValue: CoreEstablishmentServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReopenInjuryScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getInjurySummaryStatistics', () => {
    it('should getInjurySummaryStatistics', () => {
      component.getInjurySummaryStatistics();
      expect(component.injuryStatistics).not.toBe(null);
    });
  });
  describe('getContributor', () => {
    it('should getContributor', () => {
      component.getContributor();
      expect(component.contributor).not.toBe(null);
    });
  });
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator1));
      expect(component.canReturn).toBeFalsy();
    });
  });
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(validator1ForReopen));
      expect(component.canReturn).toBeFalsy();
    });
  });
  describe('intialiseTheView', () => {
    // it('should intialiseTheView', () => {
    //   component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator2));
    //   expect(component.canReturn).toBeTruthy();
    // });
  });
  describe('navigateToInjuryPage', () => {
    it('should navigateToInjuryPage', () => {
      component.navigateToInjuryPage();
      expect(component.routerData.tabIndicator).toEqual(2);
    });
  });
  describe('navigateToScan', () => {
    it('should navigateToScan', () => {
      component.navigateToScan();
      expect(component.routerData.tabIndicator).toEqual(3);
    });
  });
  describe('intialiseTheView', () => {
    // it('should intialiseTheView', () => {
    //   component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewGDS));
    //   expect(component.canReturn).toBeTruthy();
    // });
  });
  describe('intialiseTheView', () => {
    // it('should intialiseTheView', () => {
    //   component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewFCApprover));
    //   expect(component.canReturn).toBeTruthy();
    // });
  });
  describe('getContributor', () => {
    it('getContributor should throw error', () => {
      spyOn(component.contributorService, 'getContributor').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getContributor();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('confirmCancel', () => {
    xit('It should cancel', () => {
      spyOn(component.router, 'navigate');
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('requestTpaReopen', () => {
    xit('It should requestTpaReopen', () => {
      spyOn(component.router, 'navigate');
      component.modalRef = new BsModalRef();
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      component.reportInjuryForm = form.createInjuryForm();
      component.routerData == initializeTheViewValidator2;
      const payload = JSON.parse(component.routerData.payload);
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.tpaRequestedDocs = [];
      component.requestTpaReopen();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('requestTpaReopen', () => {
    it('should requestTpaReopen', () => {
      component.routerData == initializeTheViewValidator1;
      component.routerData.payload == initializeTheViewValidator1.payload;
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.requestTpaReopen();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
  });
  describe('requestTpaReopen', () => {
    it('should requestTpaReopen', () => {
      component.routerData == initializeTheViewValidator1;
      component.routerData.payload == initializeTheViewValidator1.payload;
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      spyOn(component, 'requestTpaReopen');
      component.reportInjuryModal.get('comments').setValue(null);
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.requestTpaReopen();
      expect(component.requestTpaReopen).toHaveBeenCalled();
    });
  });

  /*describe('show modal', () => {
    it('should show modal for Submit', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      const templateNameModifyCom = 'showReturnReopenInjury';
      spyOn(component.modalService, 'show');
      component.showModal(templateRef, templateNameModifyCom);
      expect(component.showConfirmReturnBtnReopenInjury).toBeTruthy();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('show modal', () => {
    it('should show modal for Inspection', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      const templateNameModifyCom = 'showSubmitReopenInjury';
      spyOn(component.modalService, 'show');
      component.showModal(templateRef, templateNameModifyCom);
      expect(component.showConfirmSubmitBtnReopenInjury).toBeTruthy();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('show modal for Clarification', () => {
    it('should show modal', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component, 'showModal');
      const templateNameModifyCom = 'showRequestReopenInjury';
      component.showModal(templateRef, templateNameModifyCom);
      expect(component.showModal).toHaveBeenCalled();
    });
  });*/
  describe('return', () => {
    it('should return the value of action', () => {
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      component.modalRef = new BsModalRef();
      component.returnInjury();
      component.hideModal();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
    // it('should throw error', () => {
    //   const form = new Form();
    //   component.reportInjuryModal = form.createInjuryModalForm();
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.returnInjury();
    //   component.hideModal();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  describe('should navigate to view Injury', () => {
    xit('should navigate to view Injury', () => {
      spyOn(component.router, 'navigate');
      component.registrationNo = contributorsTestData.registrationNo;
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.injuryId = contributorsTestData.injuryId;
      component['injuryDetailsWrapper'].injuryDetailsDto.injuryId = contributorsTestData.injuryId;
      component.viewInjury();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${contributorsTestData.registrationNo}/${contributorsTestData.socialInsuranceNo}/${contributorsTestData.injuryId}/injury/info`
      ]);
    });
  });

  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.approveTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('reject transation', () => {
    it('should trigger the rejection popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.rejectTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('confirm Reject', () => {
    it('should confirm the rejection', () => {
      component.modalRef = new BsModalRef();
      component.confirmRejectInjury();
      component.hideModal();
      expect(component.reportInjuryForm.getRawValue()).toBeDefined();
    });
    // it('should throw error', () => {
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.hideModal();
    //   component.confirmRejectInjury();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  it('should navigate to edit', () => {
    spyOn(component, 'navigateToInjuryPage');
    component.navigateToInjuryPage();
    expect(component.navigateToInjuryPage).toHaveBeenCalledWith();
  });

  it('should navigate to scan', () => {
    spyOn(component, 'navigateToScan');
    component.navigateToScan();
    expect(component.navigateToScan).toHaveBeenCalledWith();
  });
  describe('show cancel modal', () => {
    it('should showcancel modal', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showCancelTemplate(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('cancel modal', () => {
    it('should cancel modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('view injury', () => {
    it('should view injury', () => {
      component.registrationNo = 123456;
      component.socialInsuranceNo = 234556;
      component.injuryDetailsWrapper.injuryDetailsDto.injuryId = injuryHistoryTestData.injuryId;
      component.viewInjury();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${component.registrationNo}/${component.socialInsuranceNo}/${component.injuryDetailsWrapper.injuryDetailsDto.injuryId}/injury/info`
      ]);
    });
  });
  describe('navigate to scan', () => {
    it('should navigate to scan', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewDoctor));
      component.navigateToScan();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/edit?activeTab=3']);
    });
  });
  describe('navigate to injury page', () => {
    it('should navigate to injury page', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewDoctor));
      component.navigateToInjuryPage();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/reopen']);
    });
  });

  describe('show cancel modal', () => {
    it('should showcancel modal', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showCancelTemplate(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('cancel modal', () => {
    it('should cancel modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('view injury', () => {
    it('should view injury', () => {
      component.registrationNo = 123456;
      component.socialInsuranceNo = 234556;
      component.injuryDetailsWrapper.injuryDetailsDto.injuryId = injuryHistoryTestData.injuryId;
      component.viewInjury();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${component.registrationNo}/${component.socialInsuranceNo}/${component.injuryDetailsWrapper.injuryDetailsDto.injuryId}/injury/info`
      ]);
    });
  });
  describe('navigate to scan', () => {
    it('should navigate to scan', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewDoctor));
      component.navigateToScan();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/edit?activeTab=3']);
    });
  });
  describe('navigate to injury page', () => {
    it('should navigate to injury page', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewDoctor));
      component.navigateToInjuryPage();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/reopen']);
    });
  });
});
