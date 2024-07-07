/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  bindToObject,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  StorageService,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  AlertServiceStub,
  ContributorBaseScComponentMock,
  ContributorServiceStub,
  DocumentServiceStub,
  EngagementServiceStub,
  EstablishmentServiceStub,
  LookupServiceStub,
  MockManageWageService,
  ModalServiceStub,
  StorageServiceStub,
  updateForm,
  uploadFileRequest,
  WorkflowServiceStub
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import {
  ContributorBaseScComponent,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../../shared';
import { UpdateCurrentWageDetailsDcComponent } from '../update-current-wage-details-dc/update-current-wage-details-dc.component';
import { IndividualWageUpdateScComponent } from './individual-wage-update-sc.component';
describe('IndividualWageUpdateScComponent', () => {
  let component: IndividualWageUpdateScComponent;
  let fixture: ComponentFixture<IndividualWageUpdateScComponent>;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({}), HttpClientTestingModule],
      declarations: [IndividualWageUpdateScComponent],
      providers: [
        FormBuilder,
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ManageWageService, useClass: MockManageWageService },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData().fromJsonToObject(routerMockToken)
        },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PUBLIC },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        { provide: Location, useValue: { back: () => {} } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualWageUpdateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should update current wage ', () => {
    component.isEditValidator = false;
    const fb = new FormBuilder();
    component.wageDetailsparentForm.addControl('comments', fb.group({ comments: null }));
    component.wageDetailsparentForm.get('comments.comments').markAsDirty();
    component.currentWageDetails.documentList = [bindToObject(new DocumentItem(), uploadFileRequest)];
    component.wageDetailsparentForm.addControl('wageDetails', updateForm);
    component.wageDetailsparentForm.markAllAsTouched();
    spyOn(component, 'checkForChangesInWagePeriod').and.returnValue(true);
    component.updateCurrentWage(component.wageDetailsparentForm);
    expect(component.canDeactivate).toBeFalsy();
  });

  it('should return value change as truthy', () => {
    component.canDeactivate = true;
    component.wageDetailsparentForm.addControl('wageDetails', updateForm);
    component.wageDetailsparentForm.controls.wageDetails.markAsTouched();
    expect(component.hasChanges()).toBeTruthy();
  });
  it('should return value change as falsy', () => {
    component.canDeactivate = false;
    component.wageDetailsparentForm.addControl('wageDetails', updateForm);
    expect(component.hasChanges()).toBeFalsy();
  });
  it('should show template two', () => {
    component.wageDetailsparentForm.addControl('wageDetails', updateForm);
    component.wageDetailsparentForm.markAsDirty();
    spyOn(component, 'showTemplate');
    component.cancelUpdateWage();
    expect(component.showTemplate).toHaveBeenCalled();
  });
  it('should show template one', () => {
    const form = new FormControl({
      validators: [Validators.required, Validators.minLength(5)]
    });
    form.setErrors({
      minLength: false
    });
    component.wageDetailsparentForm.addControl('wageDetails', form);
    spyOn(component, 'showTemplate');
    component.cancelUpdateWage();
    expect(component.showTemplate).toHaveBeenCalled();
  });
  it('should trigger popup', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    spyOn(component.modalService, 'show');
    component.showTemplate(modalRef);
    expect(component.modalService.show).toHaveBeenCalled();
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    const fb = new FormBuilder();
    component.currentWageDetails = new UpdateCurrentWageDetailsDcComponent(fb, ApplicationTypeEnum.PRIVATE);
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should refresh document', () => {
    spyOn(component.documentService, 'refreshDocument').and.returnValue(
      of(bindToObject(new DocumentItem(), uploadFileRequest))
    );
    component.currentEngagement.engagementId = 1235465;
    component.refreshDocument(new DocumentItem());
    expect(component.documentService.refreshDocument).toHaveBeenCalled();
  });
  it('should show navigate back', () => {
    component.wageDetailsparentForm.addControl('wageDetails', updateForm);
    component.wageDetailsparentForm.markAsUntouched();
    const fb = new FormBuilder();
    component.wageDetailsparentForm.addControl('comments', fb.group({ comments: null }));
    component.wageDetailsparentForm.get('comments.comments').markAsDirty();
    spyOn(component, 'showTemplate');
    component.isDocumentScanned = false;
    component.cancelUpdateWage();
    expect(component.showTemplate).toHaveBeenCalled();
  });

  it('should check validity', () => {
    expect(component.checkFormValidity(new FormGroup({}))).toBeTruthy();
  });

  it('should get current engagement', () => {
    spyOn(component, 'getContributor');
    component.getModifiedCurrentEngagment();
    expect(component.currentEngagement).toBeDefined();
    expect(component.getContributor).toHaveBeenCalled();
  });

  it('navigate to inbox', () => {
    component.navigateToInbox();
    expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
  });
  it('navigate to Wage Details', () => {
    spyOn(component.location, 'back');
    component.navigateToWageDetails();
    expect(component.location.back).toHaveBeenCalled();
  });

  it('must fetch period', () => {
    component.fetchEngagmentPeriod();
    expect(component.currentEngagement).toBeDefined();
  });
});
