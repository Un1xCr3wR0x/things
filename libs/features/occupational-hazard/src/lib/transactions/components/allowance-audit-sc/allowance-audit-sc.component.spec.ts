/*import { ComponentFixture, TestBed, async } from '@angular/core/testing';

  import { AllowanceAuditScComponent } from './allowance-audit-sc.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal/public_api';
import { Router } from '@angular/router';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { OhMockService, AlertServiceStub, genericErrorOh, allowance, contributorSearchTestData, initializeTheViewDoctor } from 'testing';
import { WorkflowService, LanguageToken, AlertService, ApplicationTypeToken, RouterDataToken, RouterData, bindToObject, Contributor } from '@gosi-ui/core';
import { BehaviorSubject, throwError, of } from 'rxjs';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AuditorFilterParams, Pagination } from '../../../shared';
import { AllowanceSummary } from '../../../shared/models/allowance-summary';

   describe('AllowanceAuditScComponent', () => {
     let component: AllowanceAuditScComponent;
    let fixture: ComponentFixture<AllowanceAuditScComponent>;
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
          declarations: [AllowanceAuditScComponent],
          providers: [
            FormBuilder,
            BsModalService,
            BsModalRef,
            { provide: Router, useValue: routerSpy },
            { provide: OhClaimsService, useClass: OhMockService },
            { provide: WorkflowService, useClass: OhMockService },
            { provide: LanguageToken, useValue: new BehaviorSubject('en') },
            { provide: AlertService, useClass: AlertServiceStub },
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
        fixture = TestBed.createComponent(AllowanceAuditScComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
      it('should create', () => {
        expect(component).toBeTruthy();
      });
      describe('AllowanceAuditScComponent', () => {
        it('should getAuditDetails', () => {
          component.auditNo = 59;
          component.getAuditDetails();
          expect(component.auditDetails).not.toBe(null);
        });
      });
      describe('AllowanceAuditScComponent', () => {
        it('should getAuditDetails', () => {
          spyOn(component['claimsService'], 'getAuditDetails').and.returnValue(throwError(genericErrorOh));
          spyOn(component, 'showError').and.callThrough();
          component.getAuditDetails();
          expect(component.showError).toHaveBeenCalled();
        });
      });
      describe('AllowanceAuditScComponent', () => {
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
          component.navigateTo(allowanceDetails);
          expect(component.router.navigate).toHaveBeenCalled();
        });
      });
      describe('AllowanceAuditScComponent', () => {
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
          component.navigateTo(allowanceDetails);
          expect(component.router.navigate).toHaveBeenCalled();
        });
      });
      describe('AllowanceAuditScComponent', () => {
        it('should show message to viewe disease', () => {
          const allowanceDetails = {
            caseId: 23443,
            injuryNo: 342324434,
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
      describe('AllowanceAuditScComponent', () => {
        it('should fetchAllowance', () => {
          component.fetchAllowance(bindToObject(allowance, new AllowanceSummary()));
          expect(component.registrationNo).not.toBe(null);
        });
      });
      describe('AllowanceAuditScComponent', () => {
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
      describe('AllowanceAuditScComponent', () => {
        it('should fetchAllowanceSummary', () => {
          component.routerData == initializeTheViewDoctor;
          component.auditNo = 59;
          component.fetchAllowanceSummary(10012453246);
          expect(component.auditSummary).not.toBe(null);
        });
      });
    
      describe('AllowanceAuditScComponent', () => {
        it('should fetchAllowanceSummary', () => {
          spyOn(component['claimsService'], 'fetchAllowanceSummary').and.returnValue(throwError(genericErrorOh));
          spyOn(component['claimsService'], 'fetchPreviousAllowanceSummary').and.returnValue(throwError(genericErrorOh));
          spyOn(component, 'showError').and.callThrough();
          component.fetchAllowanceSummary(10012453246);
          expect(component.showError).toHaveBeenCalled();
        });
      });
      describe('AllowanceAuditScComponent', () => {
        it('should sortAllowances', () => {
          component.modalRef = new BsModalRef();
          const sortParams = {
            column: 1,
            direction: 'DESC',
            directionBooleanp: false
          };
          component.sortAllowance(sortParams);
          expect(component.allowanceDetails).not.toBe(null);
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
    
    
 });*/
