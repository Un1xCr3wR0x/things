import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { CustomerProfile } from '../../models/individual/customer-profile';

import { CustomerProfileService } from './customer-profile.service';

describe('CustomerProfileService', () => {
  let service: CustomerProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomerProfileService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(CustomerProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Customer Profile service', () => [
    it('should get CustomerProfileDetails', () => {
      const registrationNo = 34564566;
      let customerProfile: CustomerProfile = new CustomerProfile();
      customerProfile.id = registrationNo;

      const response = {
        elements: [customerProfile]
      };
      const url = `${service.interceptUrl}/customer360/customer360/views/fv_customer_profile?$filter=id+in+%27${registrationNo}%27`;
      service.getCustomerProfileDetails(registrationNo).subscribe(res => {
        expect(res.id).toBe(customerProfile.id);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
