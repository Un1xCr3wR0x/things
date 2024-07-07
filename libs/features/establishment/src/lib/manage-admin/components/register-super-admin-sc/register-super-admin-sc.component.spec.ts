import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';
import {
  ApplicationTypeEnum,
  bindToObject,
  DocumentItem,
  EnvironmentToken,
  EstablishmentRouterData,
  EstablishmentToken,
  NationalityTypeEnum,
  Role,
  RouterConstants
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { of, throwError } from 'rxjs';
import {
  BilingualTextPipeMock,
  documentItem,
  documentResponseItemList,
  Forms,
  genericAdminResponse,
  genericAdminWrapper,
  genericError,
  genericEstablishmentResponse,
  genericEstablishmentRouterData,
  genericGccEstablishment,
  genericPersonResponse
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { activatedRouteStub } from '../../../profile/components/establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import { Admin, EstablishmentErrorKeyEnum, SaveAdminResponse } from '../../../shared';
import { RegisterSuperAdminScComponent } from './register-super-admin-sc.component';

describe('RegisterSuperAdminScComponent', () => {
  let component: RegisterSuperAdminScComponent;
  let fixture: ComponentFixture<RegisterSuperAdminScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterSuperAdminScComponent],
      providers: [
        ...commonProviders,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: EstablishmentToken, useValue: new EstablishmentRouterData() },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ],
      imports: [...commonImports, RouterModule.forRoot([]), NgxPaginationModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSuperAdminScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ng On init', () => {
    it('should initilaise view for edit', () => {
      component.estRouterData.taskId = 'taskId';
      component.establishmentService.selectedAdmin = bindToObject(new Admin(), genericAdminResponse);
      component.estRouterData.registrationNo = genericEstablishmentRouterData.registrationNo;
      component.estRouterData.referenceNo = genericEstablishmentRouterData.referenceNo;
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_ADD_SUPER_ADMIN;
      spyOn(component, 'initialiseEdit').and.callThrough();
      component.ngOnInit();
      expect(component.isValidators).toBeTruthy();
    });
    it('should initilaise view', () => {
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({ registrationNo: genericEstablishmentResponse.registrationNo })
      );
      activatedRouteStub.paramMap.subscribe(params => {
        component.mainRegNo = +params.get('registrationNo');
      });
      component.estRouterData.taskId = '';
      component.estRouterData.resourceType = undefined;
      spyOn(component, 'initialiseParams').and.callThrough();
      component.ngOnInit();
      expect(component.isValidators).toBeFalsy();
    });
  });
  describe('initialise Edit', () => {
    it('should initialise edit', () => {
      (component as any).estRouterData = genericEstablishmentRouterData;
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(of(genericAdminWrapper));
      component.setForEdit(false);
      expect(component.isValidators).toBe(true);
    });
    it('throw api error', () => {
      const estToken = genericEstablishmentRouterData;
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.initialiseEdit(estToken);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe(' verify admin details', () => {
    it('should verify the admin', () => {
      spyOn(component.establishmentService, 'verifyPersonDetails').and.returnValue(of(genericPersonResponse));
      component.estAdminForm.addControl(
        'search',
        new FormGroup({
          nationality: new FormControl(NationalityTypeEnum.SAUDI_NATIONAL)
        })
      );
      const nationalityControl = new FormGroup({
        english: new FormControl(),
        arabic: new FormControl()
      });
      component.estAdminForm.addControl('person', new FormGroup({ nationalityControl }));
      component.verifySuperAdmin();
      expect(component.establishmentService.verifyPersonDetails).toHaveBeenCalled();
    });
    it('should throw mandatory error message', () => {
      const forms = new Forms();
      component.estAdminForm = forms.createAdminForm();
      component.estAdminForm.addControl(
        'search',
        new FormGroup({
          nationality: new FormControl(NationalityTypeEnum.SAUDI_NATIONAL)
        })
      );
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.verifySuperAdmin();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('refresh document content', () => {
    it('should refresh document content', () => {
      const document = new DocumentItem();
      const documentType = 'iqama';
      const identifier = 12345;
      spyOn(component.documentService, 'refreshDocument').and.returnValue(of(documentItem));
      component.refreshDoc(document, identifier, documentType);
      expect(component.documentService.refreshDocument).toHaveBeenCalled();
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component, 'hideModal');
      spyOn(component, 'cancelTransactionDetails');
      component.cancelModal();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
  describe('getDocuments', () => {
    it('should get documents', () => {
      component.getDocuments();
      expect(component.adminDocuments).not.toBeNull();
    });
  });
  describe('select wizard', () => {
    it('should select wizard', () => {
      component.selectedWizard(1);
      expect(component.adminWizards).not.toBe(null);
    });
  });
  describe(' get Navigation Indicator', () => {
    it('should set Navigation Indicator for save and next', () => {
      const isFinalSubmit = false;
      component.isValidators = true;
      component.getNavIndicator(isFinalSubmit);
      expect(component.getNavIndicator(isFinalSubmit)).toEqual(75);
    });
    it('should set Navigation Indicator for final submit', () => {
      const isFinalSubmit = true;
      component.isValidators = true;
      component.getNavIndicator(isFinalSubmit);
      expect(component.getNavIndicator(isFinalSubmit)).toEqual(77);
    });
    it('should set Navigation Indicator for reenter', () => {
      const isFinalSubmit = true;
      component.isValidators = false;
      component.getNavIndicator(isFinalSubmit);
      expect(component.getNavIndicator(isFinalSubmit)).toEqual(76);
    });
    it('should set Navigation Indicator for reenter', () => {
      const isFinalSubmit = false;
      component.isValidators = false;
      component.getNavIndicator(isFinalSubmit);
      expect(component.getNavIndicator(isFinalSubmit)).toEqual(74);
    });
  });
  describe('cancel transaction', () => {
    it('should cancel transaction', () => {
      component.isValidators = true;
      component.estAdminForm = component.createEstAdminForm();
      component.estAdminForm.get('referenceNo').setValue(genericEstablishmentResponse.registrationNo);
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      component.estRouterData.assignedRole = Role.EST_ADMIN;
      spyOn(component.establishmentService, 'revertTransaction').and.returnValue(of(null));
      component.cancelTransactionDetails();
      expect(component.router.navigate).toHaveBeenCalled();
    });
    it('should cancel transaction if not validator', () => {
      component.isValidators = false;
      spyOn(component.location, 'back').and.callThrough();
      component.cancelTransactionDetails();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe('submit transaction', () => {
    it('should submit transaction during document error', () => {
      component.adminDocuments = [];
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.adminDocuments = documents;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.submitTransaction();
      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
    it('should save admin details', () => {
      component.adminDocuments = [];
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.adminDocuments = documents;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      component.estAdminForm = component.createEstAdminForm();
      const nationalityControl = new FormGroup({
        english: new FormControl(),
        arabic: new FormControl()
      });
      const emailId = new FormGroup({
        primary: new FormControl(),
        secondary: new FormControl()
      });
      const contactControl = new FormGroup({
        emailId
      });
      component.estAdmin = genericAdminResponse;
      component.estAdminForm.addControl('person', new FormGroup({ nationalityControl }));
      component.estAdminForm.addControl('contactDetail', new FormGroup({ contactControl }));
      component.estAdminForm.get('isVerified').setValue(true);
      component.estAdmin.roles = [];
      component.mainRegNo = genericGccEstablishment.registrationNo;
      component.isValidators = true;
      spyOn(component.adminService, 'saveSuperAdminDetails').and.returnValue(of(new SaveAdminResponse()));
      spyOn(component, 'getNavIndicator').and.returnValue(123);
      component.submitTransaction();
      expect(component.transactionFeedback).not.toBe(null);
    });
    it('throw api error ', () => {
      component.estAdminForm = component.createEstAdminForm();
      const nationalityControl = new FormGroup({
        english: new FormControl(),
        arabic: new FormControl()
      });
      const emailId = new FormGroup({
        primary: new FormControl(),
        secondary: new FormControl()
      });
      const contactControl = new FormGroup({
        emailId
      });
      component.estAdmin = genericAdminResponse;
      component.estAdminForm.addControl('person', new FormGroup({ nationalityControl }));
      component.estAdminForm.addControl('contactDetail', new FormGroup({ contactControl }));
      component.estAdminForm.get('isVerified').setValue(true);
      component.estAdmin.roles = [];
      component.mainRegNo = genericGccEstablishment.registrationNo;
      spyOn(component.adminService, 'saveSuperAdminDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.submitTransaction();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('Save Admin Details', () => {
    it('should save admin details', () => {
      component.estAdminForm = component.createEstAdminForm();
      component.isValidators = true;
      const nationalityControl = new FormGroup({
        english: new FormControl(),
        arabic: new FormControl()
      });
      const emailId = new FormGroup({
        primary: new FormControl(),
        secondary: new FormControl()
      });
      const contactControl = new FormGroup({
        emailId
      });
      component.estAdmin = genericAdminResponse;
      component.estAdminForm.addControl('person', new FormGroup({ nationalityControl }));
      component.estAdminForm.addControl('contactDetail', new FormGroup({ contactControl }));
      component.estAdminForm.get('isVerified').setValue(true);
      component.estAdmin.roles = [];
      component.mainRegNo = genericGccEstablishment.registrationNo;
      spyOn(component.adminService, 'saveAsNewAdmin').and.returnValue(of(1036053648));
      spyOn(component.adminService, 'saveSuperAdminDetails').and.returnValue(of(new SaveAdminResponse()));
      spyOn(component, 'getNavIndicator').and.callThrough();
      component.saveSuperAdmin();
      expect(component.transactionFeedback).not.toBe(null);
    });
    it('throw api error ', () => {
      component.estAdminForm = component.createEstAdminForm();
      const nationalityControl = new FormGroup({
        english: new FormControl(),
        arabic: new FormControl()
      });
      const emailId = new FormGroup({
        primary: new FormControl(),
        secondary: new FormControl()
      });
      const contactControl = new FormGroup({
        emailId
      });
      component.estAdmin = genericAdminResponse;
      component.estAdminForm.addControl('person', new FormGroup({ nationalityControl }));
      component.estAdminForm.addControl('contactDetail', new FormGroup({ contactControl }));
      component.estAdminForm.get('isVerified').setValue(true);
      component.estAdmin.roles = [];
      component.mainRegNo = genericGccEstablishment.registrationNo;
      spyOn(component.adminService, 'saveAsNewAdmin').and.returnValue(of(1036053648));
      spyOn(component.adminService, 'saveSuperAdminDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.saveSuperAdmin();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should throw mandatory error on save', () => {
      const forms = new Forms();
      component.estAdmin = genericAdminWrapper.admins[0];
      component.mainRegNo = genericGccEstablishment.registrationNo;
      component.estAdminForm = forms.createAdminForm();
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.saveSuperAdmin();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
    it('should admin form not verified save admin details', () => {
      component.estAdminForm = component.createEstAdminForm();
      component.isValidators = true;
      const nationalityControl = new FormGroup({
        english: new FormControl(),
        arabic: new FormControl()
      });
      const emailId = new FormGroup({
        primary: new FormControl(),
        secondary: new FormControl()
      });
      const contactControl = new FormGroup({
        emailId
      });
      component.estAdmin = genericAdminResponse;
      component.estAdminForm.addControl('person', new FormGroup({ nationalityControl }));
      component.estAdminForm.addControl('contactDetail', new FormGroup({ contactControl }));
      component.estAdminForm.get('isVerified').setValue(false);
      spyOn(component.alertService, 'showErrorByKey');
      component.saveSuperAdmin();
      expect(component.alertService.showErrorByKey).toHaveBeenCalledWith(EstablishmentErrorKeyEnum.VERIFY_ADMIN);
    });
  });
});
