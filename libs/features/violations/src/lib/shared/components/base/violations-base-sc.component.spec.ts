/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  bindToObject,
  DocumentItem,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  DocumentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  validatorDetailsMock,
  WorkflowServiceStub
} from 'testing';
import { documentListItemArray } from 'testing/test-data/core/document-service';
import { ViolationsBaseScComponent } from '.';
import { ViolationTransaction } from '../..';
import { InspectionChannel } from '../../enums';
import { ViolationsValidatorService } from '../../services';

/** Dummy component to test ValidatorMemberBaseScComponent. */
@Component({
  selector: 'vol-validator-member-base-derived'
})
export class ViolationsBaseDerived extends ViolationsBaseScComponent {
  constructor(
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly validatorService: ViolationsValidatorService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly activatedroute: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location
  ) {
    super(
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router,
      validatorService,
      routerData,
      activatedroute,
      appToken,
      location
    );
  }
}

describe('ViolationsBaseScComponent', () => {
  let component: ViolationsBaseDerived;
  let fixture: ComponentFixture<ViolationsBaseDerived>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ViolationsBaseDerived],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ViolationsBaseDerived);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should show modal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.viewModal(modalRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('should hide modal', () => {
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('handleErrors', () => {
    it('should show error messages', () => {
      spyOn(component.alertService, 'showError');
      component.handleErrors(genericError);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('getDocuments', () => {
    it('should get getDocuments', () => {
      const transactionId = '12345';
      const transactionType = 'business';
      const contractId = 1234;
      const referenceId = 1233;
      spyOn(component.documentService, 'getDocuments').and.returnValue(of(documentListItemArray));
      component.getDocuments(transactionId, transactionType, contractId, referenceId);
      expect(component.documentService.getDocuments).toHaveBeenCalled();
      // expect(component.documentList).not.toBeNull();
    });
  });
  describe('should getViolationDetails', () => {
    it('should call getViolationDetails', () => {
      spyOn(component.validatorService, 'getTransactionDetails').and.returnValue(
        of(bindToObject(new ViolationTransaction(), validatorDetailsMock))
      );
      spyOn(component, 'getDocuments');
      component.initializeView();
      expect(component.getDocuments).not.toBeNull();
      expect(component.validatorService.getTransactionDetails).not.toBeNull();
    });
    it('should call getViolationDetails', () => {
      spyOn(component.validatorService, 'getTransactionDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.initializeView();
      expect(component.getDocuments).not.toBeNull();
      expect(component.alertService.showError).not.toBeNull();
    });
  });
  it('should call getViolationDetails', () => {
    spyOn(component.validatorService, 'getTransactionDetails').and.returnValue(throwError(genericError));
    spyOn(component.alertService, 'showError').and.callThrough();
    component.initializeView();
    expect(component.handleErrors).toBeDefined();
  });
  describe('should getViolationDetails', () => {
    it('should call getViolationDetails', () => {
      const violationId = 123456;
      const regNo = 1234;
      component.channel = InspectionChannel.RASED;
      component.transactionDetails = validatorDetailsMock;
      component.isRasedInspection = true;
      spyOn(component.validatorService, 'getTransactionDetails').and.returnValue(
        of(bindToObject(new ViolationTransaction(), validatorDetailsMock))
      );
      component.getViolationDetails(violationId, regNo);
      expect(component.transactionDetails).not.toBe(null);
      expect(component.validatorService.getTransactionDetails).toHaveBeenCalled();
      expect(component.isRasedInspection).toBeTrue();
      expect(component.isSimisFlag).not.toEqual(null);
    });
  });
  it('should get valid bank details without workflow', () => {
    const violationId = 123456;
    const regNo = 1234;
    component.channel = InspectionChannel.RASED;
    component.isRasedInspection = true;
    component.transactionDetails = validatorDetailsMock;
    spyOn(component.validatorService, 'getTransactionDetails').and.returnValue(
      of(bindToObject(new ViolationTransaction(), validatorDetailsMock))
    );
    component.getViolationDetails(violationId, regNo);
    expect(component.transactionDetails).toBeDefined();
  });
  describe('checkDocumentValidity', () => {
    it('should check validity', () => {
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      expect(component.checkDocumentValidity(new FormGroup({}))).toBeTruthy();
    });
  });
  describe('submitDocuments', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocument(document);
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('should show error', () => {
    it('should show error', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage').and.callThrough();
      component.showError();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('checkDocumentValidity', () => {
    it('should check validity', () => {
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      component.checkDocumentValidity(new FormGroup({}));
      expect(component.checkDocumentValidity(new FormGroup({}))).toBeFalsy();
    });
  });
  describe('rejectViolation', () => {
    it('should rejectViolation', () => {
      component.modalRef = new BsModalRef();
      component.hasSaved = true;
      spyOn(component.validatorService, 'rejectViolation').and.callThrough();
      component.rejectViolation(1);
      component.modalRef.hide();
      expect(component.validatorService.rejectViolation).toHaveBeenCalled();
    });
  });

  it('should get workflow action for submits', () => {
    const action = component.getSuccessMessage();
    expect(action).toBe('VIOLATIONS.WORKFLOW-FEEDBACKS.TRANSACTION-SUBMIT-MESSAGE');
  });
  it('should get navigate to transaction tracking', () => {
    const trackingData = {
      tnxId: '123',
      tnxReference: 123
    };
    spyOn(window, 'open');
    const transactionId = trackingData.tnxId;
    const transactionNumber = trackingData.tnxReference;
    component.goToTransaction(trackingData);
    expect(window.open).toHaveBeenCalled();
  });
});
