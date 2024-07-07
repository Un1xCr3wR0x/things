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
import { Alert, ApplicationTypeToken, BilingualText, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRouteStub, BilingualTextPipeMock, ModalServiceStub } from 'testing';
import { DependentEligibilityDetailsScComponent } from './dependent-eligibility-details-sc.component';
import { ModifyBenefitService, DependentSetValues } from '../../shared';

describe('DependentEligibilityDetailsScComponent', () => {
  let component: DependentEligibilityDetailsScComponent;
  let fixture: ComponentFixture<DependentEligibilityDetailsScComponent>;
  const modifyPensionServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'getDependentDetails'
  ]);
  modifyPensionServiceSpy.getDependentDetails.and.returnValue(
    new DependentSetValues([], name, 2323231, 23322121, 77665654, 'pension', 6756555)
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [DependentEligibilityDetailsScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ModifyBenefitService, useValue: modifyPensionServiceSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DependentEligibilityDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      spyOn(component, 'getDependentStausDetails');
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getScreenSize', () => {
    it('should getScreenSize', () => {
      component.getScreenSize();
      expect(component.getScreenSize).toBeDefined();
    });
  });
  describe('getDependentStausDetails', () => {
    it('should get dependent status details', () => {
      spyOn(component, 'getDependentStausDetails');
      const sin = 367189827;
      const benefitRequestId = 1002210558;
      const personId = 21700;
      component.getDependentStausDetails(sin, benefitRequestId, personId);
      expect(component.dependentBenefit).not.toBeNull();
    });
  });
  describe('showErrorMessage', () => {
    it('should show error message', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: 'error' });
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
});
