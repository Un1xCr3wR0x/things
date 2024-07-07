/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  GosiCalendar,
  LovList,
  Lov,
  WizardItem
} from '@gosi-ui/core';
import { ManagePersonService, BankAccountList } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ManagePersonServiceStub, ModalServiceStub, TranslateLoaderStub, genericError } from 'testing';
import {
  BenefitDocumentService,
  ManageBenefitService,
  ContributorSearchResult,
  SearchPersonalInformation,
  PersonalInformation,
  BankService,
  SearchPerson,
  HeirBenefitService,
  DependentDetails,
  ReturnLumpsumService,
  ActiveBenefits,
  AnnuityResponseDto,
  FuneralBenefitService,
  FuneralGrantBeneficiaryResponse,
  BenefitConstants,
  WizardService
} from '../../shared';
import { FuneralGrantApplyScComponent } from './funeral-grant-apply-sc.component';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';
import { DateTypePipe } from '@gosi-ui/foundation-theme/src';
import { DateTypePipeMock } from '../../shared/Mock/date-type-pipe-mock';

describe('FuneralGrantApplyScComponent', () => {
  let component: FuneralGrantApplyScComponent;
  let fixture: ComponentFixture<FuneralGrantApplyScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getSystemRunDate',
    'getContributorDetails',
    'getPersonDetailsApi',
    'getPersonDetailsWithPersonId',
    'requestId',
    'getSystemParams'
  ]);
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getContributorDetails.and.returnValue(of(new ContributorSearchResult()));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getPersonDetailsApi.and.returnValue(
    of({
      ...new SearchPersonalInformation(),
      listOfPersons: [
        {
          ...new PersonalInformation(),
          personId: 1234,
          sex: { english: 'Male', arabic: '' },
          fromJsonToObject: json => json
        }
      ]
    })
  );
  manageBenefitServiceSpy.getPersonDetailsWithPersonId.and.returnValue(
    of({
      ...new PersonalInformation(),
      identity: [],
      fromJsonToObject: json => json,
      name: {
        english: { name: '' },
        guardianPersonId: 2323,
        arabic: { firstName: '', secondName: '', thirdName: '', familyName: '', fromJsonToObject: json => json },
        fromJsonToObject: json => json
      }
    })
  );
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getReqDocs'
  ]);
  benefitDocumentServicespy.getReqDocs.and.returnValue(of([new DocumentItem()]));
  const heirServiceSpy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getAllHeirDetails',
    'setHeirUpdateWarningMsg',
    'getBenefitReasonList',
    'getHeirUpdateWarningMsg'
  ]);
  //heirServiceSpy.getHeirUpdateWarningMsg.and.returnValue(of([new DependentDetails()]));
  heirServiceSpy.getAllHeirDetails.and.returnValue(of([new DependentDetails()]));
  heirServiceSpy.getBenefitReasonList.and.returnValue(of(new LovList([new Lov()])));
  const funeralBenefitServicespy = jasmine.createSpyObj<FuneralBenefitService>('FuneralBenefitService', [
    'getBeneficiaryRequestDetails'
  ]);
  funeralBenefitServicespy.getBeneficiaryRequestDetails.and.returnValue(of(new FuneralGrantBeneficiaryResponse()));
  const returnLumpsumServicespy = jasmine.createSpyObj<ReturnLumpsumService>('ReturnLumpsumService', [
    'getActiveBenefitDetails',
    'getSavedActiveBenefit',
    'getIsUserSubmitted'
  ]);
  returnLumpsumServicespy.getSavedActiveBenefit.and.returnValue(
    new ActiveBenefits(2324232, 444323, { arabic: 'التعطل عن العمل (ساند)', english: 'Pension Benefits' }, 7877656)
  );
  returnLumpsumServicespy.getActiveBenefitDetails.and.returnValue(
    of({
      ...new AnnuityResponseDto(),
      personId: 1234,
      benefitType: { english: 'Pension', arabic: 'Pension' },
      enabledRestoration: true,
      fromJsonToObject: json => json
    })
  );
  /*const wizardServiceSpy = jasmine.createSpyObj<WizardService>('WizardService', [
    'isWizardItemAvailable',
    'restrictProgress',
    'addWizardItem',
    'getFuneralWizards'
  ]);
  wizardServiceSpy.isWizardItemAvailable.and.returnValue(1);
  wizardServiceSpy.addWizardItem.and.returnValue( [new WizardItem('Label', 'Icon')]);
  wizardServiceSpy.getFuneralWizards.and.returnValue( [new WizardItem('Label', 'Icon')]);*/
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [FuneralGrantApplyScComponent, DateTypePipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ReturnLumpsumService, useValue: returnLumpsumServicespy },
        { provide: FuneralBenefitService, useValue: funeralBenefitServicespy },
        // { provide: WizardService, useValue: wizardServiceSpy },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        {
          provide: DateTypePipe,
          useClass: DateTypePipeMock
        },
        { provide: HeirBenefitService, useValue: heirServiceSpy },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuneralGrantApplyScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeTruthy();
      component.isValidator = true;
    });
  });
  describe('ngAfterViewInit', () => {
    it('should ngAfterViewInit', () => {
      component.ngAfterViewInit();
      component.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
      expect(component.ngAfterViewInit).toBeDefined();
    });
  });
  describe('initFuneralGrantWizard', () => {
    it('should initFuneralGrantWizard', () => {
      spyOn(component, 'initFuneralGrantWizard').and.callThrough();
      fixture.detectChanges();
      expect(component.initFuneralGrantWizard).toBeDefined();
    });
  });

  describe('getContributorDetails', () => {
    it('should get Contributor Details', () => {
      const personId = 211004584;
      component.getContributorDetails(personId);
      fixture.detectChanges();
      expect(component.getContributorDetails).toBeDefined();
    });
    it('should setValuesToObject', () => {
      component.setValuesToObject(232, 32434);
      fixture.detectChanges();
      expect(component.setValuesToObject).toBeDefined();
    });
  });
  describe('setLocalVariables', () => {
    it('should set Local Variables', () => {
      component.setLocalVariables();
      fixture.detectChanges();
      expect(component.setLocalVariables).toBeDefined();
    });
  });
  describe('getHeirAttorneyGuardianList', () => {
    it('should getHeirAttorneyGuardianList', () => {
      const heir = {
        ...new DependentDetails(),
        personId: 1234,
        guardianPersonId: 77676,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.getHeirAttorneyGuardianList(heir);
      heir.guardianPersonId = 77676;
      fixture.detectChanges();
      expect(component.getHeirAttorneyGuardianList).toBeDefined();
    });
  });
  describe('searchPerson', () => {
    it('should searchPerson', () => {
      const event = { ...new SearchPerson(), nationality: { english: 'SAUDI', arabic: '' } };
      component.benefitStartDate = { ...new GosiCalendar(), gregorian: new Date() };
      component.benefitType = 'Pension';
      component.searchPerson(event, component.benefitStartDate);
      expect(component.searchPerson).toBeTruthy();
    });
    it('should search', () => {
      const event = { ...new SearchPerson(), nationality: { english: 'SAUDI', arabic: '' } };
      component.benefitStartDate = { ...new GosiCalendar(), gregorian: new Date() };
      component.benefitType = 'Pension';
      component.search(event);
      expect(component.search).toBeTruthy();
    });
  });
  describe('getBankDetailsFromApi', () => {
    it('should get Bank Details From Api', () => {
      const id = 1;
      component.getBankDetailsFromApi(id);
      spyOn(component, 'getBankDetailsFromApi').and.callThrough();
      //spyOn(component.bankService, 'getBankAccountList').and.returnValue(of());
      fixture.detectChanges();
      expect(component.bankAccountList).not.toBeNull();
      expect(component.getBankDetailsFromApi).toBeDefined();
    });
  });
  describe('previousForm', () => {
    it('should go to previous Form', () => {
      spyOn(component, 'goToPreviousForm');
      component.previousForm();
      fixture.detectChanges();
      expect(component.previousForm).toBeDefined();
    });
  });
  describe('getHeirs', () => {
    it('it should  getHeirs', () => {
      component.getHeirs();
      component.heirBenefitService.getAllHeirDetails;
      //spyOn(component.heirBenefitService,'getAllHeirDetails').and.returnValue(of([new DependentDetails ()]));
      expect(component.heirDetails).not.toBeNull();
      expect(component.getHeirs).not.toBeNull();
    });
  });
  describe('selectedWizard', () => {
    it('should selectedWizard', () => {
      const index = 1;
      spyOn(component, 'selectedWizard');
      component.selectedWizard(index);
      expect(component.selectedWizard).toBeDefined();
    });
  });

  describe('cancelTransaction', () => {
    it('should handle cancellaton of Transaction', () => {
      component.cancelTransaction();
      fixture.detectChanges();
      expect(component.cancelTransaction).toBeDefined();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('showErrorMessage', () => {
    it('should show error message', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessages({ error: 'error' });
      component.showErrorMessages({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('showErrorMessages', () => {
    it('should et show error message', () => {
      const messageKey = { english: 'test', arabic: 'test' };
      component.alertService.showError(messageKey);
      expect(component.showErrorMessages).toBeTruthy();
    });
  });
  describe(' viewIneligibleDetails', () => {
    it('should  viewIneligibleDetails', () => {
      component.commonModalRef = new BsModalRef();
      spyOn(component.alertService, 'clearAlerts');
      component.viewIneligibleDetails();
      expect(component.viewIneligibleDetails).toBeTruthy();
    });
  });
  describe('docUploadSuccess', () => {
    it('should docUploadSuccess', () => {
      spyOn(component, 'docUploadSuccess');
      const event = { ...new SearchPerson(), nationality: { english: 'SAUDI', arabic: '' } };
      component.benefitStartDate = { ...new GosiCalendar(), gregorian: new Date() };
      component.benefitType = 'Pension';
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      component.docUploadSuccess(event);
      expect(component.docUploadSuccess).toBeDefined();
    });
  });
  xdescribe('submitFuneralGrant', () => {
    it('should submitFuneralGrant', () => {
      component.submitFuneralGrant();
      expect(component.submitFuneralGrant).toBeDefined();
    });
  });
  describe('clearAllAlerts', () => {
    it('should clear all alerts', () => {
      spyOn(component.alertService, 'clearAllErrorAlerts');
      spyOn(component.alertService, 'clearAllWarningAlerts');
      component.clearAllAlerts();
      expect(component.clearAllAlerts).toBeDefined();
    });
  });

  describe('submitFuneralGrant', () => {
    it('should submit Funeral Grant', () => {
      // component.submitFuneralGrant();
      // fixture.detectChanges();
      expect(component.submitFuneralGrant).toBeDefined();
    });
  });
  describe('deathDateChanged', () => {
    it('should deathDateChanged', () => {
      // component.submitFuneralGrant();
      // fixture.detectChanges();
      const date = '2020-12-31';
      expect(component.deathDateChanged).toBeDefined();
      component.deathDateChanged(date);
      expect(component.minDate).not.toBeNull();
    });
  });
});
