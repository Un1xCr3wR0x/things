/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, LanguageToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import {
  AlertServiceStub,
  ContractAuthenticationServiceStub,
  ContributorServiceStub,
  EngagementServiceStub,
  MockManageWageService
} from 'testing';
import { ContractDetails, Contributor, ContributorRouteConstants } from '../../../shared';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  ManageWageService
} from '../../../shared/services';
import { ViewContractScComponent } from './view-contract-sc.component';

describe('ViewContractScComponent', () => {
  let component: ViewContractScComponent;
  let fixture: ComponentFixture<ViewContractScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ViewContractScComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ContractAuthenticationService, useClass: ContractAuthenticationServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: Location, useValue: { back: () => {} } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContractScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get details for  view', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 426390337;
    component.engagementId = 1523647902;
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    component.getDetailsForView();
    expect(component.contractDetails).toBeDefined();
  });

  it('should handle pagnation', () => {
    component.handlePagination(1);
    expect(component.pageNo).toEqual(1);
  });

  it('should navigate to profile', () => {
    component.registrationNo = 200085744;
    component.socialInsuranceNo = 426390337;
    spyOn(component.location, 'back');
    component.navigateToProfile();
    expect(component.location.back).toHaveBeenCalled();
  });

  it('should navigate to preview', () => {
    spyOn(component.router, 'navigate');
    component.navigateToPreview(new ContractDetails());
    expect(component.router.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_CONTRACT_DETAILS]);
  });
});
