/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  bindToObject,
  LanguageToken,
  RouterData,
  RouterDataToken,
  DocumentService,
  AlertService,
  LookupService,
  AlertTypeEnum
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  allowanceDetails,
  OhMockService,
  genericErrorOh,
  ComplicationMockService,
  InjuryMockService,
  DocumentServiceStub,
  AlertServiceStub,
  ModalServiceStub,
  ContributorMockService,
  EstablishmentMockService,
  LookupServiceStub
} from 'testing';
import { OhService, ComplicationService, InjuryService, ContributorService, EstablishmentService } from '../../shared';
import { AllowanceWrapper } from '../../shared/models/allowance-details';
import { AllowanceDetailsScComponent } from './allowance-details-sc.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { OhClaimsService } from '../../shared/services/oh-claims.service';
describe('AllowanceDetailsScComponent', () => {
  let component: AllowanceDetailsScComponent;
  let fixture: ComponentFixture<AllowanceDetailsScComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), BrowserModule, BrowserDynamicTestingModule, RouterTestingModule],
      declarations: [AllowanceDetailsScComponent],
      providers: [
        FormBuilder,
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: OhClaimsService, useClass: OhMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: EstablishmentService, useClass: EstablishmentMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'Private' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AllowanceDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
  describe('ngOnit', () => {
    it('ngOnit', () => {
      const messageKey = 'test';
      component.alertService.showSuccessByKey(messageKey, AlertTypeEnum.SUCCESS);
      component.socialInsuranceNo = 60133625;
      component.registrationNo = 12345;
      component.injuryId = 10444213123;
      component.complicationId = 242344324;
      component.injuryNo = 21424324;
      component.ngOnInit();
      expect(component.showHoldInfo).not.toBe(null);
    });
  });
  describe('getData', () => {
    it('should getData', () => {
      component.ohService.setComplicationId(null);
      spyOn(component.router, 'navigate');
      component.complicationId = null;
      spyOn(component.ohService, 'getSocialInsuranceNo');
      component.getData();
      expect(component.socialInsuranceNo).not.toBe(null);
    });
  });
  describe('getAllowanceDetails', () => {
    it('should getAllowanceDetails', () => {
      spyOn(component.ohService, 'getallowanceDetails').and.returnValue(
        of(bindToObject(new AllowanceWrapper(), allowanceDetails))
      );
      component.getAllowanceDetails();
      expect(component.allowanceDetails).not.toBe(null);
    });
  });
  describe('navigateTableView', () => {
    it('should navigateTableView', () => {
      component.navigateTableView();
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('navigateTimelineView', () => {
    it('should navigateTimelineView', () => {
      component.navigateTimelineView();
      expect(component.currentTab).toEqual(0);
    });
  });
  describe('getallowanceDetails', () => {
    it('getallowanceDetails should throw error', () => {
      spyOn(component.ohService, 'getallowanceDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getAllowanceDetails();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getCompanionDetails', () => {
    it('getCompanionDetails should throw error', () => {
      spyOn(component.contributorService, 'getContributor').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getContributor();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getCompanionDetails', () => {
    it('getCompanionDetails should throw error', () => {
      spyOn(component.ohService, 'getBreakUpDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getBreakUpDetails(123, 1324, 1);
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('onEditContent', () => {
    it('onEditContent', () => {
      spyOn(component.router, 'navigate');
      component.complicationId = 234235346;
      component.socialInsuranceNo = 601336235;
      component.registrationNo = 1000602;
      component.injuryNo = 123456;
      component.onEditContent();
      expect(component.router.navigate).toHaveBeenCalledWith([
        'home/oh/view/1000602/601336235/123456/234235346/modify-payee'
      ]);
    });
  });
  describe('onEditContent', () => {
    it('onEditContent', () => {
      spyOn(component.router, 'navigate');
      component.complicationId = null;
      component.socialInsuranceNo = 601336235;
      component.registrationNo = 1000602;
      component.injuryId = 123456;
      component.onEditContent();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/view/1000602/601336235/123456/modify-payee']);
    });
  });
  describe('loadMore', () => {
    it('loadMore have been called', () => {
      const loadMoreobj = {
        currentPage: 1
      };
      component.loadMore(loadMoreobj);
      expect(component.isLoadMore).toBeTruthy();
    });
  });
  describe('onPagination', () => {
    it('Pagination have been called', () => {
      component.onPagination(1);
      expect(component.isPagination).toBeTruthy();
    });
  });
});
