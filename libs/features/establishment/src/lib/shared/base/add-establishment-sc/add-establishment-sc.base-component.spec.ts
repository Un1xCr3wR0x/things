/* *
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  AlertService,
  BilingualText,
  bindToObject,
  DocumentItem,
  DocumentService,
  EnvironmentToken,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  IdentityTypeEnum,
  Iqama,
  LanguageToken,
  LookupService,
  LovList,
  Person,
  StorageService,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  bankPaymentDetails,
  bankResponse,
  crnData,
  crnDataWithoutOwner,
  deleteOwnerData,
  documentListItemArray,
  DocumentServiceStub,
  enrollEstablishmentResponseData,
  EstablishmentAdminServiceStub,
  establishmentOwnerVerifyResponseData,
  EstablishmentServiceStub,
  EstablishmentStubService,
  establishmentTestData,
  genericEstablishmentResponse,
  identifiers,
  LookupServiceStub,
  mockError,
  ModalServiceStub,
  molEstablishment,
  ownerDetailsData,
  person_withGcc,
  person_withGccType,
  person_withIqama,
  saveAdminData,
  saveAdminResponse,
  saveGccDetails,
  saveOwner,
  StorageServiceStub,
  submitDocumentsData,
  verifyAdminData,
  verifyErrorRequest,
  verifyOwner,
  verifyOwnerErrorResponse,
  verifyOwnerInDb,
  WorkflowServiceStub
} from 'testing';
import { menuStub, routerSpy } from '../../common-stub.spec';
import { EstablishmentTypeEnum, LegalEntityEnum } from '../../enums';
import { EstablishmentOwnerDetails, EstablishmentOwnersWrapper, Owner } from '../../models';
import { AddEstablishmentService, EstablishmentAdminService, EstablishmentService } from '../../services';
import { addGccId, bindIdentifiers } from './add-establishment-helper';
import { AddEstablishmentSCBaseComponent } from './add-establishment-sc.base-component';

@Component({
  selector: 'est-add-establishment-derived',
  template: '<p></p>'
})
export class AddEstablishmentDerivedComponent extends AddEstablishmentSCBaseComponent {
  currentTab = 0;
  totalTabs = 8;
  askForCancel() {}

  routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  /**
   * Creates an instance of HomeComponent
   * @param establishmentService
   * @param establishmentAdminService
   * @param verifyEstablishmentService
   * @param lookupService
   * @param storageService
   * @param route
   * @param documentService
   * @param language
   * @param environment
   * @memberof  HomeComponent
   */
  constructor(
    establishmentService: EstablishmentService,
    addEstablishmentService: AddEstablishmentService,
    establishmentAdminService: EstablishmentAdminService,
    lookupService: LookupService,
    storageService: StorageService,
    readonly documentService: DocumentService,
    alertService: AlertService,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(EnvironmentToken) readonly environment: any,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly workflowService: WorkflowService,
    bsModalService: BsModalService,
    location: Location
  ) {
    super(
      establishmentService,
      addEstablishmentService,
      establishmentAdminService,
      lookupService,
      storageService,
      documentService,
      alertService,
      language,
      estRouterData,
      workflowService,
      bsModalService,
      location,
      router
    );
  }

  nextForm() {
    this.currentTab++;
  }

  resetAdminForm() {}
  resetVerifyAdminForm() {}
  resetOwnerForm() {}
  previousForm() {
    this.currentTab--;
  }
  verifyBirthDate(index: number) {
    throw new Error('Method not implemented.');
  }

  resetToFirstForm() {
    this.currentTab = 0;
  }
  restrictProgressBar() {}

  setSubmittedFalse(index: number) {
    throw new Error('Method not implemented.' + index);
  }

  resetVerifyForm() {}

  setOwnerDetails() {}

  finalForm() {
    this.currentTab = this.totalTabs;
  }

  showErrorMsg(alert: Alert) {
    if (alert) {
      return alert;
    }
  }

  resetVerifyEstablishmentForm() {}

  setFormsForValidations() {}
}

