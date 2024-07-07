import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationTypeToken, ninValidator, iqamaValidator } from '@gosi-ui/core';
import { changePasswordData, AdminTestData, UserPreferenceData, UserPreferenceDatas } from 'testing';
import { UserActivityService } from './user-activity.service';
import { FormControl } from '@angular/forms';
describe('ChangePasswordService', () => {
  let httpMock: HttpTestingController;
  let service: UserActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApplicationTypeToken, useValue: 'PRIVATE' }]
    });
    service = TestBed.inject(UserActivityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('should changePassword', () => {
    it('should change password', () => {
      const url = '/api/v1/useractivity/change-password';
      service.changePassword(changePasswordData).subscribe(val => expect(val.result).toBe('SUCCESS'));
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
    });
    it('should throw error', () => {
      const errMsg = 'expect 404 error';
      const url = '/api/v1/useractivity/change-password';
      service.changePassword(changePasswordData).subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
  describe('getAdminDetails', () => {
    it('should getAdminDetails', () => {
      const loginId = 1031299124;
      const personTdentifier = 1031299124;
      const adminUrl = `/api/v1/person/${personTdentifier}/preference`;
      const control: FormControl = new FormControl(loginId);
      service.getAdminDetails(loginId).subscribe();
      const req = httpMock.expectOne(adminUrl);
      expect(req.request.method).toBe('GET');
      req.flush(AdminTestData);
      expect(control).toBeDefined();
      expect(ninValidator(control)).toEqual(null);
    });
    it('should getAdminDetails', () => {
      const loginId = 2034154464;
      const personTdentifier = 2034154464;
      const adminUrl = `/api/v1/person/${personTdentifier}/preference`;
      const control: FormControl = new FormControl(loginId);
      service.getAdminDetails(loginId).subscribe();
      const req = httpMock.expectOne(adminUrl);
      expect(req.request.method).toBe('GET');
      req.flush(AdminTestData);
      expect(control).toBeDefined();
      expect(iqamaValidator(control)).toEqual(null);
    });
  });
  describe('getPreferredLanguage', () => {
    it('should getPreferredLanguage', () => {
      const adminUrl = `/api/v1/useractivity/user-preference`;
      service.getPreferredLanguage().subscribe();
      const req = httpMock.expectOne(adminUrl);
      expect(req.request.method).toBe('GET');
    });
    it('should throw error', () => {
      const errMsg = 'expect 404 error';
      const adminUrl = `/api/v1/useractivity/user-preference`;
      service.getPreferredLanguage().subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(adminUrl);
      expect(req.request.method).toBe('GET');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
  describe('savePreferences', () => {
    it('should savePreferences', () => {
      const personTdentifier = 597672993;
      const adminUrl = `/api/v1/person/${personTdentifier}/preference`;
      service.savePreferences(UserPreferenceDatas, personTdentifier).subscribe();
      const req = httpMock.expectOne(adminUrl);
      expect(req.request.method).toBe('PATCH');
    });
  });
  describe('saveApplicationLanguage', () => {
    it('should saveApplicationLanguage', () => {
      const adminUrl = `/api/v1/useractivity/user-preference`;
      service.saveApplicationLanguage(UserPreferenceData).subscribe();
      const req = httpMock.expectOne(adminUrl);
      expect(req.request.method).toBe('PUT');
    });
    it('should throw error', () => {
      const errMsg = 'expect 404 error';
      const adminUrl = `/api/v1/useractivity/user-preference`;
      service.saveApplicationLanguage(UserPreferenceData).subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(adminUrl);
      expect(req.request.method).toBe('PUT');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
});
