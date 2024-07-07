/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  bindToObject,
  Channel,
  DocumentService,
  EnvironmentToken,
  Establishment,
  EstablishmentPaymentDetails,
  EstablishmentRouterData,
  EstablishmentToken,
  LanguageToken,
  LookupService,
  LovList,
  Person,
  RouterConstants,
  StorageService
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, of, ReplaySubject, throwError } from 'rxjs';
import {
  AlertServiceStub,
  branchGenericEstablishment,
  DocumentServiceStub,
  EstablishmentAdminServiceStub,
  EstablishmentServiceStub as AddEstablishmentServiceStub,
  EstablishmentStubService,
  genericAdminResponse,
  genericError,
  genericEstablishmentResponse,
  genericRouteData,
  LookupServiceStub,
  StorageServiceStub
} from 'testing';
import {
  BilingualTextPipeMock,
  DummyComponent,
  EStablishmentDetailsFormMOckDcComponent,
  FIELDOFFICE_MOCK_COMPONENTS,
  OwnerMockComponent,
  PaymentDetailsMockDcComponent,
  PersonDetailsStubComponent,
  ProgressWizardDcMockComponent,
  ScanDocumentsStubComponent,
  SearchPersonStubComponent
} from 'testing/mock-components';
import {
  adminNotFoundError,
  bankPaymentDetails,
  establishmentTestData,
  getOwnerError,
  mockError,
  verifyOwnerResponse
} from 'testing/test-data/features/registration/establishment/base/test-data';
import { routerSpy } from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { getOwnerComponent } from '../../../register-proactive/components/register-proactive-sc/register-proactive-sc.component.spec';
import {
  Admin,
  ErrorCodeEnum,
  EstablishmentConstants,
  EstablishmentOwnersWrapper,
  EstablishmentRoutesEnum,
  EstablishmentTypeEnum,
  LegalEntityEnum,
  Owner
} from '../../../shared';
import { menuStub } from '../../../shared/common-stub.spec';
import {
  EmployeeDetailsDcComponent,
  EstablishmentDetailsFormDCComponent,
  EstablishmentOwnersDcComponent,
  FeedbackDcComponent,
  PaymentDetailsDcComponent,
  ScanDocumentsDcComponent,
  SearchEmployeeDcComponent
} from '../../../shared/components';
import { AddEstablishmentService, EstablishmentAdminService, EstablishmentService } from '../../../shared/services';
import { initialiseStateForEdit } from './register-establishment-helper';
import { RegisterEstablishmentScComponent } from './register-establishment-sc.component';

const establishmentStubToken: EstablishmentRouterData = {
  ...genericRouteData,
  flagId: undefined,
  ...{
    registrationNo: undefined, //give a value in the required tests to enable edit transacion state
    user: 'sabin',
    referenceNo: genericEstablishmentResponse.registrationNo,
    setRouterDataToEstablishmenRouterData: () => {},
    resetRouterData: () => {},
    fromJsonToObject: () => {
      return undefined;
    },
    channel: Channel.FIELD_OFFICE
  },
  inspectionId: undefined,
  ...{
    resourceType: RouterConstants.TRANSACTION_REGISTER_ESTABLISHMENT
  }
};
export const locationStub = {
  back: jasmine.createSpy('back')
};

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
  }
}

export class StubbedModalService {
  public show(): void {}
}

