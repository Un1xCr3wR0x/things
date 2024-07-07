import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { EstablishmentBranches } from '../../models/establishments/establishment-branches';

import { EstablishmentBranchesService } from './establishment-branches.service';

describe('EstablishmentBranchesService', () => {
  let service: EstablishmentBranchesService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EstablishmentBranchesService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(EstablishmentBranchesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('establishment profile services', () => [
    it('should get establishment Profile', () => {
      const registrationNo = 34564566;
      const establishmentId = 20169141;
      let establishmentBranches: EstablishmentBranches[] = [
        {
          registrationnumber: registrationNo,
          estnamearabic: '',
          estnameenglish: '',
          commercialregistrationnumber: 1,
          locationarabic: '',
          locationenglish: '',
          licensenumber: '',
          status: { english: '', arabic: '' }
        }
      ];

      const response = {
        elements: establishmentBranches
      };
      const url = `${service.interceptUrl}/customer360/bv_establishment_branches/views/bv_establishment_branches?$filter=p_establishmentid+in+%27${establishmentId}%27`;
      service.getEstablishmentBranches(establishmentId).subscribe(res => {
        expect(res).toBe(establishmentBranches);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
