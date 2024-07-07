/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  bindToObject,
  DocumentItem,
  bindToForm,
  RouterConstants
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  ContributorMockService,
  contributorsTestData,
  CoreEstablishmentServiceStub,
  DocumentServiceStub,
  genericErrorOh,
  initializeTheViewDoctor,
  InjuryMockService,
  OhMockService,
  closeInjuryTestData,
  documentItemDataAudit,
  Form,
  initializeTheViewValidator1,
  reportInjuryFormData
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService
} from '../../../shared';
import { CloseComplicationScComponent } from './close-complication-sc.component';

describe('CloseComplicationScComponent', () => {
  let component: CloseComplicationScComponent;
  let fixture: ComponentFixture<CloseComplicationScComponent>;
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
      declarations: [CloseComplicationScComponent],
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
        { provide: ComplicationService, useClass: OhMockService },
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
    fixture = TestBed.createComponent(CloseComplicationScComponent);
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
  describe('getContributor', () => {
    it('should getContributor', () => {
      component.getContributor();
      expect(component.contributor).not.toBe(null);
    });
  });
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      spyOn(component.router, 'navigate');
      component.ohService.setIsClosed(true);
      component.isClosed = true;
      component.complicationId = 123256;
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewDoctor));
      component.navigateToScan();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/edit?activeTab=3']);
    });
  });
  describe('ngOnInit', () => {
    it('should call ngOnInit', () => {
      spyOn(component.router, 'navigate');
      component.routerData.taskId = null;
      component.ohService.setIsClosed(true);
      component.isClosed = true;
      const routerData = new RouterData().fromJsonToObject(initializeTheViewDoctor);
      component.ohService.setRouterData(routerData);
      component.complicationId = 123256;
      component.ngOnInit();
      expect(component.routerData).not.toEqual(null);
    });
  });
  describe('ngOnInit', () => {
    it('should call ngOnInit', () => {
      spyOn(component.router, 'navigate');
      component.routerData.taskId = null;
      const routerData = new RouterData().fromJsonToObject(initializeTheViewDoctor);
      component.ohService.setRouterData(routerData);
      component.routerData.resourceType = 'Close Complication TPA';
      component.routerData.assignedRole = 'WorkInjuriesandOccupationalDiseasesDoctor';
      component.ngOnInit();
      expect(component.canEdit).toBeTruthy();
    });
  });
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewDoctor));
      component.ohService.setIsClosed(true);
      component.isClosed = true;
      component.complicationId = 123256;
      // component.updateStatus = '';
      // component.previousStatus = 'Cured With Disability';
      component.ngOnInit();
      expect(component.canReturn).toBeFalsy();
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
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('approve transaction', () => {
    it('should trigger the approval popup', () => {
      spyOn(component.router, 'navigate');
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.approveCloseComplicationTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('confirm Approve', () => {
    it('should confirm the approval', () => {
      spyOn(component.router, 'navigate');
      component.modalRef = new BsModalRef();
      spyOn(component.ohService, 'setClosingstatus');
      component.confirmApproveComplication();
      expect(component.ohService.setClosingstatus).toHaveBeenCalled();
    });
    // it('should throw error', () => {
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.confirmApproveComplication();
    //   component.hideModal();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  describe('confirm cancel', () => {
    it('should confirm cancellation', () => {
      spyOn(component.router, 'navigate');
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('should navigate Modify Close Complication', () => {
    it('should navigate to modify Complication status', () => {
      spyOn(component.router, 'navigate');
      component.navigateToStatus();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/validator/modify-close-complication']);
    });
  });
  describe('confirm Approve', () => {
    it('should confirm the approval', () => {
      spyOn(component.router, 'navigate');
      component.modalRef = new BsModalRef();
      component.confirmApproveComplication();
      component.hideModal();
      expect(component.reportInjuryForm.getRawValue()).toBeDefined();
    });
    // it('should throw error', () => {
    //   component.modalRef = new BsModalRef();
    //   spyOn(component.ohService, 'validatorAction').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showError').and.callThrough();
    //   component.confirmApproveComplication();
    //   component.hideModal();
    //   expect(component.showError).toHaveBeenCalled();
    // });
  });
  describe('should navigate view complication page', () => {
    it('should navigate to Complication', () => {
      spyOn(component.router, 'navigate');
      component.registrationNo = contributorsTestData.registrationNo;
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.injuryId = contributorsTestData.injuryId;
      component.complicationId = contributorsTestData.complicationId;
      component['complicationWrapper'].complicationDetailsDto.status = closeInjuryTestData.closedStatus;
      component.viewComplication();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${contributorsTestData.registrationNo}/${contributorsTestData.socialInsuranceNo}/${contributorsTestData.injuryId}/${contributorsTestData.complicationId}/complication/info`
      ]);
    });
  });

  // describe('should navigate Modify Close Complication', () => {
  //   it('should navigate to modify Complication status', () => {
  //     spyOn(component.router, 'navigate');
  //     component.registrationNo = contributorsTestData.registrationNo;
  //     component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
  //     component.injuryId = contributorsTestData.injuryId;
  //     component.viewInjury(this.injuryId);
  //     expect(component.router.navigate).toHaveBeenCalledWith([
  //       `home/oh/view/${component.registrationNo}/${component.socialInsuranceNo}/${component.complicationDetails.injuryDetails.injuryId}/injury/info`
  //     ]);
  //   });
  // });
  describe('show modal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.showModal(modalRef);
      expect(component.showModal).toHaveBeenCalled();
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
      component.requestTpaCloseComplication();
      expect(component.reportInjuryModal.getRawValue()).toBeDefined();
    });
  });
  describe('requestTpaCloseComplication', () => {
    it('should requestTpaCloseComplication', () => {
      component.routerData == initializeTheViewValidator1;
      component.routerData.payload == initializeTheViewValidator1.payload;
      bindToForm(component.reportInjuryForm, reportInjuryFormData);
      spyOn(component, 'requestTpaCloseComplication');
      component.reportInjuryModal.get('comments').setValue(null);
      component.transactionNumber = 123456;
      component.tpaCode = 'GlobeMed';
      component.requestTpaCloseComplication();
      expect(component.requestTpaCloseComplication).toHaveBeenCalled();
    });
  });

  describe('show modal for Clarification', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      const form = new Form();
      component.reportInjuryModal = form.createInjuryModalForm();
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
