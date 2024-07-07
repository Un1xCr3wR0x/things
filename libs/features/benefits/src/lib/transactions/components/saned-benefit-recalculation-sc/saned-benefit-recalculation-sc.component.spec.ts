/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  GosiCalendar,
  Transaction
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub } from 'testing';
import { SanedBenefitRecalculationScComponent } from './saned-benefit-recalculation-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  SanedBenefitService,
  SanedRecalculation,
  UnemploymentResponseDto,
  BenefitConstants,
  BenefitRecalculation,
  SwitchTitle
} from '../../../shared';

describe('SanedBenefitRecalculationScComponent', () => {
  let component: SanedBenefitRecalculationScComponent;
  let fixture: ComponentFixture<SanedBenefitRecalculationScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const sanedBenefitServiceSpy = jasmine.createSpyObj<SanedBenefitService>('SanedBenefitService', [
    'getBenefitRecalculateDetails',
    'getBenefitRequestDetails',
    'getTransaction'
  ]);
  sanedBenefitServiceSpy.getBenefitRecalculateDetails.and.returnValue(
    of({
      ...new SanedRecalculation(),
      directPaymentStatus: true,
      payForm: new FormGroup({
        checkBoxFlag: new FormControl(true)
      })
    })
  );
  sanedBenefitServiceSpy.getBenefitRequestDetails.and.returnValue(of(new UnemploymentResponseDto()));
  sanedBenefitServiceSpy.getTransaction.and.returnValue(of(new Transaction()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        //{ provide: SanedBenefitService, useValue: sanedBenefitServiceSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
        DatePipe
      ],
      declarations: [SanedBenefitRecalculationScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SanedBenefitRecalculationScComponent);
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
  describe('fetchSanedBenefits', () => {
    it('should fetchSanedBenefits', () => {
      component.fetchSanedBenefits();
      expect(component.fetchSanedBenefits).toBeDefined();
    });
  });
  describe(' getSanedRecalculations', () => {
    it('should  getSanedRecalculations', () => {
      component.getSanedRecalculations();
      component.sanedRecalculationDetails = { ...new SanedRecalculation(), directPaymentStatus: true };
      component.payForm = new FormGroup({
        sanedRecalculationDetails: new FormArray([
          new FormGroup({
            checkBoxFlag: new FormControl(true)
          })
        ])
      });
      expect(component.getSanedRecalculations).toBeDefined();
    });
  });
  describe('viewMaintainAdjustment', () => {
    it('should viewMaintainAdjustment', () => {
      const benefitParam = 'abfdd';
      component.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
      component.viewMaintainAdjustment(benefitParam);
      expect(component.router.navigate).toBeDefined();
    });
    it('should howToCalculate', () => {
      spyOn(component, 'howToCalculate');
      component.howToCalculate({ ...new SanedRecalculation() });
      expect(component.howToCalculate).toHaveBeenCalled();
    });
  });
});
