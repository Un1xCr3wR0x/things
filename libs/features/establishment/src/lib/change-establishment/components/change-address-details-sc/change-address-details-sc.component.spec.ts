/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import {
  ApplicationTypeEnum,
  bindToObject,
  DocumentItem,
  Role,
  RouterConstants,
  TransactionReferenceData,
  WorkflowService
} from '@gosi-ui/core';
import { Establishment } from '@gosi-ui/core';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AddressDcComponentMock,
  documentResponseItemList,
  Forms,
  genericDocumentItem,
  genericError,
  genericEstablishmentResponse,
  genericEstablishmentRouterData,
  transactionReferenceData,
  TranslateLoaderStub,
  WorkflowServiceStub
} from 'testing';
import { DocumentNameEnum, EstablishmentRoutesEnum } from '../../../shared';
import { commonProviders } from '../change-basic-details-sc/change-basic-details-sc.component.spec';
import { ChangeAddressDetailsScComponent } from './change-address-details-sc.component';
import { handleAddressDocuments } from './change-address-helper';

describe('ChangeAddressDetailsScComponent', () => {
  let component: ChangeAddressDetailsScComponent;
  let fixture: ComponentFixture<ChangeAddressDetailsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        })
      ],
      declarations: [ChangeAddressDetailsScComponent],
      providers: [
        ...commonProviders,
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        {
          provide: AddressDcComponent,
          useClass: AddressDcComponentMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAddressDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
        component.initialiseViewWithAddress,
        component.navigateToValidator
      );
      expect(component.establishmentToChange.registrationNo).toBe(genericEstablishmentResponse.registrationNo);
    });
  });

  describe('update contact details', () => {
    it('should save and update contact details', () => {
      const forms = new Forms();
      component.addressDetailsDocuments = [];
      component.editAddressDetailsForm = forms.createMockEditAddressDetailsForm();
      component.editAddressDetailsForm.addControl('saudiAddress', new FormGroup({}));
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.addressDetailsDocuments.push(genericDocumentItem);
      }
      component.isValidator = true;
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.addressDetailsComponent = ({ getAddressValidity: () => true } as unknown) as AddressDcComponent;
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.updateAddressDetails();
      expect(component.alertService.showMandatoryErrorMessage).not.toHaveBeenCalled();
      expect(component.alertService.showMandatoryDocumentsError).not.toHaveBeenCalled();
    });
    it('should throw error when form is invalid', () => {
      const forms = new Forms();
      component.editAddressDetailsForm = forms.createMockEditAddressDetailsForm();
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.addressDetailsDocuments = documents;
      component.isValidator = false;
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.addressDetailsComponent = ({ getAddressValidity: () => false } as unknown) as AddressDcComponent;
      component.updateAddressDetails();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
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
  describe('ngOnInit', () => {
    it('should initialise the view', () => {
      component['estRouterData'].resourceType = RouterConstants.TRANSACTION_CHANGE_EST_ADDRESS_DETAILS;
      component['estRouterData'].registrationNo = 123456;
      component['estRouterData'].taskId = 'abdchs';
      spyOn(component, 'getEstablishmentWithWorkflowData');
      component.ngOnInit();
      expect(component.isValidator).toBeTruthy();
      expect(component.routeToView).toEqual(EstablishmentRoutesEnum.VALIDATOR_ADDRESS_DETAILS);
    });
    it('should initialise view of selected establishment', () => {
      component['estRouterData'].taskId = undefined;
      component.changeEstablishmentService['selectedEstablishment'] = bindToObject(
        new Establishment(),
        genericEstablishmentResponse
      );
      component.ngOnInit();
      expect(component.establishmentToChange.registrationNo).toBe(genericEstablishmentResponse.registrationNo);
    });
  });

  describe('navigate To  validator', () => {
    it('should navigate To validator', () => {
      spyOn(component.changeEstablishmentService, 'navigateToAddressDetailsValidator');
      component.navigateToValidator();
      expect(component.changeEstablishmentService.navigateToAddressDetailsValidator).toHaveBeenCalled();
    });
  });
  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.bsModalRef).not.toEqual(null);
    });
  });

  describe('Documents for the transaction', () => {
    it('for field office', () => {
      const documents = addressDocuments.map(doc => {
        return {
          ...new DocumentItem(),
          ...{
            name: { english: doc, arabic: '' },
            fromJsonToObject: () => undefined
          }
        };
      });
      handleAddressDocuments(documents, false, true);
      expect(documents[0].show).toBeTruthy();
      expect(documents[3].show).toBeFalsy();
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
      component.cancelAddressDetailsTransactions();
      expect(component.changeEstablishmentService.revertTransaction).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_TODOLIST]);
    });
    it('by admin should call revert transaction with reroute', () => {
      component.isValidator = true;
      component.reRoute = 'adf';
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.estRouterData.assignedRole = Role.EST_ADMIN;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.callThrough();
      component.cancelAddressDetailsTransactions();
      expect(component.changeEstablishmentService.revertTransaction).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith([component.reRoute]);
    });
    it('by validator should call revert transaction and on sucess go to validate bank if field office', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.callThrough();
      spyOn(component.changeEstablishmentService, 'navigateToAddressDetailsValidator');
      component.cancelAddressDetailsTransactions();
      expect(component.changeEstablishmentService.navigateToAddressDetailsValidator).toHaveBeenCalled();
    });
    it('by validator should call revert transaction api error', () => {
      component.isValidator = true;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.cancelAddressDetailsTransactions();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should go to profile if person is neither a validator nor an admin', () => {
      component.isValidator = false;
      spyOn((component as any).location, 'back');
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      component.cancelAddressDetailsTransactions();
      expect((component as any).location.back).toHaveBeenCalled();
    });
  });
});
const addressDocuments = [
  DocumentNameEnum.COMPANY_ADDRESS_PROOF,
  DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT,
  DocumentNameEnum.AUTH_DELEGATION_LETTER,
  DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT,
  DocumentNameEnum.NATIONAL_ID_IQAMA,
  DocumentNameEnum.OTHERS_DOCUMENT
];
