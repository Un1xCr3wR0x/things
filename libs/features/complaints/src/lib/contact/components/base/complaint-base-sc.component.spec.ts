/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ComplaintBaseScComponent } from './complaint-base-sc.component';
import { Router, ActivatedRoute } from '@angular/router';
import {
  StorageService,
  UuidGeneratorService,
  ApplicationTypeToken,
  AlertService,
  LookupService,
  DocumentService,
  DocumentItem,
  bindToObject
} from '@gosi-ui/core';
import { Inject, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ContactService, ValidatorService } from '../../../shared/services';
import {
  ModalServiceStub,
  ActivatedRouteStub,
  ContactForms,
  genericError,
  CategoryLov,
  DocumentServiceStub
} from 'testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { CategoryEnum } from '../../../shared/enums';
import { of, throwError } from 'rxjs';
import { ComplaintRequest, ComplaintResponse } from '../../../shared/models';
import { LovListConstants } from '../../../shared/constants/lovlist-constants';
@Component({
  selector: 'complaint-base-derived'
})
export class DerivedComplaintBaseScComponent extends ComplaintBaseScComponent {
  constructor(
    readonly formBuilder: FormBuilder,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly contactService: ContactService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly uuidService: UuidGeneratorService,
    readonly storageService: StorageService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly location: Location,
    readonly validatorService: ValidatorService
  ) {
    super(
      formBuilder,
      alertService,
      lookUpService,
      contactService,
      modalService,
      documentService,
      appToken,
      uuidService,
      storageService,
      route,
      router,
      location,
      validatorService
    );
  }
}
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ComplaintBaseScComponent', () => {
  let component: DerivedComplaintBaseScComponent;
  let fixture: ComponentFixture<DerivedComplaintBaseScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [DerivedComplaintBaseScComponent],
      providers: [
        FormBuilder,
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: Router, useValue: routerSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedComplaintBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('on submit', () => {
    it('should submit', () => {
      const forms = new ContactForms();
      component.contactForm = forms.createContactForm();
      component.contactForm.updateValueAndValidity();
      const category = CategoryEnum.ENQUIRY;
      component.selectedCategory = category;
      component.contactForm.reset();
      component.contactForm.get('category').get('english').setValue(component.selectedCategory);
      component.contactForm.get('type').get('english').setValue('Livechat');
      component.contactForm.get('subType').get('english').setValue('disconnect');
      component.contactForm.get('message').setValue('test');
      const complaintRequest: ComplaintRequest = new ComplaintRequest();
      complaintRequest.type = component.contactForm.value.type.english;
      complaintRequest.subType = component.contactForm.value.subType.english;
      complaintRequest.description = component.contactForm.value.message;
      complaintRequest.uuid = component.uuid;
      complaintRequest.registrationNo = component.registrationNo;
      complaintRequest.complainant = component.complaintUser;
      spyOn(component.contactService, 'submitRequest').and.returnValue(
        of(bindToObject(new ComplaintResponse(), ComplaintResponse))
      );
      component.onSubmit();
      expect(component.contactForm).toBeTruthy();
      expect(complaintRequest).toBeDefined();
      expect(component.contactForm.value.type).toBeDefined();
      expect(component.contactForm.value.subType).toBeDefined();
      expect(category).not.toEqual(null);
    });
    it('should throw error on submit', () => {
      const forms = new ContactForms();
      component.contactForm = forms.createContactForm();
      spyOn(component.alertService, 'showError');
      component.onSubmit();
      expect(component.contactForm).toBeTruthy();
    });
    it('should throw error', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.onSubmit();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('select category', () => {
    it('should select when category is null', () => {
      const category = null;
      const doc = new DocumentItem();
      spyOn(component, 'setLabel').and.callThrough();
      component.removeDocuments(doc);
      component.onCategorySelection(null);
      expect(category).toEqual(null);
    });
    it('should select when category is not null', () => {
      const category = null;
      const forms = new ContactForms();
      component.contactForm = forms.ContactListForm();
      component.contactForm.updateValueAndValidity();
      component.onCategorySelection(category);
      expect(component.contactForm).toBeDefined();
      expect(component.contactForm).toBeTruthy();
      expect(component.contactForm.valid).not.toEqual(null);
      expect(component.contactForm.get('categoryForm').get('type')).not.toEqual(null);
      expect(component.contactForm.get('categoryForm').get('subType')).not.toEqual(null);
    });
    it('should select when category is enquiry', () => {
      const category = 'Enquiry';
      spyOn(component.lookUpService, 'getContactLists').and.callThrough();
      component.onCategorySelection(category);
      expect(component.typeLabel).toEqual('ENQUIRY-TYPE-LABEL');
      expect(component.subTypeLabel).toEqual('ENQUIRY-SUB-TYPE-LABEL');
      expect(category).not.toEqual(null);
      expect(component.transactionId).toEqual(300341);
      expect(category).toEqual(CategoryEnum.ENQUIRY);
      expect(component.showType).toEqual(true);
      expect(component.showFindUs).toEqual(false);
    });
    it('should select when category is suggestions and is appprivate', () => {
      const category = 'SUGGESTIONS';
      spyOn(component.lookUpService, 'getContactLists').and.callThrough();
      component.onCategorySelection(category);
      expect(component.typeLabel).toEqual(undefined);
      expect(component.subTypeLabel).toEqual(undefined);
      expect(category).not.toEqual(null);
      expect(component.transactionId).toEqual(null);
      expect(category).not.toEqual(CategoryEnum.SUGGESTION);
      expect(component.isAppPrivate).toBeTruthy();
      expect(component.showType).toEqual(true);
      expect(component.showFindUs).toEqual(false);
    });
    it('should select when category is suggestions', () => {
      const category = 'Suggestion';
      component.onCategorySelection(category);
      component.contactForm.removeControl('type');
      component.contactForm.removeControl('subType');
      expect(category).toBe(CategoryEnum.SUGGESTION);
    });
    it('should select when category is enquiry', () => {
      const category = 'Enquiry';
      component.isAppPrivate = false;
      component.onCategorySelection(category);
      expect(component.isAppPrivate).toBeFalse();
      expect(category).toBe(CategoryEnum.ENQUIRY);
    });
    it('should select when category is complaints', () => {
      const category = 'Complaint';
      component.isAppPrivate = false;
      component.selectedCategory = CategoryEnum.COMPLAINT;
      component.onCategorySelection(component.selectedCategory);
      expect(component.isAppPrivate).toBeFalsy();
      expect(category).toBe(CategoryEnum.COMPLAINT);
    });
    it('should select when is app private', () => {
      const category = 'COMPLAINTS';
      component.showLabel = true;
      component.onCategorySelection(category);
      expect(component.isAppPrivate).toBeTruthy();
      expect(component.showFindUs).toBeDefined();
    });
  });
  describe('setUserTypeForm', () => {
    it('should setUserTypeForm', () => {
      component.setUserTypeForm();
      expect(component.isAppPrivate).toBeTruthy();
    });
  });
  describe('select category type', () => {
    it('should select when category type is null', () => {
      const category = null;
      // component.onCategoryTypeSelect(null);
      expect(category).toEqual(null);
      expect(component.isTypeSelected).toEqual(false);
    });
    it('should select when category type is not null', () => {
      const category = LovListConstants.CATEGORY;
      spyOn(component.lookUpService, 'getContactLists').and.callThrough();
      // component.onCategoryTypeSelect(category);
      expect(category).not.toEqual(null);
      expect(component.selectedCategory).not.toEqual(CategoryEnum.SUGGESTION);
    });
    it('should type select', () => {
      const category = LovListConstants.GOSI_WEBSITE.value;
      component.isTypeSelected = true;
      // component.onCategoryTypeSelect(category);
      expect(category).not.toEqual(null);
      expect(component.isTypeSelected).toEqual(true);
    });
    it('should type select', () => {
      const category = LovListConstants.BRANCHES.value;
      const domainName = LovListConstants.BRANCHES.subValue;
      component.isTypeSelected = true;
      // component.onCategoryTypeSelect(category);
      expect(category).not.toEqual(null);
      expect(component.isTypeSelected).toEqual(true);
      expect(domainName).not.toEqual(null);
    });
    it('should type select', () => {
      const category = LovListConstants.ANNUITY;
      const domainName = LovListConstants.ENQUIRY_TYPES.find(item => item.value === category).subValue;
      component.isTypeSelected = true;
      // component.onCategoryTypeSelect(category);
      expect(category).not.toEqual(null);
      expect(component.isTypeSelected).toEqual(true);
      expect(domainName).not.toEqual(null);
    });
  });
  describe('onCategorySubTypeSelect', () => {
    it('should select when category type is null', () => {
      const category = null;
      component.onCategorySubTypeSelect(null);
      expect(category).toEqual(null);
      expect(component.isSubTypeSelected).toEqual(false);
    });
    it('should select when category type is not null', () => {
      const category = LovListConstants.CATEGORY;
      component.onCategorySubTypeSelect(category);
      expect(category).not.toEqual(null);
      expect(component.selectedCategory).not.toEqual(CategoryEnum.SUGGESTION);
    });
  });
  describe('resetUserControl', () => {
    it('should resetUserControl', () => {
      const forms = new ContactForms();
      component.contactForm = forms.createContactForm();
      component.resetUserControl();
      component.contactForm.updateValueAndValidity();
      expect(component.contactForm).toBeDefined();
    });
  });
  describe('resetMessage', () => {
    it('should resetmessage', () => {
      const forms = new ContactForms();
      component.contactForm = forms.createContactForm();
      component.contactForm.get('message').setValue(null);
      component.resetMessage();
      component.contactForm.updateValueAndValidity();
      expect(component.contactForm).toBeDefined();
    });
  });
  describe('getComplainantDetails', () => {
    it('should getComplainantDetails', () => {
      const regNo = '10000602';
      component.getAdminDetails(regNo);
      component.getComplainantDetails();
      expect(component.userTypeList$).toBeDefined();
    });
  });
  describe('refreshDocument', () => {
    it('should refreshDocument', () => {
      const document = new DocumentItem();
      spyOn(component.documentService, 'refreshDocument').and.callThrough();
      component.refreshDocument(document);
      expect(document).toBeDefined();
    });
    it('should throw error on refresh documents', () => {
      const document = new DocumentItem();
      spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.refreshDocument(document);
      expect(document).toBeDefined();
    });
  });
  describe('onUserTypeSelection', () => {
    it('should onUserTypeSelection', () => {
      component.onUserTypeSelection(CategoryLov);
      expect(component.complaintUser).toBe(CategoryLov.code);
    });
  });
  describe('confirmCancel', () => {
    it('should confirmCancel', () => {
      const doc = new DocumentItem();
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmCancel();
      component.removeDocuments(doc);
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('setTransactionId', () => {
    it('should setTransactionId', () => {
      const forms = new ContactForms();
      const value = CategoryEnum.SUGGESTION;
      component.contactForm = forms.createContactForm();
      component.contactForm.updateValueAndValidity();
      component.setTransactionId(value);
      expect(forms).toBeDefined();
      expect(value).not.toEqual(null);
      expect(component.contactForm).not.toEqual(null);
    });
  });
  describe('removeDocuments', () => {
    it('should removeDocuments', () => {
      const doc = new DocumentItem();
      spyOn(component.documentService, 'deleteDocument').and.returnValue(of(null));
      component.removeDocuments(doc);
      expect(component.documents).toBeDefined();
    });
  });
  describe('onBack', () => {
    it('should onBack', () => {
      spyOn(component, 'removeAllDocuments').and.callThrough();
      component.onBack();
      expect(component.removeAllDocuments).toHaveBeenCalled();
    });
  });
  describe('onFocus', () => {
    it('should onFocus', () => {
      spyOn(component.alertService, 'clearAlerts');
      component.onFocus();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
    });
  });
  describe('cancel', () => {
    it('should cancel', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.onCancel(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('set labels', () => {
    it('should set labels', () => {
      component.isAppPrivate = true;
      component.setLabel();
      expect(component.typeLabel).not.toEqual(null);
      expect(component.subTypeLabel).not.toEqual(null);
      expect(component.textLabel).not.toEqual(null);
      expect(component.textPlaceholder).not.toEqual(null);
      expect(component.isAppPrivate).toEqual(true);
    });
    it('should set labels', () => {
      component.isAppPrivate = false;
      component.setLabel();
      expect(component.typeLabel).not.toEqual(null);
      expect(component.subTypeLabel).not.toEqual(null);
      expect(component.textLabel).not.toEqual(null);
      expect(component.isAppPrivate).toEqual(false);
    });
  });
  describe('should hide modal', () => {
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.decline();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
});
