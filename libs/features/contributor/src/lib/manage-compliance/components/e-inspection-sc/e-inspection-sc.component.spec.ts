/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken,
  ToastrMessageService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import {
  AlertServiceStub,
  bankDetailsByIBAN,
  bankDetailsByPersonId,
  cityListData,
  contractClause,
  contractDetails,
  countryListData,
  DocumentServiceStub,
  engagementData,
  establishmentData,
  gccCountryListData,
  genderListData,
  getContributorData,
  legalEntityListData,
  nationalityListData,
  systemParameterResponseData,
  ToastrServiceStub,
  violationRequest
} from 'testing';
import {
  ContractAuthenticationService,
  ContributorService,
  DocumentTransactionId,
  DocumentTransactionType,
  Establishment,
  EstablishmentService,
  ManageWageService
} from '../../../shared';
import { EInspectionScComponent } from './e-inspection-sc.component';

describe('EInspectionScComponent', () => {
  let component: EInspectionScComponent;
  let fixture: ComponentFixture<EInspectionScComponent>;
  const violationApprove = {
    arabic: 'Violation request for the engagement approved successfully.',
    english: 'Violation request for the engagement approved successfully.'
  };
  const contractServiceSpy = jasmine.createSpyObj<ContractAuthenticationService>('ContractAuthenticationService', [
    'getContracts',
    'getListOfClauses',
    'addContractDetails',
    'saveClauseDetails',
    'getViolationRequest',
    'approveEngagement'
  ]);
  contractServiceSpy.getContracts.and.returnValue(of({ contracts: contractDetails, count: 1 }));
  contractServiceSpy.getListOfClauses.and.returnValue(of(<any>contractClause));
  contractServiceSpy.addContractDetails.and.returnValue(
    of({ message: new BilingualText(), contractId: 1600765, transactionId: null })
  );
  contractServiceSpy.saveClauseDetails.and.returnValue(of({ message: new BilingualText() }));
  contractServiceSpy.getViolationRequest.and.returnValue(of(<any>{ violationRequest }));
  contractServiceSpy.approveEngagement.and.returnValue(of({ violationApprove }));

  const manageWageServiceSpy = jasmine.createSpyObj<ManageWageService>('ManageWageService', [
    'getEngagements',
    'engagementId'
  ]);
  manageWageServiceSpy.getEngagements.and.returnValue(of([<any>engagementData]));
  manageWageServiceSpy.registrationNo = 110000103;
  manageWageServiceSpy.engagementId = 1569355076;

  const contributorServiceSpy = jasmine.createSpyObj<ContributorService>('ContributorService', [
    'getBankDetails',
    'getContributor',
    'getSystemParams'
  ]);
  contributorServiceSpy.getBankDetails.and.returnValue(of(<any>bankDetailsByPersonId));
  contributorServiceSpy.getContributor.and.returnValue(of(<any>getContributorData));
  contributorServiceSpy.getSystemParams.and.returnValue(of(<any>systemParameterResponseData));
  const lookupServiceSpy = jasmine.createSpyObj<LookupService>('LookupService', [
    'getBank',
    'getGccCountryList',
    'getEducationList',
    'getSpecializationList',
    'getCityList',
    'getGenderList',
    'getNationalityList',
    'getYesOrNoList',
    'getCountryList'
  ]);
  lookupServiceSpy.getBank.and.returnValue(of(<any>new LovList([bankDetailsByIBAN])));
  lookupServiceSpy.getGccCountryList.and.returnValue(of(gccCountryListData));
  lookupServiceSpy.getEducationList.and.returnValue(of(legalEntityListData));
  lookupServiceSpy.getSpecializationList.and.returnValue(of(legalEntityListData));
  lookupServiceSpy.getCityList.and.returnValue(of(cityListData));
  lookupServiceSpy.getGenderList.and.returnValue(of(genderListData));
  lookupServiceSpy.getNationalityList.and.returnValue(of(nationalityListData));
  lookupServiceSpy.getYesOrNoList.and.returnValue(of(null));
  lookupServiceSpy.getCountryList.and.returnValue(of(countryListData));
  const establishmentServiceSpy = jasmine.createSpyObj<EstablishmentService>('EstablishmentService', [
    'getEstablishmentDetails'
  ]);
  establishmentServiceSpy.getEstablishmentDetails.and.returnValue(of(<Establishment>(<any>establishmentData)));
  const routerSpy = {
    url: 'home/contributor/compliance/e-inspection',
    navigate: jasmine.createSpy('navigate'),
    routerState: {
      root: {
        data: { title: 'Title' }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [EInspectionScComponent],
      providers: [
        { provide: ContributorService, useValue: contributorServiceSpy },
        { provide: EstablishmentService, useValue: establishmentServiceSpy },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ContractAuthenticationService, useValue: contractServiceSpy },
        { provide: LookupService, useValue: lookupServiceSpy },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: ManageWageService, useValue: manageWageServiceSpy },
        { provide: ToastrMessageService, useClass: ToastrServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EInspectionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Should getContributor', () => {
    component.getContributor();
    expect(component.personDetails).not.toBeNull();
  });
  it('Should getEstablishment', () => {
    component.getEstablishment();
    expect(component.engagementDetails).not.toBeNull();
  });
  it('Should getEngagement', () => {
    const engagementId = 1569355076;
    component.getEngagement(engagementId);
    expect(component.engagementDetails).not.toBeNull();
  });
  it('Should setRouterData', () => {
    component.setRouterData();
  });
  it('Should getViolationRequest', () => {
    component.getViolationRequest();
    expect(component.violationDetails).not.toBeNull();
  });
  it('should updateWorkFlow', () => {
    const userInput = { action: 'APPROVE', comments: 'please update' };
    spyOn(component, 'isAtleastOneUploaded').and.returnValue(true);
    component.updateWorkFlow(userInput);
  });
  it('should getRequiredDocument', () => {
    const engagementId = 1569355076;
    component.getRequiredDocument(
      DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION,
      [DocumentTransactionType.CHANGE_ENGAGEMENT_VIOLATION_JOINING_DATE],
      true,
      engagementId
    );
    expect(component.documents).not.toBeNull();
  });
  it('Should refreshDocument', () => {
    const engagementId = 1569355076;
    const workFlowType = DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION;
    component.refreshDocument(new DocumentItem(), workFlowType, engagementId);
  });
  it('Should isAtleastOneUploaded', () => {
    component.isAtleastOneUploaded([new DocumentItem()]);
  });
  it('Should cancelInspection', () => {
    component.cancelInspection();
    expect(component.router.navigate).toHaveBeenCalled();
  });
});
