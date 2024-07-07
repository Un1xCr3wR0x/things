/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import {
  DocumentItem,
  EstablishmentProfile,
  NationalityTypeEnum,
  RouterConstants,
  WorkflowService
} from '@gosi-ui/core';
import { PaginatePipe, PaginationService } from 'ngx-pagination';
import { of, throwError } from 'rxjs';
import {
  EstablishmentStubService,
  EstLookupServiceStub,
  genericDocumentItem,
  genericError,
  genericEstablishmentResponse,
  genericGccEstablishment,
  genericOwnerReponse,
  WorkflowServiceStub
} from 'testing';
import {
  ActionTypeEnum,
  DocumentNameEnum,
  EstablishmentKeyEnum,
  EstablishmentService,
  EstLookupService,
  isDocumentsValid,
  LegalEntityEnum
} from '../../../shared';
import { commonImports, commonProviders } from '../change-basic-details-sc/change-basic-details-sc.component.spec';
import { ownerForm } from '../change-owner-sc/owner-helper';
import { saveAndNextLegalEntity, submitLegalEntity } from './change-legal-entity-api-helper';
import { ChangeLegalEntityDetailsScComponent } from './change-legal-entity-details-sc.component';
import { createLegalEntityDetailsForm, setLateFeeIndicator } from './change-legal-entity-form';
import { handleLegalDocuments, initialiseForEdit } from './change-legal-entity-helper';

