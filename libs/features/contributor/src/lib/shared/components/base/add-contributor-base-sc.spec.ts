/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  CalendarService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import {
  AlertServiceStub,
  CalendarServiceStub,
  ContributorServiceStub,
  CoreEstablishmentServiceStub,
  DocumentServiceStub,
  EngagementServiceStub,
  EstablishmentServiceStub,
  LookupServiceStub,
  MockManageWageService,
  ProgressWizardDcMockComponent,
  WorkflowServiceStub
} from 'testing';
import { ContributorRouteConstants } from '../../constants';
import { ContributorService, EngagementService, EstablishmentService, ManageWageService } from '../../services';
import { AddContributorBaseSc } from './add-contributor-base-sc';

@Component({
  selector: 'cnt-add-cont-derived'
})
export class DerivedAddContributorBase extends AddContributorBaseSc {
  constructor(
    public alertService: AlertService,
    public lookupService: LookupService,
    public contributorService: ContributorService,
    public establishmentService: EstablishmentService,
    public engagementService: EngagementService,
    public documentService: DocumentService,
    public workflowService: WorkflowService,
    public manageWageService: ManageWageService,
    public router: Router,
    public location: Location,
    public calendarService: CalendarService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(
      alertService,
      lookupService,
      contributorService,
      establishmentService,
      engagementService,
      documentService,
      location,
      router,
      manageWageService,
      workflowService,
      calendarService,
      appToken,
      routerDataToken
    );
  }
}

/**
 * Unit test for add-contribitor base class
 */
describe('AddContributorBaseSc', () => {
  let component: DerivedAddContributorBase;
  let fixture: ComponentFixture<DerivedAddContributorBase>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DerivedAddContributorBase, ProgressWizardDcMockComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ProgressWizardDcComponent, useClass: ProgressWizardDcMockComponent },
        { provide: EstablishmentService, useClass: CoreEstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: Router, useValue: routerSpy },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: CalendarService, useClass: CalendarServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedAddContributorBase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all lov list', () => {
    component.setLovLists();
    expect(component.gccCountryList$).toBeDefined();
    expect(component.educationList$).toBeDefined();
    expect(component.specializationList$).toBeDefined();
    expect(component.cityList$).toBeDefined();
    expect(component.genderList$).toBeDefined();
    expect(component.maritalStatusList$).toBeDefined();
    expect(component.yesOrNoList$).toBeDefined();
  });

  it('should cancel transaction', () => {
    component.cancelAddedContributor();
    expect(component.router.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTER_CONTRIBUTOR_SEARCH]);
  });

  xit('should navigate to previous tab', () => {
    component.activeTab = 3;
    component.navigateToPreviousTab();
    expect(component.activeTab).toBe(2);
  });
});
