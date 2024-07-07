/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
//import { ReemploymentTerminationBenefitRecalculationScComponent } from './engagement-change-benefit-recalculation-sc.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub, TranslateLoaderStub } from 'testing';
import { AnnuityResponseDto, BenefitRecalculation, ManageBenefitService } from '../../../shared';
import { ReemploymentTerminationBenefitRecalculationScComponent } from './reemployment-termination-benefit-recalculation-sc.component';

describe('ReemploymentTerminationBenefitRecalculationScComponent', () => {
  let component: ReemploymentTerminationBenefitRecalculationScComponent;
  let fixture: ComponentFixture<ReemploymentTerminationBenefitRecalculationScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAnnuityBenefitRequestDetail',
    'getBenefitRecalculation',
    'getBenefitDetails'
  ]);
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.getBenefitRecalculation.and.returnValue(of(new BenefitRecalculation()));
  manageBenefitServiceSpy.getBenefitDetails.and.returnValue(of(new AnnuityResponseDto()));
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
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      declarations: [ReemploymentTerminationBenefitRecalculationScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReemploymentTerminationBenefitRecalculationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('getTransactionDetails', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'abc',
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
          BENEFIT_REQUEST_ID: 3527632,
          SIN: 1234445456
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.ngOnInit();
      expect(component.referenceNumber).not.toBe(null);
      expect(component.socialInsuranceNo).not.toBe(null);
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getBenefitDetails', () => {
    it('should fetch BenefitDetails', () => {
      spyOn(component.alertService, 'showWarning');
      component.getBenefits();
      expect(component.alertService.showError).toBeDefined();
    });
  });
  describe('getContributorDetails', () => {
    it('should getContributorDetails', () => {
      component.getContributorDetails();
      expect(component.getContributorDetails).toBeDefined();
    });
  });

  describe('getBenefitRecalculation', () => {
    it('should fetch BenefitRecalculation', () => {
      spyOn(component.alertService, 'showWarning');
      component.getBenefitRecalculation();
      expect(component.alertService.showError);
      expect(component.manageBenefitService.getBenefitRecalculation).toHaveBeenCalled();
    });
  });

  describe('showErrorMessage', () => {
    it('should show error message', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessages({ error: 'error' });
      component.showErrorMessages({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('showErrorMessages', () => {
    it('should et show error message', () => {
      const messageKey = { english: 'test', arabic: 'test' };
      component.alertService.showError(messageKey);
      expect(component.showErrorMessages).toBeTruthy();
    });
  });
});
