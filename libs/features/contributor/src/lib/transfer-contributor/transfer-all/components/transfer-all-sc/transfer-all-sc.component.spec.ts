/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  LookupService,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import * as FormUtil from '@gosi-ui/core/lib/utils/form';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  ContributorBaseScComponentMock,
  ContributorServiceStub,
  ContributorsWageMockService,
  DocumentServiceStub,
  EngagementServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  MockManageWageService,
  ModalServiceStub,
  transferAllBranches,
  transferAllNoWorkflowError,
  TransferContributorServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ContributorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { Establishment, TransferAllContributorDetails, TransferContributorPayload } from '../../../../shared/models';
import {
  ContributorService,
  ContributorsWageService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  TransferContributorService
} from '../../../../shared/services';
import { TransferAllScComponent } from './transfer-all-sc.component';

describe('TransferAllScComponent', () => {
  let component: TransferAllScComponent;
  let fixture: ComponentFixture<TransferAllScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [TransferAllScComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ContributorsWageService, useClass: ContributorsWageMockService },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: TransferContributorService, useClass: TransferContributorServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RegistrationNoToken, useValue: new RegistrationNumber() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAllScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component in edit mode', () => {
    component.isEditMode = true;
    spyOn(component, 'initializeFromToken');
    component.ngOnInit();
    expect(component.initializeFromToken).toHaveBeenCalled();
  });

  it('should read key from token', inject([RouterDataToken], token => {
    token.transactionId = 423651;
    token.payload = '{"registrationNo": 200085744, "requestId": 23}';
    spyOn(component, 'getDataToDisplay');
    component.initializeFromToken();
    expect(component.registrationNo).toBeDefined();
    expect(component.requestId).toBeDefined();
  }));

  it('should check edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'all' }, { path: 'edit' }]);
    component.checkTransferEdit();
    expect(component.isEditMode).toBeTruthy();
  }));

  it('should search establishment', () => {
    component.registrationNo = 200085744;
    component.isEditMode = false;
    spyOn(component, 'getDataToDisplay');
    component.onEstablishmentSearch(component.registrationNo);
    expect(component.getDataToDisplay).toHaveBeenCalled();
  });

  it('shpuld throw mandatory error on invalid search', () => {
    spyOn(component, 'showMandatoryFieldsError');
    component.onEstablishmentSearch(null);
    expect(component.showMandatoryFieldsError).toHaveBeenCalled();
  });

  it('should get data to display', () => {
    component.registrationNo = 200085744;
    spyOn(component.transferService, 'getTransferAllDetails').and.returnValue(throwError(transferAllNoWorkflowError));
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(of(new Establishment()));
    spyOn(component.establishmentService, 'getBranches').and.returnValue(of(transferAllBranches.branchList));
    spyOn(component, 'checkEstablishmentEligibility').and.returnValue(true);
    spyOn(component, 'checkBranchEligibility').and.returnValue(true);
    component.getDataToDisplay();
    expect(component.canTransfer).toBeTruthy();
    expect(component.registrationNumberList).toBeDefined();
    expect(component.estNameList).toBeDefined();
    expect(component.branchList).toBeDefined();
  });

  it('should throw error on getting data to display', () => {
    spyOn(component, 'getWorkflowDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.getDataToDisplay();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should get workflow details for csr for transfer all in progress', () => {
    component.getWorkflowDetails().subscribe();
    expect(component.hasWorkflow).toBeTruthy();
  });

  it('should get workflow details for csr for transfer all not in progress', () => {
    spyOn(component.transferService, 'getTransferAllDetails').and.returnValue(of(new TransferAllContributorDetails()));
    component.getWorkflowDetails().subscribe();
    expect(component.hasWorkflow).toBeFalsy();
  });

  it('should get workflow details in edit mode', () => {
    component.isEditMode = true;
    component.getWorkflowDetails().subscribe();
    expect(component.transferAllDetails).toBeDefined();
  });

  it('should throw error while getting workflow details', () => {
    spyOn(component.transferService, 'getTransferAllDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.getWorkflowDetails().subscribe(noop, noop);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should check establishment eligibilty for a non registered establishment', () => {
    const establishment = new Establishment();
    establishment.status.english = 'Closed';
    const flag = component.checkEstablishmentEligibility(establishment);
    expect(flag).toBeFalsy();
  });

  it('should check establishment eligibilty for a gcc establishment', () => {
    const establishment = new Establishment();
    establishment.status.english = 'Registered';
    establishment.gccEstablishment.gccCountry = true;
    const flag = component.checkEstablishmentEligibility(establishment);
    expect(flag).toBeFalsy();
  });

  it('should check establishment branch eligibilty for establishment with no branches', () => {
    const flag = component.checkBranchEligibility([]);
    expect(flag).toBeFalsy();
  });

  it('should fetch active contributor count', () => {
    component.fetchActiveCont(20007435);
    component.contributorCount.subscribe(res => {
      expect(res.transferable).toBeGreaterThan(0);
    });
  });

  it('should check transferable eligibility for no active contributors', () => {
    component.checkTransferableEligibility(0);
    expect(component.isTransferable).toBeFalsy();
  });

  it('should refresh document', () => {
    spyOn(component.documentService, 'refreshDocument').and.callThrough();
    component.refreshTransferDocument(new DocumentItem());
    expect(component.documentService.refreshDocument).toHaveBeenCalled();
  });

  it('should submit transfer all transaction', () => {
    const fb = new FormBuilder();
    const transferAllForm = createTransferForm(fb);
    component.parentForm.addControl('transferAllForm', transferAllForm);
    component.parentForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'checkValidity').and.returnValue(true);
    component.submitTransferAll();
    expect(component.successMessage).toBeDefined();
  });

  it('should submit transaction on validator edit', () => {
    component.isEditMode = true;
    const fb = new FormBuilder();
    const transferAllForm = createTransferForm(fb);
    component.parentForm.addControl('transferAllForm', transferAllForm);
    component.parentForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'checkValidity').and.returnValue(true);
    spyOn(component, 'assembleTransferAllPayload').and.returnValue(new TransferContributorPayload());
    spyOn(component, 'navigateBack').and.callThrough();
    spyOn(component.router, 'navigate');
    component.submitTransferAll();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should throw error on submitting transaction', () => {
    const fb = new FormBuilder();
    const transferAllForm = createTransferForm(fb);
    component.parentForm.addControl('transferAllForm', transferAllForm);
    spyOn(component, 'checkValidity').and.returnValue(true);
    spyOn(component, 'assembleTransferAllPayload').and.returnValue(new TransferContributorPayload());
    spyOn(component.transferService, 'submitTransferRequest').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.submitTransferAll();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should pass validity check', () => {
    const fb = new FormBuilder();
    const transferAllForm = createTransferForm(fb);
    component.parentForm.addControl('transferAllForm', transferAllForm);
    const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
    const flag = component.checkValidity();
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
    expect(flag).toBeTruthy();
  });

  it('should throw mandatory field error', () => {
    const fb = new FormBuilder();
    const transferAllForm = createTransferForm(fb);
    transferAllForm.get('registrationNoFrom').setValue(null);
    component.parentForm.addControl('transferAllForm', transferAllForm);
    const funcSpy = jasmine.createSpy('markFormGroupTouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupTouched', 'get').and.returnValue(funcSpy);
    const flag = component.checkValidity();
    expect(flag).toBeFalsy();
  });

  it('should throw mandatory document error', () => {
    const fb = new FormBuilder();
    const transferAllForm = createTransferForm(fb);
    component.parentForm.addControl('transferAllForm', transferAllForm);
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
    const flag = component.checkValidity();
    expect(flag).toBeFalsy();
  });

  it('should cancel transfer all transaction with changes', () => {
    const fb = new FormBuilder();
    component.parentForm.addControl('docStatus', fb.group({ changed: true }));
    const funcSpy = jasmine.createSpy('getFormErrorCount').and.returnValue(1);
    spyOnProperty(FormUtil, 'getFormErrorCount', 'get').and.returnValue(funcSpy);
    spyOn(component, 'showModal').and.callThrough();
    component.cancelTransferAll(null);
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should cancel transfer all transaction without changes', () => {
    const fb = new FormBuilder();
    component.parentForm.addControl('docStatus', fb.group({ changed: false }));
    const funcSpy = jasmine.createSpy('getFormErrorCount').and.returnValue(0);
    spyOnProperty(FormUtil, 'getFormErrorCount', 'get').and.returnValue(funcSpy);
    spyOn(component.router, 'navigate');
    component.cancelTransferAll(null);
    expect(component.router.navigate).toHaveBeenCalledWith(['/dashboard/search/establishment']);
  });

  it('should check and revert the transaction when cancelling the transaction in edit mode', () => {
    component.modalRef = new BsModalRef();
    component.isEditMode = true;
    spyOn(component, 'findDocumentStatus').and.returnValue(true);
    spyOn(component.router, 'navigate');
    component.checkRevertTransaction();
    expect(component.router.navigate).toHaveBeenCalledWith([
      ContributorRouteConstants.ROUTE_TRANSFER_ALL_CONTRIBUTOR_VALIDATOR
    ]);
  });

  it('should not revert the transaction in edit mode', () => {
    component.modalRef = new BsModalRef();
    component.isEditMode = true;
    spyOn(component, 'findDocumentStatus').and.returnValue(false);
    spyOn(component, 'navigateBack');
    component.checkRevertTransaction();
    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should throw error on reverting transaction', () => {
    spyOn(component.transferService, 'revertTransactionAll').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.revertTransferAllRequest();
    expect(component.showError).toHaveBeenCalled();
  });
});

function createTransferForm(fb: FormBuilder) {
  return fb.group({
    registrationNoFrom: [2659896569, Validators.required],
    establishmentNameFrom: fb.group({
      english: ['Gov', Validators.required],
      arabic: [null]
    }),
    establishmentTypeFrom: fb.group({
      english: ['Main', Validators.required],
      arabic: [null]
    }),
    transferDate: fb.group({
      gregorian: new Date(),
      hijiri: null
    }),
    totalContributor: [0, Validators.required],
    transferable: [0, Validators.required],
    nonTransferable: [0, Validators.required],
    registrationNoTo: [200085744, Validators.required],
    establishmentNameTo: fb.group({
      english: ['Gov', Validators.required],
      arabic: [null]
    }),
    establishmentTypeTo: fb.group({
      english: ['Main', Validators.required],
      arabic: [null]
    }),
    joiningDate: fb.group({
      gregorian: new Date(),
      hijiri: null
    })
  });
}
