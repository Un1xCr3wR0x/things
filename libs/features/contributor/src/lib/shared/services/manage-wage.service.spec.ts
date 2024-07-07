/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { bindToObject, GosiCalendar, StorageService } from '@gosi-ui/core';
import {
  changedEngagementData,
  contributorWageResponse,
  getContributoryWageResponse,
  getCurrentEngagementResponse,
  getEngagementResponse,
  periodChangeResponse,
  StorageServiceStub,
  updateSingleWageResponse,
  getWageWorkflorResponse,
  searchEngagementResponse,
  vicContributionDetails
} from 'testing';
import {
  ChangeEngagementResponse,
  CoveragePeriod,
  EngagementDetails,
  EngagementPeriod,
  CoveragePeriodWrapper,
  VicContributionDetails
} from '../models';
import { ManageWageService } from './manage-wage.service';
import { of } from 'rxjs';
import { SearchTypeEnum } from '../enums';

describe('ManageWageService', () => {
  let service: ManageWageService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceStub
        }
      ]
    }),
      (service = TestBed.inject(ManageWageService));
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get engagments ', () => {
    service.setCurrentEngagment = bindToObject(new EngagementDetails(), getCurrentEngagementResponse.engagements[0]);
    expect(service.getCurrentEngagment.engagementId).toBe(1710000020);
  });
  it('should get contributory wage coverage details', () => {
    const registrationNo = 123123;
    const sin = 123123;
    const param = 'CURRENT';
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement?searchType=${param}`;
    spyOn(service, 'getContributoryCoverage').and.returnValue(
      of(bindToObject(new CoveragePeriodWrapper(), contributorWageResponse))
    );
    service.getEngagementWithCoverage(sin, registrationNo, param).subscribe(response => {
      expect(response[0].engagementPeriod[0].coverages.length).toEqual(1);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(getCurrentEngagementResponse);
  });

  it('should get engagments ', () => {
    service.setCurrentEngagment = bindToObject(new EngagementDetails(), getCurrentEngagementResponse.engagements[0]);
    expect(service.getCurrentEngagment.engagementId).toBe(1710000020);
  });

  it('should get engagement details', () => {
    const registrationNo = 123123;
    const sin = 123123;
    const param = 'ACTIVE';
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement?searchType=${param}`;
    service.getEngagements(sin, registrationNo, param).subscribe(response => {
      expect(response[0].engagementId).toEqual(1710000020);
      expect(service.getCurrentEngagment.engagementId).toEqual(1710000020);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(getCurrentEngagementResponse);
  });

  it('should fetch contributory wage details', () => {
    const registrationNo = 123123;
    const sin = 123123;
    const engagementId = 13456;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement/${engagementId}/contribution`;
    service.getContributoryCoverage(sin, engagementId, registrationNo).subscribe(response => {
      expect(response.periods[0].coverages[0].coverage).toEqual(100);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(getContributoryWageResponse);
  });

  it('should update current engagement details', () => {
    const registrationNo = 123123;
    const sin = 123123;
    const engagmentId = 123456;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement/${engagmentId}/wage`;
    service
      .updateWageDetails(
        bindToObject(new EngagementPeriod(), getCurrentEngagementResponse.engagements[0].engagementPeriod[0]),
        registrationNo,
        sin,
        engagmentId,
        true
      )
      .subscribe(response => {
        expect(response.message).toEqual(updateSingleWageResponse.message);
      });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(updateSingleWageResponse);
  });

  it('should get vic details', () => {
    const sin = 123123;
    const nin = 123456;
    const url = `/api/v1/vic/${sin}/engagement/${nin}/contribution-details`;
    service.getVicContributionDetails(sin, nin).subscribe(response => {
      expect(response.contributionMonths).toEqual(6);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(vicContributionDetails);
  });

  it('should fetch date as null', () => {
    expect(service.fetchDate(new GosiCalendar())).toBeNull();
  });
  it('should fetch date as gregorian', () => {
    expect(
      service.fetchDate({
        gregorian: new Date(2018),
        hijiri: '1441-06-07'
      })
    ).toEqual(new Date(2018));
  });

  it('should get vic contributory wage coverage details', () => {
    const sin = 123123;
    const url = `/api/v1/contributor/${sin}/search-engagements?searchType=${SearchTypeEnum.ACTIVE_AND_TERMINATED_AND_CANCELLED}&ignorePagination=true`;
    spyOn(service, 'getVicContributionDetails').and.returnValue(
      of(bindToObject(new VicContributionDetails(), vicContributionDetails))
    );
    service.searchEngagement(sin, 1222222224).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(searchEngagementResponse);
  });

  // xit('should get coverage request', () => {
  //   expect(
  //     service.getCoverageReq([
  //       bindToObject(
  //         new EngagementPeriod(),
  //         getEngagementResponse.engagements[0].engagementPeriod[0]
  //       )
  //     ])
  //   ).toBe(bindToObject(new CoveragePeriodWrapper(), contributorWageResponse));
  // });

  xit('should set response data', () => {
    expect(
      service.setResponsePeriodToEngagement(
        bindToObject(new EngagementDetails(), getEngagementResponse.engagements[0]),
        [bindToObject(new CoveragePeriod(), contributorWageResponse.periods[0])]
      ).engagementPeriod[0].coverages.length
    ).toEqual(1);
  });

  // it('should get coverage request', () => {
  //   let engagmentPeriod =[];
  //    engagmentPeriod.push( bindToObject(
  //     new EngagementPeriod(),
  //     getEngagementResponse.engagements[0].engagementPeriod[0]
  //   ));
  //   expect(
  //     service.getCoverageReq(engagmentPeriod)
  //   ).toEqual(bindToObject(new CoveragePeriodWrapper(), contributorWageResponse));
  // });

  // it('should set response data', () => {
  //   let engagment =  service.setResponsePeriodToEngagement(
  //     bindToObject(new EngagementDetails(), getEngagementResponse.engagements[0]),
  //     [bindToObject(new CoveragePeriod(), contributorWageResponse.periods[0])]
  //   );
  //   expect(
  //    engagment[0].coverages.length
  //   ).toEqual(1);
  // });
  it('should get wage and details', () => {
    const url = `/api/v1/establishment/200085744/contributor/423641258/engagement/1569355076/wage-update-request/231422`;
    service.getOccupationAndWageDetails(200085744, 423641258, 1569355076, 231422).subscribe(res => {
      expect(res.joiningDate.gregorian).toEqual(new Date('2020-03-01T00:00:00.000Z'));
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(getWageWorkflorResponse);
  });

  it('should verifty wage change', () => {
    const url = `/api/v1/establishment/200085744/contributor/423641258/engagement/1569355076/verifyMinimumWage`;
    service
      .verifyWageChange(
        200085744,
        423641258,
        1569355076,
        new EngagementDetails().fromJsonToObject(changedEngagementData)
      )
      .subscribe(res => {
        expect(res).toBeTruthy();
      });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(
      new HttpResponse<boolean>({ body: true })
    );
  });

  it('should modify engagement period wage', () => {
    const url = `/api/v1/establishment/200085744/contributor/423641258/engagement/1569355076`;
    service
      .modifyEnagagementPeriodWage(
        200085744,
        423641258,
        1569355076,
        new EngagementDetails().fromJsonToObject(changedEngagementData)
      )
      .subscribe((res: ChangeEngagementResponse) => {
        expect(res.message.english).not.toBeNull();
      });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(periodChangeResponse);
  });

  it('should submit engagement after change', () => {
    const url = `/api/v1/establishment/200085744/contributor/423641258/engagement/1569355076/change-request/status?action=SUBMIT`;
    service.submitEngagementAfterChange(200085744, 423641258, 1569355076, 'SUBMIT', null).subscribe(res => {
      expect(res.english).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ english: 'Transaction is initiated', arabic: '' });
  });
});
