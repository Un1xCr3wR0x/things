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
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  bindToForm
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  closeInjuryTestData,
  ContributorMockService,
  contributorsTestData,
  CoreEstablishmentServiceStub,
  DocumentServiceStub,
  genericErrorOh,
  initializeTheViewDoctor,
  injuryHistory,
  InjuryMockService,
  OhMockService,
  Form,
  initializeTheViewValidator1,
  reportInjuryFormData
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { ContributorService, EstablishmentService, InjuryService, OhService } from '../../../shared';
import { CloseInjuryScComponent } from './close-injury-sc.component';

describe('CloseInjuryScComponent', () => {
  let component: CloseInjuryScComponent;
  let fixture: ComponentFixture<CloseInjuryScComponent>;
  // const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
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
      declarations: [CloseInjuryScComponent],
      providers: [
        FormBuilder,
        //  { provide: Router, useValue: routerSpy },
        BsModalService,
        BsModalRef,
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
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
    fixture = TestBed.createComponent(CloseInjuryScComponent);
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
      spyOn(component.router, 'navigate');
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewDoctor));
      component.navigateToScan();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/edit?activeTab=3']);
    });
  });
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      component.routerData.taskId = null;
      spyOn(component, 'intialiseTheView');
      component.ngOnInit();
      expect(component.intialiseTheView).toHaveBeenCalled();
    });
  });
  describe('initialise view', () => {
    it('should intialiseTheView', () => {
      component.routerData == initializeTheViewDoctor;
      const payload = JSON.parse(component.routerData.payload);
      component.injuryId = payload.id;
      spyOn(component.injuryService, 'getInjuryDetails').and.callThrough();
      spyOn(component, 'intialiseTheView');
      component.ngOnInit();
      expect(component.intialiseTheView).toHaveBeenCalled();
    });
  });
  describe('initialise view', () => {
    it('should intialiseTheView', () => {
      component.routerData == initializeTheViewDoctor;
      const payload = JSON.parse(component.routerData.payload);
      component.injuryId = 10234577;
      spyOn(component.injuryService, 'getInjuryDetails').and.callThrough();
      spyOn(component, 'intialiseTheView');
      component.ngOnInit();
      expect(component.injuryDetailsWrapper).not.toBe(null);
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
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      spyOn(component.router, 'navigate');
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.reportInjuryForm.getRawValue()).toBeDefined();
    });
  });
  describe('approve transaction', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.approveCloseTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('confirm Approve', () => {
    it('should confirm the approval', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      component.confirmApproveInjury();
      expect(component.reportInjuryForm.getRawValue()).toBeDefined();
    });
  });
  describe('confirm cancel', () => {
    it('should confirm cancellation', () => {
      spyOn(component.router, 'navigate');
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('should navigate Modify Close Injury', () => {
    it('should navigate to modify Injury status', () => {
      spyOn(component.router, 'navigate');
      component.navigateToStatus();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/validator/modify-close-injury']);
    });
  });
  describe('confirm Approve', () => {
    it('should confirm the approval', () => {
      spyOn(component.router, 'navigate');
      component.modalRef = new BsModalRef();
      component.confirmApproveInjury();
      component.hideModal();
      expect(component.reportInjuryForm.getRawValue()).toBeDefined();
    });
    // it('should throw error', () => {
    //   spyOn(component.router, 'navigate');
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.confirmApproveInjury();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  describe('return', () => {
    it('should return the value of action', () => {
      spyOn(component.router, 'navigate');
      const form = new Form();
      component.transactionNumber = 123456;
      component.reportInjuryModal = form.createInjuryModalForm();
      component.modalRef = new BsModalRef();
      component.requestClarification();
      component.hideModal();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
  });
  describe('should navigate Modify Close Injury', () => {
    it('should navigate to modify Injury status', () => {
      spyOn(component.router, 'navigate');
      component.registrationNo = contributorsTestData.registrationNo;
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.injuryId = contributorsTestData.injuryId;
      component['injuryDetailsWrapper'].injuryDetailsDto.injuryStatus = closeInjuryTestData.closedStatus;
      component.viewInjury();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${contributorsTestData.registrationNo}/${contributorsTestData.socialInsuranceNo}/${contributorsTestData.injuryId}/injury/info`
      ]);
    });
  });
  describe('requestTpaClose', () => {
    it('should requestTpaClose', () => {
      component.routerData == initializeTheViewValidator1;
      component.routerData.payload == initializeTheViewValidator1.payload;
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.requestTpaClose();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
  });
  describe('requestTpaClose', () => {
    it('should requestTpaClose', () => {
      component.routerData == initializeTheViewValidator1;
      component.routerData.payload == initializeTheViewValidator1.payload;
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      spyOn(component, 'requestTpaClose');
      component.reportInjuryModal.get('comments').setValue(null);
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.requestTpaClose();
      expect(component.requestTpaClose).toHaveBeenCalled();
    });
  });

  describe('show modal for Clarification', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.showModal(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('should navigate Modify Close Injury', () => {
    it('should navigate to modify Injury status', () => {
      spyOn(component.router, 'navigate');
      component.registrationNo = contributorsTestData.registrationNo;
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.injuryId = contributorsTestData.injuryId;
      component['injuryDetailsWrapper'].injuryDetailsDto.injuryStatus = injuryHistory.status;
      component.viewInjury();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${contributorsTestData.registrationNo}/${contributorsTestData.socialInsuranceNo}/${contributorsTestData.injuryId}/injury/info`
      ]);
    });
  });
  describe('show modal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.showModal(modalRef);
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
});
