/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ApplicationTypeToken,
  bindToObject,
  EnvironmentToken,
  LanguageToken,
  Person,
  RouterData,
  RouterDataToken,
  CryptoService
} from '@gosi-ui/core';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  contributorsTestData,
  genericError,
  injuryDetailsTestData,
  personDetailsTestData,
  closeInjuryTestData,
  ohRouterData,
  injuryHistoryResponseTestData,
  claimsWrapperData,
  claimsfilterParams,
  reqDocList,
  personalDetailsTestData,
  CryptoServiceStub
} from 'testing';
import { OhService } from '.';
import { OHReportTypes, Route } from '../enums';
import { InjuryConstants } from '../constants/injury-constants';

describe('OhService', () => {
  let httpMock: HttpTestingController;
  let service: OhService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: CryptoService, useClass: CryptoServiceStub }
      ]
    });
    service = TestBed.inject(OhService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('updateAddress', () => {
    it('to update Address', () => {
      service['personId'] = contributorsTestData.personId;
      const registrationNum = 10000602;
      const socialInsuranceNo = 419734586;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNum);
      const addPersonUrl = `/api/v1/establishment/${contributorsTestData.registrationNo}/contributor/${contributorsTestData.socialInsuranceNo}/address`;
      service.updateAddress(bindToObject(new Person(), personDetailsTestData)).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(addPersonUrl);
      expect(task.request.method).toBe('PATCH');
    });
    it('should throw an error for updateAddress', () => {
      spyOn(service, 'updateAddress').and.returnValue(throwError(genericError));
      expect(service['person']).not.toBe(null);
    });
  });
  describe('updateReimbursementClaim', () => {
    it('to update Reimbursement Claim', () => {
      const registrationNum = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      const reimbId = 1234;
      const mobileNo = personalDetailsTestData.contactDetail.mobileNo;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNum);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const updateReimbursementUrl = `/api/v1/establishment/${registrationNum}/contributor/${socialInsuranceNo}/injury/${injuryId}/reimbursement/${reimbId}`;
      service
        .updateReimbursementClaim('APETER@gosi.gov.sa', mobileNo, true, 2, 'uuid-567', reimbId)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      const task = httpMock.expectOne(updateReimbursementUrl);
      expect(task.request.method).toBe('PUT');
    });
  });
  describe('addReimbursementClaim', () => {
    it('to Add Reimbursement Claim', () => {
      const registrationNum = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      const mobileNo = personalDetailsTestData.contactDetail.mobileNo;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNum);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const updateReimbursementUrl = `/api/v1/establishment/${registrationNum}/contributor/${socialInsuranceNo}/injury/${injuryId}/reimbursement`;
      service.addReimbursementClaim('APETER@gosi.gov.sa', mobileNo, true, 2, 'uuid-567').subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(updateReimbursementUrl);
      expect(task.request.method).toBe('POST');
    });
  });
  describe('getSocialInsuranceNo', () => {
    it('Should getSocialInsuranceNo', () => {
      service.getSocialInsuranceNo();
      expect(service.getSocialInsuranceNo).not.toBe(null);
    });
  });
  describe('setTransactionId', () => {
    it('Should setTransactionId', () => {
      service.setTransactionId(15264256);
      expect(service.setTransactionId).not.toBe(null);
    });
  });
  describe('setTransactionRefId', () => {
    it('Should setTransactionRefId', () => {
      service.setTransactionRefId(15264256);
      expect(service.setTransactionRefId).not.toBe(null);
    });
  });
  describe('getEstablishmetRegistrationNo', () => {
    it('Should getEstablishmetRegistrationNo', () => {
      service.getEstablishmetRegistrationNo();
      expect(service.getEstablishmetRegistrationNo).not.toBe(null);
    });
  });
  describe('getTransactionId', () => {
    it('Should getTransactionId', () => {
      service.getTransactionId();
      expect(service.getTransactionId).not.toBe(null);
    });
  });
  describe('getTransactionRefId', () => {
    it('Should getTransactionRefId', () => {
      service.getTransactionRefId();
      expect(service.getTransactionRefId).not.toBe(null);
    });
  });
  describe('getRoute', () => {
    it('Should getRoute', () => {
      service.getRoute();
      expect(service.getRoute).not.toBe(null);
    });
  });

  describe('getInjuryHistoryDetails', () => {
    it('Should getInjuryHistoryDetails', () => {
      service.getInjuryHistoryDetails();
      expect(service.getInjuryHistoryDetails).not.toBe(null);
    });
  });
  describe('deleteTransactionDetails', () => {
    it('Should deleteTransactionDetails', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      const referenceNo = 52345;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/revert?referenceNo=${referenceNo}`;
      service.deleteTransactionDetails(referenceNo).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('PUT');
    });
  });
  describe('getOhHistory', () => {
    it('Should getOhHistory', () => {
      const Pagination = {
        page: {
          pageNo: 0,
          size: 5
        },
        sort: {
          column: 'status',
          direction: 'ascending'
        }
      };
      service.setSocialInsuranceNo(601336235);
      const url = `/api/v1/contributor/601336235/injury?isOtherEngInjuryReq=true&ohType=Injury&pageNo=0&pageSize=5`;
      service.getOhHistory(InjuryConstants.INJURY, Pagination, true).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(injuryHistoryResponseTestData);
    });
  });
  describe('getClaimsDetails', () => {
    it('Should getClaimsDetails', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/claims?minAmount=23&maxAmount=123&startDate=20-03-2021&endDate=20-03-2021&claimsPayee=Contributor&claimType=Reimbursement&status=approve`;
      service.getClaimsDetails(claimsfilterParams).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(claimsWrapperData);
    });
  });
  describe('getPersonDetails', () => {
    it('Should getPersonDetails', () => {
      service.getPersonDetails();
      expect(service.getPersonDetails).not.toBe(null);
    });
  });

  describe('fetchHoldAndAllowanceDetails', () => {
    it('Should fetchHoldAndAllowanceDetails', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/hold-resume`;
      service.fetchHoldAndAllowanceDetails(registrationNo, socialInsuranceNo, injuryId).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
    });
  });
  describe('getallowanceDetails', () => {
    it('to getallowanceDetails', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const allowanceUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/allowance`;
      service.getallowanceDetails().subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(allowanceUrl);
      expect(task.request.method).toBe('GET');
    });
  });
  describe('getallowanceDetails', () => {
    it('to getallowanceDetails', () => {
      const Pagination = {
        page: {
          pageNo: 0,
          size: 5
        },
        sort: {
          column: 'status',
          direction: 'ascending'
        }
      };
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const allowanceUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/allowance?pageNo=0&pageSize=5`;
      service.getallowanceDetails(Pagination).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(allowanceUrl);
      expect(task.request.method).toBe('GET');
    });
  });
  describe('getallowanceDetail', () => {
    it('to getallowanceDetail', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      const referenceNo = 56235;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const allowanceUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/ohClaim?referenceNo=${referenceNo}`;
      service.getallowanceDetail(registrationNo, socialInsuranceNo, injuryId, referenceNo).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(allowanceUrl);
      expect(task.request.method).toBe('GET');
    });
  });
  describe('getCompanionDetails', () => {
    it('to getCompanionDetails', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      const claimId = 12345;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const companionUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/allowance/${claimId}/companion`;
      service.getCompanionDetails(claimId).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(companionUrl);
      expect(task.request.method).toBe('GET');
    });
  });
  describe('getExpenseDetails', () => {
    it('to get ExpenseDetails ', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      const claimId = 56;
      const reimbursementId = 123;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/reimbursement/${reimbursementId}/expense-details?ohClaimId=${claimId}`;
      service.getExpenseDetails(claimId, reimbursementId).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
    });
  });
  describe('getTransaction', () => {
    it('to getTransaction Details', () => {
      const transactionTraceId = 45256;
      const getTxnUrl = `/api/v1/transaction/${transactionTraceId}`;
      service.getTransaction(transactionTraceId).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(getTxnUrl);
      expect(task.request.method).toBe('GET');
    });
  });

  describe('getPayeeDetails', () => {
    it('to getPayeeDetails', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/allowance-payee?isChangeRequired=false`;
      service.getPayeeDetails(registrationNo, socialInsuranceNo, injuryId).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
    });
  });
  describe('getPayeeDetails', () => {
    it('to getPayeeDetails', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/allowance-payee?isChangeRequired=true`;
      service.getPayeeDetails(registrationNo, socialInsuranceNo, injuryId, true).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
    });
  });
  describe('getBreakUpDetails', () => {
    it('to getBreakUpDetails', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      const claimId = 12345;
      const claimItemId = 33444;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/allowance/${claimId}/allowanceItem/${claimItemId}/allowance-details`;
      service.getBreakUpDetails(claimId, claimItemId).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
    });
  });
  describe('getInjuryId', () => {
    it('Should getInjuryId', () => {
      service.getInjuryId();
      expect(service.getInjuryId).not.toBe(null);
    });
  });
  describe('getPersonId', () => {
    it('Should getPersonId', () => {
      service.getPersonId();
      expect(service.getPersonId).not.toBe(null);
    });
  });
  describe('setRoute', () => {
    it('Should setRoute', () => {
      service.setRoute(Route.REOPEN_INJURY);
      expect(service.setRoute).not.toBe(null);
    });
  });
  describe('setReportType', () => {
    it('Should setReportType', () => {
      service.setReportType(OHReportTypes.Injury);
      expect(service.setReportType).not.toBe(null);
    });
  });
  describe('setPersonId', () => {
    it('Should setPersonId', () => {
      service.setPersonId(contributorsTestData.personId);
      expect(service['personId']).not.toBe(null);
    });
  });
  describe('getInjuryNumber', () => {
    it('Should getInjuryNumber', () => {
      service.setInjuryNumber(contributorsTestData.personId);
      service.getInjuryNumber();
      expect(service['injuryNumber']).not.toBe(null);
    });
  });
  describe('setValues', () => {
    it('Should setValues', () => {
      service.setValues(10000602, 601336235, 1232145367);
      expect(service['registrationNo']).toEqual(10000602);
    });
  });
  describe('setValues', () => {
    it('Should setValues', () => {
      service.setComplicationId(132421415);
      expect(service['complicationId']).not.toBe(null);
    });
  });
  describe('setPersonDetails', () => {
    it('Should setPersonDetails', () => {
      service.setPersonDetails(personDetailsTestData);
      expect(service.setPersonDetails).not.toBe(null);
    });
  });
  describe('setInjuryDetails', () => {
    it('Should setInjuryDetails', () => {
      service.setInjuryDetails(injuryDetailsTestData);
      expect(service.setInjuryDetails).not.toBe(null);
    });
  });
  describe('setRegistrationNo', () => {
    it('Should setRegistrationNo', () => {
      service.setRegistrationNo(contributorsTestData.registrationNo);
      expect(service['registrationNo']).not.toBe(null);
    });
  });
  describe('setComplicationId', () => {
    it('Should setComplicationId', () => {
      service.setComplicationId(contributorsTestData.complicationId);
      expect(service.setComplicationId).not.toBe(null);
    });
  });
  describe('setInjuryNumber', () => {
    it('Should setInjuryNumber', () => {
      service.setInjuryNumber(contributorsTestData.injuryId);
      expect(service['injuryId']).not.toBe(null);
    });
  });
  describe('setInjuryNumber', () => {
    it('Should setInjuryNumber', () => {
      service.setInjuryNumber(contributorsTestData.injuryId);
      expect(service['injuryId']).not.toBe(null);
    });
  });
  describe('getReportType', () => {
    it('Should getReportType', () => {
      service.setReportType(OHReportTypes.Complication);
      service.getReportType();
      expect(service['reportType']).not.toBe(null);
    });
  });
  describe('setSocialInsuranceNo', () => {
    it('Should setSocialInsuranceNo', () => {
      service.setSocialInsuranceNo(contributorsTestData.socialInsuranceNo);
      expect(service['socialInsuranceNo']).not.toBe(null);
    });
  });
  describe('setEstablishmetRegistrationNo', () => {
    it('Should setEstablishmetRegistrationNo', () => {
      service.setEstablishmetRegistrationNo(contributorsTestData.establishmentRegNo);
      expect(service['establishmentRegNo']).not.toBe(null);
    });
  });
  describe('setRegistrationNumber', () => {
    it('Should setRegistrationNumber', () => {
      service.setRegistrationNo(contributorsTestData.registrationNo);
      expect(service['registrationNo']).not.toBe(null);
    });
  });
  describe('getRegistrationNumber', () => {
    it('Should getRegistrationNumber', () => {
      service.getRegistrationNumber();
      service.setRegistrationNo(contributorsTestData.registrationNo);
      expect(service['registrationNo']).not.toBe(null);
    });
  });

  describe('setIsWorkflow', () => {
    it('Should set workflow', () => {
      service.setIsWorkflow(false);
      expect(service['isWorkflow']).not.toBe(null);
    });
  });
  describe('getIsWorkflow', () => {
    it('Should get IsWorkflow', () => {
      service.getIsWorkflow();
      service.setIsWorkflow(false);
      expect(service['isWorkflow']).not.toBe(null);
    });
  });

  describe('setClosingstatus', () => {
    it('Should set closing status', () => {
      service.setClosingstatus(closeInjuryTestData.closedStatus);
      expect(service['closedStatus']).not.toBe(null);
    });
  });
  describe('getClosingstatus', () => {
    it('Should get Closingstatus', () => {
      service.getClosingstatus();
      service.setClosingstatus(closeInjuryTestData.closedStatus);
      expect(service['closedStatus']).not.toBe(null);
    });
  });
  describe('setInjurystatus', () => {
    it('Should set Injurystatus', () => {
      service.setInjurystatus(closeInjuryTestData.closedStatus);
      expect(service['injuryStatus']).not.toBe(null);
    });
  });
  describe('getInjurystatus', () => {
    it('Should get Injurystatus', () => {
      service.getInjurystatus();
      service.setInjurystatus(closeInjuryTestData.closedStatus);
      expect(service['injuryStatus']).not.toBe(null);
    });
  });
  describe('setComplicationstatus', () => {
    it('Should set Injurystatus', () => {
      service.setComplicationstatus(closeInjuryTestData.closedStatus);
      expect(service['complicationStatus']).not.toBe(null);
    });
  });
  describe('getComplicationstatus', () => {
    it('Should get Injurystatus', () => {
      service.getComplicationstatus();
      service.setComplicationstatus(closeInjuryTestData.closedStatus);
      expect(service['complicationStatus']).not.toBe(null);
    });
  });
  describe('setIsClosed', () => {
    it('Should set IsClosed', () => {
      service.setIsClosed(closeInjuryTestData.isClosed);
      expect(service['isClosed']).not.toBe(null);
    });
  });
  describe('getIsClosed', () => {
    it('Should get IsClosed', () => {
      service.getIsClosed();
      service.setIsClosed(closeInjuryTestData.isClosed);
      expect(service['isClosed']).not.toBe(null);
    });
  });

  describe('setIdForValidatorAction', () => {
    it('Should set IdForValidatorAction', () => {
      service.setIdForValidatorAction(1002318957);
      expect(service['id']).not.toBe(null);
    });
  });

  describe('getNavigationIndicator', () => {
    it('Should get NavigationIndicator', () => {
      service.getNavigationIndicator();
      service.setNavigationIndicator(5);
      expect(service['navigationIndicator']).not.toBe(null);
    });
  });
  describe('getNavigation', () => {
    it('Should get getNavigation', () => {
      service.getNavigation();
      service.setNavigation(5);
      expect(service['param']).not.toBe(null);
    });
  });

  describe('setNavigationIndicator', () => {
    it('Should setNavigationIndicator', () => {
      service.setNavigationIndicator(5);
      expect(service['navigationIndicator']).not.toBe(null);
    });
  });
  describe('set RouterData', () => {
    it('Should set RouterData', () => {
      service.setRouterData(bindToObject(new RouterData(), ohRouterData));
      expect(service['routerData']).not.toBe(null);
    });
  });
  describe('getPersonId', () => {
    it('Should getPersonId', () => {
      service.setPersonId(12332132);
      service.getPersonId();
      expect(service['personId']).not.toBe(null);
    });
  });
  describe('getRegistrationNumber', () => {
    it('Should getRegistrationNumber', () => {
      service.setRegistrationNo(12332132);
      service.getRegistrationNumber();
      expect(service['registrationNo']).not.toBe(null);
    });
  });
  describe('setClosingstatus', () => {
    it('Should setClosingstatus', () => {
      service.setClosingstatus(injuryDetailsTestData.injuryDetailsDto.injuryStatus);
      expect(service['closedStatus']).not.toBe(null);
    });
  });
  describe('getRouterData', () => {
    it('Should get RouterData', () => {
      service.getRouterData();
      service.setRouterData(bindToObject(new RouterData(), ohRouterData));
      expect(service['routerData']).not.toBe(null);
    });
  });
  describe('getOHInspectionDetails', () => {
    it('Should getOHInspectionDetailsWithInjury', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const url = `/api/v1/inspection?injuryId=${injuryId}`;
      service.getOHInspectionDetailsWithInjury(injuryId).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
    });
  });
  describe('getOHInspectionDetails', () => {
    it('Should getOHInspectionDetailsWithSin', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service.setComplicationId(injuryId);
      const url = `/api/v1/inspection?socialInsuranceNo=${socialInsuranceNo}`;
      service.getOHInspectionDetailsWithSin(socialInsuranceNo).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
    });
  });
  describe('complicationRejection', () => {
    it('Should complicationRejection', () => {
      const registrationNo = 10000602;
      const socialInsuranceNo = 601336235;
      const injuryId = 1002318957;
      const injuryNumber = 13124235;
      const reason = {
        englih: '',
        arabic: ''
      };
      service.setSocialInsuranceNo(socialInsuranceNo);
      service.setRegistrationNo(registrationNo);
      service.setInjuryId(injuryId);
      service['injuryNumber'] = injuryNumber;
      service.setComplicationId(injuryId);
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryNumber}/reject-parent`;
      service.complicationRejection(reason, registrationNo, socialInsuranceNo).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('PUT');
    });
  });
  it('Should perform validatorAction', () => {
    service.setRegistrationNo(10000602);
    service.setSocialInsuranceNo(601336235);
    service.setIdForValidatorAction(1001923482);
    const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001923482/req-docs`;
    service.validatorAction(reqDocList).subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(injuryDetailsTestData);
  });
  it('Should perform validatorAction', () => {
    service.setRegistrationNo(10000602);
    service.setSocialInsuranceNo(601336235);
    service.setIdForValidatorAction(1001923482);
    const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001923482/req-docs`;
    service.validatorAction(reqDocList).subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(injuryDetailsTestData);
  });
});

