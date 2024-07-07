import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { EstablishmentMOLAuthorizerDetail } from '../../models/establishments/establishment-molauthorizer-detail';

import { EstablishmentMOLAuthorizerDetailService } from './establishment-molauthorizer-detail.service';

describe('EstablishmentMOLAuthorizerDetailService', () => {
  let service: EstablishmentMOLAuthorizerDetailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EstablishmentMOLAuthorizerDetailService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(EstablishmentMOLAuthorizerDetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('establishment molauthorizer detail service', () => [
    it('should get establishment molauthorizer detail', () => {
      const molestofficeid = 34564566;
      const molestid = 12345;
      const authorised_id = 123;
      let establishmentMOLAuthorizerDetail: EstablishmentMOLAuthorizerDetail = new EstablishmentMOLAuthorizerDetail();
      establishmentMOLAuthorizerDetail.authorised_id = authorised_id;

      const response = {
        elements: [establishmentMOLAuthorizerDetail]
      };
      const url = `${service.interceptUrl}/customer360/bv_establishment_mol_authorizer_detail/views/bv_establishment_mol_authorizer_detail?$filter=p_molestofficeid+in+%27${molestofficeid}%27+AND+p_molestid+in+%27${molestid}%27`;
      service.getEstablishmentMOLAuthorizerDetail(molestofficeid, molestid).subscribe(res => {
        expect(res.authorised_id).toBe(establishmentMOLAuthorizerDetail.authorised_id);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
