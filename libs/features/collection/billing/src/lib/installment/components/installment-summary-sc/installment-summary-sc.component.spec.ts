import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentSummaryScComponent } from './installment-summary-sc.component';
import { EstablishmentService, InstallmentService } from '../../../shared/services';
import {
  ActivatedRouteStub,
  InstallmentStub,
  AlertServiceStub,
  EstablishmentServiceStub,
  BilingualTextPipeMock,
  DocumentServiceStub,
  AuthTokenServiceStub
} from 'testing';
import {
  AlertService,
  LanguageToken,
  DocumentService,
  AuthTokenService,
  RegistrationNumber,
  RegistrationNoToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BillingConstants } from '../../../shared/constants';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ from: 'history' });
const regNumber = 502351249;
const selectedTab = 'BILLING.INSTALLMENT-SCHEDULE';
describe('InstallmentSummaryScComponent', () => {
  let component: InstallmentSummaryScComponent;
  let fixture: ComponentFixture<InstallmentSummaryScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [InstallmentSummaryScComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: InstallmentService,
          useClass: InstallmentStub
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: EstablishmentService,
          useClass: EstablishmentServiceStub
        },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentSummaryScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should getEstablishment', () => {
    component.getEstablishment(regNumber);
    expect(component.outOfMarketFlag).toBeTrue();
  });

  it('should getInstallmentDetailsById', () => {
    component.getInstallmentDetailsById(regNumber, 30101467);
    expect(component.installmentSummary).not.toEqual(null);
  });
  xit('should navigateToInstallmentHistory', () => {
    component.navigateToInstallmentHistory();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should onNewTabSelected', () => {
    component.onNewTabSelected(selectedTab);
    expect(component.selectedTab).toEqual(selectedTab);
  });
  it('should getDocuments', () => {
    component.transactionId = BillingConstants.INSTALLMENT;
    component.transactionType = BillingConstants.BANK_GUARANTEE;
    component.regNumber = regNumber;
    component.getDocuments();
    expect(component.documents).not.toEqual(null);
  });
});
