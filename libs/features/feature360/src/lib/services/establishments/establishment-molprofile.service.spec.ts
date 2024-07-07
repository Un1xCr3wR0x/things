import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { EstablishmentMOLProfile } from '../../models/establishments/establishment-molprofile';

import { EstablishmentMOLProfileService } from './establishment-molprofile.service';

describe('EstablishmentMOLProfileService', () => {
  let service: EstablishmentMOLProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EstablishmentMOLProfileService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(EstablishmentMOLProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('establishment molprofile service', () => [
    it('should get establishment molprofile', () => {
      const molestid = 34564566;
      const molestofficeid = 12345;
      let establishmentMOLProfile: EstablishmentMOLProfile = new EstablishmentMOLProfile();
      establishmentMOLProfile.molestid = molestid;

      const response = {
        elements: [establishmentMOLProfile]
      };
      const url = `${service.interceptUrl}/customer360/bv_establishment_mol_profile/views/bv_establishment_mol_profile?$filter=p_molestid+in+%27${molestid}%27+AND+p_molestofficeid+in+%27${molestofficeid}%27`;
      service.getEstablishmentMOLProfile(molestid, molestofficeid).subscribe(res => {
        expect(res.molestid).toBe(establishmentMOLProfile.molestid);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
