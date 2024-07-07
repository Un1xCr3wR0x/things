/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  LovList,
  RouterConstants,
  DocumentService,
  Transaction
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ModalServiceStub, DocumentServiceStub, ManagePersonServiceStub } from 'testing';
import { ValidatorSanedCancellationScComponent } from './validator-saned-cancellation-sc.component';
import { SanedBenefitService, UnemploymentResponseDto, SanedRecalculation } from '../../../../shared';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
//import { SanedBenefitService, UnemploymentResponseDto, SanedRecalculation } from '../../../..';

describe('ValidatorSanedCancellationScComponent', () => {
  let component: ValidatorSanedCancellationScComponent;
  let fixture: ComponentFixture<ValidatorSanedCancellationScComponent>;
  const sanedServiceSpy = jasmine.createSpyObj<SanedBenefitService>('SanedBenefitService', [
    'getSanedInspectionType',
    'getSanedReturnReasonList',
    'getSanedRejectReasonList',
    'getBenefitRequestDetails',
    'getBenefitRecalculateDetails',
    'editDirectPayment',
    'getTransaction'
  ]);
  sanedServiceSpy.getSanedInspectionType.and.returnValue(
    of(
      <LovList>(
        new LovList([{ value: { english: 'Overlapping Engagement', arabic: 'Overlapping Engagement' }, sequence: 0 }])
      )
    )
  );
  sanedServiceSpy.getSanedReturnReasonList.and.returnValue(of(<LovList>new LovList([])));
  sanedServiceSpy.getSanedRejectReasonList.and.returnValue(of(<LovList>new LovList([])));
  sanedServiceSpy.getBenefitRequestDetails.and.returnValue(of(new UnemploymentResponseDto()));
  sanedServiceSpy.getBenefitRecalculateDetails.and.returnValue(of(new SanedRecalculation()));
  sanedServiceSpy.editDirectPayment.and.returnValue(of({}));
  sanedServiceSpy.getTransaction.and.returnValue(of(new Transaction()));
  const payloadData = {
    referenceNo: 100,
    registrationNo: 110000103,
    assignedRole: 'Validator 1',
    resource: RouterConstants.TRANSACTION_BENEFIT_SANED
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidatorSanedCancellationScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: { ...new RouterData(), payload: JSON.stringify(payloadData) }
        },
        { provide: BsModalService, useClass: ModalServiceStub },

        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: SanedBenefitService, useValue: sanedServiceSpy },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorSanedCancellationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialiseView', () => {
    const routerData = { ...new RouterData(), referenceNo: 1024008 };
    component.ngOnInit();
    component.initialiseView(routerData);
    expect(component.transactionNumber).not.toEqual(null);
  });
  it('should getSanedBenefits', () => {
    component.getSanedBenefits();
    expect(component.benefitDetails).not.toEqual(null);
  });
  it('should getSanedRecalculationDetails', () => {
    component.getSanedRecalculationDetails();
    expect(component.sanedRecalculationDetails).not.toEqual(null);
  });
  it('should viewPaymentHistory', () => {
    const benefit = {};
    const benefitType = {};
    component.requestId = 412718968;
    spyOn(component.router, 'navigate');
    component.viewPaymentHistory(benefit, benefitType);
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should viewContributorInfo', () => {
    spyOn(component.router, 'navigate');
    component.viewContributorInfo();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should viewChangeEngagement', () => {
    component.sanedRecalculationDetails = {
      ...new SanedRecalculation(),
      engagementId: 12345678,
      registrationNo: 1003630753,
      modificationRefNo: 1024008
    };
    const traceId = 1025631;
    spyOn(component.router, 'navigate');
    spyOn(component.routerService, 'setRouterDataTokenOnly');
    component.viewChangeEngagement(traceId);
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should approvePaymentSanedInspection', () => {
    component.sanedRecalculationDetails.netAdjustmentAmount = 10;
    component.personId = 101;
    component.requestId = 102;
    component.payForm = new FormGroup({
      checkBoxFlag: new FormControl(true)
    });
    const payload = {
      referenceNo: 100,
      registrationNo: 110000103,
      assignedRole: 'Validator 1',
      resource: RouterConstants.TRANSACTION_BENEFIT_SANED
    };
    const sanedrecal = { ...new SanedRecalculation(), netAdjustmentAmount: 23323 };
    expect(component.payload.assignedRole && component.sanedRecalculationDetails.netAdjustmentAmount).toEqual(
      'Validator 1' && 10
    );
    spyOn(component, 'confirmApprove');
    component.approvePaymentSanedInspection({});
    expect(component.confirmApprove).toHaveBeenCalled();
  });
});
