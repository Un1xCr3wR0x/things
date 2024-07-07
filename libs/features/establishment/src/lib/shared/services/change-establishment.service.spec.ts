/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeEnum,
  bindToObject,
  Establishment,
  EstablishmentStatusEnum,
  RouterConstants,
  TransactionFeedback
} from '@gosi-ui/core';
import {
  establishmentDetailsTestData,
  establishmentOwnersWrapperTestData,
  genericEstablishmentResponse,
  patchAddressDetailsMockData,
  patchBankDetailsMockData,
  patchBasicDetailsMockData,
  patchContactDetailsMockData,
  patchIdentifierDetailsMockData,
  patchLegalEntityMockData,
  patchMofDetailsMockData,
  transactionFeedbackMockData
} from 'testing';
import { hasLicenseChanged } from '../../change-establishment/components/change-identifier-details-sc/change-identifier-helper';
import { EstablishmentConstants } from '../constants';
import { EstablishmentQueryKeysEnum, EstablishmentRoutesEnum, EstablishmentStatusErrorEnum } from '../enums';
import {
  GenericValidationKey,
  LateFeeRequest,
  PatchBasicDetails,
  PatchContactDetails,
  PatchIdentifierDetails,
  PatchLegalEntity,
  PatchMofPaymentDetails
} from '../models';
import { PatchAddressDetails } from '../models/patch-address-details';
import { PatchBankDetails } from '../models/patch-bank-details';
import { getEstablishmentStatusErrorKey, hasNumberFieldChange } from '../utils';
import { ChangeEstablishmentService } from './change-establishment.service';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
describe('ChangeEstablishmentService', () => {
  let changeEstablishmentService: ChangeEstablishmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: Router,
          useValue: routerSpy
        }
      ]
    });
    changeEstablishmentService = TestBed.inject(ChangeEstablishmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(changeEstablishmentService).toBeTruthy();
  });

  describe('get Establishment WorkflowStatus', () => {
    it('should  get Establishment WorkflowStatus', () => {
      const registrationNo = 34564566;
      const getUrl = `/api/v1/establishment/${registrationNo}/workflow-status`;
      changeEstablishmentService.getEstablishmentWorkflowStatus(registrationNo).subscribe(res => {
        expect(res).toBeDefined();
      });
      const req = httpMock.expectOne(getUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('update Establishment Basic Details', () => {
    it('should  update Establishment Basic Details', () => {
      const regNo = 357900;
      const basicDetails: PatchBasicDetails = patchBasicDetailsMockData;
      const url = `/api/v1/establishment/357900/basic-details`;

      changeEstablishmentService.updateEstablishmentBasicDetails(regNo, basicDetails).subscribe(res => {
        expect(res.transactionId).toBe(transactionFeedbackMockData.transactionId);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      req.flush(transactionFeedbackMockData);
    });
  });
  describe('change address details', () => {
    it('should  change address details', () => {
      const registrationNo = 100011182;
      const updateaddressDetails: PatchAddressDetails = patchAddressDetailsMockData;
      const url = `/api/v1/establishment/100011182/address-details`;

      changeEstablishmentService.changeAddressDetails(registrationNo, updateaddressDetails).subscribe(res => {
        expect(res.transactionId).toBe(transactionFeedbackMockData.transactionId);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      req.flush(transactionFeedbackMockData);
    });
  });
  describe('change contact details', () => {
    it('should  change contact details', () => {
      const registrationNo = 100011182;
      const updatedContactDetails: PatchContactDetails = patchContactDetailsMockData;
      const url = `/api/v1/establishment/100011182/contact-details`;

      changeEstablishmentService.changeContactDetails(registrationNo, updatedContactDetails).subscribe(res => {
        expect(res.transactionId).toBe(transactionFeedbackMockData.transactionId);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      req.flush(transactionFeedbackMockData);
    });
  });
  describe('change legal details', () => {
    it('should  change legal details', () => {
      const registrationNo = 100011182;
      const legalEntityData: PatchLegalEntity = patchLegalEntityMockData;
      const url = `/api/v1/establishment/100011182/legal-entity`;

      changeEstablishmentService.changeLegalEntity(registrationNo, legalEntityData).subscribe(res => {
        expect(res.transactionId).toBe(transactionFeedbackMockData.transactionId);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      req.flush(transactionFeedbackMockData);
    });
  });
  describe('change identifier details', () => {
    it('should  change identfier details', () => {
      const registrationNo = 100011182;
      const updatedIdentifierDetails: PatchIdentifierDetails = patchIdentifierDetailsMockData;
      const url = `/api/v1/establishment/100011182/identifier`;

      changeEstablishmentService.changeIdentifierDetails(registrationNo, updatedIdentifierDetails).subscribe(res => {
        expect(res.transactionId).toBe(transactionFeedbackMockData.transactionId);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      req.flush(transactionFeedbackMockData);
    });
  });
  describe('change bank details', () => {
    it('should  change bank details', () => {
      const registrationNo = 100011182;
      const updatedBankDetails: PatchBankDetails = patchBankDetailsMockData;
      const url = `/api/v1/establishment/100011182/bank-account`;

      changeEstablishmentService.changeBankDetails(registrationNo, updatedBankDetails).subscribe(res => {
        expect(res.transactionId).toBe(transactionFeedbackMockData.transactionId);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush(transactionFeedbackMockData);
    });
  });

  describe('update Identifier Details', () => {
    it('should  update Identifier Details', () => {
      const registrationNo = 12345;
      const upadateIdentifierDetails: PatchIdentifierDetails = patchIdentifierDetailsMockData;
      const url = `/api/v1/establishment/12345/identifier`;

      changeEstablishmentService.changeIdentifierDetails(registrationNo, upadateIdentifierDetails).subscribe(res => {
        expect(res.transactionId).toBe(transactionFeedbackMockData.transactionId);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      req.flush(transactionFeedbackMockData);
    });
  });
  describe('get owners', () => {
    it('should get owners', () => {
      const registrationNo = 34564566;
      const referenceNo = 12345;
      const queryParams = [
        {
          queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
          queryValue: referenceNo
        }
      ];
      const url = `/api/v1/establishment/34564566/owner?referenceNo=12345`;
      changeEstablishmentService.getOwners(registrationNo, queryParams).subscribe(res => {
        expect(res).toEqual(establishmentOwnersWrapperTestData.owners);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(establishmentOwnersWrapperTestData);
    });
  });
  describe('search owners', () => {
    it('should search owners', () => {
      const registrationNo = 34564566;
      const referenceNo = 12345;
      const queryParams = [
        {
          queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
          queryValue: referenceNo
        }
      ];
      const url = `/api/v1/establishment/34564566/owner?referenceNo=12345`;
      changeEstablishmentService.searchOwner(registrationNo, queryParams).subscribe(res => {
        expect(res).toEqual(establishmentOwnersWrapperTestData);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(establishmentOwnersWrapperTestData);
    });
  });
  describe('search owners with query params', () => {
    it('should search owners with query params', () => {
      const registrationNo = 34564566;
      const referenceNo = 12345;
      const queryParams = [
        {
          queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
          queryValue: referenceNo
        }
      ];
      const url = `/api/v1/establishment/34564566/owner?referenceNo=12345`;
      changeEstablishmentService.searchOwnerWithQueryParams(registrationNo, queryParams).subscribe(res => {
        expect(res).toEqual(establishmentOwnersWrapperTestData.owners);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(establishmentOwnersWrapperTestData);
    });
  });
  describe('can add owner', () => {
    it('should check if owner can be added for legal entity government', () => {
      const estModelTestData: Establishment = bindToObject(new Establishment(), genericEstablishmentResponse);
      changeEstablishmentService.canAddOwner(estModelTestData).subscribe(() => {
        expect(estModelTestData.legalEntity.english).toBe('Government');
      });
    });
    it('should check if owner can be added ', () => {
      const estModelTestData: Establishment = bindToObject(new Establishment(), establishmentDetailsTestData);
      changeEstablishmentService.canAddOwner(estModelTestData).subscribe(() => {
        expect(estModelTestData.legalEntity.english).toBe('Individual');
      });
    });
  });
  describe('update Details', () => {
    it('should  update bank Details', () => {
      const registrationNo = 12345;
      const updatedBankDetails: PatchBankDetails = bindToObject(new PatchBankDetails(), patchBankDetailsMockData);
      const url = `/api/v1/establishment/12345/bank-account`;

      changeEstablishmentService.changeBankDetails(registrationNo, updatedBankDetails).subscribe(res => {
        expect(res.transactionId).toBe(transactionFeedbackMockData.transactionId);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush(transactionFeedbackMockData);
    });
  });
  describe('cancel transaction', () => {
    it('should  cancel transaction', () => {
      const registrationNo = 12345;
      const referenceNo = 123456;
      const url = `/api/v1/establishment/${registrationNo}/cancel?referenceNo=${referenceNo}`;
      changeEstablishmentService.cancelTransaction(registrationNo, referenceNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('DELETE');
    });
  });

  describe('get Establishment Status ErrorKey', () => {
    it('should get establishment status error key if status is opening in progress', () => {
      const statusErrorKey = new GenericValidationKey();
      statusErrorKey.key = 'ESTABLISHMENT.ERROR.OPENING-IN-PROGRESS';
      statusErrorKey.valid = false;
      const status = 'Under Inspection';
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });
    it('should get establishment status error key if status is closing in progress', () => {
      const statusErrorKey = new GenericValidationKey();
      statusErrorKey.key = EstablishmentStatusErrorEnum.CLOSING_IN_PROGRESS;
      statusErrorKey.valid = true;
      const status = EstablishmentStatusEnum.CLOSING_IN_PROGRESS;
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });
    it('should get establishment status error key if status is closed', () => {
      const statusErrorKey = new GenericValidationKey();
      statusErrorKey.key = EstablishmentStatusErrorEnum.CLOSED;
      statusErrorKey.valid = true;
      const status = EstablishmentStatusEnum.CLOSED;
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });
    it('should get establishment status error key if status is cancelled', () => {
      const statusErrorKey = new GenericValidationKey();
      statusErrorKey.key = EstablishmentStatusErrorEnum.CANCELLED;
      statusErrorKey.valid = true;
      const status = EstablishmentStatusEnum.CANCELLED;
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });
    it('should get establishment status error key if status is cancel under inspection', () => {
      const statusErrorKey = new GenericValidationKey();
      statusErrorKey.key = EstablishmentStatusErrorEnum.CANCEL_UNDER_INSPECTION;
      statusErrorKey.valid = true;
      const status = EstablishmentStatusEnum.CANCEL_UNDER_INSPECTION;
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });

    it('should get establishment status error key if status is reopenng in progress', () => {
      const statusErrorKey = new GenericValidationKey();
      statusErrorKey.key = 'ESTABLISHMENT.ERROR.REOPENING-IN-PROGRESS';
      statusErrorKey.valid = false;
      const status = 'Reopening in Progress';
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });
    it('should get establishment status error key if status is opening in progress', () => {
      const statusErrorKey = new GenericValidationKey();
      statusErrorKey.key = 'ESTABLISHMENT.ERROR.OPENING-IN-PROGRESS';
      statusErrorKey.valid = false;
      const status = 'Opening in progress';
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });
    it('should get establishment status error key if status is closure waiting ', () => {
      const statusErrorKey = new GenericValidationKey();
      statusErrorKey.key = EstablishmentStatusErrorEnum.UNDER_CLOSURE_WAITING_SETTLEMENT;
      statusErrorKey.valid = true;
      const status = EstablishmentStatusEnum.UNDER_CLOSURE_WAITING_SETTLEMENT;
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });
    it('should get establishment status error key opening in progress in internet', () => {
      const statusErrorKey = new GenericValidationKey();
      statusErrorKey.key = EstablishmentStatusErrorEnum.OPENING_IN_PROGRESS_INT;
      statusErrorKey.valid = false;
      const status = EstablishmentStatusEnum.OPENING_IN_PROGRESS_INT;
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });
    it('should get establishment status error key if status is pending', () => {
      const statusErrorKey = new GenericValidationKey();
      statusErrorKey.key = EstablishmentStatusErrorEnum.DRAFT;
      statusErrorKey.valid = false;
      const status = EstablishmentStatusEnum.DRAFT;
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });
    it('should get establishment status error key', () => {
      const statusErrorKey = new GenericValidationKey();
      statusErrorKey.key = 'ESTABLISHMENT.ERROR.OPENING-IN-PROGRESS-GOL-UPDATE';
      statusErrorKey.valid = false;
      const status = 'Opening in progress for GOL Update';
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });
    it('should get establishment status error key', () => {
      const statusErrorKey = undefined;
      const status = 'Openinginprogress';
      expect(getEstablishmentStatusErrorKey(status)).toEqual(statusErrorKey);
    });
  });
  describe('has Recruitment Change', () => {
    it('should check Recruitment number change', () => {
      const recruitmentNo = null;
      const changedRecruitmentNo = null;

      expect(hasNumberFieldChange(recruitmentNo, changedRecruitmentNo)).toBeFalsy();
    });
    it('should check Recruitment number change', () => {
      const recruitmentNo = null;
      const changedRecruitmentNo = 123456;
      expect(hasNumberFieldChange(recruitmentNo, changedRecruitmentNo)).toBeTruthy();
    });
    it('should check Recruitment number change', () => {
      const recruitmentNo = 23454;
      const changedRecruitmentNo = 123456;

      expect(hasNumberFieldChange(recruitmentNo, changedRecruitmentNo)).toBeTruthy();
    });
    it('should check Recruitment number change', () => {
      const recruitmentNo = 123456;
      const changedRecruitmentNo = 123456;
      expect(hasNumberFieldChange(recruitmentNo, changedRecruitmentNo)).toBeFalsy();
    });
  });
  describe('navigate to page', () => {
    it('should navigate to bank details validator', () => {
      changeEstablishmentService.navigateToBankDetailsValidator();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.VALIDATOR_BANK_DETAILS
      ]);
    });
  });
  describe('navigate to page', () => {
    it('should navigate to identifier details validator', () => {
      changeEstablishmentService.navigateToIdentifierValidator();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.VALIDATOR_IDENTIFIERS
      ]);
    });
  });
  describe('navigate to page', () => {
    it('should navigate to basic details validator', () => {
      changeEstablishmentService.navigateToBasicDetailsValidator();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.VALIDATOR_BASIC_DETAILS
      ]);
    });
  });
  describe('navigate to page', () => {
    it('should navigate to inbox', () => {
      changeEstablishmentService.navigateToInbox(ApplicationTypeEnum.PRIVATE);
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('navigate to page', () => {
    it('should navigate to login', () => {
      changeEstablishmentService.navigateToLogin();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.LOGIN]);
    });
  });
  describe('navigate to page', () => {
    it('should navigate to search', () => {
      changeEstablishmentService.navigateToSearch();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.CHANGE_SEARCH_ESTABLISHMENT
      ]);
    });
  });
  describe('navigate to page', () => {
    it('should navigate to edit identifier details', () => {
      changeEstablishmentService.navigateToEditIdentifierDetails();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.EDIT_CHANGE_IDENTIFIER_DETAILS
      ]);
    });
  });
  describe('navigate to page', () => {
    it('should navigate to edit bank details', () => {
      changeEstablishmentService.navigateToEditBankDetails();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.EDIT_CHANGE_BANK_DETAILS
      ]);
    });
  });
  describe('navigate to page', () => {
    it('should navigate to edit contact details', () => {
      changeEstablishmentService.navigateToEditContactDetails();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.EDIT_CHANGE_CONTACT_DETAILS
      ]);
    });
  });
  describe('navigate to page', () => {
    it('should navigate to edit address details', () => {
      changeEstablishmentService.navigateToEditAddressDetails();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.EDIT_CHANGE_ADDRESS_DETAILS
      ]);
    });
  });
  describe('navigate to page', () => {
    it('should navigate to profile', () => {
      changeEstablishmentService.navigateToProfile(genericEstablishmentResponse.registrationNo);
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.EST_PROFILE_ROUTE(genericEstablishmentResponse.registrationNo)
      ]);
    });
  });
  describe('navigate to page', () => {
    it('should navigate to edit basic details', () => {
      changeEstablishmentService.navigateToEditBasicDetails();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.EDIT_CHANGE_BASIC_DETAILS
      ]);
    });
  });
  describe('navigate to contact details validator', () => {
    it('should navigate to contact details validator', () => {
      changeEstablishmentService.navigateToContactDetailsValidator();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.VALIDATOR_CONTACT_DETAILS
      ]);
    });
  });
  describe('navigate to address details validator', () => {
    it('should navigate to address details validator', () => {
      changeEstablishmentService.navigateToAddressDetailsValidator();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.VALIDATOR_ADDRESS_DETAILS
      ]);
    });
  });
  describe('navigate to validator owner', () => {
    it('should navigate to validator owner', () => {
      changeEstablishmentService.navigateToValidateOwner();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.VALIDATOR_CHANGE_OWNER
      ]);
    });
  });
  describe('navigate to validate legal entity ', () => {
    it('should navigate to validate legal entity', () => {
      changeEstablishmentService.navigateToValidateLegalEntity();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.VALIDATOR_LEGAL_ENTITY
      ]);
    });
  });
  describe('navigate to owners screen ', () => {
    it('should navigate to owners screen', () => {
      changeEstablishmentService.navigateToOwnersScreen();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.EST_OWNERS]);
    });
  });
  describe('navigate to edit legal entity ', () => {
    it('should navigate to edit legal entity ', () => {
      changeEstablishmentService.navigateToEditLegalEntity();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.EDIT_CHANGE_LEGAL_ENTITY
      ]);
    });
  });
  describe('navigate to edit owner entity ', () => {
    it('should navigate to edit owner entity ', () => {
      changeEstablishmentService.navigateToEditOwnerDetails();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.EDIT_CHANGE_OWNER
      ]);
    });
  });
  describe('navigate to change mof payment validator ', () => {
    it('should navigate to change mof payment validator ', () => {
      changeEstablishmentService.navigateToChangeMofPaymentValidator();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.VALIDATOR_CHANGE_MOF_PAYMENT
      ]);
    });
  });
  describe('navigate to change mof payment ', () => {
    it('should navigate to change mof payment ', () => {
      changeEstablishmentService.navigateToChangeMofPaymentDetails();
      expect(changeEstablishmentService.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.MODIFY_MOF_PAYMENT
      ]);
    });
  });
  describe('has license changed', () => {
    it('should check if license changed', () => {
      const establishment = new Establishment();
      const changeEst = new Establishment();
      establishment.license = null;
      changeEst.license = null;

      expect(hasLicenseChanged(establishment, changeEst)).toBeFalsy();
    });
    it('should check if license changed with license changed', () => {
      const establishment = new Establishment();
      const changeEst = new Establishment();
      establishment.license.number = 34567;
      changeEst.license.number = 123456;

      expect(hasLicenseChanged(establishment, changeEst)).toBeTruthy();
    });
    it('should check if license changed with license changed', () => {
      const establishment = new Establishment();
      const changeEst = new Establishment();
      establishment.license.issuingAuthorityCode = null;
      changeEst.license.issuingAuthorityCode.english = 'abcd';
      expect(hasLicenseChanged(establishment, changeEst)).toBeTruthy();
    });
  });
  describe('update contact Details', () => {
    it('should  update contactDetails', () => {
      const registrationNo = 12345;
      const upadateContactDetails: PatchContactDetails = patchContactDetailsMockData;
      const url = `/api/v1/establishment/12345/contact-details`;

      changeEstablishmentService.changeContactDetails(registrationNo, upadateContactDetails).subscribe(res => {
        expect(res.transactionId).toBe(transactionFeedbackMockData.transactionId);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      req.flush(transactionFeedbackMockData);
    });
  });
  describe('update Address Details', () => {
    it('should  update Address Details', () => {
      const registrationNo = 12345;
      const upadateAddressDetails: PatchAddressDetails = patchAddressDetailsMockData;
      const url = `/api/v1/establishment/12345/address-details`;

      changeEstablishmentService.changeAddressDetails(registrationNo, upadateAddressDetails).subscribe(res => {
        expect(res.transactionId).toBe(transactionFeedbackMockData.transactionId);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      req.flush(transactionFeedbackMockData);
    });
  });

  describe(' get Establishment Workflow Status', () => [
    it('should sget Establishment Workflow Status', () => {
      const registrationNo = 12345;
      const url = `/api/v1/establishment/${registrationNo}/workflow-status`;
      changeEstablishmentService.getEstablishmentWorkflowStatus(registrationNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    })
  ]);

  describe('search establishment', () => {
    it('should  search establishment', () => {
      const referenceNo = 12345;
      const registrationNo = 12345;
      const isTerminate = true;
      const url = `/api/v1/establishment/${registrationNo}/transient-details?referenceNo=${referenceNo}&isTerminate=${isTerminate}`;
      changeEstablishmentService
        .getEstablishmentFromTransient(registrationNo, referenceNo, isTerminate)
        .subscribe(res => {
          expect(res).toEqual(genericEstablishmentResponse);
        });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush({ ...genericEstablishmentResponse });
    });
  });

  describe('change late fee indicator', () => {
    it('should change late fee', () => {
      const regNo = 112233;
      const url = `/api/v1/establishment/${regNo}/latefee-indicator`;
      changeEstablishmentService.changeLateFeeIndicator(new LateFeeRequest(), regNo).subscribe(res => {
        expect(res).toBeInstanceOf(TransactionFeedback);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      req.flush(new TransactionFeedback());
    });
  });
  describe('change mof payment type', () => {
    it('should change mof payment type', () => {
      const registrationNo = 123123;
      const updadedBankDetails: PatchMofPaymentDetails = patchMofDetailsMockData;
      const patchBankDetailsUrl = `/api/v1/establishment/${registrationNo}/payment-details`;
      changeEstablishmentService.changeMofPaymnetDetails(registrationNo, updadedBankDetails).subscribe(res => {
        expect(res).toBeInstanceOf(TransactionFeedback);
      });
      const req = httpMock.expectOne(patchBankDetailsUrl);
      expect(req.request.method).toBe('PATCH');
      req.flush(new TransactionFeedback());
    });
  });
  describe('revert transaction', () => {
    it('should revert the transaction', () => {
      const registrationNo = 200085744;
      const referenceNo = 485;
      const url = `/api/v1/establishment/${registrationNo}/revert?referenceNo=${referenceNo}`;
      changeEstablishmentService.revertTransaction(registrationNo, referenceNo).subscribe(res => {
        expect(res).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
    });
  });
});
