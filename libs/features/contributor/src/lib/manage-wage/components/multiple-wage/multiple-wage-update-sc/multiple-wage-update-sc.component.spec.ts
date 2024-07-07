/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  bindToForm,
  bindToObject,
  LookupService,
  RouterData,
  RouterDataToken,
  StorageService,
  DocumentService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  ContributorBaseScComponentMock,
  contributorResponseDeathData,
  ContributorServiceStub,
  ContributorsWageMockService,
  contributorWageResponseData,
  CoreEstablishmentServiceStub,
  EngagementServiceStub,
  getActiveContributorResponse,
  LookupServiceStub,
  ModalServiceStub,
  StorageServiceStub,
  TerminateContributorServiceStub,
  updateForm,
  DocumentServiceStub
} from 'testing';
import {
  ContributorService,
  ContributorsWageService,
  ContributorWageDetails,
  EngagementService,
  EstablishmentService,
  TerminateContributorService
} from '../../../../shared';
import { ContributorBaseScComponent } from '../../../../shared/components';
import { ContributorTableDcComponent } from '../contributor-table-dc/contributor-table-dc.component';
import { MultipleWageUpdateScComponent } from './multiple-wage-update-sc.component';

describe('MultipleWageUpdateScComponent', () => {
  let component: MultipleWageUpdateScComponent;
  let fixture: ComponentFixture<MultipleWageUpdateScComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleWageUpdateScComponent],
      imports: [TranslateModule.forRoot({}), HttpClientTestingModule],
      providers: [
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ContributorsWageService, useClass: ContributorsWageMockService },
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        FormBuilder,
        { provide: EstablishmentService, useClass: CoreEstablishmentServiceStub },
        { provide: ContributorService, useClass: ContributorServiceStub },
        { provide: EngagementService, useClass: EngagementServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ContributorBaseScComponent, useClass: ContributorBaseScComponentMock },
        { provide: TerminateContributorService, useClass: TerminateContributorServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleWageUpdateScComponent);
    component = fixture.componentInstance;
    component.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, 1341341344);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should update wage', () => {
    it('must initialize component', () => {
      component.registrationNo = 200085744;
      spyOn(component, 'checkEstablishment');
      component.ngOnInit();
      expect(component.checkEstablishment).toHaveBeenCalled();
      expect(component.contributorWageDetailsResponse.numberOfContributors).toBe(2);
    });

    it('must not terminate contributor if contributor is not dead or govt employee', () => {
      const contributor = component.contributorWageDetailsResponse.contributors;
      component.checkTerminationRequired(contributor);
      expect(component.terminatePayload.leavingReason.english).toEqual(undefined);
      expect(component.terminatePayload.leavingDate.gregorian).toEqual(undefined);
      expect(component.terminateMessage).toEqual(undefined);
    });

    xit('must terminate contributor if contributor is govt employee', () => {
      component.checkTerminationRequired(contributorResponseDeathData.contributors);
      expect(component.terminatePayload.leavingReason.english).toBe('Government Job Joining');
      expect(component.terminateMessage).toBe('CONTRIBUTOR.TERMINATE-GOVT-EMPLOYEE-MESSAGE');
    });

    it('must terminate contributor if contributor is dead', () => {
      component.checkTerminationRequired(contributorWageResponseData.contributors);
      expect(component.terminatePayload.leavingReason.english).toBe('Termination due to Contributor is Deceased');
      expect(component.terminateMessage).toBe('CONTRIBUTOR.TERMINATE-DEAD-PERSON-MESSAGE');
    });

    it('must update wage', () => {
      component.pageDetails.currentPage = 5;
      const formArray: FormArray = new FormArray([]);
      const wageForms: FormGroup = updateForm;
      bindToForm(wageForms, getActiveContributorResponse.contributors[0]);
      wageForms.markAsDirty();
      wageForms.markAsTouched();
      formArray.push(wageForms);
      component.parentForm.addControl('wageForms', formArray);
      component.parentForm.controls.wageForms.markAsTouched();
      component.parentForm.controls.wageForms.markAsDirty();
      (component.parentForm.controls.wageForms as FormArray).controls[0].markAsDirty();
      component.contributorWageDetailsResponse.contributors.push(
        bindToObject(new ContributorWageDetails(), getActiveContributorResponse.contributors[0])
      );
      component.contributorWageDetailsResponse.contributors.push(
        bindToObject(new ContributorWageDetails(), getActiveContributorResponse.contributors[1])
      );
      component.updateContributorWageDetailsList();
      expect(component.contributorWageDetailsResponse.contributors[0].message).toBeDefined();
    });
  });

  it('should fetch contributor details', () => {
    spyOn(component, 'getContributorWageDetails');
    component.fetchContWageDetails({ search: 'name' });
    expect(component.getContributorWageDetails).toHaveBeenCalledWith('name', null, null, null, null);
  });
  it('should fetch contributor details', () => {
    spyOn(component, 'getContributorWageDetails');
    component.fetchContWageDetails({ serch: null });
    expect(component.getContributorWageDetails).toHaveBeenCalledWith();
  });
  it('must select page', () => {
    component.pageDetails.currentPage = 5;
    const formArray: FormArray = new FormArray([]);
    const wageForms: FormGroup = updateForm;
    bindToForm(wageForms, getActiveContributorResponse.contributors[0]);
    formArray.push(wageForms);
    component.parentForm.addControl('wageForms', formArray);
    component.parentForm.addControl('searchContributorFormControl', wageForms);
    component.parentForm.addControl('sortContributorFormControl', wageForms);
    component.selectPage(1);
    expect(component.contributorWageDetailsResponse.numberOfContributors).toBe(2);
  });

  it('must check search if nothing searched', () => {
    expect(component.parentForm.get('searchContributorFormControl')).toBeNull();
    expect(component.parentForm.get('sortContributorFormControl')).toBeNull();
  });

  it('must handle actions of search'),
    () => {
      const req = {
        search: 'Ameen'
      };
      component.totalNumberOfActiveContributors = 0;
      component.fetchContWageDetails(req.search);
      component.getContributorWageDetails(req.search);
      expect(component.contributorWageDetailsResponse.numberOfContributors).toBe(1);
    };

  it('must handle actions of sort'),
    () => {
      const req = {
        sortBy: 'CONTRIBUTOR_NAME'
      };
      component.totalNumberOfActiveContributors = 0;
      component.pageDetails.currentPage = 1;
      component.fetchContWageDetails(req.sortBy);
      component.getContributorWageDetails(null, req.sortBy);
      expect(component.contributorWageDetailsResponse.numberOfContributors).toBe(10);
    };

  it('must handle actions of sort & search'),
    () => {
      const req = {
        sortBy: 'CONTRIBUTOR_NAME',
        search: 'Ameen'
      };
      component.totalNumberOfActiveContributors = 0;
      component.pageDetails.currentPage = 1;
      component.fetchContWageDetails(req.sortBy);
      component.getContributorWageDetails(req.search, req.sortBy);
      expect(component.contributorWageDetailsResponse.numberOfContributors).toBe(1);
    };

  it('should trigger popup', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    spyOn(component.modalService, 'show');
    component.showTemplate(modalRef);
    expect(component.modalService.show).toHaveBeenCalled();
  });

  it('should hide popup', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.confirmNoChanges();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  it('should hide popup', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
    expect(component['router'].navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('should revert changes', () => {
    component.contributorTableDcComponent = new ContributorTableDcComponent(new FormBuilder());
    spyOn(component.contributorTableDcComponent, 'generateFormView');
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.parentForm.addControl('searchContributorFormControl', new FormControl());
    component.parentForm.addControl('sortContributorFormControl', new FormControl());
    component.revertChanges();
    expect(component.modalRef.hide).toHaveBeenCalled();
    expect(component.totalNumberOfActiveContributors).toBe(2);
  });
});
