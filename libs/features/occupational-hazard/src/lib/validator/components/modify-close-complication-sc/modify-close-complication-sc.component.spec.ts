import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ModifyCloseComplicationScComponent } from './modify-close-complication-sc.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  AlertService
} from '@gosi-ui/core';
import {
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  ComplicationService
} from '../../../shared';
import {
  ContributorMockService,
  CoreEstablishmentServiceStub,
  DocumentServiceStub,
  InjuryMockService,
  OhMockService,
  ComplicationMockService,
  AlertServiceStub,
  ComplicationForms
} from 'testing';
import { BehaviorSubject } from 'rxjs';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';

describe('ModifyCloseComplicationScComponent', () => {
  let component: ModifyCloseComplicationScComponent;
  let fixture: ComponentFixture<ModifyCloseComplicationScComponent>;

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
      declarations: [ModifyCloseComplicationScComponent],
      providers: [
        FormBuilder,
        //  { provide: Router, useValue: routerSpy },
        BsModalService,
        BsModalRef,
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: AlertService, useClass: AlertServiceStub },
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
    fixture = TestBed.createComponent(ModifyCloseComplicationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('confirm cancel', () => {
    it('should confirm cancellation', () => {
      component.modalRef = new BsModalRef();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('submitComplicationClosingDetails', () => {
    it('should submit Complication Closing Details', () => {
      const forms = new ComplicationForms();
      component.closeComplicationForm = forms.createCloseComplicationForm();
      component.submitComplicationClosingDetails();
      spyOn(component.ohservice, 'setClosingstatus');
      expect(component.ohservice.getClosingstatus()).not.toBe(null);
      expect(component.closedComplicationStatus).not.toBe(null);
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('confirm cancel', () => {
    it('should confirm cancellation', () => {
      spyOn(component.router, 'navigate');
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('show cancel template', () => {
    it('should show cancel template', () => {
      component.cancelComplication = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showCancelTemplate();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
});
