/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEstablishmentScComponent } from './all-establishment-sc.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  LanguageToken,
  AuthTokenService,
  MenuService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  bindToObject,
  RouterConstants,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { DashboardService } from '../../services';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  DashboardServiceStub,
  AuthTokenServiceStub,
  MenuServiceStub,
  ModalServiceStub,
  establishmentMockData,
  branchListMockData,
  establishmentMockDatas
} from 'testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RequestFilter, SearchRequest, RequestLimit, RequestSort } from '@gosi-ui/foundation-dashboard/lib/shared';
import { Router, ActivatedRoute } from '@angular/router';
export const routerSpy = {
  url: '/home/establishment/certificates/10000602/view',
  navigate: jasmine.createSpy('navigate')
};
const activatedRouteStub = () => ({
  queryParams: { subscribe: f => f({}) }
});
describe('AllEstablishmentScComponent', () => {
  let component: AllEstablishmentScComponent;
  let fixture: ComponentFixture<AllEstablishmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllEstablishmentScComponent],
      imports: [
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        BrowserModule,
        FormsModule,
        NgxPaginationModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: DashboardService, useClass: DashboardServiceStub },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        { provide: MenuService, useClass: MenuServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  describe('test suite for hide modal', () => {
    it('It should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.closeModal();
      expect(component.modalRef).toBeDefined();
    });
  });
  describe('navigate to profile', () => {
    it('It should navigate to profile', () => {
      const establishment = establishmentMockData;
      component.navigateToPage(establishment, '');
      expect(establishment.isAuthorized).toBeTruthy();
    });
    it('It should navigate to profile', () => {
      const establishment = establishmentMockData;
      component.router.navigate(['/home/establishment/certificates/10000602/view']);
      component.navigateToPage(
        establishment,
        RouterConstants.ROUTE_ESTABLISHMENT_CERTIFICATE(establishment.registrationNo)
      );
      expect(establishment.isAuthorized).toBeTruthy();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/establishment/certificates/10000602/view']);
    });
    it('It should navigate to profile', () => {
      const establishment = establishmentMockDatas;
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.navigateToPage(establishment, '');
      expect(component.modalRef).not.toEqual(null);
      expect(establishment.isAuthorized).toBeFalsy();
    });
  });
  describe('reset pagination', () => {
    it('It should reset pagination', () => {
      component.estListRequest.limit = new RequestLimit();
      component.resetPagination();
      expect(component.estListRequest.limit).toBeDefined();
    });
  });
  describe('filter', () => {
    it('It should filter', () => {
      component.estListRequest = new SearchRequest();
      const locationFilter = new RequestFilter();
      component.onFilter(locationFilter);
      expect(component.estListRequest).toBeDefined();
    });
  });
  describe('sort', () => {
    it('It should sort', () => {
      component.estListRequest = new SearchRequest();
      const item = new RequestSort();
      component.onSort(item);
      expect(component.estListRequest).toBeDefined();
    });
  });
  describe('select establishment', () => {
    it('It should select establishment', () => {
      component.estListRequest = new SearchRequest();
      const item = 10000602;
      component.selectedEstablishment(item);
      expect(component.estListRequest).toBeDefined();
    });
  });
  describe('search establishment', () => {
    it('It should search establishment', () => {
      component.estListRequest = new SearchRequest();
      const item = '10000602';
      component.searchEstablishments(item);
      expect(component.estListRequest).toBeDefined();
    });
    it('It should search establishment', () => {
      component.estListRequest = new SearchRequest();
      const item = '';
      component.searchEstablishments(item);
      expect(component.estListRequest).toBeDefined();
    });
  });
  describe('select page', () => {
    it('It should select page', () => {
      component.estListRequest = new SearchRequest();
      const page = 2;
      component.selectPage(page);
      expect(component.estListRequest).toBeDefined();
    });
  });
  describe('navigate to', () => {
    it('It should navigate to', () => {
      const est = establishmentMockData;
      component.navigateToBillingView(est);
      expect(component).toBeTruthy();
    });
  });
  describe('navigate to', () => {
    it('It should navigate to', () => {
      const est = establishmentMockData;
      component.navigateToCertificateView(est);
      expect(component).toBeTruthy();
    });
  });
  describe('navigate to', () => {
    it('It should navigate to', () => {
      const est = establishmentMockData;
      component.navigateToBranch(est);
      expect(component).toBeTruthy();
    });
  });
  describe('get branch list', () => {
    it('It should get branch list', () => {
      const request = new SearchRequest();
      spyOn(component.dashboardService, 'getBranchList').and.returnValue(
        of(bindToObject(new SearchRequest(), branchListMockData))
      );
      component.getBranchList(request);
      expect(request).toBeDefined();
    });
    it('It should throw error', () => {
      const request = new SearchRequest();
      spyOn(component.dashboardService, 'getBranchList').and.returnValue(
        throwError({
          status: 400,
          error: {
            message: {
              english: 'not found',
              arabic: 'الرجاء إدخال رمز التحقق'
            }
          }
        })
      );
      component.getBranchList(request);
      expect(request).toBeDefined();
    });
    it('It should throw error', () => {
      const request = new SearchRequest();
      spyOn(component.dashboardService, 'getBranchList').and.returnValue(
        throwError({
          status: 422,
          error: {
            message: {
              english: 'not found',
              arabic: 'الرجاء إدخال رمز التحقق'
            }
          }
        })
      );
      component.getBranchList(request);
      expect(request).toBeDefined();
    });
  });
  it('should get field office', () => {
    spyOn(component.lookUpService, 'getCityList').and.callThrough();
    component.getVillageLocationList();
    expect(component.villageLocationList$).not.toEqual(null);
  });
  describe('get establishments', () => {
    it('It should get establishments', () => {
      component.token = {
        iss: 'http://IDMOHSLVT01.gosi.ins:7778/oauth2',
        aud: ['PublicRServer', 'ab0'],
        exp: 1663130660,
        jti: 'o3sOUuFEeqaGoJk-iRHtFw',
        iat: 1631594660,
        sub: '1091598035',
        uid: '1091598035',
        gosiscp:
          '[{"establishment":"10000025", "role":["4"]},{"establishment":"10000416", "role":["4"]},{"establishment":"10000823", "role":["4"]},{"establishment":"100010062", "role":["4"]},{"establishment":"100012006", "role":["4"]},{"establishment":"1003497062", "role":["3"]},{"establishment":"1004584957", "role":["3"]},{"establishment":"110000103", "role":["4"]},{"establishment":"110002637", "role":["4"]},{"establishment":"13208018", "role":["4"]},{"establishment":"13214514", "role":["4"]},{"establishment":"13232156", "role":["3"]},{"establishment":"13267235", "role":["4"]},{"establishment":"13281920", "role":["4"]},{"establishment":"200034430", "role":["4"]},{"establishment":"200040449", "role":["4"]},{"establishment":"200085728", "role":["4"]},{"establishment":"200085736", "role":["4"]},{"establishment":"20103949", "role":["4"]},{"establishment":"300008615", "role":["4"]},{"establishment":"300030629", "role":["4"]},{"establishment":"3953100", "role":["3"]},{"establishment":"500716568", "role":["4"]},{"establishment":"503982250", "role":["4"]},{"establishment":"509910499", "role":["4"]},{"establishment":"510148592", "role":["4"]},{"establishment":"519877570", "role":["2"]},{"establishment":"541098186", "role":["4"]},{"establishment":"592344904", "role":["6"]}]',
        longnamearabic: 'وجدانهنيدي',
        longnameenglish: 'NOT_FOUND',
        preferredlanguage: 'NOT_FOUND',
        customeAttr1: 'CustomValue',
        client: 'PublicEstablishment19',
        scope: ['PublicRServer.read'],
        domain: 'PublicDomain',
        location: '0'
      };
      component.gosiScope = JSON.parse(component.token.gosiscp);
      spyOn(component.dashboardService, 'getDashboardEstablishmentList').and.returnValue(
        of(bindToObject(new SearchRequest(), [establishmentMockData]))
      );
      expect(component.gosiScope.length).toBeGreaterThan(0);
    });
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
