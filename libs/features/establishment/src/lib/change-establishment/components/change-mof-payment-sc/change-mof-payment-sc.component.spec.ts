/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkflowService, RouterConstants, bindToObject, DocumentItem } from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  EstablishmentStubService,
  EstLookupServiceStub,
  WorkflowServiceStub,
  genericEstablishmentResponse,
  documentResponseItemList,
  genericDocumentItem,
  genericError
} from 'testing';
import { documentListItemArray } from 'testing/test-data/core/document-service';
import { EstablishmentService, EstLookupService } from '../../../shared';
import { commonImports, commonProviders } from '../change-basic-details-sc/change-basic-details-sc.component.spec';

import { ChangeMofPaymentScComponent } from './change-mof-payment-sc.component';

describe('ChangeMofPaymentScComponent', () => {
  let component: ChangeMofPaymentScComponent;
  let fixture: ComponentFixture<ChangeMofPaymentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ChangeMofPaymentScComponent],
      providers: [
        ...commonProviders,
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        {
          provide: EstLookupService,
          useClass: EstLookupServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMofPaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ng On init', () => {
    it('should initialise the view', () => {
      component.estRouterData.taskId = 'taskId';
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.referenceNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_CHANGE_MOF_PAYMENT_DETAILS;
      component.changeEstablishmentService['selectedEstablishment'] = undefined;
      component.isValidator = true;
      spyOn(component, 'fetchComments');
      component.ngOnInit();
      expect(component.isValidator).toEqual(true);
    });
    it('should initialise with selected regNo', () => {
      (component as any).estRouterData = undefined;
      component.changeEstablishmentService['selectedEstablishment'] = genericEstablishmentResponse;
      component.establishmentToChange['registrationNo'] = genericEstablishmentResponse.registrationNo;
      component.isValidator = false;
      spyOn(component, 'intialiseView');
      component.ngOnInit();
      expect(component.isValidator).toEqual(false);
    });
  });
  describe('cancel transaction', () => {
    it('should cancel transaction', () => {
      component.isValidator = true;
      component.referenceNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      spyOn(component.changeEstablishmentService, 'navigateToChangeMofPaymentValidator');
      component.cancelTransaction();
      expect(component.changeEstablishmentService.navigateToChangeMofPaymentValidator).toHaveBeenCalled();
    });
    it('should cancel transaction throw error', () => {
      component.isValidator = true;
      component.referenceNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.cancelTransaction();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should cancel transaction not validator ', () => {
      component.isValidator = false;
      component.referenceNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      spyOn(component.location, 'back');
      component.cancelTransaction();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      spyOn(component, 'hideModal');
      spyOn(component, 'cancelTransaction');
      component.cancelModal();
      expect(component.cancelTransaction).toHaveBeenCalled();
    });
  });
  describe('hide  modal', () => {
    it('should hide the popUp', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      component.hideModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });
  describe('initialiseview', () => {
    it('should initialiseview', () => {
      component.changeMofPaymentForm = component.createForm();
      component.establishmentToChange = genericEstablishmentResponse;
      spyOn(component.lookUpService, 'getYesOrNoList');
      component.intialiseView();
      expect(component.changeMofPaymentTabWizards).not.toBe(null);
    });
  });
  describe('navigate to validator', () => {
    it('should navigate to validator', () => {
      spyOn(component.changeEstablishmentService, 'navigateToChangeMofPaymentValidator');
      component.navigateToValidator();
      expect(component.changeEstablishmentService.navigateToChangeMofPaymentValidator).toHaveBeenCalled();
    });
  });
  describe('save mof payment', () => {
    it('should save mof payment with doc error', () => {
      component.documents = [];
      component.changeMofPaymentTabWizards = [];
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.documents = documents;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.saveMofPaymentDetails(true);
      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
    it('should save mof payment', () => {
      component.changeMofPaymentForm = component.createForm();
      component.isValidator = true;
      component.changeMofPaymentTabWizards = [];
      component.changeMofPaymentForm.get('paymentType').get('english').setValue('mof');
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.documents = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.documents.push(genericDocumentItem);
      }
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      spyOn(component.alertService, 'showSuccess');
      component.saveMofPaymentDetails(true);
      expect(component.alertService.showSuccess).toHaveBeenCalled();
    });
    it('should save mof payment if not validator', () => {
      component.changeMofPaymentForm = component.createForm();
      component.isValidator = false;
      component.changeMofPaymentTabWizards = [];
      component.changeMofPaymentForm.get('paymentType').get('english').setValue('mof');
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.documents = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.documents.push(genericDocumentItem);
      }
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      spyOn(component.alertService, 'showSuccess');
      spyOn(component.documentService, 'getDocuments').and.returnValue(of(documentListItemArray));
      component.saveMofPaymentDetails(false);
      expect(component.isValidator).toBe(false);
    });
    it('should save mof payment throws error', () => {
      component.changeMofPaymentForm = component.createForm();
      component.isValidator = true;
      component.changeMofPaymentTabWizards = [];
      component.changeMofPaymentForm.get('paymentType').get('english').setValue('mof');
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.documents = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.documents.push(genericDocumentItem);
      }
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      spyOn(component.alertService, 'showError');
      spyOn(component.changeEstablishmentService, 'changeMofPaymnetDetails').and.returnValue(throwError(genericError));
      component.saveMofPaymentDetails(true);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
});
