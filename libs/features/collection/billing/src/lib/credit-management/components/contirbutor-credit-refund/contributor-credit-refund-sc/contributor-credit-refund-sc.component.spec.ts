/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  CurrencyToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  StorageService
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  BilingualTextPipeMock,
  BillEstablishmentServiceStub,
  CreditManagementServiceServiceStub,
  gccEstablishmentDetailsMockData,
  genericError,
  ModalServiceStub,
  StorageServiceStub,
  ReportStatementServiceStub
} from 'testing';
import { BillingConstants } from '../../../../shared/constants/billing-constants';
import { EstablishmentDetails } from '../../../../shared/models';
import { CreditManagementService, EstablishmentService, ReportStatementService } from '../../../../shared/services';

import { ContributorCreditRefundScComponent } from './contributor-credit-refund-sc.component';

describe('ContributorCreditRefundScComponent', () => {
  let component: ContributorCreditRefundScComponent;
  let fixture: ComponentFixture<ContributorCreditRefundScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ContributorCreditRefundScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: CreditManagementService, useClass: CreditManagementServiceServiceStub },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: StorageService, useClass: StorageServiceStub },

        { provide: BsModalService, useClass: ModalServiceStub },

        FormBuilder,
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ApplicationTypeToken, useValue: 'PUBLIC' },

        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        },
        { provide: ReportStatementService, useClass: ReportStatementServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorCreditRefundScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should set values from params', () => {
      component.route.queryParams = of({
        socialInsuranceNo: 12563365,
        registrationNumber: 1234567,
        isUserLoggedIn: 'true'
      });
      spyOn(component, 'checkContributorDetails');
      component.ngOnInit();
      expect(component.socialInsuranceNumber).toEqual(12563365);
      expect(component.registrationNumber).toEqual(1234567);
      component.checkContributorDetails();
      expect(component.contributorDetails).toBeDefined();
    });
    it('should initialise the components', inject([RouterDataToken], token => {
      token.taskId = 'asdasdasd';
      token.payload =
        '{"registrationNumber": 231, "requestNo ": 231,"referenceNumber ": 231, "socialInsuranceNumber" :123}';
      component.isWorkflow = true;
      component.routerDataToken.payload = true;
      component.registrationNumber = 502351249;
      component.requestNo = 789;
      component.referenceNumber = 502351249;
      component.socialInsuranceNumber = 123;
      component.ngOnInit();
      component.searchContributor();
      expect(component.referenceNumber).toBeDefined();
      expect(component.requestNo).toBeDefined();
      expect(component.registrationNumber).toBeDefined();
      expect(component.socialInsuranceNumber).toBeDefined();
      expect(component.lang).not.toEqual(null);
    }));
  });
  describe('getTerminationDetails', () => {
    it('Should get Termination Details', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
        of(bindToObject(new EstablishmentDetails(), gccEstablishmentDetailsMockData))
      );
      component.getBackdatedTeminationTransactionsDet();
      expect(component.establishmentService.getEstablishment).toHaveBeenCalled();
    });
  });

  describe('navigateToRefundAmountPage', () => {
    it('should navigate to refund amount', () => {
      component.registrationNumber = 10000076;
      component.socialInsuranceNumber = 372224088;
      component.referenceNumber = 1001;
      component.requestNo = 333;
      spyOn(component.router, 'navigate');
      component.navigateToRefundAmountPage();
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BillingConstants.CONTRIBUTOR_REFUND_AMOUNT_ROUTE],
        Object({
          queryParams: Object({
            socialInsuranceNo: 372224088,
            registrationNumber: 10000076,
            workflow: false,
            requestNo: 333,
            referenceNumber: 1001
          })
        })
      );
    });
  });
  describe('showErrorMessage', () => {
    it('Should call showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  it('should check for edit mode in contributor refund', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'cancel-establishment-payment' }, { path: 'edit' }]);
    component.identifyTheTransaction();
    expect(component.isWorkflow).toBeTruthy();
  }));
  // it('should read keys from token in edit mode in contributor refund', inject([RouterDataToken], token => {
  //   token.taskId = 'asdasdasd';
  //   token.payload =
  //     '{"referenceNumber": 200085744, "requestNo": 231, "registrationNumber": 23441, "socialInsuranceNumber": 231}';
  //   component.isWorkflow = true;
  //   expect(component.referenceNumber).toBeUndefined();
  //   expect(component.requestNo).toBeUndefined();
  //   expect(component.registrationNumber).toBeUndefined();
  //   expect(component.socialInsuranceNumber).toBeUndefined();
  //   expect(component.isUserLoggedIn).toBeFalsy();
  //   component.searchContributor();
  //   expect(component.contributorDetails).not.toBeNull();
  // }));

  describe('SelectedTerminationPeriod', () => {
    let selectedPeriod = [
      {
        startDate: { gregorian: new Date('2020-01-01'), hijiri: '' },
        endDate: { gregorian: new Date('2020-12-01'), hijiri: '' },
        engagementId: 12,
        contributorShare: 2000,
        transactionDate: { gregorian: new Date('2020-12-01'), hijiri: '' }
      }
    ];
    it('Should call selectedTerminationPeriod', () => {
      spyOn(component.creditManagementService, 'setSelectedTerminationPeriod');
      component.selectedTerminationPeriod(selectedPeriod);
      expect(component.creditManagementService.setSelectedTerminationPeriod).toHaveBeenCalled();
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
  describe('hideModal', () => {
    it('should show modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  // describe('test suite for printTransaction', () => {
  //   it('It should print transaction', () => {
  //     spyOn(component.reportStatementService, 'generateCreditRefundStatement').and.returnValue(of(new Blob()));
  //     spyOn(window, 'open');
  //     component.generateStatement();
  //     expect(component.reportStatementService.generateCreditRefundStatement).toHaveBeenCalled();
  //   });
  // });

  describe('test suite for downloadTransaction', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'generateCreditRefundStatement').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.generateStatement();
      expect(component.reportStatementService.generateCreditRefundStatement).toHaveBeenCalled();
    });
  });
  describe('getBackdatedTeminationTransactionsDet', () => {
    it('should show establishService ', () => {
      component.registrationNumber = 200085744;
      component.getBackdatedTeminationTransactionsDet();
      spyOn(component.establishmentService, 'getEstablishment');
      expect(component.establishmentDetails).not.toEqual(null);
    });
  });
  // describe('setRefundExceededError', () => {
  //   it('should show setRefundExceededError ', () => {
  //     component.setRefundExceededError(true);

  //     expect(component.refundAmountExceedError ).toBeTruthy();
  // expect(scrollToTop()).toHaveBeenCalled();
  //   });
  // });
  describe('navigateToHome', () => {
    it('It should navigate', () => {
      spyOn(component.router, 'navigate');
      spyOn(component, 'hideModal');
      component.navigateToHome();
      expect(component.router.navigate).toHaveBeenCalledWith([
        'home/billing/credit-transfer/contributor-refund-credit-balance/refresh'
      ]);
    });
  });
  describe('onCancel', () => {
    it('It should navigates', () => {
      spyOn(component.router, 'navigate');
      component.onCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([
        'home/billing/credit-transfer/contributor-refund-credit-balance/refresh'
      ]);
    });
  });

  describe('getEstablishmentDetails', () => {
    it('should get establishment details error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'searchContributor').and.returnValue(throwError(genericError));
      component.checkContributorDetails();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getEstablishmentDetails', () => {
    // it('should get establishment details error', () => {
    //   spyOn(component.alertService, 'showError');
    //   spyOn(component.creditManagementService, 'getBackdatedTeminationTransactionsDetails')
    //   component.getContributorRefundDetails();
    //   expect(component.creditManagementService.getBackdatedTeminationTransactionsDetails).toHaveBeenCalled();
    // });
    it('should get establishment details error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getBackdatedTeminationTransactionsDetails').and.returnValue(
        throwError(genericError)
      );
      component.getContributorRefundDetails();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('setRefundExceededError', () => {
    it('should show setRefundExceededError', () => {
      component.setRefundExceededError(true);
      expect(component.refundAmountExceedError).toBeTruthy();
    });
  });
  describe('getBackdatedTerminationValues', () => {
    it('should getBackdatedTerminationValues error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getBackdatedTerminationDetails').and.returnValue(
        throwError(genericError)
      );
      component.getBackdatedTerminationValues();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('getBackdatedTerminationValues', () => {
    it('should getBackdatedTerminationValues', () => {
      component.getBackdatedTerminationValues();
      expect(component.transactionsDetails).not.toEqual(null);
    });
  });
  describe('checkContributorDetails', () => {
    it('should show checkContributorDetails', () => {
      component.checkContributorDetails();
      expect(component.contributorDetails).not.toEqual(null);
    });
  });
});
