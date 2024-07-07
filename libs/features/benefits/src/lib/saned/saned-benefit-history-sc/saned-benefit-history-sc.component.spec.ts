/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  CoreContributorService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, benefitHistory, ManageBenefitMockService, ModalServiceStub } from 'testing';
import {
  AnnuityResponseDto,
  ManageBenefitService,
  ActiveBenefits,
  ReturnLumpsumService,
  ModifyBenefitService,
  TransactionHistoryDetails,
  AnnuityBenefitTypes
} from '../../shared';
import { SanedBenefitHistoryScComponent } from './saned-benefit-history-sc.component';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('SanedBenefitHistoryScComponent', () => {
  let component: SanedBenefitHistoryScComponent;
  let fixture: ComponentFixture<SanedBenefitHistoryScComponent>;
  const contributorServiceSpy = jasmine.createSpyObj<CoreContributorService>('CoreContributorService', ['selectedSIN']);
  contributorServiceSpy.selectedSIN = 12345678;
  const returnLumpsumServiceSpy = jasmine.createSpyObj<ReturnLumpsumService>('ReturnLumpsumService', [
    'setActiveBenefit'
  ]);
  /*const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAllOccBenefitHistory'
  ]);
  manageBenefitServiceSpy.getAllOccBenefitHistory.and.returnValue(of(null));
const modifyPensionServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'setActiveBenefit'
  ]);*/
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NgxPaginationModule,
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        RouterTestingModule
      ],
      declarations: [SanedBenefitHistoryScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: CoreContributorService, useValue: contributorServiceSpy },
        // { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ManageBenefitService, useClass: ManageBenefitMockService },
        //{ provide: ModifyBenefitService, useValue: modifyPensionServiceSpy },
        DatePipe,
        FormBuilder,
        { provide: ReturnLumpsumService, useValue: returnLumpsumServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SanedBenefitHistoryScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('getAllBenefitHistory', () => {
    it('should getAllBenefitHistory', () => {
      component.getAllBenefitHistory();
      expect(component.getAllBenefitHistory).toBeDefined();
    });
  });
  describe('getAllUiHistory', () => {
    it('should getAllUiHistory', () => {
      component.getAllUiHistory();
      expect(component.getAllUiHistory).toBeDefined();
    });
  });
  it('should onBenefitEntryCLick', () => {
    const sin = 1234;
    const benefitRequestId = 1234;
    const referenceNo = 1234;
    const selectedBenefit = {
      sin: sin,
      benefitRequestId: benefitRequestId,
      benefitType: { english: '', arabic: '' },
      referenceNo: referenceNo
    };
    component.onBenefitEntryCLick({
      ...new ActiveBenefits(sin, benefitRequestId, selectedBenefit.benefitType, referenceNo),
      setBenefitStartDate: null,
      ...selectedBenefit
    });
    expect(component.router.navigate).toHaveBeenCalled();
  });
  xdescribe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });

  describe('sortList', () => {
    it('should sortList', () => {
      component.annuityBenefitHistory = benefitHistory;
      component.sortList();
      expect(component.sortList).toBeDefined();
    });
  });
  xdescribe(' getAllOccBenefitHistory', () => {
    it('should getAllOccBenefitHistory', () => {
      component.getAllOccBenefitHistory();
      component.socialInsuranceNo = 2334342;
      const occType = AnnuityBenefitTypes.OccTypes;
      spyOn(component.manageBenefitService, 'getAllOccBenefitHistory').and.returnValue(of(null));
      component.manageBenefitService.getAllOccBenefitHistory(component.socialInsuranceNo, occType).subscribe(res => {
        component.annuityBenefitHistory = res;
        expect(component.annuityBenefitHistory).toBeNull();
      });
      expect(component.getAllOccBenefitHistory).toBeDefined();
    });
  });
  it('should selectPage', () => {
    component.currentPage = 0;
    component.pageDetails = {
      currentPage: 0,
      goToPage: 1
    };
    component.selectPage(1);
    expect(component.selectPage).toBeDefined();
  });
});
