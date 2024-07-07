/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  CalendarService,
  DocumentService,
  LookupService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  CalendarServiceStub,
  contributorData,
  ContributorServiceStub,
  DocumentServiceStub,
  engagementData,
  EngagementServiceStub,
  EstablishmentServiceStub,
  LookupServiceStub,
  ModalServiceStub,
  ProgressWizardDcMockComponent,
  WorkflowServiceStub
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { EngagementDetails } from '../../../../shared/models';
import {
  ContributorRoutingService,
  ContributorService,
  EngagementService,
  EstablishmentService
} from '../../../../shared/services';
import { ProactiveScComponent } from './proactive-sc.component';

describe('ProactiveContributorScComponent', () => {
  let component: ProactiveScComponent;
  let fixture: ComponentFixture<ProactiveScComponent>;
  const routingSpy = jasmine.createSpyObj('ContributorRoutingService', ['routeToAddContributor']);
  const routerSpy = { url: '/proactive', navigate: jasmine.createSpy('navigate') };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProactiveScComponent, ProgressWizardDcMockComponent],
      imports: [TranslateModule.forRoot({}), HttpClientTestingModule],
      providers: [
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: ContributorRoutingService, useValue: routingSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) },
        { provide: CalendarService, useClass: CalendarServiceStub },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProactiveScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    spyOn(component, 'showConfirmationTemplate');
    component.onSaveEngagement(engagementData);
    expect(component.showConfirmationTemplate).toHaveBeenCalled();
  });

  it('should update contributor', () => {
    spyOn(component, 'navigateToNextTab');
    component.updateProactiveContributor(contributorData);
    expect(component.navigateToNextTab).toHaveBeenCalled();
  });

  it('should update contributor', () => {
    spyOn(component.alertService, 'showMandatoryErrorMessage');
    component.updateProactiveContributor(null);
    expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
  });

  it('should make tab active', () => {
    component.selectFormWizard(1);
    expect(component.activeTab).toBe(1);
  });

  it('should create alert error', () => {
    spyOn(component.alertService, 'showErrorByKey');
    component.showAlertError('ERROR');
    expect(component.alertService.showErrorByKey).toHaveBeenCalled();
  });

  it('should save engagement details', () => {
    spyOn(component, 'navigateToNextTab');
    component.updateEngagement(new EngagementDetails());
    expect(component.navigateToNextTab).toHaveBeenCalled();
  });

  it('should show pop up', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    spyOn(component.modalService, 'show');
    component.showTemplate(modalRef);
    expect(component.modalService.show).toHaveBeenCalled();
  });

  it('should navigate to inbox', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
  });
});
