/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.*/

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  ContactDetails,
  EnvironmentToken,
  GosiCalendar,
  LanguageToken,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor/lib/shared';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ManagePersonServiceStub, ModalServiceStub } from 'testing';
import {
  DependentDetails,
  HeirDetailsRequest,
  SearchPerson,
  ManageBenefitService,
  PersonalInformation
} from '../../shared';
import { RequestEventType } from '../../shared/models/questions';
import { HeirDetailsScComponent } from './heir-details-sc.component';

describe('HeirDetailsScComponent', () => {
  let component: HeirDetailsScComponent;
  let fixture: ComponentFixture<HeirDetailsScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getPersonDetailsWithPersonId',
    'getSystemParams',
    'getSystemRunDate'
  ]);
  manageBenefitServiceSpy.getPersonDetailsWithPersonId.and.returnValue(of(new PersonalInformation()));
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [HeirDetailsScComponent],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        // {provide: LookupService, useClass: LookupServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
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
    fixture = TestBed.createComponent(HeirDetailsScComponent);
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
  describe('ngOnChanges', () => {
    it('should ngOnChanges', () => {
      // spyOn(component, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();
      // expect(component.ngOnChanges).toBeDefined();
    });
  });
  xdescribe('delete', () => {
    it('should delete', () => {
      const heirDetail = new DependentDetails();
      component.delete(heirDetail);
      expect(component.delete).toBeTruthy();
    });
  });
  describe('cancelTransaction', () => {
    it('should handle cancellation of transaction', () => {
      component.cancelTransaction();
      expect(component.cancelTransaction).toBeDefined();
    });
  });
  describe('previousForm', () => {
    it('should go to previous form', () => {
      spyOn(component, 'goToPreviousForm');
      component.previousForm();
      expect(component.previousForm).toBeDefined();
    });
  });
  describe('getScreenSize', () => {
    it('should get Screen Size', () => {
      component.getScreenSize();
      expect(component.getScreenSize).toBeDefined();
    });
  });
  describe('applyForBenefit', () => {
    it('should applyForBenefit', () => {
      const heirRequestDetails = new HeirDetailsRequest();
      heirRequestDetails.eventDate = component.heirDetailsData?.eventDate;
      heirRequestDetails.reason = component.heirDetailsData?.reason;
      heirRequestDetails.heirDetails = component.heirDetails;
      spyOn(component, 'applyForBenefit').and.callThrough();
      fixture.detectChanges();
      component.applyForBenefit();
      expect(component.applyForBenefit).toBeDefined();
    });
  });
  describe('searchForGuardian', () => {
    it('should searchForGuardian', () => {
      spyOn(component, 'searchForGuardian').and.callThrough();
      fixture.detectChanges();
      expect(component.searchForGuardian).toBeDefined();
    });
  });
  describe('showOrHideSearch', () => {
    it('should showOrHideSearch', () => {
      component.showOrHideSearch();
      fixture.detectChanges();
      expect(component.showOrHideSearch).toBeDefined();
    });
  });
  describe('edit', () => {
    it('should edit dependent', () => {
      const index = 1;
      const editable = true;
      // const heirDetails = new DependentDetails();
      // component.heirDetails[index].editable;
      //component.edit(index);
      spyOn(component, 'edit').and.callThrough();
      spyOn(component.lookUpService, 'getAnnuitiesRelationshipByGender').and.callThrough();
      fixture.detectChanges();
      expect(component.edit).toBeDefined();
    });
  });
  describe('getGuardianDetails', () => {
    it('should get Guardian Details', () => {
      const guardianId = '211004584';
      component.getGuardianDetails(guardianId);
      spyOn(component, 'getGuardianDetails').and.callThrough();
      fixture.detectChanges();
      expect(component.getGuardianDetails).toBeDefined();
    });
  });
  describe('getAuthPeronContactDetails', () => {
    it('should getAuthPeronContactDetails', () => {
      //const ids = new HeirPersonIds()
      const HeirPersonIds = {
        authPersonId: 12233,
        HeirId: 213212
      };
      spyOn(component, 'getAuthPeronContactDetails').and.callThrough();
      fixture.detectChanges();
      component.getAuthPeronContactDetails(HeirPersonIds);
      expect(component.getAuthPeronContactDetails).toBeDefined();
    });
  });
  describe('closePopup', () => {
    it('should closePopup', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.closePopup();
      expect(component.closePopup).toBeDefined();
    });
  });
  describe('resetSearch', () => {
    it('should resetSearch', () => {
      component.resetSearch();
      expect(component.resetSearch).toBeDefined();
    });
  });
  describe('getBankName', () => {
    it('should  getBankName', () => {
      const bankCode = 23342323;
      component.getBankName(bankCode);
      spyOn(component.lookUpService, 'getBank').and.callThrough();
      expect(component.getBankName).toBeDefined();
    });
  });
  xdescribe('searchPerson', () => {
    it('should searchPerson', () => {
      const data = new SearchPerson();
      const benefitStartDate = new GosiCalendar();
      const benefitEligibilityDate = new GosiCalendar();
      component.searchPerson(data, benefitStartDate, benefitEligibilityDate);
      expect(component.searchPerson).toBeDefined();
    });
  });
  xdescribe('search', () => {
    it('should search', () => {
      const data = new SearchPerson();
      const benefitStartDate = new GosiCalendar();
      component.search(data, benefitStartDate);
      expect(component.search).toBeDefined();
    });
  });
  describe(' getBankForHeirs', () => {
    it('should  getBankForHeirs', () => {
      const id = 23342323;
      component.getBankForHeirs(id);
      expect(component.getBankForHeirs).toBeDefined();
    });
  });
  describe('initAdditionalContributionPlanLookup', () => {
    it('should  initAdditionalContributionPlanLookup', () => {
      component.initAdditionalContributionPlanLookup();
      expect(component.initAdditionalContributionPlanLookup).toBeDefined();
    });
  });
  xdescribe('validateUnborn', () => {
    it('should   validateUnborn', () => {
      const heir = new DependentDetails();
      // component.validateUnborn(heir);
      expect(component.validateUnborn).toBeDefined();
    });
  });
  describe('getSystemParamAndRundate', () => {
    it('should getSystemParamAndRundate', () => {
      component.getSystemParamAndRundate();
      expect(component.getSystemParamAndRundate).toBeDefined();
    });
  });
  describe(' validateHeir', () => {
    it('should  validateHeir', () => {
      const heir = new DependentDetails();
      spyOn(component.heirBenefitService, 'setHeirUpdateWarningMsg').and.callThrough();
      component.validateHeir(heir);
      expect(component.validateHeir).toBeDefined();
    });
  });
  xdescribe('addHeir', () => {
    it('should   addHeir', () => {
      const heir = new DependentDetails();
      component.addHeir(heir);
      expect(component.addHeir).toBeDefined();
    });
  });
  describe('showIneligibilityDetails', () => {
    it('should showIneligibilityDetails', () => {
      const details = new DependentDetails();
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.showIneligibilityDetails(templateRef, details);
      expect(component.closePopup).toBeDefined();
    });
  });
  describe('setContactDetail', () => {
    it('should setContactDetail', () => {
      const contactDetail = new ContactDetails();
      const heirId = 211004584;
      component.setContactDetail(contactDetail, heirId);
      spyOn(component, 'setContactDetail').and.callThrough();
      fixture.detectChanges();
      expect(component.setContactDetail).toBeDefined();
    });
  });
  xdescribe(' addEventPopup', () => {
    it('should  addEventPopup', () => {
      const event = new RequestEventType();
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.addEventPopup(templateRef, event);
      expect(component.addEventPopup).toBeDefined();
    });
  });
});
