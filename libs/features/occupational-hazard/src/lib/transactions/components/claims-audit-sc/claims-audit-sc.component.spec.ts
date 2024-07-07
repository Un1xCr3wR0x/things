/*import { ClaimsAuditScComponent } from "./claims-audit-sc.component";
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, Router } from '@angular/router';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { OhService, InjuryService, ComplicationService, ContributorService, Pagination } from '../../../shared';
import { OhMockService, InjuryMockService, ComplicationMockService, DocumentServiceStub, AlertServiceStub, ContributorMockService, ActivatedRouteStub,filterParams, treatmentData, invoiceData, genericError, claimSummary } from 'testing';
import { DocumentService, AlertService, ApplicationTypeToken, RouterDataToken, RouterData, TransactionService, bindToObject } from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal/public_api';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { of, throwError } from 'rxjs';
import { TreatmentService } from '../../../shared/models/treatment-service';
import { FilterKeyValue } from '../../../shared/models/filier-key-value';
import { InvoiceDetails } from '../../../shared/models/invoice-details';
import { ClaimsSummary } from '../../../shared/models/claims-summary';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
 describe('ClaimsAuditScComponent', () => {
  let component: ClaimsAuditScComponent;
   let fixture: ComponentFixture<ClaimsAuditScComponent>;

   beforeEach(async(() => {
       TestBed.configureTestingModule({
        imports: [
            BrowserModule,
            RouterTestingModule,
            FormsModule,
            ReactiveFormsModule,
            TranslateModule.forRoot(),
            HttpClientTestingModule,
            RouterModule.forRoot([]),
            BrowserDynamicTestingModule
          ],
          declarations: [ClaimsAuditScComponent],
          providers: [
            FormBuilder,
            BsModalService,
            BsModalRef,
            { provide: Router, useValue: routerSpy },
            { provide: OhService, useClass: OhMockService },
            { provide: InjuryService, useClass: InjuryMockService },
            { provide: ComplicationService, useClass: ComplicationMockService },
            { provide: ContributorService, useClass: ContributorMockService },
            { provide: DocumentService, useClass: DocumentServiceStub },
            { provide: AlertService, useClass: AlertServiceStub },
            { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
            { provide: TransactionService, useClass: OhMockService },
            { provide: RouterDataToken,
                useValue: new RouterData().fromJsonToObject(routerMockToken) }
          ],
          schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

       }).compileComponents();
       fixture = TestBed.createComponent(ClaimsAuditScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
   }));
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
  describe(' ngOninit', () => {
    it('getTransactionDetails', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'Reopen Injury',
          arabic: ''
        },
        description: null,
        contributorId: 132123,
        establishmentId: 12434,
        initiatedDate: null,
        lastActionedDate: null,
        status: null,
        channel: null,
        transactionId: 101574,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 1234,
          SIN: 1234,
          REIMBURSEMENT_ID: 132
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.ngOnInit();
      expect(component.injuryId).not.toBe(null);
    });
  });
  describe(' ngOninit else case', () => {
    it('should call router.navigate', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'Reopen Injury',
          arabic: ''
        },
        description: null,
        contributorId: 132123,
        establishmentId: 12434,
        initiatedDate: null,
        lastActionedDate: null,
        status: null,
        channel: null,
        transactionId: 101574,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 1234,
          SIN: 1234
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      expect(component.ngOnInit()).toBe(routerSpy.navigate('../'));
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
      spyOn(component.claimsService, 'getTreatmentServiceDetails').and.returnValue(
        of(bindToObject(new TreatmentService(), treatmentData))
      );
      expect(component.treatmentDetails).not.toBe(null);
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
  describe('show Previous Modal', () => {
    it('should  show previous modal', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showPreviousModal(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
    it('should getPreviousBatchDetails', () => {
        spyOn(component.claimsService, 'getBatchDetails').and.returnValue(throwError(genericError));
        spyOn(component, 'showError').and.callThrough();
        component.getPreviousBatchDetails('globeMed', 121);
        expect(component.showError).toHaveBeenCalled();
      });
      it('should getBatchDetails', () => {
        spyOn(component.claimsService, 'getBatchDetails').and.returnValue(throwError(genericError));
        spyOn(component, 'showError').and.callThrough();
        component.getBatchDetails('TCS', 121);
        expect(component.showError).toHaveBeenCalled();
      });
      it('should fetchPreviousClaims', () => {
        spyOn(component.claimsService, 'fetchPrevioucClaims').and.returnValue(throwError(genericError));
        spyOn(component, 'showError').and.callThrough();
        component.fetchPreviousClaims(bindToObject(new ClaimsSummary(), claimSummary));
        expect(component.showError).toHaveBeenCalled();
      });
      it('should fetchClaimSummary', () => {
        spyOn(component.claimsService, 'fetchClaimSummary').and.returnValue(throwError(genericError));
        spyOn(component, 'showError').and.callThrough();
        component.fetchClaim(bindToObject(new ClaimsSummary(), invoiceData.cases));
        expect(component.showError).toHaveBeenCalled();
      });
      it('should getTreatmentServiceDetails', () => {
        spyOn(component.claimsService, 'getTreatmentServiceDetails').and.returnValue(throwError(genericError));
        spyOn(component, 'showError').and.callThrough();
        component.getTreatmentDetails('TCS', 1232134, 14214, 321, 234);
        expect(component.showError).toHaveBeenCalled();
      });
  });
  describe('get getPreviousBatchDetails', () => {
    it('should getPreviousBatchDetails', () => {
      const tpaCode = 'globeMed';
      const invoiceId = 123;
      spyOn(component.claimsService, 'getBatchDetails').and.returnValue(
        of(bindToObject(new InvoiceDetails(), invoiceData))
      );
      component.getPreviousBatchDetails(tpaCode, invoiceId);
      expect(component.batchDetails).not.toBe(null);
    });
  });
  describe('should applyFilter', () => {
    it('should applyFilter', () => {
      spyOn(component, 'applyFilter');
      component.applyFilter(filterParams);
      expect(component.invoiceDetails).not.toBe(null);
    });
  });
  describe('should fetchClaim', () => {
    it('should fetchClaim', () => {
      component.fetchClaim(bindToObject(new ClaimsSummary(), invoiceData.cases));
      expect(component.claimSummaryDetails).not.toBe(null);
    });
  });
  describe('get select PageNo', () => {
    it('should get select pageno', () => {
      spyOn(component, 'getTreatmentDetails');
      const getselectPageNo = 1;
      component.getselectPageNo(getselectPageNo);
      expect(component.getTreatmentDetails).toHaveBeenCalled();
    });
  });
  describe('get BatchDetails', () => {
    it('should getBatchDetails', () => {
      const tpaCode = 'TCS';
      const invoiceId = 123;
      spyOn(component.claimsService, 'getBatchDetails').and.returnValue(
        of(bindToObject(new InvoiceDetails(), invoiceData))
      );
      component.getBatchDetails(tpaCode, invoiceId);
      expect(component.batchDetails).not.toBe(null);
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
  describe('clear', () => {
    it('should clear', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.clear();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
 });*/
