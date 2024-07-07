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
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationTypeToken, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, BilingualTextPipeMock, ModalServiceStub, TranslateLoaderStub } from 'testing';
import {
  BenefitConstants,
  ReturnLumpsumService,
  AnnuityResponseDto,
  ActiveBenefits,
  ManageBenefitService,
  BenefitDetails
} from '../../shared';
import { LumpsumActiveScComponent } from './lumpsum-active-sc.component';

describe('LumpsumActiveScComponent', () => {
  let component: LumpsumActiveScComponent;
  let fixture: ComponentFixture<LumpsumActiveScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const returnLumpsumServicespy = jasmine.createSpyObj<ReturnLumpsumService>('ReturnLumpsumService', [
    'getActiveBenefitDetails',
    'getSavedActiveBenefit',
    'getIsUserSubmitted'
  ]);
  returnLumpsumServicespy.getSavedActiveBenefit.and.returnValue(
    new ActiveBenefits(2324232, 444323, { arabic: 'التعطل عن العمل (ساند)', english: 'Pension Benefits' }, 7877656)
  );
  returnLumpsumServicespy.getActiveBenefitDetails.and.returnValue(of(new AnnuityResponseDto()));
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitCalculationDetailsByRequestId'
  ]);
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [LumpsumActiveScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: ReturnLumpsumService, useValue: returnLumpsumServicespy },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LumpsumActiveScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      spyOn(component, 'getActiveBenefitDetails');
      spyOn(component, 'getAnnuityCalculation');
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  // describe('getPaymentDetails', () => {
  //   it('should get payment details', () => {
  //     const sin = 367189827;
  //     spyOn(component, 'getPaymentDetails');
  //     component.getPaymentDetails(sin);
  //     expect(component.getPaymentDetails).toBeDefined();
  //   });
  // });

  describe('getActiveBenefitDetails', () => {
    it('should get active benefit details', () => {
      const sin = 367189827;
      const benefitRequestId = 1002210558;
      const referenceNo = 128457;
      component.getActiveBenefitDetails(sin, benefitRequestId, referenceNo);
      expect(component.activeBenefits).not.toBeNull();
    });
  });

  describe('getAnnuityCalculation', () => {
    it('should get annuity calculation', () => {
      const sin = 367189827;
      const benefitRequestId = 1002210558;
      const referenceNo = 10015003;
      component.getAnnuityCalculation(sin, benefitRequestId, referenceNo);
      expect(component.getAnnuityCalculation).not.toBeNull();
    });
  });

  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });

  describe('hideModal', () => {
    it('should hide modal reference', () => {
      component.commonModalRef = new BsModalRef();
      component.hideModal();
      expect(component.hideModal).toBeDefined();
    });
  });

  describe('ShowModal', () => {
    it('should show modal reference', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.commonModalRef).not.toBeNull();
    });
  });

  describe('navigateToToReturnLumpsum', () => {
    it('should navigate to return lumpsum', () => {
      component.navigateToReturnLumpsum();
      expect(component.router.navigate).toHaveBeenCalledWith([BenefitConstants.ROUTE_RETURN_LUMPSUM_BENEFIT]);
    });
  });

  describe('navigateToRestoreLumpsum', () => {
    it('should navigate to restore lumpsum', () => {
      component.navigateToRestoreLumpsum();
      expect(component.router.navigate).toHaveBeenCalledWith([BenefitConstants.ROUTE_RESTORE_LUMPSUM_BENEFIT]);
    });
  });

  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
});
