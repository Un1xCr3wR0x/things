/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  BPMUpdateRequest,
  EnvironmentToken,
  CoreContributorService,
  AlertService,
  RouterData,
  ContributorToken,
  ContributorTokenDto
} from '@gosi-ui/core';
import {
  contributorPatchData,
  addressPatchData,
  establishmentResponce,
  personResponse,
  personWithGccId,
  CoreContributorSerivceStub,
  AlertServiceStub
} from 'testing';
import { RevertTransaction, TerminatePayload } from '../models';
import { ManagePersonService } from './manage-person.service';

const revertTransaction: RevertTransaction = new RevertTransaction();
describe('ManagePersonService', () => {
  let httpMock: HttpTestingController;
  let service: ManagePersonService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: CoreContributorService,
          useClass: CoreContributorSerivceStub
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        }
      ]
    });
    service = TestBed.inject(ManagePersonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Verify person details from DB', () => {
    it('should verify the GCC National', () => {
      service.getPersonDetails(personWithGccId).subscribe();
      const task = httpMock.expectOne(req => req.urlWithParams === service.getPersonUrl(personWithGccId));
      expect(task.request.method).toBe('GET');
    });
  });
  describe('Patch the contributor Details', () => {
    it('should patch the form data', () => {
      service.socialInsuranceNo = 23532468;
      const testurl = `/api/v1/establishment/${service.getEstablishmentRegistrationNo()}/contributor/23532468/identity`;
      service.patchIdentityDetails('IQAMA', contributorPatchData, 23532468).subscribe();
      const req = httpMock.expectOne(testurl);
      expect(req.request.method).toBe('PATCH');
    });
  });
  describe('Get Active Status', () => [
    it('should return active status', () => {
      const url = `/api/v1/contributor?personId=${personResponse.personId}`;
      service.getActiveStatus(personResponse.personId).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    })
  ]);
  describe('Get Establishment Profile', () => [
    it('should get the establishment profile', () => {
      const url = `/api/v1/establishment/${establishmentResponce.registrationNo}/profile`;
      service.getEstablishmentProfile(establishmentResponce.registrationNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    })
  ]);
  describe('Get Work Flow Details', () => [
    it('should get the work flow details', () => {
      const estRegistrationNo = 34564566;
      const socialInsuranceNo = 34677657;
      const url = `/api/v1/establishment/${estRegistrationNo}/contributor/${socialInsuranceNo}/workflow`;
      service.getWorkFlowDetails(estRegistrationNo, socialInsuranceNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    })
  ]);
  describe('Search Contributor', () => [
    it('should search contributor', () => {
      const estIdentifier = 34564566;
      const cntIdentifier = 34677657;
      const url = `/api/v1/establishment/${estIdentifier}/contributor/${cntIdentifier}`;
      service.searchContributor(estIdentifier, cntIdentifier).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    })
  ]);
  describe('Revert Transaction', () => [
    it('should revert transaction', () => {
      const url = `/api/v1/establishment/${service.getEstablishmentRegistrationNo()}/contributor/100011182/revert`;
      service.revertTransaction(revertTransaction, 100011182).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
    })
  ]);
  describe('Update Task Workflow ', () => [
    it('should update task workflow', () => {
      const url = `/api/process-manager/v1/taskservice/update`;
      const updateRequest: RouterData = new RouterData();
      updateRequest.taskId = '123456';
      service.updateTaskWorkflow(updateRequest).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
    })
  ]);
  describe('Get Task Details', () => {
    it('should get the task details', () => {
      const url = `/api/v1/inbox/view?assigneeId=${'validator'}&resourceId=10011182`;
      service.getTaskDetails('validator', true, 10011182).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
    it('should get the task details', () => {
      const url = `/api/v1/inbox/view?assigneeId=${'validator'}&resourceId=10011182`;
      service.getTaskDetails('validator', false, null, '10011182').subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('Patch the ADDress  Details', () => {
    it('should patch the form data', () => {
      const testUrl = `/api/v1/person/${personResponse.personId}/address`;
      service.patchPersonAddressDetails(personResponse.personId, addressPatchData).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('PATCH');
    });
  });
  describe('Patch the return contributor transaction  Details', () => {
    it('should patch the form data', () => {
      const estRegistrationNo = 12345;
      const contributorId = 2345;
      const formData = new BPMUpdateRequest();
      const testUrl = `/api/v1/establishment/${estRegistrationNo}/contributor/${contributorId}/identity-workflow`;
      service.returnContributorTransaction(estRegistrationNo, contributorId, formData).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('PATCH');
    });
  });
  describe('Patch the reject contributor transaction  Details', () => {
    it('should patch the form data', () => {
      const estRegistrationNo = 12345;
      const contributorId = 2345;
      const formData = new BPMUpdateRequest();
      const testUrl = `/api/v1/establishment/${estRegistrationNo}/contributor/${contributorId}/identity-workflow`;
      service.rejectContributorTransaction(estRegistrationNo, contributorId, formData).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('PATCH');
    });
  });
  describe('Patch the approve contributor transaction Details', () => {
    it('should patch the form data', () => {
      const estRegistrationNo = 12345;
      const contributorId = 2345;
      const formData = new BPMUpdateRequest();
      const testUrl = `/api/v1/establishment/${estRegistrationNo}/contributor/${contributorId}/identity-workflow`;
      service.approveContributorTransaction(estRegistrationNo, contributorId, formData).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('PATCH');
    });
  });
  describe('fetch contributor details', () => {
    it('should fetch contributor details', () => {
      const registrationNo = 1234;
      const socialInsuranceNo = 12345;
      const testUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}?fetchType=EstAdminPerson`;
      service.fetchContributor(registrationNo, socialInsuranceNo).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('fetch person details', () => {
    it('should fetch person details', () => {
      const personId = 1234;
      const testUrl = `/api/v1/person/${personId}`;
      service.getPerson(personId).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('fetch bank details', () => {
    it('should fetch bank details', () => {
      const personId = 1234;
      const testUrl = `/api/v1/person/${personId}/bank`;
      service.getBankDetails(personId).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  it('should terminate all active engagements of the contributor', () => {
    const sin = 423641258;
    const registrationNo = 200085744;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/terminate`;
    service.terminateAllActiveEngagements(registrationNo, sin, new TerminatePayload()).subscribe(res => {
      expect(res).toBeTrue();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ cancelled: true });
  });
});
