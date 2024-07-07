import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
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
  MemberServiceStub,
  DoctorServiceStub
} from 'testing';
import { ValidateModifyContractScComponent } from './validate-modify-contract-sc.component';
import { ValidatorMemberBaseScComponent } from '../../../../shared/components';
import { DoctorService, MemberService } from '../../../../shared/services';
import { ContributorBPMRequest } from '@gosi-ui/features/contributor';

describe('ValidateModifyContractScComponent', () => {
  let component: ValidateModifyContractScComponent;
  let fixture: ComponentFixture<ValidateModifyContractScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ValidateModifyContractScComponent],
      providers: [
        FormBuilder,
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: MemberService, useClass: MemberServiceStub },
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: WorkflowService, useClass: WorkflowServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ValidateModifyContractScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    component.professionalId = 1000000084;
    component.contractId = 12345;
    spyOn(component, 'getDataForView');
    component.ngOnInit();
    expect(component.getDataForView).toHaveBeenCalled();
  });

  it('should handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorMemberBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorMemberBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(ValidatorMemberBaseScComponent.prototype, 'saveWorkflow');
    component.TrackWorkflowEvents(0);
    expect(ValidatorMemberBaseScComponent.prototype.saveWorkflow).toHaveBeenCalled();
  });

  it('should confirm cancel', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.router, 'navigateByUrl');
    component.confirmCancelModal();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/home/transactions/list/worklist');
  });

  it('should navigate profile ', () => {
    spyOn(component.router, 'navigate');
    component.profileNavigate(2015767656);
    expect(component.router.navigate).toHaveBeenCalledWith([
      'home/medical-board/doctor-profile/2015767656/person-details'
    ]);
  });
});
