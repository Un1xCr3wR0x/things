/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  CalendarService,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken,
  ToastrMessageService,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  AlertServiceStub,
  bankDetailsByIBAN,
  bankDetailsByPersonId,
  BilingualTextPipeMock,
  CalendarServiceStub,
  cityListData,
  contractDetails,
  DocumentServiceStub,
  engagementData,
  establishmentData,
  gccCountryListData,
  genderListData,
  getContributorData,
  legalEntityListData,
  ModalServiceStub,
  nationalityListData,
  rejectionReasonListData,
  testDataclauses,
  ToastrServiceStub,
  violationRequest,
  WorkflowServiceStub
} from 'testing';
import {
  ContractAuthenticationService,
  ContributorBPMRequest,
  ContributorService,
  EngagementService,
  Establishment,
  EstablishmentService,
  ManageWageService
} from '../../../../shared';
import { ValidatorEInspectionScComponent } from './validator-e-inspection-sc.component';

describe('ValidatorEInspectionScComponent', () => {
  let component: ValidatorEInspectionScComponent;
  let fixture: ComponentFixture<ValidatorEInspectionScComponent>;

  const contractServiceSpy = jasmine.createSpyObj<ContractAuthenticationService>('ContractAuthenticationService', [
    'getContracts',
    'getListOfClauses',
    'addContractDetails',
    'saveClauseDetails',
    'getViolationRequest'
  ]);
  contractServiceSpy.getContracts.and.returnValue(of({ contracts: contractDetails, count: 1 }));
  contractServiceSpy.getListOfClauses.and.returnValue(of(<any>testDataclauses));
  contractServiceSpy.addContractDetails.and.returnValue(
    of({ message: new BilingualText(), contractId: 1600765, transactionId: null })
  );
  contractServiceSpy.saveClauseDetails.and.returnValue(of({ message: new BilingualText() }));
  contractServiceSpy.getViolationRequest.and.returnValue(of(<any>{ violationRequest }));

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
  contributorServiceSpy.getBankDetails.and.returnValue(of(<any>bankDetailsByPersonId));
  contributorServiceSpy.getContributor.and.returnValue(of(<any>getContributorData));

  const lookupServiceSpy = jasmine.createSpyObj<LookupService>('LookupService', [
    'getBank',
    'getGccCountryList',
    'getEducationList',
    'getSpecializationList',
    'getCityList',
    'getGenderList',
    'getNationalityList',
    'getYesOrNoList',
    'getRegistrationReturnReasonList',
    'getEstablishmentRejectReasonList'
  ]);
  lookupServiceSpy.getBank.and.returnValue(of(<any>new LovList([bankDetailsByIBAN])));
  lookupServiceSpy.getGccCountryList.and.returnValue(of(gccCountryListData));
  lookupServiceSpy.getEducationList.and.returnValue(of(legalEntityListData));
  lookupServiceSpy.getSpecializationList.and.returnValue(of(legalEntityListData));
  lookupServiceSpy.getCityList.and.returnValue(of(cityListData));
  lookupServiceSpy.getGenderList.and.returnValue(of(genderListData));
  lookupServiceSpy.getNationalityList.and.returnValue(of(nationalityListData));
  lookupServiceSpy.getYesOrNoList.and.returnValue(of(null));
  lookupServiceSpy.getRegistrationReturnReasonList.and.returnValue(of(rejectionReasonListData));
  lookupServiceSpy.getEstablishmentRejectReasonList.and.returnValue(of(rejectionReasonListData));
  const establishmentServiceSpy = jasmine.createSpyObj<EstablishmentService>('EstablishmentService', [
    'getEstablishmentDetails'
  ]);
  establishmentServiceSpy.getEstablishmentDetails.and.returnValue(of(<Establishment>(<any>establishmentData)));
  const engagementServiceSpy = jasmine.createSpyObj<EngagementService>('EngagementService', ['getEngagementDetails']);
  engagementServiceSpy.getEngagementDetails.and.returnValue(
    of(<any>{ formSubmissionDate: '22/10/1990', transactionRefNo: 1234 })
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ValidatorEInspectionScComponent, BilingualTextPipeMock],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ContractAuthenticationService, useValue: contractServiceSpy },
        { provide: LookupService, useValue: lookupServiceSpy },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useValue: establishmentServiceSpy },
        { provide: ContributorService, useValue: contributorServiceSpy },
        { provide: EngagementService, useValue: engagementServiceSpy },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: ManageWageService, useValue: manageWageServiceSpy },
        { provide: ToastrMessageService, useClass: ToastrServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: CalendarService, useClass: CalendarServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorEInspectionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create validator', () => {
    expect(component).toBeTruthy();
  });
  it('Should saveWorkflow validator', () => {
    component.registrationNo = 110000103;
    component.socialInsuranceNo = 368858587;
    component.engagementId = 1569355076;
    spyOn(component.router, 'navigate');
    component.saveWorkflow(new ContributorBPMRequest());
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should initializeParameters', () => {
    component.initializeParameters();
    component.getViolationData();
    expect(component.violationDetails).not.toEqual(null);
  });
  it('should readDataFromToken', inject([RouterDataToken], token => {
    token.payload =
      '{"registrationNo": 200085744, "socialInsuranceNo": 423641258, "engagementId": 1569355076, "referenceNo": 269865, "id": 485}';
    component.readDataFromToken(token);
    expect(component.registrationNo).toBe(200085744);
    expect(component.socialInsuranceNo).toBe(423641258);
    component.getViolationData();
    expect(component.violationDetails).not.toEqual(null);
  }));
  it('should getContributor validator', () => {
    component.registrationNo = 110000103;
    component.socialInsuranceNo = 368858587;
    component.getContributorData();
    expect(component.contributor).not.toBeNull();
  });

  it('Should getEstablishment validator', () => {
    component.registrationNo = 110000103;
    component.getEstablishmentData();
    expect(component.establishment).not.toBeNull();
  });
  it('Should getEngagmentDetails validator', () => {
    component.registrationNo = 110000103;
    component.socialInsuranceNo = 368858587;
    component.engagementId = 1569355076;
    component.getEngagmentDetails();
  });
  it('Should getViolationData', () => {
    component.registrationNo = 110000103;
    component.requestId = 10238;
    component.getViolationData();
    expect(component.violationDetails).not.toEqual(null);
  });

  it('should decline template', () => {
    component.modalRef = new BsModalRef();
    component.decline();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should handle e-inspection actions', () => {
    spyOn(component.router, 'navigate');
    component.modalRef = new BsModalRef();
    component.handleEInspectionActions(0);
    expect(component.router.navigate).toHaveBeenCalled();
  });
});
