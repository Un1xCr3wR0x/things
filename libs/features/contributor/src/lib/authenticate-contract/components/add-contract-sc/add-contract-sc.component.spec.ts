/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  CalendarService,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  LanguageToken,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  AlertServiceStub,
  bankDetailsByIBAN,
  bankDetailsByPerson,
  CalendarServiceStub,
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
  maritalStatus,
  ModalServiceStub,
  nationalityListData,
  ProgressWizardDcMockComponent
} from 'testing';
import {
  ContractAuthenticationService,
  ContributorService,
  Establishment,
  EstablishmentService,
  ManageWageService
} from '../../../shared';
import { AddContractScComponent } from './add-contract-sc.component';

describe('AddContractScComponent', () => {
  let component: AddContractScComponent;
  let fixture: ComponentFixture<AddContractScComponent>;
  const contractServiceSpy = jasmine.createSpyObj<ContractAuthenticationService>('ContractAuthenticationService', [
    'getContracts',
    'getListOfClauses',
    'addContractDetails',
    'saveClauseDetails',
    'revertContractDetails'
  ]);
  contractServiceSpy.getContracts.and.returnValue(of({ contracts: contractDetails, count: 1 }));
  contractServiceSpy.getListOfClauses.and.returnValue(of(<any>contractClause));
  contractServiceSpy.addContractDetails.and.returnValue(
    of({ message: new BilingualText(), contractId: 1600765, transactionId: null })
  );
  contractServiceSpy.saveClauseDetails.and.returnValue(of({ message: new BilingualText() }));
  contractServiceSpy.revertContractDetails.and.returnValue(of(new BilingualText()));
  const manageWageServiceSpy = jasmine.createSpyObj<ManageWageService>('ManageWageService', [
    'getEngagements',
    'engagementId'
  ]);
  manageWageServiceSpy.getEngagements.and.returnValue(of([<any>engagementData]));
  manageWageServiceSpy.registrationNo = 110000103;
  manageWageServiceSpy.engagementId = 1569355076;

  const contributorServiceSpy = jasmine.createSpyObj<ContributorService>('ContributorService', [
    'getBankDetails',
    'getContributor'
  ]);
  contributorServiceSpy.getBankDetails.and.returnValue(of(<any>bankDetailsByPerson));
  contributorServiceSpy.getContributor.and.returnValue(of(<any>getContributorData));

  const lookupServiceSpy = jasmine.createSpyObj<LookupService>('LookupService', [
    'getBankForIban',
    'getGccCountryList',
    'getEducationList',
    'getSpecializationList',
    'getCityList',
    'getGenderList',
    'getNationalityList',
    'getYesOrNoList',
    'getCountryList',
    'getMaritalStatus',
    'getReligionList',
    'getHijriDate'
  ]);
  lookupServiceSpy.getBankForIban.and.returnValue(of(<any>new LovList([bankDetailsByIBAN])));
  lookupServiceSpy.getGccCountryList.and.returnValue(of(gccCountryListData));
  lookupServiceSpy.getEducationList.and.returnValue(of(legalEntityListData));
  lookupServiceSpy.getSpecializationList.and.returnValue(of(legalEntityListData));
  lookupServiceSpy.getCityList.and.returnValue(of(cityListData));
  lookupServiceSpy.getGenderList.and.returnValue(of(genderListData));
  lookupServiceSpy.getNationalityList.and.returnValue(of(nationalityListData));
  lookupServiceSpy.getYesOrNoList.and.returnValue(of(null));
  lookupServiceSpy.getCountryList.and.returnValue(of(countryListData));
  lookupServiceSpy.getMaritalStatus.and.returnValue(of(maritalStatus));
  lookupServiceSpy.getReligionList.and.returnValue(of(new LovList([])));
  lookupServiceSpy.getHijriDate.and.returnValue(of(new GosiCalendar()));
  const establishmentServiceSpy = jasmine.createSpyObj<EstablishmentService>('EstablishmentService', [
    'getEstablishmentDetails'
  ]);
  establishmentServiceSpy.getEstablishmentDetails.and.returnValue(of(<Establishment>(<any>establishmentData)));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddContractScComponent, ProgressWizardDcMockComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ContractAuthenticationService, useValue: contractServiceSpy },
        { provide: LookupService, useValue: lookupServiceSpy },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useValue: establishmentServiceSpy },
        { provide: ContributorService, useValue: contributorServiceSpy },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: ManageWageService, useValue: manageWageServiceSpy },
        { provide: CalendarService, useClass: CalendarServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('Should getListOfClauses', () => {
    component.getListOfClauses(110000103, 368858587, 266341800, 1600765);
    expect(component.contractClausesList).not.toBeNull();
  });

  it('Should getContractInValidator', () => {
    component.getContractInValidator(110000103, 368858587, 1569355076);
    expect(component.contractAtValidator).not.toBeNull();
  });

  it('Should getPreviewEstablishment', () => {
    component.registrationNo = 110000103;
    component.getEstablishment().subscribe();
    // expect(component.previewEstablishment).not.toBeNull();
  });
  it('Should getActiveEngagement', () => {
    component.registrationNo = 110000103;
    component.socialInsuranceNo = 368858587;
    component.getActiveEngagement();
    // expect(component.activeEngagement).toBeDefined();
  });
  it('should get contributor type', () => {
    component.getContributor().subscribe();
    // expect(component.contributorType).toBe('SAUDI');
  });
  it('Should getDataForView', () => {
    component.registrationNo = 110000103;
    component.socialInsuranceNo = 368858587;
    component.contractId = 1600765;
    component.initializeViewForEdit();
    // expect(component.contractClausesList).not.toBeNull();
  });
  it('Should selectWizard', () => {
    component.selectWizard(1);
    expect(component.activeTab).toBe(1);
  });
  it('Should setContributorStatus', () => {
    component.setContributorStatus(engagementData);
  });
  it('should check edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'edit' }]);
    component.checkEditMode();
    expect(component.isEditMode).not.toBeTruthy();
  }));

  it('should read key from token', inject([RouterDataToken], token => {
    token.transactionId = 423651;
    token.payload =
      '{"registrationNo ": 200085744, "socialInsuranceNo": 532231,"contractId":4555 , "id":4555  "referenceNo":4555 }';
    component.setRouteDetails();
    component.routerDataToken.payload = true;
    expect(component.registrationNo).toBeDefined();
  }));

  it('should throw error on refersh documents', () => {
    spyOn(component.documentService, 'refreshDocument').and.callThrough();
    component.refreshDocument(new DocumentItem());
    expect(component.documentService.refreshDocument).toHaveBeenCalled();
  });
  it('should cancel transaction', () => {
    spyOn(component, 'checkPopupRequired').and.returnValue(true);
    spyOn(component, 'showTemplate');
    component.onCancelClick(null);
    expect(component.showTemplate).toHaveBeenCalled();
  });

  it('should navigate back on cancel', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'checkPopupRequired').and.returnValue(false);
    spyOn(component.router, 'navigate');
    spyOn(component, 'navigateToBack').and.callThrough();
    component.onCancelClick(component.cancelTemplate);
    expect(component.navigateToBack).toHaveBeenCalled();
  });

  it('should revert transaction', () => {
    spyOn(component, 'checkRevertRequired').and.returnValue(true);
    spyOn(component, 'hideModal');
    spyOn(component, 'revertContractsDetails').and.callThrough();
    spyOn(component.router, 'navigate');
    component.onConfirmCancelClick();
    expect(component.revertContractsDetails).toHaveBeenCalled();
  });

  it('should navigate back without reverting the transaction', () => {
    spyOn(component, 'checkRevertRequired').and.returnValue(false);
    spyOn(component, 'hideModal');
    spyOn(component, 'navigateToBack');
    component.onConfirmCancelClick();
    expect(component.navigateToBack).toHaveBeenCalled();
  });
});
