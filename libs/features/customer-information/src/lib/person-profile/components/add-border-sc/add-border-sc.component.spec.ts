/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
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
import { AddBorderScComponent } from './add-border-sc.component';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('AddBorderScComponent', () => {
  let component: AddBorderScComponent;
  let fixture: ComponentFixture<AddBorderScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule, IconsModule],
      declarations: [AddBorderScComponent],
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
        {
          provide: ManagePersonRoutingService,
          useClass: ManagePersonRoutingServiceStub
        },
        { provide: Router, useValue: routerSpy },
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
    fixture = TestBed.createComponent(AddBorderScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Save Border Number ', () => {
    it('should save the border number', () => {
      const forms = new ManagePersonForms();
      component.isDocumentUploaded = true;
      spyOn(component, 'setNavigationIndicator');
      spyOn(component.manageService, 'patchIdentityDetails').and.returnValue(of(updateEduReponse));
      component.borderForm = forms.getBorderMockForm();
      component.borderForm.get('borderAdd').get('borderNo').setValue(5131321);
      component.saveBorder();
      expect(component.currentTab).toEqual(1);
    });
    it('should throw an error upload document', () => {
      const forms = new ManagePersonForms();
      component.isDocumentUploaded = false;
      component.borderForm = forms.getBorderMockForm();
      spyOn(component, 'setNavigationIndicator');
      component.borderForm.get('borderAdd').get('borderNo').setValue(5131321);
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.saveBorder();
      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
    it('should throw an error', () => {
      const forms = new ManagePersonForms();
      component.isDocumentUploaded = false;
      component.borderForm = forms.getBorderMockForm();
      spyOn(component, 'setNavigationIndicator');
      component.borderForm.get('borderAdd').get('borderNo').setValue(5453);
      component.borderDocuments = [];
      spyOn(component.manageService, 'patchIdentityDetails').and.returnValue(throwError(genericError));

      spyOn(component, 'showErrorMessage');
      component.saveBorder();
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
