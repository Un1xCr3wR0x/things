/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  bindToObject,
  DocumentItem,
  DocumentService,
  EnvironmentToken,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  GccCountryEnum,
  LanguageToken,
  LookupService,
  MenuService,
  Role,
  RouterConstants,
  TransactionFeedback,
  TransactionReferenceData,
  updateValidation,
  WorkflowService,
  AuthTokenService
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  BilingualTextPipeMock,
  ChangeEstablishmentServiceStub,
  documentItem,
  documentResponseItemList,
  DocumentServiceStub,
  EstablishmentStubService,
  Forms,
  genericDocumentItem,
  genericError,
  genericEstablishmentResponse,
  genericEstablishmentRouterData,
  genericGccEstablishment,
  LookupServiceStub,
  ModalServiceStub,
  transactionReferenceData,
  TranslateLoaderStub,
  WorkflowServiceStub,
  AuthTokenServiceStub
} from 'testing';
import { ChangeEstablishmentService, DocumentNameEnum, EstablishmentService, GccStartDateEnum } from '../../../shared';
import {
  findDoc,
  getRequiredDocument
} from '../change-legal-entity-details-sc/change-legal-entity-details-sc.component.spec';
import { ChangeBasicDetailsScComponent } from './change-basic-details-sc.component';
import { handleBasicDetailsDocuments } from './change-basic-helper';
export const routerSpy = { url: '', navigate: jasmine.createSpy('navigate') };
const httpSpy = { get: jasmine.createSpy('get'), post: jasmine.createSpy('post') };

export const commonImports = [
  TranslateModule.forRoot({
    loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
  }),
  HttpClientTestingModule,
  RouterTestingModule
];

