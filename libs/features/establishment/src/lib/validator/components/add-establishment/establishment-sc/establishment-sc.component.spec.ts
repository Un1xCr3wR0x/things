/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, ParamMap, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AddressTypeEnum,
  AlertService,
  bindToObject,
  ContactDetails,
  DocumentService,
  EnvironmentToken,
  Establishment,
  EstablishmentPaymentDetails,
  EstablishmentRouterData,
  EstablishmentToken,
  LanguageToken,
  License,
  LookupService,
  Person,
  ProactiveStatusEnum,
  Role,
  RouterConstants
} from '@gosi-ui/core';
import { menuStub } from '@gosi-ui/features/establishment/lib/shared/common-stub.spec';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, of, ReplaySubject, throwError } from 'rxjs';
import {
  AdminData,
  AlertServiceStub,
  documentListItemArray,
  DocumentServiceStub,
  DummyValidatorComponent,
  EstablishmentStubService,
  genericError,
  genericEstablishmentResponse,
  genericOwnerReponse,
  genericPersonResponse,
  LookupServiceStub,
  ModalServiceStub
} from 'testing';
import { documentResonseItemList } from 'testing/test-data/core/document-service';
import {
  genericAddress,
  genericContactDetails,
  genericDocumentItem,
  getAdminError,
  getOwnerError,
  ownerDetailsData,
  verifyAdminResponse
} from 'testing/test-data/features/registration/establishment/base/test-data';
import {
  getEstablishment1Response,
  ownerResponse,
  registrationNo1,
  taskIdParam1,
  validatorParam1
} from 'testing/test-data/features/validator/establishment/test-data';
import { routerSpy } from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import {
  AddEstablishmentService,
  EstablishmentOwnerDetails,
  EstablishmentOwnersWrapper,
  EstablishmentService,
  EstablishmentTypeEnum,
  LegalEntityEnum,
  Owner
} from '../../../../shared';
import { checkForFieldChanges, checkForLicenseChanged, getDocuments } from './establishment-sc-helper';
import { EstablishmentScComponent } from './establishment-sc.component';

export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();
  private querySubject = new ReplaySubject<ParamMap>();

  /**
   * Creates an instance of ActivatedRouteStub
   * @param initialParams
   * @memberof  ActivatedRouteStub
   */
  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();
  readonly queryParamMap = this.querySubject.asObservable();

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
  }
  /** Set the paramMap observables's next value */
  setQueryParams(params?: Params) {
    this.querySubject.next(convertToParamMap(params));
  }
}

export class EstablishmentServiceStub {
  getEstablishment(mainRegistrationNo): Observable<any> {
    if (mainRegistrationNo === getEstablishment1Response.registrationNo) return of(getEstablishment1Response);
    else return of(null);
  }
  setResponse(object: any, response: any) {
    if (response && object) {
      Object.keys(response).forEach(name => {
        if (name in object && response[name]) {
          object[name] = response[name];
        }
      });
    }
    return { ...object };
  }

  /**
   * This is a generic method to map the response to the intended Object
   * @param object
   * @param response
   */
  setResponses(object: any, response: any) {
    if (response && object) {
      Object.keys(response).forEach(name => {
        if (name in object && response[name]) {
          object[name] = response[name];
        }
      });
    }
    return { ...object };
  }

  setPersonsResponse(persons: Person[], response: Person[], person: Person) {
    persons = [];
    person = new Person();
    person.identity = [];
    if (response && persons) {
      response.forEach((res: Person) => {
        if (res) {
          Object.keys(res).forEach(name => {
            if (name in person && res[name]) {
              person[name] = res[name];
            }
          });
          persons.push(person);
          person = new Person();
          person.identity = [];
        }
      });
    }
    return persons;
  }

  setAdminDetails(person: Person, personResponse: Person) {
    if (personResponse) {
      Object.keys(personResponse).forEach(name => {
        if (name in person) {
          person[name] = personResponse[name];
        }
      });
    }
    return { ...person };
  }

  rejectOrReturnEst() {
    return of(null);
  }

  getAdminDetails() {
    return of(verifyAdminResponse);
  }

  approveEstablishment() {
    return of(null);
  }

  getOwnerDetails() {
    return of({ person: [ownerResponse] });
  }

