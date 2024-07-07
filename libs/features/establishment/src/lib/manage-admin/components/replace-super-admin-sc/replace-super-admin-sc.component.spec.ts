/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';
import {
  bindToObject,
  DocumentItem,
  EnvironmentToken,
  EstablishmentRouterData,
  EstablishmentToken,
  NationalityTypeEnum,
  RouterConstants,
  BilingualText,
  TransactionFeedback,
  ApplicationTypeEnum,
  Role
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { of, throwError } from 'rxjs';
import {
  documentItem,
  documentResponseItemList,
  Forms,
  genericAdminResponse,
  genericEstablishmentResponse,
  genericEstablishmentRouterData,
  genericPersonResponse,
  BilingualTextPipeMock,
  genericAdminWrapper,
  genericGccEstablishment,
  genericError
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { activatedRouteStub } from '../../../profile/components/establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import { Admin, EstablishmentConstants, EstablishmentErrorKeyEnum } from '../../../shared';
import { ReplaceSuperAdminScComponent } from './replace-super-admin-sc.component';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';

describe('Replace Super Admin SC', () => {
  let component: ReplaceSuperAdminScComponent;
  let fixture: ComponentFixture<ReplaceSuperAdminScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReplaceSuperAdminScComponent],
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
    fixture = TestBed.createComponent(ReplaceSuperAdminScComponent);
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
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_REPLACE_SUPER_ADMIN;
      spyOn(component, 'initialiseForEdit').and.callThrough();
      component.ngOnInit();
      expect(component.isValidator).toBeTruthy();
    });
    it('should initialise the view', () => {
      component.isValidator = false;
      component.establishmentService.selectedAdmin = bindToObject(new Admin(), genericAdminResponse);
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({ registrationNo: genericEstablishmentResponse.registrationNo })
      );
      activatedRouteStub.paramMap.subscribe(params => {
        component.mainRegNo = +params.get('registrationNo');
      });
      component.loggedInAdminRole = 'admin';
      component.ngOnInit();
      expect(component.routeToView).toEqual(
        EstablishmentConstants.GROUP_ADMINS_ADMIN_ID_ROUTE(component.mainRegNo, component.adminId)
      );
    });
  });
  describe(' verify admin details', () => {
    it('should verify the admin', () => {
      const forms = new Forms();
      const mainRegNo = 12345678;
      const adminId = 123456;
      const isAdminReplace = true;
      component.estAdminForm = forms.createAdminForm();
      component.estAdminForm.addControl(
        'search',
        new FormGroup({
          nationality: new FormControl(NationalityTypeEnum.SAUDI_NATIONAL)
        })
      );
      spyOn(component.establishmentService, 'verifyPersonDetails').and.returnValue(of(genericPersonResponse));
      component.verifyEstAdmin(mainRegNo, adminId, isAdminReplace);
      expect(component.estAdminForm.get('isVerified').value).toBeTruthy();
    });
    it('should throw mandatory info error', () => {
      const forms = new Forms();
      component.estAdminForm = forms.createAdminForm();
      component.estAdminForm.addControl(
        'search',
        new FormGroup({
          nationality: new FormControl(NationalityTypeEnum.SAUDI_NATIONAL)
        })
      );
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      const mainRegNo = genericGccEstablishment.registrationNo;
      const adminId = 2224477667;
      const isAdminReplace = false;
      component.verifyEstAdmin(mainRegNo, adminId, isAdminReplace);
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('initilaise edit', () => {
    it('should  initilaise edit', () => {
      const estToken = genericEstablishmentRouterData;
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(of(genericAdminWrapper));
      component.initialiseForEdit(estToken);
      expect(component.isValidator).toBe(true);
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component, 'hideModal');
      spyOn(component, 'cancelTransaction');
      component.cancelModal();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
  describe('initialiseTabWizards', () => {
    it('should initialiseTabWizards', () => {
      const currentTab = 0;
      component.initialiseTabWizards(currentTab);
      expect(component.adminWizards).not.toBe(null);
    });
  });
  describe('getDocuments', () => {
    it('should get documents', () => {
      component.appType === ApplicationTypeEnum.PRIVATE;
      component.loggedInAdminRole = 'branch admin';
      component.getDocuments();
      expect(component.documents$).not.toBeNull();
    });
  });
  describe('refresh document content', () => {
    it('should refresh document content', () => {
      const document = new DocumentItem();
      const documentType = 'iqama';
      const identifier = 12345;
      spyOn(component.documentService, 'refreshDocument').and.returnValue(of(documentItem));
      component.refreshDocumentContent(document, identifier, documentType);
      expect(component.documentService.refreshDocument).toHaveBeenCalled();
    });
  });
  describe('select wizard', () => {
    it('should select wizard', () => {
      component.selectedWizard(1);
      expect(component.adminWizards).not.toBe(null);
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
      component.isValidator = true;
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
      component.selectedAdmin = genericAdminWrapper.admins[2];
      spyOn(component.adminService, 'saveAsNewAdmin').and.returnValue(of(1036053648));
      spyOn(component.adminService, 'replaceAdminDetails').and.returnValue(of(new TransactionFeedback()));
      spyOn(component, 'getNavIndicator').and.returnValue(123);
      component.submitTransaction();
      expect(component.transactionFeedback).not.toBe(null);
    });
    it('should save admin details api error', () => {
      component.adminDocuments = [];
      component.isValidator = true;
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
      component.selectedAdmin = genericAdminWrapper.admins[2];
      spyOn(component.adminService, 'saveAsNewAdmin').and.returnValue(of(1036053648));
      spyOn(component.adminService, 'replaceAdminDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.submitTransaction();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.bsModalRef = new BsModalRef();
      component.hideModal();
      expect(component.bsModalRef).not.toEqual(null);
    });
  });
  describe('Save Admin Details', () => {
    it('should save admin details', () => {
      component.estAdminForm = component.createEstAdminForm();
      component.isValidator = true;
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
      component.selectedAdmin = genericAdminWrapper.admins[2];
      spyOn(component.adminService, 'saveAsNewAdmin').and.returnValue(of(1036053648));
      spyOn(component.adminService, 'replaceAdminDetails').and.returnValue(of(new TransactionFeedback()));
      spyOn(component, 'getNavIndicator').and.callThrough();
      component.saveAdmin();
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
      spyOn(component.adminService, 'replaceAdminDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.saveAdmin();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should throw mandatory error on save', () => {
      const forms = new Forms();
      component.estAdmin = genericAdminWrapper.admins[0];
      component.mainRegNo = genericGccEstablishment.registrationNo;
      component.selectedAdmin = genericAdminWrapper.admins[2];
      component.estAdminForm = forms.createAdminForm();
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.saveAdmin();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
    it('should admin form not verified save admin details', () => {
      component.estAdminForm = component.createEstAdminForm();
      component.isValidator = true;
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
      component.saveAdmin();
      expect(component.alertService.showErrorByKey).toHaveBeenCalledWith(EstablishmentErrorKeyEnum.VERIFY_ADMIN);
    });
  });
  describe('cancel transaction', () => {
    it('should cancel transaction', () => {
      component.isValidator = true;
      component.estAdminForm = component.createEstAdminForm();
      component.estAdminForm.get('referenceNo').setValue(genericEstablishmentResponse.registrationNo);
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.estRouterData.assignedRole = Role.EST_ADMIN;
      spyOn(component.establishmentService, 'revertTransaction').and.returnValue(of(null));
      component.cancelTransaction();
      expect(component.router.navigate).toHaveBeenCalled();
    });
    it('should cancel transaction', () => {
      component.isValidator = true;
      component.estAdminForm = component.createEstAdminForm();
      component.estAdminForm.get('referenceNo').setValue(genericEstablishmentResponse.registrationNo);
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.estRouterData.assignedRole = Role.EST_ADMIN;
      spyOn(component.establishmentService, 'revertTransaction').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.cancelTransaction();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should cancel transaction if not validator', () => {
      component.isValidator = false;
      spyOn(component.location, 'back').and.callFake(() => {});
      component.cancelTransaction();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe(' get Navigation Indicator', () => {
    it('should set Navigation Indicator for save and next', () => {
      const isFinalSubmit = false;
      component.isValidator = true;
      component.getNavIndicator(isFinalSubmit);
      expect(component.getNavIndicator(isFinalSubmit)).toEqual(51);
    });
    it('should set Navigation Indicator for final submit', () => {
      const isFinalSubmit = true;
      component.isValidator = true;
      component.getNavIndicator(isFinalSubmit);
      expect(component.getNavIndicator(isFinalSubmit)).toEqual(53);
    });
    it('should set Navigation Indicator for public', () => {
      component.appType === ApplicationTypeEnum.PUBLIC;
      const isFinalSubmit = true;
      component.isValidator = false;
      component.getNavIndicator(isFinalSubmit);
      expect(component.getNavIndicator(isFinalSubmit)).toEqual(52);
    });
    it('should set Navigation Indicator for reenter', () => {
      const isFinalSubmit = true;
      component.isValidator = false;
      component.getNavIndicator(isFinalSubmit);
      expect(component.getNavIndicator(isFinalSubmit)).toEqual(52);
    });
    it('should set Navigation Indicator for reenter', () => {
      const isFinalSubmit = false;
      component.isValidator = false;
      component.getNavIndicator(isFinalSubmit);
      expect(component.getNavIndicator(isFinalSubmit)).toEqual(50);
    });
  });
});
