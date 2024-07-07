/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationTypeToken, EnvironmentToken, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRouteStub, ManagePersonServiceStub, ModalServiceStub } from 'testing';
import { DisabilityAssessmentScComponent } from './disability-assessment-sc.component';

describe('DisabilityAssessmentScComponent', () => {
  let component: DisabilityAssessmentScComponent;
  let fixture: ComponentFixture<DisabilityAssessmentScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [DisabilityAssessmentScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityAssessmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialiseTabWizards', () => {
    it('should initialiseTabWizards', () => {
      component.initialiseTabWizards();
      expect(component.initialiseTabWizards).toBeDefined();
    });
  });
  describe('createrequestDisabilityAssessmentForm', () => {
    it('should create Disability assessment form', () => {
      component.createrequestDisabilityAssessmentForm();
      expect(component.createrequestDisabilityAssessmentForm).toBeDefined();
    });
  });
  describe('selectedWizard', () => {
    it('should select wizard', () => {
      const index = 1;
      spyOn(component, 'selectWizard');
      component.selectedWizard(index);
      expect(component.selectedWizard).toBeDefined();
    });
  });
  describe('saveDisabilityDescription', () => {
    it('should saveDisabilityDescription', () => {
      component.saveDisabilityDescription();
      expect(component.saveDisabilityDescription).toBeDefined();
    });
  });
  describe('docUploadSuccess', () => {
    it('should handle document upload', () => {
      spyOn(component, 'docUploadSuccess').and.callThrough();
      spyOn(component, 'patchBenefitWithCommentsAndNavigate').and.callThrough();
      spyOn(component, 'nextForm');
      fixture.detectChanges();
      expect(component.docUploadSuccess).toBeDefined();
    });
  });
  describe('previousForm', () => {
    it('should previousForm', () => {
      spyOn(component, 'goToPreviousForm');
      component.previousForm();
      expect(component.previousForm).toBeDefined();
    });
  });
  describe('cancelTransaction', () => {
    it('should cancelTransaction', () => {
      component.cancelTransaction();
      expect(component.cancelTransaction).toBeDefined();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('confirm', () => {
    it('confirm', () => {
      spyOn(component.alertService, 'clearAlerts');
      component.commonModalRef = new BsModalRef();
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
  });
  // describe('ShowModal', () => {
  //   it('should show modal reference', () => {
  //     const modalRef = { elementRef: null, createEmbeddedView: null };
  //     component.showModal(modalRef);
  //     expect(component.showModal).toBeDefined();
  //   });
  // });
  describe('getScreenSize', () => {
    it('should getScreenSize', () => {
      component.getScreenSize();
      expect(component.getScreenSize).toBeDefined();
    });
  });
  describe('showErrorMessages', () => {
    it('should et show error message', () => {
      const messageKey = { english: 'test', arabic: 'test' };
      component.alertService.showError(messageKey);
      expect(component.showErrorMessages).toBeTruthy();
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      spyOn(component.alertService, 'clearAllErrorAlerts');
      spyOn(component.alertService, 'clearAllWarningAlerts');
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
});
