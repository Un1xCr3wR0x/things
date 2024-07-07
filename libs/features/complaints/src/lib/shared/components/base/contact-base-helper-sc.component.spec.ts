/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactBaseHelperScComponent } from './contact-base-helper-sc.component';
import { Component, Inject } from '@angular/core';
import {
  bindToObject,
  Establishment,
  AlertService,
  DocumentService,
  UuidGeneratorService,
  DocumentItem,
  ApplicationTypeToken,
  LookupService
} from '@gosi-ui/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import {
  EstablishmentData,
  AlertServiceStub,
  CustomerSummaryData,
  genericError,
  ComplaintRequestTest,
  ComplaintRouterTest,
  ModalServiceStub,
  ContactForms,
  DocumentServiceStub
} from 'testing';
import { ValidatorService } from '../../services';
import { CustomerSummary } from '../../models';
import { CategoryEnum } from '../../enums';
import { FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LovListConstants } from '../../constants';
@Component({
  selector: 'contact-base-helper-derived'
})
export class DerivedContactBaseHelperScComponent extends ContactBaseHelperScComponent {
  constructor(
    readonly formBuilder: FormBuilder,
    readonly validatorService: ValidatorService,
    readonly documentService: DocumentService,
    readonly uuidService: UuidGeneratorService,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly modalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      formBuilder,
      validatorService,
      documentService,
      uuidService,
      alertService,
      lookUpService,
      modalService,
      appToken
    );
  }
}
describe('ContactBaseHelperScComponent', () => {
  let component: DerivedContactBaseHelperScComponent;
  let fixture: ComponentFixture<DerivedContactBaseHelperScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        FormBuilder,
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      declarations: [DerivedContactBaseHelperScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedContactBaseHelperScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('should getEstablishmentAdminDetails', () => {
    it('should getEstablishmentAdminDetails', () => {
      const regNo = '10000602';
      spyOn(component.validatorService, 'getEstablishment').and.returnValue(
        of(bindToObject(new Establishment(), EstablishmentData))
      );
      component.getEstablishmentDetails(regNo);
      expect(component.validatorService.getEstablishment).toHaveBeenCalled();
    });
  });
  describe('should getCustomerDetails', () => {
    it('should getCustomerDetails', () => {
      const personId = 123456;
      const regNo = '10000602';
      spyOn(component.validatorService, 'getPersonDetails').and.returnValue(
        of(bindToObject(new CustomerSummary(), CustomerSummaryData))
      );
      component.getCustomerDetails(personId, regNo);
      expect(component.validatorService.getPersonDetails).toHaveBeenCalled();
    });
  });

  describe('should resetDocumentComponent', () => {
    it('should resetDocumentComponent', () => {
      spyOn(component, 'removeAllDocuments');
      component.resetDocumentComponent();
    });
  });
  describe('should getRequiredDocuments', () => {
    it('should getRequiredDocuments', () => {
      let documentList: DocumentItem[] = [];
      component.getDocumentDetails().subscribe();
      spyOn(component, 'refreshDocument');
      component.getRequiredDocuments();
      expect(documentList).not.toEqual(null);
    });
  });
  describe('should refreshDocument', () => {
    it('should refreshDocument', () => {
      const document = new DocumentItem();
      component.category = CategoryEnum.COMPLAINT;
      spyOn(component.documentService, 'refreshDocument').and.callThrough();
      component.refreshDocument(document);
      expect(component.category).toBeDefined();
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
  describe('should removeAllDocuments', () => {
    it('should removeAllDocuments', () => {
      component.uploadDocuments = new Array<DocumentItem>();
      component.uploadDocuments.forEach(doc => {
        component.removeDocuments(doc);
        expect(doc).toBe(new DocumentItem());
      });
      component.removeAllDocuments();
      expect(component.uploadDocuments).toBeDefined();
    });
  });
  describe('should removeDocuments', () => {
    it('should removeDocuments', () => {
      const doc = new DocumentItem();
      component.uuid = ComplaintRequestTest.uuid;
      component.businessKey = ComplaintRouterTest.businessKey;
      spyOn(component, 'getRequiredDocuments').and.callThrough();
      // spyOn(component.documentService, 'deleteDocument').and.returnValue(of(null));
      component.removeDocuments(doc);
      expect(doc).toBeDefined();
      expect(component.uuid).toBeDefined();
      expect(component.businessKey).toBeDefined();
      expect(component.uploadDocuments.length).toBe(0);
      // expect(component.documentService.deleteDocument).toHaveBeenCalled();
    });
  });
  describe('should focus', () => {
    it('should focus', () => {
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      component.onFocus();
      expect(component).toBeTruthy();
    });
  });
  describe('should cancel template', () => {
    it('should cancel template', () => {
      component.modalRef = new BsModalRef();

      component.noOfIncorrectOtp = 0;
      spyOn(component.modalRef, 'hide');
      component.onCancelTemplate();
      expect(component.modalRef.hide).toHaveBeenCalled();

      expect(component.noOfIncorrectOtp).toEqual(0);
    });
  });
  describe('type select', () => {
    it('should type select', () => {
      const category = null;
      const forms = new ContactForms();
      component.contactForm = forms.ContactListForm();
      component.contactForm.updateValueAndValidity();
      component.onCategoryTypeSelect(category);
      expect(component.isTypeSelected).toEqual(false);
      expect(component.contactForm).toBeTruthy();
      expect(component.contactForm.get('categoryForm').get('subType')).not.toEqual(null);
    });
    it('should type select', () => {
      const category = LovListConstants.GOSI_WEBSITE.value;
      component.isTypeSelected = true;
      component.onCategoryTypeSelect(category);
      expect(category).not.toEqual(null);
      expect(component.isTypeSelected).toEqual(true);
    });
    it('should type select', () => {
      const category = LovListConstants.BRANCHES.value;
      const domainName = LovListConstants.BRANCHES.subValue;
      component.isTypeSelected = true;
      component.onCategoryTypeSelect(category);
      expect(category).not.toEqual(null);
      expect(component.isTypeSelected).toEqual(true);
      expect(domainName).not.toEqual(null);
    });
    it('should type select', () => {
      const category = LovListConstants.ANNUITY;
      const domainName = LovListConstants.ENQUIRY_TYPES.find(item => item.value === category).subValue;
      component.isTypeSelected = true;
      component.onCategoryTypeSelect(category);
      expect(category).not.toEqual(null);
      expect(component.isTypeSelected).toEqual(true);
      expect(domainName).not.toEqual(null);
    });
    it('should type select', () => {
      component.category = CategoryEnum.ENQUIRY;
      spyOn(component.lookUpService, 'getContactLists').and.callThrough();
      component.isTypeSelected = true;
      component.onCategoryTypeSelect(component.category);
      expect(component.category).not.toEqual(null);
      expect(component.isTypeSelected).toEqual(true);
      expect(component.subTypeList$).not.toEqual(null);
    });
  });
});
