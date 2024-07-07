/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
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
import { ModifyContractScComponent } from './modify-contract-sc.component';
import { Contracts, DoctorService, MedicalBoardService, MemberData, UpdateDoctorResponse } from '@gosi-ui/features/medical-board/lib/shared';


const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ModifyContractScComponent', () => {
  let component: ModifyContractScComponent;
  let fixture: ComponentFixture<ModifyContractScComponent>;
  const doctorServiceSpy = jasmine.createSpyObj<DoctorService>('DoctorService',[
    'getContractDetails',
    'getFees',
    'modifyDoctorDetail',
    'getmbProfessionalId',
    'revertTransactionDetails',
    'submitModifyContractDetail'

  ]);
  doctorServiceSpy.getContractDetails.and.returnValue(of(new Contracts[0]()));
  doctorServiceSpy.getFees.and.returnValue(of(new MemberData[0]()));
  doctorServiceSpy.modifyDoctorDetail.and.returnValue(of(new UpdateDoctorResponse[0]()));
  doctorServiceSpy.getmbProfessionalId.and.returnValue(23232323);
  doctorServiceSpy.revertTransactionDetails.and.returnValue(of(true));
  doctorServiceSpy.submitModifyContractDetail.and.returnValue(of(new UpdateDoctorResponse[0]()));

  const medicalBoardServicespy = jasmine.createSpyObj<MedicalBoardService>('MedicalBoardService', [
    
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
      declarations: [ModifyContractScComponent, BilingualTextPipeMock],
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
        { provide: MedicalBoardService, useValue: medicalBoardServicespy },
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
    fixture = TestBed.createComponent(ModifyContractScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy();
  });
});
