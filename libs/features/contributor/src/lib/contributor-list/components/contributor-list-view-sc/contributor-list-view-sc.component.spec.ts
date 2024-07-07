/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  ContributorBaseScComponentMock,
  ContributorServiceStub,
  ContributorsWageMockService,
  DocumentServiceStub,
  EngagementServiceStub,
  EstablishmentServiceStub,
  LookupServiceStub,
  MockManageWageService,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import {
  ContributorBaseScComponent,
  ContributorRouteConstants,
  ContributorService,
  ContributorsWageService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared';
import { ContributorListViewScComponent } from './contributor-list-view-sc.component';
import { BehaviorSubject, of } from 'rxjs';

describe('ContributorListViewScComponent', () => {
  let component: ContributorListViewScComponent;
  let fixture: ComponentFixture<ContributorListViewScComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContributorListViewScComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: ContributorsWageService, useClass: ContributorsWageMockService },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorListViewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change page number', () => {
    component.paginateContributors(2);
    expect(component.numberOfContributors).toBeGreaterThan(0);
  });

  it('should toggle tab', () => {
    component.toggleTabs(2);
    expect(component.currentTab).toEqual(2);
  });

  it('should search establishment', () => {
    component.establishmentSearch(2234568791);
    expect(component.registrationNo).toEqual(2234568791);
  });

  it('should navigate to person profile', () => {
    const sin = 2341231234;
    component.registrationNo = 2841231234;
    component.navigateToContProfile(sin);
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      ContributorRouteConstants.ROUTE_NORMAL_PROFILE(component.registrationNo, sin)
    ]);
  });
});

export const activatedRouteStub = {
  parent: {
    parent: {
      paramMap: of(convertToParamMap({}))
    }
  }
};
