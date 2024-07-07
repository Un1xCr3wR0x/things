import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import jwtDecode from 'jwt-decode';
import { AuthTokenServiceStub, LoginServiceStub, StorageServiceStub, systemWorking } from 'testing';
import { SystemStatusEnum } from '../enums';
import { JWTPayload } from '../models';
import { AuthTokenService } from './auth-token.service';
import { LoginService } from './login.service';
import { StorageService } from './storage.service';
import { SystemService } from './system.service';

describe('SystemService', () => {
  let service: SystemService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        { provide: LoginService, useClass: LoginServiceStub }
      ]
    });
    service = TestBed.inject(SystemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Get system status', () => {
    it('should call the api', () => {
      const token =
        'eyJraWQiOiJQcml2YXRlRG9tYWluIiwieDV0IjoiX3l2NHZWc0U2NTlxWkpSejlZOWUwNzY5OXNNIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vSURNT0hTTFZUMDEuZ29zaS5pbnM6Nzc3OC9vYXV0aDIiLCJhdWQiOlsiUHJpdmF0ZVJTZXJ2ZXIiLCJhYjAiXSwiZXhwIjoxNjY5OTc0OTQ3LCJqdGkiOiJKaFdIaEgtaUhOb3BJSlVienQ1SS13IiwiaWF0IjoxNjM4NDM4OTQ3LCJzdWIiOiJtazAzMTk4NCIsInVpZCI6ImUwMDMxOTg0ICIsImdvc2lzY3AiOiJbe1wicm9sZVwiOltcIjEwMVwiXX1dICIsImxvbmduYW1lYXJhYmljIjoi2LPYp9mE2YUg2KjZhiDYudio2K_Yp9mE2YTZhyDYp9mE2YXYt9ix2YHZiiIsImxvbmduYW1lZW5nbGlzaCI6Ik5PVF9GT1VORCIsImN1c3RvbWVBdHRyMSI6IkN1c3RvbVZhbHVlIiwiY2xpZW50IjoiUHJpdmF0ZUVzdGFibGlzaG1lbnQyMSIsInNjb3BlIjpbIlByaXZhdGVSU2VydmVyLnJlYWQiXSwiZG9tYWluIjoiUHJpdmF0ZURvbWFpbiJ9.OA_1Ue8Xrz4Hdg1YBiINkQghkIntgDml5V7TtErKPp0bRZ9q-Pw7dnXWz_yhVctKAeNpJHo9JHDzCeAc5gSnHJhH-195UN2ZzL6A_7Mg_crUJ68q5ufQH2KLt06mnr1TJ4DDDAdRWFP2jzkNClUUkMX8t6AgzpvtdpUiUXX729ni9FXVFX-ImRPXp2fBsTRKNIMqgitBGLeB6iQ6FfXwUNIWU9MFR_2LWoTdHzb8yKik2zM7sLzge-q1GOORE53YX-ZaEcnCsyVbRzYFHGGMlzFJsF4UpAEqwarmPCNI3QdHRPLVmWa4B3MU-oLLXP4p6Cv5-EphxSHF0agFKAY5Rw';
      spyOn(service.authTokenService, 'getAuthToken').and.returnValue(token);
      spyOn(service.authTokenService, 'decodeToken').and.returnValue(jwtDecode<JWTPayload>(token));
      service.getSystemStatus().subscribe(res => {
        res.code === SystemStatusEnum.NORMAL;
      });
      const req = httpMock.expectOne('/api/v1/system/status');
      expect(req.request.method).toBe('GET');
      req.flush(systemWorking);
    });
    it('should call the api', () => {
      const token =
        'eyJraWQiOiJQcml2YXRlRG9tYWluIiwieDV0IjoiX3l2NHZWc0U2NTlxWkpSejlZOWUwNzY5OXNNIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vSURNT0hTTFZUMDEuZ29zaS5pbnM6Nzc3OC9vYXV0aDIiLCJhdWQiOlsiUHJpdmF0ZVJTZXJ2ZXIiLCJhYjAiXSwiZXhwIjoxNjY5OTc0OTQ3LCJqdGkiOiJKaFdIaEgtaUhOb3BJSlVienQ1SS13IiwiaWF0IjoxNjM4NDM4OTQ3LCJzdWIiOiJtazAzMTk4NCIsInVpZCI6ImUwMDMxOTg0ICIsImdvc2lzY3AiOiJbe1wicm9sZVwiOltcIjEwMVwiXX1dICIsImxvbmduYW1lYXJhYmljIjoi2LPYp9mE2YUg2KjZhiDYudio2K_Yp9mE2YTZhyDYp9mE2YXYt9ix2YHZiiIsImxvbmduYW1lZW5nbGlzaCI6Ik5PVF9GT1VORCIsImN1c3RvbWVBdHRyMSI6IkN1c3RvbVZhbHVlIiwiY2xpZW50IjoiUHJpdmF0ZUVzdGFibGlzaG1lbnQyMSIsInNjb3BlIjpbIlByaXZhdGVSU2VydmVyLnJlYWQiXSwiZG9tYWluIjoiUHJpdmF0ZURvbWFpbiJ9.OA_1Ue8Xrz4Hdg1YBiINkQghkIntgDml5V7TtErKPp0bRZ9q-Pw7dnXWz_yhVctKAeNpJHo9JHDzCeAc5gSnHJhH-195UN2ZzL6A_7Mg_crUJ68q5ufQH2KLt06mnr1TJ4DDDAdRWFP2jzkNClUUkMX8t6AgzpvtdpUiUXX729ni9FXVFX-ImRPXp2fBsTRKNIMqgitBGLeB6iQ6FfXwUNIWU9MFR_2LWoTdHzb8yKik2zM7sLzge-q1GOORE53YX-ZaEcnCsyVbRzYFHGGMlzFJsF4UpAEqwarmPCNI3QdHRPLVmWa4B3MU-oLLXP4p6Cv5-EphxSHF0agFKAY5Rw';
      spyOn(service.authTokenService, 'getAuthToken').and.returnValue(token);
      spyOn(service.authTokenService, 'decodeToken').and.returnValue(jwtDecode<JWTPayload>(token));
      service.getSystemStatus().subscribe(res => {
        res.code === SystemStatusEnum.MAINTANANCE;
      });
      const req = httpMock.expectOne('/api/v1/system/status');
      expect(req.request.method).toBe('GET');
      req.flush({ ...systemWorking, code: SystemStatusEnum.MAINTANANCE });
    });
  });
});
