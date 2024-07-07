/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  CommonIdentity,
  DocumentItem,
  EnvironmentToken,
  GosiCalendar,
  LanguageToken,
  Lov,
  LovList,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionParams,
  TransactionService
} from '@gosi-ui/core';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  ManagePersonServiceStub,
  ModalServiceStub,
  BilingualTextPipeMock,
  genericError,
  NameToStringPipeMock
} from 'testing';
import {
  ActiveHeirData,
  AdjustmentDetailsDto,
  BenefitDetails,
  BenefitDocumentService,
  BenefitPropertyService,
  DependentDetails,
  DependentService,
  HeirActiveService,
  HeirBenefitService,
  ManageBenefitService,
  PaymentDetail,
  PaymentHistoryFilter,
  TransactionHistoryDetails,
  TransactionHistoryFilter,
  ActiveHeirDetails,
  BenefitConstants,
  BeneficiaryDetails,
  SimisBenefit,
  MainframeBenefit
} from '../../shared';
import { ActiveHeirDetailsScComponent } from './active-heir-details-sc.component';
import { BilingualTextPipe, NameToString } from '@gosi-ui/foundation-theme/src';

describe('ActiveHeirDetailsScComponent', () => {
  let component: ActiveHeirDetailsScComponent;
  let fixture: ComponentFixture<ActiveHeirDetailsScComponent>;
  const transactionServiceSpy = jasmine.createSpyObj<TransactionService>('TransactionService', [
    'getTransactionDetails',
    'navigate'
  ]);
  transactionServiceSpy.navigate.and.returnValue();

  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments',
    'getAllDocuments'
  ]);
  benefitDocumentServicespy.getAllDocuments.and.returnValue(of([new DocumentItem()]));
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));
  const benefitPropertyServiceSpy = jasmine.createSpyObj<BenefitPropertyService>('BenefitPropertyService', [
    'getTransactionHistoryDetails',
    'getHeirAdjustmentDetails',
    'getTransactionStatus',
    'filterTransactionHistory'
  ]);
  benefitPropertyServiceSpy.filterTransactionHistory.and.returnValue(of(new TransactionHistoryDetails()));
  benefitPropertyServiceSpy.getHeirAdjustmentDetails.and.returnValue(of(new AdjustmentDetailsDto()));
  benefitPropertyServiceSpy.getTransactionHistoryDetails.and.returnValue(of(new TransactionHistoryDetails()));

  const heirServiceSpy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirBenefit',
    'getHeirById'
  ]);
  heirServiceSpy.getHeirBenefit.and.returnValue(of([new DependentDetails()]));
  heirServiceSpy.getHeirById.and.returnValue(of([new DependentDetails()]));
  const heirActiveServiceSpy = jasmine.createSpyObj<HeirActiveService>('HeirActiveService', [
    'getActiveHeirDetails',
    'getHeirDetails',
    'getPaymentDetails',
    'setActiveHeirDetails'
  ]);
  heirActiveServiceSpy.setActiveHeirDetails.and.returnValue();
  heirActiveServiceSpy.getHeirDetails.and.returnValue(of(new ActiveHeirData()));
  heirActiveServiceSpy.getPaymentDetails.and.returnValue(of(new PaymentDetail()));
  //const heirValues = {...new DependentDetails(), identity:[], personId: 1234,guardianPersonId:77676, fromJsonToObject: json => json, setValidatedValues: () => {}, setSelectedStatus: () => {}};
  heirActiveServiceSpy.getActiveHeirDetails.and.returnValue({ ...new ActiveHeirDetails() });
  const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getDependentHistoryDetails',
    'getDependentDetails',
    'getBenefitHistory'
  ]);
  dependentServiceSpy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getSystemParams',
    'getSystemRunDate',
    'getPaymentFilterEventType',
    'filterPaymentHistory',
    'getPaymentFilterStatusType',
    'getBenefitCalculationDetailsByRequestId',
    'getBeneficiaryDetails',
    'getSimisPaymentHistory',
    'getMainframePaymentHistory'
  ]);
  const beneficiary: BeneficiaryDetails = {
    isEditable: true,
    errorMessage: { english: '', arabic: '' }
  };
  manageBenefitServiceSpy.getMainframePaymentHistory.and.returnValue(of([new MainframeBenefit()]));
  manageBenefitServiceSpy.getSimisPaymentHistory.and.returnValue(of([new SimisBenefit()]));
  manageBenefitServiceSpy.getBeneficiaryDetails.and.returnValue(of(beneficiary));
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getPaymentFilterEventType.and.returnValue(of(new LovList([new Lov()])));
  manageBenefitServiceSpy.filterPaymentHistory.and.returnValue(of(new PaymentDetail()));
  manageBenefitServiceSpy.getPaymentFilterStatusType.and.returnValue(of(new LovList([new Lov()])));
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));

  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [ActiveHeirDetailsScComponent, BilingualTextPipeMock, NameToStringPipeMock],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: HeirBenefitService, useValue: heirServiceSpy },
        { provide: HeirActiveService, useValue: heirActiveServiceSpy },
        { provide: BenefitPropertyService, useValue: benefitPropertyServiceSpy },
        { provide: DependentService, useValue: dependentServiceSpy },
        { provide: NameToString, useClass: NameToStringPipeMock },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveHeirDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  xdescribe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      component.activeHeirDetails = {
        sin: 23445544,
        benefitRequestId: 34456766,
        personId: 34556768,
        benefitType: ''
      };
      spyOn(component, 'getHeirDetails').and.callThrough();
      spyOn(component, 'getPaymentDetails').and.callThrough();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('hideModal', () => {
    it('should hideModal', () => {
      component.hideModal();
      expect(component.hideModal).toBeDefined();
    });
  });
  xdescribe('getHeirDetails', () => {
    it('should heir details', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.personId = 10015003;
      component.getHeirDetails(component.sin, component.benefitRequestId, component.personId);
      expect(component.heirDetails).not.toBeNull();
    });
  });
  xdescribe('getHerirAdjustmentDetails', () => {
    it('should getHerirAdjustmentDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.getHerirAdjustmentDetails(component.sin, component.benefitRequestId, component.personId);
      fixture.detectChanges();
      expect(component.getHerirAdjustmentDetails).toBeDefined();
    });
    it('should getHerirAdjustmentDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.getHerirAdjustmentDetails(component.sin, component.benefitRequestId, component.personId);
      benefitPropertyServiceSpy.getHeirAdjustmentDetails.and.returnValue(throwError(genericError));
      fixture.detectChanges();
      expect(component.getHerirAdjustmentDetails).toBeDefined();
    });
  });
  describe('onPaymentHistoryTabSelected', () => {
    it('should onPaymentHistoryTabSelected', () => {
      component.onPaymentHistoryTabSelected();
      fixture.detectChanges();
      spyOn(component, 'getPaymentDetails').and.callThrough();
      expect(component.onPaymentHistoryTabSelected).toBeDefined();
    });
  });
  describe('getPaymentDetails', () => {
    it('should getPaymentDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      const identifier = 10015003;
      component.getPaymentDetails(component.sin, component.benefitRequestId, identifier);
      component.heirActiveService
        .getPaymentDetails(component.sin, component.benefitRequestId, identifier)
        .subscribe(res => {
          component.benefitPaymentDetails = res;
        });
      expect(component.getPaymentDetails).toBeDefined();
    });
  });
  describe('filterPaymentHistory', () => {
    it('should filterPaymentHistory', () => {
      const paymentHistoryFilter = new PaymentHistoryFilter();
      component.filterPaymentHistory(paymentHistoryFilter);
      fixture.detectChanges();
      component.manageBenefitService
        .filterPaymentHistory(component.sin, component.benefitRequestId, paymentHistoryFilter)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      expect(component.filterPaymentHistory).toBeDefined();
    });
  });
  describe('onEligibilityTabSelected', () => {
    it('should onEligibilityTabSelected', () => {
      spyOn(component, 'onEligibilityTabSelected');
      component.onEligibilityTabSelected();
      fixture.detectChanges();
      expect(component.onEligibilityTabSelected).toBeDefined();
    });
  });
  describe('navigateToAdjustmentDetails', () => {
    it('should navigateToAdjustmentDetails', () => {
      component.navigateToAdjustmentDetails();
      fixture.detectChanges();
      expect(component.navigateToAdjustmentDetails).toBeDefined();
    });
  });
  xdescribe('navigateToBenefitDetails', () => {
    it('should navigateToBenefitDetails', () => {
      const benefits = {
        benefitType: { english: '', arabic: '' }
      };
      component.navigateToBenefitDetails(benefits);
      fixture.detectChanges();
      expect(component.navigateToAdjustmentDetails).toBeDefined();
    });
  });
  describe('onTransactionTabSelected', () => {
    it('should onTransactionTabSelected', () => {
      spyOn(component, 'getTransactionHistoryDetails').and.callThrough();
      fixture.detectChanges();
      expect(component.onTransactionTabSelected).toBeDefined();
    });
  });
  describe(' navigateToAddModify', () => {
    it('should  navigateToAddModify', () => {
      component.navigateToAddModify();
      expect(component.navigateToAddModify).toBeDefined();
    });
  });
  describe('showCommitment', () => {
    it('should showCommitment', () => {
      component.commonModalRef = { ...new BsModalRef(), content: '' };
      spyOn(component.commonModalRef, 'hide');
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.showCommitment(templateRef);
      expect(component.showCommitment).toBeDefined();
    });
  });
  describe('getTransactionHistoryDetails', () => {
    it('should getTransactionHistoryDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.getTransactionHistoryDetails(component.sin, component.benefitRequestId);
      component.benefitPropertyService
        .getTransactionHistoryDetails(component.sin, component.benefitRequestId)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      expect(component.getTransactionHistoryDetails).toBeDefined();
    });
  });
  describe('transactionHistoryFilter', () => {
    it('should transactionHistoryFilter', () => {
      const transactionHistoryFilter = new TransactionHistoryFilter();
      component.transactionHistoryFilter(transactionHistoryFilter);
      component.benefitPropertyService
        .filterTransactionHistory(component.sin, component.benefitRequestId, transactionHistoryFilter)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      expect(component.transactionHistoryFilter).toBeDefined();
    });
  });
  xdescribe('onSearchTransactionId', () => {
    it('should onSearchTransactionId', () => {
      const transactionHistoryFilter = new TransactionHistoryFilter();
      component.onSearchTransactionId(transactionHistoryFilter);
      component.benefitPropertyService
        .filterTransactionHistory(component.sin, component.benefitRequestId, transactionHistoryFilter)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      expect(component.onSearchTransactionId).toBeDefined();
    });
  });
  describe('onDocumentTabSelected', () => {
    it('should onDocumentTabSelected', () => {
      spyOn(component, 'onDocumentTabSelected');
      component.onDocumentTabSelected();
      fixture.detectChanges();
      expect(component.onDocumentTabSelected).toBeDefined();
    });
  });
  describe('getScannedDocument', () => {
    it('should getScannedDocument', () => {
      component.benefitRequestId = 1005229;
      component.benefitDocumentService.getAllDocuments(component.benefitRequestId).subscribe(res => {
        component.scannedDocuments = res;
      });
      expect(component.getScannedDocument).toBeDefined();
    });
  });
  describe('getDocumentsForViewBank', () => {
    it('should getDocumentsForViewBank', () => {
      spyOn(component, 'getDocumentsForViewBank');
      component.getDocumentsForViewBank();
      component.benefitDocumentService
        .getUploadedDocuments(1003880624, 'RESTART_BENEFIT', 'REQUEST_BENEFIT_FO')
        .subscribe(res => {
          component.documentList = res;
        });
      fixture.detectChanges();
      expect(component.getDocumentsForViewBank).toBeDefined();
    });
  });
  describe('openImage', () => {
    it('should openImage', () => {
      const document = 'document';
      component.openImage(document);
      spyOn(component, 'openImage');
      fixture.detectChanges();
      expect(component.openImage).toBeDefined();
    });
  });
  xdescribe('navigateToModifyCommitment', () => {
    it('should navigateToModifyCommitment', () => {
      component.navigateToModifyCommitment();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  xdescribe('showCommitment', () => {
    it('should showCommitment', () => {
      spyOn(component, 'showCommitment');
      const templateRef = { elementRef: null, createEmbeddedView: null };
      component.showCommitment(templateRef);
      fixture.detectChanges();
      expect(component.showCommitment).toBeDefined();
    });
  });
  describe('showErrorMessage', () => {
    it('should show error message', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  describe('getSystemParamAndRundate', () => {
    it('should getSystemParamAndRundate', () => {
      component.getSystemParamAndRundate();
      expect(component.getSystemParamAndRundate).toBeDefined();
    });
  });
  describe('getIdentityLabel', () => {
    it('getIdentityLabel', () => {
      const idObj = new CommonIdentity();
      idObj.idType = 'PASSPORT';
      expect(idObj.idType).toEqual('PASSPORT');
      component.getIdentityLabel(idObj);
      expect(component.getIdentityLabel(idObj)).toBeDefined();
    });
    it('getIdentityLabel', () => {
      const idObj = new CommonIdentity();
      idObj.idType = 'NIN';
      expect(idObj.idType).toEqual('NIN');
      component.getIdentityLabel(idObj);
      expect(component.getIdentityLabel(idObj)).toBeDefined();
    });
    it('getIdentityLabel', () => {
      const idObj = new CommonIdentity();
      idObj.idType = 'IQAMA';
      expect(idObj.idType).toEqual('IQAMA');
      component.getIdentityLabel(idObj);
      expect(component.getIdentityLabel(idObj)).toBeDefined();
    });
    it('getIdentityLabel', () => {
      const idObj = new CommonIdentity();
      idObj.idType = 'BORDERNO';
      expect(idObj.idType).toEqual('BORDERNO');
      component.getIdentityLabel(idObj);
      expect(component.getIdentityLabel(idObj)).toBeDefined();
    });
    it('getIdentityLabel', () => {
      const idObj = new CommonIdentity();
      idObj.idType = 'GCCID';
      expect(idObj.idType).toEqual('GCCID');
      component.getIdentityLabel(idObj);
      expect(component.getIdentityLabel(idObj)).toBeDefined();
    });
  });
  xdescribe(' checkIdentity', () => {
    it('should checkIdentity', () => {
      const index = 1;
      fixture.detectChanges();
      expect(component.checkIdentity).toBeDefined();
      component.checkIdentity(index);
    });
  });
  xdescribe(' checkIdentityLabel', () => {
    it('should  checkIdentityLabel', () => {
      const index = 1;
      fixture.detectChanges();
      expect(component.checkIdentityLabel).toBeDefined();
      component.checkIdentityLabel(index);
    });
  });
  describe(' navigateToAddAdjustment', () => {
    it('should  navigateToAddAdjustment', () => {
      component.navigateToAddAdjustment();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('setAvailableStatus', () => {
    it('should setAvailableStatus', () => {
      component.setAvailableStatus([
        {
          ...new DependentDetails(),
          status: { english: '', arabic: '' },
          setValidatedValues: () => {},
          setSelectedStatus: () => {},
          fromJsonToObject: json => json
        }
      ]);
      expect(component.setAvailableStatus).toBeDefined();
    });
  });
  describe('navigateToModifyCommitment', () => {
    it('should  navigateToModifyCommitment', () => {
      component.navigateToModifyCommitment();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe(' navigateToAdjustment', () => {
    it('should  navigateToAdjustment', () => {
      const adjustmentId = 2342323;
      component.navigateToAdjustment(adjustmentId);
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('confirmAddCommitemnt', () => {
    it('should confirmAddCommitemnt', () => {
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      component.router.navigate([BenefitConstants.ROUTE_ADD_COMMITMENT]);
      component.confirmAddCommitemnt();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  xdescribe('setActiveAdjustments', () => {
    it('should  setActiveAdjustments', () => {
      component.setActiveAdjustments();
      expect(component.setActiveAdjustments).toBeDefined();
    });
  });
  // xdescribe('goToTransaction', () => {
  //   it('should goToTransaction', () => {
  //     const transaction = new Transaction();
  //     // component.goToTransaction(transaction);
  //     expect(component.goToTransaction).toHaveBeenCalled();
  //   });
  // });
  describe('onDocumentTabSelected', () => {
    it('should onDocumentTabSelected', () => {
      component.onDocumentTabSelected();
      expect(component.onDocumentTabSelected).toBeDefined();
    });
  });

  describe(' removeCommitment', () => {
    it('should removeCommitment', () => {
      component.removeCommitment();
      expect(component.router.navigate).toBeDefined();
    });
  });
  describe('setAvailableStatus', () => {
    it('should setAvailableStatus', () => {
      const lists = DependentDetails[1];
      component.setAvailableStatus(lists);
      expect(component.setAvailableStatus).toBeDefined();
    });
  });
  describe('onTransactionTabSelected', () => {
    it('should onTransactionTabSelected(', () => {
      component.onTransactionTabSelected();
      expect(component.onTransactionTabSelected).toBeDefined();
    });
  });
});
