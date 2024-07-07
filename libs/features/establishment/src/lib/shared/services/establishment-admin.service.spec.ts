/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { bindToObject, EnvironmentToken, IdentityTypeEnum, Iqama, NIN, Person } from '@gosi-ui/core';
import {
  adminRequestData,
  adminWithGccId,
  adminWithIqama,
  adminWithNin,
  establishmentAdminContactDetailsTestData,
  establishmentAdminDetailsTestData,
  establishmentDetailsTestData,
  genericPersonResponse
} from '../../../../../../../testing';
import { Admin } from '../models';
import { EstablishmentAdminService, PERSON_TYPE } from '../services';
/* import { establishmentAdminDetailsTestData, establishmentAdminContactDetailsTestData, AdminData } from '@gosi-ui/features/add-establishment/src/lib/services/test-data'; */

describe('EstablishmentAdminService', () => {
  /* let httpMock: HttpTestingController; */
  let service: EstablishmentAdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EstablishmentAdminService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(EstablishmentAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('Should create AddEstablishmentService', () => {
    expect(service).toBeTruthy();
  });

  describe('verifyPersonDetails with nin', () => {
    it('Should  verifyPersonDetails', () => {
      const verifyPersonUrl = `/api/v1/person?role=${adminWithNin.role}&birthDate=${adminWithNin.birthDate.gregorian}&personType=${PERSON_TYPE.SAUDI_PERSON}&NIN=${adminWithNin.newNin}`;
      service.verifyPersonDetails(bindToObject(new Person(), adminWithNin), adminWithNin).subscribe();
      const req = httpMock.expectOne(verifyPersonUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('verifyPersonDetails with iqamano', () => {
    it('Should  verifyPersonDetails', () => {
      const verifyPersonUrl = `/api/v1/person?role=Owner&birthDate=2002-09-08&personType=Non_Saudi_Person&iqamaNo=2000000006`;
      service.verifyPersonDetails(bindToObject(new Person(), adminWithIqama), adminWithIqama).subscribe();
      const req = httpMock.expectOne(verifyPersonUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('verify  GCC details', () => {
    it('should verify with gcc identity details', () => {
      const verifyPersonUrl = `/api/v1/person?role=Owner&birthDate=2002-09-08&personType=GCC_Person&nationality=Kuwait&gccId=254654362136&passportNo=46854321ad&iqamaNo=2000000006`;
      service.verifyPersonDetails(bindToObject(new Person(), adminWithGccId), adminWithGccId).subscribe();
      const req = httpMock.expectOne(verifyPersonUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('Set nin details', () => {
    it('should set the identity details', () => {
      const nin: NIN = <NIN>service.setIdentityDetails(adminWithNin);
      expect(Number(nin.newNin)).toBe(Number(adminWithNin.newNin));
    });
  });
  describe('Set iqama details', () => {
    it('should set the identity details', () => {
      const iqama: Iqama = <Iqama>service.setIdentityDetails(adminWithIqama);
      expect(Number(iqama.iqamaNo)).toBe(Number(adminWithIqama.iqamaNo));
    });
  });

  describe('Update owner details', () => {
    it('should update the owner details', () => {
      expect(service.updateOwnerDetails(new Person(), establishmentAdminDetailsTestData).name.english).toBe(
        establishmentAdminDetailsTestData.name.english
      );
    });
  });

  describe('Save admin details', () => {
    it('should save admin details', () => {
      const admin = new Admin();
      const saveAdminUrl = `/api/v1/establishment/${establishmentDetailsTestData.registrationNo}/admin`;
      service.saveAdminDetails(admin, establishmentDetailsTestData.registrationNo).subscribe();
      const req = httpMock.expectOne(saveAdminUrl);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('Set Establishment Admin Details', () => {
    it('Should set establishment admin details', () => {
      const establishmentAdmin: Admin = new Admin();
      expect(
        service.updateAdminDetails(establishmentAdmin.person, establishmentAdminDetailsTestData).name.english
      ).toBe(establishmentAdminDetailsTestData.name.english);
    });
  });

  describe('Set Establishment Admin Contact Details', () => {
    it('Should set establishment admin contact details', () => {
      const establishmentAdmin: Admin = new Admin();
      expect(
        service.updateAdminContactDetails(establishmentAdmin, establishmentAdminContactDetailsTestData).person
          .contactDetail.mobileNo.primary
      ).toBe(establishmentAdminContactDetailsTestData.mobileNo.primary);
    });
  });

  describe('Save new person as admin', () => {
    it('should save the person as admin', () => {
      const admin = new Admin();
      admin.person = genericPersonResponse;
      const adminId = genericPersonResponse.identity.find(id => id.idType === IdentityTypeEnum.IQAMA)?.iqamaNo;
      const saveAdminUrl = `/api/v1/admin/${adminId}`;
      service.saveAsNewAdmin(admin).subscribe();
      const req = httpMock.expectOne(saveAdminUrl);
      expect(req.request.method).toBe('POST');
    });
  });
  describe('replace admin details', () => {
    it('should replace admin details', () => {
      const adminId = 12345;
      const replaceAdminUrl = `/api/v1/admin/${adminId}/replace?registrationNo=${establishmentDetailsTestData.registrationNo}`;
      service.replaceAdminDetails(adminId, establishmentDetailsTestData.registrationNo, adminRequestData).subscribe();
      const req = httpMock.expectOne(replaceAdminUrl);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('Delete Admin', () => {
    it('should delete the admin', () => {
      const adminId = 123;
      const mainRegNo = 21354321;
      const roleId = 3;
      const adminPersonId = 1235413;
      const url = `/api/v1/admin/${adminId}/terminate?registrationNo=${mainRegNo}&personId=${adminPersonId}`;
      service.deleteAdmin(adminId, mainRegNo, adminPersonId).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
    });
  });
});
