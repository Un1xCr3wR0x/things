/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { reasonForCancelEngagement, governmentUniversities, FieldOfficeDetailsTest } from 'testing';
import { lovListData, reasonForCancellationList, hijriDateData } from 'testing';
import { LookupCategory, LookupDomainName, LookupPath } from '../enums';
import { EnvironmentToken } from '../tokens';
import { LookupService } from './lookup.service';
import { Occupation, OccupationList } from '../models';
import { noop } from 'rxjs';

/**
 * To test LookupValueTest.
 */

describe('LookupService', () => {
  let lookupService: LookupService;
  let httpMock: HttpTestingController;
  const lovBaseUrl = '/api/v1/lov';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LookupService,

        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080' }
        }
      ]
    });
    lookupService = TestBed.inject(LookupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  /** Test if lookup service is getting created. */
  it('Should create lookup service', () => {
    expect(lookupService).toBeTruthy();
  });

  it('Should get country list', () => {
    lookupService.getCountryList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.COUNTRY}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  // it('Should throw error on country list', () => {
  //   const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.COUNTRY}`;
  //   lookupService.getCountryList().subscribe((res: any) => {
  //     expect(res.failure.error.type).toBe('ERROR_LOADING_COUNTRIES');
  //   });
  //   const httpRequest = httpMock.expectOne(lovUrl);
  //   expect(httpRequest.request.method).toBe('GET');
  //   httpRequest.flush(lovListData);
  //   httpMock.verify();
  // });

  xit('Should throw error on Organization Type list', () => {
    const lovUrl = `${lovBaseUrl}/${LookupPath.ORGANIZATION_CATEGORY}?category=${LookupCategory.REGISTRATION}`;
    lookupService.getOrganistaionTypeList().subscribe(noop, err => {
      expect(err.failure.error.type).toBe('ERROR_LOADING_ORGANIZATION_TYPE');
    });
    const lovObj = httpMock.expectOne(lovUrl);
    expect(lovObj.request.method).toBe('GET');
    lovObj.error(new ErrorEvent('ERROR_LOADING_ORGANIZATION_TYPE'));
    httpMock.verify();
  });

  it('Should get Education list', () => {
    lookupService.getEducationList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.EDUCATION}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get Reopen reason list', () => {
    lookupService.getReopenReason(LookupCategory.REGISTRATION).subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.REOPEN_REASON}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Location list', () => {
    lookupService.getLocationList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.LOCATION}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Legal Entity list', () => {
    lookupService.getlegalEntityList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.LEGALENTITYTYPE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Organization Type list', () => {
    lookupService.getOrganistaionTypeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}/${LookupPath.ORGANIZATION_CATEGORY}?category=${LookupCategory.REGISTRATION}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get License Issue Authority list', () => {
    lookupService.getLicenseIssueAuthorityList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.LICENSE_ISSUING_AUTHORITY}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Establishment Type list', () => {
    lookupService.getEstablishmentTypeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.ESTABLISHMENT_TYPE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Establishment Reject Reason list', () => {
    lookupService.getEstablishmentRejectReasonList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.TRANSACTION_REJECT_REASON}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Registration Reject Reason list', () => {
    lookupService.getRegistrationReturnReasonList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.TRANSACTION_RETURN_REASON}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Nationality list', () => {
    lookupService.getNationalityList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.NATIONALITY}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get City list', () => {
    lookupService.getCityList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}/${LookupPath.VILLAGE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Injury Occurred Place list', () => {
    lookupService.getInjuryOccuredPlace().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.OH_WORK_INJURY_LOCATION_CODE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Gender list', () => {
    lookupService.getGenderList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.SEX}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Specialization list', () => {
    lookupService.getSpecializationList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.MOL_SPECIALIZATION}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Work Type list', () => {
    lookupService.getWorkTypeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.WORK_TYPE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Injury Type list', () => {
    lookupService.getInjuryTypeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.OH_ACCIDENT_TYPE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Injury Reason list', () => {
    lookupService.getInjuryReasonList('FALLS').subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}/${LookupPath.INJURY_REASON}?typeName=FALLS`;
    const lovObj = httpMock.expectOne(lovUrl);
    expect(lovObj.request.method).toBe('GET');
    lovObj.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Activity Type list', () => {
    lookupService.getActivityTypeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}/${LookupPath.ACTIVITY_TYPE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  /**
   * This method is to fetch Address Type lookup values.
   * @memberof LookupService
   */

  it('Should get Address Type list', () => {
    lookupService.getAddressTypeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.ADDRESS_TYPE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get bank list', () => {
    lookupService.getBank(121212121).subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}/bank/121212121`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  /**
   * This method is to get the gcc country look up values.
   * @memberof LookupService
   */

  it('Should get GCC Country list', () => {
    lookupService.getGccCountryList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.GCC_COUNTRY}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  /**
   * This method is used to fetch yes or list
   * @memberof LookupService
   */

  it('Should get Yes or No list', () => {
    lookupService.getYesOrNoList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.MOF_PAYMENT}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  /**
   * This method is to fetch GCC Currency List
   */

  it('Should get GCC Currency list', () => {
    lookupService.getGccCurrencyList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.GCC_CURRENCY}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  /**
   * This method is to fetch government sector List
   */

  it('Should get Government Sector list', () => {
    lookupService.getGovernmentSectorList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.GOVERNMENT_SECTOR}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  /**
   * This method is to get the receipt mode look up values.
   */

  it('Should get Receipt Mode list', () => {
    lookupService.getReceiptMode().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.RECEIPT_MODE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  /**
   * This method is to get the receipt mode look up values.
   */

  it('Should get Adjustment Reason list', () => {
    lookupService.getAdjustmentReason().subscribe(() => {
      expect(lovListData.items[2].value.english).toEqual('Others');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.ADJUSTMENT_REASON}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  /**
   * This method is to get the Saudi bank list look up values.
   */

  it('Should get Saudi Bank list', () => {
    lookupService.getSaudiBankList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.BANK_NAME}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  /**
   * This method is to fetch contributor leaving reason values for terminated.
   */
  it('Should get Reason for leaving list', () => {
    lookupService.getReasonForLeavingList('1').subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.REASON_FOR_LEAVING}&nationality=1&autoReasonRequired=false`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  /**
   * This method is to get the Non Saudi bank list look up values.
   */

  it('Should get Non Saudi bank list', () => {
    lookupService.getNonSaudiBankList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.GCC_BANK}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  /**
   * get establishment names of sin
   * @param socialInsuranceNo
   */
  it('Should get City list', () => {
    lookupService.getEstablishmentNameList(123456789).subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `/api/v1/contributor/123456789/establishment-name`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get GCC Bank list', () => {
    lookupService.getGCCBankList('test-bank').subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=test-bank`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Bank Type list', () => {
    lookupService.getBankType().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.BANKTYPE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Establishment Location list', () => {
    lookupService.getEstablishmentLocationList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}/${LookupPath.FIELD_OFFICE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Establishment status list', () => {
    lookupService.getEstablishmentStatusList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}/${LookupPath.ESTABLISHMENT_STATUS}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get flag type  list', () => {
    lookupService.getFlagTypeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}/${LookupPath.FLAG_TYPE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get occupation list', () => {
    const items: Occupation[] = [
      {
        occupationCode: '1001',
        occupationName: { english: 'Commercial Pilot', arabic: 'طيار تجاري' },
        workType: 'Distance working',
        value: { english: 'Commercial Pilot', arabic: 'طيار تجاري' },
        occupationStartDate: { gregorian: new Date() },
        disabled: true
      }
    ];
    const occupationList: OccupationList = new OccupationList(items);

    let occupationLovUrl = `${lovBaseUrl}/occupation?version=LATEST`;

    lookupService.getOccupationList().subscribe(() => {
      expect(occupationList.items[0].occupationCode).toEqual('1001');
    });

    const httpRequest = httpMock.expectOne(occupationLovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(occupationList);
    httpMock.verify();
  });
  it('Should get Receipt status list', () => {
    lookupService.getReceiptStatus().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.RECEIPT_STATUS}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('should get reason for cancellation list', () => {
    lookupService.getReasonForCancellationList().subscribe(() => {
      expect(reasonForCancellationList.items[4].value.english).toEqual('Other');
      expect(reasonForCancellationList.items.length).toBe(5);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.REASON_FOR_CANCELLATION}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(reasonForCancellationList);
    httpMock.verify();
  });

  it('should get reason list for cancel engagement', () => {
    lookupService.getReasonForCancelEngagement().subscribe(() => {
      expect(reasonForCancelEngagement.items[3].value.english).toEqual('Other');
      expect(reasonForCancelEngagement.items.length).toBe(4);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.REASON_FOR_CANCELLATION_ENGAGEMENT}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(reasonForCancelEngagement);
    httpMock.verify();
  });

  it('Should get payment status list', () => {
    lookupService.getBillPaymentStatusList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.BILL_PAYMENT_STATUS}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get saudi list', () => {
    lookupService.getSaudiNonSaudi().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.CONTRIBUTOR_RESIDENCE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('should get government university list', () => {
    lookupService.getGovernmentUniversities().subscribe(() => {
      expect(governmentUniversities.items[0].value.english).toEqual('Umm Alqura University');
      expect(governmentUniversities.items.length).toBe(26);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.GOVERNMENT_UNIVERSITIES}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(governmentUniversities);
    httpMock.verify();
  });

  it('Should get collection Reject Reason list', () => {
    lookupService.getCollectionReturnReasonList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.GENERAL_DIRECTOR_TRANSACTION}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get contributionSortList', () => {
    lookupService.getContributionSortFieldsList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.CONTRIBUTION_SORT_FIELD}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get adjustmentSortList', () => {
    lookupService.getAdjustmentSortFieldsList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.ADJUSTMENT_SORT_FIELD}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });

  it('Should get Hijri Date', () => {
    lookupService.getHijriDate(new Date('2020-09-08')).subscribe(() => {
      expect(hijriDateData.hijiri).toEqual('1442-01-20');
    });
    const calenderUrl = `/api/v1/calendar/hijiri?gregorian=2020-09-08`;
    const httpRequest = httpMock.expectOne(calenderUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(hijriDateData);
    httpMock.verify();
  });
  it('Should get receipt sort list', () => {
    lookupService.getReceiptSortFields().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.RECEIPT_SORT_FIELDS}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get mof contribution sort list', () => {
    lookupService.getMofContributionSortList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.THIRD_PARTY_SORT_FIELDS}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get international country list', () => {
    lookupService.getInternationalCountryList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.INTERNATIONALCOUNTRY}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get vic segment list', () => {
    lookupService.getVicSegmentFilterList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.VIC_SEGMENT_FILTER}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get vic segment list', () => {
    lookupService.getPurposeOfRegistrationList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.PURPOSE_OF_REGISTRATION}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get Audit ReasonList', () => {
    lookupService.getAuditReasonList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.OH}&domainName=${LookupDomainName.AUDITOR_INVOICE_REASON}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get InjuryStatusList', () => {
    lookupService.getInjuryStatusList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.CLOSE_INJURY_STATUS}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should  get TreatmentServiceRejectionList', () => {
    lookupService.getTreatmentServiceRejectionList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.AUDITOR_REJECTION_REASON}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get TreatmentServiceTypeList', () => {
    lookupService.getTreatmentServiceTypeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.TREATMENT_SERVICE_TYPE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should  get OhCategoryTypeList', () => {
    lookupService.getOhCategoryTypeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.OH_CATEGORY}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   get ReligionList', () => {
    lookupService.getReligionList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.RELIGION}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   get EstablishmentSegmentFilterList', () => {
    lookupService.getEstablishmentSegmentFilterList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.ESTABLISHMENT_SEGMENT_FILTER}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   get AllEntityFilter', () => {
    lookupService.getAllEntityFilter().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.ALL_ENTITES_SEGMENT_FILTER}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   getPaymentTypeWavier', () => {
    lookupService.getPaymentTypeWavier().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.PAYMENT_TYPE_FOR_WAVIER}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   getInstallmentStatusList', () => {
    lookupService.getInstallmentStatusList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.INSTALLMENT_STATUS}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   get MaritalStatus', () => {
    lookupService.getMaritalStatus().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.MARITAL_STATUS}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   get TransferModeList', () => {
    lookupService.getTransferModeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.TRANSFER_MODE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   get CreditRetainList', () => {
    lookupService.getCreditRetainList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.CREDIT_RETAIN_INDICATOR}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   get GuaranteetypePromissoryNoteList', () => {
    lookupService.getGuaranteetypePromissoryNoteList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.GUARANTEE_TYPE_PROMISSORY_NOTE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   get GuaranteetypeBankingList', () => {
    lookupService.getGuaranteetypeBankingList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.GUARANTEE_TYPE_BANKING}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   get InstallmentGuaranteeTypeList', () => {
    lookupService.getInstallmentGuaranteeTypeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.INSTALLMENT_GUARANTEE_TYPE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   getGuaranteetypeOtherRegisteredList', () => {
    lookupService.getGuaranteetypeOtherRegisteredList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.GUARANTEE_TYPE_OTHER_REGISTERED}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   getGuaranteetypePensionOutOfMarketList', () => {
    lookupService.getGuaranteetypePensionOutOfMarketList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.GUARANTEE_TYPE_PENSION_OUT_OFMARKET}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   getGuaranteetypePensionRegisteredList', () => {
    lookupService.getGuaranteetypePensionRegisteredList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.COLLECTION}&domainName=${LookupDomainName.GUARANTEE_TYPE_PENSION_REGISTERED}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get getContactLists', () => {
    lookupService.getContactLists('COMPLAINTS_ENQUIRY', 'GosiBranches').subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${'COMPLAINTS_ENQUIRY'}&domainName=${'GosiBranches'}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get getFieldOfficeList', () => {
    lookupService.getFieldOfficeList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}/${LookupPath.FIELD_OFFICE}?isReturnFieldOfficeCode=false`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get getFieldOfficeDetails', () => {
    const contactId = 123456;
    lookupService.getFieldOfficeDetails(123456).subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}/contact/${contactId}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(FieldOfficeDetailsTest);
    httpMock.verify();
  });
  it('Should   get CancelViolationsList', () => {
    lookupService.getCancelViolationsList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.CANCEL_VIOLATION_REASON}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should  get ModifyViolationsList', () => {
    lookupService.getModifyViolationsList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.MODIFY_VIOLATION_REASON}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should   get TransferModeList', () => {
    lookupService.getTransferModeDetails().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.ANNUITIES}&domainName=${LookupDomainName.TRANSFER_MODE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get Registration Reject Reason list', () => {
    lookupService.getTpaRejectionReasonList().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.REGISTRATION}&domainName=${LookupDomainName.TPA_REJECTION_REASON}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get annuity adjustment holding reason list', () => {
    lookupService.getReasonForHolding().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.ANNUITIES}&domainName=${LookupDomainName.TPA_REASON_FOR_HOLD}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get annuity adjustment stop reason list', () => {
    lookupService.getReasonForHolding().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.ANNUITIES}&domainName=${LookupDomainName.TPA_REASON_FOR_STOP}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
  it('Should get annuity adjustment reactivating reason list', () => {
    lookupService.getReasonForHolding().subscribe(() => {
      expect(lovListData.items[0].sequence).toEqual(1);
      expect(lovListData.items[0].code).toEqual(1001);
      expect(lovListData.items[0].value.english).toEqual('english');
      expect(lovListData.items.length).toBeGreaterThan(0);
    });
    const lovUrl = `${lovBaseUrl}?category=${LookupCategory.ANNUITIES}&domainName=${LookupDomainName.TPA_REASON_FOR_REACTIVATE}`;
    const httpRequest = httpMock.expectOne(lovUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(lovListData);
    httpMock.verify();
  });
});
