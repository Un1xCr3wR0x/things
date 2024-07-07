/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  TransactionService,
  Transaction
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub } from 'testing';
import { MedicalBoardAssesmentBenefitRecalculationScComponent } from './medical-board-assesment-benefit-recalculation-sc.component';

describe('MedicalBoardAssesmentBenefitRecalculationScComponent', () => {
  let component: MedicalBoardAssesmentBenefitRecalculationScComponent;
  let fixture: ComponentFixture<MedicalBoardAssesmentBenefitRecalculationScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const transactionServicespy = jasmine.createSpyObj<TransactionService>('TransactionService', [
    'getTransactionDetails'
  ]);
  transactionServicespy.getTransactionDetails.and.returnValue(new Transaction());
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: TransactionService, useValue: transactionServicespy },
        { provide: Router, useValue: routerSpy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        FormBuilder,
        DatePipe
      ],
      declarations: [MedicalBoardAssesmentBenefitRecalculationScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalBoardAssesmentBenefitRecalculationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
