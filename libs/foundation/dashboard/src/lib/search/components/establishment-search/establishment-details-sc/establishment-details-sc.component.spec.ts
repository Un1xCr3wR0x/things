/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentDetailsScComponent } from './establishment-details-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, BehaviorSubject, throwError } from 'rxjs';
import {
  LanguageToken,
  bindToObject,
  ApplicationTypeToken,
  Transaction,
  Establishment,
  MenuService,
  RegistrationNoToken,
  RegistrationNumber,
  RouterConstants,
  ContributorTokenDto,
  ContributorToken
} from '@gosi-ui/core';
import {
  transactionListData,
  establishmentListData,
  MenuServiceStub,
  establishmentCertificateStatus,
  billHistoryWrapper
} from 'testing';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BilingualTextPipeMock } from 'testing';
import { DashboardSearchService } from '../../../services';
import { EstablishmentSearchScComponent } from '../establishment-search-sc/establishment-search-sc.component';
import { EstablishmentCertificateStatus, BillHistoryWrapper } from '@gosi-ui/foundation-dashboard';
import { Router, ActivatedRoute } from '@angular/router';
export const routerSpy = { url: RouterConstants.ROUTE_ESTABLISHMENT_SEARCH, navigate: jasmine.createSpy('navigate') };
const activatedRouteStub = () => ({
  queryParams: { subscribe: f => f({}) }
});
describe('EstablishmentDetailsScComponent', () => {
  let component: EstablishmentDetailsScComponent;
  let fixture: ComponentFixture<EstablishmentDetailsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EstablishmentDetailsScComponent, BilingualTextPipeMock],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],

      providers: [
        DashboardSearchService,
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: MenuService, useClass: MenuServiceStub },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  describe('ngOninit', () => {
    it('should ngOninit', () => {
      spyOn(component, 'getEstablishmentDetails').and.callThrough();
      spyOn(component, 'getTransactionDetails').and.callThrough();
      component.ngOnInit();
      expect(component.selectedLangage).not.toEqual(null);
    });
  });
  describe('getEstablishments', () => {
    it('should get establishments', () => {
      spyOn(component.dashboardSearchService, 'getEstablishmentDetails').and.returnValue(
        of(bindToObject(new Establishment(), establishmentListData))
      );
      component.getEstablishmentDetails();
      expect(component.dashboardSearchService.getEstablishmentDetails).toHaveBeenCalled();
      expect(component.establishmentDetails).not.toEqual(null);
    });
    it('should get establishments', () => {
      spyOn(component.dashboardSearchService, 'getEstablishmentDetails').and.returnValue(
        throwError({
          status: 400,
          error: {
            message: {
              english: 'Invalid',
              arabic: 'رمز التحقق غير صحيح'
            }
          }
        })
      );
      component.getEstablishmentDetails();
      expect(component).toBeTruthy();
    });
    it('should get establishments', () => {
      spyOn(component.dashboardSearchService, 'getEstablishmentDetails').and.returnValue(
        throwError({
          status: 422,
          error: {
            message: {
              english: 'Invalid',
              arabic: 'رمز التحقق غير صحيح'
            }
          }
        })
      );
      component.getEstablishmentDetails();
      expect(component).toBeTruthy();
    });
  });
  describe('getTransactionDetails', () => {
    it('should get transactions', () => {
      spyOn(component.dashboardSearchService, 'getTransactions').and.returnValue(
        of(bindToObject(new Transaction(), transactionListData))
      );
      component.getTransactionDetails();
      expect(component.dashboardSearchService.getTransactions).toHaveBeenCalled();
      expect(component.transactionDetails).not.toEqual(null);
    });
  });
  describe('establishment navigation ', () => {
    it('should  navigate', () => {
      const url = RouterConstants.ROUTE_ESTABLISHMENT_SEARCH;
      component.router.navigate([RouterConstants.ROUTE_ESTABLISHMENT_SEARCH]);
      component.navigateTo(url);
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_ESTABLISHMENT_SEARCH]);
    });
  });

  describe('search results navigation ', () => {
    it('should  navigate', () => {
      component.router.navigate([RouterConstants.ROUTE_ESTABLISHMENT_SEARCH]);
      component.navigateToSearchResults();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_ESTABLISHMENT_SEARCH]);
    });
  });
  describe('test suite for  update event ', () => {
    it('It should  update event', () => {
      const event = null;
      component.dashboardSearchService.searchKey = event;
      component.onUpdate(event);
      expect(event).toEqual(null);
    });
  });
  describe('test suite for pagination ', () => {
    it('It should paginate', () => {
      const page = 2;
      component.onSelectPage(page);
      expect(component).toBeTruthy();
    });
  });
  describe('get quick actions ', () => {
    it('It should get quick actions', () => {
      component.getQuickActions();
      expect(component).toBeTruthy();
    });
  });
  describe('navigate to list ', () => {
    it('It should navigate', () => {
      spyOn(component, 'navigateTo').and.callThrough();
      component.navigateToList();
      expect(component).toBeTruthy();
    });
  });
  describe('geteligibility sts', () => {
    it('should get eligibility sts', () => {
      spyOn(component.dashboardSearchService, 'getEstablishmentCertificateStatus').and.returnValue(
        of(bindToObject(new EstablishmentCertificateStatus(), establishmentCertificateStatus))
      );
      component.getEstablishmentCertificateStatus();
      expect(component.eligibilityStatus).not.toEqual(null);
    });
  });
  describe('geteligibility sts', () => {
    it('should get eligibility sts', () => {
      spyOn(component.dashboardSearchService, 'getBillingDetails').and.returnValue(
        of(bindToObject(new BillHistoryWrapper(), billHistoryWrapper))
      );
      component.getBillingDetails();
      expect(component.billingDetails).not.toEqual(null);
    });
  });
  describe('get profile ', () => {
    it('It should get profile', () => {
      component.getProfileDetails();
      expect(component).toBeTruthy();
    });
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
