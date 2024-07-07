/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  bindToObject,
  Channel,
  DocumentItem,
  DocumentService,
  EnvironmentToken,
  Establishment,
  EstablishmentRouterData,
  EstablishmentStatusEnum,
  EstablishmentToken,
  LanguageToken,
  LookupService,
  Person,
  ProactiveStatusEnum,
  RouterConstants,
  StorageService,
  TransactionStatus,
  WorkFlowActions
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  BilingualTextPipeMock,
  crnData,
  crnDataWithoutOwner,
  deleteOwnerData,
  DocumentServiceStub,
  DummyProactiveComponent,
  EstablishmentAdminServiceStub,
  EstablishmentDetailsStubComponent,
  EstablishmentServiceStub,
  EstablishmentStubService,
  estNotFoundError,
  FIELDOFFICE_MOCK_COMPONENTS,
  genericCrnReponse,
  genericDocumentItem,
  genericError,
  genericEstablishmentResponse,
  genericOwnerReponse,
  genericPersonResponse,
  genericRouteData,
  LookupServiceStub,
  OwnerStubComponent,
  PaymentDetailsStubComponent,
  ScanDocumentsStubComponent,
  SearchPersonStubComponent,
  StorageServiceStub
} from 'testing';
import { ProactiveDetailsDcMockComponent } from 'testing/mock-components/features/registration/establishment/proactive';
import { AlertServiceStub } from 'testing/mock-services/core/alert-service-stub';
import { routerSpy } from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { getOwners } from '../../../change-establishment/components/change-owner-sc/change-owner-sc.component.spec';
import { activatedRouteStub } from '../../../profile/components/establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import {
  ActionTypeEnum,
  AddEstablishmentService,
  EstablishmentAdminService,
  EstablishmentConstants,
  EstablishmentOwnerDetails,
  EstablishmentOwnersDcComponent,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentWorkFlowStatus,
  LegalEntityEnum,
  OwnerResponse,
  SearchEmployeeDcComponent
} from '../../../shared';
import { menuStub } from '../../../shared/common-stub.spec';
import { ProactiveDetailsDcComponent } from '../proactive-details-dc/proactive-details-dc.component';
import {
  establishmentInWorkflow,
  legalEntityCheck,
  licenseChecks,
  resetCRNDetails,
  saveAllOwners,
  searchEstablishment,
  setSearchOwnerState
} from './register-proactive-helper';
import { RegisterProactiveScComponent } from './register-proactive-sc.component';
import { docList, molEstablishment, paymentDetails, searchEstablishmentResponse } from './test-data';

export const locationStub = {
  back: () => {}
};

const proactiveStubToken: EstablishmentRouterData = {
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
    channel: Channel.GOSI_ONLINE
  },
  ...{
    resourceType: RouterConstants.TRANSACTION_REGISTER_ESTABLISHMENT
  },
  inspectionId: undefined
};
export class StubbedModalService {
  public show(): void {}
}

