import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { BeneficiaryInfo } from '../../models/individual/beneficiary-info';

import { BeneficiaryInfoService } from './beneficiary-info.service';

describe('BeneficiaryInfoService', () => {
  let service: BeneficiaryInfoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BeneficiaryInfoService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(BeneficiaryInfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('beneficiary information service', () => [
    it('should get BeneficiaryInfoDetails', () => {
      const registrationNo = 34564566;
      let beneficiaryInfo: BeneficiaryInfo = new BeneficiaryInfo();

      const response = {
        elements: [beneficiaryInfo]
      };
      const url = `${service.interceptUrl}/customer360/customer360/views/fv_beneficiary_info?$filter=id+in+%27${registrationNo}%27`;
      service.getBeneficiaryInfoDetails(registrationNo).subscribe(res => {
        expect(res).toBe(beneficiaryInfo);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
