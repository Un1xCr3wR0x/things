import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  ActivatedRouteStub,
  BilingualTextPipeMock,
  NumToPositiveTextPipeMock,
  DocumentServiceStub,
  AlertServiceStub,
  ModalServiceStub,
  LookupServiceStub
} from 'testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import {
  AdjustmentService,
  ThirdpartyAdjustmentService,
  AdjustmentDetails,
  Adjustment,
  PayeeDetails,
  BeneficiaryList,
  Payment,
  AdjustmentQueryParams,
  PaymentList
} from '../../../../shared';
import { ThirdPartyAdjustmentViewScComponent } from './third-party-adjustment-view-sc.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import {
  AlertService,
  DocumentService,
  RouterDataToken,
  ApplicationTypeToken,
  RouterData,
  bindToObject,
  DocumentItem,
  LanguageToken,
  LookupService,
  BilingualText,
  CoreAdjustmentService
} from '@gosi-ui/core';
import { DatePipe } from '@angular/common';
import { activeAdjustments, benefits } from '../../../../shared/test-data/adjustment';

describe('ThirdPartyAdjustmentViewScComponent', () => {
  let component: ThirdPartyAdjustmentViewScComponent;
  let fixture: ComponentFixture<ThirdPartyAdjustmentViewScComponent>;

  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ personId: 1600765, adjustmentId: 1234 });
  const identifier = 1234;
  const adjustmentId = 1234;
  const paymentToBankMap: Map<string, BilingualText> = new Map();
  const paymentList: Map<number, PaymentList> = new Map();

  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const thirdPartyAdjustmentServiceSpy = jasmine.createSpyObj<ThirdpartyAdjustmentService>(
    'ThirdpartyAdjustmentService',
    [
      'getTpaAdjustmentsDetails',
      'getValidatorPayeeDetails',
      'getBeneficiaryDetails',
      'getAllDocuments',
      'getPaymentDetails'
    ]
  );
  thirdPartyAdjustmentServiceSpy.getTpaAdjustmentsDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  thirdPartyAdjustmentServiceSpy.getValidatorPayeeDetails.and.returnValue(of(new PayeeDetails()));
  thirdPartyAdjustmentServiceSpy.getBeneficiaryDetails.and.returnValue(
    of({ ...new BeneficiaryList(), beneficiaryBenefitList: benefits.beneficiaryBenefitList })
  );
  thirdPartyAdjustmentServiceSpy.getAllDocuments.and.returnValue(
    of([{ ...new DocumentItem(), createdDate: '', fromJsonToObject: json => json }])
  );
  thirdPartyAdjustmentServiceSpy.getPaymentDetails.and.returnValue(of([{ ...new Payment(), iban: 'SA12345678' }]));
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
      declarations: [ThirdPartyAdjustmentViewScComponent, BilingualTextPipeMock, NumToPositiveTextPipeMock],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
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
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ThirdpartyAdjustmentService, useValue: thirdPartyAdjustmentServiceSpy },
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartyAdjustmentViewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should ngOnInit', () => {
    component.adjustmentId = adjustmentId;
    component.identifier = identifier;
    component.ngOnInit();
  });
  it('should getAdjustmentDetails', () => {
    const params = new AdjustmentQueryParams();
    component.identifier = identifier;
    component.getAdjustmentDetails(identifier, params);
    expect(component.beneficiaryId).not.toEqual(null);
  });
  it('should hideModal', () => {
    component.modalRef = new BsModalRef();
    component.hideModal();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should navigateBacktoListPage', () => {
    component.navigateBacktoListPage();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should addDocsPage', () => {
    component.adjustmentId = adjustmentId;
    component.addDocsPage();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should getTransactionDocuments', () => {
    component.adjustmentId = adjustmentId;
    component.getTransactionDocuments();
    expect(component.modifyTpaDocuments).not.toEqual(null);
  });
  it('should getOtherDocumentList', () => {
    component.adjustmentId = adjustmentId;
    component.getOtherDocumentList();
    expect(component.otherDocsList).not.toEqual(null);
  });
  it('should getPayments', () => {
    component.paymentToBankMap = paymentToBankMap;
    component.paymentList = paymentList;
    component.getPayments(identifier, adjustmentId);
    expect(component.tempPayment).not.toEqual(null);
  });
});