describe('RegisterProactiveScComponent', () => {
  let component: RegisterProactiveScComponent;
  let fixture: ComponentFixture<RegisterProactiveScComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          {
            path: EstablishmentRoutesEnum.REFRESH,
            component: DummyProactiveComponent
          }
        ]),
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      declarations: [RegisterProactiveScComponent, ProactiveDetailsDcMockComponent, ...FIELDOFFICE_MOCK_COMPONENTS],
      providers: [
        menuStub,
        { provide: BsModalService, useClass: StubbedModalService },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        {
          provide: AddEstablishmentService,
          useClass: EstablishmentServiceStub
        },
        {
          provide: EstablishmentAdminService,
          useClass: EstablishmentAdminServiceStub
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
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
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: EstablishmentToken, useValue: proactiveStubToken },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: Location, useValue: locationStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterProactiveScComponent);
    component = fixture.componentInstance;
    component.proactiveEstComp = TestBed.createComponent(ProactiveDetailsDcMockComponent)
      .componentInstance as ProactiveDetailsDcComponent;
    component.paymentComp = TestBed.createComponent(PaymentDetailsStubComponent).componentInstance as any;
    component.scanDocsComp = TestBed.createComponent(ScanDocumentsStubComponent).componentInstance as any;
    component.ownerComponent = TestBed.createComponent(OwnerStubComponent).componentInstance as any;
    component.establishmentDetailsComp = TestBed.createComponent(EstablishmentDetailsStubComponent)
      .componentInstance as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should intialise the component', () => {
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      component.ngOnInit();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
    });
  });

  describe('Admin Renter', () => {
    beforeEach(() => {
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.taskId = 'dummy-taskId';
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_PROACTIVE_FEED;
      component.estRouterData.previousOutcome = WorkFlowActions.RETURN;
    });
    it('should initiailse the state', () => {
      component.ngOnInit();
      expect(component.editEstablishment).toBeTruthy();
    });
    it('should filter the legal entity list without individual', () => {
      component.filterIndividualLegalEntity();
      component.legalEntityLovList$.subscribe(list => {
        expect(list.items.map(entry => entry.value.english)).not.toContain(LegalEntityEnum.INDIVIDUAL);
      });
    });
    it('verify crn wih MCI', () => {
      const crnNumber = new Number(8796878979);
      component.proactiveEstComp = TestBed.createComponent(ProactiveDetailsDcMockComponent)
        .componentInstance as ProactiveDetailsDcComponent;
      component.proactiveEstComp.establishmentForm.get('crn').get('number').setValue(8796878979);
      component.establishment = genericEstablishmentResponse;
      component.verifyCRNNumber(crnNumber.toString());
      expect(component.isLegalEntityPresent).toBeTruthy();
    });
    it('should set the owner details', () => {
      component.establishmentOwner = new EstablishmentOwnerDetails();
      component.establishmentOwner.persons.push({
        ...new Person(),
        ...{
          personId: genericOwnerReponse.person.personId,
          fromJsonToObject: () => {
            return undefined;
          }
        }
      });
      component.ownerComponent = getOwnerComponent();
      component.setOwnerDetails([genericOwnerReponse.person]);
      expect(component.establishmentOwner.persons[0].personId).toBe(genericOwnerReponse.person.personId);
    });
    it('verify the birth date', fakeAsync(() => {
      component.ownerComponent = getOwnerComponent();
      component.verifyBirthDate(0);
      tick(500);
      expect(component.ownerComponent.searchEmployeeComponent[0].isDateRequired).toBeTruthy();
    }));
    it('set employee component submitted false', () => {
      component.ownerComponent = getOwnerComponent();
      component.setSubmittedFalse(0);
      expect(component.ownerComponent.employeeComponent[0].submitted).toBeFalsy();
    });
  });

  describe('fetch establishment details ', () => {
    it('should fetch the establishment with given registration number', () => {
      const est: Establishment = {
        ...new Establishment(),
        status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' },
        proactiveStatus: ProactiveStatusEnum.PENDING_MOL_OR_MCI
      };
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(est));
      spyOn(component.establishmentService, 'getEstablishmentFromTransient');
      component.editEstablishment = false;
      component.registrationNumber.setValue(molEstablishment.registrationNo);
      searchEstablishment(component, molEstablishment.registrationNo).subscribe(res => {
        expect(component.establishmentService.getEstablishmentFromTransient).not.toHaveBeenCalled();
        expect(res).toBeTrue();
        // expect(isEstRegPending(component.establishment)).toBe(true);
      });
    });
    it('should fetch establishment details', () => {
      const est: Establishment = {
        ...new Establishment(),
        status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' },
        proactiveStatus: ProactiveStatusEnum.PENDING_MOL_OR_MCI
      };
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(est));
      component.editEstablishment = false;
      spyOn(component.establishmentService, 'getEstablishmentFromTransient');
      searchEstablishment(component, molEstablishment.registrationNo).subscribe(res => {
        expect(component.establishmentService.getEstablishmentFromTransient).not.toHaveBeenCalled();
        expect(res).toBeTrue();
        // expect(isEstRegPending(component.establishment)).toBe(true);
      });
    });
    it('should fetch establishment for validator edit ', () => {
      const est: Establishment = {
        ...new Establishment(),
        status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' },
        proactiveStatus: ProactiveStatusEnum.PENDING_MOL_OR_MCI
      };
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(est));
      spyOn(component.establishmentService, 'getEstablishmentFromTransient').and.returnValue(of(est));
      component.editEstablishment = true;
      component.estRouterData.registrationNo = 1235;
      searchEstablishment(component, molEstablishment.registrationNo).subscribe(res => {
        expect(res).toBeTrue();
        expect(component.establishmentService.getEstablishmentFromTransient).toHaveBeenCalled();
      });
    });
    it('navigate away if api fails', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(estNotFoundError));
      searchEstablishment(component, molEstablishment.registrationNo).subscribe(() => {
        expect(component.router.navigate).toHaveBeenCalled();
      });
    });
    it('should save the establishment details', () => {
      spyOn(component.establishmentDetailsComp, 'isValidForm').and.returnValue(false);
      spyOn(component, 'triggerFormValidation').and.callThrough();
      component.saveEstablishment(searchEstablishmentResponse);
      expect(component.triggerFormValidation).toHaveBeenCalled();
    });
  });
  describe('fetch establishment details with crn', () => {
    it('should throw error', () => {
      component.establishment = new Establishment();
      component.proactiveEstComp.establishmentForm.get('crn').get('number').setValue(genericCrnReponse?.number);
      spyOn(component.establishmentService, 'verifyWithMciService').and.returnValue(throwError(genericError));
      component.verifyCRNNumber(new Number(genericCrnReponse?.number)?.toString());
      expect(component.establishment?.crn).toBeNull();
    });
  });
  describe('save crn details', () => {
    it('should save establishemnt details', () => {
      component.saveCRNDetails(crnData);
      expect(component.establishment.crn.number).toBeDefined();
    });
    describe('save CRN Details', () => {
      it('should save crn details', () => {
        component.saveCRNDetails(crnData);
        expect(component.isEstablishmentFromMci).toEqual(true);
      });

      it('should save crn details with legal entity corresponding to no owner', () => {
        component.saveCRNDetails(crnDataWithoutOwner);
        expect(component.isEstablishmentFromMci).toEqual(true);
      });
    });
  });
  describe('save establishment details', () => {
    it('should save the payment fom', () => {
      spyOn(component.paymentComp, 'isFormsValid').and.returnValue(true);
      component.savePaymentDetails(paymentDetails);
      expect(component.establishment.establishmentAccount.paymentType).toBeDefined();
    });
    it('should throw error at payment form', () => {
      spyOn(component.paymentComp, 'isFormsValid').and.returnValue(false);
      spyOn(component, 'triggerFormValidation').and.callThrough();
      component.savePaymentDetails(paymentDetails);
      expect(component.triggerFormValidation).toHaveBeenCalled();
    });

    it('submit documents', () => {
      const comments: any = 'comment';
      spyOn(component, 'isValidForm').and.callThrough();
      component.submitDocument(comments);
      expect(component.isValidForm).toHaveBeenCalled();
    });
    it('submit fail documents', () => {
      const comments: any = 'comment';
      component.isUploadValid = false;
      const documentFailed: DocumentItem = {
        ...genericDocumentItem,
        uploadFailed: true,
        required: true,
        documentContent: null,
        fromJsonToObject: () => undefined
      };
      (component.scanDocsComp as any) = { documentList: [documentFailed] };
      component.documentList = [documentFailed];
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.submitDocument(comments);
      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
    it('should validate documnent list', () => {
      component.isValidForm(docList);
      expect(component.isUploadValid).toBe(false);
    });
  });
  describe('Set owners', () => {
    it('should set owners', () => {
      component.currentTab = 3;
      component.isOwnerRequired = true;
      component.setOwnerDetails([bindToObject(new Person(), deleteOwnerData)]);
      expect(component.ownerIndex.length).toBe(1);
    });
  });

  describe('navigate and parent method invocations', () => {
    it('should navigate to previous form', () => {
      component.currentTab = 4;
      component.previousForm();
      expect(component.currentTab).toBe(3);
    });
    it('should select wizard', () => {
      component.selectWizard(0);
      expect(component.currentTab).toBe(1);
    });
    it('should reset to first form', () => {
      component.resetToFirstForm();
      expect(component.currentTab).toBe(0);
    });
    it('should go to final form', () => {
      component.totalTabs = 2;
      component.finalForm();
      expect(component.currentTab).toBe(1);
    });
    it('should crn form', () => {
      component.resetCRNDetailsForm();
      expect(component.establishment.crn.number).toBe(undefined);
    });
    it('should reset establishment form', () => {
      spyOn(component.establishmentDetailsComp, 'resetEstablishmentDetailsForm').and.callThrough();
      component.resetEstablishmentsForm();
      expect(component.establishmentDetailsComp.resetEstablishmentDetailsForm).toHaveBeenCalled();
    });

    describe('Cancel', () => {
      it('should navigate back if no values are saved', () => {
        component.editEstablishment = false;
        spyOn(component.location, 'back');
        component.cancelForm();
        expect(component.location.back).toHaveBeenCalled();
      });
      it('should go to inbox if admin re-enters', fakeAsync(() => {
        component.editEstablishment = true;
        component.establishment = new Establishment();
        component.establishment.registrationNo = 100011182;
        component.establishment.transactionTracingId = 654138;
        spyOn(component.establishmentService, 'revertTransaction').and.returnValue(of(null));
        component.cancelForm();
        tick(100);
        expect(component.establishmentService.revertTransaction).toHaveBeenCalled();
        expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_TODOLIST]);
      }));
      it('should call revert transaction api if values are saved and reference no is generated', () => {
        component.establishment = new Establishment();
        component.editEstablishment = true;
        component.establishment.registrationNo = 100011182;
        component.establishment.transactionTracingId = 654138;
        spyOn(component.establishmentService, 'revertTransaction').and.returnValue(of(null));
        component.cancelForm();
        expect(component.establishmentService.revertTransaction).toHaveBeenCalled();
        expect(component.router.navigate).toHaveBeenCalledWith([
          EstablishmentConstants.ROUTE_TO_INBOX(ApplicationTypeEnum.PUBLIC)
        ]);
      });
    });
    describe('reset crn details ', () => {
      it('it should reset crn details', () => {
        component.establishment = new Establishment();
        resetCRNDetails(component);
        expect(component.establishment.crn).toBeNull();
      });
    });

    it('should reset owner form', () => {
      component.currentTab = 3;
      component.isOwnerRequired = true;
      component.verifyPersonStatus.push(true);
      spyOn(component.ownerComponent, 'resetOwnerForm');
      component.resetOwnerForm(0);
      expect(component.ownerComponent.resetOwnerForm).toHaveBeenCalled();
    });

    it('should trigger alert', () => {
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      component.triggerFormValidation();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
    });
  });

  describe('Save All Owners', () => {
    it('Track all the changes done to owners', () => {
      component.proactiveEstowners = getOwners(genericOwnerReponse, [
        null,
        ActionTypeEnum.MODIFY,
        ActionTypeEnum.REMOVE
      ]);
      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(of(new OwnerResponse()));
      saveAllOwners(component).subscribe(res => {
        expect(res).toBeDefined();
      });
    });
  });

  describe('Save all owners', () => {
    beforeEach(() => {
      component.establishment = {
        ...genericEstablishmentResponse,
        legalEntity: { english: LegalEntityEnum.PARTNERSHIP, arabic: '' }
      };
      component.proactiveEstowners = getOwners(genericOwnerReponse, [
        null,
        ActionTypeEnum.MODIFY,
        ActionTypeEnum.REMOVE
      ]);
    });
    it('should validate all the owners', () => {
      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(of(new OwnerResponse()));
      component.ownerIndex = [0];
      component.checkOwnervalidation();
      expect(component.currentTab).toBe(1);
    });
    it('should got to next form if there are only owners from feed', () => {
      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(of(new OwnerResponse()));
      component.proactiveEstowners = getOwners(genericOwnerReponse, [null]);
      component.ownerIndex = [0];
      spyOn(component, 'nextForm');
      component.checkOwnervalidation();
      expect(component.nextForm).toHaveBeenCalled();
    });
    it('should trigger form validation error', () => {
      spyOn(component, 'triggerFormValidation');
      component.ownerIndex = [];
      component.checkOwnervalidation();
      expect(component.triggerFormValidation).toHaveBeenCalled();
    });
    it('should throw error', () => {
      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.ownerIndex = [0];
      component.checkOwnervalidation();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should go to next page if the establishment does not have an owner', () => {
      component.establishment.legalEntity.english = LegalEntityEnum.GOVERNMENT;
      spyOn(component, 'nextForm');
      component.ownerIndex = [];
      component.checkOwnervalidation();
      expect(component.nextForm).toHaveBeenCalled();
    });
  });

  describe('Trigger Owner Validations', () => {
    it('should throw error', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.triggerOwnerValidation();
      expect(component.alertService.showErrorByKey).toHaveBeenCalledWith('ESTABLISHMENT.ERROR.SAVE-OWNER');
    });
  });

  describe('Reset payment form', () => {
    it('should reset the payment form', () => {
      // component.paymentComp = (PaymentDetailsStubComponent as any) as PaymentDetailsDcComponent;
      component.paymentComp.submitted = true;
      component.paymentComp.paymentDetailsForm = new FormGroup({ name: new FormControl() });
      component.resetPaymentForm();
      expect(component.paymentComp.submitted).toBe(false);
    });
  });

  describe(' Reset Owner Details', () => {
    it('should reset the owner forms', () => {
      component.establishmentOwner = new EstablishmentOwnerDetails();
      component.establishmentOwner.persons = [genericPersonResponse];
      // component.ownerComponent = getOwnerComponent();
      component.ownerComponent.employeeComponent = null;
      spyOn(component.ownerComponent, 'resetOwnerForm');
      spyOn(component.ownerComponent, 'createPersonForm');
      component.resetAllOwnerDetails();
      expect(component.ownerComponent.resetOwnerForm).not.toHaveBeenCalled();
      expect(component.ownerComponent.createPersonForm).toHaveBeenCalled();
    });
  });

  describe('Check for establishment in workflow', () => {
    it('and return false if there are no workflow pending', () => {
      spyOn(component.establishmentService, 'getWorkflowsInProgress').and.returnValue(of([]));
      establishmentInWorkflow(component, genericEstablishmentResponse.registrationNo).subscribe(res => {
        expect(res).toBe(false);
      });
    });
    it('and return false if there is api failure', () => {
      spyOn(component.establishmentService, 'getWorkflowsInProgress').and.returnValue(throwError(genericError));
      establishmentInWorkflow(component, genericEstablishmentResponse.registrationNo).subscribe(res => {
        expect(res).toBe(false);
      });
    });
    it('and return true if workflow status is approval pending', () => {
      spyOn(component.establishmentService, 'getWorkflowsInProgress').and.returnValue(
        of([{ status: TransactionStatus.APPROVAL_PENDING }] as Array<EstablishmentWorkFlowStatus>)
      );
      establishmentInWorkflow(component, genericEstablishmentResponse.registrationNo).subscribe(res => {
        expect(res).toBe(true);
      });
    });
    it('and return false if workflow status is not approval pending', () => {
      spyOn(component.establishmentService, 'getWorkflowsInProgress').and.returnValue(
        of([{ status: TransactionStatus.DRAFT }] as Array<EstablishmentWorkFlowStatus>)
      );
      establishmentInWorkflow(component, genericEstablishmentResponse.registrationNo).subscribe(res => {
        expect(res).toBe(false);
      });
    });
  });

  describe('Check License Details', () => {
    it('and if establishment has crn details then make license optional', () => {
      const crnEstablishment: Establishment = {
        ...genericEstablishmentResponse,
        crn: { number: 12354, issueDate: { gregorian: new Date(), hijiri: '' }, mciVerified: true }
      };
      licenseChecks(component, crnEstablishment);
      expect(component.isLicenseMandatory).toBeFalse();
    });
    it('and if establishment has no crn details and has license then disable license fields', () => {
      const establishmentWithLicense: Establishment = {
        ...genericEstablishmentResponse,
        license: {
          number: 12354,
          issueDate: { gregorian: new Date(), hijiri: '' },
          issuingAuthorityCode: { english: 'test', arabic: '' }
        },
        crn: null
      };
      licenseChecks(component, establishmentWithLicense);
      expect(component.disableLicense).toBeTrue();
      expect(component.disableLicenseExpiryDate).toBeFalse();
    });
    it('and if establishment has no crn details and has license then disable license fields and expiry', () => {
      const establishmentWithLicense: Establishment = {
        ...genericEstablishmentResponse,
        crn: null,
        license: {
          number: 12354,
          issueDate: { gregorian: new Date(), hijiri: '' },
          issuingAuthorityCode: { english: 'test', arabic: '' },
          expiryDate: { gregorian: new Date(), hijiri: '' }
        }
      };
      licenseChecks(component, establishmentWithLicense);
      expect(component.disableLicense).toBeTrue();
      expect(component.disableLicenseExpiryDate).toBeTrue();
    });
  });

  describe('Check legal entity of establishment', () => {
    it('if no crn and has individual legal entity then disable legal entity ', () => {
      const individualEstablishment: Establishment = {
        ...genericEstablishmentResponse,
        legalEntity: { english: LegalEntityEnum.INDIVIDUAL, arabic: '' },
        crn: null
      };
      legalEntityCheck(component, individualEstablishment);
      expect(component.disableLegalEntity).toBeTrue();
    });
  });
  describe('Render Owner Details', () => {
    it('should populate the values as label and hide reset button if admin reenters', () => {
      const searchCmp: SearchEmployeeDcComponent = new SearchPersonStubComponent() as SearchEmployeeDcComponent;
      setSearchOwnerState(searchCmp, { ...genericPersonResponse }, [], true, LegalEntityEnum.INDIVIDUAL);
      expect(searchCmp.submitted).toBeTrue();
      expect(searchCmp.hasPerson).toBeTrue();
    });
    it('and if admin is navigating for first time and  no owner is coming from MOL Feed then show verify button and fields for new owner', () => {
      const searchCmp: SearchEmployeeDcComponent = new SearchPersonStubComponent() as SearchEmployeeDcComponent;
      setSearchOwnerState(searchCmp, { ...genericPersonResponse }, [], false, LegalEntityEnum.PARTNERSHIP);
      expect(searchCmp.submitted).toBeFalse();
      expect(searchCmp.hasPerson).toBeFalse();
    });
    it('and if admin is navigating for first time and owner is coming from MOL Feed then also show values as labels and hide verify if person has required details', () => {
      const searchCmp: SearchEmployeeDcComponent = new SearchPersonStubComponent() as SearchEmployeeDcComponent;
      setSearchOwnerState(
        searchCmp,
        { ...genericPersonResponse },
        [genericPersonResponse.personId],
        false,
        LegalEntityEnum.INDIVIDUAL
      );
      expect(searchCmp.submitted).toBeTrue();
      expect(searchCmp.hasPerson).toBeTrue();
    });

    it('and if admin is navigating for first time and owners is coming from MOL Feed then also show values as labels and show verify if person doesnot have nationality or date of birth', () => {
      const searchCmp: SearchEmployeeDcComponent = new SearchPersonStubComponent() as SearchEmployeeDcComponent;
      const personHasNoNationality: Person = { ...genericPersonResponse, nationality: null };
      setSearchOwnerState(
        searchCmp,
        personHasNoNationality,
        [genericPersonResponse.personId],
        false,
        LegalEntityEnum.INDIVIDUAL
      );
      expect(searchCmp.submitted).toBeTrue();
      expect(searchCmp.hasPerson).toBeFalse();
    });
  });
});
export function getOwnerComponent(): EstablishmentOwnersDcComponent {
  const ownercomponent = {
    addOwnerForm: () => {},
    createPersonForm: () => {},
    employeeComponent: [
      {
        person: new Person(),
        isProActive: false,
        submitted: false,
        gccEstablishment: false
      }
    ],
    searchEmployeeComponent: [{ person: new Person(), hasPerson: false, isDateRequired: false, submitted: false }]
  };
  return ownercomponent as unknown as EstablishmentOwnersDcComponent;
}
