import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BenefitDetailsScComponent } from './benefit-details-sc.component';
import {
  AdjustmentService,
  AdjustmentDetails,
  PaymentService,
  BeneficiaryList,
  AdjustmentDetailsFilter
} from '../../../shared';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { activeAdjustments, benefits } from '../../../shared/test-data/adjustment';
import {
  AlertService,
  DocumentService,
  RouterDataToken,
  RouterData,
  LanguageToken,
  bindToObject,
  BilingualText,
  Alert,
  CoreAdjustmentService
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock,
  NumToPositiveTextPipeMock,
  genericError
} from 'testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

describe('BenefitDetailsScComponent', () => {
  let component: BenefitDetailsScComponent;
  let fixture: ComponentFixture<BenefitDetailsScComponent>;
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
    'getAdjustmentByStatusAndType',
    'getBeneficiaryList',
    'getAdjustmentByBenefitType',
    'getAdjustmentByeligible'
  ]);
  adjustmentServiceSpy.getAdjustmentByStatusAndType.and.returnValue(
    of(bindToObject(new AdjustmentDetails(), activeAdjustments))
  );
  adjustmentServiceSpy.getBeneficiaryList.and.returnValue(of(bindToObject(new BeneficiaryList(), benefits)));
  adjustmentServiceSpy.getAdjustmentByBenefitType.and.returnValue(
    of(bindToObject(new AdjustmentDetails(), activeAdjustments))
  );
  adjustmentServiceSpy.getAdjustmentByeligible.and.returnValue(of({ eligible: true }));
  const paymentServiceSpy = jasmine.createSpyObj<PaymentService>('PaymentService', ['getAdjustByDetail']);
  paymentServiceSpy.getAdjustByDetail.and.returnValue(of(bindToObject(new AdjustmentDetails(), activeAdjustments)));
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ adjustmentId: 1600765, from: 'addModify' });
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType',
    'benefitDetails'
  ]);
  coreAdjustmntServiceSpy.identifier = 1234;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [BenefitDetailsScComponent, BilingualTextPipeMock, NumToPositiveTextPipeMock],
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
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        DatePipe,
        { provide: PaymentService, useValue: paymentServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*describe('navigateToAdjustmentDetails', () => {
    it('navigateToAdjustmentDetails', () => {
      const adjustmentId = 1034681524;
      spyOn(component.router, 'navigate');
      component.navigateToAdjustmentDetails(adjustmentId);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['/home/adjustment/benefit-adjustment'])
    });
  });*/
  describe('navigateToAdd', () => {
    it('navigateToAdd', () => {
      spyOn(component.router, 'navigate');
      expect(component.isEligible).toBeTrue();
      component.navigateToAdd();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/adjustment/create']);
    });
    it('navigateToAddModify', () => {
      spyOn(component.router, 'navigate');
      expect(component.isEligible).toBeTrue();
      component.navigateToAddModify();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/adjustment/add-modify']);
    });
    it('should filterTransactions', () => {
      component.identifier = 200085744;
      component.adjustFilter = adjustFilter;
      component.filterTransactions(adjustFilter);
    });
  });
  describe('navigateToAdjustment', () => {
    it('navigateToAdjustment  screen', () => {
      spyOn(component.router, 'navigate');
      component.navigateToAdjustmentDetails(5555555);
      // expect(component.router.navigate).toHaveBeenCalledWith(
      //   ['/home/adjustment/benefit-adjustment'],
      //   Object({
      //     queryParams: Object({ adjustmentId: 5555555 })
      //   })
      // );
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('sortOrder', () => {
    it('should  sortOrder DESC', () => {
      const order = 'DESC';
      component.sortOrder(order);
      expect(component.direction).toEqual('DESCENDING');
    });
    it('should  sortOrder ASC', () => {
      const order = 'ASC';
      component.sortOrder(order);
      expect(component.direction).toEqual('ASCENDING');
    });
  });
  describe('sortList', () => {
    it('should sortList', () => {
      component.adjustFilter = adjustFilter;
      component.direction = 'ASCENDING';
      component.sortList({ value: { english: 'Date Created', arabic: 'Date Created' } });
      expect(component.adjustments).not.toEqual(null);
    });
    it('should sortList', () => {
      component.adjustFilter = adjustFilter;
      component.direction = 'ASCENDING';
      component.sortList({ value: { english: 'Adjustment Amount', arabic: 'Adjustment Amount' } });
      expect(component.adjustments).not.toEqual(null);
    });
  });
  describe('handle error', () => {
    it('should showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: 'error' });
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getAdjsutmentFilterDetails', () => {
    it('should getAdjsutmentFilterDetails', () => {
      component.identifier = 1234;
      component.adjustFilter = new AdjustmentDetailsFilter();
      component.getAdjsutmentFilterDetails();
      expect(component.adjustments).not.toEqual(null);
    });
  });

  // describe('getAdjsutmentFilterDetails', () => {
  //   it('should throw error for getAdjsutmentFilterDetails', () => {
  //     component.identifier = 1234;
  //     component.adjustFilter = new AdjustmentDetailsFilter();
  //     spyOn(component.paymentService, 'getAdjustByDetail').and.returnValue(throwError(genericError));
  //     spyOn(component.alertService, 'showErrorByKey');
  //     component.getAdjsutmentFilterDetails();
  //     expect(component.paymentService.getAdjustByDetail).toHaveBeenCalled();
  //   });
  // });
});
