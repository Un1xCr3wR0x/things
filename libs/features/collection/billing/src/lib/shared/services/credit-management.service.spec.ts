import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApplicationTypeToken } from '@gosi-ui/core';
import {
  BackdatedTerminationTransactionDetailsMockData,
  contributorRefundRequestDetailsMockData,
  CreditBalanceDetailsMockData,
  creditRefundRequestDetailsMockData,
  creditRefundUpdateMockData,
  creditRequestDetailsMockData,
  vicContributorDetailsMockData,
  vicCreditRefundIbanMockData
} from 'testing/test-data';
import { CreditManagementService } from '.';
import {
  ContributorRefundRequest,
  CreditManagmentRequest,
  CreditRefundRequest,
  CreditRefundUpdateRequest
} from '../models';

describe('CreditManagementService', () => {
  let service: CreditManagementService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FontAwesomeModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: 'PUBLIC'
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(CreditManagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get Penality WaiverReason', () => {
    service.formValue = false; // invokes setter method
    expect(service.formValue).toBe(false);
  });
  it('should get Selected TerminationPeriod', () => {
    service.selectedTerminationPeriod = []; //invokes setter method
    expect(service.selectedTerminationPeriod.length).toEqual(0);
  });
  describe('getCreditBalance', () => {
    it('to get credit balance details', () => {
      const getCreditBalanceUrl = `/api/v1/establishment/504096157/account`;
      service.getAvailableCreditBalance(504096157).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getCreditBalanceUrl);
      expect(req.request.method).toBe('GET');
      req.flush(CreditBalanceDetailsMockData);
    });
  });
  describe('revertCreditRefundDetails', () => {
    it('to revert on delete  documents', () => {
      const requestNo = 123456;
      const registrationNo = 7854123456;
      const creditRefund = `/api/v1/establishment/${registrationNo}/credit-refund/${requestNo}/revert`;
      service.revertRefundDocumentDetails(registrationNo, requestNo).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(creditRefund);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
  describe('revertCreditTransferDetails', () => {
    it('to revert transfer documents', () => {
      const requestNo = 123456;
      const registrationNo = 7854123456;
      const creditTransfer = `/api/v1/establishment/${registrationNo}/credit-transfer/${requestNo}/revert`;
      service.revertDocumentDetails(registrationNo, requestNo).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(creditTransfer);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
  describe('submitCreditMangmentDetails', () => {
    it('to submit credit transfer details', () => {
      const registrationNo = 555222555;
      const submitCreditTransfer = `/api/v1/establishment/${registrationNo}/credit-transfer`;
      service
        .submitCreditMangmentDetails(
          registrationNo,
          new CreditManagmentRequest().fromJsonToObject(creditRequestDetailsMockData)
        )
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(submitCreditTransfer);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe('submitCreditRefundDetails', () => {
    it('to submit credit refund details', () => {
      const registrationNo = 555222555;
      const isIBanEdit = false;
      const submitRefundTransfer = `/api/v1/establishment/${registrationNo}/credit-refund?isIbanUpdated=${isIBanEdit}`;
      service
        .submitCreditRefundDetails(
          registrationNo,
          new CreditRefundRequest().fromJsonToObject(creditRefundRequestDetailsMockData)
        )
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(submitRefundTransfer);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe('updateCreditMangmentDetails', () => {
    it('to update credit transfer details', () => {
      const registrationNo = 555222555;
      const requestNo = 41455;
      const updateCreditTransfer = `/api/v1/establishment/${registrationNo}/credit-transfer/${requestNo}`;
      service
        .updateCreditMangmentDetails(
          registrationNo,
          requestNo,
          new CreditManagmentRequest().fromJsonToObject(creditRequestDetailsMockData)
        )
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(updateCreditTransfer);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
  describe('getAllCreditBalanceDetails', () => {
    it('to get Credit Balance Details', () => {
      const registrationNo = 555222555;
      const requestNo = 41455;
      const getCreditTransfer = `/api/v1/establishment/${registrationNo}/credit-transfer/${requestNo}`;
      service.getAllCreditBalanceDetails(registrationNo, requestNo).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(getCreditTransfer);
      expect(req.request.method).toBe('GET');
      req.flush('');
    });
  });
  describe('submitAfterEdit', () => {
    it('to submit after editing', () => {
      const taskId = 'cb7914aa-ab60-468b-b576-623eee111c9b';
      const workflowUser = 'mahesh';
      const submitCreditTransferAfterEdit = `/api/process-manager/v1/taskservice/update`;
      service.submitAfterEdit(taskId, workflowUser).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(submitCreditTransferAfterEdit);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe('submitVicCreditRefundDetails', () => {
    it('to submit vic credit refund details', () => {
      const sin = 325614789;
      const isIBanEdit = false;
      const submitVicRefundTransfer = `/api/v1/vic/${sin}/credit-refund?isIbanUpdated=${isIBanEdit}`;
      service
        .submitVicCreditRefundDetails(
          sin,
          new CreditRefundRequest().fromJsonToObject(creditRefundRequestDetailsMockData)
        )
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(submitVicRefundTransfer);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe('updateCreditRefundDetails', () => {
    it('to update credit refund details', () => {
      const registrationNo = 555222555;
      const requestNo = 41455;
      const isIBanEdit = false;
      const updateCreditRefund = `/api/v1/establishment/${registrationNo}/credit-refund/${requestNo}?isIbanUpdated=${isIBanEdit}`;
      service
        .updateCreditRefundDetails(
          registrationNo,
          requestNo,
          new CreditRefundUpdateRequest().fromJsonToObject(creditRefundUpdateMockData)
        )
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(updateCreditRefund);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
  describe('updateVicCreditRefundDetails', () => {
    it('to update vic credit refund details', () => {
      const sin = 325614783;
      const requestNo = 41455;
      const isIBanEdit = false;
      const updateVicCreditRefundDetails = `/api/v1/vic/${sin}/credit-refund/${requestNo}?isIbanUpdated=${isIBanEdit}`;
      service
        .updateVicCreditRefundDetails(
          sin,
          requestNo,
          new CreditRefundRequest().fromJsonToObject(creditRefundRequestDetailsMockData)
        )
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(updateVicCreditRefundDetails);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
  describe('getContirbutorDetails', () => {
    it('to get contributor details', () => {
      const sin = '321456789';
      const getContirbutorDetailsUrl = `/api/v1/contributor/${sin}`;
      service.getContirbutorDetails(321456789).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getContirbutorDetailsUrl);
      expect(req.request.method).toBe('GET');
      req.flush(vicContributorDetailsMockData);
    });
  });
  describe('getVicCreditRefundAmountDetails', () => {
    it('to get vic credit refund details', () => {
      const sin = '321456789';
      const requestNo = '1452';
      const getVicCreditRefundAmountDetails = `/api/v1/vic/${sin}/credit-refund/${requestNo}`;
      service.getVicCreditRefundAmountDetails(321456789, 1452).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getVicCreditRefundAmountDetails);
      expect(req.request.method).toBe('GET');
      req.flush(creditRefundRequestDetailsMockData);
    });
  });
  describe('getContirbutorIbanDetails', () => {
    it('to get contributor iban  details', () => {
      const regNo = '57896666';
      const sin = '60321441';
      const getContirbutorIbanDetails = `/api/v1/establishment/${regNo}/contributor/${sin}/bank-account`;
      service.getContirbutorIbanDetails(57896666, 60321441).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getContirbutorIbanDetails);
      expect(req.request.method).toBe('GET');
      req.flush(vicCreditRefundIbanMockData);
    });
  });
  describe('getContirbutorRefundDetails', () => {
    it('to get contributor refund details', () => {
      const sin = '315264788';
      const status = false;
      const getContirbutorRefundDetails = `/api/v1/vic/${sin}/account?active=${status}`;
      service.getContirbutorRefundDetails(315264788, false).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getContirbutorRefundDetails);
      expect(req.request.method).toBe('GET');
      req.flush(CreditBalanceDetailsMockData);
    });
  });
  describe('getRefundDetails', () => {
    it('to get  refund details', () => {
      const registrationNo = 555222555;
      const requestNo = 41455;
      const updateCreditRefund = `/api/v1/establishment/${registrationNo}/credit-refund/${requestNo}`;
      service.getRefundDetails(registrationNo, requestNo).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(updateCreditRefund);
      expect(req.request.method).toBe('GET');
      req.flush('');
    });
  });
  describe('revertVicCreditRefundDetails', () => {
    it('to revert vic refund documents on delete  documents', () => {
      const requestNo = 123456;
      const sin = 7854123456;
      const creditRefund = `/api/v1/vic/${sin}/credit-refund/${requestNo}/revert`;
      service.revertVicRefundDocumentDetails(sin, requestNo).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(creditRefund);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
  describe('revertContributorRefundDocumentDetails', () => {
    it('to revert contributor refund documents on delete  documents', () => {
      const requestNo = 123456;
      const sin = 7854123456;
      const registrationNo = 444444;
      const creditRefund = `/api/v1/establishment/${registrationNo}/contributor/${sin}/credit-refund/${requestNo}/revert`;
      service.revertContributorRefundDocumentDetails(registrationNo, sin, requestNo).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(creditRefund);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });

  describe('getBackdatedTeminationTransactionsDetails', () => {
    it('to get backdated termination details of contributor', () => {
      const socialInsuranceNo = '555555';
      const registrationNo = '321456789';
      const getContirbutorDetailsUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/credit-refund-quote`;
      service.getBackdatedTeminationTransactionsDetails(321456789, 555555).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(getContirbutorDetailsUrl);
      expect(req.request.method).toBe('GET');
      req.flush(BackdatedTerminationTransactionDetailsMockData);
    });
  });
  describe('updateContributorRefundDetails', () => {
    it('to update contributor refund  details', () => {
      const registrationNo = 555222555;
      const requestNo = 5555;
      const sin = 41455;
      const isIBanEdit = false;
      const updateContributorRefundDetails = `/api/v1/establishment/${registrationNo}/contributor/${sin}/credit-refund/${requestNo}?isIbanUpdated=${isIBanEdit}`;
      service
        .updateContributorRefundDetails(
          registrationNo,
          sin,
          requestNo,
          new ContributorRefundRequest().fromJsonToObject(contributorRefundRequestDetailsMockData)
        )
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(updateContributorRefundDetails);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
  describe('submitContributorRefundDetails', () => {
    it('to submit contributor  refund details', () => {
      const registrationNo = 555222555;
      const sin = 12452;
      const isIBanEdit = false;
      const submitContributorRefundDetails = `/api/v1/establishment/${registrationNo}/contributor/${sin}/credit-refund?isIbanUpdated=${isIBanEdit}`;
      service
        .submitContributorRefundDetails(
          registrationNo,
          12452,
          new ContributorRefundRequest().fromJsonToObject(contributorRefundRequestDetailsMockData)
        )
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(submitContributorRefundDetails);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
});
