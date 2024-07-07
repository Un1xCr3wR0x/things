/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContributorTokenDto, RouterData } from '@gosi-ui/core';
import {
  ApplicationTypeToken,
  ContributorToken,
  EnvironmentToken,
  LanguageToken,
  RouterDataToken
} from '@gosi-ui/core/lib/tokens';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub } from 'testing';
//import { ManageBenefitService, AnnuityResponseDto, BenefitRecalculation, HeirRecalculationDetails, HeirAdjustmentDetails, BenefitConstants, DirectPayment } from '../../../../shared';
//import { HeirRecalculationScComponent } from './heir-recalculation-sc.component';
//import { ManageBenefitService, AnnuityResponseDto, BenefitRecalculation, HeirRecalculationDetails, BenefitConstants, DirectPayment, HeirAdjustmentDetails } from '../../../..';
import { HeirRecalculationScComponent } from './heir-recalculation-sc.component';
import {
  ManageBenefitService,
  AnnuityResponseDto,
  BenefitRecalculation,
  HeirRecalculationDetails,
  HeirAdjustmentDetails,
  BenefitConstants,
  DirectPayment
} from '@gosi-ui/features/benefits/lib/shared';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('HeirRecalculationScComponent', () => {
  let component: HeirRecalculationScComponent;
  let fixture: ComponentFixture<HeirRecalculationScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitDetails',
    'getBenefitRecalculation'
  ]);
  manageBenefitServiceSpy.getBenefitDetails.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.getBenefitRecalculation.and.returnValue(
    of({
      ...new BenefitRecalculation(),
      heirRecalculationDetails: {
        ...new HeirRecalculationDetails(),
        netAdjustmentDetails: [{ ...new HeirAdjustmentDetails(), personId: 1234, directPaymentStatus: true }]
      }
    })
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        DatePipe,
        { provide: BsModalService, useClass: ModalServiceStub },
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy }
      ],
      declarations: [HeirRecalculationScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeirRecalculationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('navigateToAdjustmentForHeir', () => {
    it('should navigateToAdjustmentForHeir', () => {
      const personId = 23453245;
      component.navigateToAdjustmentForHeir(personId);
      component.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('navigateToBenefitTab', () => {
    it('should navigateToBenefitTab', () => {
      const benefitDetails = 23453245;
      component.navigateToBenefitTab(benefitDetails);
      component.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('setDirectPaymentRequest', () => {
    it('should setDirectPaymentRequest', () => {
      const directPaymentObj = new DirectPayment();
      component.setDirectPaymentRequest(directPaymentObj);
      expect(component.setDirectPaymentRequest).toBeDefined();
    });
  });
});
