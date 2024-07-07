/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, ApplicationTypeToken, RouterData, RouterDataToken, DocumentService } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  BulkWageServiceStub,
  ContributorServiceStub,
  ContributorsWageMockService,
  EstablishmentServiceStub,
  genericError,
  ModalServiceStub,
  DocumentServiceStub
} from 'testing';
import {
  BulkWageService,
  ContributorFilter,
  ContributorService,
  ContributorsWageService,
  ContributorWageDetailsResponse,
  EstablishmentService
} from '../../../../shared';
import { BulkWageCustomListScComponent } from './bulk-wage-custom-list-sc.component';

describe('BulkWageCustomListScComponent', () => {
  let component: BulkWageCustomListScComponent;
  let fixture: ComponentFixture<BulkWageCustomListScComponent>;
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({}), HttpClientTestingModule, RouterTestingModule],
      declarations: [BulkWageCustomListScComponent],
      providers: [
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        { provide: ContributorsWageService, useClass: ContributorsWageMockService },
        { provide: BulkWageService, useClass: BulkWageServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ApplicationTypeToken, useValue: 'PUBLIC' },
        { provide: DocumentService, useClass: DocumentServiceStub },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkWageCustomListScComponent);
    component = fixture.componentInstance;
    spy = spyOn(component.establishmentService, 'getRegistrationFromStorage');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('must initialize component', () => {
    spy.and.returnValue(200085744);
    spyOn(component, 'fetchEstablishment').and.callThrough();
    component.ngOnInit();
    expect(component.fetchEstablishment).toHaveBeenCalled();
  });

  it('should throw error on fetching establishment details', () => {
    spyOn(component.establishmentService, 'getEstablishmentDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.fetchEstablishment(200085744);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw error on fetching active contributor details', () => {
    spyOn(component.contributorWageService, 'getContributorWageDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.getContributorWageDetails(component.assembleContributorWageParams());
    expect(component.showError).toHaveBeenCalled();
  });

  it('must handle actions on contributor list', () => {
    spyOn(component, 'getContributorWageDetails');
    component.fetchContWageDetails({
      search: 'Abdul',
      sortBy: 'CONTRIBUTOR_NAME',
      filter: new ContributorFilter()
    });
    expect(component.getContributorWageDetails).toHaveBeenCalled();
  });

  it('should fetch active contributor list when no action is present', () => {
    spyOn(component, 'getContributorWageDetails');
    component.fetchContWageDetails(null);
    expect(component.getContributorWageDetails).toHaveBeenCalled();
  });

  it('should show error if no active contributors', () => {
    spyOn(component.alertService, 'showErrorByKey');
    spyOn(component.contributorWageService, 'getContributorWageDetails').and.returnValue(
      of(new ContributorWageDetailsResponse())
    );
    component.getContributorWageDetails(component.assembleContributorWageParams());
    expect(component.alertService.showErrorByKey).toHaveBeenCalled();
  });

  it('should paginate to check contributors on other pages', () => {
    component.pageDetails.currentPage = 2;
    spyOn(component, 'getContributorWageDetails');
    component.paginateContributors(1);
    expect(component.getContributorWageDetails).toHaveBeenCalled();
  });

  it('should download csv when all contributors selected', () => {
    spyOn(component, 'saveCsvFile').and.callThrough();
    component.downloadActiveCsvFile();
    expect(component.saveCsvFile).toHaveBeenCalled();
  });

  it('should throw error while downloadig csv', () => {
    spyOn(component.bulkWageService, 'downloadActiveContributorsCSV').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.downloadActiveCsvFile();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should navigate back on cancel when no changes made', () => {
    spyOn(component.router, 'navigate');
    component.navigateBack();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor/wage/update']);
  });

  it('should navigate back on cancel when changes made', () => {
    component.filterValue = new ContributorFilter();
    spyOn(component, 'showTemplate').and.callThrough();
    component.navigateBack();
    expect(component.showTemplate).toHaveBeenCalled();
  });

  it('should confirm cancel', () => {
    spyOn(component, 'navigetBack');
    component.parentForm.addControl('searchContributorFormControl', new FormControl());
    component.parentForm.addControl('sortContributorFormControl', new FormControl());
    component.modalRef = new BsModalRef();
    component.confirmCancel();
    expect(component.navigetBack).toHaveBeenCalled();
  });

  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
});
