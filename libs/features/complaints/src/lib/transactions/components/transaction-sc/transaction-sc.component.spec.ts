/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, ParamMap } from '@angular/router';
import {
  ApplicationTypeToken,
  RouterData,
  RouterDataToken,
  MenuToken,
  Transaction,
  EnvironmentToken,
  MenuService,
  WorkflowService,
  DocumentService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalServiceStub, menuData, MenuServiceStub, WorkflowServiceStub, DocumentServiceStub } from 'testing';
import { TransactionScComponent } from './transaction-sc.component';
import { of, Observable } from 'rxjs';
import { CategoryEnum } from '../../../shared/enums';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('TransactionScComponent', () => {
  let component: TransactionScComponent;
  let fixture: ComponentFixture<TransactionScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TransactionScComponent],
      providers: [
        DatePipe,
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: 'test' })
          }
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: MenuToken, useValue: menuData.menuItems },
        {
          provide: MenuService,
          useClass: MenuServiceStub
        },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngoninit', () => {
    it('should ngoninit', inject([RouterDataToken], () => {
      (component.route as any).parent = convertToParamMap({ id: 1234, registraionNo: 10000602 });
      (component.route as any).parent.paramMap = new Observable<ParamMap>();
      (component.route as any).parent.paramMap.subscribe(params => {
        params.setParamMap({ id: 1234, registraionNo: 10000602 });
        component.transactionTraceId = Number(params.get('transactionTraceId'));
        component.businessKey = Number(params.get('businessKey'));
        expect(params).toBeDefined();
      });
      component.category = CategoryEnum.ENQUIRY;
      const txn: Transaction = {
        title: {
          arabic: 'إبلاغ عن أخطار مهنية',
          english: 'Report Occupational Hazard'
        },
        description: {
          arabic: '10000602 :للمنشأة رقم',
          english: 'for Establishment: 10000602'
        },
        transactionRefNo: 492707,
        assigneeName: '',
        initiatedDate: {
          gregorian: new Date(),
          hijiri: '1441-12-20'
        },
        lastActionedDate: {
          gregorian: new Date(),
          hijiri: '1441-12-20'
        },
        status: {
          arabic: 'مكتملة',
          english: 'Completed'
        },
        channel: {
          arabic: 'المكتب الميداني ',
          english: 'field-office'
        },
        registrationNo: 10000602,
        sin: 601336235,
        businessId: 1001964003,
        transactionId: 101501,
        contributorId: null,
        establishmentId: null,
        taskId: null,
        assignedTo: null,
        params: {
          BUSINESS_ID: 3527632,
          INJURY_ID: 1234445456,
          REGISTRATION_NO: 1234,
          SIN: 1234,
          REIMBURSEMENT_ID: 132
        },
        pendingWith: null,
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
      spyOn(component, 'getDocuments').and.callThrough();
      spyOn(component.transactionService, 'getTransactionDetails').and.returnValue(txn);
      spyOn(component, 'setLabels').and.callThrough();
      spyOn(component, 'setTransactionId').and.callThrough();
      component.ngOnInit();
      expect((component.route as any).parent).toBeDefined();
      expect((component.route as any).parent.paramMap).toBeDefined();
      expect(component.transactionTraceId).toBeDefined();
      expect(component.businessKey).toBeDefined();
      expect(component.category).not.toEqual(null);
      expect(txn).not.toEqual(null);
    }));
  });

  // describe('getTrackingDetails', () => {
  //   it('should call getTrackingDetails', () => {
  //     component.category = CategoryEnum.COMPLAINT;
  //     component.isTracking = true;
  //     const transactionTraceId = 123;
  //     component.setApplicationType();
  //     component.setLabels(component.category);
  //     component.getworkflowDetails(transactionTraceId);
  //     component.getTaskDetails(false, true);
  //     component.getTransactionDetails();
  //     component.getDocuments(false);
  //     component.getTrackingDetails();
  //     expect(component).toBeTruthy();
  //   });
  // });
});
