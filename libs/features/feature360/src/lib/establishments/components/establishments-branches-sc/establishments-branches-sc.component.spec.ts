/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageToken } from '@gosi-ui/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';

import { ActivatedRouteStub, TranslateLoaderStub } from 'testing';
import { EstablishmentBranchesService } from '../../../services/establishments/establishment-branches.service';
import { EstablishmentBranches } from '../../../models/establishments/establishment-branches';
import { EstablishmentsBranchesScComponent } from './establishments-branches-sc.component';
import { NgxPaginationModule } from 'ngx-pagination';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('EstablishmentsBranchesScComponent', () => {
  let component: EstablishmentsBranchesScComponent;
  let fixture: ComponentFixture<EstablishmentsBranchesScComponent>;

  let mockEstablishmentBranchesService;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({ estId: 123 });
  beforeEach(async(() => {
    mockEstablishmentBranchesService = jasmine.createSpyObj(['getEstablishmentBranches']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        NgxPaginationModule
      ],
      declarations: [EstablishmentsBranchesScComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { estId: '123' } } } },
        {
          provide: Router,
          useValue: routerSpy
        },
        EstablishmentBranchesService,
        { provide: LanguageToken, useValue: new BehaviorSubject('en') }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentsBranchesScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(component.establishmentBranchesService, 'getEstablishmentBranches');

    expect(component).toBeTruthy();
  });

  it('Get Establishment Branches Details', () => {
    let establishmentBranches: EstablishmentBranches = new EstablishmentBranches();
    spyOn(component.establishmentBranchesService, 'getEstablishmentBranches').and.returnValue(
      of([establishmentBranches])
    );
    component.getEstablishmentBranches();
    expect(component.establishmentAllBranches).toEqual([establishmentBranches]);
  });

  it('Get BranchesDetails by filter', () => {
    spyOn(component.establishmentBranchesService, 'getEstablishmentBranches');
    let filterName = { data: 'branchA' };

    let branchesA: EstablishmentBranches = new EstablishmentBranches();
    branchesA.estnameenglish = filterName.data;

    let branchesB: EstablishmentBranches = new EstablishmentBranches();
    branchesB.estnameenglish = 'branchesB';

    component.establishmentAllBranches = [branchesA, branchesB];

    component.getBranchesDetails(filterName);
    expect(component.searchResultBranches.length).toEqual(1);
    expect(component.searchResultBranches[0].estnameenglish).toEqual(filterName.data);
  });

  it('selectPage', () => {
    spyOn(component.establishmentBranchesService, 'getEstablishmentBranches');
    const pageNumber = 2;

    component.selectPage(pageNumber);
    expect(component.pageDetails.currentPage).toEqual(pageNumber);
    expect(component.currentPage).toEqual(pageNumber);
  });

  it('Route to establishments details screen', () => {
    spyOn(component.establishmentBranchesService, 'getEstablishmentBranches');
    component.showDetails(1234);
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('showFormInvalid', () => {
    spyOn(component.establishmentBranchesService, 'getEstablishmentBranches');

    component.establishmentAllBranches = [];
    component.showFormInvalid();

    expect(component.searchResultBranches).toEqual(component.establishmentAllBranches);
  });
});
