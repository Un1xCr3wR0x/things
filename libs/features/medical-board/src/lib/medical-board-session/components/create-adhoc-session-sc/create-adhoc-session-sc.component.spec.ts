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
  LookupService
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

import { CreateAdhocSessionScComponent } from './create-adhoc-session-sc.component';
import { SessionStatusService } from '../../../shared/services/session-status.service';
import {
  CreateSessionService,
  IndividualSessionDetails,
  RegisterMedicalSessionDetails,
  SessionConfigurationService,
  UnAvailableMemberListRequest
} from '../../../shared';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('CreateAdhocSessionScComponent', () => {
  let component: CreateAdhocSessionScComponent;
  let fixture: ComponentFixture<CreateAdhocSessionScComponent>;
  const sessionStatusServiceSpy = jasmine.createSpyObj<SessionStatusService>('SessionStatusService', [
    'getUnavailableMemberList'
  ]);
  sessionStatusServiceSpy.getUnavailableMemberList.and.returnValue(of(new UnAvailableMemberListRequest[0]()));
  const createSessionServicespy = jasmine.createSpyObj<CreateSessionService>('CreateSessionService', [
    'registerAdhocSession',
    'updateAdhocMedicalBoardSession',
    'setSelectedMembers'
  ]);
  createSessionServicespy.registerAdhocSession.and.returnValue(of({ ...new RegisterMedicalSessionDetails[0]() }));
  createSessionServicespy.updateAdhocMedicalBoardSession.and.returnValue(
    of({ ...new RegisterMedicalSessionDetails[0]() })
  );
  createSessionServicespy.setSelectedMembers.and.returnValue();
  const sessionConfigurationServiceSpy = jasmine.createSpyObj<SessionConfigurationService>(
    'SessionConfigurationService',
    ['getIndividualSessionDetails']
  );
  sessionConfigurationServiceSpy.getIndividualSessionDetails.and.returnValue(of(new IndividualSessionDetails()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [CreateAdhocSessionScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: SessionStatusService, useValue: sessionStatusServiceSpy },
        { provide: CreateSessionService, useValue: createSessionServicespy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: SessionConfigurationService, useValue: sessionConfigurationServiceSpy },
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
    fixture = TestBed.createComponent(CreateAdhocSessionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy();
  });
});
