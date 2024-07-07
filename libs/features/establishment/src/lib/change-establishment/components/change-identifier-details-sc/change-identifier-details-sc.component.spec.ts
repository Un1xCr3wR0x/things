/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import {
  ApplicationTypeEnum,
  BilingualText,
  bindToObject,
  DocumentItem,
  Establishment,
  hasRequiredField,
  License,
  Role,
  RouterConstants,
  TransactionFeedback,
  TransactionReferenceData,
  WorkflowService
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  BilingualTextPipeMock,
  documentItem,
  documentResponseItemList,
  establishmentDetailsTestData,
  genericDocumentItem,
  genericError,
  genericEstablishmentResponse,
  transactionReferenceData,
  WorkflowServiceStub
} from 'testing';
import {
  Forms,
  genericCrnReponse,
  genericEstablishmentRouterData
} from 'testing/test-data/establishment/change-establishment-test-data';
import { DocumentNameEnum } from '../../../shared';
import { commonImports, commonProviders } from '../change-basic-details-sc/change-basic-details-sc.component.spec';
import { ChangeIdentifierDetailsScComponent } from './change-identifier-details-sc.component';
import {
  bindCrnToForm,
  bindLicenseToForm,
  cancelIdentifierTransaction,
  checkForNationalNoChange,
  getCrnControls,
  hasCrnChanged,
  hasLicenseChanged
} from './change-identifier-helper';
import { createChangeIdentifierDetailsForm } from './identifier-form';

