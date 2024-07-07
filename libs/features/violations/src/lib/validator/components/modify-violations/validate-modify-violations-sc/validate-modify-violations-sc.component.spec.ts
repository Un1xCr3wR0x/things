import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
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
import { ViolationBPMRequest, ChangeViolationValidator } from '../../../../shared/models';
import { ValidateModifyViolationsScComponent } from './validate-modify-violations-sc.component';
import { of, throwError } from 'rxjs';
import { ValidatorBaseScComponent } from '@gosi-ui/features/violations/lib/shared/components/base';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ValidateModifyViolationsScComponent', () => {
  let component: ValidateModifyViolationsScComponent;
  let fixture: ComponentFixture<ValidateModifyViolationsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateModifyViolationsScComponent],
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
    fixture = TestBed.createComponent(ValidateModifyViolationsScComponent);
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
    component.saveWorkFlowActions(0);
    expect(component.getWorkflowActions).toHaveBeenCalled();
    expect(component.setWorkflowData).toHaveBeenCalled();
    expect(component.saveWorkflow).toHaveBeenCalled();
  });

  it('should initializeParameters', () => {
    component.modalRef = new BsModalRef();
    spyOn(component, 'getDataFromToken');
    spyOn(component, 'getRolesForView');
    component.initializeParameters();
    expect(component.getDataFromToken).toHaveBeenCalled();
    expect(component.getRolesForView).toHaveBeenCalled();
  });

  it('should get data for view', () => {
    spyOn(component.validatorService, 'getValidatorViewDetails').and.returnValue(of(new ChangeViolationValidator()));
    component.getModifyViolationsView();
    expect(component.getViolationDocuments).toBeDefined();
  });

  it('should throw error on get data for view', () => {
    spyOn(component.validatorService, 'getValidatorViewDetails').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleErrors');
    component.getModifyViolationsView();
    expect(ValidatorBaseScComponent.prototype.handleErrors).toBeDefined();
  });
});
