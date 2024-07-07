import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OTPService } from './otp.service';

describe('OTPService', () => {
  let service: OTPService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(OTPService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get otp', () => {
    // const url = '/api/v1/otp/resend';
    const uuid = '';
    service.reSendOTP(uuid).subscribe(res => {
      expect(res).toBeTruthy();
    });
    expect(service).toBeTruthy();
  });

  it('should generate otp', () => {
    const url = `/api/v1/otp/generate`;
    service.generateOTP('ContractAuthentication', 'user1').subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush('Success');
  });
});
