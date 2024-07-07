/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoginService, AuthTokenService, StorageService } from '../services';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { EnvironmentToken, ApplicationTypeToken } from '../tokens';
import { ApplicationTypeEnum } from '../enums';
import { StorageServiceStub, AuthTokenServiceStub } from '../../../../../testing';
import { PushMessageServiceStub } from '../../../../../testing';
import { PushMessageService } from './push-message.service';

describe('LoginService', () => {
  let loginService: LoginService;
  let authTokenService: AuthTokenService;
  let storageService: StorageService;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        LoginService,
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        { provide: StorageService, useClass: StorageServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: PushMessageService, useClass: PushMessageServiceStub }
      ]
    });
    loginService = TestBed.inject(LoginService);
    authTokenService = TestBed.inject(AuthTokenService);
    router = TestBed.inject(Router);
  });
  /** Test if login service is created properly. */
  it('Should create login service', () => {
    expect(loginService).toBeTruthy();
  });
  /** Test if handleLoginCallBack is called */
  it('Should set the login url', () => {
    const navigateSpy = spyOn(router, 'navigate');
    loginService.handleLoginCallBack('f');
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
    expect(loginService).toBeTruthy();
  });
  // it('Should logout', () => {
  //   loginService.isLoggedOut = true;
  //   spyOn(loginService.storageService, 'clearSession').and.callThrough();
  //   spyOn(loginService.storageService, 'clearLocalValue').and.callThrough();
  //   loginService.doLogout();
  //   expect(loginService.storageService.clearSession).toHaveBeenCalled();
  // });
});
