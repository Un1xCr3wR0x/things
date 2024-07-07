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
import { ContributorBaseScComponent } from '../../../shared/components';
import {
  AddAuthorizationService,
  AddVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService
} from '../../../shared/services';
import { AddAuthorizationScComponent } from './add-authorization-sc.component';

describe('AddAuthorizationScComponent', () => {
  let component: AddAuthorizationScComponent;
  let fixture: ComponentFixture<AddAuthorizationScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [AddAuthorizationScComponent, ProgressWizardDcMockComponent],
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

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAuthorizationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isAttorney by default', () => {
    expect(component.isAttorney).toBeTrue();
  });

  it('isAttorney is false if auth type is custody', () => {
    component.mojAuthForm.get('authType.english').setValue('Custody');
    component.selectedAuth();
    expect(component.isAttorney).toBeFalse();
  });

  it('birthDate form control is present if Attorney', () => {
    component.selectedAuth();
    expect(component.mojAuthForm.get('birthDate')).toBeTruthy();
  });

  it('birthDate is removed if custody', () => {
    component.mojAuthForm.get('authType.english').setValue('Custody');
    component.selectedAuth();
    expect(component.mojAuthForm.get('birthDate')).toBeNull();
  });

  it('set birthDate correctly', () => {
    component.setBirthDate({
      date: new Date(),
      type: 'GREGORIAN'
    });
    expect(component.birthDateType).toBe('GREGORIAN');
    expect(component.mojAuthForm.get('birthDate').value).toBeTruthy();
  });
});
