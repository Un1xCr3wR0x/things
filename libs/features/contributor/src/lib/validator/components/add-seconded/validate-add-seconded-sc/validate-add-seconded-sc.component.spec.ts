/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
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
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  ContributorServiceStub,
  DocumentServiceStub,
  EstablishmentServiceStub,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  SecondedServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorBPMRequest, Establishment, PersonalInformation, SecondedDetails } from '../../../../shared/models';
import { ContributorService, EstablishmentService, SecondedService } from '../../../../shared/services';
import { ValidateAddSecondedScComponent } from './validate-add-seconded-sc.component';

describe('ValidateAddSecondedScComponent', () => {
  let component: ValidateAddSecondedScComponent;
  let fixture: ComponentFixture<ValidateAddSecondedScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ValidateAddSecondedScComponent],
      providers: [
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: SecondedService, useClass: SecondedServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateAddSecondedScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize the component', () => {
    component.registrationNo = 200085744;
    component.secondedId = 485;
    spyOn(component, 'getDetailsOnPageLoad');
    component.ngOnInit();
    expect(component.getDetailsOnPageLoad).toHaveBeenCalled();
  });

  it('should read transaction data from token', inject([RouterDataToken], token => {
    token.payload = '{"id": 657}';
    component.readTransactionDataFromToken(token);
    expect(component.secondedId).toBe(657);
  }));

  it('should get details on page load', () => {
    component.registrationNo = 200085744;
    component.secondedId = 485;
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(of(new Establishment()));
    spyOn(component.secondedService, 'getSecondedDetails').and.returnValue(of(new SecondedDetails()));
    spyOn(component.contributorService, 'getPersonById').and.returnValue(of(new PersonalInformation()));
    component.getDetailsOnPageLoad();
    expect(component.establishment).toBeDefined();
    expect(component.secondedDetails).toBeDefined();
  });

  it('should throw error get details when page loads', () => {
    component.registrationNo = 200085744;
    component.secondedId = 485;
    spyOn(component.secondedService, 'getSecondedDetails').and.returnValue(throwError(genericError));
    spyOn(ValidatorBaseScComponent.prototype, 'handleError');
    component.getDetailsOnPageLoad();
    expect(ValidatorBaseScComponent.prototype.handleError).toHaveBeenCalled();
  });

  it('should save and handle workflow events', () => {
    component.modalRef = new BsModalRef();
    spyOn(ValidatorBaseScComponent.prototype, 'getWorkflowAction').and.returnValue(WorkFlowActions.APPROVE);
    spyOn(ValidatorBaseScComponent.prototype, 'setWorkflowData').and.returnValue(new ContributorBPMRequest());
    spyOn(component, 'navigateToInbox');
    component.handleWorkflowEvents(0);
    expect(component.navigateToInbox).toHaveBeenCalled();
  });

  it('should navigate to edit', () => {
    spyOn(component.router, 'navigate');
    component.navigateToEdit();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/seconded/add/edit']);
  });
});
