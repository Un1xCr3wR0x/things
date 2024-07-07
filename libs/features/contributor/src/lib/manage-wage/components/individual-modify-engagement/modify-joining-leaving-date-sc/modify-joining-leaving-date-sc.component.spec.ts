/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import * as FormUtil from '@gosi-ui/core/lib/utils/form';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AddVICServiceStub,
  AlertServiceStub,
  ContributorBaseScComponentMock,
  ContributorServiceStub,
  DocumentServiceStub,
  EngagementServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  MockManageWageService,
  ModalServiceStub,
  ProgressWizardDcMockComponent,
  UpdateVICServiceStub,
  VicServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ContributorBaseScComponent } from '../../../../shared/components';
import { VicEngagementPayload } from '../../../../shared/models';
import {
  AddVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService,
  VicWageUpdateService
} from '../../../../shared/services';
import { ModifyJoiningLeavingDateScComponent } from './modify-joining-leaving-date-sc.component';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { Location } from '@angular/common';

describe('ModifyJoiningLeavingDateScComponent', () => {
  let component: ModifyJoiningLeavingDateScComponent;
  let fixture: ComponentFixture<ModifyJoiningLeavingDateScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ModifyJoiningLeavingDateScComponent, ProgressWizardDcMockComponent],
      providers: [
        { provide: Location, useValue: { back: () => {} } },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: VicWageUpdateService, useClass: UpdateVICServiceStub },
        { provide: AddVicService, useClass: AddVICServiceStub },
        { provide: VicService, useClass: VicServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyJoiningLeavingDateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
