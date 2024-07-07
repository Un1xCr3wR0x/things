/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  Contributor,
  CoreContributorService,
  DocumentItem,
  DocumentService,
  Person,
  Role,
  RouterDataToken,
  ContributorTokenDto,
  ContributorToken
} from '@gosi-ui/core';
import { IconsModule } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  contributorSearchResponse,
  CoreContributorSerivceStub,
  DocumentServiceStub,
  EngagementData,
  engagementResponse,
  establishmentProfileResponse,
  genericError,
  genericRouteData,
  ModalServiceStub,
  personResponse,
  terminatePayloadResponse
} from 'testing';
import {
  ManagePersonFeatureServiceStub,
  ManagePersonRoutingServiceStub
} from 'testing/mock-services/features/manage-person';
import { documentListItemArray } from 'testing/test-data/core/document-service';
import { Engagement, ManagePersonConstants, ManagePersonRoutingService, ManagePersonService } from '../../../shared';
import { PersonProfileScComponent } from './person-profile-sc.component';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
let activatedRoute: ActivatedRouteStub;
activatedRoute = new ActivatedRouteStub();

describe('PersonProfileScComponent', () => {
  let component: PersonProfileScComponent;
  let fixture: ComponentFixture<PersonProfileScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule, IconsModule],
      declarations: [PersonProfileScComponent],
      providers: [
        {
          provide: CoreContributorService,
          useClass: CoreContributorSerivceStub
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: ManagePersonService,
          useClass: ManagePersonFeatureServiceStub
        },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: Router, useValue: routerSpy },
        {
          provide: ManagePersonRoutingService,
          useClass: ManagePersonRoutingServiceStub
        },
        {
          provide: RouterDataToken,
          useValue: genericRouteData
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(PersonProfileScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(' initialise component', () => {
    it('should initialise component', () => {
      (activatedRoute as any).paramMap = of(convertToParamMap({ registrationNo: 12334, sin: 1315123132 }));
      activatedRoute.paramMap.subscribe(params => {
        params.get('registrationNo'), params.get('sin');
      });
      component.isContributor = true;
      spyOn(component.alertService, 'clearAllErrorAlerts');
      spyOn(component, 'fetchInitialData');
      component.ngOnInit();
      expect(component.alertService.clearAllErrorAlerts).toHaveBeenCalled();
    });
  });
  describe('Clear Error', () => {
    it('should clear error and hide modal', () => {
      spyOn(component.location, 'back');
      component.clearErrorAndHide('IQAMA');
      expect(component.location.back).toHaveBeenCalled();
    });
    it('should clear error and hide modal ', () => {
      component.editTransaction = true;
      spyOn(component.managePersonRoutingService, 'navigateToInbox');
      component.routerDataToken.assignedRole = Role.EST_ADMIN_OH;
      component.clearErrorAndHide('IQAMA');
      expect(component.managePersonRoutingService.navigateToInbox).toHaveBeenCalled();
    });
    it('should clear error and hide modal', () => {
      component.editTransaction = true;
      spyOn(component.managePersonRoutingService, 'navigateToValidator');
      component.routerDataToken.assignedRole = Role.VALIDATOR_2;
      component.clearErrorAndHide('IQAMA');
      expect(component.managePersonRoutingService.navigateToValidator).toHaveBeenCalled();
    });
  });
  describe('Get Active Status If Contributor', () => {
    it('should get the active status', () => {
      component.person = bindToObject(new Person(), personResponse);

      component.isUserLoggedIn = true;
      component.isCsr = false;
      spyOn(component.manageService, 'getActiveStatus').and.returnValue(
        of(bindToObject(new Contributor(), engagementResponse))
      );
      component.getActiveStatusIfContributor(personResponse.personId).subscribe(noop, noop);
      expect(component.socialInsuranceNo).toBe(engagementResponse.socialInsuranceNo);
    });
    it('should get a non contributor', () => {
      component.person = bindToObject(new Person(), personResponse);
      component.isUserLoggedIn = true;
      component.isCsr = false;
      spyOn(component.manageService, 'getActiveStatus').and.returnValue(of(null));
      component.getActiveStatusIfContributor(personResponse.personId).subscribe();
      expect(component.isContributor).toBe(false);
    });
    it('should get throw error for get engagement details', () => {
      component.person = bindToObject(new Person(), personResponse);
      component.isUserLoggedIn = true;
      component.isCsr = false;
      spyOn(component.manageService, 'getActiveStatus').and.returnValue(throwError(genericError));
      component.getActiveStatusIfContributor(personResponse.personId).subscribe(noop, noop);
      expect(component.isContributor).toBe(false);
    });
    it('should throw error no records found', () => {
      component.person = bindToObject(new Person(), personResponse);
      component.isUserLoggedIn = true;
      component.isCsr = false;
      spyOn(component.manageService, 'getActiveStatus').and.returnValue(throwError(genericError));
      spyOn(component, 'showErrorMessage');
      component.getActiveStatusIfContributor(personResponse.personId).subscribe(noop, noop);
      expect(component.showErrorMessage).toHaveBeenCalled();
    });
  });
  describe('Refresh Document', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocument(true, document);
      expect(document).toBeDefined();
    });
  });
  describe(' set Navigation Indicator', () => {
    it('should set Navigation Indicator admin re-enter', () => {
      component.editTransaction = true;
      component.routerDataToken.assignedRole = Role.EST_ADMIN_OH;
      component.setNavigationIndicator();
      expect(component.revertTransaction.navigationInd).toBe(ManagePersonConstants.NAV_INDEX_RE_ENTER);
    });
    it('should set Navigation Indicator submit', () => {
      component.editTransaction = false;
      component.setNavigationIndicator();
      expect(component.revertTransaction.navigationInd).toBe(ManagePersonConstants.NAV_INDEX_SUBMIT);
    });
    it('should set Navigation', () => {
      component.editTransaction = true;
      component.routerDataToken.assignedRole = Role.VALIDATOR;
      component.setNavigationIndicator();
      expect(component.revertTransaction.navigationInd).toBe(ManagePersonConstants.NAV_INDEX_VALIDATOR_SUBMIT);
    });
  });
  describe('initialise view', () => {
    it('should initialise view', () => {
      component.manageService.contributor$ = of(contributorSearchResponse);
      component.manageService.establishmentProfile$ = of(establishmentProfileResponse);
      spyOn(component, 'initialiseForContributor');
      component.initialiseTheView(true);
      expect(component.isAppPrivate).toBe(true);
    });
  });
  describe('initialise For Contributor', () => {
    it('should initialise For Contributor', () => {
      component.routerDataToken == genericRouteData;
      component.manageService.establishmentProfile$ = of(establishmentProfileResponse);
      spyOn(component, 'initialisePersonDetails');
      spyOn(component, 'fetchComments');
      spyOn(component, 'getDocuments');
      component.initialiseForContributor(contributorSearchResponse, true);
      expect(component.fetchComments).toHaveBeenCalled();
    });
  });
  describe('navigate to add  iqama', () => {
    it('should navigate to add iqama', () => {
      component.isIqamaReturned = true;
      spyOn(component.managePersonRoutingService, 'resetLocalToken');
      spyOn(component.managePersonRoutingService, 'navigateToAddIqama');
      component.navigateToAddIqama();
      expect(component.manageService.isEdit).toBe(true);
    });
    it('should navigate to add iqama falsy', () => {
      component.isIqamaReturned = false;
      spyOn(component.managePersonRoutingService, 'navigateToAddIqama');
      component.navigateToAddIqama();
      expect(component.manageService.isEdit).toBe(false);
    });
  });
  describe('navigate to add  border', () => {
    it('should navigate to add border', () => {
      component.isBorderReturned = true;
      spyOn(component.managePersonRoutingService, 'resetLocalToken');
      spyOn(component.managePersonRoutingService, 'navigateToAddBorder');
      component.navigateToAddBorder();
      expect(component.manageService.isEdit).toBe(true);
    });
    it('should navigate to add border falsy', () => {
      component.isBorderReturned = false;
      spyOn(component.managePersonRoutingService, 'navigateToAddBorder');
      component.navigateToAddBorder();
      expect(component.manageService.isEdit).toBe(false);
    });
  });

  it('should check termination required', () => {
    component.active = true;
    component.contributor = contributorSearchResponse;
    spyOn(component, 'terminateContriutor');
    component.checkTerminationRequired();
    expect(component.terminateContriutor).toHaveBeenCalled();
  });

  it('should check termination required', () => {
    component.active = true;
    component.contributor.person.govtEmp = contributorSearchResponse.person.govtEmp;
    component.legalEntity = new BilingualText();
    spyOn(component, 'terminateContriutor');
    component.checkTerminationRequired();
    expect(component.terminateContriutor).toHaveBeenCalled();
  });

  it('should terminate contributor', () => {
    component.socialInsuranceNo = 12312323;
    spyOn(component, 'changeContributorActiveStatus');
    component.terminateContriutor(terminatePayloadResponse);
    expect(component.changeContributorActiveStatus).toHaveBeenCalled();
  });
  it('should change active status of contributor', () => {
    component.active = false;
    component.changeContributorActiveStatus();
    expect(component.active).toEqual(false);
  });
  it('should get current engagements', () => {
    component.currentEngagement = EngagementData;
    spyOn(component.manageService, 'getEngagements').and.returnValue(
      of(bindToObject(new Engagement(), EngagementData))
    );
    component.getCurrentEngagement();
    expect(component.currentEngagement).not.toEqual(null);
  });
  it('should get content for dead contributor', () => {
    component.currentEngagement = EngagementData;
    component.getContentForDeadContributorCancel();
    expect(component.currentEngagement).not.toEqual(null);
  });
});
