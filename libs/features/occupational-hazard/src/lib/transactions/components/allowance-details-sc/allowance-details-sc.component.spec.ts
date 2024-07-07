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
  TransactionService,
  bindToObject
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  DocumentServiceStub,
  InjuryMockService,
  ModalServiceStub,
  OhMockService,
  holdAllowanceDetailsThree,
  genericErrorOh
} from 'testing';
import { InjuryService, OhService } from '../../../shared/services';
import { AllowanceDetailsScComponent } from './allowance-details-sc.component';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
describe('AllowancePayeeScComponent', () => {
  let component: AllowanceDetailsScComponent;
  let fixture: ComponentFixture<AllowanceDetailsScComponent>;

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
      declarations: [AllowanceDetailsScComponent],
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
        { provide: OhService, useClass: OhMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: TransactionService, useClass: OhMockService },
        { provide: OhClaimsService, useClass: OhMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllowanceDetailsScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(AllowanceDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
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
        transactionId: 101574,
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
        transactionId: 101574,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 1234,
          SIN: 1234
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      expect(component.ngOnInit()).toBe(routerSpy.navigate('../'));
    });
  });

  describe('navigate', () => {
    it('should navigate', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.getAllowance();
      component.allowanceDetailsWrapper.ohType = 0;
      component.viewInjury();
      expect(component.ohService.getRoute).not.toBe(null);
    });
  });
  describe('viewDetails', () => {
    it('should viewDetails', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.getAllowance();
      component.allowanceDetailsWrapper.ohType = 2;
      component.viewInjury();
      expect(component.ohService.getRoute).not.toBe(null);
    });
  });
  describe('viewDetails', () => {
    it('should viewDetails', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.getAllowance();
      component.allowanceDetailsWrapper.ohType = 1;
      component.viewInjury();
      expect(component.message).not.toBe(null);
    });
  });
});
