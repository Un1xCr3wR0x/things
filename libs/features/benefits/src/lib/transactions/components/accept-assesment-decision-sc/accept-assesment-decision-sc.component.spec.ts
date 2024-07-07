/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  EnvironmentToken,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  LanguageToken,
  TransactionService,
  Transaction,
  TransactionParams
} from '@gosi-ui/core';

import { AcceptAssesmentDecisionScComponent } from './accept-assesment-decision-sc.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub, ModalServiceStub } from 'testing';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';

describe('AcceptAssesmentDecisionScComponent', () => {
  let component: AcceptAssesmentDecisionScComponent;
  let fixture: ComponentFixture<AcceptAssesmentDecisionScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const transactionServiceSpy = jasmine.createSpyObj<TransactionService>('TransactionService', [
    'getTransactionDetails'
  ]);
  transactionServiceSpy.getTransactionDetails.and.returnValue({
    ...new Transaction(),
    fromJsonToObject: json => json,
    transactionRefNo: 1234,
    transactionId: 1234,
    businessId: 1234,
    params: {
      ...new TransactionParams(),
      IDENTIFIER: '1234',
      MISC_PAYMENT_ID: 1234
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
        DatePipe,
        { provide: TransactionService, useValue: transactionServiceSpy }
      ],
      declarations: [AcceptAssesmentDecisionScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptAssesmentDecisionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
