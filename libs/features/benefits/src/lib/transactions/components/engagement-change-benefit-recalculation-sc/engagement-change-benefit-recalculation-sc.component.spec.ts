/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  EnvironmentToken,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  LanguageToken,
  BilingualText,
  Alert,
  bindToObject,
  AlertService,
  Transaction,
  TransactionParams,
  TransactionService
} from '@gosi-ui/core';

import { EngagementChangeBenefitRecalculationScComponent } from './engagement-change-benefit-recalculation-sc.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub, TranslateLoaderStub, uiBenefits, ModalServiceStub, AlertServiceStub } from 'testing';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AnnuityResponseDto, BenefitRecalculation, ManageBenefitService, BenefitDetails } from '../../../shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';

describe('EngagementChangeBenefitRecalculationScComponent', () => {
  let component: EngagementChangeBenefitRecalculationScComponent;
  let fixture: ComponentFixture<EngagementChangeBenefitRecalculationScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitDetails',
    'getBenefitRecalculation',
    'getAnnuityBenefitRequestDetail',
    'getBenefitCalculationDetailsByRequestId'
  ]);
  manageBenefitServiceSpy.getBenefitDetails.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.getBenefitRecalculation.and.returnValue(of(new BenefitRecalculation()));
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));

  /*const transactionServiceSpy = jasmine.createSpyObj<TransactionService>('TransactionService', [
    'getTransactionDetails'
  ]);
  transactionServiceSpy.getTransactionDetails.and.returnValue({
    ...new Transaction(),
    fromJsonToObject: json => json,
    transactionRefNo: 1234,
    transactionId: 1234,
    businessId: 1234,
    params: {
      ...new TransactionParams(),
      IDENTIFIER: '1234',
      MISC_PAYMENT_ID: 1234
    }
  });*/
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        })
      ],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe,
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy }
        //{provide: TransactionService, useValue: transactionServiceSpy}
      ],
      declarations: [EngagementChangeBenefitRecalculationScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngagementChangeBenefitRecalculationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getBenefitDetails', () => {
    it('should fetch BenefitDetails', () => {
      component.getBenefits();
      //spyOn(component.manageBenefitService,'getBenefitDetails').and.returnValue(of(new AnnuityResponseDto()));
      expect(component.benefitDetails).not.toEqual(null);
    });
  });

  describe('getBenefitRecalculation', () => {
    it('should fetch BenefitRecalculation', () => {
      component.getBenefitRecalculation();
      expect(component.benefitRecalculationDetails).not.toEqual(null);
    });
  });

  describe('showErrorMessage', () => {
    it('should show error message', () => {
      component.showErrorMessages({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.showErrorMessages).toBeDefined();
    });
  });
});
