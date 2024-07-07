// TODO: Declaration  missing
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
  RouterConstants,
  RouterData,
  RouterDataToken,
  bindToForm,
  LovList,
  WorkFlowActions,
  bindToObject,
  DocumentItem
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError, of } from 'rxjs';
import {
  ComplicationMockService,
  ContributorMockService,
  DocumentServiceStub,
  genericErrorOh,
  initializeTheViewValidator1,
  InjuryMockService,
  OhMockService,
  Form,
  routerDataComplication,
  reportInjuryFormData,
  lovListMockData,
  documentItemDataAudit
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { ComplicationService, ContributorService, InjuryService, OhService } from '../../../shared/services';
import { RejectComplicationScComponent } from './reject-complication-sc.component';
import { WorkFlowType, ComplicationReject } from '../../../shared';

describe('RejectComplicationScComponent', () => {
  let component: RejectComplicationScComponent;
  let fixture: ComponentFixture<RejectComplicationScComponent>;
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
      declarations: [RejectComplicationScComponent],
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
    fixture = TestBed.createComponent(RejectComplicationScComponent);
    component = fixture.componentInstance;
    spyOn(component, 'documentFetch').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
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
  describe('navigateToScan', () => {
    it('should navigateToScan', () => {
      component.navigateToScan();
      expect(component.routerData.tabIndicator).toEqual(3);
    });
  });
  describe('viewComplication', () => {
    it('should viewComplication', () => {
      component.viewComplication();
      expect(component.ohService.getRoute).not.toBe(null);
    });
  });
  describe('viewInjury', () => {
    it('should viewInjury', () => {
      component.viewInjury();
      expect(component.ohService.getRoute).not.toBe(null);
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
    // it('should intialiseTheView', () => {
    //   component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator2));
    //   expect(component.canReturn).toBeTruthy();
    // });
  });
  describe('intialiseTheView', () => {
    // it('should intialiseTheView', () => {
    //   component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewGDS));
    //   expect(component.canReturn).toBeTruthy();
    // });
  });
  // describe('intialiseTheView', () => {
  //   it('should intialiseTheView', () => {
  //     component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewFCApprover));
  //     expect(component.canReturn).toBeTruthy();
  //   });
  // });

  describe('confirmInspection', () => {
    it('confirmInspection should throw error', () => {
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      component.transactionNumber = 123;
      spyOn(component.workflowService, 'mergeAndUpdateTask').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.confirmInspection(null, WorkFlowActions.SEND_FOR_INSPECTION);
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('complicationScenarios', () => {
    it('should complicationScenarios', () => {
      component.workflowType = WorkFlowType.COMPLICATION;
      component.complicationScenarios(routerDataComplication.payload);
      expect(component.injuryId).not.toBe(null);
    });
  });
  describe('complicationScenarios', () => {
    it('should complicationScenarios', () => {
      component.workflowType = WorkFlowType.REJECT_COMPLICATION;
      component.complicationScenarios(routerDataComplication.payload);
      expect(component.injuryId).not.toBe(null);
    });
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
  describe('requestTpaRejectComplication', () => {
    it('should requestTpaRejectComplication', () => {
      component.routerData == initializeTheViewValidator1;
      component.routerData.payload == initializeTheViewValidator1.payload;
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.requestTpaRejectComplication();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
  });
  describe('requestTpaRejectComplication', () => {
    it('should requestTpaRejectComplication', () => {
      component.routerData == initializeTheViewValidator1;
      component.routerData.payload == initializeTheViewValidator1.payload;
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      spyOn(component, 'requestTpaRejectComplication');
      component.reportInjuryModal.get('comments').setValue(null);
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.requestTpaRejectComplication();
      expect(component.requestTpaRejectComplication).toHaveBeenCalled();
    });
  });

  /*describe('show modal', () => {
    it('should show modal for Submit', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      const templateNameModifyCom = 'showReturnRejectComp';
      spyOn(component.modalService, 'show');
      component.showModal(templateRef,templateNameModifyCom);
      expect(component.showConfirmReturnBtnRejectComp).toBeTruthy();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('show modal', () => {
    it('should show modal for Inspection', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      const templateNameModifyCom = 'showSubmitRejectComp';
      spyOn(component.modalService, 'show');
      component.showModal(templateRef,templateNameModifyCom);
      expect(component.showConfirmSubmitBtnRejectComp).toBeTruthy();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
*/
  describe('return', () => {
    it('should return the value of action', () => {
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      component.modalRef = new BsModalRef();
      component.returnRejectComplication();
      component.hideModal();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
    // it('should throw error', () => {
    //   const form = new Form();
    //   component.reportInjuryModal = form.createInjuryModalForm();
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.returnRejectComplication();
    //   component.hideModal();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.approveRejectComplicationTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('showModal transation', () => {
    it('should trigger the showModal popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.showModal(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('reject transation', () => {
    it('should trigger the rejection popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.rejectComplicationTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('show cancel template', () => {
    it('should show cancel template', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showCancelTemplate(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('confirm Reject', () => {
    it('should confirm the rejection', () => {
      component.modalRef = new BsModalRef();
      const fb = new FormBuilder();
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

  describe('cancel modal', () => {
    it('should cancel modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmCancelRejection();
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
