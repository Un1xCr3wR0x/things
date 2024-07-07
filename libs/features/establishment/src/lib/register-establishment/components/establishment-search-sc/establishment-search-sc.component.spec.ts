/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  bindToObject,
  Establishment,
  EstablishmentRouterData,
  EstablishmentStatusEnum,
  EstablishmentToken,
  LookupService,
  Lov,
  Person
} from '@gosi-ui/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  AlertServiceStub,
  establishmentDetailsTestData,
  EstablishmentServiceStub,
  EstablishmentStubService,
  establishmentTestData,
  estNotFoundError,
  genericError,
  genericEstablishmentResponse,
  genericLicense,
  LookupServiceStub,
  mockError,
  organsationTypes,
  TranslateLoaderStub
} from 'testing';
import {
  AddEstablishmentService,
  EstablishmentErrorKeyEnum,
  EstablishmentService,
  EstablishmentTypeEnum,
  OrganisationTypeEnum
} from '../../../shared';
import { menuStub } from '../../../shared/common-stub.spec';
import { EstablishmentSearchScComponent } from './establishment-search-sc.component';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('EstablishmentSearchScComponent', () => {
  let component: EstablishmentSearchScComponent;
  let fixture: ComponentFixture<EstablishmentSearchScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        })
      ],
      declarations: [EstablishmentSearchScComponent],
      providers: [
        menuStub,
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: AddEstablishmentService,
          useClass: EstablishmentServiceStub
        },
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        {
          provide: Router,
          useValue: routerSpy
        },
        { provide: EstablishmentToken, useValue: new EstablishmentRouterData() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentSearchScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Verify Branch Establishment Details', () => {
    it('should throw main establishment not found', () => {
      component.establishment = new Establishment();

      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showErrorByKey');
      component.verifyBranchEstablishment(bindToObject(new Establishment(), establishmentTestData[4]));
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
    it('should throw some error for main establishment verify', () => {
      component.establishment = new Establishment();
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(mockError));
      spyOn(component.alertService, 'showErrorByKey');
      component.verifyBranchEstablishment(bindToObject(new Establishment(), establishmentTestData[4]));
      expect(component.alertService.showErrorByKey).toHaveBeenCalledWith(EstablishmentErrorKeyEnum.NO_SUCH_MAIN);
    });
    it('should throw error if main is gcc', () => {
      spyOn(component.alertService, 'showErrorByKey');
      const mainEst: Establishment = {
        ...establishmentTestData[3],
        ...{ establishmentType: { english: EstablishmentTypeEnum.MAIN, arabic: 'test' } },
        ...{ status: { english: EstablishmentStatusEnum.REGISTERED, arabic: 'test' } },
        gccCountry: true
      };
      expect(
        component.addEstablishmentService.isMainEstablishmentEligible(mainEst, component.alertService)
      ).toBeFalse();
      expect(component.alertService.showErrorByKey).toHaveBeenCalledWith(EstablishmentErrorKeyEnum.MAIN_IS_GCC);
    });
    xit('should throw some error for main establishment admin fetch', () => {
      component.establishment = new Establishment();
      component.establishment.mainEstablishmentRegNo = genericEstablishmentResponse.registrationNo;
      const est: Establishment = bindToObject(new Establishment(), establishmentTestData[3]);
      const mainEst: Establishment = {
        ...est,
        ...{ establishmentType: { english: EstablishmentTypeEnum.MAIN, arabic: 'test' } },
        ...{ status: { english: EstablishmentStatusEnum.REGISTERED, arabic: 'test' } },
        gccEstablishment: { gccCountry: false, registrationNo: undefined, country: undefined },
        license: genericLicense
      };
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(mainEst));
      spyOn(component, 'setVerifiedEstablishmentAndNavigate');
      spyOn(component.establishmentService, 'getSuperAdminDetails').and.returnValue(of({ person: new Person() }));
      component.verifyBranchEstablishment(est);
      expect(component.establishmentService.getSuperAdminDetails).toHaveBeenCalled();
      expect(component.setVerifiedEstablishmentAndNavigate).toHaveBeenCalled();
    });
  });

  describe('Verify establishment details', () => {
    it('Should throw establishment not found', () => {
      component.establishment = new Establishment();
      spyOn(component.addEstablishmentService, 'verifyEstablishment').and.returnValue(throwError(estNotFoundError));
      component.verifyEstablishmentDetails(establishmentDetailsTestData);
      expect(component.router.navigate).toHaveBeenCalled();
    });
    it('if establishment no exists and if establishment is branch then validate the branch establishment', () => {
      const estInDb: Establishment = {
        ...genericEstablishmentResponse,
        establishmentType: { english: EstablishmentTypeEnum.BRANCH, arabic: '' },
        license: {
          issueDate: { gregorian: new Date('12-12-2020'), hijiri: '' },
          number: 123,
          issuingAuthorityCode: { english: 'nochange', arabic: '' },
          expiryDate: null
        }
      };
      spyOn(component.addEstablishmentService, 'verifyEstablishment').and.returnValue(throwError(estNotFoundError));
      spyOn(component, 'verifyBranchEstablishment');
      component.verifyEstablishment(estInDb);
      expect(component.verifyBranchEstablishment).toHaveBeenCalled();
    });
    it('handle errors other than establishment not found', () => {
      const estInDb: Establishment = {
        ...genericEstablishmentResponse,
        license: {
          issueDate: { gregorian: new Date('12-12-2020'), hijiri: '' },
          number: 123,
          issuingAuthorityCode: { english: 'nochange', arabic: '' },
          expiryDate: null
        }
      };
      spyOn(component.addEstablishmentService, 'verifyEstablishment').and.returnValue(throwError(genericError));
      spyOn(component, 'showErrorMessage');
      component.verifyEstablishment(estInDb);
      expect(component.showErrorMessage).toHaveBeenCalled();
    });
    it('Should validate the establishment', () => {
      component.establishment = new Establishment();
      spyOn(component.addEstablishmentService, 'verifyEstablishment').and.returnValue(of([]));
      component.verifyEstablishmentDetails(establishmentDetailsTestData);
      expect(component.router.navigate).toHaveBeenCalled();
    });
    it('should throw error if establishment already present', () => {
      const estInDb = {
        ...genericEstablishmentResponse,
        license: {
          issueDate: { gregorian: new Date('12-12-2020'), hijiri: '' },
          number: 123,
          issuingAuthorityCode: { english: 'nochange', arabic: '' },
          expiryDate: null
        }
      };
      spyOn(component.addEstablishmentService, 'verifyEstablishment').and.returnValue(of([estInDb]));
      spyOn(component.alertService, 'showErrorByKey');
      component.verifyEstablishment(estInDb);
      expect(component.alertService.showErrorByKey).toHaveBeenCalledWith(
        'ESTABLISHMENT.ERROR.ERR_LICENSE_NUMBER_EXIST'
      );
    });
    it('should validate the branch establishment', () => {
      const estInDb: Establishment = {
        ...genericEstablishmentResponse,
        establishmentType: { english: EstablishmentTypeEnum.BRANCH, arabic: '' },
        license: {
          issueDate: { gregorian: new Date('12-12-2020'), hijiri: '' },
          number: 123,
          issuingAuthorityCode: { english: 'nochange', arabic: '' },
          expiryDate: null
        }
      };
      spyOn(component.addEstablishmentService, 'verifyEstablishment').and.returnValue(of([]));
      spyOn(component, 'verifyBranchEstablishment');
      component.verifyEstablishment(estInDb);
      expect(component.verifyBranchEstablishment).toHaveBeenCalled();
    });
  });

  describe('Filter Legal Entity', () => {
    it('Should filter legalentity and the no of total screen to be displayed', () => {
      component.organistaionTypeList$ = of(organistaionList);
      component.selectOrganizationType(organsationTypes[0]);

      component.legalEntityList$.pipe(delay(100)).subscribe(res => {
        expect(res.length).toBeGreaterThan(0);
      });
      expect(component.establishment.organizationCategory.english).toEqual(OrganisationTypeEnum.GOVERNMENT);
    });
    it('Should make the establishment as Non Gov', () => {
      organistaionList[0].value.english = organsationTypes[1];
      component.organistaionTypeList$ = of(organistaionList);
      component.selectOrganizationType(organsationTypes[1]);
      component.licenseIssuingAuthorityList$.pipe(delay(100)).subscribe(res => {
        expect(res.length).toBeGreaterThan(0);
      });
      expect(component.establishment.organizationCategory.english).toEqual(OrganisationTypeEnum.NON_GOVERNMENT);
    });
  });

  describe('verify GCC Establishment Details', () => {
    it('if legal entity is  individual is Individual should be true', () => {
      const gccEstablishment = { ...establishmentTestData[3] };
      gccEstablishment.status.english = EstablishmentStatusEnum.CANCELLED;
      component.establishment = new Establishment();
      spyOn(component, 'setVerifiedEstablishmentAndNavigate').and.callThrough();
      spyOn(component.addEstablishmentService, 'verifyGCCEstablishmentDetails').and.returnValue(of([gccEstablishment]));
      component.verifyGCCEstablishmentDetails(gccEstablishment);
      expect(component.setVerifiedEstablishmentAndNavigate).toHaveBeenCalled();
    });
    it('Should throw some error', () => {
      const gccEstablishment = establishmentTestData[3];
      gccEstablishment.contactDetails.addresses[0].country = new BilingualText();
      component.establishment = gccEstablishment;
      spyOn(component.addEstablishmentService, 'verifyGCCEstablishmentDetails').and.returnValue(throwError(mockError));
      component.verifyGCCEstablishmentDetails(establishmentTestData[3]);
      expect(component.establishment.registrationNo).toEqual(establishmentTestData[3].registrationNo);
    });
    it('Should validate the gcc establishment', () => {
      component.establishment = new Establishment();
      spyOn(component.addEstablishmentService, 'verifyGCCEstablishmentDetails').and.returnValue(of([]));
      spyOn(component, 'setVerifiedEstablishmentAndNavigate');
      component.verifyGCCEstablishmentDetails(establishmentTestData[3]);
      expect(component.setVerifiedEstablishmentAndNavigate).toHaveBeenCalled();
    });
  });
});

export const lov: Lov = {
  value: new BilingualText(),
  code: undefined,
  sequence: undefined,
  items: []
};

export const organistaionList: Lov[] = [
  {
    value: { english: organsationTypes[0], arabic: '' },
    code: undefined,
    sequence: undefined,
    items: [lov, lov]
  }
];
