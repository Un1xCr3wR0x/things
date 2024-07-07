/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationTypeToken, EnvironmentToken, LanguageToken, AuthTokenService } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  approveResponse,
  contributorsTestData,
  invoiceData,
  paymentSummaryClaims,
  previousClaims,
  successMessage,
  filterParams,
  treatmentData,
  treatmentFilter,
  rejectedServices,
  rejectRequests,
  auditDetails,
  allowanceSummary,
  auditorFilter,
  allowanceFilter,
  AuthTokenServiceStub
} from 'testing';
import { OhClaimsService } from './oh-claims.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('OhClaimsService', () => {
  let httpMock: HttpTestingController;
  let service: OhClaimsService;
  const token =
    'eyJraWQiOiJPbmxpbmVVc2VyIiwieDV0IjoiWHl2WmttT1FBcnZuVnZrZ2pBZ0NkS0JyVjVJIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vSUFNQVBQTFZUMDEuZ29zaS5pbnM6Nzc3Ny9vYXV0aDIiLCJhdWQiOiJFc3RhYmxpc2htZW50RVdSUyIsImV4cCI6MTYzNjQ1OTYzNSwianRpIjoiQjdmalp1aXRkakRrUU9oa3dVWkozdyIsImlhdCI6MTYwNDkyMzYzNSwic3ViIjoiMTAyOTA1Mjg1NyIsImdvc2lzY3AiOiJbe1wiZXN0YWJsaXNobWVudFwiOlwiMTAwOTMwNTYxMVwiLCBcInJvbGVcIjpbXCI4XCIsXCIyN1wiXX1dIiwicHJlZmVycmVkTGFuZ3VhZ2UgIjoiTk9UX0ZPVU5EICIsImxvbmduYW1lYXJhYmljIjoi2YXZhti12YjYsdmF2KjYp9ix2YPYudio2K_Yp9mE2YTZh9in2YTYrNmG2YrYrSAiLCJsb25nbmFtZWVuZ2xpc2giOiJOT1RfRk9VTkQgIiwiT0FVVEhfVE9LRU4iOiJleUpyYVdRaU9pSmtaV1poZFd4MElpd2llRFYwSWpvaU4ydENhR0Z6YTJWc1YxUndiV1J6Tmxka1NrcGlkMVUzZVVWcklpd2lZV3huSWpvaVVsTXlOVFlpZlEuZXlKbGVIQWlPakUyTURRNU1qY3lNelVzSW1wMGFTSTZJbVp2VjNwalJEaFRSbkIzT0c0d2FrdG1PV3RYYlVFaUxDSnBZWFFpT2pFMk1EUTVNak0yTXpVc0luTjFZaUk2SWpFd01qa3dOVEk0TlRjaUxDSnpaWE56YVc5dVgybGtJam9pU0RaQmRXeDJTMHBYVmpaME4wUjNTamgyVTFKblp6MDlmakJuUzNGYVVuTllNMDh4Y0M4MGRVRklWMFpPWjNjOVBTSXNJbVJ2YldGcGJpSTZJbVJsWm1GMWJIUWlmUS5JMGJUamxfbnlEcVJmVWNGaHNSVXJlM3VaXzVoaGpSYVhhYnNhaGtwTVhJSUlWM1ltcEFmSFZ1aWlTREk4ZF9ZRnZCYkQtLThpdEZoc0M4UmRYRkdudThVWFlwMTQ4eFJETjRhV0RVNXdjWkI5VUxoYnh2QW51SFZLNmpjVF8wTHZJS0htdFV0RFNYN19uYkhQRk9iYTZ0Q1M5V3ZhcDMxM090VUhCa3RxNWpCb1laREpXVVctLVRYTzFiLWZyaFN1VnlMRTU1MHBuYmJuY3hfWEVXdWo2WWhzeGxNRnhrb2toZ1VMMnNEcnhqU1I0MEJmcF9sWDItbVQyWVpkeVZxc0xndVg3U3ktNnBtRDNBX2QyREVwNVVIRVhuQnNwcUFJOVdTX04tV1RXZGFVRTRaVHZ2ekZHN2ctcWdqVzhvS3ZFbGozT1dzcC1zdWUyT3JkZkhFcnciLCJnb3Npc2NwICI6Ilt7XCJlc3RhYmxpc2htZW50XCI6XCIxMDA5MzA1NjExXCIsIFwicm9sZVwiOltcIjhcIixcIjI3XCJdfV0gIiwiY3VzdG9tZUF0dHIxIjoiQ3VzdG9tVmFsdWUiLCJqc29uc2NwICI6Ik5PVF9GT1VORCAiLCJjbGllbnQiOiJFc3RhYmxpc2htZW50UHVibGljMDEiLCJzY29wZSI6WyJFc3RhYmxpc2htZW50RVdSUy5yZWFkIl0sImRvbWFpbiI6Ik9ubGluZVVzZXIifQ.MctaAzX3HIP0GbolNoa8BfIqvbh7PWY0J-TU92PbYGAGZftkHq-9EiX6_yKcwRLj49GGNHClrajFdLvIvjbe1motflBz1PzMtnLFeZVNvl6OWgVzVHNAi9DNNo5ubMfsombP6fOx0fzbWlrc3dPZXjaXVnKMdtdjvcsEWEcsXZLthh4IFi9H39T4ResX2KieBqikY_R9rkWl4RXj6ZkipaKAK--3CWjK4BQXUs_TD94f3RJUSdVHjvRsMyL2Ia49HvUuZf_3ZmH8QNRv5r71xXVplKIZyttAn-EKCPOQ_veFodY20epgjzaOU9So8iK7SDQ3Um0FAws6Palo7WUJUg';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: AuthTokenService,
          useClass: AuthTokenServiceStub
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ]
    });
    service = TestBed.inject(OhClaimsService);
    httpMock = TestBed.inject(HttpTestingController);
    service.tokenService.setAuthToken(token);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('setRegistrationNo', () => {
    it('Should setRegistrationNo', () => {
      service.setRegistrationNo(contributorsTestData.registrationNo);
      expect(service.setRegistrationNo).not.toBe(null);
    });
  });
  describe('setTPACode', () => {
    it('Should setTPACode', () => {
      service.setTPACode('TCS');
      expect(service.setTPACode).not.toBe(null);
    });
  });
  describe('getTPACode', () => {
    it('Should getTPACode', () => {
      service.getTPACode();
      expect(service.getTPACode).not.toBe(null);
    });
  });
  describe('setInvoiceDetails', () => {
    it('Should setInvoiceDetails', () => {
      service.setInvoiceDetails(invoiceData);
      expect(service.invoiceDetails).not.toBe(null);
    });
  });
  describe('getInvoiceData', () => {
    it('Should getInvoiceData', () => {
      service.setInvoiceDetails(invoiceData);
      service.getInvoiceData();
      expect(service.invoiceDetails).not.toBe(null);
    });
  });
  describe('setReferenceNo', () => {
    it('Should setReferenceNo', () => {
      service.setReferenceNo(10245);
      expect(service.referenceNo).not.toBe(null);
    });
  });
  describe('getReferenceNo', () => {
    it('Should getReferenceNo', () => {
      service.setReferenceNo(10245);
      service.getReferenceNo();
      expect(service.referenceNo).not.toBe(null);
    });
  });
  describe('setInvoiceDetails', () => {
    it('Should setInvoiceDetails', () => {
      service.setClaimNo(1343);
      expect(service.claimNo).not.toBe(null);
    });
  });
  describe('setFilterValues', () => {
    it('Should setFilterValues', () => {
      service.setFilterValues(allowanceFilter);
      expect(service.filter).not.toBe(null);
    });
  });
  describe('getInvoiceData', () => {
    it('Should getInvoiceData', () => {
      service.setClaimNo(1343);
      service.getClaimNo();
      expect(service.claimNo).not.toBe(null);
    });
  });
  describe('getInvoiceId', () => {
    it('Should getInvoiceId', () => {
      service.getInvoiceId();
      expect(service.getInvoiceId).not.toBe(null);
    });
  });
  describe('assignAuditing', () => {
    it('Should assignAuditing', () => {
      const auditRequest = {
        auditForm: {
          auditComments: 'dfsd',
          auditReason: {
            english: 'dsf',
            arabic: ''
          }
        }
      };
      const assignAuditUrl = `/api/v1/tpa/TCS/oh-invoice/321/audit`;
      service.assignAuditing('TCS', 321, auditRequest).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(assignAuditUrl);
      expect(task.request.method).toBe('PUT');
      task.flush(approveResponse);
    });
  });
  describe('assignForAuditing', () => {
    it('Should assignForAuditing', () => {
      const auditRequest = {
        auditForm: {
          auditComments: 'dfsd',
          auditReason: {
            english: 'dsf',
            arabic: ''
          }
        }
      };
      const assignAuditUrl = `/api/v1/establishment/10000602/contributor/601336235/injury/12312455/audit-allowance `;
      service.assignForAuditing(10000602, 601336235, 12312455, auditRequest).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(assignAuditUrl);
      expect(task.request.method).toBe('PUT');
      task.flush(approveResponse);
    });
  });
  describe('rejectAuditing', () => {
    it('Should rejectAuditing', () => {
      const assignAuditUrl = `/api/v1/tpa/TCS/oh-invoice/321/reject`;
      service.rejectAuditing('TCS', 321, 323, rejectedServices, rejectedServices).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(assignAuditUrl);
      expect(task.request.method).toBe('PUT');
      task.flush(approveResponse);
    });
  });
  describe('rejectAllowance', () => {
    it('Should rejectAllowance', () => {
      const assignAuditUrl = `/api/v1/establishment/10000602/contributor/601336235/injury/12/claim/reject?auditNo=123`;
      service.rejectAllowance(123, 12, rejectRequests, 10000602, 601336235).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(assignAuditUrl);
      expect(task.request.method).toBe('PUT');
      task.flush(approveResponse);
    });
  });
  describe('getAuditDetails', () => {
    it('Should getAuditDetails', () => {
      const auditUrl = `/api/v1/injury-audit/59`;
      service.getAuditDetails(59).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(auditUrl);
      expect(task.request.method).toBe('GET');
      task.flush(auditDetails);
    });
  });
  describe('fetchAllowanceSummary', () => {
    it('Should fetchAllowanceSummary', () => {
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001232445/allowance-summary?isAuditAllowance=true&auditNo=59`;
      service.fetchAllowanceSummary(1001232445, 59, 10000602, 601336235).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(allowanceSummary);
    });
  });
  describe('fetchPreviousAllowanceSummary', () => {
    it('Should fetchPreviousAllowanceSummary', () => {
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001232445/allowance-summary?isAuditAllowance=false&auditNo=59`;
      service.fetchPreviousAllowanceSummary(1001232445, 59, 10000602, 601336235).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(allowanceSummary);
    });
  });
  describe('fetchAllowanceDetails', () => {
    it('Should fetchAllowanceDetails', () => {
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001232445/allowance-details?auditAllowance=true&auditNo=59`;
      service.fetchAllowanceDetails(1001232445, 59, 10000602, 601336235).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(allowanceSummary);
    });
  });
  describe('fetchAllAllowanceDetails', () => {
    it('Should fetchAllAllowanceDetails', () => {
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001232445/ohClaim/123/allowances?auditNo=59`;
      service.fetchAllAllowanceDetails(1001232445, 59, 10000602, 601336235, 123).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(allowanceSummary);
    });
  });
  describe('fetchPreviousAllowance', () => {
    it('Should fetchPreviousAllowance', () => {
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001232445/allowance-details?auditAllowance=false&auditNo=59`;
      service.fetchPreviousAllowance(1001232445, 59, 10000602, 601336235).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(allowanceSummary);
    });
  });
  describe('getInvoiceDetails', () => {
    it('Should getInvoiceDetails', () => {
      const url = `/api/v1/tpa/TCS/oh-invoice/321?isMaxLimitExcluded=true&minNoOfDays=30&endDate=20-03-2021&maxAmount=123&minAmount=23&startDate=20-03-2021&noOfDays=1&noOfDays=2&noOfDays=3`;
      service.getInvoiceDetails('TCS', 321, filterParams).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(invoiceData);
    });
  });
  describe('getRejectedAllowanceDetails', () => {
    it('Should getRejectedAllowanceDetails', () => {
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1000965714/claim/audit-reject`;
      service.getRejectedAllowanceDetails(10000602, 601336235, 1000965714).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(invoiceData);
    });
  });
  describe('getTreatmentServiceDetails', () => {
    it('Should getTreatmentServiceDetails', () => {
      const Pagination = {
        page: {
          pageNo: 0,
          size: 5
        },
        sort: {
          column: 'status',
          direction: 'ASC'
        }
      };
      const url = `/api/v1/tpa/TCS/oh-invoice/321/invoice-item/323/service-details?pageNo=0&pageSize=5&&sort.column=status&sort.direction=ASC`;
      service.getTreatmentServiceDetails('TCS', 321, 323, Pagination, treatmentFilter).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(treatmentData);
    });
  });
  describe('getTreatmentServiceDetailsNoSort', () => {
    it('Should getTreatmentServiceDetailsNoSort', () => {
      const url = `/api/v1/tpa/TCS/oh-invoice/321/invoice-item/323/service-details&`;
      service.getTreatmentServiceDetails('TCS', 321, 323, null, treatmentFilter).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(treatmentData);
    });
  });
  describe('submitReimbursement', () => {
    it('Should submitReimbursement', () => {
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/123/reimbursement/1223/submit`;
      service.submitReimbursement(10000602, 601336235, 123, 1223).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('PATCH');
      task.flush(successMessage);
    });
  });
  describe('getRejectedInvoice', () => {
    it('Should getRejectedInvoice', () => {
      const url = `/api/v1/tpa/TCS/oh-invoice/1/reject`;
      service.getRejectedInvoice('TCS', 1).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(invoiceData);
    });
  });
  describe('getBatchDetails', () => {
    it('Should getBatchDetails', () => {
      const url = `/api/v1/tpa/TCS/oh-invoice/1234/batch-summary`;
      service.getBatchDetails('TCS', 1234).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(invoiceData);
    });
  });
  describe('getRecoveryDetails', () => {
    it('Should getRecoveryDetails', () => {
      const url = `/api/v1/tpa/TCS/oh-invoice/1234/invoice-item/123/recovery-details`;
      service.getRecoveryDetails('TCS', 1234, 123).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(treatmentData);
    });
  });
  describe('fetchClaimSummary', () => {
    it('Should fetchClaimSummary', () => {
      const url = `/api/v1/tpa/TCS/oh-invoice/321/invoice-item/123`;
      service.fetchClaimSummary('TCS', 321, 123).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(paymentSummaryClaims);
    });
  });
  describe('fetchPrevioucClaims', () => {
    it('Should fetchPrevioucClaims', () => {
      const url = `/api/v1/establishment/1000602/contributor/601336235/injury/123/previous-claims`;
      service.fetchPrevioucClaims(1000602, 601336235, 123).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(previousClaims);
    });
  });

  describe('filterPrevAllowanceDetails', () => {
    it('Should filterPrevAllowanceDetails', () => {
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001232445/allowance-details?auditAllowance=false&auditNo=59`;
      service.filterPrevAllowanc(59, 1001232445, null, null, 10000602, 601336235).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(allowanceSummary);
    });
  });

  describe('filterPrevAllowanceDetails', () => {
    it('Should filterPrevAllowanceDetails', () => {
      const pagination = {
        page: {
          pageNo: 0,
          size: 5
        },
        sort: {
          column: 'status',
          direction: 'ASC'
        }
      };
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001232445/allowance-details?auditAllowance=false&pageNo=0&pageSize=5&auditNo=59&sort.column=status&sort.direction=ASC`;
      service.filterPrevAllowanc(59, 1001232445, null, pagination, 10000602, 601336235).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(allowanceSummary);
    });
  });
  describe('filterAllowanceDetails', () => {
    it('Should filterAllowanceDetails List', () => {
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/1001232445/allowance-details?auditAllowance=true&auditNo=59`;
      service.filterAllowanceDetails(59, 1001232445, null, null, 10000602, 601336235).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('GET');
      task.flush(allowanceSummary);
    });
  });

  /*describe('filterAllowanceDetails', () => {
    it('Should filterAllowanceDetails', () => {
      const pagination = {
        page: {
          pageNo: 0,
          size: 5
        },
        sort: {
          column: 'status',
          direction: 'ASC'
        }
      };
      const urls = `/api/v1/injury-audit/59/injury/1001232445/allowance-details?auditAllowance=true&claimType=ConveyanceAllowance&noOfDaysMax=10&noOfDaysMin=0&visitsMax=11&visitsMin=0&sort.column=status&sort.direction=ASC`;
      service.filterAllowanceDetails(59,1001232445,allowanceFilter,pagination).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(urls);
      expect(task.request.method).toBe('GET');
      task.flush(allowanceSummary);
    });
  });*/

  describe('filterAuditDetails', () => {
    it('Should filterAuditDetails', () => {
      const auditUrl = `/api/v1/injury-audit/59?maxAllowances=10&maxNewAllowances=11&minAllowances=1&minNewAllowances=1&ohType=injury`;
      service.filterAuditDetails(59, auditorFilter).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(auditUrl);
      expect(task.request.method).toBe('GET');
      task.flush(auditDetails);
    });
  });
  describe('filterAllowance', () => {
    it('Should filterAllowance', () => {
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/123/allowance-details?auditAllowance=false&auditNo=59`;
      const filterValues = {
        claimType: ['Reimbursement Claim'],
        noOfDaysMax: 2,
        noOfDaysMin: 4,
        visitsMax: 1,
        visitsMin: 4
      };
      const pagination = {
        sort: {
          column: 1
        }
      };
      service.filter = null;
      service.filterAllowance(url, filterValues, pagination);
      expect(service.filter).toEqual(null);
    });
  });
  describe('filterAllowance', () => {
    it('Should filterAllowance', () => {
      const url = `/api/v1/establishment/10000602/contributor/601336235/injury/123/allowance-details?auditAllowance=false&auditNo=59`;
      const filterValues = null;
      service.filter = {
        claimType: ['Reimbursement Claim'],
        noOfDaysMax: 2,
        noOfDaysMin: 4,
        visitsMax: 1,
        visitsMin: 4
      };
      const pagination = {
        sort: {
          column: 1
        }
      };
      service.filterAllowance(url, filterValues, pagination);
      expect(service.filter).not.toBe(null);
    });
  });
});
