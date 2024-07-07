/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@gosi-ui/core';
import { of } from 'rxjs';
import {
  AlertServiceStub,
  ContractAuthenticationServiceStub,
  ContributorServiceStub,
  EngagementServiceStub,
  EstablishmentServiceStub
} from 'testing';
import {
  ContractAuthenticationService,
  Contributor,
  ContributorService,
  EngagementService,
  EstablishmentService
} from '../../../../shared';
import { ValidatorPreviewScComponent } from './validator-preview-sc.component';

describe('ValidtorPreviewScComponent', () => {
  let component: ValidatorPreviewScComponent;
  let fixture: ComponentFixture<ValidatorPreviewScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidatorPreviewScComponent],
      providers: [
        { provide: ContractAuthenticationService, useClass: ContractAuthenticationServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorPreviewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize view', () => {
    component.registrationNo = 110000103;
    component.socialInsuranceNo = 368858587;
    component.engagementId = 1569355076;
    spyOn(component.contributorService, 'getContributor').and.returnValue(of(new Contributor()));
    component.intitializeView();
    expect(component.previewEstablishment).toBeDefined();
    expect(component.personDetailsPreview).toBeDefined();
    expect(component.contractAtValidator).toBeDefined();
  });
});