/**
 * Test suit holding the individual test cases for AddEstablishmentSCComponent.
 */
describe('AddEstablishmentSCBaseComponent', () => {
  let addEstablishmentDerivedComponent: AddEstablishmentDerivedComponent;
  let fixture: ComponentFixture<AddEstablishmentDerivedComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), TabsModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [AddEstablishmentDerivedComponent],
      providers: [
        menuStub,
        { provide: EstablishmentService, useClass: EstablishmentStubService },
        {
          provide: AddEstablishmentService,
          useClass: EstablishmentServiceStub
        },
        {
          provide: EstablishmentAdminService,
          useClass: EstablishmentAdminServiceStub
        },
        {
          provide: StorageService,
          useClass: StorageServiceStub
        },
        {
          provide: DocumentService,
          useClass: DocumentServiceStub
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: EstablishmentToken, useValue: new EstablishmentRouterData() },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(AddEstablishmentDerivedComponent);
    addEstablishmentDerivedComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('Should create AddEstablishmentSCComponent', () => {
    expect(addEstablishmentDerivedComponent).toBeTruthy();
  });
  describe('ngOnInit Add establishment', () => {
    it('Should perform initialization tasks', () => {
      addEstablishmentDerivedComponent.ngOnInit();
      expect(addEstablishmentDerivedComponent.organistaionTypeList$).toBeTruthy();
      expect(addEstablishmentDerivedComponent.licenseIssuingAuthorityList$).toBeTruthy();
    });
  });

  describe('save GCC Establishment Details', () => {
    it('should save establishment and get registration number', () => {
      addEstablishmentDerivedComponent.saveEstablishment(saveGccDetails);
      expect(addEstablishmentDerivedComponent.establishment.mainEstablishmentRegNo).toEqual(0);
    });
  });

  describe('save mol establishment details', () => {
    it('should save with crn and lincense empty', () => {
      addEstablishmentDerivedComponent.saveEstablishment(molEstablishment);
      expect(addEstablishmentDerivedComponent.establishment.navigationIndicator).toBe(1);
    });
    it('should update the establishment details', () => {
      const molEstablishmentData = {
        ...molEstablishment,
        navigationIndicator: 1
      };
      addEstablishmentDerivedComponent.isSaved = true;
      addEstablishmentDerivedComponent.saveEstablishment(molEstablishmentData);
      expect(addEstablishmentDerivedComponent.establishment.navigationIndicator).toBe(2);
    });
    it('should throw error', () => {
      spyOn(addEstablishmentDerivedComponent.addEstablishmentService, 'saveEstablishment').and.returnValue(
        throwError(mockError)
      );
      addEstablishmentDerivedComponent.saveEstablishment(molEstablishment);
      expect(addEstablishmentDerivedComponent.establishment.navigationIndicator).toBe(1);
    });
  });
  describe('save CRN Details', () => {
    it('should save crn details', () => {
      addEstablishmentDerivedComponent.saveCRNDetails(crnData);
      expect(addEstablishmentDerivedComponent.isEstablishmentFromMci).toEqual(true);
    });

    it('should save crn details with legal entity corresponding to no owner', () => {
      addEstablishmentDerivedComponent.saveCRNDetails(crnDataWithoutOwner);
      expect(addEstablishmentDerivedComponent.isEstablishmentFromMci).toEqual(true);
    });
  });

  describe('savePaymentDetails', () => {
    it('should save establishment save Payment details', () => {
      addEstablishmentDerivedComponent.establishment.proactive = true;
      addEstablishmentDerivedComponent.savePaymentDetails(bankPaymentDetails);
      expect(addEstablishmentDerivedComponent.isAccountSaved).toEqual(true);
    });
  });

  describe('Bind identifiers', () => {
    it('should bind iqama no from form during save', () => {
      const person: Person = bindIdentifiers(
        bindToObject(new Person(), person_withGcc),
        null,
        establishmentOwnerVerifyResponseData.iqama.iqamaNo.toString()
      );
      const iqama: Iqama = <Iqama>person.identity[1];
      expect(iqama.iqamaNo).toBe(establishmentOwnerVerifyResponseData.iqama.iqamaNo);
    });
    it('should save', () => {
      expect(
        bindIdentifiers(bindToObject(new Person(), person_withGcc), null, null).identity.map(item => item.idType)
      ).toContain(IdentityTypeEnum.NATIONALID);
    });
    it('should bind new gcc identity during save', () => {
      expect(
        bindIdentifiers(bindToObject(new Person(), person_withGcc), '135454843', null).identity.map(item => item.idType)
      ).toContain(IdentityTypeEnum.NATIONALID);
    });
    it('should bind new iqama identity during save', () => {
      expect(
        bindIdentifiers(
          bindToObject(new Person(), person_withGcc),
          null,
          establishmentOwnerVerifyResponseData.iqama.iqamaNo.toString()
        ).identity.map(item => item.idType)
      ).toContain(IdentityTypeEnum.NATIONALID);
    });
  });
  describe('Add gcc Id', () => {
    it('should add gcc id from form', () => {
      expect(
        addGccId(
          bindToObject(new Person(), person_withGccType),
          identifiers,
          addEstablishmentDerivedComponent
        ).identity.map(item => item.idType)
      ).toContain(IdentityTypeEnum.NATIONALID);
    });
    it('should add gcc id from form', () => {
      expect(
        addGccId(
          bindToObject(new Person(), person_withIqama),
          identifiers,
          addEstablishmentDerivedComponent
        ).identity.map(item => item.idType)
      ).toContain(IdentityTypeEnum.IQAMA);
    });
  });

  describe('verify admin', () => {
    it('verify admin', () => {
      addEstablishmentDerivedComponent.verifyAdmin(verifyAdminData);
      expect(addEstablishmentDerivedComponent.editAdminDetails).toEqual(false);
    });
    it('should throw some error', () => {
      spyOn(addEstablishmentDerivedComponent.establishmentAdminService, 'verifyPersonDetails').and.returnValue(
        throwError(mockError)
      );
      addEstablishmentDerivedComponent.verifyAdmin(verifyAdminData);
      expect(addEstablishmentDerivedComponent.verifyAdminStatus).toBeFalsy();
    });
    it('should throw person not found error', () => {
      spyOn(addEstablishmentDerivedComponent.establishmentAdminService, 'verifyPersonDetails').and.returnValue(
        of(null)
      );
      addEstablishmentDerivedComponent.verifyAdmin(verifyAdminData);
      expect(addEstablishmentDerivedComponent.verifyAdminStatus).toBeTruthy();
    });
  });

  describe('save admin', () => {
    it('should save establishment admin', () => {
      addEstablishmentDerivedComponent.establishment = new Establishment();
      addEstablishmentDerivedComponent.establishment.establishmentType.english = EstablishmentTypeEnum.MAIN;
      addEstablishmentDerivedComponent.establishment.legalEntity = new BilingualText();
      addEstablishmentDerivedComponent.establishment.legalEntity.english = LegalEntityEnum.SEMI_GOV;
      addEstablishmentDerivedComponent.saveEstablishmentAdminDetails(saveAdminData);
      expect(addEstablishmentDerivedComponent.establishmentAdmin.person.personId).toEqual(saveAdminResponse.personId);
    });
  });

  describe('get Owner', () => {
    it('should get owners', () => {
      const estOwner = new EstablishmentOwnersWrapper();
      const owner = new Owner();
      owner.person = bindToObject(new Person(), ownerDetailsData);
      estOwner.owners.push(owner);
      spyOn(addEstablishmentDerivedComponent.establishmentService, 'getOwnerDetails').and.returnValue(of(estOwner));
      addEstablishmentDerivedComponent.withOwner = false;
      addEstablishmentDerivedComponent.editEstablishment = true;
      addEstablishmentDerivedComponent.establishment = new Establishment();
      addEstablishmentDerivedComponent.establishment.registrationNo = 54864651321;
      addEstablishmentDerivedComponent.getOwnerDetails();
      expect(addEstablishmentDerivedComponent.withOwner).toBeTruthy();
    });
    it('should throw error', () => {
      spyOn(addEstablishmentDerivedComponent.establishmentService, 'getOwnerDetails').and.returnValue(
        throwError(mockError)
      );
      addEstablishmentDerivedComponent.getOwnerDetails();
      expect(addEstablishmentDerivedComponent.withOwner).toBeFalsy();
    });
  });

  describe('verify owner', () => {
    it('verify owner', () => {
      addEstablishmentDerivedComponent.establishmentOwner = new EstablishmentOwnerDetails();
      addEstablishmentDerivedComponent.establishmentOwner.persons = [];
      addEstablishmentDerivedComponent.molOwnerPersonId = [];
      addEstablishmentDerivedComponent.verifyOwner(verifyOwner, 0);
      expect(addEstablishmentDerivedComponent.editPersonDetails[0]).toEqual(true);
    });
  });

  describe('verify owner with data in db', () => {
    it('should fetch the owner details', () => {
      addEstablishmentDerivedComponent.isIndividual = true;
      addEstablishmentDerivedComponent.addOwner();
      addEstablishmentDerivedComponent.editPersonDetails.push(false);
      addEstablishmentDerivedComponent.verifyPersonStatus.push(false);
      addEstablishmentDerivedComponent.verifyOwner(verifyOwnerInDb, 0);
      expect(addEstablishmentDerivedComponent.editPersonDetails[0]).toEqual(false);
    });
    it('should throw person not found error', () => {
      addEstablishmentDerivedComponent.addOwner();
      addEstablishmentDerivedComponent.editPersonDetails.push(false);
      addEstablishmentDerivedComponent.verifyPersonStatus.push(false);
      spyOn(addEstablishmentDerivedComponent.establishmentAdminService, 'verifyPersonDetails').and.returnValue(
        throwError(verifyOwnerErrorResponse[0])
      );
      addEstablishmentDerivedComponent.verifyOwner(verifyErrorRequest, 0);
      expect(addEstablishmentDerivedComponent.isOwnerSaved[0]).toBe(false);
    });
    it('should throw error', () => {
      addEstablishmentDerivedComponent.addOwner();
      addEstablishmentDerivedComponent.editPersonDetails.push(false);
      addEstablishmentDerivedComponent.verifyPersonStatus.push(false);
      spyOn(addEstablishmentDerivedComponent.establishmentAdminService, 'verifyPersonDetails').and.returnValue(
        throwError(verifyOwnerErrorResponse[1])
      );
      addEstablishmentDerivedComponent.verifyOwner(verifyErrorRequest, 0);
      expect(addEstablishmentDerivedComponent.isOwnerSaved[0]).toBe(false);
    });
  });

  describe('save owner', () => {
    it('should save establishment owner and get registration number', () => {
      addEstablishmentDerivedComponent.establishment.proactive = true;
      addEstablishmentDerivedComponent.addOwner();
      addEstablishmentDerivedComponent.saveOwner(saveOwner);
      expect(addEstablishmentDerivedComponent.ownerIsAdmin).toEqual(false);
    });
  });

  describe('Get owner', () => {
    it('should retrieve owner for the establishment', () => {
      addEstablishmentDerivedComponent.establishment.registrationNo = establishmentTestData[1].registrationNo;
      const estOwner = new EstablishmentOwnersWrapper();
      const owner = new Owner();
      owner.person = bindToObject(new Person(), ownerDetailsData);
      estOwner.owners.push(owner);
      spyOn(addEstablishmentDerivedComponent.establishmentService, 'getOwnerDetails').and.returnValue(of(estOwner));
      addEstablishmentDerivedComponent.getOwnerDetails();
      expect(addEstablishmentDerivedComponent.ownerIsAdmin).toEqual(false);
    });
  });

  describe('submit establishment', () => {
    it('should submit the establishment', () => {
      addEstablishmentDerivedComponent.establishment = new Establishment();
      addEstablishmentDerivedComponent.establishment.proactive = true;
      addEstablishmentDerivedComponent.documentList = [];
      addEstablishmentDerivedComponent.submitDocument({ comments: 'Approve' });
      expect(addEstablishmentDerivedComponent.establishment.registrationNo).toEqual(
        enrollEstablishmentResponseData.registrationNo
      );
    });

    it('should submit the establishment with document', () => {
      const documents = submitDocumentsData;
      addEstablishmentDerivedComponent.establishment = new Establishment();
      addEstablishmentDerivedComponent.documentList = documents;
      addEstablishmentDerivedComponent.submitDocument({ comments: 'Approve' });
      expect(addEstablishmentDerivedComponent.establishment.registrationNo).toEqual(
        enrollEstablishmentResponseData.registrationNo
      );
    });
  });

  describe('delete owner', () => {
    it('should delete the owner', () => {
      addEstablishmentDerivedComponent.ownerIndex = [0, 1];
      addEstablishmentDerivedComponent.establishment.registrationNo = 565488498;
      addEstablishmentDerivedComponent.establishmentOwner.persons.push(bindToObject(new Person(), deleteOwnerData));
      addEstablishmentDerivedComponent.establishmentAdmin.person = bindToObject(new Person(), deleteOwnerData);
      spyOn(addEstablishmentDerivedComponent.addEstablishmentService, 'deleteOwner').and.returnValue(of(null));
      addEstablishmentDerivedComponent.deleteOwner(0);
      expect(addEstablishmentDerivedComponent.ownerIsAdmin).toEqual(false);
    });
  });
  describe('delete Owner Index', () => {
    it('should delete Owner Index', () => {
      addEstablishmentDerivedComponent.ownerIndex[1] = true;
      addEstablishmentDerivedComponent.deleteOwnerIndex(1);
      expect(addEstablishmentDerivedComponent.ownerIndex[1]).toBe(true);
    });
  });
  describe('get Bank', () => {
    it('should get bank', () => {
      spyOn(addEstablishmentDerivedComponent.lookUpService, 'getBankForIban').and.returnValue(of(bankResponse));
      addEstablishmentDerivedComponent.getBank(1);
      addEstablishmentDerivedComponent.bankNameList$.subscribe(_ => {
        expect(bankResponse?.items.length).toBe(0);
      });
    });
  });

  describe('make Owner As Admin', () => {
    it('should make Owner As Admin', () => {
      addEstablishmentDerivedComponent.isOwnerSaved[1] = true;
      addEstablishmentDerivedComponent.makeOwnerAsAdmin();
      expect(addEstablishmentDerivedComponent.isOwnerSaved[1]).toBe(true);
    });
  });
  describe('get ProActive DocumentList', () => {
    it('should get ProActive DocumentList', () => {
      addEstablishmentDerivedComponent.getProActiveDocumentList();
      addEstablishmentDerivedComponent.documentList$.subscribe();
      expect(addEstablishmentDerivedComponent.documentList).toBeDefined();
    });
  });

  describe('Cancelling owner as admin', () => {
    it('should remove owner as admin', () => {
      addEstablishmentDerivedComponent.removeOwnerAsAdmin();
      expect(addEstablishmentDerivedComponent.ownerIsAdmin).toBe(false);
    });
  });
  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      spyOn(addEstablishmentDerivedComponent.documentService, 'refreshDocument').and.returnValue(of(document));
      addEstablishmentDerivedComponent.refreshDocument(document);
      expect(addEstablishmentDerivedComponent.documentService.refreshDocument).toHaveBeenCalled();
    });
  });
  describe('delete  document', () => {
    it('should delete Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      addEstablishmentDerivedComponent.establishment = genericEstablishmentResponse;
      spyOn(addEstablishmentDerivedComponent.documentService, 'deleteDocument').and.returnValue(of(null));
      spyOn(addEstablishmentDerivedComponent.alertService, 'clearAlerts');
      addEstablishmentDerivedComponent.deleteDocument(document);
      expect(addEstablishmentDerivedComponent.alertService.clearAlerts).toHaveBeenCalled();
    });
  });
});
