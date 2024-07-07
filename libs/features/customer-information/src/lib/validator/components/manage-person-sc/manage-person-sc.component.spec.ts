/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  bindToObject,
  Contributor,
  DocumentService,
  EstablishmentProfile,
  LookupService,
  Person,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  bankDetailsReponse,
  DocumentServiceStub,
  engagementResponse,
  genericError,
  genericPersonResponse,
  LookupServiceStub,
  ManagePersonServiceStub,
  ModalServiceStub,
  personResponse,
  transactionWorkflowList,
  WorkflowServiceStub,
  routerDataResponse
} from 'testing';
import { documentListItemArray } from 'testing/test-data/core/document-service';
import { ManagePersonConstants, ManagePersonService, PersonBankDetails } from '../../../shared';
import { CimRoutesEnum } from '../../../shared/enums';
import { ManagePersonScComponent } from './manage-person-sc.component';

describe('ManagePersonScComponent', () => {
  let component: ManagePersonScComponent;
  let fixture: ComponentFixture<ManagePersonScComponent>;

  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        BrowserDynamicTestingModule,
        ModalModule.forRoot()
      ],
      declarations: [ManagePersonScComponent],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        {
          provide: ManagePersonService,
          useClass: ManagePersonServiceStub
        },
        {
          provide: DocumentService,
          useClass: DocumentServiceStub
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData().fromJsonToObject(routerDataResponse)
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePersonScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetch contributor', () => {
    it('should throw active status error', () => {
      component.estRegistrationNo = 503346141;
      component.socialInsuranceNo = 11340962;
      component.modalRef = new BsModalRef();
      spyOn(component.validatorService, 'getEstablishmentProfile').and.returnValue(throwError(genericError));
      spyOn(component.validatorService, 'getWorkFlowDetails').and.returnValue(throwError(genericError));
      component.fetchContributorDetails();
      expect(component.estRegistrationNo).not.toBeNull();
    });
    it('should throw person error', () => {
      component.estRegistrationNo = 503346141;
      component.socialInsuranceNo = 11340962;
      spyOn(component.validatorService, 'fetchContributor').and.returnValue(throwError(genericError));
      spyOn(component, 'showApiErrorMessage');
      component.fetchContributorDetails();
      expect(component.showApiErrorMessage).toHaveBeenCalled();
    });
    it('should fetch contributor', () => {
      component.person = undefined;
      component.estRegistrationNo = 503346141;
      component.socialInsuranceNo = 11340962;
      component.modalRef = new BsModalRef();
      component.contributor = undefined;
      spyOn(component.validatorService, 'fetchContributor').and.returnValue(of(new Contributor()));
      spyOn(component.validatorService, 'getWorkFlowDetails').and.returnValue(of([]));
      spyOn(component.documentService, 'getDocuments').and.returnValue(of([]));
      component.fetchContributorDetails();
      expect(component.validatorService.getWorkFlowDetails).toHaveBeenCalled();
    });
  });

  describe('get iqama or border documents', () => {
    it('should get the iqama or border documents', () => {
      const key = 1123;
      const type = 'type';
      const id = 123;
      spyOn(component.documentService, 'getDocuments').and.returnValue(of(documentListItemArray));
      component.getIqamaOrBorderDocument(key, type, id);
      expect(component.documentService.getDocuments).toHaveBeenCalled();
    });
  });

  describe('fetch person', () => {
    it('should throw active status error', () => {
      component.person = new Person();
      component.person.personId = 135345132;
      const personRes = bindToModel(new Person(), personResponse);
      const bankRes = bindToModel(new PersonBankDetails(), bankDetailsReponse);
      spyOn(component.validatorService, 'getPerson').and.returnValue(of(personRes));
      spyOn(component.validatorService, 'getActiveStatus').and.returnValue(throwError(genericError));
      spyOn(component.validatorService, 'getBankDetails').and.returnValue(of(bankRes));
      spyOn(component.documentService, 'getDocuments').and.returnValue(of(documentListItemArray));
      component.fetchPersonDetails();
      expect(component.validatorService.getPerson).toHaveBeenCalled();
    });
    it('should throw person error', () => {
      component.person.personId = 135345132;
      spyOn(component.validatorService, 'getPerson').and.returnValue(throwError(genericError));
      spyOn(component, 'showApiErrorMessage');
      component.fetchPersonDetails();
      expect(component.showApiErrorMessage).toHaveBeenCalled();
    });
    it('should throw bank fetch error', () => {
      component.person.personId = 135345132;
      const personRes = bindToModel(new Person(), personResponse);
      spyOn(component.validatorService, 'getPerson').and.returnValue(of(personRes));
      spyOn(component, 'showApiErrorMessage');
      spyOn(component.validatorService, 'getActiveStatus').and.returnValue(
        of(bindToObject(new Contributor(), engagementResponse))
      );
      spyOn(component.validatorService, 'getBankDetails').and.returnValue(throwError(genericError));
      spyOn(component.documentService, 'getDocuments').and.returnValue(of(documentListItemArray));
      component.fetchPersonDetails();
      expect(component.showApiErrorMessage).toHaveBeenCalled();
    });
  });
  describe('initilaise the view', () => {
    it('should initialise view', () => {
      component.validatorDataToken === routerDataResponse;
      component.isBorder = true;
      spyOn(component.validatorService, 'getEstablishmentProfile').and.returnValue(of(new EstablishmentProfile()));
      component.intialiseTheView(component.validatorDataToken);
      expect(component.isReturnToAdmin).toBe(true);
    });
  });
  describe('approve transaction', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      const form = new FormGroup({
        action: new FormControl()
      });
      spyOn(component, 'showModal');
      component.approveTransaction(form, modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('reject transaction', () => {
    it('should trigger the rejection popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      const form = new FormGroup({
        action: new FormControl()
      });
      spyOn(component, 'showModal');
      component.rejectTransaction(form, modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('return transation', () => {
    it('should trigger the return popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      const form = new FormGroup({
        action: new FormControl()
      });
      spyOn(component, 'showModal');
      component.returnTransaction(form, modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('confirm approve', () => {
    it('should confirm approve', () => {
      const form = new FormGroup({
        action: new FormControl()
      });
      component.confirmApprove(form);
      expect(component.workflowService).toBeTruthy();
    });
  });
  describe('confirm reject', () => {
    it('should confirm reject', () => {
      const form = new FormGroup({
        action: new FormControl()
      });
      component.confirmReject(form);
      expect(component.workflowService).toBeTruthy();
    });
  });
  describe('confirm return', () => {
    it('should confirm return', () => {
      const form = new FormGroup({
        action: new FormControl()
      });
      component.confirmReturn(form);
      expect(component.workflowService).toBeTruthy();
    });
  });
  describe('navigate to profile', () => {
    it('should navigate to profile if border', () => {
      component.isBorder = true;
      component.navigateToProfile();
      expect(component.router.navigate).toHaveBeenCalledWith([CimRoutesEnum.CONTRIBUTOR_PROFILE_ADD_BORDER]);
    });
    it('should navigate to profile if iqama', () => {
      component.isIqama = true;
      component.navigateToProfile();
      expect(component.router.navigate).toHaveBeenCalledWith([CimRoutesEnum.CONTRIBUTOR_PROFILE_ADD_IQAMA]);
    });
  });
  describe('navigate to inbox', () => {
    it('should navigate to inbox', () => {
      const response = null;
      component.navigateToInbox(response);
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('showModal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe(' check if iqama or border', () => {
    it('should check if iqama or border', () => {
      component.checkIfIqamaofBorder(routerDataResponse);
      expect(component.isBorder).toEqual(true);
    });
  });
  describe('hide modal', () => {
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModal();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  // describe('get  workflow status', () => {
  //   it('should get workflow status', () => {
  //     const sin = 123123;
  //     const isBorder = true;
  //     component.registrationNo = 1123324344;
  //     spyOn(component.workflowService, 'getWorkFlowDetails').and.returnValue(of(transactionWorkflowList));
  //     component.getWorkFlowStatus(sin, isBorder);
  //     expect(component.hasIqamaWorkFlow).toBeFalsy();
  //   });
  // });
  describe('initilialise person', () => {
    it('should initilialise person', () => {
      const person = genericPersonResponse;
      person.sex.english = 'Female';
      component.initialisePersonDetails(person);
      expect(component.iconLocation).toBe(ManagePersonConstants.FEMALE_ICON_LOCATION);
    });
    it('should initilialise person', () => {
      const person = genericPersonResponse;
      person.sex.english = 'Male';
      component.initialisePersonDetails(person);
      expect(component.iconLocation).toBe(ManagePersonConstants.MALE_ICON_LOCATION);
    });
  });
  describe('get Documents', () => {
    it('should get documents', () => {
      const isBorder = true;
      spyOn(component.documentService, 'getDocuments').and.returnValue(of(documentListItemArray));
      component.getDocuments(isBorder);
      expect(component.documentService.getDocuments).toHaveBeenCalled();
    });
  });
  describe('initilialise transaction', () => {
    it('should initiliase transaction', () => {
      const bool = false;
      component.editTransaction = false;
      spyOn(component.alertService, 'clearAlerts');
      component.initialiseTransaction(bool);
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
    });
  });
});
export function bindToModel(model, cast) {
  Object.keys(model).forEach(key => {
    model[key] = cast[key];
  });
  return cast;
}

function getForm() {
  const fb: FormBuilder = new FormBuilder();
  return fb.group({
    comments: [null, { updateOn: 'blur' }],
    rejectionReason: fb.group({
      english: [null, { updateOn: 'blur' }],
      arabic: null
    }),
    returnReason: fb.group({
      english: [null, { updateOn: 'blur' }],
      arabic: null
    }),
    taskId: [null, { updateOn: 'blur' }],
    personId: [null, { updateOn: 'blur' }],
    user: [null, { updateOn: 'blur' }]
  });
}
