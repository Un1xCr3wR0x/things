import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { EstablishmentSupervisorDetail } from '../../models/establishments/establishment-supervisor-detail';

import { EstablishmentSupervisorDetailService } from './establishment-supervisor-detail.service';

describe('EstablishmentSupervisorDetailService', () => {
  let service: EstablishmentSupervisorDetailService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EstablishmentSupervisorDetailService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(EstablishmentSupervisorDetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('establishment supervisor detail service', () => [
    it('should get establishment supervisor detail', () => {
      const registrationNo = 34564566;
      let establishmentSupervisorDetail: EstablishmentSupervisorDetail[] = [
        { NameArabic: '', NameEnglish: '', emailid: '', mobilenumber: '', ninumber: 1234 }
      ];

      const response = {
        elements: establishmentSupervisorDetail
      };
      const url = `${service.interceptUrl}/customer360/bv_establishment_supervisor_detail/views/bv_establishment_supervisor_detail?$filter=p_registrationnumber+in+%27${registrationNo}%27`;
      service.getEstablishmentSupervisorDetail(registrationNo).subscribe(res => {
        expect(res).toBe(establishmentSupervisorDetail);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
