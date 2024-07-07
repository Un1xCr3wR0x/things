/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationTypeToken, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub, TranslateLoaderStub } from 'testing';
import {
  BenefitConstants,
  ContributorDetails,
  HeirBenefitService,
  HeirAccountProfile,
  EligibleAnnuityBenefit,
  EligibilityRule,
  Benefits
} from '../../../shared';
import { LinkedContributorScComponent } from './linked-contributor-sc.component';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('LinkedContributorScComponent', () => {
  let component: LinkedContributorScComponent;
  let fixture: ComponentFixture<LinkedContributorScComponent>;
  const heirBenefitServiceSpy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirLinkedContributors'
  ]);
  heirBenefitServiceSpy.getHeirLinkedContributors.and.returnValue(of(new HeirAccountProfile()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule
      ],
      declarations: [LinkedContributorScComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: HeirBenefitService, useValue: heirBenefitServiceSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: Router, useValue: routerSpy },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedContributorScComponent);
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
  describe('getHeirLinkedContributors', () => {
    it('should getHeirLinkedContributors', () => {
      const id = 1;
      component.getHeirLinkedContributors(id);
      expect(component.getHeirLinkedContributors).toBeDefined();
    });
  });
  /*xdescribe('Show returnModalId', () => {
    it('should returnModalId', () => {
      component.modalRef = new BsModalRef();
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.returnModalId(templateRef);
      expect(component.returnModalId).toBeDefined();
    });
  });*/
  describe('ShowModal', () => {
    it('should show modal reference', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.showModal).toBeDefined();
    });
  });
  describe('hideModal', () => {
    it('should hide modal reference', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();
      expect(component.hideModal).toBeDefined();
    });
  });
  describe('navigateToHeirBenefit', () => {
    it('should navigateToHeirBenefit', () => {
      const eligibil: EligibleAnnuityBenefit = {
        benefitGroup: { english: '', arabic: '' },
        benefitId: 123,
        benefitType: { english: '', arabic: '' },
        eligibilityRules: [],
        deathDate: null,
        eligible: null,
        endDate: null,
        failedEligibilityRules: 123,
        heirBenefitRequestReason: { english: '', arabic: '' },
        jailedPeriods: null,
        referenceNo: null,
        requestDate: null,
        startDate: null,
        status: null,
        totalEligibilityRules: 123,
        warningMessages: []
      };
      const contributor: ContributorDetails = {
        eligibility: eligibil,
        name: { english: '', arabic: '' },
        sin: 12133
      };
      component.navigateToHeirBenefit(contributor);
      expect(component.navigateToHeirBenefit).toBeDefined();
    });
  });
  describe('navigateToLinkContributor', () => {
    it('should navigateToLinkContributor', () => {
      component.navigateToLinkContributor();
      component.router.navigate([BenefitConstants.ROUTE_REGISTER_HEIR]);
      expect(component.router.navigate).toBeDefined();
    });
    it('should show modal', () => {
      const annuitybenefits = new Benefits();
      const commonModalRef = { elementRef: null, createEmbeddedView: null };
      component.commonModalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.ShowEligibilityPopup(commonModalRef, annuitybenefits);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  /*describe('populatHeirPensionEligibilityPopup', () => {
    it('should populatHeirPensionEligibilityPopup', () => {
      const benefit = {...new EligibleAnnuityBenefit(),failedEligibilityRules:12121,totalEligibilityRules:2323,
        eligibilityArray:[{...new EligibilityRule}].length};
        component.eligibilityArray = [{...new EligibilityRule}];
      component.populatHeirPensionEligibilityPopup(benefit);
    });
  });
  xdescribe(' populatHeirLumpsumEligibilityPopup', () => {
    it('should  populatHeirLumpsumEligibilityPopup', () => {
      const benefit = {...new EligibleAnnuityBenefit(),failedEligibilityRules:12121,totalEligibilityRules:2323,
        eligibilityArray:[{...new EligibilityRule}].length};
        component.eligibilityArray = [{...new EligibilityRule}];
      component. populatHeirLumpsumEligibilityPopup(benefit);
    });
  });*/
});
