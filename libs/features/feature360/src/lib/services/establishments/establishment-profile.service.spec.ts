import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { EstablishmentProfile } from '../../models/establishments/establishment-profile';

import { EstablishmentProfileService } from './establishment-profile.service';

describe('EstablishmentProfileService', () => {
  let service: EstablishmentProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EstablishmentProfileService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(EstablishmentProfileService);
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
      let establishmentProfile: EstablishmentProfile = new EstablishmentProfile();
      establishmentProfile.registrationnumber = registrationNo;

      const response = {
        elements: [establishmentProfile]
      };
      const url = `${service.interceptUrl}/customer360/bv_establishment_profile/views/bv_establishment_profile/?$filter=p_registrationnumber+in+%27${registrationNo}%27`;
      service.getEstablishmentProfile(registrationNo).subscribe(res => {
        expect(res.registrationnumber).toBe(establishmentProfile.registrationnumber);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
