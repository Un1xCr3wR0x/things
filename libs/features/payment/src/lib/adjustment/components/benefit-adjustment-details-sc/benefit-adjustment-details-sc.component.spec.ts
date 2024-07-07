import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BenefitAdjustmentDetailsScComponent } from './benefit-adjustment-details-sc.component';
import { AdjustmentService, AdjustmentDetails, PaymentService, BeneficiaryList, Adjustment } from '../../../shared';
import { of } from 'rxjs';
import { activeAdjustments, benefits } from '../../../shared/test-data/adjustment';
import {
  AlertService,
  DocumentService,
  RouterDataToken,
  RouterData,
  bindToObject,
  CoreAdjustmentService
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock
} from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('BenefitAdjustmentDetailsScComponent', () => {
  let component: BenefitAdjustmentDetailsScComponent;
  let fixture: ComponentFixture<BenefitAdjustmentDetailsScComponent>;
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'getAdjustmentsByStatus',
    'getBeneficiaryList',
    'getadjustmentBYId',
    'getAdjustmentByeligible'
  ]);
  adjustmentServiceSpy.getAdjustmentsByStatus.and.returnValue(
    of(bindToObject(new AdjustmentDetails(), activeAdjustments))
  );
  adjustmentServiceSpy.getBeneficiaryList.and.returnValue(of(bindToObject(new BeneficiaryList(), benefits)));
  adjustmentServiceSpy.getadjustmentBYId.and.returnValue(
    of({ ...new Adjustment(), adjustments: activeAdjustments.adjustments[0] })
  );
  adjustmentServiceSpy.getAdjustmentByeligible.and.returnValue(of({ eligible: true }));
  const paymentServiceSpy = jasmine.createSpyObj<PaymentService>('PaymentService', ['getAdjustByDetail']);
  paymentServiceSpy.getAdjustByDetail.and.returnValue(of(bindToObject(new AdjustmentDetails(), activeAdjustments)));
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ adjustmentId: 1600765 });
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType',
    'benefitDetails'
  ]);
  coreAdjustmntServiceSpy.identifier = 1234;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [BenefitAdjustmentDetailsScComponent],
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
        { provide: PaymentService, useValue: paymentServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitAdjustmentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
