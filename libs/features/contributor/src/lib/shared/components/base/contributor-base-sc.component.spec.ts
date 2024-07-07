/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, Inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  bindToObject,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { noop, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  engagementData,
  EngagementServiceStub,
  establishmentDetailsTestData,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  MockManageWageService,
  WorkflowServiceStub
} from 'testing';
import { contributorData, PersonInformation } from 'testing/test-data/features/contributor';
import { Contributor, EngagementDetails, Establishment } from '../../../shared';
import { DocumentTransactionId } from '../../enums';
import { ContributorService, EngagementService, EstablishmentService, ManageWageService } from '../../services';
import { ContributorBaseScComponent } from './contributor-base-sc.component';

@Component({
  selector: 'cnt-add-cont-base-derived'
})
export class DerivedContributorBaseSc extends ContributorBaseScComponent {
  constructor(
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly location: Location,
    readonly router: Router,
    readonly manageWageService: ManageWageService,
    readonly workflowService: WorkflowService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(
      alertService,
      establishmentService,
      contributorService,
      engagementService,
      documentService,
      workflowService,
      manageWageService,
      routerDataToken
    );
  }
}

/**
 * Unit test for add-contribitor base class
 */
describe('ContributorBaseScComponent', () => {
  let component: DerivedContributorBaseSc;
  let fixture: ComponentFixture<DerivedContributorBaseSc>;

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DerivedContributorBaseSc],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: RouterDataToken, useValue: new RouterData() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedContributorBaseSc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should establishment details', () => {
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(
      of(bindToObject(new Establishment(), establishmentDetailsTestData))
    );
    component.getEstablishmentDetails(34564566).subscribe(response => {
      expect(response.registrationNo).toEqual(establishmentDetailsTestData.registrationNo);
    });
  });
  it('should throw error', () => {
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.getEstablishmentDetails(13456).subscribe(noop, noop);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should retrieve contributor details', () => {
    spyOn(component.contributorService, 'getContributor').and.returnValue(
      of(new Contributor().fromJsonToObject(contributorData))
    );
    component.getContributorDetails(20085744, 423641258).subscribe(() => {
      expect(component.socialInsuranceNo).not.toBeNull();
      expect(component.contributor).not.toBeNull();
    });
  });

  it('should retrieve engagment details', () => {
    spyOn(component.engagementService, 'getEngagementDetails').and.returnValue(
      of(new EngagementDetails().fromJsonToObject(engagementData))
    );
    component.getEngagementDetails(20085744, 423641258, 123456, 'regular').subscribe(() => {
      expect(component.engagementId).not.toBeNull();
    });
  });

  it('should get identity', () => {
    component.contributorType = 'GCC Contributor';
    component.contributor = new Contributor();
    component.contributor.person = PersonInformation;
    component.setGccIdentity();
    expect(component.contributor.person.identity.length).toBe(4);
  });

  it('should get required documents', () => {
    component.getRequiredDocuments(1569355076, DocumentTransactionId.REGISTER_CONTRIBUTOR, 'GOVT', true);
    expect(component.documents.length).toBe(1);
  });
});