describe('RegisterEstablishmentScComponent', () => {
  let component: RegisterEstablishmentScComponent;

  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
  let fixture: ComponentFixture<RegisterEstablishmentScComponent>;

  //configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'home/establishment/refresh',
            component: DummyComponent
          }
        ]),
        HttpClientTestingModule
      ],
      declarations: [
        ...FIELDOFFICE_MOCK_COMPONENTS,
        RegisterEstablishmentScComponent,
        FeedbackDcComponent,
        ProgressWizardDcMockComponent,
        OwnerMockComponent,
        PaymentDetailsMockDcComponent,
        EStablishmentDetailsFormMOckDcComponent
      ],
      providers: [
        { provide: BsModalService, useClass: StubbedModalService },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        {
          provide: AddEstablishmentService,
          useClass: AddEstablishmentServiceStub
        },
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        {
          provide: EstablishmentAdminService,
          useClass: EstablishmentAdminServiceStub
        },
        {
          provide: StorageService,
          useClass: StorageServiceStub
        },
        {
          provide: DocumentService,
          useClass: DocumentServiceStub
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        {
          provide: EstablishmentOwnersDcComponent,
          useClass: OwnerMockComponent
        },
        {
          provide: PaymentDetailsDcComponent,
          useClass: PaymentDetailsMockDcComponent
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: EstablishmentDetailsFormDCComponent,
          useClass: EStablishmentDetailsFormMOckDcComponent
        },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: EstablishmentToken, useValue: establishmentStubToken },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        menuStub,
        { provide: Location, useValue: locationStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterEstablishmentScComponent);
    activatedRoute.setParamMap({ registrationNumber: 987654321, currentTab: 2 });
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ng on init', () => {
    it('should initialize component', () => {
      component.addEstablishmentService.verifiedEstablishment = bindToObject(
        new Establishment(),
        establishmentTestData[2]
      );
      component.estRouterData.registrationNo = undefined;
      component.ngOnInit();
      expect(component.editEstablishment).toBe(false);
    });
    it('should initialize component gcc establishment', () => {
      component.addEstablishmentService.verifiedEstablishment = bindToObject(
        new Establishment(),
        establishmentTestData[1]
      );
      component.estRouterData.registrationNo = undefined;
      component.estRouterData.tabIndicator = undefined;
      component.ngOnInit();
      expect(component.editEstablishment).toBe(false);
    });
    it('should initialize component with edit transaction state', () => {
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.tabIndicator = 1;
      component.ngOnInit();
      expect(component.editEstablishment).toBe(true);
    });
    it('should handle get establishment error', () => {
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.tabIndicator = 1;
      spyOn(component, 'showErrorMessage');
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
      component.ngOnInit();
      expect(component.editEstablishment).toBe(true);
      expect(component.showErrorMessage).toHaveBeenCalled();
    });
    it('should navigate back under exceptio', () => {
      component.estRouterData.tabIndicator = undefined;
      component.addEstablishmentService.verifiedEstablishment = undefined;
      component.ngOnInit();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VERIFY_REG_ESTABLISHMENT]);
    });
  });
  describe('Initialise the verified establishment', () => {
    it('unset owner tab for gcc establishment other than org and society', () => {
      const orgIntEst: Establishment = {
        ...genericEstablishmentResponse,
        gccCountry: true,
        legalEntity: { english: LegalEntityEnum.SOCIETY, arabic: '' }
      };
      component.gccCountryList$ = of(new LovList([]));
      component.initialiseForVerifiedEstablishment(orgIntEst);
      expect(component.isOrgGcc).toBe(true);
    });
    it('set owner tab for gcc establishment other than org and society', () => {
      component.gccCountryList$ = of(new LovList([]));
      const orgIntEst: Establishment = {
        ...genericEstablishmentResponse,
        gccCountry: true,
        legalEntity: { english: LegalEntityEnum.INDIVIDUAL, arabic: '' }
      };
      component.initialiseForVerifiedEstablishment(orgIntEst);
      expect(component.isIndividual).toBe(true);
    });
    it('and a branch having admin for main should not show admin tab', () => {
      const branchEst: Establishment = {
        ...genericEstablishmentResponse,
        gccCountry: false,
        establishmentType: { english: EstablishmentTypeEnum.BRANCH, arabic: '' },
        legalEntity: { english: LegalEntityEnum.ORG_REGIONAL, arabic: '' }
      };
      component.addEstablishmentService.hasAdminForMain = true;
      component.initialiseForVerifiedEstablishment(branchEst);
      expect(component.totalTabs).toBe(EstablishmentConstants.TABS_NO_WITHOUT_ADMIN);
    });
  });

  describe('reset child component forms', () => {
    it('reset the admin form ', () => {
      component.establishmentAdminComp = TestBed.createComponent(PersonDetailsStubComponent)
        .componentInstance as EmployeeDetailsDcComponent;
      spyOn(component.establishmentAdminComp, 'resetPersonDetailsForm');
      component.verifyAdminStatus = true;
      component.resetAdminForm();
      expect(component.verifyAdminStatus).toBe(false);
      expect(component.establishmentAdminComp.resetPersonDetailsForm).toHaveBeenCalled();
    });
    it('reset the verify admin form ', () => {
      component.searchAdminComponent = TestBed.createComponent(SearchPersonStubComponent)
        .componentInstance as SearchEmployeeDcComponent;
      component.searchAdminComponent.submitted = true;
      component.resetVerifyAdminForm();
      expect(component.searchAdminComponent.submitted).toBe(false);
    });
    it('reset the establishment details form ', () => {
      component.establishmentDetailsComp = TestBed.createComponent(EStablishmentDetailsFormMOckDcComponent)
        .componentInstance as EstablishmentDetailsFormDCComponent;
      spyOn(component.establishmentDetailsComp, 'resetEstablishmentDetailsForm');
      component.resetEstablishmentsForm();
      expect(component.establishmentDetailsComp.resetEstablishmentDetailsForm).toHaveBeenCalled();
    });
    it('reset the payent details form ', () => {
      component.paymentDetailsComp = TestBed.createComponent(PaymentDetailsMockDcComponent)
        .componentInstance as PaymentDetailsDcComponent;
      spyOn(component.paymentDetailsComp, 'resetPaymentDetailsForm');
      component.resetPaymentForm();
      expect(component.paymentDetailsComp.resetPaymentDetailsForm).toHaveBeenCalled();
    });
    it('reset the owner details form ', () => {
      component.ownerComponent = TestBed.createComponent(OwnerMockComponent)
        .componentInstance as EstablishmentOwnersDcComponent;
      spyOn(component.ownerComponent, 'resetOwnerForm');
      component.resetOwnerForm(0);
      expect(component.ownerComponent.resetOwnerForm).toHaveBeenCalled();
    });
    it('reset the scan documents form ', () => {
      component.scanDocsComp = TestBed.createComponent(ScanDocumentsStubComponent)
        .componentInstance as ScanDocumentsDcComponent;
      spyOn(component.scanDocsComp, 'resetDocuments');
      component.resetScanDocumentForm();
      expect(component.scanDocsComp.resetDocuments).toHaveBeenCalled();
    });
  });
  describe('set conditional checks', () => {
    it('should set the establishment state for validator to edit', () => {
      component.establishment = new Establishment();
      component.establishment.establishmentAccount = new EstablishmentPaymentDetails();
      component.ownerComponent = getOwnerComponent();
      initialiseStateForEdit(bindToObject(new Establishment(), establishmentTestData[2]), 1, component).subscribe(
        () => expect(component.gccEstablishment).toBeTruthy(),
        noop
      );
      expect(component.hasInitialised).toBeTruthy();
    });

    it('should set the submitted value false', () => {
      component.ownerComponent = getOwnerComponent();
      component.setSubmittedFalse(0);
      expect(component.ownerComponent.employeeComponent[0].submitted).toBeFalsy();
    });
    it('should set the establishment state for validator and fetch owner', done => {
      component.withOwner = false;
      component.establishment = new Establishment();
      const estOwner = new EstablishmentOwnersWrapper();
      const owners: Owner[] = [];
      const owner = new Owner();
      owner.person = bindToObject(new Person(), verifyOwnerResponse);
      owners.push(owner);
      estOwner.owners = owners;
      spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(of(estOwner));
      spyOn(component.establishmentService, 'getSuperAdminDetails').and.returnValue(of(genericAdminResponse));
      initialiseStateForEdit(bindToObject(new Establishment(), establishmentTestData[2]), 1, component).subscribe(
        () => {
          expect(component.withOwner).toBeTruthy();
          done();
        },
        () => {
          //console.log('error');
        }
      );
    });
    it('should set the establishment state for validator  and owner throw some errror', () => {
      component.withOwner = true;
      spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(throwError(mockError));
      spyOn(component.establishmentService, 'getSuperAdminDetails').and.returnValue(throwError(mockError));
      spyOn(component.alertService, 'showError');
      component.establishment = new Establishment();
      initialiseStateForEdit(bindToObject(new Establishment(), establishmentTestData[2]), 1, component).subscribe(
        noop,
        () => {
          expect(component.alertService.showError).toHaveBeenCalled();
        }
      );
    });
    it('should handle owner and admin not found error', () => {
      component.withOwner = true;
      spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(throwError(getOwnerError));
      spyOn(component.establishmentService, 'getSuperAdminDetails').and.returnValue(throwError(adminNotFoundError));
      component.establishment = new Establishment();
      initialiseStateForEdit(bindToObject(new Establishment(), establishmentTestData[2]), 1, component).subscribe(
        noop,
        () => {
          expect((component.withOwner = false)).toBeFalsy();
        }
      );
    });
    it('handle if establishment response is null or undefined', () => {
      initialiseStateForEdit(undefined, 1, component);
      expect(component.verifyEstStatus).not.toBe(true);
    });
    it('if branch establishment and admin is of main then dont show admin section', () => {
      const branchEstWithoutAdmin: Establishment = { ...branchGenericEstablishment, adminRegistered: false };
      initialiseStateForEdit(branchEstWithoutAdmin, 1, component).subscribe(() => {
        expect(component.hasAdmin).toBe(false);
      });
    });
    it('if gcc establishment legal entity Org International then no owner section', () => {
      const orgIntEst: Establishment = {
        ...genericEstablishmentResponse,
        gccCountry: true,
        legalEntity: { english: LegalEntityEnum.ORG_REGIONAL, arabic: '' }
      };
      initialiseStateForEdit(orgIntEst, 1, component).subscribe(() => {
        expect(component.isOrgGcc).toBe(true);
      });
    });
    it('if gcc establishment legal entity society then no owner section', () => {
      const orgIntEst: Establishment = {
        ...genericEstablishmentResponse,
        gccCountry: true,
        legalEntity: { english: LegalEntityEnum.SOCIETY, arabic: '' }
      };
      initialiseStateForEdit(orgIntEst, 1, component).subscribe(() => {
        expect(component.isOrgGcc).toBe(true);
      });
    });
    it('if gcc establishment legal entity other than society and org internation then get owners and handle no owner exception', () => {
      const orgIntEst: Establishment = {
        ...genericEstablishmentResponse,
        gccCountry: true,
        legalEntity: { english: LegalEntityEnum.PARTNERSHIP, arabic: '' }
      };
      const noOwnerError = { ...genericError };
      noOwnerError.error.code = ErrorCodeEnum.OWNER_NO_RECORD;
      spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(throwError(noOwnerError));
      initialiseStateForEdit(orgIntEst, 1, component).subscribe(noop, () => {
        expect(component.establishmentService.getOwnerDetails).toHaveBeenCalled();
        expect(component.withOwner).toBe(false);
      });
    });
    it('if gcc establishment legal entity other than society and org internation then get owners and handle unknown errors ', () => {
      const orgIntEst: Establishment = {
        ...genericEstablishmentResponse,
        gccCountry: true,
        legalEntity: { english: LegalEntityEnum.PARTNERSHIP, arabic: '' }
      };
      spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(throwError(genericError));
      spyOn(component.establishmentService, 'getSuperAdminDetails').and.returnValue(of(new Admin()));
      initialiseStateForEdit(orgIntEst, 1, component).subscribe(noop, () => {
        expect(component.establishmentService.getOwnerDetails).toHaveBeenCalled();
      });
    });
  });

  describe('reset all forms', () => {
    it('should reset all the child forms', () => {
      spyOn(component, 'resetEstablishmentsForm');
      spyOn(component, 'resetAdminForm');
      spyOn(component, 'resetVerifyAdminForm');
      spyOn(component, 'resetPaymentForm');
      spyOn(component, 'resetScanDocumentForm');
      component.resetAllForms();
      expect(component.resetEstablishmentsForm).toHaveBeenCalled();
      expect(component.resetAdminForm).toHaveBeenCalled();
      expect(component.resetVerifyAdminForm).toHaveBeenCalled();
      expect(component.resetPaymentForm).toHaveBeenCalled();
      expect(component.resetScanDocumentForm).toHaveBeenCalled();
    });
  });
  describe('set Values', () => {
    it('should set Values', () => {
      component.setValues();
      expect(component.isAccountSaved).toBeTruthy();
    });
  });
  describe('trigger Owner Validation', () => {
    it('should trigger Owner Validation', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.triggerOwnerValidation();
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
  });
  describe('final Form', () => {
    it('should final Form', () => {
      component.finalForm();
      expect(component.currentTab).toBe(component.totalTabs - 1);
    });
  });
  describe('call child component functionalities', () => {
    it('should verify admin', () => {
      spyOn(component, 'triggerFormValidation');
      component.verifyAdmin(null);
      expect(component.triggerFormValidation).toHaveBeenCalledTimes(1);
    });
    it('should save the establishment details', () => {
      spyOn(component, 'triggerFormValidation');
      component.saveEstablishment(null);
      expect(component.triggerFormValidation).toHaveBeenCalledTimes(1);
    });
    it('should save the payment details', () => {
      spyOn(component, 'triggerFormValidation');
      component.savePaymentDetails(bankPaymentDetails);
      expect(component.triggerFormValidation).toHaveBeenCalledTimes(1);
    });
    it('should verify Owner details', () => {
      spyOn(component, 'triggerFormValidation');
      component.verifyOwner(null);
      expect(component.triggerFormValidation).toHaveBeenCalledTimes(0);
    });
    it('should save establishment admin', () => {
      spyOn(component, 'triggerFormValidation');
      component.saveEstablishmentAdminDetails(null);
      expect(component.triggerFormValidation).toHaveBeenCalledTimes(1);
    });
    it('should navigate to first form', () => {
      component.resetToFirstForm();
      expect(component.currentTab).toBe(0);
    });
    it('should save establishment admin', () => {
      component.selectWizard(0);
      expect(component.currentTab).toBe(0);
    });
    it('should cancel transaction and navigate to verify', () => {
      component.editEstablishment = false;
      component.cancelForm();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VERIFY_REG_ESTABLISHMENT]);
    });
    it('should cancel transaction and navigate to verify', () => {
      component.editEstablishment = true;
      component.establishment = new Establishment();
      component.establishment.registrationNo = 343243243;
      spyOn(component.addEstablishmentService, 'cancelTransaction').and.returnValue(
        of(bindToObject(new Establishment(), establishmentTestData[0]).registrationNo)
      );
      component.cancelForm();
      expect(component.addEstablishmentService.cancelTransaction).toHaveBeenCalled();
    });
    it('should navigate to next form', () => {
      component.currentTab = 1;
      component.totalTabs = 3;
      component.nextForm();
      expect(component.currentTab).toBe(2);
    });
    it('should navigate to previous form', () => {
      component.currentTab = 2;
      component.totalTabs = 3;
      component.previousForm();
      expect(component.currentTab).toBe(1);
    });
  });
  describe('trigger form Validation', () => {
    it('should trigger form Validation', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.triggerFormValidation();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('restrict progress bar', () => {
    it('should restrict progress bar ', () => {
      component.triggerRestrictions = true;
      spyOn(component.addEstablishmentService, 'restrictProgress');
      component.restrictProgressBar();
      expect(component.addEstablishmentService.restrictProgress).toHaveBeenCalled();
    });
  });
});
