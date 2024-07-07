/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApplicationTypeEnum } from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  Forms,
  genericDocumentItem,
  genericError,
  genericEstablishmentResponse,
  SafetyInspectionStubService,
  transactionFeedbackMockData
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { activatedRouteStub } from '../../../profile/components/establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import {
  InspectionDetails,
  OHRate,
  ReinspectionRequest,
  SafetyInspectionConstants,
  SafetyInspectionService
} from '../../../shared';
import { RequestReinspectionScComponent } from './request-reinspection-sc.component';

describe('RequestReinspectionScComponent', () => {
  let component: RequestReinspectionScComponent;
  let fixture: ComponentFixture<RequestReinspectionScComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequestReinspectionScComponent],
      providers: [
        ...commonProviders,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: SafetyInspectionService,
          useClass: SafetyInspectionStubService
        }
      ],
      imports: [...commonImports, RouterModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestReinspectionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initilaise  view', () => {
    it('should initialise view', () => {
      component.safetyInspectionService.registrationNo = genericEstablishmentResponse.registrationNo;
      component.safetyInspectionService.estbalishmentOHRate = new OHRate();
      component.safetyInspectionService.inspectionDetails = new InspectionDetails();
      component.appToken === ApplicationTypeEnum.PRIVATE;
      spyOn(component, 'getDocuments').and.callThrough();
      component.ngOnInit();
      expect(component.isPrivate).toBeTruthy();
    });
  });
  describe('getDocuments', () => {
    it('should get documents', () => {
      component.reInspectionForm = component.createReInspectionForm();
      component.getDocuments();
      expect(component.reInspectionDocuments).not.toBeNull();
    });
  });
  describe('cancel transaction', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component, 'hideModal');
      spyOn(component.alertService, 'clearAlerts');
      component.cancelModal();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
  describe('submit transaction', () => {
    it('should submit transaction', () => {
      const forms = new Forms();
      component.reInspectionForm = forms.createReinspectionForm();
      component.reInspectionDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.reInspectionDocuments.push(genericDocumentItem);
      }
      const request = new ReinspectionRequest();
      request.registrationNumber = genericEstablishmentResponse.registrationNo.toString();
      request.reason = SafetyInspectionConstants.REINSPECTION_REASON;
      request.type = SafetyInspectionConstants.REINSPECTION_TYPE;
      request.inspRefNumber = '123';
      request.currentOHRate = 3;
      component.estbalishmentOHRate = new OHRate();
      component.inspectionDetails = new InspectionDetails();
      spyOn(component.safetyInspectionService, 'createReinspection').and.returnValue(of(transactionFeedbackMockData));
      spyOn(component.alertService, 'showSuccess');
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.submitTransaction();
      expect(component.alertService.showMandatoryDocumentsError).not.toHaveBeenCalled();
    });
    it('should submit transaction api error', () => {
      const forms = new Forms();
      component.reInspectionForm = forms.createReinspectionForm();
      component.reInspectionDocuments = [];
      for (let i = 0; i < 2; i++) {
        genericDocumentItem.documentContent = 'test' + i;
        component.reInspectionDocuments.push(genericDocumentItem);
      }
      const request = new ReinspectionRequest();
      request.registrationNumber = genericEstablishmentResponse.registrationNo.toString();
      request.reason = SafetyInspectionConstants.REINSPECTION_REASON;
      request.type = SafetyInspectionConstants.REINSPECTION_TYPE;
      request.inspRefNumber = '123';
      request.currentOHRate = 3;
      component.estbalishmentOHRate = new OHRate();
      component.inspectionDetails = new InspectionDetails();
      spyOn(component.safetyInspectionService, 'createReinspection').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.submitTransaction();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
});
