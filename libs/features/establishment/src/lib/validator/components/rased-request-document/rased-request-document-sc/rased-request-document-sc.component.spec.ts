/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafetyInspectionService } from '@gosi-ui/features/establishment/lib/shared';
import { SafetyInspectionStubService, genericEstablishmentResponse } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { RasedRequestDocumentScComponent } from './rased-request-document-sc.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

describe('RasedRequestDocumentScComponent', () => {
  let component: RasedRequestDocumentScComponent;
  let fixture: ComponentFixture<RasedRequestDocumentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [RasedRequestDocumentScComponent],
      providers: [...commonProviders, { provide: SafetyInspectionService, useClass: SafetyInspectionStubService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RasedRequestDocumentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('should initialise component', () => {
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.inspectionId = 1231243;
      spyOn(component, 'initialiseView');
      component.ngOnInit();
      expect(component.initialiseView).toHaveBeenCalled();
    });
  });
  describe('initialise view', () => {
    it('should initialise view', () => {
      component.estRouterData.registrationNo = genericEstablishmentResponse.registrationNo;
      component.estRouterData.inspectionId = 1231243;
      component.estRouterData.referenceNo = 23424;
      spyOn(component, 'getEstablishmentDetails');
      spyOn(component, 'getEstablishmentInspectionDeatils');
      component.initialiseView();
      expect(component.getEstablishmentDetails).toHaveBeenCalled();
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      spyOn(component, 'hideModal');
      spyOn(component, 'navigateBack');
      component.cancelModal();
      expect(component.navigateBack).toHaveBeenCalled();
    });
  });
  describe('hide  modal', () => {
    it('should hide the popUp', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      component.hideModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });
  describe('navigate back', () => {
    it('should navigate to back', () => {
      spyOn(component.location, 'back');
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe('selectPanel', () => {
    it('should select panel', () => {
      component.selectPanel(true, 1);
      expect(component.accordionPanel).toBe(1);
    });
  });
});
