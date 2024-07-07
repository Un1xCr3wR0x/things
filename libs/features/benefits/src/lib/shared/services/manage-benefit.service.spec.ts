/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  BPMUpdateRequest,
  GosiCalendar,
  LanguageToken,
  Person,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { benefitRequestResposeMockData } from 'testing/test-data/features/benefits/benefit-test-data';
import { PersonalInformation, AdjustmentDetailsDto, PaymentHistoryFilter } from '..';
import { BenefitType } from '../enum/benefit-type';
import { BenefitValues } from '../enum/benefit-values';
import { AnnuityBenefitRequest } from '../models/annuity-benefit-request';
import { DisabilityDetails } from '../models/disability-details';
import { ManageBenefitService } from './manage-benefit.service';
import moment from 'moment';

describe('ManageBenefitService', () => {
  let httpMock: HttpTestingController;
  let service: ManageBenefitService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        DatePipe
      ]
    });
    service = TestBed.inject(ManageBenefitService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
  it('to get active status of contributor', () => {
    const personId = 1019474024;
    const url = `/api/v1/contributor?personId=${personId}`;
    service.getContributorDetails(personId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });

  it('to get Annuity Benefits', () => {
    const socialInsuranceNumber = 385093829;
    const url = `/api/v1/contributor/${socialInsuranceNumber}/benefit/eligibility`;
    service.getAnnuityBenefits(socialInsuranceNumber).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });

  it('to get Attorney Details For id', () => {
    const id = 1013422082;
    const url = `/api/v1/person/${id}/attorney?status=${BenefitValues.active}`;
    service.getAttorneyDetailsForId(id, BenefitValues.active).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });

  it('to get Selected AuthPerson', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/attorney`;
    service.getSelectedAuthPerson(sin, benefitRequestId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to get Beneficiary Details', () => {
    const personId = 1019474024;
    const url = `/api/v1/common/benefitciaryDetail/${personId}`;
    service.getBeneficiaryDetails(personId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to get Beneficiary Details', () => {
    const personId = 1019474024;
    const url = `/api/v1/common/benefitciaryDetail/${personId}`;
    service.getBeneficiaryDetails(personId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });

  it('to get Benefit Calculation Details By RequestId', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const referenceNo = 10015003;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/calculate?referenceNo=${referenceNo}`;
    service.getBenefitCalculationDetailsByRequestId(sin, benefitRequestId, referenceNo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to getAnnuityBenefitBeneficiaryRequestDetail', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const referenceNo = 10015003;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/beneficiary?referenceNo=${referenceNo}`;
    service.getAnnuityBenefitBeneficiaryRequestDetail(sin, benefitRequestId, referenceNo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to getModificationReason', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const personId = 300320;
    const actionType = '';
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/modification-reason?personId=${personId}`;
    service.getModificationReason(sin, benefitRequestId, personId, actionType).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to getPaymentDetails', () => {
    const socialInsuranceNo = 385093829;
    const benefitRequestId = 1003227956;
    const url = `/api/v1/contributor/${socialInsuranceNo}/benefit/${benefitRequestId}/payment-detail`;
    service.getPaymentDetails(socialInsuranceNo, benefitRequestId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to get Contributor', () => {
    const socialInsuranceNo = 385093829;
    const registrationNo = 13359474;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}`;
    service.getContributor(registrationNo, socialInsuranceNo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to get RequestDate', () => {
    service.getRequestDate();
    expect(service.getRequestDate).toBeDefined();
  });
  it('to set RequestDate', () => {
    service.setRequestDate(service.requestDate);
    expect(service.setRequestDate).toBeDefined();
  });
  /*it('to get Annuity Benefit Calculations', () => {
    const sin = 385093829;
    const benefitType = BenefitType.retirementPension;
    const reqDate = new GosiCalendar();
    const url = `/api/v1/contributor/${sin}/benefit/calculate?benefitType=${benefitType}`;
    service.getAnnuityBenefitCalculations(sin, benefitType, reqDate).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });*/
  it('to get Annuity Benefit Request Detail', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const referenceNo = 1012661;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}?referenceNo=${referenceNo}`;
    service.getAnnuityBenefitRequestDetail(sin, benefitRequestId, referenceNo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to get PersonDetails', () => {
    const nin = 1013422082;
    const queryParams = `NIN=${nin}`;
    const url = `/api/v1/person?${queryParams}`;
    service.getPersonDetailsApi(queryParams).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to get Person Details With PersonId', () => {
    const personId = 1019474024;
    const url = `/api/v1/person/${personId}`;
    service.getPersonDetailsWithPersonId(personId.toString()).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to get System Run Date', () => {
    const url = `/api/v1/calendar/run-date`;
    service.getSystemRunDate().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  xit('to get All Benefit History', () => {
    const sin = 385093829;
    const url = `/api/v1/contributor/${sin}/benefit`;
    service.getAllBenefitHistory(sin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to get All UI History', () => {
    const sin = 374359037;
    const url = `/api/v1/contributor/${sin}/ui`;
    service.getAllUiHistory(sin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('it getAllBenefitHistory', () => {
    const sin = 367189827;
    const annuityType = [''];
    const baseurl = `/api/v1/contributor/${sin}/benefit?benefitTypeList=`;
    service.getAllBenefitHistory(sin, annuityType).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('it getAnnuityBenefitCalculations', () => {
    const sin = 367189827;
    const benefitType = '';
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const requestDate = new GosiCalendar();
    const baseurl = `/api/v1/contributor/${sin}/benefit/calculate?benefitType=${benefitType}&requestDate=${currentDate}`;
    service.getAnnuityBenefitCalculations(sin, benefitType, requestDate).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('it getBenefitRecalculation', () => {
    const sin = 367189827;
    const benefitRequestId = 300322;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/recalculation`;
    service.getBenefitRecalculation(sin, benefitRequestId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('to get SystemParams', () => {
    const url = `/api/v1/lov/system-parameters`;
    service.getSystemParams().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('navigate to inbox', () => {
    spyOn(service.router, 'navigate');
    service.navigateToInbox();
    expect(service.router.navigate).toHaveBeenCalledWith(['/home/transactions/list/worklist']);
  });
  describe('apply annuity Benefit ', () => {
    it('should apply annuity Benefit', () => {
      const sin = 385093829;
      const benefitType = BenefitType.hazardousPension;
      const requestData = new AnnuityBenefitRequest();
      const url = `/api/v1/contributor/${sin}/benefit?benefitType=${benefitType}`;
      service.applyForBenefit(sin, true, benefitType, requestData).subscribe(response => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(benefitRequestResposeMockData);
    });
    it('should update annuity Benefit', () => {
      const sin = 385093829;
      const benefitRequestId = 1003227956;
      const benefitType = BenefitType.hazardousPension;
      const requestData = new AnnuityBenefitRequest();
      const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}`;
      service.updateForAnnuityBenefit(sin, benefitRequestId, benefitType, requestData).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush(benefitRequestResposeMockData);
    });
  });
  it('to get occ benefits', () => {
    const url = 'assets/data/occ-eligibility.json';
    service.getOccBenefits().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
    expect(service.getOccBenefits()).not.toEqual(null);
  });
  it('should getAttorneyDetails', () => {
    expect(service.getAttorneyDetails(767675)).not.toEqual(null);
  });
  it('should  filterPaymentHistory', () => {
    const paymentHistoryFilter = new PaymentHistoryFilter();
    expect(service.filterPaymentHistory(767675, 776656, paymentHistoryFilter)).not.toEqual(null);
  });
  it('should getStopReasonLovList', () => {
    expect(service.getStopReasonLovList()).not.toEqual(null);
  });
  it('should  getHoldReasonLovList', () => {
    expect(service.getHoldReasonLovList()).not.toEqual(null);
  });
  it('should getPaymentFilterEventType', () => {
    expect(service.getPaymentFilterEventType()).not.toEqual(null);
  });
  it('should  getPaymentFilterStatusType', () => {
    expect(service.getPaymentFilterStatusType()).not.toEqual(null);
  });
  it('should  getUiCalculationDetailsByRequestId', () => {
    expect(service.getUiCalculationDetailsByRequestId(232323, 23233)).not.toEqual(null);
  });
  it('should  setValues', () => {
    expect(service.setValues(232323, 23233, 8787)).not.toEqual(null);
  });
  it('should getReqDocs', () => {
    expect(service.getReqDocs()).not.toEqual(null);
  });
  it('should  getAllOccBenefitHistory', () => {
    expect(service.getAllOccBenefitHistory(2334, ['wdsdsd'])).not.toEqual(null);
  });
  it('should searchContributor', () => {
    expect(service.searchContributor(32323, 2334)).not.toEqual(null);
  });
  it('should updateLateRequest', () => {
    expect(service.updateLateRequest(32323, 2334, false, 76767)).not.toEqual(null);
  });
  it('should getContirbutorRefundDetails', () => {
    expect(service.getContirbutorRefundDetails(32323, false)).not.toEqual(null);
  });
  it('should  getContributorCreditBalance', () => {
    expect(service.getContributorCreditBalance(32323)).not.toEqual(null);
  });
  it('should updateLateRequest', () => {
    expect(service.updateLateRequest(32323, 2334, false, 76767)).not.toEqual(null);
  });
  it('should update address', () => {
    const personId = 1019474024;
    const personDetails = new PersonalInformation();
    const addPersonUrl = `/api/v1/person/${personId}`;
    service.updateAddress(personId, personDetails).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(addPersonUrl);
    expect(req.request.method).toBe('PUT');
  });
  it('to  getBenefitDetails', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}`;
    service.getBenefitDetails(sin, benefitRequestId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should REVERT annuity Benefit', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const referenceNo = 664797;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/revert`;
    service.revertAnnuityBenefit(sin, benefitRequestId, referenceNo).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(benefitRequestResposeMockData);
  });

  it('should REVERT annuity Benefit', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const referenceNo = 664797;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/revert`;
    service.revertAnnuityBenefit(sin, benefitRequestId, referenceNo).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(benefitRequestResposeMockData);
  });

  it('should patch Benefit', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const referenceNo = 664797;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}`;

    service.patchAnnuityBenefit(sin, benefitRequestId, null, referenceNo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(benefitRequestResposeMockData);
  });
  it('should handle Annuity Workflow Actions', () => {
    const data = new BPMUpdateRequest();
    const url = `/api/process-manager/v1/taskservice/update`;
    service.updateAnnuityWorkflow(data).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
  });
  it('should update Disability Details', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const disabilityDetails = new DisabilityDetails();
    disabilityDetails.disabilityDate = new GosiCalendar();
    disabilityDetails.disabilityPct = 80;
    disabilityDetails.disabledB = true;
    disabilityDetails.isHelpRequired = true;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/disability-details`;
    service.updateDisabilityDetails(sin, benefitRequestId, disabilityDetails).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
  });
});
