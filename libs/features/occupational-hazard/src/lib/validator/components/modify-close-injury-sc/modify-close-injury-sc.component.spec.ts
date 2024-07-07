/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationTypeToken, DocumentService, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ContributorMockService,
  CoreEstablishmentServiceStub,
  DocumentServiceStub,
  InjuryMockService,
  OhMockService,
  Form
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { ContributorService, EstablishmentService, InjuryService, OhService } from '../../../shared';
import { ModifyCloseInjuryScComponent } from './modify-close-injury-sc.component';

describe('ModifyCloseInjuryScComponent', () => {
  let component: ModifyCloseInjuryScComponent;
  let fixture: ComponentFixture<ModifyCloseInjuryScComponent>;

  // const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        BrowserDynamicTestingModule,
        ModalModule.forRoot()
      ],
      declarations: [ModifyCloseInjuryScComponent],
      providers: [
        FormBuilder,
        //  { provide: Router, useValue: routerSpy },
        BsModalService,
        BsModalRef,
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: RouterDataToken,
          useValue: new RouterData().fromJsonToObject(routerMockToken)
        },
        { provide: EstablishmentService, useValue: CoreEstablishmentServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCloseInjuryScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('confirm cancel', () => {
    it('should confirm cancellation', () => {
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('submitInjuryClosingDetails', () => {
    it('should submit Injury Closing Details', () => {
      const forms = new Form();
      component.closeInjuryForm = forms.createCloseInjuryForm();
      component.submitInjuryClosingDetails();
      spyOn(component.ohservice, 'setClosingstatus');
      expect(component.ohservice.getClosingstatus()).not.toBe(null);
      expect(component.closedInjuryStatus).not.toBe(null);
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();
      expect(component.modalRef).not.toEqual(null);
    });
  });
});
