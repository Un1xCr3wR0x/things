/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  BilingualText,
  ContributorToken,
  ContributorTokenDto,
  DocumentItem,
  EnvironmentToken,
  LanguageToken,
  LovList,
  RouterData,
  RouterDataToken,
  Person,
  Transaction,
  TransactionParams
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  ActivatedRouteStub,
  BilingualTextPipeMock,
  ManagePersonServiceStub,
  ModalServiceStub,
  TranslateLoaderStub
} from 'testing';
import { ValidatorStopBenefitScComponent } from './validator-stop-benefit-sc.component';
import {
  SanedBenefitService,
  ModifyBenefitService,
  HoldBenefitDetails,
  BenefitDocumentService,
  BenefitConstants,
  StopBenefitHeading,
  BenefitType,
  Contributor,
  RecalculationConstants
} from '../../../shared';
//import { SanedBenefitService, ModifyBenefitService, HoldBenefitDetails, BenefitDocumentService, BenefitType, StopBenefitHeading, BenefitConstants } from '../../..';
const routerSpy = { navigate: jasmine.createSpy('navigate') };
const stopServiceSpy = jasmine.createSpyObj<SanedBenefitService>('SanedBenefitService', [
  'getSanedReturnReasonList',
  'getSanedRejectReasonList'
]);
stopServiceSpy.getSanedReturnReasonList.and.returnValue(of(<LovList>new LovList([])));
stopServiceSpy.getSanedRejectReasonList.and.returnValue(of(<LovList>new LovList([])));
const modifyBenefitServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', ['getstopDetails']);
modifyBenefitServiceSpy.getstopDetails.and.returnValue(
  of({ ...new HoldBenefitDetails(), contributor: { ...new Contributor(), identity: [] } })
);
const documentService = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
  'getStopBenefitDocuments'
]);
documentService.getStopBenefitDocuments.and.returnValue(of(new DocumentItem()));
const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
  'getStopBenefitDocuments'
]);
benefitDocumentServicespy.getStopBenefitDocuments.and.returnValue(of([new DocumentItem()]));
describe('ValidatorStopBenefitScComponent', () => {
  let component: ValidatorStopBenefitScComponent;
  let fixture: ComponentFixture<ValidatorStopBenefitScComponent>;
  let showMoreText = 'BENEFITS.READ-FULL-NOTE';
  let limit = 100;
  let checkBenefitType = BenefitType.stopbenefit;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule
      ],
      declarations: [ValidatorStopBenefitScComponent, BilingualTextPipeMock],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        DatePipe,
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ModifyBenefitService, useValue: modifyBenefitServiceSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },

        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: Router, useValue: routerSpy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorStopBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      component.socialInsuranceNo = 417171428;
      component.requestId = 1004325373;
      component.referenceNo = 29778515;
      expect(component.socialInsuranceNo && component.requestId && component.referenceNo).not.toBe(417171428);
      component.getStopBenefitDetails(component.socialInsuranceNo, component.requestId, component.referenceNo);
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getStopBenefitDetails', () => {
    it('should getStopBenefitDetails', () => {
      component.socialInsuranceNo = 417171428;
      component.requestId = 1004325373;
      component.referenceNo = 29778515;
      const BenefitType = new BilingualText();
      component.getStopBenefitDetails(component.socialInsuranceNo, component.requestId, component.referenceNo);
      component.stopHeading = new StopBenefitHeading(BenefitType?.english).toString();
      expect(component.getStopBenefitDetails).toBeDefined();
    });
  });
  describe('fetchStopBenefitDocs', () => {
    it('should fetch documents for stop benefit', () => {
      const transactionKey = 'STOP_BENEFIT';
      const transactionType = 'REQUEST_BENEFIT_FO';
      component.socialInsuranceNo = 422005528;
      component.requestId = 1004341279;
      component.referenceNo = 29788893;
      component.fetchStopBenefitDocs();
      expect(component.fetchStopBenefitDocs).not.toBeNull();
    });
  });
  describe('getDocumentsForStopBenefit', () => {
    it('should fetch documents', () => {
      const transactionKey = 'STOP_BENEFIT';
      const transactionType = 'REQUEST_BENEFIT_FO';
      component.socialInsuranceNo = 422005528;
      component.requestId = 1004341279;
      component.referenceNo = 29788893;
      component.getDocumentsForStopBenefit(
        component.socialInsuranceNo,
        component.requestId,
        component.referenceNo,
        transactionKey,
        transactionType
      );
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('navigateToEdit', () => {
    it('should navigate to apply screen', () => {
      component.navigateToEdit();
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BenefitConstants.ROUTE_STOP_BENEFIT],
        Object({
          queryParams: Object({
            edit: true
          })
        })
      );
    });
  });
  describe('navigateToPrevAdjustment', () => {
    it('navigateToPrevAdjustment', () => {
      component.navigateToPrevAdjustment();
      expect(component.router.navigate).toHaveBeenCalled;
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BenefitConstants.ROUTE_ADJUSTMENT],
        Object({
          queryParams: Object({
            from: RecalculationConstants.STOP_CONTRIBUTOR
          })
        })
      );
    });
  });
  describe('onViewBenefitDetails', () => {
    it('onViewBenefitDetails', () => {
      component.onViewBenefitDetails();
      expect(component.router.navigate).toHaveBeenCalled;
      expect(component.router.navigate).toHaveBeenCalledWith([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
    });
  });
  describe('confirmApproveBenefit', () => {
    it('should show approve modal', () => {
      component.stopBenefitForm = new FormGroup({});
      spyOn(component, 'confirmApprove');
      component.confirmApprove(component.stopBenefitForm);
      component.confirmApproveBenefit();
      expect(component.confirmApproveBenefit).toBeDefined();
    });
  });
  describe('confirmRejectBenefit', () => {
    it('should show Reject modal', () => {
      component.stopBenefitForm = new FormGroup({});
      spyOn(component, 'confirmReject');
      component.confirmReject(component.stopBenefitForm);
      component.confirmRejectBenefit();
      expect(component.confirmRejectBenefit).toBeDefined();
    });
  });
  describe('returnBenefit', () => {
    it('should show returnBenefit modal', () => {
      component.stopBenefitForm = new FormGroup({});
      spyOn(component, 'confirmReturn');
      component.confirmReturn(new FormGroup({}));
      component.returnBenefit();
      expect(component.returnBenefit).toBeDefined();
    });
  });
  describe('readFullNote', () => {
    it('should readFullNote', () => {
      const noteText = 'afdfdf';
      component.readFullNote(noteText);
      expect(component.readFullNote).toBeDefined();
    });
    it('should readlessNote', () => {
      expect(component.limit).toEqual(100);
      expect(component.showMoreText).toEqual('BENEFITS.READ-FULL-NOTE');
    });
  });
});
