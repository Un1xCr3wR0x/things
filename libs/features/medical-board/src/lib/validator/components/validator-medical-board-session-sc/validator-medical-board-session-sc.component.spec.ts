/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  LookupService,
  BilingualText,
  Alert,
  RouterDataToken,
  RouterData,
  LanguageToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertServiceStub,
  ActivatedRouteStub,
  genericError,
  LookupServiceStub,
  DoctorServiceStub,
  MemberServiceStub,
  ModalServiceStub,
  BilingualTextPipeMock
} from 'testing';
import { throwError, of, BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { DatePipe } from '@angular/common';
import { Contracts, DoctorService, MemberData, PersonWrapper, UpdateDoctorResponse } from '@gosi-ui/features/medical-board/lib/shared';
import { ValidatorMedicalBoardSessionScComponent } from './validator-medical-board-session-sc.component';

export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ identificationNo: 2015767656 });

describe('ValidatorMedicalBoardSessionScComponent', () => {
  let component: ValidatorMedicalBoardSessionScComponent;
  let fixture: ComponentFixture<ValidatorMedicalBoardSessionScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const doctorServiceSpy = jasmine.createSpyObj<DoctorService>('DoctorService',[
    'getContractDetails',
    'getContractProfileDetail',
    'getContractDataDetail',
    'getPersonDetails',
    'getPerson'

  ]);
  doctorServiceSpy.getContractDetails.and.returnValue(of(new Contracts[0]()));
  doctorServiceSpy.getContractProfileDetail.and.returnValue(of(new MemberData[0]()));
  doctorServiceSpy.getContractDataDetail.and.returnValue(of(new UpdateDoctorResponse[0]()));
  doctorServiceSpy.getPerson.and.returnValue(of(new PersonWrapper[0]()));
  doctorServiceSpy.revertTransactionDetails.and.returnValue(of(true));
  doctorServiceSpy.getPersonDetails.and.returnValue(of(new UpdateDoctorResponse[0]()));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ValidatorMedicalBoardSessionScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: DoctorService, useValue: doctorServiceSpy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidatorMedicalBoardSessionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
