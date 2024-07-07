/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  DocumentItem,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  claimSummary,
  ComplicationMockService,
  ContributorMockService,
  documentItemDataAudit,
  DocumentServiceStub,
  filterParams,
  genericError,
  InjuryMockService,
  invoiceData,
  OhMockService,
  paymentSummaryClaims,
  paymentSummaryClaimsForComplication,
  transactionReferenceDataAudit,
  treatmentData,
  previousClaims
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import {
  ClaimSummaryDetails,
  ComplicationService,
  ContributorService,
  InjuryService,
  OhService,
  Pagination,
  ReceiveClarification
} from '../../../shared';
import { ClaimsSummary } from '../../../shared/models/claims-summary';
import { FilterKeyValue } from '../../../shared/models/filier-key-value';
import { InvoiceDetails } from '../../../shared/models/invoice-details';
import { TreatmentService } from '../../../shared/models/treatment-service';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { AuditorClaimDetailsScComponent } from './auditor-claim-details-sc.component';
describe('AuditorClaimDetailsScComponent', () => {
  let component: AuditorClaimDetailsScComponent;
  let fixture: ComponentFixture<AuditorClaimDetailsScComponent>;
  beforeEach(() => {
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
      declarations: [AuditorClaimDetailsScComponent],
      providers: [
        FormBuilder,
        BsModalService,
        BsModalRef,
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: OhClaimsService, useClass: OhMockService },
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
    fixture = TestBed.createComponent(AuditorClaimDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setParamMap({
    tpaCode: 'TCS',
    claimNo: 1234,
    invoiceId: 123,
    invoiceItemId: 123
  });

  afterAll(() => {
    fixture.destroy();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise view', () => {
    it('should initialise view', () => {
      component.pageNo = 123;
      component.routerData.taskId = null;
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      spyOn(component, 'getRouterData').and.callThrough();
      component.ngOnInit();
      expect(component.getRouterData).toHaveBeenCalled();
    });
  });
  describe('should navigateTo paymentSummaryClaims', () => {
    it('should navigateTo paymentSummaryClaims', () => {
      spyOn(component.router, 'navigate');
      component.hideAction = true;
      spyOn(component.claimsService, 'setClaimNo');
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      component.navigateTo(bindToObject(new ClaimSummaryDetails(), paymentSummaryClaims));
      expect(component.claimsService.setClaimNo).toHaveBeenCalled();
    });
  });
  /*describe('should navigateTo paymentSummaryClaimsForDisease', () => {
    it('should navigateTo paymentSummaryClaimsForDisease', () => {
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/claim');
      spyOn(component.router, 'navigate');
      component.hideAction = true;
      component.navigateTo(bindToObject(new ClaimSummaryDetails(), paymentSummaryClaimsForDisease));
      expect(component.diseaseIdMessage).toEqual('OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE');
    });
  });*/
  describe('should navigateTo paymentSummaryClaimsForComplication', () => {
    it('should navigateTo paymentSummaryClaimsForComplication', () => {
      spyOn(component.router, 'navigate');
      component.hideAction = true;
      spyOn(component.claimsService, 'setClaimNo');
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      component.navigateTo(bindToObject(new ClaimSummaryDetails(), paymentSummaryClaimsForComplication));
      expect(component.claimsService.setClaimNo).toHaveBeenCalled();
    });
  });
  describe('should fetchClaim', () => {
    it('should fetchClaim', () => {
      spyOn(component, 'fetchComments').and.returnValue(
        bindToObject(new ReceiveClarification(), transactionReferenceDataAudit)
      );
      spyOn(component, 'documentFetchForAllowance').and.returnValue(
        bindToObject(new DocumentItem(), documentItemDataAudit)
      );
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      component.fetchClaim(bindToObject(new ClaimsSummary(), invoiceData.cases));
      expect(component.claimSummaryDetails).not.toBe(null);
    });
  });
  describe('should fetchClaim', () => {
    it('should fetchClaim', () => {
      spyOn(component, 'fetchComments').and.returnValue(
        bindToObject(new ReceiveClarification(), transactionReferenceDataAudit)
      );
      spyOn(component, 'documentFetchForAllowance').and.returnValue(
        bindToObject(new DocumentItem(), documentItemDataAudit)
      );
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      component.fetchClaim(bindToObject(new ClaimsSummary(), invoiceData.cases));
      expect(component.claimSummaryDetails).not.toBe(null);
    });
  });
  describe('should markAsCompleted', () => {
    it('should markAsCompleted', () => {
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      spyOn(component, 'approveWorkflow').and.callThrough();
      component.markAsCompleted();
      expect(component.approveWorkflow).toHaveBeenCalled();
    });
  });
  describe('should loadMore', () => {
    it('should loadMore', () => {
      const obj = {
        currentPage: 1
      };
      component.pagination = new Pagination();
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      component.loadMore(obj);
      expect(component.pagination.page.pageNo).toEqual(1);
    });
  });
  // describe('get treatment details',()=>{
  //   it('should get treatment  details',()=>{
  //     component.pagination.page.pageNo=0;
  //     component.pageNo=123;
  //    const tpaCode=123;
  //     const  invoiceId=123;
  //     const  invoiceItemId=123;
  //     const pagination=1;
  //     const  filterParams='abc';
  //     spyOn(component.claimsService,'getTreatmentServiceDetails').and.callThrough();
  //     component.getTreatmentDetails(tpaCode,invoiceId,invoiceItemId,pagination,filterParams);
  //     expect(component.claimsService.getTreatmentServiceDetails).toHaveBeenCalled();
  //   })
  // })
  describe('clear', () => {
    it('should clear', () => {
      component.modalRef = new BsModalRef();
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      spyOn(component.modalRef, 'hide');
      component.clear();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('close batch', () => {
    it('should close batch', () => {
      spyOn(component, 'clear');
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      component.closeBatch();
      expect(component.clear).toHaveBeenCalled();
    });
  });
  describe('show Previous Modal', () => {
    it('should  show previous modal', () => {
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showPreviousModal(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  it('should fetchPreviousClaims', () => {
    component.invoiceId = 123;
    spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
    spyOn(component.claimsService, 'fetchPrevioucClaims').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.fetchPreviousClaims(bindToObject(new ClaimsSummary(), previousClaims));
    expect(component.showError).toHaveBeenCalled();
  });
  it('should fetchClaimSummary', () => {
    spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
    spyOn(component.claimsService, 'fetchClaimSummary').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    spyOn(component.claimsService, 'getComments').and.returnValue(
      bindToObject(new ReceiveClarification(), transactionReferenceDataAudit)
    );
    spyOn(component.documentService, 'getOldDocumentContentId').and.returnValue(
      bindToObject(new DocumentItem(), documentItemDataAudit)
    );
    component.fetchClaim(bindToObject(new ClaimsSummary(), invoiceData.cases));
    expect(component.showError).toHaveBeenCalled();
  });
  it('should getTreatmentServiceDetails', () => {
    spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
    spyOn(component.claimsService, 'getTreatmentServiceDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.getTreatmentDetails('TCS', 1232134, 14214, 321, 234);
    expect(component.showError).toHaveBeenCalled();
  });
  it('should getBatchDetails', () => {
    spyOn(component.claimsService, 'getBatchDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.getBatchDetails('TCS', 121);
    expect(component.showError).toHaveBeenCalled();
  });
  it('should getPreviousBatchDetails', () => {
    spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
    spyOn(component.claimsService, 'getBatchDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.getPreviousBatchDetails('globeMed', 121);
    expect(component.showError).toHaveBeenCalled();
  });
  describe('get select PageNo', () => {
    it('should get select pageno', () => {
      spyOn(component, 'getTreatmentDetails');
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      const getselectPageNo = 1;
      component.getselectPageNo(getselectPageNo);
      expect(component.getTreatmentDetails).toHaveBeenCalled();
    });
  });
  describe('get BatchDetails', () => {
    it('should getBatchDetails', () => {
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      const tpaCode = 'TCS';
      const invoiceId = 123;
      spyOn(component.claimsService, 'getBatchDetails').and.returnValue(
        of(bindToObject(new InvoiceDetails(), invoiceData))
      );
      component.getBatchDetails(tpaCode, invoiceId);
      expect(component.batchDetails).not.toBe(null);
    });
  });
  describe('get getPreviousBatchDetails', () => {
    it('should getPreviousBatchDetails', () => {
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      const tpaCode = 'globeMed';
      const invoiceId = 123;
      spyOn(component.claimsService, 'getBatchDetails').and.returnValue(
        of(bindToObject(new InvoiceDetails(), invoiceData))
      );
      component.getPreviousBatchDetails(tpaCode, invoiceId);
      expect(component.batchDetails).not.toBe(null);
    });
  });
  describe('fetch treatment details', () => {
    it('should fetch treatment details', () => {
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      const filter: FilterKeyValue[] = [
        {
          maxAmount: '456',
          minAmount: '123',
          startDate: '30/06/2019',
          endDate: '30/06/2019',
          type: [{ english: 'Saudi Arabic', arabic: 'test' }]
        }
      ];
      spyOn(component, 'getTreatmentDetails');
      component.fetchTreatmentDetails(filter);
      expect(component.getTreatmentDetails).toHaveBeenCalled();
    });
  });
  describe('should applyFilter', () => {
    it('should applyFilter', () => {
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      spyOn(component, 'applyFilter');
      component.applyFilter(filterParams);
      expect(component.invoiceDetails).not.toBe(null);
    });
  });
  describe(' batchModal', () => {
    it('should trigger the batchModal', () => {
      component.previousInvoiceId = 321;
      component.previoustpaCode = 'TCS';
      component.modalRef = new BsModalRef();
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      spyOn(component.claimsService, 'getBatchDetails').and.returnValue(
        of(bindToObject(new InvoiceDetails(), invoiceData))
      );
      component.batchModal(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('AllowanceAuditScComponent', () => {
    it('should get sortDetails for', () => {
      const pagination = {
        page: {
          pageNo: 1,
          size: 10
        },
        sort: {
          column: 'Allowance Date',
          direction: 'ASC',
          directionBoolean: true,
          isDefault: true
        }
      };
      const filterParams = [
        {
          maxAmount: '10000',
          minAmount: '100',
          startDate: '2010-06-15',
          endDate: '2010-06-30',
          type: [
            {
              english: 'paid',
              arabic: ''
            }
          ]
        }
      ];
      component.injuryId = 1009564678;
      component.tpaCode = 'TCS';
      component.invoiceId = 123;
      component.invoiceItemId = 12;
      component.pagination = pagination;
      component.filterParams = filterParams;
      component.getSortDetails(pagination.sort);
      spyOn(component, 'getDocuments').and.returnValue(bindToObject(new DocumentItem(), documentItemDataAudit));
      spyOn(component.claimsService, 'getTreatmentServiceDetails').and.returnValue(
        of(bindToObject(new TreatmentService(), treatmentData))
      );
      expect(component.treatmentDetails).not.toBe(null);
    });
  });
  describe('should rejectTreatment', () => {
    it('should rejectTreatment', () => {
      const tpaCode = 'TCS';
      const invoiceId = 123;
      const invoiceItemId = 123;
      const successMessage = { arabic: 'فرعية', english: 'Kuwait' };
      const pagination = {
        page: {
          pageNo: 1,
          size: 10
        },
        sort: {
          column: 'Allowance Date',
          direction: 'ASC',
          directionBoolean: 'ASC',
          isDefault: true
        }
      };
      const filterParams = [
        {
          maxAmount: 10000,
          minAmount: 100,
          startDate: '2010-06-15',
          endDate: '2010-06-30',
          type: {
            english: 'paid',
            arabic: ''
          }
        }
      ];
      const formArray = new FormArray([]);
      const fb = new FormBuilder();
      formArray.push(
        fb.group({
          comments: ['dffdgdf'],
          serviceDetails: fb.group({
            invoiceItemId: 123,
            serviceRejectionDetails: fb.group({
              disputedUnits: 12,
              rejectionReason: fb.group({
                english: ['frewrew'],
                arabic: ['rewre']
              }),
              serviceId: null
            })
          })
        })
      );
      spyOn(component.claimsService, 'rejectAuditing').and.returnValue(
        of(bindToObject(new BilingualText(), successMessage))
      );
      spyOn(component, 'rejectTreatment');
      component.rejectTreatment(formArray);
      expect(component.auditResponse).not.toBe(null);
    });
  });
});
