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
import {
  AlertServiceStub,
  DocumentServiceStub,
  genericDocumentItem,
  InjuryMockService,
  ModalServiceStub,
  OhMockService
} from 'testing';
import { InjuryService, OhService } from '../../../shared/services';
import { ReimbursementRequestScComponent } from './reimbursement-request-sc.component';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
describe('ReimbursementRequestScComponent', () => {
  let component: ReimbursementRequestScComponent;
  let fixture: ComponentFixture<ReimbursementRequestScComponent>;

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
      declarations: [ReimbursementRequestScComponent],
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
      declarations: [ReimbursementRequestScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ReimbursementRequestScComponent);
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
        assigneeName: '',
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
        pendingWith: null,
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
      component.bussinessId = 3527632;
      // component.transaction = transaction;
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
        },
        assigneeName: '',
        idParams: new Map(),
        pendingWith: null,
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
      component.bussinessId = 3527632;
      // component.transaction = transaction;
      component.transactionService.setTransactionDetails(transaction);
      spyOn(component.documentService, 'getMultipleDocuments').and.callFake(() => of([genericDocumentItem]));
      component.ngOnInit();
      expect(component.injuryId).not.toBe(null);
    });
  });
  /*describe(' ngOninit else case', () => {
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
      component.bussinessId =3527632;
      component.transaction= transaction;
      spyOn(component.documentService, 'getMultipleDocuments').and.callThrough();
      component.transactionService.setTransactionDetails(transaction);
      expect(component.documentService.getMultipleDocuments).toHaveBeenCalledWith(
        3527632,
        OHTransactionType.REIMBURSEMENT_CLAIM,
        12345);
      //expect(component.ngOnInit()).toBe(routerSpy.navigate('../'));
    });
  });*/
});
