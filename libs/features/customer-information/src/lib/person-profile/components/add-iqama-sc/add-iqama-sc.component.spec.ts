import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  CoreContributorService,
  DocumentService,
  RouterDataToken,
  TransactionService
} from '@gosi-ui/core';
import { IconsModule } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  CoreContributorSerivceStub,
  DocumentServiceStub,
  feedbackMessageResponse,
  genericError,
  genericRouteData,
  ManagePersonFeatureServiceStub,
  ManagePersonForms,
  ManagePersonRoutingServiceStub,
  ModalServiceStub,
  TransactionServiceStub,
  updateEduReponse
} from 'testing';
import { ManagePersonRoutingService, ManagePersonService } from '../../../shared';
import { AddIqamaScComponent } from './add-iqama-sc.component';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('AddIqamaScComponent', () => {
  let component: AddIqamaScComponent;
  let fixture: ComponentFixture<AddIqamaScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule, IconsModule],
      declarations: [AddIqamaScComponent],
      providers: [
        {
          provide: CoreContributorService,
          useClass: CoreContributorSerivceStub
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: ManagePersonService,
          useClass: ManagePersonFeatureServiceStub
        },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: Router, useValue: routerSpy },
        {
          provide: ManagePersonRoutingService,
          useClass: ManagePersonRoutingServiceStub
        },
        { provide: RouterDataToken, useValue: genericRouteData },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: TransactionService,
          useValue: TransactionServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIqamaScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Save Iqama Number ', () => {
    it('should save the iqama number', () => {
      const forms = new ManagePersonForms();
      component.isDocumentUploaded = true;
      spyOn(component, 'setNavigationIndicator');
      spyOn(component.manageService, 'patchIdentityDetails').and.returnValue(of(updateEduReponse));
      spyOn(component.documentService, 'checkMandatoryDocuments');
      component.iqamaForm = forms.getIqamaMockForm();
      component.iqamaForm.get('iqamaAdd').get('iqamaNo').setValue(5131321);
      component.saveIqama();
      expect(component.person).not.toBe(null);
    });
    it('should throw an error upload document', () => {
      const forms = new ManagePersonForms();
      component.isDocumentUploaded = false;
      component.iqamaForm = forms.getIqamaMockForm();
      spyOn(component, 'setNavigationIndicator');
      component.iqamaForm.get('iqamaAdd').get('iqamaNo').setValue(5131321);
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      component.saveIqama();
      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
    it('should throw trigger feedback ', () => {
      const forms = new ManagePersonForms();
      component.isDocumentUploaded = true;
      component.iqamaForm = forms.getIqamaMockForm();
      spyOn(component, 'setNavigationIndicator');
      component.iqamaForm.get('iqamaAdd').get('iqamaNo').setValue(5131321);
      component.iqamaForm.get('iqamaAdd').get('comments').setValue(5131321);
      spyOn(component.manageService, 'patchIdentityDetails').and.returnValue(of(feedbackMessageResponse));
      component.saveIqama();
      expect(component.manageService.patchIdentityDetails).toHaveBeenCalled();
    });
    it('should throw an error', () => {
      const forms = new ManagePersonForms();
      component.isDocumentUploaded = false;
      component.iqamaForm = forms.getIqamaMockForm();
      component.iqamaForm.get('iqamaAdd').get('iqamaNo').setValue(200000006);
      component.iqamaDocuments = [];
      spyOn(component.manageService, 'patchIdentityDetails').and.returnValue(throwError(genericError));
      spyOn(component, 'showErrorMessage');
      component.saveIqama();
      expect(component.showErrorMessage).toHaveBeenCalled();
    });
  });
  describe('showModal', () => {
    it('should show modal', () => {
      const bsModalRef = { elementRef: null, createEmbeddedView: null };
      component.bsModalRef = new BsModalRef();
      component.showModal(bsModalRef);
      expect(component.bsModalRef).not.toEqual(null);
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      component.cancelModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });
  describe('decline', () => {
    it('should decline the popUp', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      component.decline();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });
});
