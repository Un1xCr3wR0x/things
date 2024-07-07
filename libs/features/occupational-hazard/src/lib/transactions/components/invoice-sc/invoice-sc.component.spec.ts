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
import { AlertServiceStub, DocumentServiceStub, InjuryMockService, ModalServiceStub, OhMockService } from 'testing';
import { InjuryService, OhService } from '../../../shared/services';
import { InvoiceScComponent } from './invoice-sc.component';
import { Route } from '../../../shared';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
describe('InvoiceScComponent', () => {
  let component: InvoiceScComponent;
  let fixture: ComponentFixture<InvoiceScComponent>;

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
      declarations: [InvoiceScComponent],
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
        { provide: TransactionService, useClass: OhMockService },
        { provide: OhClaimsService, useClass: OhMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(InvoiceScComponent);
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
          SIN: 1234,
          REIMBURSEMENT_ID: 132,
          TPA_CODE: 'TCS'
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      expect(component.ngOnInit()).toBe(routerSpy.navigate('../'));
    });
    it('should navigateTo', () => {
      const details = {
        type: 0,
        regNo: 601336235,
        sin: 1000602,
        injuryNo: 21324343,
        id: 234235346
      };
      component.navigateTo(details);
      expect(component.ohService.getRoute()).toEqual(Route.INVOICE);
    });
    it('should navigateTo', () => {
      const details = {
        type: 1,
        regNo: 601336235,
        sin: 1000602,
        injuryNo: 21324343,
        id: 234235346
      };
      component.navigateTo(details);
      expect(component.diseaseIdMessage).toEqual('OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE');
    });
    it('should navigateTo', () => {
      const details = {
        type: 2,
        regNo: 601336235,
        sin: 1000602,
        injuryNo: 21324343,
        id: 234235346
      };
      component.navigateTo(details);
      expect(component.ohService.getRoute()).toEqual(Route.INVOICE);
    });
  });
});