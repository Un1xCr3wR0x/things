import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  BpmTaskRequest,
  EnvironmentToken,
  LanguageToken,
  MenuService,
  Transaction,
  TransactionReferenceData,
  TransactionWorkflowDetails
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, MenuServiceStub, transactionReferenceData, workflowListMockData } from 'testing';
import { TransactionService } from '../../services';
import { TransactionViewScComponent } from './transaction-view-sc.component';

describe('TransactionViewScComponent', () => {
  let component: TransactionViewScComponent;
  let fixture: ComponentFixture<TransactionViewScComponent>;
  let route: ActivatedRouteStub;
  route = new ActivatedRouteStub();
  route.setQueryParams({ transactionRefId: 'bf93d841', transactionId: 'bf93d841' });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionViewScComponent],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        NgxPaginationModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ModalModule.forRoot()
      ],
      providers: [
        TransactionService,
        DatePipe,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080' }
        },
        {
          provide: MenuService,
          useClass: MenuServiceStub
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: MenuService,
          useValue: MenuServiceStub
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: route, useValue: route },
        BsModalService,
        HttpClientModule,
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionViewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getComments', () => {
    it('should get comments', () => {
      const bpmTaskRequest = new BpmTaskRequest();
      bpmTaskRequest.taskId = '1234';
      component.transaction = new Transaction();
      component.transaction.taskId = '1234';
      component.transaction.title = {
        english: 'Reimbursement Request',
        arabic: 'Reimbursement Request'
      };
      spyOn(component.workflowService, 'getCommentsById').and.returnValue(
        of(bindToObject(new TransactionReferenceData(), transactionReferenceData))
      );
      component.getComments();
      expect(component.comment).not.toEqual(null);
    });
  });
  describe('getWorkflow', () => {
    it('should get Workflow', () => {
      component.transaction = new Transaction();
      component.transaction.transactionRefNo = 123;
      component.transaction.transactionId = 101530;
      component.transaction.status = new BilingualText();
      component.transaction.status.english = 'Completed';
      spyOn(component.workflowService, 'getWorkFlowDetails').and.returnValue(
        of(bindToObject(new TransactionWorkflowDetails(), workflowListMockData))
      );
      component.getWorkflow();
      expect(component.workflow).not.toEqual(null);
      expect(component.transaction.transactionId).toEqual(101530);
      expect(component.showWorkflow).toEqual(false);
    });
  });
});
