/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService,
  ApplicationTypeToken,
  BilingualText,
  Alert,
  LanguageToken,
  bindToObject
} from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  DocumentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  violationFilterMock,
  violationHistoryListData,
  WorkflowServiceStub
} from 'testing';
import { ViolationHistoryResponse, ViolationRouteConstants } from '../../../shared';
import { ViolationHistoryScComponent } from './violation-history-sc.component';
export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ registrationNo: 12563365 });

describe('ViolationHistoryScComponent', () => {
  let component: ViolationHistoryScComponent;
  let fixture: ComponentFixture<ViolationHistoryScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule, BrowserDynamicTestingModule],
      declarations: [ViolationHistoryScComponent],
      providers: [
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ViolationHistoryScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should set values from params', () => {
      (activatedRouteStub as any).paramMap = of({
        regno: 12563365
      });
      spyOn(component, 'getRecords');
      component.ngOnInit();
      expect(component.getRecords).toHaveBeenCalled();
    });
  });

  describe('route', () => {
    it('should navigate back to inbox', () => {
      spyOn(component.router, 'navigate');
      component.regno = 1234;
      component.navigateToHistoryDetails(12563365);
      expect(component.router.navigate).toHaveBeenCalledWith([
        ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(12563365, 1234)
      ]);
    });
  });
  describe('should selectPage', () => {
    it('selectPage', () => {
      const page = 2;
      component.currentPage = page;
      spyOn(component, 'getRecords').and.callThrough();
      component.paginateHistoryList(page);
      expect(component.getRecords).toHaveBeenCalled();
    });
  });
  describe('searchValues', () => {
    it('getContributorSearchValue', () => {
      spyOn(component, 'getRecords').and.callThrough();
      component.searchHistoryRecords('channel');
      expect(component.historyRequest.searchKey).toBe('channel');
      expect(component.getRecords).toHaveBeenCalled();
    });
    it('getContributorSearchValue', () => {
      spyOn(component, 'getRecords').and.callThrough();
      component.searchHistoryRecords(null);
      expect(component.historyRequest.searchKey).toEqual(undefined);
      expect(component.getRecords).toHaveBeenCalled();
    });
  });
  describe('apply filter', () => {
    it('should apply filter', () => {
      spyOn(component, 'resetPagination').and.callThrough();
      spyOn(component, 'getRecords').and.callThrough();
      component.filterHistoryRecords(violationFilterMock);
      expect(component.filterHistory.period.startDate).toBe(violationFilterMock.period.startDate);
      expect(component.filterHistory.period.endDate).toBe(violationFilterMock.period.endDate);
      expect(component.filterHistory.violationType).toBe(violationFilterMock.violationType);
      expect(component.filterHistory.status).toBe(violationFilterMock.status);
      expect(component.getRecords).toHaveBeenCalled();
    });
  });
  describe('resetPagination', () => {
    it('should resetPagination', () => {
      component.paginationComponent = new PaginationDcComponent(component.language);
      component.resetPagination();
      component.paginationComponent.resetPage();
      expect(component.paginationComponent).toBeDefined();
    });
  });
  describe('getRecords', () => {
    it('should getRecords', () => {
      spyOn(component.establishmentViolationsService, 'getViolationHistory').and.returnValue(
        of(bindToObject(new ViolationHistoryResponse(), violationHistoryListData))
      );
      component.getRecords();
      expect(component.filteredHistory).not.toEqual(null);
      expect(component.establishmentViolationsService.getViolationHistory).toHaveBeenCalled();
    });
    it('should throw error for getRecords', () => {
      spyOn(component.establishmentViolationsService, 'getViolationHistory').and.returnValue(throwError(genericError));
      component.getRecords();
      expect(component.totalItems).toEqual(0);
    });
  });
  describe('showErrorMessage', () => {
    it('Should call showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showErrors({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('set backpath', () => {
    it('Should set backpath', () => {
      component.goToEstProfile();
      expect(component.backPath).not.toBeNull;
    });
  });
});
