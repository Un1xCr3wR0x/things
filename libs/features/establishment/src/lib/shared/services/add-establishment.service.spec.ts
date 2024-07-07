/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  AlertService,
  bindToObject,
  ContactDetails,
  EnvironmentToken,
  Establishment,
  EstablishmentPaymentDetails,
  EstablishmentStatusEnum,
  Person
} from '@gosi-ui/core';
import { throwError } from 'rxjs';
import {
  establishmentTestData,
  genericAddress,
  genericError,
  genericEstablishmentResponse,
  genericPersonResponse
} from 'testing';
import {
  AdminData,
  establishmentContactDetails,
  establishmentDetailsTestData,
  establishmentPaymentDetailsData,
  mainEstablishment,
  verifyOwnerResponse
} from '../../../../../../../testing';
import { EstablishmentTypeEnum } from '../enums';
import { EnrollEstablishmentResponse } from '../models';
import { AddEstablishmentService } from './add-establishment.service';

describe('addEstablishmentService', () => {
  let addEstablishmentService: AddEstablishmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AddEstablishmentService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    addEstablishmentService = TestBed.inject(AddEstablishmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('Should create AddaddEstablishmentService', () => {
    expect(addEstablishmentService).toBeTruthy();
  });

  describe('Set Establishment basic Details', () => {
    let establishment: Establishment;
    it('Should set establishment basic details', () => {
      establishment = addEstablishmentService.setEstablishmentDetails(
        new Establishment(),
        establishmentDetailsTestData
      );
      expect(establishment.legalEntity).toEqual(establishmentDetailsTestData.legalEntity);
    });
  });

  describe('Set Establishment Contact Details', () => {
    let establishment: Establishment;
    it('Should set establishment contact details', () => {
      establishment = addEstablishmentService.setContactDetails(
        new Establishment(),
        [genericAddress],
        bindToObject(new ContactDetails(), establishmentContactDetails)
      );
      expect(establishment.contactDetails.telephoneNo.primary).toEqual('12323');
    });
  });

  describe('set person response', () => {
    it('shoudl set pseron', () => {
      expect(
        addEstablishmentService.setPersonsResponse([new Person()], [genericPersonResponse], new Person())[0].personId
      ).toBe(genericPersonResponse.personId);
    });
  });

  describe('set admin details', () => {
    it('should set the admin reponse', () => {
      expect(addEstablishmentService.setAdminDetails(new Person(), genericPersonResponse).personId).toBe(
        genericPersonResponse.personId
      );
    });
  });

  describe('Set Establishment Payment Details', () => {
    let establishment: EstablishmentPaymentDetails;
    it('Should set payment  details', () => {
      establishment = addEstablishmentService.setPaymentDetails(
        new EstablishmentPaymentDetails(),
        establishmentPaymentDetailsData,
        establishmentPaymentDetailsData.bankAccount
      );
      expect(establishment.bankAccount.ibanAccountNo).toEqual('SA1234567890');
    });
  });

  describe('Should save the owner', () => {
    it('Should save the owner', () => {
      const saveOwnerUrl = `/api/v1/establishment/${mainEstablishment.registrationNo}/owner`;
      const person = bindToObject(new Person(), verifyOwnerResponse);
      addEstablishmentService.saveOwners([person], 0, mainEstablishment.registrationNo, true).subscribe();
      const req = httpMock.expectOne(saveOwnerUrl);
      expect(req.request.method).toBe('PUT');
    });
    it('Should save the owner', () => {
      const saveOwnerUrl = `/api/v1/establishment/${mainEstablishment.registrationNo}/owner`;
      const person = bindToObject(new Person(), verifyOwnerResponse);
      addEstablishmentService.saveOwners([person], 0, mainEstablishment.registrationNo, false).subscribe();
      const req = httpMock.expectOne(saveOwnerUrl);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('Save Establishment', () => {
    it('Should save the establishment details', () => {
      const addEstablishmentUrl = `/api/v1/establishment`;
      const testData: Establishment = bindToObject(new Establishment(), establishmentDetailsTestData);
      testData.status = { english: EstablishmentStatusEnum.CLOSED, arabic: '' };
      addEstablishmentService.inProgress = false;
      addEstablishmentService.saveEstablishment(testData).subscribe(response => {
        expect(response.registrationNo).toBe(testData.registrationNo);
      });
      const req = httpMock.expectOne(addEstablishmentUrl);
      req.flush(testData);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('Update Establishment', () => {
    it('Should update the establishment details', () => {
      const addEstablishmentUrl = `/api/v1/establishment`;
      const testData = bindToObject(new Establishment(), establishmentDetailsTestData);
      addEstablishmentService.updateEstablishment(testData).subscribe(response => {
        expect(response).toContain(EnrollEstablishmentResponse);
      });
      const req = httpMock.expectOne(addEstablishmentUrl);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('Save payment details', () => {
    it('Should update the establishment details', () => {
      const paymentUrl = `/api/v1/establishment/234385546/bank-account`;
      addEstablishmentService.savePaymentDetails(establishmentPaymentDetailsData, false).subscribe(response => {
        expect(response).toContain(EnrollEstablishmentResponse);
      });

      const req = httpMock.expectOne(paymentUrl);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('get verify CRNNumber', () => {
    it('should verify CRNNumber', () => {
      const verifyCRNUrl = `/api/v1/establishment?crNumber=123456`;
      addEstablishmentService.verifyCRNNumber(123456).subscribe();
      const req = httpMock.expectOne(verifyCRNUrl);
      expect(req.request.method).toBe('GET');
    });
    it('should throw error', () => {
      const verifyCRNUrl = `/api/v1/establishment?crNumber=123456`;
      addEstablishmentService.verifyCRNNumber(123456).subscribe();
      const req = httpMock.expectOne(verifyCRNUrl);
      req.flush(throwError(genericError));
      expect(req.request.method).toBe('GET');
    });
  });
  describe('verify Establishment', () => {
    it('should verify Establishment', () => {
      const verifyEstablishmentUrl = `/api/v1/establishment?licenseNumber=123456&licenseIssuingAuthority=authority&includeDraft=false`;
      addEstablishmentService.verifyEstablishment('123456', 'authority').subscribe();
      const req = httpMock.expectOne(verifyEstablishmentUrl);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('verify GCC EstablishmentDetails', () => {
    it('should verify GCCE stablishmentDetails', () => {
      const verifyEstablishmentUrl = `/api/v1/establishment?gccCountryName=saudi&gccRegistrationNumber=123456&includeDraft=false`;
      addEstablishmentService.verifyGCCEstablishmentDetails('saudi', '123456').subscribe();
      const req = httpMock.expectOne(verifyEstablishmentUrl);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('get update Owners', () => {
    it('should update Owner', () => {
      expect(addEstablishmentService.updateOwner(new Person(), AdminData.person)).toBeDefined();
    });
  });
  describe(' delete Owner', () => {
    it('should delete Owner', () => {
      const deleteOwnerUrl = `/api/v1/establishment/12345678/owner/123456`;
      addEstablishmentService.deleteOwner(12345678, 123456).subscribe();
      const req = httpMock.expectOne(deleteOwnerUrl);
      expect(req.request.method).toBe('DELETE');
    });
  });

  describe('get ProActive DocumentList', () => {
    it('should get ProActive DocumentList', () => {
      const registrationNumber = 200039505;
      const url = `/api/v1/establishment/${registrationNumber}/document`;
      addEstablishmentService.getProActiveDocumentList(200039505).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('Set response', () => {
    it('should set the response', () => {
      expect(addEstablishmentService.setResponse(new Establishment(), establishmentDetailsTestData)).toBeDefined();
    });
  });
  describe('cancel Transaction', () => {
    it('should cancel Transaction', () => {
      const url = `/api/v1/establishment/${establishmentDetailsTestData.registrationNo}/revert`;

      addEstablishmentService
        .cancelTransaction(bindToObject(new Establishment(), establishmentDetailsTestData).registrationNo)
        .subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
    });
  });

  describe(' validateBranchEstablishment', () => {
    it('should validate BranchEstablishment', () => {
      const alertService = { showErrorByKey: () => {} };
      spyOn(alertService, 'showErrorByKey');
      expect(
        addEstablishmentService.validateBranchEstablishment(
          bindToObject(new Establishment(), mainEstablishment),
          bindToObject(new Establishment(), mainEstablishment),
          alertService as any as AlertService
        )
      ).toBe(true);
    });
  });

  describe(' validateBranchEstablishment', () => {
    it('should validate BranchEstablishment and throw error', () => {
      const alertService = { showErrorByKey: () => {} };
      spyOn(alertService, 'showErrorByKey');
      addEstablishmentService.validateBranchEstablishment(
        bindToObject(new Establishment(), establishmentTestData[0]),
        bindToObject(new Establishment(), mainEstablishment),
        alertService as any as AlertService
      );
      expect(alertService.showErrorByKey).toHaveBeenCalled();
    });
  });

  describe(' validate Establishment', () => {
    it('should validate Establishment', () => {
      const establishments: Establishment[] = establishmentTestData.map(establishment =>
        bindToObject(new Establishment(), establishment)
      );
      expect(addEstablishmentService.checkEstablishmentAlreadyPresent(establishments)).toBeTruthy();
    });
  });

  describe('Check Validations against Main Establishment', () => {
    it('should check if establishment is a main', () => {
      const mainEst = {
        ...genericEstablishmentResponse,
        ...{ establishmentType: { english: EstablishmentTypeEnum.BRANCH, arabic: '' } }
      };
      const alertService = { showErrorByKey: (_: string) => {} };
      spyOn(alertService, 'showErrorByKey');
      addEstablishmentService.isMainEstablishmentEligible(mainEst, alertService as any as AlertService);
      expect(alertService.showErrorByKey).toHaveBeenCalledWith('ESTABLISHMENT.ERROR.ERR_MAIN_IS_BRANCH_ESTABLISHMENT');
    });
    it('should check if establishment is registered', () => {
      const mainEst = {
        ...genericEstablishmentResponse,
        ...{ status: { english: EstablishmentStatusEnum.CLOSED, arabic: '' } }
      };
      const alertService = { showErrorByKey: (_: string) => {} };
      spyOn(alertService, 'showErrorByKey');
      addEstablishmentService.isMainEstablishmentEligible(mainEst, alertService as any as AlertService);
      expect(alertService.showErrorByKey).toHaveBeenCalledWith('ESTABLISHMENT.ERROR.ERR_NOT_ACTIVE_ESTABLISHMENT');
    });
  });
});