  getProActiveDocumentList(registrationNo: number) {
    if (registrationNo) {
      return of(documentListItemArray);
    } else {
      return throwError(genericError);
    }
  }
}

let activatedRoute: ActivatedRouteStub;
activatedRoute = new ActivatedRouteStub();
activatedRoute.setParamMap({
  id: registrationNo1,
  taskId: taskIdParam1,
  validator: validatorParam1
});
activatedRoute.setQueryParams({ validator: 2 });

describe('EstablishmentScComponent', () => {
  let component: EstablishmentScComponent;
  let fixture: ComponentFixture<EstablishmentScComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [EstablishmentScComponent, DummyValidatorComponent],
      providers: [
        menuStub,
        FormBuilder,
        {
          provide: AddEstablishmentService,
          useClass: EstablishmentServiceStub
        },
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        {
          provide: DocumentService,
          useClass: DocumentServiceStub
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: EstablishmentToken,
          useValue: new EstablishmentRouterData()
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: BsModalService, useClass: ModalServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(EstablishmentScComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
      of(bindToObject(new Establishment(), getEstablishment1Response))
    );
    spyOn(component.documentService, 'getDocumentContent').and.returnValue(of(documentResonseItemList[0]));
    const admin = { person: bindToObject(new Person(), AdminData.person) };
    spyOn(component.establishmentService, 'getSuperAdminDetails').and.returnValue(of(admin));
    const estOwner = new EstablishmentOwnersWrapper();
    const owner = new Owner();
    owner.person = bindToObject(new Person(), ownerDetailsData);
    estOwner.owners.push(owner);
    component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
    spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(of(estOwner));
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('should create ', () => {
      spyOn(component, 'initialiseLookups');
      component.ngOnInit();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });

  describe('fetch admin details for a branch', () => {
    it('should fetch admin details', () => {
      const admin = { person: bindToObject(new Person(), AdminData.person) };
      spyOn(component.establishmentService, 'getSuperAdminDetails').and.returnValue(of(admin));
      component.establishment.registrationNo = 12345612;
      component.establishment.mainEstablishmentRegNo = 12345612;
      component.establishment.establishmentType.english = EstablishmentTypeEnum.BRANCH;
      component.fetchAdminDetails();
      expect(component.hasAdmin).toBe(true);
    });
    it('should throw error', () => {
      spyOn(component.establishmentService, 'getSuperAdminDetails').and.returnValue(throwError(getOwnerError));
      component.establishment.registrationNo = 12345612;
      component.establishment.mainEstablishmentRegNo = 12345612;
      component.establishment.establishmentType.english = EstablishmentTypeEnum.BRANCH;
      component.fetchAdminDetails();
      expect(component.hasAdmin).toBe(true);
    });
    it('should throw admin error', () => {
      spyOn(component.establishmentService, 'getSuperAdminDetails').and.returnValue(throwError(getAdminError));
      component.establishment.registrationNo = 12345612;
      component.establishment.mainEstablishmentRegNo = 12345612;
      component.establishment.establishmentType.english = EstablishmentTypeEnum.BRANCH;
      component.fetchAdminDetails();
      expect(component.hasAdmin).toBe(false);
    });
  });
  describe('fetch owner', () => {
    it('should fetch branch owner details', () => {
      const estOwner = new EstablishmentOwnersWrapper();
      const owner = new Owner();
      owner.person = bindToObject(new Person(), ownerDetailsData);
      estOwner.owners.push(owner);
      spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(of(estOwner));
      component.establishment.registrationNo = 12345612;
      component.establishment.mainEstablishmentRegNo = 12345612;
      component.establishment.establishmentType.english = EstablishmentTypeEnum.BRANCH;
      component.fetchOwnerDetails();
      expect(component.hasOwner).toBeTruthy();
      expect(component.establishmentOwnerDetails.persons.length).toBe(1);
    });
    it('should fetch owner details', () => {
      const estOwner = new EstablishmentOwnersWrapper();
      const owner = new Owner();
      owner.person = bindToObject(new Person(), ownerDetailsData);
      estOwner.owners.push(owner);
      spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(of(estOwner));
      component.establishment.registrationNo = 12345612;
      component.establishment.mainEstablishmentRegNo = 12345612;
      component.establishment.establishmentType.english = 'MAIN';
      component.establishmentOwnerDetails.persons = [];
      component.fetchOwnerDetails();
      expect(component.establishmentOwnerDetails.persons.length).toBe(1);
    });
    it('should throw error', () => {
      spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(throwError(getOwnerError));
      component.establishment.registrationNo = 12345612;
      component.establishment.mainEstablishmentRegNo = 12345612;
      component.establishment.establishmentType.english = EstablishmentTypeEnum.BRANCH;
      component.fetchOwnerDetails();
      expect(component.hasOwner).toBe(false);
    });
  });
  describe('perform validator actions', () => {
    it('should approve', () => {
      const form = new Forms();
      component.validatorForm = form.getForm();
      spyOn(component.modalService, 'show');
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.approveEstablishment(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
    it('should reject', () => {
      const form = new Forms();
      component.validatorForm = form.getForm();
      spyOn(component.modalService, 'show');
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.rejectEstablishment(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
    it('should return', () => {
      const form = new Forms();
      component.validatorForm = form.getForm();
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component.modalService, 'show');
      component.returnEstablishment(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
    it('should confirm approve', () => {
      const form = new Forms();
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(
        of({ english: 'success', arabic: 'succss' })
      );
      component.validatorForm = form.getForm();

      component.bsModalRef = new BsModalRef();
      component.confirmApprove();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
    it('should throw confirm error', () => {
      const form = new Forms();
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(getOwnerError));
      component.validatorForm = form.getForm();
      component.bsModalRef = new BsModalRef();
      spyOn(component.alertService, 'showError');
      component.confirmApprove();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should confirm reject', () => {
      const form = new Forms();
      component.validatorForm = form.getForm();
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(
        of({ english: 'success', arabic: 'succss' })
      );

      component.bsModalRef = new BsModalRef();
      component.confirmRejection();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
    it('should throw reject error', () => {
      const form = new Forms();
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(getOwnerError));
      spyOn(component.alertService, 'showError');
      component.validatorForm = form.getForm();
      component.bsModalRef = new BsModalRef();
      component.confirmRejection();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should confirm return', () => {
      const form = new Forms();
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(
        of({ english: 'success', arabic: 'succss' })
      );
      component.validatorForm = form.getForm();
      component.bsModalRef = new BsModalRef();

      component.confirmReturn();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
    it('should throw confirm error', () => {
      const form = new Forms();
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(getOwnerError));
      component.validatorForm = form.getForm();
      component.bsModalRef = new BsModalRef();
      spyOn(component.alertService, 'showError');
      component.confirmReturn();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('Decline the transaction', () => {
    it('should decline and hide the modal', () => {
      const form = new Forms();
      component.bsModalRef = new BsModalRef();
      component.validatorForm = form.getForm();
      spyOn(component.bsModalRef, 'hide');
      component.hideModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });
  describe('confirm Cancel', () => {
    it('should confirm cancel', () => {
      spyOn(component, 'hideModal');
      component.confirmCancel();
      expect(component.hideModal).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });

  describe('Get Proactive Establishment', () => {
    it('Should initialise for proactive establishment', () => {
      component.estRouterData.assignedRole = Role.VALIDATOR_2;
      const contactDetails: ContactDetails = { ...genericContactDetails, fromJsonToObject: () => undefined };
      contactDetails.addresses.push({
        ...genericAddress,
        type: AddressTypeEnum.POBOX,
        fromJsonToObject: () => undefined
      });
      const proactiveEst: Establishment = {
        ...genericEstablishmentResponse,
        proactiveStatus: ProactiveStatusEnum.PENDING_MOL_OR_MCI,
        legalEntity: { english: LegalEntityEnum.INDIVIDUAL, arabic: '' },
        proactive: true,
        contactDetails: contactDetails
      };
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.referenceNo = genericEstablishmentResponse.recruitmentNo;
      spyOn(component.establishmentService, 'searchOwnerWithQueryParams').and.returnValue(of([genericOwnerReponse]));
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(proactiveEst));
      spyOn(component.establishmentService, 'getEstablishmentFromTransient').and.returnValue(of(proactiveEst));
      component.intialiseView(genericEstablishmentResponse.registrationNo);
      expect(component.establishmentService.getEstablishmentFromTransient).toHaveBeenCalled();
    });
  });

  describe('check for license changes', () => {
    it('should highlight the fields', () => {
      const license: License = {
        issueDate: { gregorian: new Date('12-12-2020'), hijiri: '' },
        number: 12,
        issuingAuthorityCode: { english: 'nochange', arabic: '' },
        expiryDate: null
      };
      const licenseAfter: License = {
        issueDate: { gregorian: new Date(), hijiri: '' },
        number: 123,
        issuingAuthorityCode: { english: 'change', arabic: '' },
        expiryDate: null
      };
      checkForLicenseChanged(
        component,
        { license: license } as Establishment,
        { license: licenseAfter } as Establishment
      );
      expect(component.highlightLicenseIssDate).toBe(true);
      expect(component.highlightLicenseNo).toBe(true);
      expect(component.highlightLiceseExpDate).toBe(false);
      expect(component.highlightLicenseAuth).toBe(true);
    });
    it('should highlight the required details', () => {
      const license: License = undefined;
      const licenseAfter: License = {
        issueDate: { gregorian: new Date(), hijiri: '' },
        number: 123,
        issuingAuthorityCode: { english: 'change', arabic: '' },
        expiryDate: null
      };
      checkForLicenseChanged(
        component,
        { license: license } as Establishment,
        { license: licenseAfter } as Establishment
      );
      expect(component.highlightLicenseIssDate).toBe(true);
      expect(component.highlightLicenseNo).toBe(true);
      expect(component.highlightLiceseExpDate).toBe(false);
      expect(component.highlightLicenseAuth).toBe(true);
    });
    it('should highlight the required details', () => {
      const license: License = undefined;
      const licenseAfter: License = {
        issueDate: undefined,
        number: undefined,
        issuingAuthorityCode: undefined,
        expiryDate: null
      };
      checkForLicenseChanged(
        component,
        { license: license } as Establishment,
        { license: licenseAfter } as Establishment
      );
      expect(component.highlightLicenseIssDate).toBe(false);
      expect(component.highlightLicenseNo).toBe(false);
      expect(component.highlightLiceseExpDate).toBe(false);
      expect(component.highlightLicenseAuth).toBe(false);
    });
  });

  describe('Check field changes', () => {
    it('should highlight only the changed fields', () => {
      const estInDb: Establishment = { ...genericEstablishmentResponse, contactDetails: genericContactDetails };
      const estChanged: Establishment = { ...genericEstablishmentResponse, contactDetails: genericContactDetails };
      checkForFieldChanges(component, estInDb, estChanged);
      expect(component.highlightLicense).toBe(false);
      expect(component.highlightActivityType).toBe(false);
      expect(component.highlightEstEngName).toBe(false);
    });
  });
  describe('Get Documents', () => {
    it('should get documents for proactive documents', () => {
      const est: Establishment = { ...genericEstablishmentResponse, proactive: true };
      spyOn(component.validatorService, 'getProActiveDocumentList').and.returnValue(of([genericDocumentItem]));
      getDocuments(component, est);
      expect(component.validatorService.getProActiveDocumentList).toHaveBeenCalled();
    });
    it('should get documents for gcc establishment', () => {
      const est: Establishment = {
        ...genericEstablishmentResponse,
        gccCountry: true,
        establishmentAccount: { startDate: null, paymentType: null } as EstablishmentPaymentDetails
      };
      component.establishmentOwnerDetails = new EstablishmentOwnerDetails();
      component.establishmentOwnerDetails.persons.push(genericPersonResponse);
      spyOn(component.documentService, 'getDocuments').and.returnValue(of([genericDocumentItem]));
      getDocuments(component, est);
      expect(component.documentService.getDocuments).toHaveBeenCalled();
    });
  });
});

export class Forms {
  fb: FormBuilder = new FormBuilder();

  getForm() {
    return this.fb.group({
      comments: [null, { updateOn: 'blur' }],
      rejectionReason: this.fb.group({
        english: [null, { updateOn: 'blur' }],
        arabic: null
      }),
      returnReason: this.fb.group({
        english: [null, { updateOn: 'blur' }],
        arabic: null
      }),
      taskId: [null, { updateOn: 'blur' }],
      registrationNo: [null, { updateOn: 'blur' }],
      user: [null, { updateOn: 'blur' }]
    });
  }
}
