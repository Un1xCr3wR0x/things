import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdjustmentDetailsScComponent } from './adjustment-details-sc.component';
import {
  AdjustmentService,
  AdjustmentDetails,
  PaymentService,
  BeneficiaryList,
  BenefitDetails,
  Adjustment,
  PersonalInformation,
  MonthlyDeductionEligibility,
  ThirdpartyAdjustmentService,
  EligibilityDetails,
  AdjustmentLookupService,
  Eligibility,
  Messages,
  PaymentRoutesEnum
} from '../../../shared';
import { of } from 'rxjs';
import { activeAdjustments, benefits, adjustmentModificationById } from '../../../shared/test-data/adjustment';
import {
  AlertService,
  DocumentService,
  RouterDataToken,
  RouterData,
  bindToObject,
  BilingualText,
  Alert,
  FilterKeyValue,
  Lov,
  LovList,
  CoreAdjustmentService
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock,
  NumToPositiveTextPipeMock
} from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

describe('AdjustmentDetailsScComponent', () => {
  let component: AdjustmentDetailsScComponent;
  let fixture: ComponentFixture<AdjustmentDetailsScComponent>;
  const adjustFilter = {
    adjustmentId: 1614,
    adjustmentSortParam: 'BENEFIT_REQUEST_DATE',
    adjustmentStatus: [{ arabic: 'جديد', english: 'New' }],
    adjustmentType: [
      {
        arabic: 'مدين',
        english: 'Debit'
      }
    ],
    benefitRequestStartDate: new Date('Thu Jul 01 2021 13:34:35 GMT+0300 (Arabian Standard Time)'),
    benefitRequestStopDate: new Date('Sat Jul 03 2021 13:34:35 GMT+0300 (Arabian Standard Time)'),
    benefitType: [
      {
        arabic: 'معاش تقاعد',
        english: 'Old Age-Normal Retirement Pension'
      },
      {
        arabic: 'معاش التعطل عن العمل',
        english: 'Saned Pension'
      }
    ],
    identifier: 1034681524,
    sortType: 'ASCENDING',
    startDate: new Date('Thu Jul 01 2021 13:34:35 GMT+0300 (Arabian Standard Time)'),
    stopDate: new Date('Sat Jul 03 2021 13:34:35 GMT+0300 (Arabian Standard Time)')
  };
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'getAdjustmentsByStatus',
    'getBeneficiaryList',
    'adjustmentDetails',
    'getAdjustmentByeligible',
    'setPageName',
    'getPerson',
    'getAdjustByDetail',
    'setSourseId',
    'getSourceId'
  ]);
  adjustmentServiceSpy.getAdjustmentsByStatus.and.returnValue(
    of(bindToObject(new AdjustmentDetails(), activeAdjustments))
  );
  adjustmentServiceSpy.getBeneficiaryList.and.returnValue(of(bindToObject(new BeneficiaryList(), benefits)));
  adjustmentServiceSpy.adjustmentDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  adjustmentServiceSpy.getAdjustmentByeligible.and.returnValue(of({ eligible: true }));
  adjustmentServiceSpy.getPerson.and.returnValue(
    of({
      ...new PersonalInformation(),
      fromJsonToObject: json => json,
      identity: [],
      nationality: { english: '', arabic: '' }
    })
  );
  adjustmentServiceSpy.getAdjustByDetail.and.returnValue(
    of({
      ...new AdjustmentDetails(),
      adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
    })
  );
  adjustmentServiceSpy.getSourceId.and.returnValue([new BenefitDetails()]);
  const paymentServiceSpy = jasmine.createSpyObj<PaymentService>('PaymentService', ['getAdjustByDetail']);
  paymentServiceSpy.getAdjustByDetail.and.returnValue(
    of({
      ...new AdjustmentDetails(),
      adjustments: [{ ...new Adjustment(), ...adjustmentModificationById.adjustments }]
    })
  );

  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ id: 1600765 });
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  const thirdPartyAdjustmentServiceSpy = jasmine.createSpyObj<ThirdpartyAdjustmentService>(
    'ThirdpartyAdjustmentService',
    [
      'getTpaAdjustmentsDetails',
      'getThirdPartyAdjustmentValidatorDetails',
      'getBeneficiaryDetails',
      'getAdjustmentMonthlyDeductionEligibilty',
      'getTpaEligibility',
      'mapMessagesToAlert'
    ]
  );
  thirdPartyAdjustmentServiceSpy.getTpaAdjustmentsDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  thirdPartyAdjustmentServiceSpy.getThirdPartyAdjustmentValidatorDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  thirdPartyAdjustmentServiceSpy.getBeneficiaryDetails.and.returnValue(
    of({ ...new BeneficiaryList(), beneficiaryBenefitList: benefits.beneficiaryBenefitList })
  );
  thirdPartyAdjustmentServiceSpy.getAdjustmentMonthlyDeductionEligibilty.and.returnValue(
    of(new MonthlyDeductionEligibility())
  );
  thirdPartyAdjustmentServiceSpy.getTpaEligibility.and.returnValue(
    of({
      ...new EligibilityDetails(),
      eligibility: [
        {
          ...new Eligibility(),
          eligible: false,
          key: 'enableAction',
          messages: { ...new Messages(), message: { english: '', arabic: '' } }
        },
        {
          ...new Eligibility(),
          key: 'haveWarning',
          messages: { ...new Messages(), message: { english: '', arabic: '' } }
        }
      ]
    })
  );
  thirdPartyAdjustmentServiceSpy.mapMessagesToAlert.and.returnValue(new Alert());

  const adjustmentLookupServiceSpy = jasmine.createSpyObj<AdjustmentLookupService>('AdjustmentLookupService', [
    'getGosiAdjustmentSortLov',
    'getTpaAdjustmentSortLov'
  ]);
  adjustmentLookupServiceSpy.getGosiAdjustmentSortLov.and.returnValue(of(new LovList([new Lov()])));
  adjustmentLookupServiceSpy.getTpaAdjustmentSortLov.and.returnValue(of(new LovList([new Lov()])));
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType',
    'benefitDetails'
  ]);
  coreAdjustmntServiceSpy.identifier = 1234;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [AdjustmentDetailsScComponent, BilingualTextPipeMock, NumToPositiveTextPipeMock],
      providers: [
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        DatePipe,
        { provide: Router, useValue: routerSpy },
        { provide: ThirdpartyAdjustmentService, useValue: thirdPartyAdjustmentServiceSpy },
        { provide: AdjustmentLookupService, useValue: adjustmentLookupServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getAdjsutmentFilterDetails', () => {
    it('should show getAdjsutmentFilterDetails ', () => {
      component.identifier = 200085744;
      component.adjustFilter = adjustFilter;
      component.getAdjsutmentFilterDetails();
      expect(component.adjustmentDetails).not.toEqual(null);
    });
    // it('should throw error ', () => {
    //   spyOn(component.paymentService, 'getAdjustByDetail').and.returnValue(throwError(genericErrorOh));
    //   spyOn(component, 'showErrorMessage');
    //   component.getAdjsutmentFilterDetails();
    //   expect(component.showErrorMessage).toHaveBeenCalled();
    // });
  });
  describe('handle error', () => {
    it('should showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: 'error' });
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('navigateToBenefitDetails', () => {
    it('should navigateToBenefitDetails', () => {
      component.identifier = 1234;
      component.navigateToBenefitDetails({
        ...new BenefitDetails(),
        benefitType: { english: '', arabic: '' },
        sin: 1234,
        benefitRequestId: 1234
      });
      expect(component.router.navigate).toHaveBeenCalledWith([PaymentRoutesEnum.ROUTE_MODIFY_RETIREMENT]);
    });
  });
  describe('navigateToAdjustment', () => {
    it('navigateToAdjustment screen', () => {
      component.navigateToAdjustment(5555555);
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('navigateToTpaView', () => {
    it('navigateToTpaView screen', () => {
      component.navigateToTpaView(5555555);
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('navigateToPayAdjustment', () => {
    it('navigateToPayAdjustment screen', () => {
      component.navigateToPayAdjustment();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('navigateToPayOnline', () => {
    it('navigateToPayOnline screen', () => {
      component.navigateToPayOnline();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('selectTab', () => {
    it('should selectTab', () => {
      component.selectTab(1);
      expect(component.alertFlag).toEqual(true);
    });
  });
  describe('navigateToThirdpartyAddModifyDetail', () => {
    it('navigateToThirdpartyAddModifyDetail screen', () => {
      component.navigateToThirdpartyAddModifyDet(true);
      expect(component.router.navigate).toHaveBeenCalled();
    });
    it('navigateToThirdpartyAddDetail screen', () => {
      component.navigateToThirdpartyAddModifyDet(false);
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('SortDesending', () => {
    it('should sort in DESC', () => {
      const order = 'DESC';
      component.sortOrder(order);
      expect(component.direction).toEqual('DESCENDING');
    });
    it('should sort in ASC', () => {
      const order = 'ASC';
      component.sortOrder(order);
      expect(component.direction).toEqual('ASCENDING');
    });
  });
  describe(' navigateToAddModify', () => {
    it('should  navigate To AddModify', () => {
      component.navigateToAddModify();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe(' navigateToCreate', () => {
    it('should navigateToCreate', () => {
      component.navigateToCreate();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe(' navigateBack', () => {
    it('should navigateBack', () => {
      component.navigateBack();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('adjustment details', () => {
    it('should getAdjustmentDetailService', () => {
      component.identifier = 200085744;
      component.getAdjustmentDetailService();
      expect(component.adjustmentDetails).not.toEqual(null);
    });
    // it('should getActiveAdjustments', () => {
    //   component.identifier = 200085744;
    //   component.getActiveAdjustments();
    //   expect(component.activeAdjustments).not.toEqual(null);
    // });
    it('should adjustmentByEligible', () => {
      component.identifier = 200085744;
      component.adjustmentByEligible();
      expect(component.adjustmentModificationEligibilty).not.toEqual(null);
    });
    it('should getBeneficiaryList', () => {
      component.identifier = 200085744;
      component.getBeneficiaryList();
      expect(component.beneficiaries).not.toEqual(null);
    });
    it('should filterTransactions', () => {
      component.identifier = 200085744;
      component.adjustFilter = adjustFilter;
      component.filterTransactions(adjustFilter);
      expect(component.adjustmentDetails).not.toEqual(null);
    });
    it('should sortList', () => {
      component.adjustFilter = adjustFilter;
      component.direction = 'ASCENDING';
      component.sortList({ value: { english: 'Date Created', arabic: 'Date Created' } });
      expect(component.adjustmentDetails).not.toEqual(null);
    });
    it('should sortList', () => {
      component.adjustFilter = adjustFilter;
      component.direction = 'ASCENDING';
      component.sortList({ value: { english: 'Benefit Request Date', arabic: 'Benefit Request Date' } });
      expect(component.adjustmentDetails).not.toEqual(null);
    });
    it('should sortList', () => {
      component.adjustFilter = adjustFilter;
      component.direction = 'ASCENDING';
      component.sortList({ value: { english: 'Adjustment Amount', arabic: 'Adjustment Amount' } });
      expect(component.adjustmentDetails).not.toEqual(null);
    });
  });
  describe('getTpaAdjustmentsDetails', () => {
    it('should getTpaAdjustmentsDetails', () => {
      component.tpaSortOrder = 'ASC';
      component.tpaSortByinit = { english: '', arabic: '' };
      spyOn(component, 'getSortByValue');
      component.getTpaAdjustmentsDetails();
      expect(component.tpaAdjustmentDetails).not.toEqual(null);
    });
  });
  describe('getFilteredTpaAdjsutmentDetails', () => {
    it('should getFilteredTpaAdjsutmentDetails', () => {
      spyOn(component, 'getSortByValue');
      component.getFilteredTpaAdjsutmentDetails(
        [new FilterKeyValue()],
        '',
        { ...new Lov(), value: { english: '', arabic: '' } },
        'ASC'
      );
      expect(component.tpaAdjustmentDetails).not.toEqual(null);
    });
  });
  describe('getSortByValue', () => {
    it('should getSortByValue', () => {
      component.tpaSortByinit = { english: '', arabic: '' };
      spyOn(component, 'getSortByValue');
      component.getSortByValue('');
      expect(component.getSortByValue).toHaveBeenCalled();
    });
  });
  describe('getTpaElibilityDetails', () => {
    it('should getTpaElibilityDetails', () => {
      component.getTpaElibilityDetails(1234);
      expect(component.elibilityResponse).not.toEqual(null);
    });
  });
  describe('navigateToTpaDetailsPage', () => {
    it('should navigateToTpaDetailsPage', () => {
      component.navigateToTpaDetailsPage(1234);
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      component.ngOnDestroy();
    });
  });
});
