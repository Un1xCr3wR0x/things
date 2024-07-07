/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import {
  bindToObject,
  DocumentItem,
  Establishment,
  RouterConstants,
  TransactionReferenceData,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import {
  documentItem,
  documentResponseItemList,
  Forms,
  genericDocumentItem,
  genericEstablishmentResponse,
  transactionReferenceData,
  WorkflowServiceStub
} from 'testing';
import { DocumentNameEnum } from '../../../shared';
import { commonImports, commonProviders } from '../change-basic-details-sc/change-basic-details-sc.component.spec';
import {
  findDoc,
  getRequiredDocument
} from '../change-legal-entity-details-sc/change-legal-entity-details-sc.component.spec';
import { ChangeContactDetailsScComponent } from './change-contact-details-sc.component';
import { handleContactDocuments } from './change-contact-helper';

describe('ChangeContactDetailsScComponent', () => {
  let component: ChangeContactDetailsScComponent;
  let fixture: ComponentFixture<ChangeContactDetailsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ChangeContactDetailsScComponent],
      providers: [
        ...commonProviders,
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeContactDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise the view', () => {
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_CONTACT_DETAILS;
      component.estRouterData.taskId = 'abdchs';
      spyOn(component, 'getEstablishmentWithWorkflowData');
      component.ngOnInit();
      expect(component.estRouterData.taskId).toEqual('abdchs');
    });
    it('should initialise view of selected establishment', () => {
      component.estRouterData.resourceType = undefined;
      component.changeEstablishmentService['selectedEstablishment'] = bindToObject(
        new Establishment(),
        genericEstablishmentResponse
      );
      component.ngOnInit();
      expect(component.establishmentToChange.registrationNo).toBe(genericEstablishmentResponse.registrationNo);
    });
  });
  describe('intialise View', () => {
    it('should intialise View', () => {
      component.isGcc = true;
      component.establishmentToChange.name = { english: 'abd', arabic: '' };
      component.establishmentToChange = bindToObject(new Establishment(), genericEstablishmentResponse);
      component.initialiseViewWithContact();
      expect(component.establishmentToChange.registrationNo).toEqual(100011182);
    });
  });
  describe('get Establishment With Workflow Data', () => {
    it('should get  Establishment With Workflow Data', () => {
      spyOn(component, 'getAllComments').and.returnValue(
        of(bindToObject(new TransactionReferenceData(), transactionReferenceData))
      );
      spyOn(component.changeEstablishmentService, 'getEstablishmentFromTransient').and.returnValue(
        of(bindToObject(new Establishment(), genericEstablishmentResponse))
      );

      component.getEstablishmentWithWorkflowData(
        component.estRouterData,
        component.initialiseViewWithContact,
        component.navigateToValidator
      );
      expect(component.establishmentToChange.registrationNo).toBe(genericEstablishmentResponse.registrationNo);
    });
  });
  describe('navigate To  validator', () => {
    it('should navigate To validator', () => {
      spyOn(component.changeEstablishmentService, 'navigateToContactDetailsValidator');
      component.navigateToValidator();
      expect(component.changeEstablishmentService.navigateToContactDetailsValidator).toHaveBeenCalled();
    });
  });
  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.bsModalRef).not.toEqual(null);
    });
  });

  describe('cancel modal', () => {
    it('should cancel modal', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component, 'cancelContactDetailsTransaction');
      component.cancelModal();
      expect(component.cancelContactDetailsTransaction).toHaveBeenCalled();
    });
  });
  describe('update contact details', () => {
    it('should save and update contact details', () => {
      const forms = new Forms();
      component.contactDetailsDocuments = [];
      component.changeContactDetailsForm = forms.createMockEditContactDetailsForm();
      component.changeContactDetailsForm.addControl('contactDetail', new FormGroup({}));
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.contactDetailsDocuments.push(genericDocumentItem);
      }
      component.contactDetailsDocuments.forEach(doc => (doc.documentContent = 'tsting')); // Make document valid
      component.isValidator = true;
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.updateContactDetails();
      expect(component.alertService.showMandatoryErrorMessage).not.toHaveBeenCalled();
      expect(component.alertService.showMandatoryDocumentsError).not.toHaveBeenCalled();
    });
    it('should throw error when form is invalid', () => {
      const forms = new Forms();
      component.changeContactDetailsForm = forms.createMockEditContactDetailsForm();
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.contactDetailsDocuments = documents;
      component.isValidator = true;
      component.updateContactDetails();
      expect(component.isTransactionSuccess).toEqual(false);
    });
  });
  describe('bind document content', () => {
    it('should bind document content', () => {
      const document = new DocumentItem();
      spyOn(component.documentService, 'refreshDocument').and.returnValue(of(documentItem));
      component.bindDocContent(document);
      expect(component.documentService.refreshDocument).toHaveBeenCalled();
    });
  });

  describe('handle doc validations', () => {
    it('in field office for non gcc establishments', () => {
      const documents = [
        DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT,
        DocumentNameEnum.AUTH_DELEGATION_LETTER,
        DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT,
        DocumentNameEnum.NATIONAL_ID_IQAMA,
        DocumentNameEnum.OTHERS_DOCUMENT
      ].map(item => getRequiredDocument(item));
      handleContactDocuments(documents, false, true);
      expect(findDoc(documents, DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT).show).toBeTruthy();
      expect(findDoc(documents, DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT).show).toBeFalsy();
    });
  });
});
