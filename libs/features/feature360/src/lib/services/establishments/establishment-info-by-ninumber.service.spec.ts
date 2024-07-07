import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { EstablishmentInfoByNinumber } from '../../models/establishments/establishment-info-by-ninumber';

import { EstablishmentInfoByNinumberService } from './establishment-info-by-ninumber.service';

describe('EstablishmentInfoByNinumberService', () => {
  let service: EstablishmentInfoByNinumberService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EstablishmentInfoByNinumberService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(EstablishmentInfoByNinumberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('establishment info by ninumber service', () => [
    it('should get establishment info by ninumber', () => {
      const registrationNo = 34564566;
      const authorisedId = 1234;
      const niNumber = 1234;
      const newNiNumber = 1234;
      let establishmentInfo: EstablishmentInfoByNinumber = new EstablishmentInfoByNinumber();
      establishmentInfo.registrationnumber = registrationNo;

      const response = {
        elements: [establishmentInfo]
      };
      const url = `${service.interceptUrl}/customer360/bv_establishment_info_by_ninumber/views/bv_establishment_info_by_ninumber?$filter=p_authorised_id+in+%27${authorisedId}%27+AND+p_ninumber+in+%27${niNumber}%27+AND+p_newninumber+in+%27${newNiNumber}%27`;
      service.getEstablishmentInfoByNinumber(authorisedId, niNumber, newNiNumber).subscribe(res => {
        expect(res[0].registrationnumber).toBe(establishmentInfo.registrationnumber);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
