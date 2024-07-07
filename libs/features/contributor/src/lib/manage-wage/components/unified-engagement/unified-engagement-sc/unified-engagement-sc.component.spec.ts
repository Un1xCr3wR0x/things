/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  AlertService,
  CoreContributorService,
  LookupService,
  RouterData,
  RouterDataToken,
  AuthTokenService,
  DocumentService
} from '@gosi-ui/core';
import {
  ContributorActionEnum,
  ContributorBaseScComponent,
  ContributorRouteConstants,
  ContributorService,
  EngagementService,
  ManageWageService
} from '@gosi-ui/features/contributor';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  ContributorBaseScComponentMock,
  ContributorServiceStub,
  CoreContributorSerivceStub,
  EngagementServiceStub,
  LookupServiceStub,
  MockManageWageService,
  ModalServiceStub,
  overallEngagamentList,
  AuthTokenServiceStub,
  DocumentServiceStub
} from 'testing';
import { UnifiedEngagementScComponent } from './unified-engagement-sc.component';

describe('UnifiedEngagementScComponent', () => {
  let component: UnifiedEngagementScComponent;
  let fixture: ComponentFixture<UnifiedEngagementScComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnifiedEngagementScComponent],
      imports: [TranslateModule.forRoot({}), HttpClientTestingModule],
      providers: [
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: CoreContributorService, useClass: CoreContributorSerivceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnifiedEngagementScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handleVicActions terminate', () => {
    component.overallEngagements = overallEngagamentList;
    component.overallEngagements[0].engagementType = 'vic';
    component.navigateToSelectedOptions({ index: 0, selectedValue: ContributorActionEnum.TERMINATE });
    expect(routerSpy.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_VIC_TERMINATE]);
  });
  it('should handleVicActions cancel', () => {
    component.handleVicActions(ContributorActionEnum.CANCEL);
    expect(routerSpy.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_VIC_CANCEL]);
  });
  it('should handleVicActions modify', () => {
    component.handleVicActions(ContributorActionEnum.MODIFY);
    expect(routerSpy.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_VIC_WAGE_UPDATE]);
  });
  it('should navigate to manage vic wage', () => {
    component.activeEngagements[0].engagementType = 'vic';
    component.navigateToUpdateCurrentWage(0);
    expect(routerSpy.navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_VIC_WAGE_UPDATE]);
  });
});
