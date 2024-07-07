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
  RouterConstants,
  RouterData,
  RouterDataToken,
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
  initializeTheViewValidator2,
  InjuryMockService,
  OhMockService,
  Form,
  initializeTheViewValidator1,
  reportInjuryFormData
} from 'testing';
import { ComplicationService, ContributorService, InjuryService, OhService } from '../../../shared/services';
import { ModifyInjuryScComponent } from './modify-injury-sc.component';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';

describe('ModifyInjuryScComponent', () => {
  let component: ModifyInjuryScComponent;
  let fixture: ComponentFixture<ModifyInjuryScComponent>;
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
      declarations: [ModifyInjuryScComponent],
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
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyInjuryScComponent);
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
  /*describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      spyOn(component.router, 'navigate');
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator1));
      component.navigateToScan();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/edit?activeTab=3']); 
    });
  });*/
  // describe('intialiseTheView', () => {
  //   it('should intialiseTheView', () => {
  //     component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator2));
  //     expect(component.canReturn).toBeTruthy();
  //   });
  // });
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

  describe('getEstablishment', () => {
    it('getEstablishment should throw error', () => {
      spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getEstablishment();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getContributor', () => {
    it('getContributor should throw error', () => {
      spyOn(component.contributorService, 'getContributor').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getContributor();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getEngagementDetails', () => {
    it('should getEngagementDetails', () => {
      component.getEngagement();
      expect(component.engagement).not.toBe(null);
    });
  });
  describe('return', () => {
    it('should return the value of action', () => {
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      component.modalRef = new BsModalRef();
      component.returnModifyInjury();
      component.hideModal();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
    // it('should throw error', () => {
    //   const form = new Form();
    //   component.reportInjuryModal = form.createInjuryModalForm();
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.returnModifyInjury();
    //   component.hideModal();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();
      component.confirmCancel();
      expect(component.reportInjuryForm.getRawValue()).toBeDefined();
    });
  });
  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.approveModifyTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('reject transation', () => {
    it('should trigger the rejection popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.rejectModifyTransaction(modalRef);
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
    describe('requestTpaModify', () => {
      it('should requestTpaModify', () => {
        component.routerData == initializeTheViewValidator1;
        component.routerData.payload == initializeTheViewValidator1.payload;
        bindToForm(component.reportInjuryForm, reportInjuryFormData);
        const form = new Form();
        component.reportInjuryModal = form.createInjuryModalForm();
        component.transactionNumber = 123456;
        component.tpaCode = 'GlobeMed';
        component.requestTpaModify();
        expect(component.reportInjuryModal.getRawValue()).toBeDefined();
      });
    });
    describe('requestTpaModify', () => {
      it('should requestTpaModify', () => {
        component.routerData == initializeTheViewValidator1;
        component.routerData.payload == initializeTheViewValidator1.payload;
        bindToForm(component.reportInjuryForm, reportInjuryFormData);
        spyOn(component, 'requestTpaModify');
        component.reportInjuryModal.get('comments').setValue(null);
        component.transactionNumber = 123456;
        component.tpaCode = 'GlobeMed';
        component.requestTpaModify();
        expect(component.requestTpaModify).toHaveBeenCalled();
      });
    });

    /* describe('show modal', () => {
      it('should show modal for Submit', () => {
        const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
        const templateNameModifyCom = 'showReturnModify';
        spyOn(component.modalService, 'show');
        component.showModal(templateRef,templateNameModifyCom);
        expect(component.showConfirmReturnBtnModify).toBeTruthy();
        expect(component.modalService.show).toHaveBeenCalled();
      });
    });
    describe('show modal', () => {
      it('should show modal for Inspection', () => {
        const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
        const templateNameModifyCom =  'showSubmitModify';
        spyOn(component.modalService, 'show');
        component.showModal(templateRef,templateNameModifyCom);
        expect(component.showConfirmSubmitBtnModify).toBeTruthy();
        expect(component.modalService.show).toHaveBeenCalled();
      });
    });
    describe('show modal for Clarification', () => {
      it('should show modal', () => {
        const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
        spyOn(component, 'showModal');
        const templateNameModifyCom = 'showRequestModify';
        component.showModal(templateRef,templateNameModifyCom);
        expect(component.showModal).toHaveBeenCalled();
      });
    });*/
    // it('should throw error', () => {
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.hideModal();
    //   component.confirmRejectInjury();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  describe('confirm Approve', () => {
    it('should confirm the approval', () => {
      component.modalRef = new BsModalRef();
      component.confirmModifyInjury();
      component.hideModal();
      expect(component.reportInjuryForm.getRawValue()).toBeDefined();
    });
    // it('should throw error', () => {
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.confirmModifyInjury();
    //   component.hideModal();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  describe('cancel modal', () => {
    it('should cancel modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  it('should navigate To Injury Page', () => {
    component.navigateToInjuryPage();
    expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/modify']);
  });

  it('should navigate to scan', () => {
    component.navigateToScan();
    expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/edit?activeTab=3']);
  });
  it('should navigate', () => {
    component.navigate();
    expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/edit']);
  });
  describe('show cancel modal', () => {
    it('should showcancel modal', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showCancelTemplate(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
});
