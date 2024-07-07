/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
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
  LanguageToken,
  MenuService,
  RouterConstants,
  TransactionFeedback,
  TransactionReferenceData
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src/lib/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  BilingualTextPipeMock,
  branchListItemGenericResponse,
  branchListItemGenericResponse2,
  ChangeGroupEstablishmentStubService,
  documentResponseItemList,
  DocumentServiceStub,
  establishmentProfileResponse,
  EstablishmentStubService,
  Forms,
  genericBranchListResponse,
  genericBranchListWithStatusResponse,
  genericDocumentItem,
  genericError,
  genericEstablishmentResponse,
  genericGccEstablishment,
  ModalServiceStub,
  transactionReferenceData
} from 'testing';
import {
  ChangeGroupEstablishmentService,
  EstablishmentActionEnum,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService
} from '../../../shared';
import { ChangeMainEstablishmentScComponent } from './change-main-establishment-sc.component';
export const routerSpy = { url: '', navigate: jasmine.createSpy('navigate') };
const httpSpy = { get: jasmine.createSpy('get'), post: jasmine.createSpy('put') };
let activatedRoute: ActivatedRouteStub;
activatedRoute = new ActivatedRouteStub();
activatedRoute.setParamMap({ registrationNo: 12334, sin: 1315123132 });
describe('ChangeMainEstablishmentScComponent', () => {
  let component: ChangeMainEstablishmentScComponent;
  let fixture: ComponentFixture<ChangeMainEstablishmentScComponent>;

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
      declarations: [ChangeMainEstablishmentScComponent],
      providers: [
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: HttpClient, useValue: httpSpy },
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: ChangeGroupEstablishmentService,
          useClass: ChangeGroupEstablishmentStubService
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        { provide: EstablishmentToken, useValue: new EstablishmentRouterData() },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: MenuService,
          useValue: {
            getRoles() {
              return [];
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ChangeMainEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise the view', () => {
      component['estRouterData'].resourceType = RouterConstants.TRANSACTION_CHANGE_MAIN_ESTABLISHMENT;
      component['estRouterData'].taskId = 'abdchs';
      spyOn(component, 'getEstablishmentWithWorkflowData');
      component.ngOnInit();
      expect(component.isValidator).toBeTruthy();
      expect(component.routeToView).toEqual(EstablishmentRoutesEnum.VALIDATOR_CHANGE_MAIN_EST);
    });
    it('should initialise the view - 2', () => {
      component['estRouterData'].taskId = undefined;
      component.registrationNo = 12123123;
      component.changeGrpEstablishmentService.registrationNo = 123;
      component.changeGrpEstablishmentService.groupEligibilty.set(EstablishmentActionEnum.CHG_MAIN_EST, true);
      component.ngOnInit();
      expect(component.routeToView).toBe(EstablishmentConstants.GROUP_PROFILE_ROUTE(component.registrationNo));
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

  describe('initialise view', () => {
    it('should initialise view', () => {
      component.isValidator = true;
      spyOn(component, 'initialiseTabWizards');
      spyOn(component, 'getBranchEstablishments');
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.intialiseView();
      expect(component.initialiseTabWizards).toHaveBeenCalled();
      expect(component.getBranchEstablishments).toHaveBeenCalled();
    });
  });

  describe('initialiseTabWizards', () => {
    it('should initialiseTabWizards', () => {
      const currentTab = 0;
      component.initialiseTabWizards(currentTab);
      expect(component.changeMainEstTabWizards).not.toBe(null);
    });
  });

  describe('save main establishment', () => {
    it('save main establishment', () => {
      component.documents = [];
      component.isValidator = true;
      component.newMainEstRegistrationNo = genericGccEstablishment.registrationNo;
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.documents.push(genericDocumentItem);
      }
      component.documents.forEach(doc => (doc.documentContent = 'tsting'));

      const isFinalSubmit = true;

      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.changeMainEstablishmentForm = component.createForm();
      spyOn(component.changeGrpEstablishmentService, 'saveMainEstablishment').and.returnValue(
        of(new TransactionFeedback())
      );
      component.saveMainEstablishmentDetails(isFinalSubmit);
      expect(component.alertService.showMandatoryDocumentsError).not.toHaveBeenCalled();
    });

    it('should throw error when main est is not selected', () => {
      const forms = new Forms();
      const isFinalSubmit = false;
      component.isValidator = false;
      component.changeMainEstablishmentForm = forms.createMockEditContactDetailsForm();
      component.registrationNo = genericGccEstablishment.registrationNo;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.documents = documents;
      spyOn(component.alertService, 'showErrorByKey');
      component.saveMainEstablishmentDetails(isFinalSubmit);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
    it('should throw error when documents are invalid', () => {
      const forms = new Forms();
      const isFinalSubmit = true;
      component.newMainEstRegistrationNo = 12345;
      component.changeMainEstablishmentForm = forms.createMockEditContactDetailsForm();
      component.registrationNo = genericGccEstablishment.registrationNo;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.documents = documents;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.saveMainEstablishmentDetails(isFinalSubmit);
      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
    it('should throw error on slecting main est', () => {
      const isFinalSubmit = true;
      component.isValidator = false;
      component.mainEstablishmentRegNo = genericGccEstablishment.registrationNo;
      component.newMainEstRegistrationNo = genericGccEstablishment.registrationNo;
      spyOn(component.alertService, 'showErrorByKey');
      component.saveMainEstablishmentDetails(isFinalSubmit);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
    it('should throw error on save workflow', fakeAsync(() => {
      component.documents = [];
      component.isValidator = false;
      component.newMainEstRegistrationNo = genericGccEstablishment.registrationNo;
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.documents.push(genericDocumentItem);
      }
      component.documents.forEach(doc => (doc.documentContent = 'tsting'));

      const isFinalSubmit = false;

      spyOn(component.changeGrpEstablishmentService, 'saveMainEstablishment').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.saveMainEstablishmentDetails(isFinalSubmit);
      tick();
      expect(component.alertService.showError).toHaveBeenCalled();
    }));
  });

  describe('onSelectEstablishment', () => {
    it('should select establishment', () => {
      component.selectedMainEstablishment = branchListItemGenericResponse2;
      const establishment = branchListItemGenericResponse;
      component.branchEstablishments = genericBranchListResponse;
      const mainBranchIndex = 2;
      component.onSelectEstablishment(establishment);
      expect(component.selectedMainEstablishment).not.toBe(null);
      expect(component.newMainEstRegistrationNo).not.toBe(null);
    });
  });

  describe('getDocuments', () => {
    it('should get documents', () => {
      component.getDocuments();
      expect(component.documents$).not.toBeNull();
    });
  });
  describe('navigate back', () => {
    it('should go back', () => {
      spyOn(component.location, 'back').and.callFake(() => {});
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });

  describe('can set establishment', () => {
    it('should set new main establishment', () => {
      const registrationNo = 34546;
      component.setNewMainEstablishment(registrationNo, genericBranchListResponse);
      expect(component.branchEstablishments).not.toBe(null);
    });
  });

  describe('selectedPage', () => {
    it('should show selectedPage', () => {
      component.selectedPage(1, '');
      expect(component.pageDetails.currentPage).not.toBe(null);
    });

    xit('should throw error on save workflow', fakeAsync(() => {
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        throwError(genericError)
      );
      spyOn(component.alertService, 'showError');
      component.selectedPage(1, '');
      tick(100);
      expect(component.alertService.showError).toHaveBeenCalled();
    }));
  });

  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component, 'hideModal');
      component.cancelModal();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
  describe('cancel transaction', () => {
    it('should cancel the transaction', () => {
      component.changeMainEstablishmentForm = component.createForm();
      component.isValidator = true;
      component.changeMainEstablishmentForm.get('referenceNo').setValue(genericEstablishmentResponse.registrationNo);
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      component.cancelTransaction();
      expect(component.changeEstablishmentService.router.navigate).toHaveBeenCalled();
    });
    it('should cancel the transaction throws error', () => {
      component.changeMainEstablishmentForm = component.createForm();
      component.isValidator = true;
      component.changeMainEstablishmentForm.get('referenceNo').setValue(genericEstablishmentResponse.registrationNo);
      spyOn(component.alertService, 'showError');
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(throwError(genericError));
      component.cancelTransaction();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('set branch', () => {
    it('should set branch', () => {
      component.setBranch(genericBranchListWithStatusResponse, establishmentProfileResponse);
      expect(component.mainEstablishmentRegNo).not.toBe(null);
    });
  });
  describe('navigate to validator', () => {
    it('should navigate To change branch to main validator Page', () => {
      component.navigateToValidator();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_CHANGE_MAIN_EST]);
    });
  });
});
