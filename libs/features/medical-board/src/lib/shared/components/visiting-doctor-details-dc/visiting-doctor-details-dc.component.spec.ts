/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  CommonIdentity,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  LanguageToken,
  Lov,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionParams,
  TransactionService,
  CoreBenefitService,
  CoreActiveBenefits,
  AlertService,
  LookupService,
  WorkflowService
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  BilingualTextPipeMock,
  DocumentServiceStub,
  ModalServiceStub
} from 'testing';

import { Contracts, DoctorService, MedicalBoardService, MemberData, MemberService, PersonWrapper, UpdateDoctorResponse, VisitingDoctorDetailsDcComponent } from '@gosi-ui/features/medical-board/lib/shared';



const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('VisitingDoctorDetailsDcComponent', () => {
  let component: VisitingDoctorDetailsDcComponent;
  let fixture: ComponentFixture<VisitingDoctorDetailsDcComponent>;
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

  const memberServicespy = jasmine.createSpyObj<MemberService>('MemberService', [
    
  ]);

  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', [
    'getDocuments',
    'refreshDocument'
    
  ]);

  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  documentServicespy.getDocuments.and.returnValue(of([new DocumentItem()]));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [VisitingDoctorDetailsDcComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: DocumentService, useValue:   documentServicespy },
        { provide: MemberService, useValue: memberServicespy },
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitingDoctorDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy();
  });
});*/
