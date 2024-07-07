import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { RasedAdvancedSearchDetails } from '../../models/establishments/rased-advanced-search-details';

import { RasedAdvancedSearchDetailsService } from './rased-advanced-search-details.service';

describe('RasedAdvancedSearchDetailsService', () => {
  let service: RasedAdvancedSearchDetailsService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RasedAdvancedSearchDetailsService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(RasedAdvancedSearchDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('rased advanced search details service', () => [
    it('should advanced search details', () => {
      const registrationNo = 34564566;
      let rasedAdvancedSearchDetails: RasedAdvancedSearchDetails[] = [];
      const response = {
        elements: [{ jsonarray: rasedAdvancedSearchDetails }]
      };
      const url = `${service.interceptUrl}/customer360/src_rased_advancedsearchdetails/views/src_rased_advancedsearchdetails?$filter=id+in+%27${registrationNo}%27`;
      service.getRasedAdvancedSearchDetails(registrationNo).subscribe(res => {
        expect(res).toEqual(rasedAdvancedSearchDetails);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
