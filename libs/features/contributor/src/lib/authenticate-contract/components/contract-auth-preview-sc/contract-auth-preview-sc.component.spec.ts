/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, LanguageToken, LookupService } from '@gosi-ui/core';
import * as FormUtil from '@gosi-ui/core/lib/utils/form';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  ContractAuthenticationServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub
} from 'testing';
import { ContractAuthenticationService, PendingContract } from '../../../shared';
import { ContractAuthPreviewScComponent } from './contract-auth-preview-sc.component';

describe('ContractAuthPreviewScComponent', () => {
  let component: ContractAuthPreviewScComponent;
  let fixture: ComponentFixture<ContractAuthPreviewScComponent>;
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ContractAuthPreviewScComponent],
      providers: [
        FormBuilder,
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ContractAuthenticationService, useClass: ContractAuthenticationServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractAuthPreviewScComponent);
    component = fixture.componentInstance;
    spy = spyOn(component, 'navigateToHome');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', inject([ActivatedRoute], route => {
    route.queryParams = of({ reference_number: 'bf93d841' });
    component.contractService.identifier = 1003589783;
    spyOn(component, 'getPendingContract');
    spyOn(component, 'getContractByContractId');
    component.ngOnInit();
    expect(component.getPendingContract).toHaveBeenCalled();
    expect(component.getContractByContractId).toHaveBeenCalled();
  }));

  it('should navigate back to home', () => {
    spy.and.callThrough();
    spyOn(component.router, 'navigate');
    component.navigateToHome();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should get pending contract', () => {
    component.getPendingContract('bf93d841', 1003589783);
    expect(component.pendingContract).toBeDefined();
  });

  it('should set labels for days 0', () => {
    component.pendingContract = new PendingContract();
    component.pendingContract.daysLeft = 0;
    component.setLabelsForDays();
    expect(component.daysLabel).not.toBeNull();
  });

  it('should set labels for days 1', () => {
    component.pendingContract = new PendingContract();
    component.pendingContract.daysLeft = 1;
    component.setLabelsForDays();
    expect(component.daysLabel).not.toBeNull();
  });

  it('should set labels for days 2', () => {
    component.pendingContract = new PendingContract();
    component.pendingContract.daysLeft = 2;
    component.setLabelsForDays();
    expect(component.daysLabel).not.toBeNull();
  });

  it('should set labels for days 7', () => {
    component.pendingContract = new PendingContract();
    component.pendingContract.daysLeft = 7;
    component.setLabelsForDays();
    expect(component.daysLabel).not.toBeNull();
  });

  it('should set labels for days 11', () => {
    component.pendingContract = new PendingContract();
    component.pendingContract.daysLeft = 11;
    component.setLabelsForDays();
    expect(component.daysLabel).not.toBeNull();
  });

  it('should get contract by reference id', () => {
    component.getContractByContractId('bf93d841', 1003589783);
    expect(component.contract).toBeDefined();
  });

  it('should accept contract', () => {
    component.rejectDetailsForm = component.createReceiptForm();
    component.modalRef = new BsModalRef();
    component.confirmAcceptPreview();
    expect(component.acceptOrRejectFlag).toBeTruthy();
  });

  it('should throw error while accepting contract', () => {
    spyOn(component, 'hideModal');
    spyOn(component.contractService, 'acceptPendingContract').and.returnValue(throwError(genericError));
    component.showModal(null);
    component.confirmAcceptPreview();
    expect(component.hideModal).toHaveBeenCalled();
  });

  it('should reject contract', () => {
    component.rejectDetailsForm = component.createReceiptForm();
    const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
    component.rejectDetailsForm.get('reasonForReject.english').setValue('Invalid Wage Detials');
    component.modalRef = new BsModalRef();
    component.confirmRejectPreview();
    expect(component.acceptOrRejectFlag).toBeTruthy();
  });

  it('should throw error while rejecting contract', () => {
    component.rejectDetailsForm = component.createReceiptForm();
    const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
    component.rejectDetailsForm.get('reasonForReject.english').setValue('Invalid Wage Detials');
    spyOn(component.contractService, 'rejectPendingContract').and.returnValue(throwError(genericError));
    component.modalRef = new BsModalRef();
    component.confirmRejectPreview();
    expect(component.acceptOrRejectFlag).toBeFalsy();
  });

  it('should get rejected reason for contract date', () => {
    component.rejectDetailsForm = component.createReceiptForm();
    component.rejectDetailsForm.get('reasonForReject.english').setValue('Invalid Starting or Ending Contract Date');
    expect(component.getRejectedReason()).toBeDefined();
  });

  it('should get rejected reason for labor relationship', () => {
    component.rejectDetailsForm = component.createReceiptForm();
    component.rejectDetailsForm.get('reasonForReject.english').setValue('Incorrect Labor Relationship');
    expect(component.getRejectedReason()).toBeDefined();
  });

  it('should get rejected reason for other', () => {
    component.rejectDetailsForm = component.createReceiptForm();
    component.rejectDetailsForm.get('reasonForReject.english').setValue('Other Reasons');
    expect(component.getRejectedReason()).toBeDefined();
  });

  it('should set other reason flag', () => {
    component.rejectDetailsForm = component.createReceiptForm();
    component.rejectDetailsForm.get('reasonForReject.english').setValue('Other Reasons');
    component.otherValueSelect();
    expect(component.otherReasonFlag).toBeTruthy();
  });

  it('should reset other reason flag', () => {
    component.rejectDetailsForm = component.createReceiptForm();
    component.otherValueSelect();
    expect(component.otherReasonFlag).toBeFalsy();
  });

  it('should print contract', () => {
    spyOn(component.contractService, 'printPreviewByRef').and.callThrough();
    component.printPreview();
    expect(component.contractService.printPreviewByRef).toHaveBeenCalled();
  });
});
