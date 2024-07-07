/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  LookupService,
  MenuService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  MenuServiceStub,
  ModalServiceStub,
  validatorDetailsMock,
  WorkflowServiceStub
} from 'testing';
import { ViolationProfileScComponent } from '..';
import { ViolationRouteConstants, ViolationsValidatorService } from '../../../shared';
export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ registrationNo: 12563365 });

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ViolationProfileScComponent', () => {
  let component: ViolationProfileScComponent;
  let fixture: ComponentFixture<ViolationProfileScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ViolationProfileScComponent],
      providers: [
        FormBuilder,
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: '' },
        { provide: Router, useValue: routerSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: MenuService,
          useValue: {
            isUserEntitled() {
              return true;
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ViolationProfileScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should set values from params', () => {
      (activatedRouteStub as any).params = of({
        transactionId: 12563365
      });
      spyOn(component, 'initializeView');
      spyOn(component, 'checkIfAuthorized');
      component.ngOnInit();
      expect(component.violationId).not.toEqual(null);
      expect(component.initializeView).toHaveBeenCalled();
      expect(component.checkIfAuthorized).toHaveBeenCalled();
    });
  });
  //should call modifyPenaltyAmount
  it('should call  modifyPenaltyAmount if case', () => {
    component.violationId = 12563365;
    component.transactionDetails = validatorDetailsMock;
    (component.transactionDetails.existingTransactionAvailable = null),
      (component.transactionDetails.existingTransactionId = null),
      component.modifyPenaltyAmount();
  });
  it('should call  cancelViolation if case', () => {
    component.violationId = 12563365;
    component.transactionDetails = validatorDetailsMock;
    (component.transactionDetails.existingTransactionAvailable = ''),
      (component.transactionDetails.existingTransactionId = 0),
      component.cancelViolation();
  });
  it('should call  modifyPenaltyAmount', () => {
    component.violationId = 12563365;
    component.transactionDetails = validatorDetailsMock;
    (component.transactionDetails.existingTransactionAvailable = ''),
      (component.transactionDetails.existingTransactionId = 0),
      component.modifyPenaltyAmount();
  });
  it('should call  cancelViolation', () => {
    component.violationId = 12563365;
    component.transactionDetails = validatorDetailsMock;
    component.cancelViolation();
  });

  describe('Navigate Back', () => {
    it('should go back the previous url', () => {
      spyOn(component.location, 'back');
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });

  describe('decline', () => {
    it('should decline', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      component.closeModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });
});
