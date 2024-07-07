/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BPMUpdateRequest,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import * as FormUtil from '@gosi-ui/core/lib/utils/form';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  AlertServiceStub,
  BilingualTextPipeMock,
  engagementData,
  establishmentData,
  getContributorData,
  LookupServiceStub,
  ModalServiceStub,
  violationRequest,
  WorkflowServiceStub
} from 'testing';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  Establishment,
  EstablishmentService
} from '../../../../shared';
import { ModifyViolationRequestScComponent } from './modify-violation-request-sc.component';

describe('ModifyViolationRequestScComponent', () => {
  let component: ModifyViolationRequestScComponent;
  let fixture: ComponentFixture<ModifyViolationRequestScComponent>;
  const routerSpy = {
    url: 'home/contributor/valdator/modify-violation',
    navigate: jasmine.createSpy('navigate'),
    routerState: {
      root: {
        data: { title: 'Title' }
      }
    }
  };
  const contributorServiceSpy = jasmine.createSpyObj<ContributorService>('ContributorService', [
    'getContributor',
    'getSystemParams'
  ]);
  contributorServiceSpy.getContributor.and.returnValue(of(<any>getContributorData));
  contributorServiceSpy.getSystemParams.and.returnValue(
    of([<any>{ name: 'EINSPECTION_MAX_BACKDATED_JOINING_DATE', value: new Date() }])
  );
  const contractServiceSpy = jasmine.createSpyObj<ContractAuthenticationService>('ContractAuthenticationService', [
    'getViolationRequest',
    'modifyDate'
  ]);
  contractServiceSpy.getViolationRequest.and.returnValue(of(<any>{ violationRequest }));
  contractServiceSpy.modifyDate.and.returnValue(
    of({
      arabic: 'Transaction is successful',
      english: 'Transaction is successful'
    })
  );
  const establishmentServiceSpy = jasmine.createSpyObj<EstablishmentService>('EstablishmentService', [
    'getEstablishmentDetails'
  ]);
  establishmentServiceSpy.getEstablishmentDetails.and.returnValue(of(<Establishment>(<any>establishmentData)));
  const engagementServiceSpy = jasmine.createSpyObj<EngagementService>('EngagementService', ['getEngagementDetails']);
  engagementServiceSpy.getEngagementDetails.and.returnValue(of(<any>engagementData));
  const controls = new FormBuilder().group(
    {
      registrationNumber: new FormBuilder().group([
        { value: '', disabled: true },
        {
          validators: Validators.compose([Validators.required])
        }
      ]),
      nameEn: new FormBuilder().group([
        { value: '', disabled: true },
        {
          validators: Validators.compose([Validators.required])
        }
      ]),
      nameAr: new FormBuilder().group([
        { value: '', disabled: true },
        {
          validators: Validators.compose([Validators.required])
        }
      ]),
      joiningDate: new FormBuilder().group(
        new FormBuilder().group({
          gregorian: new FormBuilder().group([
            { value: '', disabled: false },
            {
              validators: Validators.compose([Validators.required])
            }
          ]),
          hijiri: new FormBuilder().group(['', {}])
        })
      ),
      leavingDate: new FormBuilder().group(
        new FormBuilder().group({
          gregorian: new FormBuilder().group([
            { value: '', disabled: false },
            {
              validators: Validators.compose([Validators.required])
            }
          ]),
          hijiri: new FormBuilder().group(['', {}])
        })
      ),
      leavingReason: new FormBuilder().group([
        { value: '', disabled: false },
        {
          validators: Validators.compose([Validators.required])
        }
      ])
    },
    { valid: true }
  );
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [ModifyViolationRequestScComponent, BilingualTextPipeMock],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: EstablishmentService, useValue: establishmentServiceSpy },
        { provide: EngagementService, useValue: engagementServiceSpy },
        { provide: ContributorService, useValue: contributorServiceSpy },
        { provide: ContractAuthenticationService, useValue: contractServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: Router, useValue: routerSpy },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyViolationRequestScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Should initialiseForm', () => {
    component.initialiseForm();
    expect(component.violationRequestForm).not.toEqual(null);
  });
  it('Should confirmEngagement', inject([RouterDataToken], () => {
    const routerDataToken =
      '{"RegistrationNo": 200085744, "SocialInsuranceNo": 423641258, "EngagementId": 1569355076, "referenceNo": 269865, "id": 485, "taskId": "20cc079d-423b-4ec3-b810-dcf4b2d111b0", "assigneeId": "sabin"}';
    component.violationRequestForm.addControl('violationRequestForm', controls);
    const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
    component.confirmEngagement(violationRequest, routerDataToken);
  }));
  it('Should updateTaskWorkFlow', () => {
    const workflowData = new BPMUpdateRequest();
    component.updateTaskWorkFlow(workflowData, violationRequest);
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('Should cancelTransaction if changed', () => {
    const cancelEngagementTemplate = '';
    component.cancelTransaction(true, cancelEngagementTemplate);
    expect(component.modalRef).not.toEqual(null);
  });
  it('Should cancelTransaction if not changed', () => {
    const cancelEngagementTemplate = '';
    component.cancelTransaction(false, cancelEngagementTemplate);
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should showModal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showModal(modalRef, 'md');
    expect(component.modalRef).not.toEqual(null);
  });
  it('should decline template', () => {
    component.modalRef = new BsModalRef();
    component.decline();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should confirmCancel', () => {
    component.modalRef = new BsModalRef();
    component.confirmCancel();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should hideModal', () => {
    component.modalRef = new BsModalRef();
    component.hideModal();
    expect(component.modalRef).not.toEqual(null);
  });
});
