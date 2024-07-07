/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  bindToObject,
  WorkflowService,
  RouterConstants,
  DocumentService,
  DocumentItem
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError, of } from 'rxjs';
import {
  AlertServiceStub,
  OhMockService,
  initializeTheViewDoctor,
  genericErrorOh,
  allowance,
  contributorSearchTestData,
  allowanceSummary,
  InjuryMockService,
  ComplicationMockService,
  ContributorMockService,
  DocumentServiceStub,
  ActivatedRouteStub,
  transactionReferenceDataAudit,
  documentItemDataAudit
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { AllowanceAuditOhScComponent } from './allowance-audit-oh-sc.component';
import { AllowanceSummary } from '../../../shared/models/allowance-summary';
import {
  Contributor,
  Pagination,
  AuditorFilterParams,
  InjuryService,
  ContributorService,
  ComplicationService,
  OhService,
  ReceiveClarification
} from '../../../shared';
describe('AllowanceAuditOhScComponent', () => {
  let component: AllowanceAuditOhScComponent;
  let fixture: ComponentFixture<AllowanceAuditOhScComponent>;
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
      declarations: [AllowanceAuditOhScComponent],
      providers: [
        FormBuilder,
        BsModalService,
        BsModalRef,
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: OhClaimsService, useClass: OhMockService },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkflowService, useClass: OhMockService },
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
    fixture = TestBed.createComponent(AllowanceAuditOhScComponent);
    component = fixture.componentInstance;
    spyOn(component.router, 'navigate');
    fixture.detectChanges();
  });
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setParamMap({
    tpaCode: 'TCS',
    auditNo: 1234,
    invoiceId: 123,
    invoiceItemId: 123
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*describe('AllowanceAuditOhScComponent', () => {
    it('should getAuditDetails', () => {
      component.auditNo = 59;
      component.getAuditDetails();
      expect(component.auditDetails).not.toBe(null);
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
     it('should navigateTo Injury', () => {
       const allowanceDetails = {
         caseId: 23443,
         injuryNo: 342324434,
         registrationNo: 32432443243,
         socialInsuranceNo: 433455,
         isViewed: false,
         auditDetail: null,
         totalAllowances: 4332,
         newAllowances: 345,
         ohType: 'Injury',
         treatmentPeriod: null,
         cchiNo: null,
         providerName: [{ arabic: '', english: '' }]
       };
       spyOn(component, 'navigateTo');
       component.navigateTo(allowanceDetails);
       expect(component.router.navigate).toHaveBeenCalled();
     });
   });*/
  /* describe('AllowanceAuditOhScComponent', () => {
     it('should navigateTo Complication', () => {
       const allowanceDetails = {
         caseId: 23443,
         injuryNo: 342324434,
         registrationNo: 32432443243,
         socialInsuranceNo: 433455,
         isViewed: false,
         auditDetail: null,
         totalAllowances: 4332,
         newAllowances: 345,
         ohType: 'Complication',
         treatmentPeriod: null,
         cchiNo: null,
         providerName: [{ arabic: '', english: '' }]
       };
       spyOn(component, 'navigateTo');
       component.navigateTo(allowanceDetails);
       expect(component.router.navigate).toHaveBeenCalled();
     });
   });*/
  describe('AllowanceAuditOhScComponent', () => {
    it('should show message to viewe disease', () => {
      const allowanceDetails = {
        caseId: 23443,
        injuryNo: 342324434,
        workItemReadStatus: false,
        registrationNo: 32432443243,
        socialInsuranceNo: 433455,
        isViewed: false,
        auditDetail: null,
        totalAllowances: 4332,
        newAllowances: 345,
        ohType: 'Disease',
        treatmentPeriod: null,
        cchiNo: null,
        providerName: [{ arabic: '', english: '' }]
      };
      component.navigateTo(allowanceDetails);
      expect(component.diseaseIdMessage).not.toBe(null);
    });
  });
  /* describe('AllowanceAuditOhScComponent', () => {
     it('should filter AuditDetails for', () => {
       component.auditNo = 59;
       component.injuryId = 1009564678;
       component.applyAllowanceFilter(allowanceFilter);
       expect(component.allowanceDetails).not.toBe(null);
     });
   });*/
  describe('filter AuditDetails', () => {
    it('should throw error', () => {
      component.auditNo = 59;
      const filterParams = new AuditorFilterParams();
      spyOn(component['claimsService'], 'filterAuditDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.applyFilter(filterParams);
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should getAuditDetails', () => {
      spyOn(component['claimsService'], 'getAuditDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getAuditDetails();
      expect(component.showError).toHaveBeenCalled();
    });
    it('should fetchAllowance', () => {
      spyOn(component, 'fetchComments').and.returnValue(
        bindToObject(new ReceiveClarification(), transactionReferenceDataAudit)
      );
      spyOn(component, 'documentFetchForAllowance').and.returnValue(
        bindToObject(new DocumentItem(), documentItemDataAudit)
      );
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      component.fetchAllowance(bindToObject(allowance, new AllowanceSummary()));
      expect(component.registrationNo).not.toBe(null);
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should fetchAllowanceDetails', () => {
      component.fetchAllowanceDetails(123144546);
      expect(component.allowanceDetails).not.toBe(null);
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should fetchALLAllowance', () => {
      component.fetchAllAllowance(allowanceSummary.allowancePeriod);
      expect(component.allowanceDetails).not.toBe(null);
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should rejectEvent', () => {
      spyOn(component.alertService, 'clearAllErrorAlerts').and.callThrough();
      component.modalRef = new BsModalRef();
      const details = {
        caseId: 213214
      };
      component.auditNo = 23426;
      component.rejectEvent(details);
      expect(component.alertService.clearAllErrorAlerts).toHaveBeenCalled();
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should rejectEvent', () => {
      spyOn(component['claimsService'], 'rejectAllowance').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      const details = {
        caseId: 213214
      };
      component.rejectEvent(details);
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should fetchAllowanceDetails', () => {
      spyOn(component['claimsService'], 'filterAllowanceDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.fetchAllowanceDetails(13424);
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should fetchAllowanceDetails', () => {
      spyOn(component['claimsService'], 'filterPrevAllowanc').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.fetchAllowanceDetails(13424);
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should getContributor', () => {
      component.getContributor();
      expect(component.contributor).not.toBe(null);
    });
  });
  describe('getContributor', () => {
    it('should getContributor', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      spyOn(component.contributorService, 'getContributor').and.returnValue(
        of(bindToObject(new Contributor(), contributorSearchTestData))
      );
      component.getContributor();
      expect(component.contributor).not.toBe(null);
    });
  });
  describe('getContributor', () => {
    it('should getContributor', () => {
      spyOn(component.contributorService, 'getContributor').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getContributor();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should fetchAllowanceSummary', () => {
      component.routerData == initializeTheViewDoctor;
      component.auditNo = 59;
      component.fetchAllowanceSummary(10012453246);
      expect(component.auditSummary).not.toBe(null);
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should fetchAllowanceSummary', () => {
      spyOn(component['claimsService'], 'fetchAllowanceSummary').and.returnValue(throwError(genericErrorOh));
      spyOn(component['claimsService'], 'fetchPreviousAllowanceSummary').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.fetchAllowanceSummary(10012453246);
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should markAsCompleted', () => {
      component.modalRef = new BsModalRef();
      spyOn(component, 'approveWorkflow').and.callThrough();
      component.markAsCompleted();
      expect(component.approveWorkflow).toHaveBeenCalled();
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should sortAllowances', () => {
      component.modalRef = new BsModalRef();
      spyOn(component, 'approveWorkflow').and.callThrough();
      const sortParams = {
        column: 1,
        direction: 'DESC',
        directionBooleanp: false
      };
      component.sortAllowances(sortParams);
      expect(component.allowanceDetails).not.toBe(null);
    });
  });
  describe('AllowanceAuditOhScComponent', () => {
    it('should markAsCompleted', () => {
      component.modalRef = new BsModalRef();
      spyOn(component['workflowService'], 'updateTaskWorkflow').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.approveWorkflow();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('should loadMore', () => {
    it('should loadMore', () => {
      const obj = {
        currentPage: 1
      };
      component.pagination = new Pagination();
      component.loadMore(obj);
      expect(component.pagination.page.pageNo).toEqual(1);
    });
  });
  describe('show modal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.showModal(modalRef, 'modal-md');
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.clear();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  /*describe('navigate to page', () => {
     it('should navigate to inbox', () => {
        spyOn(component, 'navigateToInbox');
       component.navigateToInbox();
       expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
     });
  });*/
});
