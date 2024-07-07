/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  bindToObject,
  DocumentItem,
  DocumentService,
  EnvironmentToken,
  EstablishmentProfile,
  EstablishmentRouterData,
  EstablishmentToken,
  LanguageToken,
  NationalityTypeEnum,
  Person,
  RouterConstants,
  TransactionFeedback
} from '@gosi-ui/core';
import { BilingualTextPipe, NameToString } from '@gosi-ui/foundation-theme/src/lib/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  BilingualTextPipeMock,
  branchEligibilityResponse,
  branchListItemGenericResponse,
  documentResponseItemList,
  DocumentServiceStub,
  EstablishmentStubService,
  Forms,
  genericAdminResponse,
  genericBranchListResponse,
  genericBranchListWithStatusResponse,
  genericError,
  genericEstablishmentResponse,
  genericPersonResponse,
  ModalServiceStub,
  NameToStringPipeMock
} from 'testing';
import {
  ActionTypeEnum,
  Admin,
  AdminRoleEnum,
  AdminWrapper,
  EstablishmentActionEnum,
  EstablishmentBranchWrapper,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService,
  LegalEntityEnum,
  NEW_ADMIN_LOV_VALUE
} from '../../../shared';
import { menuStub } from '../../../shared/common-stub.spec';
import { ActivatedRouteStub } from '../../../validator/components/add-establishment/establishment-sc/establishment-sc.component.spec';
import * as helper from './delink-establishment-helper';
import { DelinkEstablishmentScComponent } from './delink-establishment-sc.component';
export const routerSpy = { url: '', navigate: jasmine.createSpy('navigate') };
const httpSpy = { get: jasmine.createSpy('get'), post: jasmine.createSpy('put') };
let activatedRoute: ActivatedRouteStub;
activatedRoute = new ActivatedRouteStub();
activatedRoute.setParamMap({ registrationNo: 12334, sin: 1315123132 });

