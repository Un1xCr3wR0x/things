/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NationalityTypeEnum } from '@gosi-ui/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  EstablishmentStubService,
  genericEstablishmentResponse,
  genericOwnerReponse,
  genericPersonResponse,
  TranslateLoaderStub
} from 'testing';
import { getWorkflowResponseOfType } from '../../../profile/components/establishment-profile-sc/establishment-profile-sc.component.spec';
import { EstablishmentService, FilterKeyEnum, WorkFlowStatusType } from '../../../shared';
import { commonProviders } from '../change-basic-details-sc/change-basic-details-sc.component.spec';
import { OwnersScComponent } from './owners-sc.component';

describe('OwnersScComponent', () => {
  let component: OwnersScComponent;
  let fixture: ComponentFixture<OwnersScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxPaginationModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        })
      ],
      declarations: [OwnersScComponent],
      providers: [
        ...commonProviders,
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnersScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise component', () => {
      component.changeEstablishmentService['selectedRegistrationNo'] = 1233456;
      spyOn(component, 'initialiseView');
      component.ngOnInit();
      expect(component.initialiseView).toHaveBeenCalled();
    });
    it('should navigate to profile if registration no is not selected/searched', () => {
      spyOn(component.location, 'back');
      component.ngOnInit();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe('initialise view', () => {
    it('should initialise view', () => {
      component.initialiseView();
      expect(component.owners).not.toBe(null);
    });
    it('with owner already in workflow', () => {
      component.mainEst = component.establishment = { ...genericEstablishmentResponse };
      const ownerWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.OWNER);
      const legalEntityWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.LEGALENTITY);
      const installmentWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.INSTALLMENT);
      component.workflows = [ownerWorkflow, legalEntityWorkflow, installmentWorkflow];
      spyOn(component, 'showModal');
      component.initiateNavigation({ key: 'testing' } as unknown as TemplateRef<HTMLElement>);
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('navigate back', () => {
    it('should go back', () => {
      spyOn(component.location, 'back').and.callFake(() => {});
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });

  describe('Search Owners', () => {
    it('should search for owners using name or identifiers', () => {
      component.owners = [genericOwnerReponse];
      expect(component.filteredOwners).toBeUndefined();
      component.searchForOwners(genericPersonResponse.name?.english.name.slice(0, 2));
      expect(component.filteredOwners?.length).toBe(1);
    });
  });

  describe('Filter Owners', () => {
    it('should filter the owner with nationality, Period ,status', () => {
      const filters = [
        {
          key: FilterKeyEnum.NATIONALITY,
          bilingualValues: [{ english: genericPersonResponse?.nationality?.english, arabic: '' }]
        }
      ];
      component.owners = [genericOwnerReponse];
      expect(component.filteredOwners).toBeUndefined();
      component.filterOwners(filters);
      expect(component.filteredOwners?.length).toBe(1);
    });
  });

  describe('Clear All filters', () => {
    it('should clear the filters', () => {
      component.ownerFilters = [
        {
          key: FilterKeyEnum.NATIONALITY,
          bilingualValues: [{ english: NationalityTypeEnum.SAUDI_NATIONAL, arabic: '' }]
        }
      ];
      component.clearAll();
      expect(component.ownerFilters?.length).toBe(0);
      expect(component.currentPage).toBe(1);
      expect(component.pageDetails?.currentPage).toBe(1);
    });
  });
});
