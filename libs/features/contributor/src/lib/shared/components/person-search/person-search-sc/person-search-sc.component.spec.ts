/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  CalendarService,
  DocumentService,
  LanguageToken,
  LookupService,
  NIN,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { ComponentHostDirective } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  AuthTokenServiceStub,
  CalendarServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  EngagementServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  MockManageWageService,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import {
  ContributorRoutingService,
  ContributorService,
  ContributorTypesEnum,
  EngagementService,
  EstablishmentService
} from '../../../../shared';
import { PersonalInformation } from '../../../models';
import { ManageWageService } from '../../../services';
import { SearchGccDcComponent } from '../search-gcc-dc/search-gcc-dc.component';
import { SearchImmigratedTribeDcComponent } from '../search-immigrated-tribe-dc/search-immigrated-tribe-dc.component';
import { SearchNonSaudiDcComponent } from '../search-non-saudi-dc/search-non-saudi-dc.component';
import { SearchSaudiDcComponent } from '../search-saudi-dc/search-saudi-dc.component';
import { SearchSplForeignerDcComponent } from '../search-spl-foreigner-dc/search-spl-foreigner-dc.component';
import { PersonSearchScComponent } from './person-search-sc.component';

describe('PersonSearchScComponent', () => {
  let component: PersonSearchScComponent;
  let fixture: ComponentFixture<PersonSearchScComponent>;
  const routingSpy = jasmine.createSpyObj('ContributorRoutingService', ['routeToAddContributor']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({})],
      declarations: [
        PersonSearchScComponent,
        ComponentHostDirective,
        SearchSaudiDcComponent,
        SearchNonSaudiDcComponent,
        SearchImmigratedTribeDcComponent,
        SearchSplForeignerDcComponent,
        SearchGccDcComponent
      ],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ContributorRoutingService, useValue: routingSpy },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PUBLIC },
        { provide: LanguageToken, useValue: of('en') },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: CalendarService, useClass: CalendarServiceStub },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        { provide: RegistrationNoToken, useValue: new RegistrationNumber(200085744) }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          SearchSaudiDcComponent,
          SearchNonSaudiDcComponent,
          SearchImmigratedTribeDcComponent,
          SearchSplForeignerDcComponent,
          SearchGccDcComponent
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonSearchScComponent);
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
  });

  it('should load person components', () => {
    component.onContributorTypeSelect(ContributorTypesEnum.SAUDI);
    expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
  });

  it('should load person components', () => {
    component.onContributorTypeSelect(ContributorTypesEnum.NON_SAUDI);
    expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
  });

  it('should load person components', () => {
    component.onContributorTypeSelect(ContributorTypesEnum.GCC);
    expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
  });

  it('should load person components', () => {
    component.onContributorTypeSelect(ContributorTypesEnum.IMMIGRATED_TRIBE);
    expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
  });

  it('should load person components', () => {
    component.onContributorTypeSelect(ContributorTypesEnum.SPECIAL_FOREIGNER);
    expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
  });

  it('should verify person identifiers', () => {
    const personDetails = new PersonalInformation();
    personDetails.identity.push(new NIN());
    component.onVerify({ queryParams: 'person?nin=123123', personDetails: personDetails });
    expect(component.contributorRoutingService.routeToAddContributor).toHaveBeenCalled();
  });

  it('should throw error while verifying person', () => {
    const personDetails = new PersonalInformation();
    personDetails.identity.push(new NIN());
    spyOn(component.contributorService, 'getPersonDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.onVerify({ queryParams: 'person?nin=123123', personDetails: personDetails });
    expect(component.showError).toHaveBeenCalled();
  });

  it('should verify ABSHER and show pop up for no ABSHER account', () => {
    const personDetails = new PersonalInformation();
    personDetails.identity.push(new NIN());
    spyOn(component, 'checkABSHERVerificationRequired').and.returnValue(true);
    spyOn(component, 'showTemplate').and.callThrough();
    component.onVerify({ queryParams: 'person?nin=123123', personDetails: personDetails });
    expect(component.showTemplate).toHaveBeenCalled();
  });

  it('should navigate to contributor section', () => {
    component.modalRef = new BsModalRef();
    component.continueProcessSaudiDoc();
    expect(component.contributorRoutingService.routeToAddContributor).toHaveBeenCalled();
  });

  it('should close pop up', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.decline();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  it('should reset component details', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'loadSearchFormComponent');
    component.reset();
    expect(component.gosiComponentHost.viewContainerRef.length).toBe(0);
  });
});
