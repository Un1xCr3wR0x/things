/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  ContractAuthenticationServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  MockManageWageService,
  ModalServiceStub
} from 'testing';
import {
  ContractAuthenticationService,
  ContractDetails,
  Contributor,
  ContributorService,
  EstablishmentService,
  ManageWageService
} from '../../../shared';
import { ContractPreviewScComponent } from './contract-preview-sc.component';

describe('ContractPreviewScComponent', () => {
  let component: ContractPreviewScComponent;
  let fixture: ComponentFixture<ContractPreviewScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ContractPreviewScComponent],
      providers: [
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ContractAuthenticationService, useClass: ContractAuthenticationServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: Location, useValue: { back: () => {} } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractPreviewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should identify transaction type', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'cancel-contract' }]);
    component.identifyTransaction();
    expect(component.isCancelContract).toBeTruthy();
  }));

  it('should initialize view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 426390337;
    component.engagementId = 1523647902;
    component.contractId = 156478;
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    component.initializeView();
    expect(component.contract).toBeDefined();
  });

  it('should  throw error while initializing the view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 426390337;
    component.engagementId = 1523647902;
    component.contractId = 156478;
    spyOn(component, 'showErrorMessage').and.callThrough();
    spyOn(component.contributorService, 'getContributor').and.returnValue(throwError(genericError));
    component.initializeView();
    expect(component.showErrorMessage).toHaveBeenCalled();
  });

  it('should initialize for cancel contract', () => {
    component.contract = new ContractDetails();
    component.contract.status = 'CONTRACT_PENDING_CON';
    spyOn(component, 'getRequiredDocumentList').and.callThrough();
    component.initializeForCancelContract();
    expect(component.getRequiredDocumentList).toHaveBeenCalled();
  });

  it('should refresh document', () => {
    spyOn(component.documentService, 'refreshDocument').and.callThrough();
    component.refreshDocument(new DocumentItem());
    expect(component.documentService.refreshDocument).toHaveBeenCalled();
  });

  it('should navigate to contributorr profile', () => {
    component.isCancelContract = true;
    spyOn(component, 'navigateToPersonalProfile').and.callThrough();
    spyOn(component.location, 'back');
    component.navigateBack();
    expect(component.location.back).toHaveBeenCalled();
  });

  it('should  navigate to  contract  details', () => {
    spyOn(component.location, 'back');
    component.navigateBack();
    expect(component.location.back).toHaveBeenCalled();
  });

  it('should  submit cancel contract transaction', () => {
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
    spyOn(component, 'navigateBack');
    component.showModal(null);
    component.submitCancelContract();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should throw mandatory document error', () => {
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
    spyOn(component, 'showMandatoryDocumentsError').and.callThrough();
    component.submitCancelContract();
    expect(component.showMandatoryDocumentsError).toHaveBeenCalled();
  });

  it('should throw error while  submitting cancel contract', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.contractService, 'cancelPendingContract').and.returnValue(throwError(genericError));
    spyOn(component, 'showErrorMessage');
    component.confirmCancelContract();
    expect(component.showErrorMessage).toHaveBeenCalled();
  });
});
