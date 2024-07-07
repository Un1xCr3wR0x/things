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
  LovList,
  WorkflowService
} from '@gosi-ui/core';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
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
  lovListMockData,
  WorkflowServiceStub
} from 'testing';
import { ComplicationService, ContributorService, InjuryService, OhService } from '../../../shared/services';
import { AddInjuryScComponent } from './add-injury-sc.component';

describe('AddInjuryScComponent', () => {
  let component: AddInjuryScComponent;
  let fixture: ComponentFixture<AddInjuryScComponent>;
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
        ModalModule.forRoot()
      ],
      declarations: [AddInjuryScComponent],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        BsModalService,
        BsModalRef,
        { provide: OhService, useClass: OhMockService },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
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
    fixture = TestBed.createComponent(AddInjuryScComponent);
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
      component.navigateToInjuryPage();
      expect(component.contributor).not.toBe(null);
    });
  });
  describe('createMap', () => {
    it('should createMap', () => {
      component.injury.latitude = '1234';
      component.injury.longitude = '1234';
      component.createMap();
      expect(component.longitude).not.toBe(null);
    });
  });
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator1));
      //component.navigateToScan();
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
  describe('intialiseTheView', () => {
    // it('should intialiseTheView', () => {
    //   component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewFCApprover));
    //   expect(component.canReturn).toBeTruthy();
    // });
  });
  describe('getEstablishment', () => {
    it('should getEstablishment', () => {
      component.getEstablishment();
      component.navigate();
      expect(component.establishment).not.toBe(null);
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
  describe('return', () => {
    it('should return the value of action', () => {
      component.modalRef = new BsModalRef();
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      component.returnInjury();
      component.hideModal();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
    it('should throw error', () => {
      component.modalRef = new BsModalRef();
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      // component.returnAction();
      component.hideModal();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.reportInjuryForm.getRawValue()).toBeDefined();
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
      const fb = new FormBuilder();
      component.transactionNumber = 12345;
      const lovListMockDatas = {
        items: [
          {
            code: 1001,
            sequence: 1,
            value: {
              arabic: 'Others',
              english: 'Others'
            }
          },
          {
            code: 1002,
            sequence: 2,
            value: {
              arabic: 'arabic',
              english: 'english'
            }
          }
        ]
      };
      component.rejectReasonList = of(new LovList(lovListMockData.items));
      component.reportInjuryForm.addControl('injuryRejectionReason', fb.group({ english: 'Others', arabic: '' }));
      component.reportInjuryForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
      component.confirmRejectInjury();
      component.hideModal();
      expect(component.reportInjuryForm.getRawValue()).toBeDefined();
    });
    /*it('should throw error', () => {
      component.modalRef = new BsModalRef();
      const fb = new FormBuilder();
      component.transactionNumber = 12345;
      component.rejectReasonList = of(new LovList([]), lovListMockData);
      component.reportInjuryForm.addControl('injuryRejectionReason', fb.group({ english: 'Others', arabic: '' }));
      component.reportInjuryForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
      spyOn(component.workflowService, 'mergeAndUpdateTask').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.hideModal();
      component.confirmRejectInjury();
      expect(component.hideModal).toHaveBeenCalled();
     });*/
  });

  describe('confirm Approve', () => {
    it('should confirm the approval', () => {
      component.modalRef = new BsModalRef();
      component.confirmApproveInjury();
      component.hideModal();
      expect(component.reportInjuryForm.getRawValue()).toBeDefined();
    });
    // it('should throw error', () => {
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.confirmApproveInjury();
    //   component.hideModal();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  describe('show modal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.showModal(modalRef);
      expect(component.showModal).toHaveBeenCalled();
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
  describe('show cancel modal', () => {
    it('should showcancel modal', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showCancelTemplate(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('navigate to scan', () => {
    it('should navigate to scan', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewDoctor));
      component.navigateToScan();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/edit']);
    });
  });
});
