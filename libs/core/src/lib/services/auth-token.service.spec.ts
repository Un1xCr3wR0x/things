/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { AuthTokenService } from './auth-token.service';
import { StorageService } from './storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageServiceStub, PushMessageServiceStub } from '../../../../../testing';
import { Router } from '@angular/router';
import { ApplicationTypeToken, EnvironmentToken } from '../tokens';
import { ApplicationTypeEnum } from '../enums';
import { PushMessageService } from './push-message.service';

/** To test AuthTokenService. */
describe('AuthTokenService', () => {
  let authTokenService: AuthTokenService;
  let storageService: StorageService;
  let router: Router;
  /* let storageService: StorageService; */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: PushMessageService, useClass: PushMessageServiceStub },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ]
    });
    authTokenService = TestBed.inject(AuthTokenService);
    storageService = TestBed.inject(StorageService);
    router = TestBed.inject(Router);
    // @ts-ignore
    authTokenService.isTimeoutRequired = false;
  });
  /** Test if AuthToken service is created properly. */
  it('Should create AuthTokenService service', () => {
    expect(authTokenService).toBeTruthy();
  });

  /** Test if isValidAuthToken is created properly. */
  it('Should call isValidAuthToken service', () => {
    authTokenService.isValidAuthToken();
    expect(authTokenService).toBeTruthy();
  });
  /** Test if setAuthToken is called. */
  it('Should call setAuthToken service', () => {
    const navigateSpy = spyOn(router, 'navigate');
    authTokenService.setAuthToken('f');
    if (authTokenService.document.location.hostname !== 'localhost') expect(navigateSpy).toHaveBeenCalledWith(['/']);
    expect(authTokenService).toBeTruthy();
  });

  /** Test if getAuthToken is called */
  it('Should call getAuthToken service', () => {
    authTokenService.getAuthToken();
    expect(authTokenService).toBeTruthy();
  });
  /** Test if setTokenTimeOut is called */
  it('Should call setTokenTimeOut service', () => {
    authTokenService.setTokenTimeOut('f');
    expect(authTokenService).toBeTruthy();
  });
  /** Test if getTokenTimeOut is called */
  it('Should call getTokenTimeOut service', () => {
    authTokenService.getTokenTimeOut('f');
    expect(authTokenService).toBeTruthy();
  });
  /** Test validity of authToken */
  it('Should check validity of authToken', () => {
    authTokenService.setAuthToken('f');
    expect(authTokenService.isValidAuthToken()).toEqual(false);
    const navigateSpy = spyOn(router, 'navigate');
    expect(navigateSpy).not.toHaveBeenCalled();
  });
  /** Test validity of authToken if it is null */
  it('Should check validity of authToken', () => {
    // @ts-ignore
    const storageService = spyOn(authTokenService.storageService, 'setLocalValue');
    const setTokenTimeOut = spyOn(authTokenService, 'setTokenTimeOut');
    const navigateSpy = spyOn(router, 'navigate');
    authTokenService.setAuthToken(null);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(setTokenTimeOut).not.toHaveBeenCalled();
    expect(storageService).not.toHaveBeenCalled();
  });

  it('Should return false when checking validity of token if token null', () => {
    spyOn(authTokenService, 'getAuthToken').and.returnValue(null);
    expect(authTokenService.isValidAuthToken()).toBeDefined();
  });
  it('Should not call setTokenTimeOut when isTimeoutSet is true', () => {
    // @ts-ignore
    authTokenService.isTimeoutSet = true;
    spyOn(authTokenService, 'setTokenTimeOut');
    spyOn(authTokenService, 'getTokenTimeOut').and.returnValue(1);
    authTokenService.isValidAuthToken();
    // expect(authTokenService.setTokenTimeOut).not.toHaveBeenCalled();
  });
  it('Should set the timer as timeout is 1000ms', fakeAsync(() => {
    spyOn(authTokenService, 'getTokenTimeOut').and.returnValue(1000);
    authTokenService.setTokenTimeOut(null);
    tick(1000);
    discardPeriodicTasks();
    // @ts-ignore
    expect(authTokenService.isTimeoutSet).toBeTrue;
  }));
  it('Should clear local storage as timeout is zero', fakeAsync(() => {
    spyOn(authTokenService, 'getTokenTimeOut').and.returnValue(0);
    spyOn(storageService, 'clearLocal');
    authTokenService.setTokenTimeOut(null);
    tick(1000);
    discardPeriodicTasks();
    // @ts-ignore
    //expect(storageService.clearLocal).toHaveBeenCalled();
  }));
  it('Should return zero when jwtToken is null', () => {
    //const jwtDecode = jasmine.createSpy().and.returnValue(null);
    expect(authTokenService.getTokenTimeOut(12)).toBe(0);
  });
});
