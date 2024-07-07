/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BilingualText } from '@gosi-ui/core';
import { engagement, engagementSuccessResponse, getCurrentEngagementResponse } from 'testing';
import { SearchTypeEnum } from '../enums';
import { EngagementDetails } from '../models';
import { EngagementService } from './engagement.service';

describe('EngagementService', () => {
  let service: EngagementService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EngagementService]
    });
    service = TestBed.inject(EngagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get engagement details', () => {
    const registrationNo = 123123;
    const sin = 123123;
    const engagementId = 11231588;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement/${engagementId}?engagementType=${SearchTypeEnum.ACTIVE}&determineCoverage=true`;
    service.getEngagementDetails(sin, registrationNo, engagementId, SearchTypeEnum.ACTIVE).subscribe(response => {
      expect(response.engagementId).toEqual(1710000020);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(getCurrentEngagementResponse.engagements[0]);
  });

  it('Should save the EngagementDetails', () => {
    const registerationNo = 200085744;
    const socialInsuranceNumber = 419734586;
    service['socialInsuranceNo'] = 419734586;
    service['isEditTransaction'] = true;
    const contributorUrl = `/api/v1/establishment/${registerationNo}/contributor/${socialInsuranceNumber}/engagement`;
    service
      .saveEngagementDetails(engagement, socialInsuranceNumber, registerationNo)
      .subscribe(res => expect(res.message.english).toBe(engagementSuccessResponse.message.english));
    const req = httpMock.expectOne(contributorUrl);
    expect(req.request.method).toBe('POST');
    req.flush(engagementSuccessResponse);
  });
  it('Should save the EngagementDetails', () => {
    const registerationNo = 200085744;
    const socialInsuranceNumber = 419734586;
    const engId = 1234568798;
    service['socialInsuranceNo'] = 419734586;
    service['isEditTransaction'] = true;
    const contributorUrl = `/api/v1/establishment/${registerationNo}/contributor/${socialInsuranceNumber}/engagement/${engId}`;
    service
      .updateEngagementDetails(engagement, socialInsuranceNumber, registerationNo, engId, true, true)
      .subscribe(res => expect(res.message.english).toBe(engagementSuccessResponse.message.english));
    const req = httpMock.expectOne(contributorUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(engagementSuccessResponse);
  });

  it('should get beneficiary coverage', () => {
    const url = `/api/v1/establishment/200085744/contributor/419734586/engagement/determine-coverage`;
    service
      .getBeneficiaryCoverage(200085744, 419734586, new EngagementDetails())
      .subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush({ coverages: [new BilingualText()] });
  });

  it('should update penalty indicator', () => {
    const url = `/api/v1/establishment/200085744/contributor/419734586/engagement/1234568798/update-penalty`;
    service.updatePenaltyIndicator(200085744, 419734586, 1234568798, 1).subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(true);
  });
});
