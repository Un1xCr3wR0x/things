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
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterConstants,
  RouterData,
  RouterDataToken,
  LovList,
  bindToForm,
  WorkFlowActions
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
  validator1ForModify,
  Form,
  initializeTheViewDoctor,
  lovListMockData,
  contributorsTestData,
  reportInjuryFormData
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { ComplicationService, ContributorService, InjuryService, OhService } from '../../../shared/services';
import { ModifyComplicationScComponent } from './modify-complication-sc.component';

describe('ModifyComplicationScComponent', () => {
  let component: ModifyComplicationScComponent;
  let fixture: ComponentFixture<ModifyComplicationScComponent>;
  //const routerSpy = { navigate: jasmine.createSpy('navigate') };
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
      declarations: [ModifyComplicationScComponent],
      providers: [
        FormBuilder,
        //{ provide: Router, useValue: routerSpy },
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
    fixture = TestBed.createComponent(ModifyComplicationScComponent);
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
  describe('requestTpaModifyComplication', () => {
    it('should requestTpaModifyComplication', () => {
      component.routerData == initializeTheViewValidator1;
      component.routerData.payload == initializeTheViewValidator1.payload;
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.requestTpaModifyComplication();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
  });
  describe('requestTpaModifyComplication', () => {
    it('should requestTpaModifyComplication', () => {
      component.routerData == initializeTheViewValidator1;
      component.routerData.payload == initializeTheViewValidator1.payload;
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      spyOn(component, 'requestTpaModifyComplication');
      component.reportInjuryModal.get('comments').setValue(null);
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.requestTpaModifyComplication();
      expect(component.requestTpaModifyComplication).toHaveBeenCalled();
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
      component.intialiseTheView(new RouterData().fromJsonToObject(validator1ForModify));
      expect(component.canReturn).toBeFalsy();
    });
  });
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
      spyOn(component.router, 'navigate');
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      component.modalRef = new BsModalRef();
      component.returnModifyComplication();
      component.hideModal();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
    // it('should throw error', () => {
    //   const form = new Form();
    //   component.reportInjuryModal = form.createInjuryModalForm();
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.returnModifyComplication();
    //   component.hideModal();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      spyOn(component.router, 'navigate');
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
  describe('confirmInspection', () => {
    it('confirmInspection should throw error', () => {
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      component.transactionNumber = 123;
      component.tpaRequestedDocs = [
        {
          docName: 'MedicalReport'
        }
      ];
      spyOn(component.workflowService, 'mergeAndUpdateTask').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.confirmInspection(null, WorkFlowActions.SEND_FOR_CLARIFICATION);
      expect(component.showError).toHaveBeenCalled();
    });
  });
  /* describe('show modal', () => {
    it('should show modal for Submit', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      const templateNameModifyCom = 'showReturnModifyCom';
      spyOn(component.modalService, 'show');
      component.showModal(templateRef, templateNameModifyCom);
      expect(component.showConfirmReturnBtnModifyCom).toBeTruthy();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('show modal', () => {
    it('should show modal for Inspection', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      const templateNameModifyCom = 'showSubmitModifyCom';
      spyOn(component.modalService, 'show');
      component.showModal(templateRef, templateNameModifyCom);
      expect(component.showConfirmSubmitBtnModifyCom).toBeTruthy();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('show modal for Clarification', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      const templateNameModifyCom = 'showRequestModifyCom';
      component.showModal(modalRef, templateNameModifyCom);
      expect(component.showModal).toHaveBeenCalled();
    });
  });*/
  describe('confirm Reject', () => {
    it('should confirm the rejection', () => {
      component.modalRef = new BsModalRef();
      const fb = new FormBuilder();
      component.transactionNumber = 12345;
      component.rejectReasonList = of(new LovList([]), lovListMockData);
      component.reportInjuryForm.addControl('comments', new FormControl('Test'));
      component.reportInjuryForm.addControl('injuryRejectionReason', fb.group({ english: 'Others', arabic: '' }));
      component.reportInjuryForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
      component.rejectModifyComplication();
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
      spyOn(component.ohService, 'complicationRejection').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.hideModal();
      component.rejectModifyComplication();
      expect(component.showError).toHaveBeenCalled();
    });
  });

  describe('confirm Approve', () => {
    it('should confirm the approval', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
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
  describe('should navigate to Injury', () => {
    it('should navigate to  Injury', () => {
      spyOn(component.router, 'navigate');
      component.navigateToInjuryPage();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/modify']);
    });
  });
  describe('should navigate to view Complication', () => {
    it('should navigate to  view Complication', () => {
      component.registrationNo = contributorsTestData.registrationNo;
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.injuryId = contributorsTestData.injuryId;
      component.complicationId = contributorsTestData.complicationId;
      spyOn(component.router, 'navigate');
      component.viewComplication();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${contributorsTestData.registrationNo}/${contributorsTestData.socialInsuranceNo}/${contributorsTestData.injuryId}/${contributorsTestData.complicationId}/complication/info`
      ]);
    });
  });
  describe('should navigate to view Injury', () => {
    it('should navigate to  view Injury', () => {
      component.registrationNo = contributorsTestData.registrationNo;
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.injuryId = contributorsTestData.injuryId;
      component.complicationDetails.injuryDetails.injuryId = contributorsTestData.complicationId;
      spyOn(component.router, 'navigate');
      component.viewInjury();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${contributorsTestData.registrationNo}/${contributorsTestData.socialInsuranceNo}/${contributorsTestData.complicationId}/injury/info`
      ]);
    });
  });
  describe('should navigate to complication', () => {
    it('should navigate to  complication', () => {
      spyOn(component.router, 'navigate');
      component.navigateToComplicationPage();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/complication/modify']);
    });
  });
  describe('should navigate to injury on edit', () => {
    it('should navigate to injury page', () => {
      spyOn(component.router, 'navigate');
      component.navigate();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/edit']);
    });
  });
  describe('cancel modal', () => {
    it('should cancel modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      spyOn(component.modalRef, 'hide');
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
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
});
