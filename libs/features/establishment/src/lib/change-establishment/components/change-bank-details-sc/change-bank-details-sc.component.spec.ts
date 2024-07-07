/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeEnum,
  bindToObject,
  DocumentItem,
  LovList,
  Role,
  RouterConstants,
  TransactionFeedback,
  WorkflowService
} from '@gosi-ui/core';
import { SpecialCharacterMaskDirective } from '@gosi-ui/foundation-theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  bankListData,
  documentItem,
  documentResponseItemList,
  Forms,
  genericDocumentItem,
  genericError,
  genericEstablishmentResponse,
  genericEstablishmentRouterData,
  genericGccEstablishment,
  TranslateLoaderStub,
  WorkflowServiceStub
} from 'testing';
import { EstablishmentRoutesEnum } from '../../../shared';
import { commonProviders } from '../change-basic-details-sc/change-basic-details-sc.component.spec';
import { ChangeBankDetailsScComponent } from './change-bank-details-sc.component';

describe('ChangeBankDetailsScComponent', () => {
  let component: ChangeBankDetailsScComponent;
  let fixture: ComponentFixture<ChangeBankDetailsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeBankDetailsScComponent, SpecialCharacterMaskDirective],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
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
    fixture = TestBed.createComponent(ChangeBankDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise the view', () => {
      component['estRouterData'].resourceType = RouterConstants.TRANSACTION_CHANGE_EST_BANK_DETAILS;
      component['estRouterData'].registrationNo = 12346;
      component['estRouterData'].taskId = 'abdchs';
      component.changeEstablishmentService.selectedEstablishment = undefined;
      spyOn(component, 'getEstablishmentWithWorkflowData');
      component.ngOnInit();
      expect(component.isValidator).toBeTruthy();
      expect(component.routeToView).toEqual(EstablishmentRoutesEnum.VALIDATOR_BANK_DETAILS);
    });
    it('should initialise view of selected establishment', () => {
      component.estRouterData.taskId = undefined;
      component.changeEstablishmentService.selectedEstablishment = genericEstablishmentResponse;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      const doc = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      doc[2].required = false;
      spyOn(component.documentService, 'getDocuments').and.returnValue(of(doc));
      component.ngOnInit();
      expect(component.establishmentToChange.registrationNo).toBe(genericEstablishmentResponse.registrationNo);
    });
    it('should initialise view of selected establishment without document', () => {
      component.estRouterData.taskId = undefined;
      component.changeEstablishmentService['selectedEstablishment'] = genericEstablishmentResponse;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      spyOn(component.documentService, 'getDocuments').and.returnValue(
        of([bindToObject(new DocumentItem(), documentResponseItemList[0])])
      );
      component.ngOnInit();
      expect(component.establishmentToChange.registrationNo).toBe(genericEstablishmentResponse.registrationNo);
    });
  });
  describe('clear route data', () => {
    it('should clear route data', () => {
      component.isValidator = true;
      component.clearRouteData();
      expect(component.estRouterData.registrationNo).toEqual(0);
    });
  });
  describe('navigate To  validator', () => {
    it('should navigate To validator', () => {
      spyOn(component.changeEstablishmentService, 'navigateToBankDetailsValidator');
      component.navigateToValidator();
      expect(component.changeEstablishmentService.navigateToBankDetailsValidator).toHaveBeenCalled();
    });
  });
  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.bsModalRef).not.toEqual(null);
    });
  });
  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.bsModalRef).not.toEqual(null);
    });
  });
  describe('handle error', () => {
    it('should showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: 'error' });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component, 'clearRouteData');
      spyOn(component.bsModalRef, 'hide');
      component.cancelModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });
  describe('cancel transaction', () => {
    beforeEach(() => {
      component.establishmentToChange = { ...genericEstablishmentResponse };
      (component as any).estRouterData = { ...genericEstablishmentRouterData };
    });
    it('by admin should call revert transaction and on sucess go to inbox if gosi online', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.estRouterData.assignedRole = Role.EST_ADMIN;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.callThrough();
      component.cancelBankDetailsTransaction();
      expect(component.changeEstablishmentService.revertTransaction).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_TODOLIST]);
    });
    it('by admin should call revert transaction with reroute', () => {
      component.isValidator = true;
      component.reRoute = 'adf';
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.estRouterData.assignedRole = Role.EST_ADMIN;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.callThrough();
      component.cancelBankDetailsTransaction();
      expect(component.changeEstablishmentService.revertTransaction).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith([component.reRoute]);
    });
    it('by validator should call revert transaction and on sucess go to validate bank if field office', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.callThrough();
      spyOn(component.changeEstablishmentService, 'navigateToBankDetailsValidator');
      component.cancelBankDetailsTransaction();
      expect(component.changeEstablishmentService.navigateToBankDetailsValidator).toHaveBeenCalled();
    });
    it('by validator should call revert transaction api error', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.cancelBankDetailsTransaction();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should go to profile if person is neither a validator nor an admin', () => {
      component.isValidator = false;
      spyOn((component as any).location, 'back');
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      component.cancelBankDetailsTransaction();
      expect((component as any).location.back).toHaveBeenCalled();
    });
  });
  describe('navigate to view', () => {
    it('should navigate to view', () => {
      spyOn((component as any).location, 'back');
      component.navigateToView();
      expect((component as any).location.back).toHaveBeenCalled();
    });
  });
  describe('update bank details', () => {
    it('should update bank details  validator view', () => {
      const forms = new Forms();
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.editBankDetailsForm = forms.createMockEditBankDetailsForm();
      component.bankDetailsDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.bankDetailsDocuments.push(genericDocumentItem);
      }
      spyOn(component.changeEstablishmentService, 'changeBankDetails').and.returnValue(of(new TransactionFeedback()));
      spyOn(component.alertService, 'showSuccess');
      component.updateBankDetails();
      expect(component.changeEstablishmentService.changeBankDetails).toHaveBeenCalled();
    });
    it('should update bank details api error', () => {
      const forms = new Forms();
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.editBankDetailsForm = forms.createMockEditBankDetailsForm();
      component.bankDetailsDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.bankDetailsDocuments.push(genericDocumentItem);
      }
      spyOn(component.changeEstablishmentService, 'changeBankDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.updateBankDetails();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should throw error when form is invalid', () => {
      component.editBankDetailsForm = component.createEditBankDetailsForm();
      component.editBankDetailsForm.get('ibanAccountNo').setValidators(Validators.required);
      component.editBankDetailsForm.get('ibanAccountNo').updateValueAndValidity();
      component.registrationNo = genericGccEstablishment.registrationNo;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.bankDetailsDocuments = documents;
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.updateBankDetails();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
    it('should update bank details not validator ', () => {
      const forms = new Forms();
      component.isValidator = false;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.editBankDetailsForm = forms.createMockEditBankDetailsForm();
      component.bankDetailsDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.bankDetailsDocuments.push(genericDocumentItem);
      }
      spyOn(component.changeEstablishmentService, 'changeBankDetails').and.returnValue(of(new TransactionFeedback()));
      spyOn(component.location, 'back');
      component.updateBankDetails();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe('get bank details', () => {
    it('should get bank name', () => {
      const forms = new Forms();
      component.editBankDetailsForm = forms.createMockEditBankDetailsForm();
      component.editBankDetailsForm.get('ibanAccountNo').setValue('SA0380000000608010167519');
      spyOn(component.lookupService, 'getBankForIban').and.returnValue(of(bankListData));
      component.getBank();
      expect(component.bankNameList.items[0].value.english).toEqual(bankListData.items[0].value.english);
    });
    it('get bank name from new lovlist', () => {
      const forms = new Forms();
      component.editBankDetailsForm = forms.createMockEditBankDetailsForm();
      component.getBank();
      expect(component.bankNameList).toEqual(new LovList([]));
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
});
