/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Establishment, NationalityTypeEnum, RouterConstants, WorkflowService } from '@gosi-ui/core';
import moment from 'moment';
import { NgxPaginationModule } from 'ngx-pagination';
import { noop, of, throwError } from 'rxjs';
import {
  EstablishmentStubService,
  genericDocumentItem,
  genericError,
  genericEstablishmentResponse,
  genericOwnerReponse,
  genericPersonResponse,
  ownerResponse,
  WorkflowServiceStub
} from 'testing';
import { documentListItemArray } from 'testing/test-data/core/document-service';
import {
  ActionTypeEnum,
  DocumentNameEnum,
  EstablishmentErrorKeyEnum,
  EstablishmentService,
  FilterKeyEnum,
  LegalEntityEnum,
  Owner,
  OwnerResponse,
  restrictOwner
} from '../../../shared';
import { commonImports, commonProviders } from '../change-basic-details-sc/change-basic-details-sc.component.spec';
import {
  findDoc,
  getRequiredDocument
} from '../change-legal-entity-details-sc/change-legal-entity-details-sc.component.spec';
import { ChangeOwnerScComponent } from './change-owner-sc.component';
import {
  assembleFormToOwner,
  changeDocumentValidation,
  checkForOwnerValidity,
  ownerForm,
  saveOwnerModifications
} from './owner-helper';

