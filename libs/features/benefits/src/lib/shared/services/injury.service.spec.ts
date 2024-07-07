/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InjuryService } from './injury.service';

describe('InjuryService', () => {
  let service: InjuryService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(InjuryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('to get injury details', () => {
    const url = 'assets/data/injury-details.json';
    service.getInjuryDetails().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });

  it('to get injury summary', () => {
    const socialInsuranceNumber = 2323;
    const injuryId = 43434;
    const isRequired = false;
    const url = `/api/v1/contributor/${socialInsuranceNumber}/injury/${injuryId}?isChangeRequired=${isRequired}`;
    service.getInjurySummary(2323, 43434, false).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to getDisabilityDetails', () => {
    expect(service.getDisabilityDetails(34456, 7656)).not.toEqual(null);
  });
});
