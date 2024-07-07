import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { EstablishmentOwnerDetail } from '../../models/establishments/establishment-owner-detail';

import { EstablishmentOwnerDetailService } from './establishment-owner-detail.service';

describe('EstablishmentOwnerDetailService', () => {
  let service: EstablishmentOwnerDetailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EstablishmentOwnerDetailService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(EstablishmentOwnerDetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('establishment owner profile service', () => [
    it('should get establishment owner profile', () => {
      const registrationNo = 34564566;
      let establishmentOwnerDetail: EstablishmentOwnerDetail = new EstablishmentOwnerDetail();
      establishmentOwnerDetail.registrationnumber = registrationNo;

      const response = {
        elements: [establishmentOwnerDetail]
      };
      const url = `${service.interceptUrl}/customer360/bv_establishment_owner_detail/views/bv_establishment_owner_detail?$filter=p_registrationnumber+in+%27${registrationNo}%27`;
      service.getEstablishmentOwnerDetail(registrationNo).subscribe(res => {
        expect(res.registrationnumber).toBe(establishmentOwnerDetail.registrationnumber);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
