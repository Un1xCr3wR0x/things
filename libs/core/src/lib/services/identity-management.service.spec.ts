import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';

import { IdentityManagementService } from './identity-management.service';
import { CryptoService } from './crypto.service';
import { CryptoServiceStub } from 'testing';

describe('IdentityManagementService', () => {
  let service: IdentityManagementService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: CryptoService, useClass: CryptoServiceStub }
      ]
    });
    service = TestBed.inject(IdentityManagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('get Team Member Profile Data', () => {
    it('should get Team Member Profile Data', () => {
      const userId = '1016316075';
      const httpTestingController = TestBed.inject(HttpTestingController);
      const profileUrl = `/api/process-manager/v1/identity/profile/${userId}`;
      service.getProfile(userId).subscribe();
      const req = httpTestingController.expectOne(profileUrl);
      expect(req.request.method).toBe('GET');
      expect(userId).not.toEqual(null);
      httpTestingController.verify();
    });
    it('should throw error', () => {
      const userId = '1016316075';
      const profileUrl = `/api/process-manager/v1/identity/profile/${userId}`;
      const errMsg = 'expect 404 error';
      service.getProfile(userId).subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(profileUrl);
      expect(req.request.method).toBe('GET');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
});
