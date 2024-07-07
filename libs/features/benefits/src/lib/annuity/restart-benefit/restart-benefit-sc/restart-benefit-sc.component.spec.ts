/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  bindToObject,
  ContributorToken,
  ContributorTokenDto,
  DocumentItem,
  DocumentService,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  CoreActiveBenefits
} from '@gosi-ui/core';
import { comments } from '@gosi-ui/features/occupational-hazard/lib/shared/models/date';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub } from 'testing/mock-services';
import { holdBenefitData, restartholdData } from 'testing/test-data';
import {
  AuthorizationDetailsDto,
  BankService,
  BenefitDocumentService,
  BenefitPaymentDetails,
  DependentDetails,
  HeirsDetails,
  HoldBenefitDetails,
  ManageBenefitService,
  PersonBankDetails,
  RestartHoldDetails,
  AttorneyDetailsWrapper,
  AuthorizationList,
  BenefitActionsService,
  BenefitResponse
} from '../../../shared';
import { RestartBenefitScComponent } from './restart-benefit-sc.component';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('RestartBenefitScComponent', () => {
  let component: RestartBenefitScComponent;
  let fixture: ComponentFixture<RestartBenefitScComponent>;
  const benefitActionServicespy = jasmine.createSpyObj<BenefitActionsService>('BenefitActionService', [
    'getRestartholdDetails',
    'saveRestartBenefitDetails',
    'updateRestartBenefitDetails',
    'savePayeeDetails',
    'submitRestartDetails',
    'revertRestartBenefit'
  ]);
  benefitActionServicespy.getRestartholdDetails.and.returnValue(of(new RestartHoldDetails()));
  benefitActionServicespy.saveRestartBenefitDetails.and.returnValue(of(new BenefitPaymentDetails()));
  benefitActionServicespy.updateRestartBenefitDetails.and.returnValue(of(new BenefitPaymentDetails()));
  benefitActionServicespy.savePayeeDetails.and.returnValue(of(new BenefitResponse()));
  benefitActionServicespy.submitRestartDetails.and.returnValue(of(new BenefitResponse()));
  benefitActionServicespy.revertRestartBenefit.and.returnValue(of(new BenefitResponse()));
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getRequiredDocuments',
    'getUploadedDocuments'
  ]);
  benefitDocumentServicespy.getRequiredDocuments.and.returnValue(of([new DocumentItem()]));
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));
  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', [
    'getRequiredDocuments',
    'refreshDocument'
  ]);
  documentServicespy.getRequiredDocuments.and.returnValue(of([new DocumentItem()]));
  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAttorneyDetails'
  ]);
  manageBenefitServiceSpy.getAttorneyDetails.and.returnValue(
    of({
      ...new AuthorizationDetailsDto(),
      AttorneyDetailsWrapper: [{ ...new AttorneyDetailsWrapper() }],
      authorizationList: [{ ...new AuthorizationList() }]
    })
  );
  const bankServiceSpy = jasmine.createSpyObj<BankService>('BankService', ['getBankList']);
  bankServiceSpy.getBankList.and.returnValue(of([new PersonBankDetails()]));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserDynamicTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub },
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: BenefitActionsService, useValue: benefitActionServicespy },
        { provide: BankService, useValue: bankServiceSpy },
        { provide: DocumentService, useValue: documentServicespy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        DatePipe
      ],
      declarations: [RestartBenefitScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestartBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise for mof establishment allocation', inject([ActivatedRoute], (route: ActivatedRoute) => {
      route.queryParams = of({ edit: true });
      spyOn(component, 'getLookUpValues');
      component.ngOnInit();
      expect(component.getLookUpValues).toHaveBeenCalled();
    }));
  });
  describe('ngAfterViewInit', () => {
    it('should ngAfterViewInit', () => {
      component.ngAfterViewInit();
      expect(component.ngAfterViewInit).toBeDefined();
    });
    it('should setBenefitValue', () => {
      component.activeBenefit = {
        ...new CoreActiveBenefits(1212, 21332, { english: '', arabic: '' }, 767),
        setBenefitStartDate: null
      };
      expect(component.activeBenefit).toBeDefined();
      component.setBenefitValues();
      expect(component.setBenefitValues).toBeDefined();
    });
    it('should  setPaymentRelatedValuesForEdit', () => {
      const response = { ...new HeirsDetails() };
      expect(response).toBeDefined();
      component.setPaymentRelatedValuesForEdit(response);
      expect(component.setPaymentRelatedValuesForEdit).toBeDefined();
    });
  });
  describe('getRestartEditDetails', () => {
    it('should getRestartEditDetails', () => {
      spyOn(component.modifyBenefitService, 'getRestartDetails').and.returnValue(
        of(bindToObject(new HoldBenefitDetails(), holdBenefitData))
      );
      component.getRestartEditDetails();
      expect(component.restartEditdetails).not.toBe(null);
    });
  });

  describe('initialiseViewForEdit', () => {
    it('should initialiseViewForEdit', () => {
      const payload = {
        sin: 502351249,
        benefitRequestId: 100036,
        referenceNo: 1000045428,
        channel: {
          arabic: '',
          english: 'unknown'
        },
        role: 'Validator 1'
      };
      component.initialiseViewForEdit(payload);
      expect(component.initialiseViewForEdit).not.toBe(null);
    });
  });
  describe('getRestartholdDetails', () => {
    it('should getRestartholdDetails', () => {
      component.getRestartholdDetails();
      expect(component.restartEditdetails).not.toBe(null);
    });
    it('should confirm', () => {
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      component.confirm();
      expect(component.confirm).not.toBe(null);
    });
  });
  describe('initializeWizardDetails', () => {
    it('should initializeWizardDetails', () => {
      component.currentTab = 0;
      component.restartBenefitWizard = new ProgressWizardDcComponent();
      component.initializeWizardDetails();
      expect(component.restartWizards).not.toBe(null);
    });
  });
  describe('selectedWizard', () => {
    it('should select wizard', () => {
      const index = 1;
      component.selectedWizard(index);
      expect(component.selectedWizard).not.toBe(null);
    });
  });
  describe('getRestartCalcDetails', () => {
    it('should getRestartCalcDetails', () => {
      spyOn(component.modifyBenefitService, 'getRestartCalculation').and.returnValue(
        of(bindToObject(new HoldBenefitDetails(), holdBenefitData))
      );
      component.getRestartCalcDetails();
      expect(component.restartEditdetails).not.toBe(null);
    });
  });
  describe('nextForm ', () => {
    it('Should navigate to nextForm ', () => {
      component.currentTab = 0;
      component.restartBenefitWizard = new ProgressWizardDcComponent();
      spyOn(component.alertService, 'clearAlerts');
      component.nextForm();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('test navigateRestartDocWizard', () => {
    it('should navigateRestartDocWizard', () => {
      component.navigateRestartDocWizard();
      expect(component.navigateRestartDocWizard).toBeDefined();
    });
  });
  describe('getUploadedDocuments', () => {
    it('should fetch documents', () => {
      component.getUploadedDocuments(123123);
      expect(component.benefitDocumentService.getUploadedDocuments).toBeDefined();
      expect(component.requiredDocs).not.toBeNull();
    });
  });
  describe('cancelTransactions', () => {
    it('should  cancelTransactions', () => {
      component.cancelTransactions();
      expect(component.cancelTransactions).toBeDefined();
    });
  });
  describe('ngAfterViewInit', () => {
    it('should  ngAfterViewInit', () => {
      component.ngAfterViewInit();
      expect(component.ngAfterViewInit).toBeDefined();
    });
  });
  describe('getBankList', () => {
    it('should  getBankList', () => {
      const identity = 3434343;
      component.getBankList(identity);
      expect(component.getBankList).toBeDefined();
    });
  });
  describe('getAttorneyListById', () => {
    it('should getAttorneyListById', () => {
      const id = 3434343;
      component.getAttorneyListById(id);
      expect(component.getAttorneyListById).toBeDefined();
    });
    it('should setAuthorizedPersonDetails', () => {
      const authorizedPersonDetails = [{ ...new AttorneyDetailsWrapper() }];
      const guardianPersonDetails = [{ ...new AttorneyDetailsWrapper() }];
      const authorizationDetails = {
        ...new AuthorizationDetailsDto(),
        authorizationList: [{ ...new AuthorizationList() }],
        personId: 656565
      };
      component.setAuthorizedPersonDetails(authorizedPersonDetails, guardianPersonDetails, authorizationDetails);
    });
    it('should saveBankDetails', () => {
      const requestData = {
        ...new AuthorizationDetailsDto(),
        personId: 1234,
        isNonSaudiIBAN: 2323,
        newNonSaudiBankName: { english: '', arabic: '' },
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };

      component.saveBankDetails(requestData);
      expect(component.saveBankDetails).toBeDefined();
    });
  });
  describe(' checkAddressDetails', () => {
    it('should  checkAddressDetails', () => {
      const perDetails = {
        ...new DependentDetails(),
        addresses: '',
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.checkAddressDetails(perDetails);
      expect(component.checkAddressDetails).toBeDefined();
    });
  });
  describe('setPaymentDetails', () => {
    it('should setPaymentDetails', () => {
      const paymentDetails = new HeirsDetails();
      component.setPaymentDetails(paymentDetails);
      expect(component.setPaymentDetails).toBeDefined();
    });
  });
  describe(' setPaymentRelatedValues', () => {
    it('should  setPaymentRelatedValues', () => {
      const response = new BenefitPaymentDetails();
      component.setPaymentRelatedValues(response);
      expect(component.setPaymentRelatedValues).toBeDefined();
    });
  });
  describe('submitRestartDetails', () => {
    it('should submitRestartDetails', () => {
      component.inEditMode = false;
      component.documentForm = new FormGroup({
        uploadDocument: new FormGroup({
          comments: new FormControl({ value: 'sdsdsd' })
        })
      });
      component.submitRestartDetails(comments);
      expect(component.submitRestartDetails).toBeDefined();
      expect(component.inEditMode).toBeFalse();
    });
    it('should submitRestartDetails', () => {
      component.inEditMode = true;
      component.documentForm = new FormGroup({
        uploadDocument: new FormGroup({
          comments: new FormControl({ value: 'sdsdsd' })
        })
      });
      component.submitRestartDetails(comments);
      expect(component.submitRestartDetails).toBeDefined();
      expect(component.inEditMode).toBeTrue();
    });
  });
  describe('refreshDocument', () => {
    it('should refreshDocument', () => {
      const document = new DocumentItem();
      component.refreshDocument(document);
      expect(component.documentService.refreshDocument).toHaveBeenCalled();
    });
  });
  describe('previousForm', () => {
    it('should previousForm', () => {
      component.restartBenefitWizard = new ProgressWizardDcComponent();
      spyOn(component, 'goToPreviousForm');
      component.previousForm();
      expect(component.previousForm).toBeDefined();
    });
  });
});
