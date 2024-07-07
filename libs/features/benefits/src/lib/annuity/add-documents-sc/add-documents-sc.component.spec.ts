/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  CoreBenefitService,
  CoreActiveBenefits,
  DocumentItem
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { documentListItemArray, DocumentServiceStub, ModalServiceStub } from 'testing';
import {
  BenefitConstants,
  BenefitDocumentService,
  UITransactionType,
  AnnuityResponseDto,
  ManageBenefitService,
  BenefitResponse,
  ModifyBenefitService,
  ImprisonmentVerifyResponse
} from '../../shared';
import { DateTypePipe } from '@gosi-ui/foundation-theme/src';
import { DateTypePipeMock } from '../../shared/Mock/date-type-pipe-mock';
import { AddDocumentsScComponent } from './add-documents-sc.component';

describe('ImprisonmentModifyScComponent', () => {
  let component: AddDocumentsScComponent;
  let fixture: ComponentFixture<AddDocumentsScComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [AddDocumentsScComponent, DateTypePipeMock],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: DateTypePipe,
          useClass: DateTypePipeMock
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: DocumentService, useClass: DocumentServiceStub },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('showAddDocument(', () => {
    it('should showAddDocument(', () => {
      const document = new DocumentItem();
      component.showAddDocument(document);
    });
  });
  describe('popUp', () => {
    it('should popUp', () => {
      component.modalRef = new BsModalRef();
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      component.popUp(templateRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('confirmCancel', () => {
    it('should hide confirmCancel', () => {
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });
});
