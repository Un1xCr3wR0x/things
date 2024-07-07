/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import jwtDecode from 'jwt-decode';
import { AuthTokenServiceStub, menuData, StorageServiceStub } from 'testing';
import { RouterConstants } from '../constants';
import { ApplicationTypeEnum } from '../enums';
import { ContributorTokenDto, JWTPayload, RegistrationNumber } from '../models';
import { MenuService } from '../services';
import { ApplicationTypeToken, ContributorToken, EnvironmentToken, MenuToken, RegistrationNoToken } from '../tokens';
import { AuthTokenService } from './auth-token.service';
import { StorageService } from './storage.service';

describe('MenuService', () => {
  let menuService: MenuService;
  const token =
    'eyJraWQiOiJPbmxpbmVVc2VyIiwieDV0IjoiWHl2WmttT1FBcnZuVnZrZ2pBZ0NkS0JyVjVJIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vSUFNQVBQTFZUMDEuZ29zaS5pbnM6Nzc3Ny9vYXV0aDIiLCJhdWQiOiJFc3RhYmxpc2htZW50RVdSUyIsImV4cCI6MTYzNjQ1OTYzNSwianRpIjoiQjdmalp1aXRkakRrUU9oa3dVWkozdyIsImlhdCI6MTYwNDkyMzYzNSwic3ViIjoiMTAyOTA1Mjg1NyIsImdvc2lzY3AiOiJbe1wiZXN0YWJsaXNobWVudFwiOlwiMTAwOTMwNTYxMVwiLCBcInJvbGVcIjpbXCI4XCIsXCIyN1wiXX1dIiwicHJlZmVycmVkTGFuZ3VhZ2UgIjoiTk9UX0ZPVU5EICIsImxvbmduYW1lYXJhYmljIjoi2YXZhti12YjYsdmF2KjYp9ix2YPYudio2K_Yp9mE2YTZh9in2YTYrNmG2YrYrSAiLCJsb25nbmFtZWVuZ2xpc2giOiJOT1RfRk9VTkQgIiwiT0FVVEhfVE9LRU4iOiJleUpyYVdRaU9pSmtaV1poZFd4MElpd2llRFYwSWpvaU4ydENhR0Z6YTJWc1YxUndiV1J6Tmxka1NrcGlkMVUzZVVWcklpd2lZV3huSWpvaVVsTXlOVFlpZlEuZXlKbGVIQWlPakUyTURRNU1qY3lNelVzSW1wMGFTSTZJbVp2VjNwalJEaFRSbkIzT0c0d2FrdG1PV3RYYlVFaUxDSnBZWFFpT2pFMk1EUTVNak0yTXpVc0luTjFZaUk2SWpFd01qa3dOVEk0TlRjaUxDSnpaWE56YVc5dVgybGtJam9pU0RaQmRXeDJTMHBYVmpaME4wUjNTamgyVTFKblp6MDlmakJuUzNGYVVuTllNMDh4Y0M4MGRVRklWMFpPWjNjOVBTSXNJbVJ2YldGcGJpSTZJbVJsWm1GMWJIUWlmUS5JMGJUamxfbnlEcVJmVWNGaHNSVXJlM3VaXzVoaGpSYVhhYnNhaGtwTVhJSUlWM1ltcEFmSFZ1aWlTREk4ZF9ZRnZCYkQtLThpdEZoc0M4UmRYRkdudThVWFlwMTQ4eFJETjRhV0RVNXdjWkI5VUxoYnh2QW51SFZLNmpjVF8wTHZJS0htdFV0RFNYN19uYkhQRk9iYTZ0Q1M5V3ZhcDMxM090VUhCa3RxNWpCb1laREpXVVctLVRYTzFiLWZyaFN1VnlMRTU1MHBuYmJuY3hfWEVXdWo2WWhzeGxNRnhrb2toZ1VMMnNEcnhqU1I0MEJmcF9sWDItbVQyWVpkeVZxc0xndVg3U3ktNnBtRDNBX2QyREVwNVVIRVhuQnNwcUFJOVdTX04tV1RXZGFVRTRaVHZ2ekZHN2ctcWdqVzhvS3ZFbGozT1dzcC1zdWUyT3JkZkhFcnciLCJnb3Npc2NwICI6Ilt7XCJlc3RhYmxpc2htZW50XCI6XCIxMDA5MzA1NjExXCIsIFwicm9sZVwiOltcIjhcIixcIjI3XCJdfV0gIiwiY3VzdG9tZUF0dHIxIjoiQ3VzdG9tVmFsdWUiLCJqc29uc2NwICI6Ik5PVF9GT1VORCAiLCJjbGllbnQiOiJFc3RhYmxpc2htZW50UHVibGljMDEiLCJzY29wZSI6WyJFc3RhYmxpc2htZW50RVdSUy5yZWFkIl0sImRvbWFpbiI6Ik9ubGluZVVzZXIifQ.MctaAzX3HIP0GbolNoa8BfIqvbh7PWY0J-TU92PbYGAGZftkHq-9EiX6_yKcwRLj49GGNHClrajFdLvIvjbe1motflBz1PzMtnLFeZVNvl6OWgVzVHNAi9DNNo5ubMfsombP6fOx0fzbWlrc3dPZXjaXVnKMdtdjvcsEWEcsXZLthh4IFi9H39T4ResX2KieBqikY_R9rkWl4RXj6ZkipaKAK--3CWjK4BQXUs_TD94f3RJUSdVHjvRsMyL2Ia49HvUuZf_3ZmH8QNRv5r71xXVplKIZyttAn-EKCPOQ_veFodY20epgjzaOU9So8iK7SDQ3Um0FAws6Palo7WUJUg';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        { provide: MenuToken, useValue: menuData.menuItems },
        { provide: StorageService, useClass: StorageServiceStub },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub }
      ]
    });
    menuService = TestBed.inject(MenuService);
    menuService.tokenService.setAuthToken(token);
  });

  /** Test if menu service is created properly. */
  it('Should create menu service', () => {
    expect(menuService).toBeTruthy();
  });
  describe('getRoles', () => {
    it('Should get roles', () => {
      menuService.tokenService.setAuthToken(token);
      menuService.getRoles();
      spyOn(menuService.tokenService, 'getAuthToken').and.callThrough();
      spyOn(menuService, 'getRoles').and.callThrough();
      expect(menuService).toBeTruthy();
    });
    it('Should not get roles', () => {
      menuService.getRoles();
      spyOn(menuService.tokenService, 'getAuthToken').and.callThrough();
      spyOn(menuService, 'getRoles').and.callThrough();
      expect(menuService).toBeTruthy();
    });
  });

  it('Should get features', () => {
    menuService.getFeatures();
    spyOn(menuService.tokenService, 'getAuthToken').and.callThrough();
    spyOn(menuService, 'getRoles').and.callThrough();
    spyOn(menuService, 'getFeatures').and.callThrough();
    expect(menuService).toBeTruthy();
  });
  it('Should get menu items', () => {
    const menuItems = menuData.menuItems;
    menuService.getMenuItems(menuItems);
    spyOn(menuService.tokenService, 'getAuthToken').and.callThrough();
    spyOn(menuService, 'getRoles').and.callThrough();
    spyOn(menuService, 'getFeatures').and.callThrough();
    spyOn(menuService, 'getMenuItems').and.callThrough();
    expect(menuService).toBeTruthy();
  });
  describe('checkUrlPermission', () => {
    it('Should goto error page', () => {
      const url = RouterConstants.ROUTE_NOT_FOUND;
      expect(menuService.checkURLPermission(url)).toEqual(true);
      expect(menuService).toBeTruthy();
    });
    it('Should check url permission', () => {
      const csrToken =
        'eyJraWQiOiJQcml2YXRlRG9tYWluIiwieDV0IjoiX3l2NHZWc0U2NTlxWkpSejlZOWUwNzY5OXNNIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vSURNT0hTTFZUMDEuZ29zaS5pbnM6Nzc3OC9vYXV0aDIiLCJhdWQiOlsiUHJpdmF0ZVJTZXJ2ZXIiLCJhYjAiXSwiZXhwIjoxNjQ5NDgwNjY5LCJqdGkiOiJSUC1udXBuWGNlMVo4OVFqeFN4X1VnIiwiaWF0IjoxNjE3OTQ0NjY5LCJzdWIiOiJobzAzMDIxMCIsInVpZCI6ImUwMDMwMjEwICIsImdvc2lzY3AiOiJbe1wicm9sZVwiOltcIjEwMVwiXX1dICIsImxvbmduYW1lYXJhYmljIjoi2KjYr9ixINio2YYg2YbYp9i12LEg2KfZhNmF2YHZiNiyIiwibG9uZ25hbWVlbmdsaXNoIjoiTk9UX0ZPVU5EIiwiY3VzdG9tZUF0dHIxIjoiQ3VzdG9tVmFsdWUiLCJjbGllbnQiOiJQcml2YXRlRXN0YWJsaXNobWVudDA0Iiwic2NvcGUiOlsiUHJpdmF0ZVJTZXJ2ZXIucmVhZCJdLCJkb21haW4iOiJQcml2YXRlRG9tYWluIn0.QyPlrmKZv2LctZuUlo58pfmXsdFUYMiEQbsNf6S7KGfYJY-faSOTYqMIdKiBriZy0_iL_aAAoRGPXv3zvGFjbhdrnVBe9_QzoMfLOHnzrFMyuQmNfBUDCUyrQ01R_HqvUjzGUgNjNc78ODGLOnNNbeEbL75xHDZLAqieWfrJmFyoYBBm0bkKjFGKPCmYFD1cxbKIP5p9r8tQE1749NrWmMcSmGyE1VuEWGhXR9uK9gzPB9w_RD5t5geAmjsowTTZaJfrfLjekv8pfi_qrpB1wCeFnG5DBKCbCb-r5wo4QbTBmPbsLMKe-w9MYBwQldOfhpRWUsAUBXmII7_1UOQTJA';
      menuService.tokenService.setAuthToken(csrToken);
      (menuService as any).appToken = ApplicationTypeEnum.PRIVATE;
      const url = '/dashboard/search/establishment';
      spyOn(menuService.tokenService, 'getAuthToken').and.callThrough();
      spyOn(menuService, 'getRoles').and.callThrough();
      spyOn(menuService, 'getFeatures').and.callThrough();
      spyOn(menuService, 'getMenuItems').and.callThrough();
      const roles = JSON.parse(jwtDecode<JWTPayload>(csrToken).gosiscp);
      spyOn(menuService.tokenService, 'getEntitlements').and.returnValue(roles);
      expect(menuService.checkURLPermission(url)).toBeInstanceOf(Object);
      expect(menuService).toBeTruthy();
    });
  });
});
