/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import {
  ContributorService,
  EstablishmentService,
  ManageWageService,
  AddVicService,
  VicService,
  EngagementService,
  AddAuthorizationService,
  ContributorBaseScComponent
} from '@gosi-ui/features/contributor';
import { TranslateModule } from '@ngx-translate/core';
import {
  AddVICServiceStub,
  AlertServiceStub,
  ContributorBaseScComponentMock,
  ContributorServiceStub,
  DocumentServiceStub,
  EngagementServiceStub,
  EstablishmentServiceStub,
  LookupServiceStub,
  MockManageWageService,
  WorkflowServiceStub,
  VicServiceStub,
  AddAuthorizationServiceStub
} from 'testing';
import { ProgressWizardDcMockComponent } from 'testing/mock-components';
import { ValidateAuthorizationScComponent } from '..';

describe('ValidateAddAuthorizationScComponent', () => {
  let component: ValidateAuthorizationScComponent;
  let fixture: ComponentFixture<ValidateAuthorizationScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ValidateAuthorizationScComponent, ProgressWizardDcMockComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: AddVicService, useClass: AddVICServiceStub },
        { provide: VicService, useClass: VicServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: AddAuthorizationService, useClass: AddAuthorizationServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
});
