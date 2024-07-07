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
  Transaction
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { AlertServiceStub, DocumentServiceStub, InjuryMockService, ModalServiceStub, OhMockService } from 'testing';
import { InjuryService, OhService, ComplicationService } from '../../../shared/services';
import { ReportComplicationScComponent } from './report-complication-sc.component';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
describe('ReportOccupationalHazardScComponent', () => {
  let component: ReportComplicationScComponent;
  let fixture: ComponentFixture<ReportComplicationScComponent>;

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
      declarations: [ReportComplicationScComponent],
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
        { provide: ComplicationService, useClass: OhMockService },
        { provide: OhService, useClass: OhMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportComplicationScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ReportComplicationScComponent);
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
        },
        idParams: new Map(),
        fromJsonToObject(json) {
          Object.keys(new Transaction()).forEach(key => {
            if (key in json) {
              if (key === 'params' && json[key]) {
                this[key] = json[key];
                const params = json.params;
                Object.keys(params).forEach(paramKey => {
                  this.idParams.set(paramKey, params[paramKey]);
                });
              } else {
                this[key] = json[key];
              }
            }
          });
          return this;
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
          REIMBURSEMENT_ID: 132
        },
        idParams: new Map(),
        fromJsonToObject(json) {
          Object.keys(new Transaction()).forEach(key => {
            if (key in json) {
              if (key === 'params' && json[key]) {
                this[key] = json[key];
                const params = json.params;
                Object.keys(params).forEach(paramKey => {
                  this.idParams.set(paramKey, params[paramKey]);
                });
              } else {
                this[key] = json[key];
              }
            }
          });
          return this;
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.transaction.transactionId = 101574;
      expect(component.ngOnInit()).toBe(routerSpy.navigate('../'));
    });
  });

  describe(' setRoute', () => {
    it('should call setRoute', () => {
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
        },
        idParams: new Map(),
        fromJsonToObject(json) {
          Object.keys(new Transaction()).forEach(key => {
            if (key in json) {
              if (key === 'params' && json[key]) {
                this[key] = json[key];
                const params = json.params;
                Object.keys(params).forEach(paramKey => {
                  this.idParams.set(paramKey, params[paramKey]);
                });
              } else {
                this[key] = json[key];
              }
            }
          });
          return this;
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.setRoute();
      expect(component.ohService.getTransactionId()).not.toBe(null);
    });
  });
  describe(' viewComplication', () => {
    it('should call viewComplication', () => {
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
        },
        idParams: new Map(),
        fromJsonToObject(json) {
          Object.keys(new Transaction()).forEach(key => {
            if (key in json) {
              if (key === 'params' && json[key]) {
                this[key] = json[key];
                const params = json.params;
                Object.keys(params).forEach(paramKey => {
                  this.idParams.set(paramKey, params[paramKey]);
                });
              } else {
                this[key] = json[key];
              }
            }
          });
          return this;
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.viewComplication();
      expect(component.ohService.getTransactionId()).not.toBe(null);
    });
  });
  describe(' viewInjury', () => {
    it('should call viewInjury', () => {
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
        },
        idParams: new Map(),
        fromJsonToObject(json) {
          Object.keys(new Transaction()).forEach(key => {
            if (key in json) {
              if (key === 'params' && json[key]) {
                this[key] = json[key];
                const params = json.params;
                Object.keys(params).forEach(paramKey => {
                  this.idParams.set(paramKey, params[paramKey]);
                });
              } else {
                this[key] = json[key];
              }
            }
          });
          return this;
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.viewInjury();
      expect(component.ohService.getTransactionId()).not.toBe(null);
    });
  });
  describe(' getModifiedComplicationData', () => {
    it('should call getModifiedComplicationData', () => {
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
        },
        idParams: new Map(),
        fromJsonToObject(json) {
          Object.keys(new Transaction()).forEach(key => {
            if (key in json) {
              if (key === 'params' && json[key]) {
                this[key] = json[key];
                const params = json.params;
                Object.keys(params).forEach(paramKey => {
                  this.idParams.set(paramKey, params[paramKey]);
                });
              } else {
                this[key] = json[key];
              }
            }
          });
          return this;
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.getModifiedComplicationData();
      expect(component.modifiedcomplicationDetails).not.toBe(null);
    });
  });
  describe(' fetchTransient', () => {
    it('should call fetchTransient', () => {
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
        },
        idParams: new Map(),
        fromJsonToObject(json) {
          Object.keys(new Transaction()).forEach(key => {
            if (key in json) {
              if (key === 'params' && json[key]) {
                this[key] = json[key];
                const params = json.params;
                Object.keys(params).forEach(paramKey => {
                  this.idParams.set(paramKey, params[paramKey]);
                });
              } else {
                this[key] = json[key];
              }
            }
          });
          return this;
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.fetchTransient();
      expect(component.transientComplicationDetails).not.toBe(null);
    });
  });
  describe(' fetchComplicationData', () => {
    it('should call fetchComplicationData', () => {
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
        },
        idParams: new Map(),
        fromJsonToObject(json) {
          Object.keys(new Transaction()).forEach(key => {
            if (key in json) {
              if (key === 'params' && json[key]) {
                this[key] = json[key];
                const params = json.params;
                Object.keys(params).forEach(paramKey => {
                  this.idParams.set(paramKey, params[paramKey]);
                });
              } else {
                this[key] = json[key];
              }
            }
          });
          return this;
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.fetchComplicationData();
      expect(component.complicationDetails).not.toBe(null);
    });
  });
});
