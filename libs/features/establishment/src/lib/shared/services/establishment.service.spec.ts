/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  Establishment,
  EstablishmentProfile,
  GccCountryEnum,
  IdentityTypeEnum,
  Iqama,
  NationalId,
  Passport,
  Person,
  bindToObject
} from '@gosi-ui/core';
import * as moment from 'moment';
import { noop } from 'rxjs';
import {
  establishmentDetailsTestData,
  genericAdminResponse,
  genericEstablishmentGroups,
  genericEstablishmentResponse,
  genericOwnerReponse,
  genericPersonResponse,
  genericViolationCountTestData,
  transactionFeedbackMockData
} from 'testing';
import { menuStub } from '../common-stub.spec';
import { EstablishmentQueryKeysEnum, NationalityCategoryEnum } from '../enums';
import { AdminBranchQueryParam, AdminDto, EstablishmentOwnersWrapper, Owner } from '../models';
import { AdminQueryParam } from '../models/admin-query-param';
import { getNationalityCategoryType } from '../utils';
import { EstablishmentService } from './establishment.service';

describe('EstablishmentService', () => {
  let service: EstablishmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [menuStub]
    });
    service = TestBed.inject(EstablishmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const url = `/api/v1/lov/system-parameters`;
    expect(service).toBeTruthy();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });

  describe('establishment services', () => {
    it('should get establishment', () => {
      const registrationNo = 34564566;
      const estModelTestData: Establishment = bindToObject(new Establishment(), establishmentDetailsTestData);
      const url = `/api/v1/establishment/34564566`;
      service.getEstablishment(registrationNo).subscribe(res => {
        expect(registrationNo).toBe(estModelTestData.registrationNo);
        expect(res.mainEstablishmentRegNo).toBe(estModelTestData.mainEstablishmentRegNo);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(establishmentDetailsTestData);
    });
    it('should get establishment with main info', () => {
      const registrationNo = 34564566;
      const estModelTestData: Establishment = bindToObject(new Establishment(), establishmentDetailsTestData);
      const url = `/api/v1/establishment/34564566?includeMainInfo=true`;
      service.getEstablishment(registrationNo, { includeMainInfo: true }).subscribe(res => {
        expect(registrationNo).toBe(estModelTestData.registrationNo);
        expect(res.mainEstablishmentRegNo).toBe(estModelTestData.mainEstablishmentRegNo);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(establishmentDetailsTestData);
    });
  });
  describe('get AdminDetails', () => {
    it('should get AdminDetails', () => {
      const registrationNo = 34564566;
      const getAdminUrl = `/api/v1/establishment/34564566/admin`;
      service.getAdminsOfEstablishment(registrationNo).subscribe();
      const req = httpMock.expectOne(getAdminUrl);
      expect(req.request.method).toBe('GET');
      req.flush({ admins: [new AdminDto()] });
    });
  });
  describe('get Admins Under Group', () => {
    it('should get Admins Under Group', () => {
      const mainEstablishmentRegNo = 34564566;
      const getAdminUrl = `/api/v1/admin?registrationNo=${mainEstablishmentRegNo}`;
      service.getAdminsUnderGroup(mainEstablishmentRegNo).subscribe();
      const req = httpMock.expectOne(getAdminUrl);
      expect(req.request.method).toBe('GET');
      req.flush({ admins: [new AdminDto()] });
    });
  });
  describe('get AdminDetails of est group', () => {
    it('should get AdminDetails', () => {
      const registrationNo = genericEstablishmentResponse.registrationNo;
      const adminId = genericPersonResponse.identity[1].iqamaNo;
      const params = new AdminQueryParam();
      params.registrationNo = registrationNo;
      const getAdminUrl = `/api/v1/admin/${genericPersonResponse.identity[1].iqamaNo}/admin?registrationNo=${registrationNo}`;
      service.getAdminsUnderSupervisor(adminId, params).subscribe();
      const req = httpMock.expectOne(getAdminUrl);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('search owner with query params', () => {
    it('should search owner with query params', () => {
      const registrationNo = 123456;
      const params = new HttpParams();
      const genericOwnerWrapper: EstablishmentOwnersWrapper = new EstablishmentOwnersWrapper();
      genericOwnerWrapper.owners = [genericOwnerReponse];
      const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/owner`;
      service.searchOwnerWithQueryParams(registrationNo, params).subscribe();
      const req = httpMock.expectOne(getEstablishmentUrl);
      expect(req.request.method).toBe('GET');
      req.flush(genericOwnerWrapper);
    });
  });
  describe('revert transaction', () => {
    it('should  revert transaction', () => {
      const registrationNo = 12345;
      const referenceNo = 123456;
      const url = `/api/v1/establishment/${registrationNo}/revert?referenceNo=${referenceNo}`;
      service.revertTransaction(registrationNo, referenceNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
    });
  });
  xdescribe('get Owner Details', () => {
    xit('should get OwnerDetails', () => {
      const registrationNo = 34564566;
      const getOwnerUrl = `/api/v1/establishment/34564566/owner`;
      const genericOwnerWrapper: EstablishmentOwnersWrapper = new EstablishmentOwnersWrapper();
      genericOwnerWrapper.owners = [genericOwnerReponse];
      const req = httpMock.expectOne(getOwnerUrl);
      expect(req.request.method).toBe('GET');
      req.flush(genericOwnerWrapper);
    });
  });
  describe('get Owner Details', () => {
    it('should get OwnerDetails', () => {
      const registrationNo = 34564566;
      const personId = 1234;
      const getOwnerUrl = `/api/v1/establishment/34564566/owner/1234`;
      service.deleteOwner(registrationNo, personId).subscribe();
      const req = httpMock.expectOne(getOwnerUrl);
      expect(req.request.method).toBe('DELETE');
    });
  });
  describe('get Nationality Category Type', () => {
    it('should get Nationality Category Type of saudi person', () => {
      const nationality = 'Saudi Arabia';
      getNationalityCategoryType(nationality);
      expect(getNationalityCategoryType(nationality)).toEqual(NationalityCategoryEnum.SAUDI_PERSON);
    });
    it('should get Nationality Category Type of saudi person', () => {
      const nationality = 'Kuwait';
      getNationalityCategoryType(nationality);
      expect(getNationalityCategoryType(nationality)).toEqual(NationalityCategoryEnum.GCC_PERSON);
    });
    it('should get Nationality Category Type of saudi person', () => {
      const nationality = 'Arabia';
      getNationalityCategoryType(nationality);
      expect(getNationalityCategoryType(nationality)).toEqual(NationalityCategoryEnum.NON_SAUDI);
    });
  });
  describe('verify person Details', () => {
    it('should verify person Details with iqamaNo', () => {
      const birthDate = moment(genericPersonResponse.birthDate.gregorian).format('YYYY-MM-DD');
      const personTestData: Person = { ...genericPersonResponse };
      personTestData.identity = personTestData.identity.filter(id => id.idType === IdentityTypeEnum.IQAMA);
      const url = `/api/v1/person?role=${
        genericPersonResponse.role
      }&birthDate=${birthDate}&personType=${getNationalityCategoryType(
        genericPersonResponse.nationality.english
      )}&iqamaNo=2475362386`;
      service.verifyPersonDetails(personTestData).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
    it('should verify gcc person details with gccid iqama and passport', () => {
      const gccId = 1234;
      const iqamaNo = 567;
      const passport = '8test';
      const birthDate = moment(genericPersonResponse.birthDate.gregorian).format('YYYY-MM-DD');
      const gccIdentity: Array<Iqama | NationalId | Passport> = [];
      gccIdentity.push({ ...new NationalId(), ...{ id: gccId } });
      gccIdentity.push({ ...new Iqama(), ...{ iqamaNo: iqamaNo } });
      gccIdentity.push({ ...new Passport(), ...{ passportNo: passport } });
      const personTestData: Person = { ...genericPersonResponse, ...{ identity: gccIdentity } };
      personTestData.nationality.english = GccCountryEnum.KUWAIT;
      const url = `/api/v1/person?role=${
        genericPersonResponse.role
      }&birthDate=${birthDate}&personType=${getNationalityCategoryType(GccCountryEnum.KUWAIT)}&nationality=${
        GccCountryEnum.KUWAIT
      }&gccId=${gccId}&iqamaNo=${iqamaNo}&passportNo=${passport}`;
      service.verifyPersonDetails(personTestData).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('Get branches', () => {
    it('should  fetch the branches of the group', () => {
      const registrationNo = 12345;
      const size = null;
      const url = `/api/v1/establishment/12345/branches`;
      service.getBranchEstablishments(registrationNo, size).subscribe(res => {
        expect(res).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
    });
  });
  describe('get Branch Establishments', () => {
    it('should get Branch Establishments', () => {
      const registrationNo = 12345;
      const size = 1;
      //  const upadateAddressDetails: PatchAddressDetails = patchAddressDetailsMockData;
      const url = `/api/v1/establishment/12345/branches`;
      service.getBranchEstablishments(registrationNo, size).subscribe(res => {
        expect(res).toBeDefined();
      });
      const req = httpMock.expectOne(url);

      expect(req.request.method).toBe('POST');
    });
  });
  describe('get Establishment Profile', () => {
    it('should get establishment profile', () => {
      const registrationNo = 34564566;
      const estModelTestData: EstablishmentProfile = bindToObject(
        new EstablishmentProfile(),
        establishmentDetailsTestData
      );
      const url = `/api/v1/establishment/34564566/profile`;
      service.getEstablishmentProfileDetails(registrationNo).subscribe(res => {
        expect(registrationNo).toBe(estModelTestData.registrationNo);
        expect(res.mainEstablishmentRegNo).toBe(estModelTestData.mainEstablishmentRegNo);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(estModelTestData);
    });
  });

  describe('Establishment Groups supervised by admin', () => {
    it('should get establishment groups under the admin', () => {
      const adminId = 11111111;
      const url = `/api/v1/admin/${adminId}/establishment?branchFilter.includeBranches=false&branchFilter.excludeBranches=false&branchFilter.eligibleToUpdate=true`;
      service.getEstablishmentGroupsUnderAdmin(adminId).subscribe(res => {
        expect(res).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(genericEstablishmentGroups);
    });
  });
  describe('Estabishment branches under admin', () => {
    it('should get establishment branches under the admin', () => {
      const adminId = 11111111;
      const mainRegNo = genericEstablishmentResponse.mainEstablishmentRegNo;
      const params = new AdminBranchQueryParam();
      params.branchFilter.registrationNo = mainRegNo;
      params.branchFilter.includeBranches = true;
      params.page.pageNo = 0;
      params.page.size = 10;
      const url = `/api/v1/admin/${adminId}/establishment?branchFilter.includeBranches=true&branchFilter.excludeBranches=false&branchFilter.eligibleToUpdate=true&branchFilter.registrationNo=${mainRegNo}&page.pageNo=0&page.size=10`;

      service.getBranchesUnderAdmin(adminId, params).subscribe(res => {
        expect(res).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(genericEstablishmentGroups);
    });
  });
  describe('get establishment work flow status', () => {
    it('should get establishment work flow status', () => {
      const registrationNo = 34564566;
      const url = `/api/v1/establishment/${registrationNo}/workflow-status?getInterEpicDependency=false`;
      service.getWorkflowsInProgress(registrationNo).subscribe(res => {
        expect(res).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('get crn from mci', () => {
    it('should get the crn details of the establishment', () => {
      const registrationNo = 34564566;
      const crn = '21351321';
      const url = `/api/v1/establishment/${registrationNo}/crn-details?crNumber=${crn}`;
      service.getCrnDetailsFromMci(crn, registrationNo).subscribe(res => {
        expect(res).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('get super admin details', () => {
    it('should get super admin details', () => {
      const registrationNo = 34564566;
      spyOn(service, 'getAdminsOfEstablishment').and.callThrough();
      service.getSuperAdminDetails(registrationNo);
      expect(service.getAdminsOfEstablishment).toHaveBeenCalled();
    });
  });
  describe('get admin roles', () => {
    it('should get admin roles', () => {
      const admin = genericAdminResponse;
      const registrationNo = 1234556;
      const identity = genericPersonResponse.identity[1].iqamaNo;
      const getAdminRolesUrl = `/api/v1/person/${identity}/role?registrationNo=${registrationNo}`;
      service.getAdminRoles(admin, registrationNo).subscribe(res => {
        expect(res).toBeDefined();
      });
      const req = httpMock.expectOne(getAdminRolesUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('save Owner', () => {
    it('should save owner details', () => {
      const registrationNo = 12345;
      const owner = new Owner();
      const navInd = 12345;
      const comments = '12345';
      const url = `/api/v1/establishment/12345/owner`;
      const referenceNo = 21344;
      service.saveAllOwners([owner], registrationNo, navInd, comments, referenceNo).subscribe(res => {
        expect(res.transactionId).toBe(transactionFeedbackMockData.transactionId);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('new apis', () => {
    it('should get establishment with parameter', () => {
      const registrationNo = 34564566;
      const estModelTestData: Establishment = bindToObject(new Establishment(), establishmentDetailsTestData);
      const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/transient-details`;
      service.getEstablishmentFromTransient(registrationNo, undefined).subscribe(() => {
        expect(registrationNo).toBe(estModelTestData.registrationNo);
      }, noop);
      const req = httpMock.expectOne(getEstablishmentUrl);
      expect(req.request.method).toBe('GET');
      req.flush(establishmentDetailsTestData);
    });
    describe('Check Eligibilty', () => {
      it('should check if there is already an est with same license no and issuing authority', () => {
        const registrationNo = 12345;
        const licenseNo = 12345;
        const issungAuth = 'test';
        const url = `/api/v1/establishment/12345/eligibility?licenseIssuingAuthority=${issungAuth}&licenseNumber=${licenseNo}`;
        service.isLicensePresent(registrationNo, licenseNo, issungAuth).subscribe(res => {
          expect(res).toBeFalse();
        });
        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('GET');
      });
    });
  });

  describe('Get Vioaltions', () => {
    it('should get no violations under the establishment', () => {
      const registrationNo = 1234556;
      const getAdminRolesUrl = `/api/v1/establishment/1234556/violation-count`;
      service.getViolationsCount(registrationNo).subscribe(res => {
        expect(res).toBeDefined();
      });
      const req = httpMock.expectOne(getAdminRolesUrl);
      expect(req.request.method).toBe('GET');
      req.flush(genericViolationCountTestData);
    });
  });
  describe('get comments', () => {
    it('should get comments', () => {
      const referenceNo = 12345;
      const queryParams = [
        {
          queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
          queryValue: referenceNo
        }
      ];
      const url = `/api/v1/transaction/trace?referenceNo=${referenceNo}`;
      service.getComments(queryParams).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });
});
