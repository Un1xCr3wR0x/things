import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  bindToObject,
  CurrencyToken,
  Environment,
  EnvironmentToken,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatePipe, PaginationService } from 'ngx-pagination';
import { BehaviorSubject, of } from 'rxjs';
import {
  ActivatedRouteStub,
  BilingualTextPipeMock,
  establishmentHeaderMock,
  PaymentForm,
  ReportStatementServiceStub
} from 'testing';
import { RouteConstants } from '../../../../shared/constants/route-constants';
import { EstablishmentHeader } from '../../../../shared/models';
import { ReportStatementService } from '../../../../shared/services';
import { ViewRecordsScComponent } from './view-records-sc.component';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ViewRecordsScComponent', () => {
  let component: ViewRecordsScComponent;
  let fixture: ComponentFixture<ViewRecordsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), BrowserDynamicTestingModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        PaginationService,
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: RegistrationNoToken, useValue: new RegistrationNumber(null) },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ReportStatementService,
          useClass: ReportStatementServiceStub
        },
        {
          provide: EnvironmentToken,
          useValue: new Environment()
        }
      ],
      declarations: [ViewRecordsScComponent, PaginatePipe, BilingualTextPipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRecordsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngoninit', () => {
    it('should  form for the date picker', () => {
      const form = new PaymentForm();
      component.recordListForm = form.recordsFormMock();
      spyOn(component.billRecordService, 'getRecords').and.callThrough();
      component.ngOnInit();
      expect(component.billRecordService.getRecords).toHaveBeenCalled();
      expect(component.receiptList).not.toEqual(null);
      expect(component.recordListForm).toBeTruthy();
    });
  });
  describe('Select Page', () => {
    it('should go to selected page no', () => {
      expect(component.pageDetails.currentPage).toBe(1);
      component.selectPage(2);
      expect(component.pageDetails.currentPage).toBe(2);
    });
  });
  describe('test suite for getRecordsDetails', () => {
    it('It should get the getRecordsDetails', () => {
      spyOn(component.detailedBillService, 'getBillingHeader').and.returnValue(
        of(bindToObject(new EstablishmentHeader(), establishmentHeaderMock))
      );
      component.getRecordHeaderDetails(504096157);
      expect(component.recordHeaderValue).not.toEqual(null);
      expect(component.detailedBillService.getBillingHeader).toHaveBeenCalledWith(504096157, true);
    });
  });
  describe('hideAccountModal', () => {
    it('should hideAccountModal', () => {
      const mapingId = 12345;
      component.getReceipt(mapingId);
      expect(component.router.navigate).toHaveBeenCalledWith([RouteConstants.ROUTE_VIEW_ESCLATION], {
        queryParams: {
          mappingId: 12345
        }
      });
    });
  });
});