describe('ChangeOwnerScComponent', () => {
  let component: ChangeOwnerScComponent;
  let fixture: ComponentFixture<ChangeOwnerScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports, NgxPaginationModule],
      declarations: [ChangeOwnerScComponent],
      providers: [
        ...commonProviders,
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOwnerScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialise the view the selected registration no', () => {
      spyOn(component, 'initialiseLookups');
      component.changeEstablishmentService.selectedRegistrationNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(genericEstablishmentResponse));
      component.ngOnInit();
      expect(component.initialiseLookups).toHaveBeenCalled();
      expect(component.establishment.registrationNo).toBe(genericEstablishmentResponse.registrationNo);
    });
  });

  describe('CSR', () => {
    beforeEach(() => {
      component.establishment = genericEstablishmentResponse;
      component.currentOwners = [];
      component.estToken.referenceNo = null;
      component.estToken.taskId = null;
    });
    it('should verify the owner', () => {
      component.establishment = genericEstablishmentResponse;
      component.addOwner();
      component.ownerFormArray[0].addControl(
        'search',
        new FormGroup({
          nationality: new FormControl(NationalityTypeEnum.SAUDI_NATIONAL)
        })
      );
      spyOn(component.establishmentService, 'verifyPersonDetails').and.returnValue(of(genericPersonResponse));
      component.verifyOwner(0);
      expect(component.ownerFormArray[0].get('isVerified').value).toBeTruthy();
    });
    it('should throw mandatory info error', () => {
      component.addOwner();
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.ownerFormArray[0].setErrors({ notValid: true });
      component.verifyOwner(0);
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
    it('update the no of edited and removed owners', () => {
      component.currentOwners = getOwners(genericOwnerReponse, [null, ActionTypeEnum.MODIFY, ActionTypeEnum.REMOVE]);
      component.updateAction();
      expect(component.editedOwners.length).toBe(1);
      expect(component.removedOwners.length).toBe(1);
    });
    it('should save the added owner', () => {
      component.addOwner();
      // spyOn(component.changeEstablishmentService, 'assembleFormToOwner').and.returnValue(new Owner());
      component.ownerFormArray[0] = ownerForm();
      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(of(new OwnerResponse()));
      component.newOwners = [new Owner()];
      component.newOwners[0].person.identity = ownerResponse.identity;
      component.saveOwner(0);
      expect(component.newOwners.length).toBe(1);
      expect(component.ownerFormArray[0].get('isSaved').value).toBeTruthy();
    });
    it('tries to save the owner and error is handled', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(throwError(genericError));
      // spyOnProperty(assembleFormToOwner).and.returnValue(new Owner());

      component.addOwner();
      component.ownerFormArray[0] = ownerForm();
      component.saveOwner(0);
      expect(component.ownerFormArray[0].get('isSaved').value).toBeFalsy();
      expect(component.alertService.showError).toHaveBeenCalled();
    });

    it('should submit the transaction', () => {
      component.ownerDocuments = [];
      component.isReEnter = false;
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.ownerDocuments.push(genericDocumentItem);
      }
      component.ownerDocuments.forEach(doc => (doc.documentContent = 'tsting'));

      component.currentOwners = getOwners(genericOwnerReponse, [null, ActionTypeEnum.MODIFY, ActionTypeEnum.REMOVE]);

      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.ownerForm = component.createForm();
      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(of(new OwnerResponse()));
      spyOn(component, 'updateBpm');
      component.isReEnter = false;
      component.submitTransaction(genericEstablishmentResponse.registrationNo);
      expect(component.alertService.showMandatoryDocumentsError).not.toHaveBeenCalled();
      expect(component.updateBpm).not.toHaveBeenCalled();
    });
    it('submits transaction and error is handled', () => {
      component.ownerDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.ownerDocuments.push(genericDocumentItem);
      }
      component.ownerDocuments.forEach(doc => (doc.documentContent = 'tsting'));

      component.currentOwners = getOwners(genericOwnerReponse, [null, ActionTypeEnum.MODIFY, ActionTypeEnum.REMOVE]);

      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.ownerForm = component.createForm();
      component.isReEnter = false;
      component.submitTransaction(genericEstablishmentResponse.registrationNo);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should cancel the transaction', () => {
      component.ownerForm = component.createForm();
      component.ownerForm.get('referenceNo').setValue(genericEstablishmentResponse.registrationNo);
      component.establishment = genericEstablishmentResponse;
      spyOn(component.changeEstablishmentService, 'cancelTransaction').and.returnValue(of(null));
      component.cancelTransaction();
      expect(component.hasCompleted).toBeTrue();
    });
    describe('Add owner', () => {
      it('for individual establishment no of owner is greater than 1 is restricted', () => {
        const indEstablishment: Establishment = {
          ...genericEstablishmentResponse,
          ...{ legalEntity: { english: LegalEntityEnum.INDIVIDUAL, arabic: 'test' } }
        };
        restrictOwner({ canAdd: true, noOfTotalOwners: 1 }, indEstablishment).subscribe(res => {
          expect(res.canAdd).toBeFalsy();
        });
      });
      it('for individual establishment no of owner is less than 1 is fine', () => {
        const indEstablishment: Establishment = {
          ...genericEstablishmentResponse,
          ...{ legalEntity: { english: LegalEntityEnum.INDIVIDUAL, arabic: 'test' } }
        };
        restrictOwner({ canAdd: true, noOfTotalOwners: 0 }, indEstablishment).subscribe(res => {
          expect(res.canAdd).toBeTruthy();
        });
      });
      it('for partnership establishment no of owner is less than 5 is fine', () => {
        const indEstablishment: Establishment = {
          ...genericEstablishmentResponse,
          ...{ legalEntity: { english: LegalEntityEnum.PARTNERSHIP, arabic: 'test' } }
        };
        restrictOwner({ canAdd: true, noOfTotalOwners: 4 }, indEstablishment).subscribe(res => {
          expect(res.canAdd).toBeTruthy();
        });
      });
      it('for partnership establishment no of owner is greater than 5 is restricted', () => {
        const indEstablishment: Establishment = {
          ...genericEstablishmentResponse,
          ...{ legalEntity: { english: LegalEntityEnum.PARTNERSHIP, arabic: 'test' } }
        };
        restrictOwner({ canAdd: true, noOfTotalOwners: 5 }, indEstablishment).subscribe(res => {
          expect(res.canAdd).toBeFalsy();
        });
      });
    });
  });

  describe('Edit or reenter', () => {
    beforeEach(() => {
      component.estToken.taskId = 'test';
      component.estToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_OWNER;
      component.estToken.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estToken.referenceNo = 12345;
      spyOn(component.documentService, 'getDocuments').and.returnValue(of(documentListItemArray));
    });
    it('should initialise the view the selected registration no', () => {
      spyOn(component, 'initialiseLookups');
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(genericEstablishmentResponse));
      component.ngOnInit();
      expect(component.initialiseLookups).toHaveBeenCalled();
      expect(component.ownerForm.get('referenceNo').value).toBe(12345);
    });
    it('should fetch the added owners, modify and removed owners', () => {
      const owners: Owner[] = getOwners(genericOwnerReponse, [
        ActionTypeEnum.ADD,
        ActionTypeEnum.MODIFY,
        ActionTypeEnum.REMOVE
      ]);
      spyOn(component, 'initialiseLookups');
      spyOn(component.changeEstablishmentService, 'searchOwnerWithQueryParams').and.returnValue(of(owners));
      spyOn(component.changeEstablishmentService, 'getOwners').and.returnValue(
        of([new Owner().bindToNewInstance({ ...genericOwnerReponse })])
      );
      component.ngOnInit();
      expect(component.initialiseLookups).toHaveBeenCalled();
      expect(component.newOwners.length).toBe(1);
      expect(component.currentOwners.length).toBe(2);
      expect(component.ownerForm.get('referenceNo').value).toBe(12345);
    });
    it('should submit and update the bpm workflow', () => {
      component.ownerDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.ownerDocuments.push(genericDocumentItem);
      }
      component.ownerDocuments.forEach(doc => (doc.documentContent = 'tsting'));
      component.currentOwners = getOwners(genericOwnerReponse, [null, ActionTypeEnum.MODIFY, ActionTypeEnum.REMOVE]);
      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(of(new OwnerResponse()));
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(
        of({ english: 'success', arabic: 'success' })
      );
      component.isReEnter = true;
      component.ownerForm = component.createForm();
      component.submitTransaction(genericEstablishmentResponse.registrationNo);
      expect(component.alertService.showMandatoryDocumentsError).not.toHaveBeenCalled();
      expect(component.workflowService.updateTaskWorkflow).toHaveBeenCalled();
    });
  });

  describe('navigate back', () => {
    it('should go back', () => {
      spyOn(component.location, 'back').and.callFake(() => {});
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });

  describe('Update Owners', () => {
    beforeEach(() => {
      const index = 0;
      component.currentOwners = [];
      component.ownerForm = component.createForm();
      component._ownerFormArray.push(ownerForm());
      component.newOwners = [
        assembleFormToOwner(new Owner(), component.ownerFormArray[index], component.showStartDate)
      ];
    });
    xit('should save owners', () => {
      component.ownerFormArray[0].get('isSaved').setValue(true);
      component.ownerFormArray[0].get('isVerified').setValue(true);
      component.ownerFormArray[0].get('modificationSaved').setValue(true);
      spyOn(component, 'selectedWizard').and.callThrough();
      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(of(new OwnerResponse()));
      component.establishment = genericEstablishmentResponse;
      saveOwnerModifications(component, genericEstablishmentResponse.registrationNo).subscribe(() => {
        expect(component.establishmentService.saveAllOwners).toHaveBeenCalled();
      });
    });
    it('should handle api error', () => {
      component.ownerFormArray[0].get('isSaved').setValue(true);
      component.ownerFormArray[0].get('isVerified').setValue(true);
      component.ownerFormArray[0].get('modificationSaved').setValue(true);
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(throwError(genericError));
      component.establishment = genericEstablishmentResponse;
      saveOwnerModifications(component, genericEstablishmentResponse.registrationNo).subscribe(noop, err => {
        expect(err).toBe(genericError);
        expect(component.alertService.showError).toHaveBeenCalled();
        expect(component.establishmentService.saveAllOwners).toHaveBeenCalled();
      });
    });
  });

  describe('Update Owners', () => {
    beforeEach(() => {
      const index = 0;
      component._ownerFormArray.push(ownerForm());
      component.newOwners = [
        assembleFormToOwner(new Owner(), component.ownerFormArray[index], component.showStartDate)
      ];
      component.ownerFormArray[index].get('person').get('startDate').get('gregorian').setValue(new Date());
    });
    it('should update owners', () => {
      const index = 0;
      component.ownerFormArray[index].get('isSaved').setValue(true);
      component.ownerFormArray[index].get('hasModified').setValue(true);
      expect(component.newOwners[index].startDate.gregorian).not.toEqual(
        component.ownerFormArray[index].get('person').get('startDate').get('gregorian').value
      );
      component.updateOwner(index);
      expect(
        moment(component.newOwners[index].startDate.gregorian).isSame(
          component.ownerFormArray[index].get('person').get('startDate').get('gregorian').value,
          'day'
        )
      ).toBeTruthy();
      expect(component.ownerFormArray[index].get('hasModified').value).toBe(false);
    });
    it('should not update if no owner is not save', () => {
      const index = 0;
      component.newOwners = [];
      component.ownerFormArray[index].get('isSaved').setValue(false);
      component.ownerFormArray[index].get('hasModified').setValue(true);
      component.updateOwner(index);
      expect(component.ownerFormArray[index].get('hasModified').value).toBe(true);
    });
  });

  describe('handle document validations', () => {
    it('in private for non gcc individual establishment', () => {
      const documents = [
        DocumentNameEnum.PROOF_ESTABLISHMENT_OWNERSHIP,
        DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT,
        DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT,
        DocumentNameEnum.COMPANY_MEMO_DOCUMENT,
        DocumentNameEnum.OWNERS_ID,
        DocumentNameEnum.NATIONAL_ID_IQAMA,
        DocumentNameEnum.AUTH_DELEGATION_LETTER,
        DocumentNameEnum.OTHERS_DOCUMENT
      ].map(item => getRequiredDocument(item));
      changeDocumentValidation(documents, false, LegalEntityEnum.INDIVIDUAL, true, false, false);
      expect(findDoc(documents, DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT).show).toBeTruthy();
      expect(findDoc(documents, DocumentNameEnum.OWNERS_ID).show).toBeFalsy();
    });
  });

  describe('Add and Delete Owner', () => {
    it('should add and delete owners', () => {
      component.establishment = new Establishment();
      component.establishment.legalEntity.english = LegalEntityEnum.INDIVIDUAL;
      component.addOwner();
      expect(component.showStartDate).toBe(true);
      expect(component.newOwners?.length).toBe(1);
      component.deleteOwner(0);
      expect(component.newOwners?.length).toBe(0);
    });
  });

  describe('clear all', () => {
    it('should clear all', () => {
      component.clearAll();
      expect(component.ownerFilters?.length).toBe(0);
      expect(component.currentPage).toBe(1);
    });
  });
  describe('Filter Owners', () => {
    it('should filter the owners', () => {
      component.currentOwners = [genericOwnerReponse];
      const ownerFilters = [
        {
          key: FilterKeyEnum.NATIONALITY,
          bilingualValues: [{ english: NationalityTypeEnum.SAUDI_NATIONAL, arabic: '' }]
        }
      ];
      component.filterOwners(ownerFilters);
      expect(component.filteredOwners?.length).toBe(0);
    });
  });

  describe('search owners', () => {
    it('should search for owners owners', () => {
      component.currentOwners = [genericOwnerReponse];
      component.searchForOwners(genericPersonResponse.name?.english.name.slice(0, 2));
      expect(component.filteredOwners?.length).toBe(1);
    });
  });

  describe('Owner Validations', () => {
    beforeEach(() => {
      const index = 0;
      component.currentOwners = [];
      component.ownerForm = component.createForm();
      component._ownerFormArray.push(ownerForm());
      component.newOwners = [
        assembleFormToOwner(new Owner(), component.ownerFormArray[index], component.showStartDate)
      ];
    });
    it('should throw owner not verified error', () => {
      spyOn(component.alertService, 'showErrorByKey');
      checkForOwnerValidity(component, 1, component.ownerFormArray, true, LegalEntityEnum.INDIVIDUAL);
      expect(component.alertService.showErrorByKey).toHaveBeenCalledWith(EstablishmentErrorKeyEnum.VERIFY_OWNER);
    });
  });
});

export const getOwners = (owner: Owner, items: ActionTypeEnum[]): Owner[] => {
  const owners = [];
  items.forEach(item => {
    owners.push({ ...owner, ...{ recordAction: item } });
  });
  return owners;
};