describe('ChangeLegalEntityDetailsScComponent', () => {
  let component: ChangeLegalEntityDetailsScComponent;
  let fixture: ComponentFixture<ChangeLegalEntityDetailsScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ChangeLegalEntityDetailsScComponent, PaginatePipe],
      providers: [
        PaginationService,
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
    fixture = TestBed.createComponent(ChangeLegalEntityDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialise with selected registration no', () => {
      spyOn(component.estLookUpService, 'getOwnerSelectionList').and.callThrough();
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
        of({ ...genericEstablishmentResponse, legalEntity: { english: LegalEntityEnum.GOVERNMENT, arabic: undefined } })
      );
      component.estToken.taskId = null;
      component.changeEstablishmentService['selectedRegistrationNo'] = genericEstablishmentResponse.registrationNo;
      component.changeEstablishmentService['establishmentProfile'] = new EstablishmentProfile();
      component.changeEstablishmentService['establishmentProfile'].noOfBranches = 1;
      component.ngOnInit();
      expect(component.currentLegalEntity).toBe(LegalEntityEnum.GOVERNMENT);
    });
    it('should initialise with token from inbox for validator edit', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(genericGccEstablishment));
      spyOn(component.changeEstablishmentService, 'getEstablishmentFromTransient').and.returnValue(
        of(genericGccEstablishment)
      );
      component.estToken.taskId = 'taskId';
      component.estToken.registrationNo = genericGccEstablishment.registrationNo;
      component.estToken.referenceNo = genericGccEstablishment.registrationNo;
      component.estToken.resourceType = RouterConstants.TRANSACTION_CHANGE_LEGAL_ENTITY;
      component.changeEstablishmentService['establishmentProfile'] = new EstablishmentProfile();
      component.changeEstablishmentService['establishmentProfile'].noOfBranches = 1;
      component.ngOnInit();
      expect(component.isValidator).toBeTruthy();
      expect(component.currentLegalEntity).toBe(LegalEntityEnum.INDIVIDUAL);
    });
  });

  describe('CSR', () => {
    beforeEach(() => {
      component.isValidator = false;
      component.legalEntityForm = createLegalEntityDetailsForm(component);
      component.establishment = genericEstablishmentResponse;
    });
    it('should submit the transaction', () => {
      component.legalEntityDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.legalEntityDocuments.push(genericDocumentItem);
      }
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.legalEntityDocuments.forEach(doc => (doc.documentContent = 'tsting'));
      component.submitTransaction(genericEstablishmentResponse.registrationNo);
      expect(isDocumentsValid(component.legalEntityDocuments)).toBeTruthy();
      expect(component.alertService.showMandatoryDocumentsError).not.toHaveBeenCalled();
    });
    it('should verify owner', () => {
      component.addOwner();
      component.ownerFormArray[0].addControl(
        'search',
        new FormGroup({
          nationality: new FormControl(NationalityTypeEnum.SAUDI_NATIONAL)
        })
      );
      component.verifyOwner(0);
      expect(component.ownerFormArray[0].get('isVerified').value).toBeTruthy();
    });
    it('should save the owner', () => {
      component.addOwner();
      // spyOn(component.changeEstablishmentService, 'assembleFormToOwner').and.returnValue(new Owner());
      component.ownerFormArray[0] = ownerForm();
      spyOn(component.alertService, 'showSuccess');
      component.saveOwner(0);
      expect(component.alertService.showSuccess).toHaveBeenCalled();
    });
    it('save owner api error should be handled', () => {
      component.addOwner();
      component.ownerFormArray[0] = ownerForm();
      // spyOn(component.changeEstablishmentService, 'assembleFormToOwner').and.returnValue(new Owner());
      spyOn(component.establishmentService, 'saveAllOwners').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.saveOwner(0);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('reset owner', () => {
      component.addOwner();
      component.ownerFormArray[0].get('isSaved').setValue(true);
      component.ownerFormArray[0].addControl('search', new FormGroup({}));
      component.resetOwner(0);
      expect(component.ownerFormArray[0].get('isSaved').value).toBeFalsy();
    });
    it('should cancel the transaction', () => {
      component.legalEntityForm = createLegalEntityDetailsForm(component);
      component.establishment = genericEstablishmentResponse;
      component.legalEntityForm.get('referenceNo').setValue(genericEstablishmentResponse.registrationNo);
      spyOn(component.changeEstablishmentService, 'cancelTransaction').and.returnValue(of(null));
      component.cancelTransaction();
      expect(component.changeEstablishmentService.router.navigate).toHaveBeenCalled();
    });
    it('should save legal entity', () => {
      genericOwnerReponse.recordAction = ActionTypeEnum.ADD;
      component.isLegalEntityChanged = true;
      component.addOwner();
      setLateFeeIndicator(component, undefined, false, false);
      component.legalEntityForm.get('legalEntity').get('english').setValue(LegalEntityEnum.PARTNERSHIP);
      component.legalEntityForm.get('nationalityCode').get('english').setValue(LegalEntityEnum.PARTNERSHIP);
      component.legalEntityForm.get('paymentType').get('english').setValue(LegalEntityEnum.PARTNERSHIP);
      component.owners[0] = genericOwnerReponse; //Added Owner
      component.ownerFormArray[0].get('isSaved').setValue(true);
      component.ownerFormArray[0].get('isVerified').setValue(true);
      component.showOwnerSection = true;
      component.saveLegalEntity(genericEstablishmentResponse.registrationNo);
      expect(component.hasAllOwnerSaved(component.ownerFormArray)).toBeTruthy();
      expect(component.currentTab).toBe(1);
    });
    xit('saving legal entity without owner being saved should throw mandatory info error', () => {
      genericOwnerReponse.recordAction = ActionTypeEnum.ADD;
      component.isLegalEntityChanged = true;
      component.addOwner();
      component.legalEntityForm.get('legalEntity').get('english').setValue(LegalEntityEnum.PARTNERSHIP);
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.owners[0] = genericOwnerReponse; //Added Owner
      saveAndNextLegalEntity(component, genericEstablishmentResponse.registrationNo).subscribe(() => {
        expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
      });
    });
    it('save legal entity error should be handled', () => {
      genericOwnerReponse.recordAction = ActionTypeEnum.ADD;
      component.isLegalEntityChanged = true;
      component.addOwner();
      component.legalEntityForm.get('legalEntity').get('english').setValue(LegalEntityEnum.PARTNERSHIP);
      component.legalEntityForm.get('nationalityCode').get('english').setValue(LegalEntityEnum.PARTNERSHIP);
      component.legalEntityForm.get('paymentType').get('english').setValue(LegalEntityEnum.PARTNERSHIP);
      setLateFeeIndicator(component, undefined, false, false);
      component.ownerFormArray[0].get('isSaved').setValue(true);
      component.ownerFormArray[0].get('isVerified').setValue(true);
      spyOn(component.alertService, 'showError');
      spyOn(component.changeEstablishmentService, 'changeLegalEntity').and.returnValue(throwError(genericError));
      component.owners[0] = genericOwnerReponse; //Added Owner
      component.saveLegalEntity(genericEstablishmentResponse.registrationNo);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    describe('change legal entity', () => {
      it('from gov/semi to org/society', () => {
        component.estBeforeEdit = {
          ...genericEstablishmentResponse,
          establishmentAccount: {
            ...genericEstablishmentResponse.establishmentAccount,
            paymentType: { english: 'Yes', arabic: undefined }
          }
        };
        component.changeLegalEntity(
          LegalEntityEnum.GOVERNMENT,
          LegalEntityEnum.ORG_REGIONAL,
          NationalityTypeEnum.SAUDI_NATIONAL,
          'Yes',
          new Date(),
          undefined
        );
        expect(component.showInfo).toBeTruthy();
        expect(component.infoKey).toBe(EstablishmentKeyEnum.PAYMENT_SELF_INFO);
        expect(component.showNationality).toBeTruthy();
      });
      it('from gov/semi to individual', () => {
        component.changeLegalEntity(
          LegalEntityEnum.GOVERNMENT,
          LegalEntityEnum.INDIVIDUAL,
          NationalityTypeEnum.SAUDI_NATIONAL,
          'Yes',
          new Date(),
          undefined
        );
        expect(component.showInfo).toBeFalse();
        expect(component.legalEntityForm.get('paymentType').get('english').value).toBe('No');
      });
      it('from gov/semi to partnership', () => {
        component.changeLegalEntity(
          LegalEntityEnum.GOVERNMENT,
          LegalEntityEnum.PARTNERSHIP,
          NationalityTypeEnum.SAUDI_NATIONAL,
          'Yes',
          new Date(),
          undefined
        );
        expect(component.showStartDate).toBeTruthy();
        expect(component.showInfo).toBeFalse();
        expect(component.legalEntityForm.get('paymentType').get('english').value).toBe('No');
      });
    });
    it('should  delete owner', () => {
      component.addOwner();
      component.deleteOwner(0);
      expect(component.owners.length).toBe(0);
    });
  });

  describe('Edit or Reneter', () => {
    beforeEach(() => {
      component.estToken.taskId = 'taskId';
      component.estToken.registrationNo = genericGccEstablishment.registrationNo;
      component.estToken.referenceNo = genericGccEstablishment.registrationNo;
      component.estToken.resourceType = RouterConstants.TRANSACTION_CHANGE_LEGAL_ENTITY;
    });
    it('should initialise the state for establishment legal entity not partnership or individual', () => {
      const govEst = genericEstablishmentResponse;
      govEst.legalEntity.english = LegalEntityEnum.GOVERNMENT;
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(govEst));
      spyOn(component.changeEstablishmentService, 'getEstablishmentFromTransient').and.returnValue(of(govEst));
      spyOn(component.changeEstablishmentService, 'getOwners');
      initialiseForEdit(component, component.estToken);
      expect(component.changeEstablishmentService.getOwners).not.toHaveBeenCalled();
    });
    it('should cancel the transaction', () => {
      component.legalEntityForm = createLegalEntityDetailsForm(component);
      component.establishment = genericEstablishmentResponse;
      component.legalEntityForm.get('referenceNo').setValue(genericEstablishmentResponse.registrationNo);
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      component.cancelTransaction();
      expect(component.changeEstablishmentService.router.navigate).toHaveBeenCalled();
    });
    describe('submit transaction', () => {
      beforeEach(() => {
        component.legalEntityForm = createLegalEntityDetailsForm(component);
        component.legalEntityDocuments = [];
        for (let i = 0; i < 2; i++) {
          genericDocumentItem.documentContent = 'test' + i;
          component.legalEntityDocuments.push(genericDocumentItem);
        }
        spyOn(component.alertService, 'showMandatoryDocumentsError');
        component.legalEntityDocuments.forEach(doc => (doc.documentContent = 'tsting'));
        component.isValidator = true;
      });
      it('should update the worklfow', () => {
        spyOn(component, 'updateBpmTransaction').and.returnValue(of({ english: 'success', arabic: undefined }));
        submitLegalEntity(component, genericEstablishmentResponse.registrationNo).subscribe(() => {
          expect(isDocumentsValid(component.legalEntityDocuments)).toBeTruthy();
          expect(component.alertService.showMandatoryDocumentsError).not.toHaveBeenCalled();
          expect(component.updateBpmTransaction).toHaveBeenCalled();
        });
      });
      it('with  update the worklfow error should be handled', () => {
        spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
        spyOn(component.alertService, 'showError');
        component.submitTransaction(genericEstablishmentResponse.registrationNo);
        expect(component.alertService.showError).toHaveBeenCalled();
        expect(isDocumentsValid(component.legalEntityDocuments)).toBeTruthy();
        expect(component.alertService.showMandatoryDocumentsError).not.toHaveBeenCalled();
      });
      it('without scanning should fail with mandatory documents error', () => {
        component.legalEntityDocuments.forEach(doc => {
          doc.documentContent = null;
          doc.required = true;
          doc.show = true;
        });
        component.submitTransaction(genericEstablishmentResponse.registrationNo);
        expect(isDocumentsValid(component.legalEntityDocuments)).toBeFalsy();
        expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
      });
      it('failing via api should show error', () => {
        spyOn(component.changeEstablishmentService, 'changeLegalEntity').and.returnValue(throwError(genericError));
        spyOn(component.alertService, 'showError');
        component.submitTransaction(genericEstablishmentResponse.registrationNo);

        expect(isDocumentsValid(component.legalEntityDocuments)).toBeTruthy();
        expect(component.alertService.showMandatoryDocumentsError).not.toHaveBeenCalled();
        expect(component.alertService.showError).toHaveBeenCalled();
        expect(component.isValidator).toBeTruthy();
      });
    });
  });

  describe('handle document validations', () => {
    it('in private for non gcc with no owner establishment', () => {
      const documents = [
        DocumentNameEnum.PROOF_LEGAL_ENTITY,
        DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT,
        DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT,
        DocumentNameEnum.OWNERS_ID,
        DocumentNameEnum.PROOF_ESTABLISHMENT_OWNERSHIP,
        DocumentNameEnum.NATIONAL_ID_IQAMA,
        DocumentNameEnum.OTHERS_DOCUMENT,
        DocumentNameEnum.AUTH_DELEGATION_LETTER
      ].map(item => getRequiredDocument(item));
      handleLegalDocuments(documents, false, true, false, false, false, false, false, false);
      expect(findDoc(documents, DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT).show).toBeTruthy();
      expect(findDoc(documents, DocumentNameEnum.OWNERS_ID).show).toBeFalsy();
    });
  });
});

export function getRequiredDocument(nameInEng: string) {
  return { ...new DocumentItem(), ...{ name: { english: nameInEng, arabic: '' }, fromJsonToObject: () => undefined } };
}

export function findDoc(documents: DocumentItem[], nameInEng: string) {
  return documents.find(doc => doc.name.english === nameInEng);
}
