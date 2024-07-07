/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  RouterData,
  RouterDataToken,
  TransactionService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import {
  AlertServiceStub,
  DocumentServiceStub,
  InjuryMockService,
  ModalServiceStub,
  OhMockService,
  injuryDetailsTestData
} from 'testing';
import { InjuryService, OhService } from '../../../shared/services';
import { ReportOccupationalHazardScComponent } from './report-occupational-hazard-sc.component';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
describe('ReportOccupationalHazardScComponent', () => {
  let component: ReportOccupationalHazardScComponent;
  let fixture: ComponentFixture<ReportOccupationalHazardScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserDynamicTestingModule
      ],
      declarations: [ReportOccupationalHazardScComponent],
      providers: [
        OhService,
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              paramMap: of({
                get: () => 12345
              })
            }
          }
        },
        { provide: Router, useValue: routerSpy },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: TransactionService, useClass: OhMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportOccupationalHazardScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ReportOccupationalHazardScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(' setServiceVariables', () => {
    it('should  call setServiceVariables', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'Reopen Injury',
          arabic: ''
        },
        description: null,
        contributorId: 132123,
        establishmentId: 12434,
        initiatedDate: null,
        lastActionedDate: null,
        status: null,
        channel: null,
        transactionId: 12345,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 1234,
          SIN: 1234,
          REIMBURSEMENT_ID: 132
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      spyOn(component, 'setServiceVariables').and.callThrough();
      component.setServiceVariables();
      expect(component.setServiceVariables).toHaveBeenCalled();
    });
  });

  describe(' ngOninit', () => {
    it('getTransactionDetails', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'Reopen Injury',
          arabic: ''
        },
        description: null,
        contributorId: 132123,
        establishmentId: 12434,
        initiatedDate: null,
        lastActionedDate: null,
        status: null,
        channel: null,
        transactionId: 12345,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 1234,
          SIN: 1234,
          REIMBURSEMENT_ID: 132
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.ngOnInit();
      expect(component.injuryId).not.toBe(null);
    });
  });
  describe(' ngOninit else case', () => {
    it('should call router.navigate', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'Reopen Injury',
          arabic: ''
        },
        description: null,
        contributorId: 132123,
        establishmentId: 12434,
        initiatedDate: null,
        lastActionedDate: null,
        status: null,
        channel: null,
        transactionId: 12345,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 1234,
          SIN: 1234,
          REIMBURSEMENT_ID: 132
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      expect(component.ngOnInit()).toBe(routerSpy.navigate('../'));
    });
  });
  describe('getModifiedInjuryData', () => {
    it('should getModifiedInjuryData', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'Reopen Injury',
          arabic: ''
        },
        description: null,
        contributorId: 132123,
        establishmentId: 12434,
        initiatedDate: null,
        lastActionedDate: null,
        status: null,
        channel: null,
        transactionId: 101573,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 10000602,
          SIN: 601336235,
          REIMBURSEMENT_ID: 132
        }
      };
      component.transaction.transactionId = 101571;
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.injuryId = 1234445456;
      component.refNo = 3527632;
      component.transactionService.setTransactionDetails(transaction);
      // spyOn(component.injuryService, 'getModifiedInjuryDetails').and.returnValue(
      //   of(injuryDetailsTestData.injuryDetailsDto)
      // );
      component.getModifiedInjuryData();
      expect(component.modifiedInjuryDetails).not.toBe(null);
    });
  });
  describe('fetchTransient', () => {
    it('should fetchTransient', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'Reopen Injury',
          arabic: ''
        },
        description: null,
        contributorId: 132123,
        establishmentId: 12434,
        initiatedDate: null,
        lastActionedDate: null,
        status: null,
        channel: null,
        transactionId: 101573,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 10000602,
          SIN: 601336235,
          REIMBURSEMENT_ID: 132
        }
      };
      component.transaction.transactionId = 101573;
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.injuryId = 1234445456;
      component.refNo = 3527632;
      component.transactionService.setTransactionDetails(transaction);
      // spyOn(component.injuryService, 'getInjuryDetails').and.returnValue(of(injuryDetailsTestData));
      component.fetchTransient();
      expect(component.transientDetails).not.toBe(null);
    });
  });
  describe('setRoute', () => {
    it('should setRoute', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'Reopen Injury',
          arabic: ''
        },
        description: null,
        contributorId: 132123,
        establishmentId: 12434,
        initiatedDate: null,
        lastActionedDate: null,
        status: null,
        channel: null,
        transactionId: 101573,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 10000602,
          SIN: 601336235,
          REIMBURSEMENT_ID: 132
        }
      };
      component.transaction.transactionId = 101573;
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.injuryId = 1234445456;
      component.refNo = 3527632;
      component.transactionService.setTransactionDetails(transaction);
      spyOn(component, 'setRoute');
      spyOn(component.ohService, 'setTransactionId');
      component.setRoute();
      expect(component.setRoute).toHaveBeenCalled();
    });
  });
});