export const commonProviders = [
  {
    provide: HttpClient,
    useValue: httpSpy
  },
  {
    provide: MenuService,
    useValue: {
      getRoles() {
        return [];
      }
    }
  },

  {
    provide: Router,
    useValue: routerSpy
  },
  {
    provide: AuthTokenService,
    useClass: AuthTokenServiceStub
  },
  {
    provide: EstablishmentService,
    useClass: EstablishmentStubService
  },
  {
    provide: ChangeEstablishmentService,
    useClass: ChangeEstablishmentServiceStub
  },
  {
    provide: AlertService,
    useClass: AlertServiceStub
  },
  {
    provide: LookupService,
    useClass: LookupServiceStub
  },
  {
    provide: DocumentService,
    useClass: DocumentServiceStub
  },
  { provide: BsModalService, useClass: ModalServiceStub },
  { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
  FormBuilder,
  { provide: LanguageToken, useValue: new BehaviorSubject('en') },
  { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
  { provide: EstablishmentToken, useValue: new EstablishmentRouterData() },
  { provide: WorkflowService, useClass: WorkflowServiceStub },
  {
    provide: EnvironmentToken,
    useValue: "{'baseUrl':'localhost:8080/'}"
  }
];
describe('ChangeBasicDetailsScComponent', () => {
  let component: ChangeBasicDetailsScComponent;
  let fixture: ComponentFixture<ChangeBasicDetailsScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeBasicDetailsScComponent],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        ...commonProviders,
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBasicDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise the view', () => {
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_BASIC_DETAILS;
      component.estRouterData.taskId = 'abdchs';
      component.changeEstablishmentService.selectedEstablishment = undefined;
      spyOn(component, 'getEstablishmentWithWorkflowData');
      component.ngOnInit();
      expect(component.estRouterData.taskId).toEqual('abdchs');
    });
    it('should initialise view of selected establishment', () => {
      component.estRouterData.taskId = undefined;
      component.changeEstablishmentService.selectedEstablishment = bindToObject(
        new Establishment(),
        genericGccEstablishment
      );
      component.ngOnInit();
      expect(component.establishmentToChange.registrationNo).toBe(genericGccEstablishment.registrationNo);
    });
  });
  describe('get Establishment With Workflow Data', () => {
    it('should get  Establishment With Workflow Data', () => {
      spyOn(component, 'getAllComments').and.returnValue(
        of(bindToObject(new TransactionReferenceData(), transactionReferenceData))
      );
      spyOn(component.changeEstablishmentService, 'getEstablishmentFromTransient').and.returnValue(
        of(bindToObject(new Establishment(), genericEstablishmentResponse))
      );
      component.getEstablishmentWithWorkflowData(
        component.estRouterData,
        component.intialiseView,
        component.navigateToValidator
      );
      expect(component.establishmentToChange.registrationNo).toBe(genericEstablishmentResponse.registrationNo);
    });
  });
  describe('intialise View', () => {
    it('should intialise View', () => {
      component.isGcc = true;
      component.establishmentToChange.name = { english: 'abd', arabic: '' };
      component.establishmentToChange = bindToObject(new Establishment(), genericEstablishmentResponse);
      component.intialiseView();
      expect(component.establishmentToChange.registrationNo).toEqual(100011182);
    });
  });
  describe('navigate To  View', () => {
    it('should navigate To View', () => {
      spyOn((component as any).location, 'back');
      component.navigateToView();
      expect((component as any).location.back).toHaveBeenCalled();
    });
  });
  describe('navigate To  validator', () => {
    it('should navigate To validator', () => {
      spyOn(component.changeEstablishmentService, 'navigateToBasicDetailsValidator');
      component.navigateToValidator();
      expect(component.changeEstablishmentService.navigateToBasicDetailsValidator).toHaveBeenCalled();
    });
  });
  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.bsModalRef).not.toEqual(null);
    });
  });
  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.bsModalRef).not.toEqual(null);
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      component.hideModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      component.cancelModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });

  describe('update basic details', () => {
    it('should update basic details', () => {
      const forms = new Forms();
      component.editBasicDetailsForm = forms.createMockEditBasicDetailsForm();
      component.basicDetailsDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.basicDetailsDocuments.push(genericDocumentItem);
      }
      component.isValidator = true;
      component.registrationNo = genericGccEstablishment.registrationNo;
      spyOn(component.alertService, 'showSuccess');
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(of(null));
      component.updateBasicDetails();
      expect(component.alertService.showSuccess).toHaveBeenCalled();
    });
    it('should throw error when form is invalid', () => {
      const forms = new Forms();
      component.editBasicDetailsForm = forms.createMockEditBasicDetailsForm();
      component.registrationNo = genericGccEstablishment.registrationNo;
      updateValidation(component.editBasicDetailsForm.get('name').get('english') as FormControl, true);
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.basicDetailsDocuments = documents;
      component.isValidator = true;
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.updateBasicDetails();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
    it('should update basic details api error', () => {
      const forms = new Forms();
      component.isValidator = true;
      component.registrationNo = 12312312;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.editBasicDetailsForm = forms.createMockEditBasicDetailsForm();
      component.basicDetailsDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.basicDetailsDocuments.push(genericDocumentItem);
      }
      spyOn(component.changeEstablishmentService, 'updateEstablishmentBasicDetails').and.returnValue(
        throwError(genericError)
      );
      spyOn(component.alertService, 'showError');
      component.updateBasicDetails();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should update basic details not validator ', () => {
      const forms = new Forms();
      component.isValidator = false;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.editBasicDetailsForm = forms.createMockEditBasicDetailsForm();
      component.basicDetailsDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.basicDetailsDocuments.push(genericDocumentItem);
      }
      spyOn(component.changeEstablishmentService, 'updateEstablishmentBasicDetails').and.returnValue(
        of(new TransactionFeedback())
      );
      spyOn(component.location, 'back');
      component.updateBasicDetails();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe('bind document content', () => {
    it('should bind document content', () => {
      const document = new DocumentItem();
      spyOn(component.documentService, 'refreshDocument').and.returnValue(of(documentItem));
      component.bindDocContent(document);
      expect(component.documentService.refreshDocument).toHaveBeenCalled();
    });
  });

  describe('setGccStartDate', () => {
    beforeEach(() => {
      const forms = new Forms();
      component.editBasicDetailsForm = forms.createMockEditBasicDetailsForm();
    });
    it('should set min date for first set of gcc countries', () => {
      component.setGccStartDate(GccCountryEnum.OMAN);
      expect(component.minDate).toEqual(new Date(GccStartDateEnum.COUNTRIES1));
      component.setGccStartDate(GccCountryEnum.BAHRAIN);
      expect(component.minDate).toEqual(new Date(GccStartDateEnum.COUNTRIES1));
      component.setGccStartDate(GccCountryEnum.KUWAIT);
      expect(component.minDate).toEqual(new Date(GccStartDateEnum.COUNTRIES1));
      component.setGccStartDate(GccCountryEnum.UAE);
      expect(component.minDate).toEqual(new Date(GccStartDateEnum.COUNTRIES2));
      component.setGccStartDate(GccCountryEnum.QATAR);
      expect(component.minDate).toEqual(new Date(GccStartDateEnum.COUNTRIES2));
    });
  });
  describe('handle doc validations', () => {
    it('in field office for non gcc establishments', () => {
      const documents = [
        DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT,
        DocumentNameEnum.AUTH_DELEGATION_LETTER,
        DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT,
        DocumentNameEnum.NATIONAL_ID_IQAMA,
        DocumentNameEnum.OTHERS_DOCUMENT
      ].map(item => getRequiredDocument(item));
      handleBasicDetailsDocuments(documents, false, true, true, true);
      expect(findDoc(documents, DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT).show).toBeTruthy();
      expect(findDoc(documents, DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT).show).toBeFalsy();
    });
  });
  describe('cancel transaction', () => {
    beforeEach(() => {
      component.establishmentToChange = { ...genericEstablishmentResponse };
      (component as any).estRouterData = { ...genericEstablishmentRouterData };
    });
    it('by admin should call revert transaction and on sucess go to inbox if gosi online', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.estRouterData.assignedRole = Role.EST_ADMIN;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.callThrough();
      component.cancelBasicDetailsTransaction();
      expect(component.changeEstablishmentService.revertTransaction).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_TODOLIST]);
    });
    it('by admin should call revert transaction with reroute', () => {
      component.isValidator = true;
      component.reRoute = 'adf';
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.estRouterData.assignedRole = Role.EST_ADMIN;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.callThrough();
      component.cancelBasicDetailsTransaction();
      expect(component.changeEstablishmentService.revertTransaction).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith([component.reRoute]);
    });
    it('by validator should call revert transaction and on sucess go to validate bank if field office', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.callThrough();
      spyOn(component.changeEstablishmentService, 'navigateToBasicDetailsValidator');
      component.cancelBasicDetailsTransaction();
      expect(component.changeEstablishmentService.navigateToBasicDetailsValidator).toHaveBeenCalled();
    });
    it('by validator should call revert transaction api error', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.cancelBasicDetailsTransaction();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should go to profile if person is neither a validator nor an admin', () => {
      component.isValidator = false;
      spyOn(component, 'navigateToView');
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      component.cancelBasicDetailsTransaction();
      expect(component.navigateToView).toHaveBeenCalled();
    });
  });
});
