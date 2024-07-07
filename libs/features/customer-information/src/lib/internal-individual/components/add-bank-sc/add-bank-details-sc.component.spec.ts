/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  bindToForm,
  bindToObject,
  DocumentService,
  LanguageToken,
  LookupService,
  Person
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  bankDetailsReponse,
  beneficiaryErrorMockData,
  beneficiaryMockData,
  bilingualWrapperResponse,
  ChangePersonServiceMock,
  DocumentServiceStub,
  genericError,
  LookupServiceStub,
  ManagePersonFeatureServiceStub,
  ManagePersonForms,
  ManagePersonRoutingServiceStub,
  ModalServiceStub,
  personResponse,
  updateEduReponse
} from 'testing';
import {
  ChangePersonService,
  ManagePersonConstants,
  ManagePersonRoutingService,
  ManagePersonService,
  PersonBankDetails
} from '../../../shared';
import { AddBankDetailsScComponent } from './add-bank-details-sc.component';

describe('ChangePersonsScComponent', () => {
  let component: AddBankDetailsScComponent;
  let fixture: ComponentFixture<AddBankDetailsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [ModifyPersonalDetailsScComponent],
      providers: [
        { provide: ChangePersonService, useClass: ChangePersonServiceMock },
        {
          provide: ManagePersonRoutingService,
          useClass: ManagePersonRoutingServiceStub
        },
        {
          provide: ManagePersonService,
          useClass: ManagePersonFeatureServiceStub
        },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: 'private' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
