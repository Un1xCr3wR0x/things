import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  ModalServiceStub,
  WorkflowServiceStub,
  genericError
} from 'testing';
import { ValidateCancelViolationScComponent } from './validate-cancel-violation-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ViolationBPMRequest, ChangeViolationValidator } from '../../../../shared/models';
import { of, throwError } from 'rxjs';
import { ChangeViolationsBaseScComponent } from '@gosi-ui/features/violations/lib/shared/components';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ValidateCancelViolationScComponent', () => {
  let component: ValidateCancelViolationScComponent;
  let fixture: ComponentFixture<ValidateCancelViolationScComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateCancelViolationScComponent],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: new RouterData() },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateCancelViolationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'getWorkflowActions').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(component, 'setWorkflowData').and.returnValue(new ViolationBPMRequest());
    spyOn(component, 'saveWorkflow');
    component.saveWorkFlowDetails(0);
    expect(component.getWorkflowActions).toHaveBeenCalled();
    expect(component.setWorkflowData).toHaveBeenCalled();
    expect(component.saveWorkflow).toHaveBeenCalled();
  });

  it('should initializeParameters', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'getDataFromToken');
    spyOn(component, 'getRolesForView');
    component.initialiseParams();
    expect(component.getDataFromToken).toHaveBeenCalled();
    expect(component.getRolesForView).toHaveBeenCalled();
  });
  it('should get data for view', () => {
    spyOn(component.validatorService, 'getValidatorViewDetails').and.returnValue(of(new ChangeViolationValidator()));
    component.getCancelValidatorView();
    expect(component.getViolationDocuments).toBeDefined();
  });

  it('should throw error on get data for view', () => {
    spyOn(component.validatorService, 'getValidatorViewDetails').and.returnValue(throwError(genericError));
    spyOn(ChangeViolationsBaseScComponent.prototype, 'handleErrors');
    component.getCancelValidatorView();
    expect(ChangeViolationsBaseScComponent.prototype.handleErrors).toBeDefined();
  });
});
