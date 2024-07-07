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
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterConstants,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ActivatedRouteStub,
  ManagePersonServiceStub,
  ModalServiceStub,
  routerTokenData,
  TranslateLoaderStub
} from 'testing';
import { WomenLumpsumScComponent } from './women-lumpsum-sc.component';
import { BenefitConstants, AnnuityResponseDto } from '../../../shared';
//import { BenefitConstants } from '../../..';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('WomenLumpsumScComponent', () => {
  let component: WomenLumpsumScComponent;
  let fixture: ComponentFixture<WomenLumpsumScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule
      ],
      declarations: [WomenLumpsumScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },

        { provide: Router, useValue: routerSpy },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WomenLumpsumScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getLumpsumBenefitAdjustment', () => {
    it('should get lumpsum benefit adjustment', () => {
      spyOn(component.uiBenefitService, 'getlumpsumBenefitAdjustments');
      component.getLumpsumBenefitAdjustment();
      expect(component.getLumpsumBenefitAdjustment).toBeDefined();
    });
  });
  describe('returnWomenLumpsum', () => {
    it('should return women lumpsum', () => {
      spyOn(component, 'confirmReturn');
      component.returnWomenLumpsum();
      expect(component.returnWomenLumpsum).toBeDefined();
    });
  });
  describe('confirmApproveWomenLumpsum', () => {
    it('should confirm approve women lumpsum', () => {
      spyOn(component, 'confirmApprove');
      component.confirmApproveWomenLumpsum();
      expect(component.confirmApproveWomenLumpsum).toBeDefined();
    });
  });
  describe('confirmRejectWomenLumpsum', () => {
    it('should confirm reject women lumpsum', () => {
      spyOn(component, 'confirmReject');
      component.confirmRejectWomenLumpsum();
      expect(component.confirmRejectWomenLumpsum).toBeDefined();
    });
  });
  describe('navigateToEdit', () => {
    it('should navigateToEdit', () => {
      component.routerData.tabIndicator = 2;
      component.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
      spyOn(component, 'navigateToEdit').and.callThrough();
      component.annuityBenefitDetails = {
        ...new AnnuityResponseDto(),
        benefitType: { english: '', arabic: '' },
        requestDate: null
      };
      spyOn(component.manageBenefitService, 'setRequestDate').and.callThrough();
      component.navigateToEdit();
      fixture.detectChanges();
      expect(component.navigateToEdit).toBeDefined();
    });
  });
  /*describe('reDirectUsersToApplyScreens', () => {
    it('should redirect to users to apply screen', () => {
      // spyOn(component, 'reDirectUsersToApplyScreens');
      reDirectUsersToApplyScreen(
        component.requestType,
        component.socialInsuranceNo,
        component.requestId,
        component.annuityBenefitDetails,
        component.modifyPensionService,
        component.router,
        component.benefitType,
        component.referenceNo
      );
      component.reDirectUsersToApplyScreens();
      expect(component.reDirectUsersToApplyScreens).toBeDefined();
    });
  });*/
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      spyOn(component.alertService, 'clearAllErrorAlerts');
      spyOn(component.alertService, 'clearAllWarningAlerts');
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
});