describe('ChangeIdentifierDetailsScComponent', () => {
  let component: ChangeIdentifierDetailsScComponent;
  let fixture: ComponentFixture<ChangeIdentifierDetailsScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeIdentifierDetailsScComponent],
      imports: [...commonImports],
      providers: [
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        ...commonProviders,
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeIdentifierDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ng On init', () => {
    it('should initialise the view', () => {
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_IDENTIFIER_DETAILS;
      component.estRouterData.taskId = 'abdchs';
      spyOn(component, 'getEstablishmentWithWorkflowData');
      component.ngOnInit();
      expect(component.estRouterData.taskId).toEqual('abdchs');
    });
  });
  describe('ng On init', () => {
    it('should initialise view ', () => {
      component.changeEstablishmentService['selectedEstablishment'] = bindToObject(
        new Establishment(),
        genericEstablishmentResponse
      );
      spyOn(component, 'intialiseView');
      component.ngOnInit();
      expect(component.intialiseView).toHaveBeenCalled();
    });
  });
  describe('get Establishment With Workflow Data', () => {
    it('should get  Establishment With Workflow Data', () => {
      spyOn(component, 'getAllComments').and.returnValue(
        of(bindToObject(new TransactionReferenceData(), transactionReferenceData))
      );
      spyOn(component.changeEstablishmentService, 'getEstablishmentFromTransient').and.returnValue(
        of(genericEstablishmentResponse)
      );
      spyOn(component, 'intialiseView');
      component.getWorkflowDetails(component.estRouterData);
      expect(component.establishmentAfterChange).toEqual(genericEstablishmentResponse);
    });
  });
  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.bsModalRef).not.toEqual(null);
    });
  });

  /*  describe('alter licnese document', () => {
    it('should alter licnese document', () => {
      const isMandatory = true;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.identifierDetailsDocuments = documents;
      alterLicenseDocumentValidation(component, isMandatory);
      expect(documentResponseItemList).toBeDefined();
    });
  }); */
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      component.cancelModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      component.hideModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });
  describe('update identifier details', () => {
    it('should update identifier details  validator view', () => {
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      component.identifierDetailsDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.identifierDetailsDocuments.push(genericDocumentItem);
      }
      spyOn(component.alertService, 'showSuccess');
      component.isValidator = true;
      component.updateIdentifierDetails();
      expect(component.changeIdentifierDetailsForm.valid).toEqual(true);
      expect(component.alertService.showSuccess).toHaveBeenCalled();
    });
    it('handle madatory document missing', () => {
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.identifierDetailsDocuments = documents;
      component.isValidator = false;
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.updateIdentifierDetails();
      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
    it('handle error', () => {
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      spyOn(component.changeEstablishmentService, 'changeIdentifierDetails').and.returnValue(throwError(genericError));
      component.identifierDetailsDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.identifierDetailsDocuments.push(genericDocumentItem);
      }
      spyOn(component.alertService, 'showError');
      component.isValidator = true;
      component.updateIdentifierDetails();
      expect(component.changeIdentifierDetailsForm.valid).toEqual(true);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('handle bpm error', () => {
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      component.identifierDetailsDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.identifierDetailsDocuments.push(genericDocumentItem);
      }
      spyOn(component.alertService, 'showError');
      component.isValidator = true;
      component.updateIdentifierDetails();
      expect(component.changeIdentifierDetailsForm.valid).toEqual(true);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('initialise view', () => {
    it('should initialise view', () => {
      const forms = new Forms();
      component.changeIdentifierDetailsForm = forms.createMockChangeIdentifierDetailsForm();
      const testdata = genericEstablishmentResponse;
      testdata.crn = { number: 423423432, issueDate: { gregorian: new Date(), hijiri: 'testdata' }, mciVerified: true };
      component.changeEstablishmentService['selectedEstablishment'] = bindToObject(new Establishment(), testdata);
      component.intialiseView();
      expect(component.identifierDetailsDocuments.length).toBeGreaterThan(0);
    });
  });
  describe('hasRecruitmentNumberChanged', () => {
    it('should hasRecruitmentNumberChanged', () => {
      component.hasCrn = true;
      const forms = new Forms();
      component.changeIdentifierDetailsForm = forms.createMockChangeIdentifierDetailsForm();
      component.changeIdentifierDetailsForm.get('recruitmentNo').setValue(123456);
      component.changeIdentifierDetailsForm.get('recruitmentNo').updateValueAndValidity();
      component.establishmentToChange = bindToObject(new Establishment(), genericEstablishmentResponse);
      component.establishmentToChange.recruitmentNo = 54651321;
      component.identifierDetailsDocuments = [...crnAndLicenseDocs];
      component.hasRecruitmentNumberChanged();
      expect(component.hasCrn).toEqual(true);
      expect(component.hasRecruitmentNoChanged).toEqual(true);
    });
  });

  describe('get establishment', () => {
    it('should get the establishment', () => {
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      component.establishmentToChange = genericEstablishmentResponse;
      component.getEstablishment(establishmentDetailsTestData.registrationNo);
      expect(component.establishmentToChange.registrationNo).toBe(establishmentDetailsTestData.registrationNo);
    });
    it('error should be handle', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));

      component.getEstablishment(genericEstablishmentResponse.registrationNo);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('update bpm', () => {
    it('should update bpm', () => {
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      component.estRouterData.taskId = '1561651';
      component.estRouterData.user = 'abcd';
      component.transactionFeedback = new TransactionFeedback();
      const bilingualResponse = new BilingualText();
      component.transactionFeedback.successMessage = bilingualResponse;
      spyOn(component.alertService, 'showSuccess');
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(of(bilingualResponse));
      component.updateBpm(component.estRouterData, 'comments', bilingualResponse).subscribe(() => {
        expect(component.alertService.showSuccess).toHaveBeenCalled();
      });
    });
  });
  describe('bind document content', () => {
    it('should bind document content', () => {
      const document = new DocumentItem();
      spyOn(component.documentService, 'refreshDocument').and.returnValue(of(documentItem));
      component.refreshDocumentContent(document, component.registrationNo, component.documentTransactionType);
      expect(component.documentService.refreshDocument).toHaveBeenCalled();
    });
  });
  describe('bind license to form', () => {
    it('should bind the value  from the establishment to form', () => {
      component.establishmentToChange = genericEstablishmentResponse;
      const license = {
        issueDate: { gregorian: new Date(), hijiri: 'tetsing' },
        expiryDate: { gregorian: new Date(), hijiri: 'tetsing' },
        issuingAuthorityCode: { english: 'testing', arabic: 'testing' },
        number: 123456
      };
      component.establishmentToChange.license = license;
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      bindLicenseToForm(component, component.establishmentToChange);
      expect(component.changeIdentifierDetailsForm.get('license').get('number').value).toBe(
        genericEstablishmentResponse.license.number
      );
      expect(component.changeIdentifierDetailsForm.get('license').get('issueDate').get('gregorian').value).toEqual(
        genericEstablishmentResponse.license.issueDate.gregorian
      );
      expect(
        component.changeIdentifierDetailsForm.get('license').get('issuingAuthorityCode').get('english').value
      ).toBe(genericEstablishmentResponse.license.issuingAuthorityCode.english);
    });
  });
  describe('Alter License Documents', () => {
    beforeEach(() => {
      const license = {
        ...genericDocumentItem,
        ...{
          name: { english: DocumentNameEnum.LICENSE_DOCUMENT, arabic: '' },
          ...{ fromJsonToObject: () => undefined }
        }
      };
      const crn = {
        ...genericDocumentItem,
        ...{
          name: { english: DocumentNameEnum.COMMERCIAL_REG_DOCUMENT, arabic: '' },
          ...{ fromJsonToObject: () => undefined }
        }
      };
      component.identifierDetailsDocuments = [license, crn];
    });
    it('should make license mandatory if license has changed', () => {
      const licenseDoc = component.identifierDetailsDocuments.find(
        item => item.name.english === DocumentNameEnum.LICENSE_DOCUMENT
      );
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      component.establishmentToChange = genericEstablishmentResponse;
      component.changeIdentifierDetailsForm.patchValue({
        license: {
          issueDate: { gregorian: null, hijiri: null },
          expiryDate: { gregorian: null, hijiri: null },
          issuingAuthorityCode: { english: null, arabic: null },
          number: 123456
        },
        recruitmentNo: 1234345678
      });
      component.makeLicenseMandatory();
      expect(licenseDoc.required).toBeTruthy();
      expect(licenseDoc.show).toBeTruthy();
    });
  });

  describe('User Verifying Crn', () => {
    beforeEach(() => {
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
    });
    it('should fetch the crn details from MCI and show the details', () => {
      expect(component.changeIdentifierDetailsForm.get('crn').get('number').value).toBe(null);
      expect(component.changeIdentifierDetailsForm.get('crn').get('issueDate').get('gregorian').value).toBe(null);
      expect(component.changeIdentifierDetailsForm.get('crn').get('mciVerified').value).toBeFalsy();
      spyOn(component.establishmentService, 'getCrnDetailsFromMci').and.returnValue(of(genericCrnReponse));
      component.changeIdentifierDetailsForm.get('crn').patchValue(genericCrnReponse);
      component.verifyCRNNumber();
      expect(component.changeIdentifierDetailsForm.get('crn').get('number').value).toBe(genericCrnReponse.number);
      expect(
        new Date(component.changeIdentifierDetailsForm.get('crn').get('issueDate').get('gregorian').value)
      ).toEqual(genericCrnReponse.issueDate.gregorian);
      expect(component.changeIdentifierDetailsForm.get('crn').get('mciVerified').value).toBeTruthy();
    });
    it('should handle the error from MCI', () => {
      spyOn(component.establishmentService, 'getCrnDetailsFromMci').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.changeIdentifierDetailsForm.get('crn').patchValue(genericCrnReponse);
      component.changeIdentifierDetailsForm.get('crn').updateValueAndValidity();
      component.verifyCRNNumber();
      expect(component.changeIdentifierDetailsForm.get('crn').get('number').valid).toBeTrue();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('Check for User actions on fields and modify the corresponding validations', () => {
    beforeEach(() => {
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      component.establishmentToChange.crn = genericCrnReponse;
      component.establishmentToChange.recruitmentNo = null;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      const crnDoc = { ...new DocumentItem(), name: { english: DocumentNameEnum.COMMERCIAL_REG_DOCUMENT, arabic: '' } };
      const license = { ...new DocumentItem(), name: { english: DocumentNameEnum.LICENSE_DOCUMENT, arabic: '' } };
      component.identifierDetailsDocuments = [...documents, crnDoc, license];
    });
    it('changes the crn details', () => {
      const [crnNumber, issueDate, isVerified, expiryDate] = getCrnControls(component.changeIdentifierDetailsForm);
      const crnDoc = component.identifierDetailsDocuments.find(
        item => item.name.english === DocumentNameEnum.COMMERCIAL_REG_DOCUMENT
      );
      component.checkCrnChanges();
      expect(hasRequiredField(crnNumber)).toBeTruthy();
      expect(hasRequiredField(issueDate)).toBeTruthy();
      expect(isVerified.value).toBeFalsy();
      expect(crnDoc.required).toBeTruthy();
    });
    it('no changes', () => {
      const [crnNumber, issueDate, isVerified, expiryDate] = getCrnControls(component.changeIdentifierDetailsForm);
      bindCrnToForm(component.changeIdentifierDetailsForm.get('crn') as FormGroup, genericCrnReponse);
      expect(new Date(issueDate.value)).toEqual(genericCrnReponse.issueDate.gregorian);
      component.checkCrnChanges();
      expect(new Date(issueDate.value)).toEqual(genericCrnReponse.issueDate.gregorian);
      expect(isVerified.value).toBeTruthy();
      expect(+crnNumber.value).toBe(genericCrnReponse.number);
    });
  });

  describe('Cancelling the transaction', () => {
    beforeEach(() => {
      component.establishmentToChange = { ...genericEstablishmentResponse };
      (component as any).estRouterData = { ...genericEstablishmentRouterData };
    });
    it('by admin should call revert transaction and on sucess go to inbox if gosi online', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.estRouterData.assignedRole = Role.EST_ADMIN;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.callThrough();
      cancelIdentifierTransaction(component);
      expect(component.changeEstablishmentService.revertTransaction).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_TODOLIST]);
    });
    it('by validator should call revert transaction and on sucess go to validate identifier if field office', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.callThrough();
      spyOn(component.changeEstablishmentService, 'navigateToIdentifierValidator');
      cancelIdentifierTransaction(component);
      expect(component.changeEstablishmentService.navigateToIdentifierValidator).toHaveBeenCalled();
    });
    it('should go to profile if person is neither a validator nor an admin', () => {
      component.isValidator = false;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      spyOn(component.location, 'back');
      cancelIdentifierTransaction(component);
      expect(component.location.back).toHaveBeenCalledWith();
    });
  });

  describe('Check if crn has changed', () => {
    it('should expect false if no change', () => {
      expect(hasCrnChanged(null, null)).toBe(false);
    });
    it('should expect true if the crn number and issue date has added', () => {
      expect(
        hasCrnChanged(null, {
          number: 1,
          issueDate: { gregorian: new Date('10/11/2020'), hijiri: '' },
          mciVerified: false
        })
      ).toBe(true);
    });
  });

  describe('Check for national no change', () => {
    beforeEach(() => {
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
    });
    it('if national number has changed but crn and license not changed and est has crn', () => {
      component.establishmentToChange = { ...genericEstablishmentResponse };
      component.hasNationalNoChanged();
      const licenseDoc = new DocumentItem();
      const crnDoc = new DocumentItem();
      component.showNationalNo = true;
      component.hasCrn = true;
      checkForNationalNoChange(component, crnDoc, false, licenseDoc, false);
      expect(crnDoc.show).toBe(true);
      expect(licenseDoc.show).toBe(false);
    });
    it('if national number has changed but crn and license not changed and est has no crn', () => {
      const licenseDoc = new DocumentItem();
      const crnDoc = new DocumentItem();
      component.hasNationalNoChange = true;
      component.showNationalNo = true;
      component.hasCrn = false;
      checkForNationalNoChange(component, crnDoc, false, licenseDoc, false);
      expect(crnDoc.show).toBe(false);
      expect(licenseDoc.show).toBe(true);
    });
    it('if national number has changed and crn and license has changed and est has crn', () => {
      const licenseDoc = new DocumentItem();
      const crnDoc = new DocumentItem();
      component.hasNationalNoChange = true;
      component.showNationalNo = true;
      component.hasCrn = true;
      checkForNationalNoChange(component, crnDoc, true, licenseDoc, true);
      expect(crnDoc.show).toBe(true);
      expect(licenseDoc.show).toBe(true);
    });
    it('if national number and license has changed but crn  not changed and est has no crn', () => {
      const licenseDoc = new DocumentItem();
      const crnDoc = new DocumentItem();
      component.hasNationalNoChange = true;
      component.showNationalNo = true;
      component.hasCrn = false;
      checkForNationalNoChange(component, crnDoc, false, licenseDoc, true);
      expect(crnDoc.show).toBe(false);
      expect(licenseDoc.show).toBe(true);
    });
    it('national number has no change', () => {
      const licenseDoc = new DocumentItem();
      const crnDoc = new DocumentItem();
      crnDoc.show = false;
      licenseDoc.show = false;
      component.hasNationalNoChange = false;
      component.showNationalNo = false;
      component.hasCrn = false;
      checkForNationalNoChange(component, crnDoc, false, licenseDoc, true);
      expect(crnDoc.show).toBe(false);
      expect(licenseDoc.show).toBe(false);
    });
  });

  describe('Reset Crn Details', () => {
    it('Should reset the form details ', () => {
      component.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      component.changeIdentifierDetailsForm.get('crn').patchValue(genericCrnReponse);
      component.resetCRNDetails();
      expect(component.changeIdentifierDetailsForm.get('crn.number').value).toBeFalsy();
    });
  });

  describe('Check if license has changed', () => {
    it('should expect true if license details has changed', () => {
      expect(
        hasLicenseChanged(
          {
            license: { ...testLicense, issueDate: { gregorian: new Date('12-12-2020'), hijiri: undefined } }
          } as Establishment,
          { license: { ...testLicense } } as Establishment
        )
      ).toBe(true);
      expect(
        hasLicenseChanged({ license: testLicense } as Establishment, { license: testLicense } as Establishment)
      ).toBe(false);
      expect(
        hasLicenseChanged(
          { license: { ...testLicense, expiryDate: { gregorian: new Date(), hijiri: undefined } } } as Establishment,
          { license: testLicense } as Establishment
        )
      ).toBe(true);
      expect(
        hasLicenseChanged(
          {
            license: { ...testLicense, expiryDate: { gregorian: new Date('12-12-2020'), hijiri: undefined } }
          } as Establishment,
          { license: { ...testLicense, expiryDate: { gregorian: new Date(), hijiri: undefined } } } as Establishment
        )
      ).toBe(true);
    });
  });
});

const crnAndLicenseDocs = [
  {
    ...genericDocumentItem,
    ...{
      name: { english: DocumentNameEnum.LICENSE_DOCUMENT, arabic: '' },
      ...{ fromJsonToObject: () => undefined }
    }
  },
  {
    ...genericDocumentItem,
    ...{
      name: { english: DocumentNameEnum.COMMERCIAL_REG_DOCUMENT, arabic: '' },
      ...{ fromJsonToObject: () => undefined }
    }
  }
];

export const testLicense: License = {
  issueDate: { gregorian: new Date(), hijiri: '' },
  number: 123,
  issuingAuthorityCode: { english: 'nochange', arabic: '' },
  expiryDate: null
};
