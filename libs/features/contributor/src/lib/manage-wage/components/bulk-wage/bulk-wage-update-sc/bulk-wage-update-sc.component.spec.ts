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
  AuthTokenService,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  AuthTokenServiceStub,
  bulkUpdateHistory,
  bulkUpdateProcessing,
  BulkWageServiceStub,
  ContributorServiceStub,
  ContributorsWageMockService,
  EstablishmentServiceStub,
  genericError,
  ModalServiceStub,
  sampleFile,
  WorkflowServiceStub
} from 'testing';
import {
  BulkWageService,
  ContributorService,
  ContributorsWageService,
  EstablishmentService
} from '../../../../shared/services';
import { BulkWageUpdateScComponent } from './bulk-wage-update-sc.component';

describe('BulkWageUpdateScComponent', () => {
  let component: BulkWageUpdateScComponent;
  let fixture: ComponentFixture<BulkWageUpdateScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [BulkWageUpdateScComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: BulkWageService, useClass: BulkWageServiceStub },
        { provide: ContributorsWageService, useClass: ContributorsWageMockService },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PUBLIC' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: RegistrationNoToken, useValue: new RegistrationNumber() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkWageUpdateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'update' }, { path: 'bulk' }, { path: 'edit' }]);
    component.checkEditMode();
    expect(component.isEditMode).toBeTruthy();
  }));

  it('should initialise view in edit mode', inject([RouterDataToken], token => {
    token.payload = '{"RegistrationNo": 200085744, "id": 666}';
    component.initializeViewForEdit();
    expect(component.isProcessing).toBeFalsy();
  }));

  it('should handle establishment search', () => {
    spyOn(component, 'checkUserPrivileges');
    component.onEstablishmentSearch(200074351);
    expect(component.checkUserPrivileges).toHaveBeenCalled();
    expect(component.isValid).toBeFalsy();
  });

  it('should download csv for all active contributors', () => {
    spyOn(component, 'saveCSVFile').and.callThrough();
    component.downloadAllActiveContributorsCSV();
    expect(component.saveCSVFile).toHaveBeenCalled();
  });

  it('should throw error while downloadig csv', () => {
    spyOn(component.bulkWageService, 'downloadActiveContributorsCSV').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.downloadAllActiveContributorsCSV();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should start processing the file', () => {
    spyOn(component, 'getFilesUnderProcessing');
    component.startBulkWageFileProcessing(sampleFile);
    expect(component.getFilesUnderProcessing).toHaveBeenCalled();
  });

  it('should submit file in edit mode', () => {
    component.isAppPrivate = true;
    component.isEditMode = true;
    const fb = new FormBuilder();
    component.bulkWageForm.addControl('comments', fb.group({ comments: null }));
    spyOn(component, 'updateBulkWageInEditMode').and.callThrough();
    spyOn(component.router, 'navigate');
    component.startBulkWageFileProcessing(sampleFile);
    expect(component.updateBulkWageInEditMode).toHaveBeenCalled();
  });

  it('should thow error on processing bulk wage request', () => {
    spyOn(component.bulkWageService, 'processBulkWageUpdate').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.startBulkWageFileProcessing(sampleFile);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw error on retrieving upload history', () => {
    spyOn(component.bulkWageService, 'getUploadedFileHistory').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.getUploadHistory(0, 'History').subscribe(noop, noop);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should check bulk wage status when processing is pending', () => {
    component.checkBulkWageUpdateStatus(bulkUpdateProcessing);
    expect(component.isProcessing).toBeTruthy();
  });

  it('should fetch report', () => {
    spyOn(component, 'saveCSVFile');
    component.fetchReport(666);
    expect(component.saveCSVFile).toHaveBeenCalled();
  });

  it('should paginate through upload history', () => {
    spyOn(component.bulkWageService, 'getUploadedFileHistory').and.returnValue(of(bulkUpdateHistory));
    spyOn(component, 'getProcessedFileHistory').and.callThrough();
    component.paginateFiles(2);
    expect(component.getProcessedFileHistory).toHaveBeenCalled();
  });

  it('should check for changes in case of change', () => {
    const fb = new FormBuilder();
    component.bulkWageForm.addControl('uploadForm', fb.group({ changed: true }));
    spyOn(component, 'showModal').and.callThrough();
    component.checkForChanges(null);
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should check for changes in case of change', () => {
    component.isAppPrivate = true;
    const fb = new FormBuilder();
    component.bulkWageForm.addControl('uploadForm', fb.group({ changed: false }));
    spyOn(component.router, 'navigate');
    component.checkForChanges(null);
    expect(component.router.navigate).toHaveBeenCalledWith(['/dashboard/search/establishment']);
  });

  it('should navigate back in edit mode', () => {
    component.isAppPrivate = true;
    component.isEditMode = true;
    spyOn(component.router, 'navigate');
    component.navigateBack();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/validator/bulk-wage']);
  });

  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
});
