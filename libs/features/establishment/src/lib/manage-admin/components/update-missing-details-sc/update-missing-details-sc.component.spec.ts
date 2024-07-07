/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';
import { EstablishmentRouterData, EstablishmentToken, LoginService } from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { of, throwError } from 'rxjs';
import {
  BilingualTextPipeMock,
  genericAdminResponse,
  genericError,
  genericEstablishmentResponse,
  genericGccEstablishment
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { activatedRouteStub } from '../../../profile/components/establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import { AdminWrapper, SaveAdminResponse } from '../../../shared/models';
import { UpdateMissingDetailsScComponent } from './update-missing-details-sc.component';

describe('UpdateMissingDetailsScComponent', () => {
  let component: UpdateMissingDetailsScComponent;
  let fixture: ComponentFixture<UpdateMissingDetailsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateMissingDetailsScComponent],
      providers: [
        ...commonProviders,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: EstablishmentToken, useValue: new EstablishmentRouterData() },
        { provide: LoginService, useValue: { doLogout: () => {} } }
      ],
      imports: [...commonImports, RouterModule.forRoot([]), NgxPaginationModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMissingDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ng On init', () => {
    it('should initialise the view', () => {
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({ registrationNo: genericEstablishmentResponse.registrationNo })
      );
      activatedRouteStub.paramMap.subscribe(params => {
        component.mainRegNo = +params.get('registrationNo');
      });
      spyOn(component, 'initialiseParams').and.callThrough();
      spyOn(component, 'initialiseView').and.callThrough();
      const adminWrapper: AdminWrapper = { admins: [genericAdminResponse] };
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(of(adminWrapper));
      component.ngOnInit();
      expect(component.initialiseParams).toHaveBeenCalled();
    });
  });
  describe('update transaction', () => {
    it('should update transaction', () => {
      component.updateDetailsForm = component.createEstAdminForm();
      const name = new FormGroup({
        arabic: new FormControl(),
        english: new FormControl()
      });
      const emailId = new FormGroup({
        primary: new FormControl(),
        secondary: new FormControl()
      });
      const contactControl = new FormGroup({
        emailId
      });
      component.estAdmin = genericAdminResponse;
      component.updateDetailsForm.addControl('person', new FormGroup({ name }));
      component.updateDetailsForm.addControl('contactDetail', new FormGroup({ contactControl }));
      component.updateDetailsForm.get('isVerified').setValue(true);
      component.estAdmin.roles = [];
      component.mainRegNo = genericGccEstablishment.registrationNo;
      spyOn(component.adminService, 'saveAdminDetails').and.returnValue(of(new SaveAdminResponse()));
      component.confirmTemplates();
      expect(component.transactionFeedback).not.toBe(null);
    });
  });
  describe('cancel transaction', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component, 'hideModal');
      component.cancelTransaction();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
  describe('confirm template', () => {
    it('should confirm template', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component, 'hideModal');
      component.updateTransaction();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
});
