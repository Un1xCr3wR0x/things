/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  LookupService,
  RouterData,
  RouterDataToken,
  DocumentService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import {
  AlertServiceStub,
  AuthTokenServiceStub,
  ContractAuthenticationServiceStub,
  ContributorBaseScComponentMock,
  ContributorServiceStub,
  EngagementServiceStub,
  LookupServiceStub,
  MockManageWageService,
  DocumentServiceStub
} from 'testing';
import {
  ContractAuthenticationService,
  ContributorActionEnum,
  ContributorRouteConstants,
  ContributorService,
  EngagementService,
  ManageWageService
} from '../../../../shared';
import { ContributorBaseScComponent } from '../../../../shared/components';
import { IndividualWageScComponent } from './individual-wage-sc.component';

describe('IndividualWageScComponent', () => {
  let component: IndividualWageScComponent;
  let fixture: ComponentFixture<IndividualWageScComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({}), HttpClientTestingModule],
      declarations: [IndividualWageScComponent],
      providers: [
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PUBLIC },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        { provide: ContractAuthenticationService, useClass: ContractAuthenticationServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: DocumentService, useClass: DocumentServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualWageScComponent);
    component = fixture.componentInstance;
    /** Polyfill for Array.prototype.includes */
    if (!Array.prototype.includes) {
      Array.prototype.includes = function () {
        'use strict';
        return Array.prototype.indexOf.apply(this, arguments) !== -1;
      };
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.engagementHistoryList.length).toBeGreaterThanOrEqual(0);
    expect(component.currentEngagement).toBeDefined();
  });

  xit('should navigate to terminate', () => {
    component.navigateToSelectedOptions(123123);
    const spy = routerSpy.navigate as jasmine.Spy;
    const navArg = spy.calls.first().args[0];
    expect(navArg).toEqual(['home/contributor/terminate']);
  });

  xit('should navigate to change engagement', () => {
    component.navigateToSelectedOptions(123123);
    const spy = routerSpy.navigate as jasmine.Spy;
    const navArg = spy.calls.first().args[1];
    expect(navArg).toEqual(['home/contributor/engagement/change']);
  });

  it('should navigate', () => {
    component.confirmCancelContract({ contractId: 123123, status: 'approve' });
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/contract/cancel-contract']);
  });

  it('should navigate', () => {
    component.navigateToWageUpdate();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(ContributorRouteConstants.ROUTE_UPDATE_INDIVIDUAL_WAGE);
  });

  it('should navigate', () => {
    component.navigateToSelectedOptions({ selectedValue: ContributorActionEnum.TERMINATE });
    expect(component.router.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_TERMINATE_CONTRIBUTOR]);
  });

  it('should navigate', () => {
    component.navigateToSelectedOptions({ selectedValue: ContributorActionEnum.MODIFY });
    expect(component.router.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT]);
  });

  it('should navigate', () => {
    component.navigateToSelectedOptions({ selectedValue: ContributorActionEnum.CANCEL });
    expect(component.router.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_CANCEL_ENGAGEMENT]);
  });

  it('should navigate', () => {
    component.navigateToSelectedOptions({ selectedValue: ContributorActionEnum.TRANSFER });
    expect(component.router.navigate).toHaveBeenCalledWith([
      ContributorRouteConstants.ROUTE_TRANSFER_INDIVIDUAL_ENGAGEMENT
    ]);
  });

  it('should navigate', () => {
    component.navigateToSelectedOptions({ selectedValue: ContributorActionEnum.ADD_CONTRACT });
    expect(component.router.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_ADD_CONTRACT]);
  });

  it('should navigate', () => {
    component.navigateToSelectedOptions({ selectedValue: ContributorActionEnum.CONTRACT_DETAILS });
    expect(component.router.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_VIEW_CONTRACT]);
  });
});

export const activatedRouteStub = {
  parent: {
    parent: {
      paramMap: of(convertToParamMap({ registrationNo: 200085744, sin: 123456 }))
    }
  }
};
