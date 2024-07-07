/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
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
  bindToForm,
  LovList
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError, of } from 'rxjs';
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
  Form,
  initializeTheViewDoctor,
  injuryHistoryTestData,
  reportInjuryFormData,
  lovListMockData
} from 'testing';
import { ComplicationService, ContributorService, InjuryService, OhService } from '../../../shared/services';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { ReopenComplicationScComponent } from './reopen-complication-sc.component';
import { ComplicationReject } from '../../../shared';

describe('ReopenComplicationScComponent', () => {
  let component: ReopenComplicationScComponent;
  let fixture: ComponentFixture<ReopenComplicationScComponent>;
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
      declarations: [ReopenComplicationScComponent],
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
    fixture = TestBed.createComponent(ReopenComplicationScComponent);
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
  describe('requestTpaModifyComplication', () => {
    it('should requestTpaModifyComplication', () => {
      component.routerData == initializeTheViewValidator1;
      component.routerData.payload == initializeTheViewValidator1.payload;
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.requestTpaReopenComplication();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
  });
  describe('requestTpaModifyComplication', () => {
    it('should requestTpaModifyComplication', () => {
      component.routerData == initializeTheViewValidator1;
      component.routerData.payload == initializeTheViewValidator1.payload;
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      spyOn(component, 'requestTpaReopenComplication');
      component.reportInjuryModal.get('comments').setValue(null);
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.requestTpaReopenComplication();
      expect(component.requestTpaReopenComplication).toHaveBeenCalled();
    });
  });

  /*describe('show modal', () => {
    it('should show modal for Submit', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      const templateNameModifyCom = 'showReopenComplicationReturn';
      spyOn(component.modalService, 'show');
      component.showModal(templateRef,templateNameModifyCom);
      expect(component.showConfirmReturnBtnReopenComplication).toBeTruthy();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('show modal', () => {
    it('should show modal for Inspection', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      const templateNameModifyCom = 'showReopenComplicationSubmit';
      spyOn(component.modalService, 'show');
      component.showModal(templateRef,templateNameModifyCom);
      expect(component.showConfirmSubmitBtnReopenComplication).toBeTruthy();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('show modal for Clarification', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      const templateNameModifyCom = 'showRequestReopenComp';
      component.showModal(modalRef,templateNameModifyCom);
      expect(component.showModal).toHaveBeenCalled();
    });
  });*/
  describe('intialiseTheView', () => {
    // it('should intialiseTheView', () => {
    //   component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator2));
    //   expect(component.canReturn).toBeTruthy();
    // });
  });
  // describe('intialiseTheView', () => {
  //   it('should intialiseTheView', () => {
  //     component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewGDS));
  //     expect(component.canReturn).toBeTruthy();
  //   });
  // });
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
      component.returnComplication();
      component.hideModal();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
    // it('should throw error', () => {
    //   const form = new Form();
    //   component.reportInjuryModal = form.createInjuryModalForm();
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.returnComplication();
    //   component.hideModal();
    //   expect(component.showError).toHaveBeenCalled();
    // });
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

    describe('confirm Reject', () => {
      it('should confirm the rejection', () => {
        component.modalRef = new BsModalRef();
        const fb = new FormBuilder();
        component.injuryRejectDetails = new ComplicationReject();
        component.transactionNumber = 12345;
        component.rejectReasonList = of(new LovList([]), lovListMockData);
        component.reportInjuryForm.addControl('comments', new FormControl('Test'));
        component.reportInjuryForm.addControl('injuryRejectionReason', fb.group({ english: 'Others', arabic: '' }));
        component.reportInjuryForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
        component.confirmRejectComplication();
        component.hideModal();
        expect(component.reportInjuryForm.getRawValue()).toBeDefined();
      });
      it('should throw error', () => {
        component.modalRef = new BsModalRef();
        const fb = new FormBuilder();
        component.transactionNumber = 12345;
        component.rejectReasonList = of(new LovList([]), lovListMockData);
        component.reportInjuryForm.addControl('comments', new FormControl('Test'));
        component.reportInjuryForm.addControl('injuryRejectionReason', fb.group({ english: 'Others', arabic: '' }));
        component.reportInjuryForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
        component.confirmRejectComplication();
        spyOn(component.ohService, 'complicationRejection').and.returnValue(throwError(genericErrorOh));
        spyOn(component, 'showError').and.callThrough();
        component.hideModal();
        component.confirmRejectComplication();
        expect(component.showError).toHaveBeenCalled();
      });
    });
    // it('should throw error', () => {
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.hideModal();
    //   component.confirmRejectComplication();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  describe('confirm Approve', () => {
    it('should confirm the approval', () => {
      component.modalRef = new BsModalRef();
      component.confirmApprove();
      component.hideModal();
      expect(component.reportInjuryForm.getRawValue()).toBeDefined();
    });
    // it('should throw error', () => {
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.confirmApprove();
    //   component.hideModal();
    //   expect(component.showError).toHaveBeenCalled();
    // });
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
      component.transientComplicationDetails.injuryDetails.injuryId = injuryHistoryTestData.injuryId;
      component.viewInjury();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${component.registrationNo}/${component.socialInsuranceNo}/${component.transientComplicationDetails.injuryDetails.injuryId}/injury/info`
      ]);
    });
  });
  describe('view complication', () => {
    it('should view complication', () => {
      component.registrationNo = 123456;
      component.socialInsuranceNo = 234556;
      component.injuryId = injuryHistoryTestData.injuryId;
      component.complicationId = 123456;
      component.viewComplication();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${component.registrationNo}/${component.socialInsuranceNo}/${component.injuryId}/${component.complicationId}/complication/info`
      ]);
    });
  });
  describe('navigate to scan', () => {
    it('should navigate to scan', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewDoctor));
      component.navigateToScan();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/complication/edit?activeTab=3']);
    });
  });
  describe('navigate to complication page', () => {
    it('should navigate to complication page', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewDoctor));
      component.navigateToComplicationPage();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/complication/re-open']);
    });
  });
});