describe('DelinkEstablishmentScComponent', () => {
  let component: DelinkEstablishmentScComponent;
  let fixture: ComponentFixture<DelinkEstablishmentScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserDynamicTestingModule
      ],
      declarations: [DelinkEstablishmentScComponent, NameToStringPipeMock],
      providers: [
        menuStub,
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: NameToString, useClass: NameToStringPipeMock },
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        { provide: HttpClient, useValue: httpSpy },
        {
          provide: Router,
          useValue: routerSpy
        },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: EstablishmentToken, useValue: new EstablishmentRouterData() },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ApplicationTypeToken, useValue: 'Private' },
        { provide: BsModalService, useClass: ModalServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(DelinkEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    //TODO give different names
    it('should initialise the view -  1', () => {
      component['estRouterData'].resourceType = RouterConstants.TRANSACTION_DELINK_ESTABLISHMENT;
      component['estRouterData'].taskId = 'abdchs';
      spyOn(component, 'getEstablishmentWithWorkflowData');
      component.ngOnInit();
      expect(component.isValidator).toBeTruthy();
      expect(component.routeToView).toEqual(EstablishmentRoutesEnum.VALIDATOR_DELINK);
    });
    it('should initialise the view - 2', () => {
      component.changeGrpEstablishmentService.registrationNo = 123;
      component.changeGrpEstablishmentService.groupEligibilty.set(EstablishmentActionEnum.DELINK_NEW_GRP, true);
      spyOn(component.lookUpService, 'getNationalityList');
      spyOn(component.lookUpService, 'getGenderList');
      spyOn(component.lookUpService, 'getCityList');
      spyOn(component.lookUpService, 'getCountryList');
      const adminWrapper: AdminWrapper = { admins: [genericAdminResponse] };
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(of(adminWrapper));
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.pageSize = 5;
      component.ngOnInit();
      expect(component.routeToView).toBe(EstablishmentConstants.GROUP_PROFILE_ROUTE(component.registrationNo));
    });
  });
  describe('initialise view', () => {
    it('should initialise view with admins', () => {
      spyOn(component.lookUpService, 'getNationalityList');
      spyOn(component.lookUpService, 'getGenderList');
      spyOn(component.lookUpService, 'getCityList');
      spyOn(component.lookUpService, 'getCountryList');
      const adminWrapper: AdminWrapper = { admins: [genericAdminResponse] };
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(of(adminWrapper));
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.pageSize = 5;
      component.intialiseView();
      expect(component.pageSize).toBe(5);
    });
    it('should initialise view with validator true', () => {
      spyOn(component.lookUpService, 'getNationalityList');
      spyOn(component.lookUpService, 'getGenderList');
      spyOn(component.lookUpService, 'getCityList');
      spyOn(component.lookUpService, 'getCountryList');
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.returnValue(
        of(new EstablishmentProfile())
      );
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.pageSize = 5;
      component.isValidator = true;
      component.isDelinkToNewGroup = true;
      activatedRoute.setParamMap({ registrationNo: 12334, sin: 1315123132, groupStatus: 'new' });
      component.intialiseView();
      expect(component.mainEstablishmentRegNo).not.toBeNull();
    });
    it('should initialise view with validator true and branches', () => {
      spyOn(component.lookUpService, 'getNationalityList');
      spyOn(component.lookUpService, 'getGenderList');
      spyOn(component.lookUpService, 'getCityList');
      spyOn(component.lookUpService, 'getCountryList');
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.returnValue(
        of(new EstablishmentProfile())
      );
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.pageSize = 5;
      component.isValidator = true;
      component.referenceNo = 123;
      component.isDelinkToNewGroup = true;
      activatedRoute.setParamMap({ registrationNo: 12334, sin: 1315123132, groupStatus: 'new' });
      component.intialiseView();
      expect(component.mainEstablishmentRegNo).not.toBeNull();
    });
    it('should initialise view with superadmin', () => {
      spyOn(component.lookUpService, 'getNationalityList');
      spyOn(component.lookUpService, 'getGenderList');
      spyOn(component.lookUpService, 'getCityList');
      spyOn(component.lookUpService, 'getCountryList');
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.returnValue(
        of(new EstablishmentProfile())
      );
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      const adminWrapper = new AdminWrapper();
      adminWrapper.admins = [genericAdminResponse];
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.callFake((_, refNo) => {
        if (refNo) {
          let personTemp = new Person();
          personTemp.personId = 123456;
          return of({ admins: [{ person: personTemp }] });
        } else {
          return of(adminWrapper);
        }
      });

      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.pageSize = 5;
      component.registrationNo = 123;
      component.isValidator = true;
      component.referenceNo = 123;
      component.isDelinkToNewGroup = true;
      activatedRoute.setParamMap({ registrationNo: 12334, sin: 1315123132, groupStatus: 'new' });
      component.intialiseView();
      expect(component.mainEstablishmentRegNo).not.toBeNull();
    });
  });
  describe('select wizard', () => {
    it('should select wizard', () => {
      component.selectedWizard(1);
      expect(component.delinkEstTabWizards).not.toBe(null);
    });
  });

  describe('on Select Establishment', () => {
    it('should select an establishment', () => {
      component.selectedBranchesRegNo = [];
      component.onSelectEstablishment(branchListItemGenericResponse);
      expect(component.selectedBranches).not.toBe(null);
    });
    it('should select an establishment with selected branch', () => {
      component.selectedBranchesRegNo = [branchListItemGenericResponse.registrationNo];
      component.isDelinkToNewGroup = true;
      component.onSelectEstablishment(branchListItemGenericResponse);
      expect(component.selectedBranches).not.toBe(null);
    });
  });

  describe('on SelectMainEstablishment', () => {
    it('should select main establishment', () => {
      component.selectedBranches = genericBranchListResponse;
      component.delinkedBranches = [branchListItemGenericResponse];
      component.onSelectMainEstablishment(branchListItemGenericResponse);
      expect(component.newMainEstablishmentRegNo).not.toBe(null);
    });
  });

  describe('save group', () => {
    it('should save establishment group', () => {
      spyOn(component.changeGrpEstablishmentService, 'updateDelinkedEstablishment').and.returnValue(
        of(new TransactionFeedback())
      );
      component.saveGroup(true);
      expect(component.transactionFeedback).not.toBe(null);
    });
    it('throw mandatory docs error', () => {
      const forms = new Forms();
      const isFinalSubmit = true;
      component.newMainEstablishmentRegNo = 12345;
      component.isValidator = true;
      component.deLinkForm = forms.createMockEditContactDetailsForm();
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.documents = documents;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(of(null));
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      spyOn(component.changeGrpEstablishmentService, 'updateDelinkedEstablishment').and.returnValue(
        of(new TransactionFeedback())
      );
      component.saveGroup(isFinalSubmit);
      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
    it('should call update branch', () => {
      const forms = new Forms();
      const isFinalSubmit = true;
      component.newMainEstablishmentRegNo = 12345;
      component.isValidator = true;
      component.deLinkForm = forms.createMockEditContactDetailsForm();
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.documents = documents;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(of(null));
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      spyOn(component.changeGrpEstablishmentService, 'updateDelinkedEstablishment').and.returnValue(
        of(new TransactionFeedback())
      );
      component.saveGroup(isFinalSubmit);
      expect(component.workflowService.updateTaskWorkflow).toHaveBeenCalled();
    });

    it('should call saveAdmin ', () => {
      const isFinalSubmit = false;
      const isAdminSubmit = true;
      component.newMainEstablishmentRegNo = 12345;
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
      component.deLinkForm = helper.createDeLinkForm(component);
      component.deLinkForm.addControl('person', new FormGroup({ nationalityControl }));
      component.deLinkForm.addControl('contactDetail', new FormGroup({ contactControl }));
      component.deLinkForm.get('personExists').setValue(false);
      component.deLinkForm.get('chooseAdmin').get('english').setValue(NEW_ADMIN_LOV_VALUE.english);
      component.deLinkForm.get('isVerified').setValue(true);
      component.deLinkForm.get('comments').setValue('');
      component.newGroupAdmin = genericAdminResponse;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.documents = documents;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      spyOn(component.changeGrpEstablishmentService, 'updateDelinkedEstablishment').and.returnValue(
        of(new TransactionFeedback())
      );
      spyOn(component.adminService, 'saveAsNewAdmin').and.returnValue(of(123));
      spyOn(component.changeGrpEstablishmentService, 'getNavigationIndicator').and.returnValue(123);
      component.referenceNo = 123;
      component.saveGroup(isFinalSubmit, isAdminSubmit);
      expect(component.newGroupAdmin.person.personId).toBe(123);
    });
  });
  describe('getDocuments', () => {
    it('should get documents', () => {
      component.getDocuments();
      expect(component.documents).not.toBeNull();
    });
  });

  describe('wizardOneSelectedPage', () => {
    it('should select a page', () => {
      component.wizardOneSelectedPage(1, '');
      expect(component.wizardOnePageDetails.currentPage).not.toBe(null);
    });
    xit('should throw error', () => {
      const pageIndex = 1;
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        throwError(genericError)
      );
      spyOn(component.alertService, 'showError');
      component.registrationNo = 123;
      component.wizardOneSelectedPage(pageIndex, '');
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should call getBranchEstablishmentsWithStatus', () => {
      const pageIndex = 1;
      const branchRes: EstablishmentBranchWrapper = {
        branchList: genericBranchListResponse,
        branchStatus: null,
        filter: null
      };
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(of(branchRes));
      component.registrationNo = 123;

      component.wizardOneSelectedPage(pageIndex, '');
      expect(component.branches).toEqual(genericBranchListResponse);
    });
    it('should call getBranchEstablishmentsWithStatus with searchparam', () => {
      const pageIndex = 1;
      const branchRes: EstablishmentBranchWrapper = {
        branchList: genericBranchListResponse,
        branchStatus: null,
        filter: null
      };
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(of(branchRes));
      component.registrationNo = 123;
      component.wizardOneSelectedPage(pageIndex, '123');
      expect(component.branches).toEqual(genericBranchListResponse);
    });
  });

  describe('wizardTwoSelectedPage', () => {
    it('should get wizardTwoSelectedPage', () => {
      const pageIndex = 1;
      const isLink = true;
      component.wizardTwoSelectedPage(pageIndex, isLink, '');
      expect(component.branches).not.toBeNull();
    });
    it('should get wizardTwoSelectedPage with isLink false', () => {
      const pageIndex = 1;
      const isLink = false;
      component.mainEstablishmentRegNo = 123;
      component.wizardTwoSelectedPage(pageIndex, isLink, '');
      expect(component.branches).not.toBeNull();
    });
    xit('should throw error on save workflow', () => {
      const pageIndex = 1;
      const isLink = true;
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        throwError(genericError)
      );
      spyOn(component.alertService, 'showError');
      component.wizardTwoSelectedPage(pageIndex, isLink, '');
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component, 'hideModal');
      component.cancelModal();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
  describe('cancel Modal', () => {
    it('should cancel the transaction', () => {
      component.deLinkForm = helper.createDeLinkForm(component);
      component.referenceNo = 123;
      component.mainEstablishmentRegNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      helper.cancelTransaction(component);
      expect(component.changeEstablishmentService.router.navigate).toHaveBeenCalled();
    });
    it('should cancel the transaction with error', () => {
      component.deLinkForm = helper.createDeLinkForm(component);
      component.referenceNo = 123;
      component.mainEstablishmentRegNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      helper.cancelTransaction(component);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should cancel the transaction', () => {
      component.deLinkForm = helper.createDeLinkForm(component);
      component.referenceNo = 123;
      component.isValidator = true;
      component.mainEstablishmentRegNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      helper.cancelTransaction(component);
      expect(component.changeEstablishmentService.router.navigate).toHaveBeenCalled();
    });
    xit('should cancel the transaction without cbm', () => {
      component.deLinkForm = helper.createDeLinkForm(component);
      component.referenceNo = 123;
      component.isValidator = true;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      spyOn(component.changeEstablishmentService, 'navigateToGroupProfile');
      helper.cancelTransaction(component);
      expect(component.changeEstablishmentService.router.navigate).toHaveBeenCalled();
    });
    it('should cancel the transaction with mainEstablishmentRegNo only', () => {
      component.deLinkForm = helper.createDeLinkForm(component);
      component.mainEstablishmentRegNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      helper.cancelTransaction(component);
      expect(component.changeEstablishmentService.router.navigate).toHaveBeenCalled();
    });
  });
  describe('saveBranches ', () => {
    it('should call saveBranches', () => {
      component.selectedBranches = genericBranchListResponse;
      component.newMainEstablishmentRegNo = 123;
      component.isDelinkToNewGroup = false;
      spyOn(component.changeGrpEstablishmentService, 'saveDelinkedEstablishment').and.returnValue(
        of(new TransactionFeedback())
      );
      helper.saveBranches(component);
      expect(component.changeGrpEstablishmentService.saveDelinkedEstablishment).toHaveBeenCalled();
    });
    it('should call saveBranches without delinked branches', () => {
      component.selectedBranches = [];
      component.unSelectedBranches = [];
      component.referenceNo = 123;
      component.isDelinkToNewGroup = true;
      spyOn(component.changeGrpEstablishmentService, 'saveDelinkedEstablishment').and.returnValue(
        of(new TransactionFeedback())
      );
      helper.saveBranches(component);
      expect(component.changeGrpEstablishmentService.saveDelinkedEstablishment).not.toHaveBeenCalled();
    });
    it('should call saveBranches without delinked branches and reference numner', () => {
      component.selectedBranches = [];
      component.unSelectedBranches = [];
      component.referenceNo = undefined;
      component.isDelinkToNewGroup = true;
      spyOn(component.changeGrpEstablishmentService, 'saveDelinkedEstablishment').and.returnValue(
        of(new TransactionFeedback())
      );
      helper.saveBranches(component);
      expect(component.changeGrpEstablishmentService.saveDelinkedEstablishment).not.toHaveBeenCalled();
    });
    it('should call saveBranches with error', () => {
      component.selectedBranches = genericBranchListResponse;
      component.newMainEstablishmentRegNo = 123;
      component.isDelinkToNewGroup = false;
      spyOn(component.alertService, 'showError');
      spyOn(component.changeGrpEstablishmentService, 'saveDelinkedEstablishment').and.returnValue(
        throwError(genericError)
      );
      helper.saveBranches(component);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should call saveBranches without selected branches', () => {
      component.unSelectedBranches = genericBranchListResponse;
      component.isDelinkToNewGroup = true;
      spyOn(component.changeGrpEstablishmentService, 'saveDelinkedEstablishment').and.returnValue(
        of(new TransactionFeedback())
      );
      helper.saveBranches(component);
      expect(component.changeGrpEstablishmentService.saveDelinkedEstablishment).toHaveBeenCalled();
    });
  });

  describe('resetSearch', () => {
    it('should reset Search', () => {
      component.resetSearch();
      expect(component.establishment).toBe(null);
    });
  });

  describe('navigate to delink new group', () => {
    it('should navigate Tto delink new group Page', () => {
      component.isDelinkToNewGroup = true;
      component.navigateToValidator();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.DELINK_NEW]);
    });
  });
  describe('navigate to delink new group', () => {
    it('should navigate to delink  Page', () => {
      component.isDelinkToNewGroup = false;
      component.navigateToValidator();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.DELINK]);
    });
  });

  describe('navigate back', () => {
    it('should go back', () => {
      spyOn(component.alertService, 'clearAlerts').and.callFake(() => {});
      component.navigateBack();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
    });
  });
  describe('verifyAdmin', () => {
    it('should call verifyAdmin', () => {
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component.establishmentService, 'verifyPersonDetails').and.returnValue(of(genericPersonResponse));
      component.deLinkForm.addControl(
        'search',
        new FormGroup({
          nationality: new FormControl(NationalityTypeEnum.SAUDI_NATIONAL)
        })
      );
      component.verifyAdmin();
      expect(component.establishmentService.verifyPersonDetails).toHaveBeenCalled();
    });
    it('should call verifyAdmin with no person result', () => {
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component.establishmentService, 'verifyPersonDetails').and.returnValue(of(null));
      component.deLinkForm.addControl(
        'search',
        new FormGroup({
          nationality: new FormControl(NationalityTypeEnum.SAUDI_NATIONAL)
        })
      );
      component.verifyAdmin();
      expect(component.establishmentService.verifyPersonDetails).toHaveBeenCalled();
    });
  });
  describe('resetEventDetails', () => {
    it('should call resetEventDetails', () => {
      const form = helper.createDeLinkForm(component);
      component.resetEventDetails(form);
      expect(form.get('isVerified').value).toBe(false);
    });
  });
  describe('saveSelectedBranches', () => {
    it('should call saveSelectedBranches', () => {
      spyOn(component.changeGrpEstablishmentService, 'saveDelinkedEstablishment').and.returnValue(
        of(new TransactionFeedback())
      );
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(genericEstablishmentResponse));
      spyOn(component, 'selectedWizard');
      component.selectedBranches = genericBranchListResponse;
      component.selectedBranches[0].recordActionType = ActionTypeEnum.ADD;
      component.unSelectedBranches = [];
      component.newMainEstablishmentRegNo = 12345;
      component.isDelinkToNewGroup = false;
      component.saveSelectedBranches();
      expect(component.selectedWizard).toHaveBeenCalled();
    });

    it('should call fetchNewLinkedGroupDetails', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(genericEstablishmentResponse));
      spyOn(component.alertService, 'clearAlerts');
      component.establishment = genericEstablishmentResponse;
      component.referenceNo = 123;
      component.selectedBranches = [];
      component.unSelectedBranches = [];
      component.isDelinkToNewGroup = false;
      component.newMainEstablishmentRegNo = 12345;
      component.saveSelectedBranches();
      expect(component.establishment).toBe(genericEstablishmentResponse);
    });
  });
  describe('searchEstablishment', () => {
    it('should call searchEstablishment with eligible true', () => {
      spyOn(component.changeGrpEstablishmentService, 'checkEligibility').and.callFake(() => {
        branchEligibilityResponse[2].eligible = true;
        return of(branchEligibilityResponse);
      });
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(genericEstablishmentResponse));
      const form = new FormControl();
      form.setValue(123);
      component.distinctLE = LegalEntityEnum.SEMI_GOV;
      component.searchEstablishment(form);
      expect(component.changeGrpEstablishmentService.checkEligibility).toHaveBeenCalled();
    });
    it('should call searchEstablishment with eligible false', () => {
      spyOn(component.changeGrpEstablishmentService, 'checkEligibility').and.callFake(() => {
        branchEligibilityResponse[2].eligible = false;
        return of(branchEligibilityResponse);
      });
      spyOn(component.alertService, 'showError');
      const form = new FormControl();
      form.setValue(123);
      component.distinctLE = LegalEntityEnum.SEMI_GOV;
      component.searchEstablishment(form);
      expect(component.newMainEstablishmentRegNo).not.toEqual(123);
    });
  });
  describe('getSuperAdmin ', () => {
    it('should call getSuperAdmin ', () => {
      component.isValidator = true;
      component.isDelinkToNewGroup = true;
      const parentGroupAdmin = new Admin();
      parentGroupAdmin.person.personId = 123;
      parentGroupAdmin.roles = [{ english: AdminRoleEnum.BRANCH_ADMIN, arabic: '' }];
      const adminWrapper: AdminWrapper = { admins: [genericAdminResponse, parentGroupAdmin] };
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(of(adminWrapper));
      helper.getSuperAdmin(component);
      expect(component.establishmentService.getAdminsOfEstablishment).toHaveBeenCalled();
    });
    it('should call getSuperAdmin with error', () => {
      component.isValidator = true;
      component.isDelinkToNewGroup = true;
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      helper.getSuperAdmin(component);
      expect(component.establishmentService.getAdminsOfEstablishment).toHaveBeenCalled();
    });
    it('should call getSuperAdmin without super admin ', () => {
      const adminWrapper: AdminWrapper = { admins: [] };
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(of(adminWrapper));
      helper.getSuperAdmin(component);
      expect(component.establishmentService.getAdminsOfEstablishment).toHaveBeenCalled();
    });
  });
});
