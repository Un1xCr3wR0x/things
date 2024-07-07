/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { EstablishmentSearchScComponent } from './establishment-search-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchCardDcComponent } from '../../search-components';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BilingualTextPipeMock, SearchForms } from 'testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { bindToObject, ApplicationTypeToken, LanguageToken, Establishment } from '@gosi-ui/core';
import { establishmentListData } from 'testing';
import { SearchRequest, RequestLimit, RequestSort, EstablishmentSortConstants } from '../../../../shared';
import { EstablishmentEntriesDcComponent } from '../establishment-entries-dc/establishment-entries-dc.component';
import { Router, ActivatedRoute } from '@angular/router';
describe('EstablishmentSearchScComponent', () => {
  let component: EstablishmentSearchScComponent;
  let fixture: ComponentFixture<EstablishmentSearchScComponent>;
  const routerSpy = { url: 'dashboard/search/establishment/10000602', navigate: jasmine.createSpy('navigate') };
  const activatedRouteStub = () => ({
    queryParams: { subscribe: f => f({}) }
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EstablishmentSearchScComponent, EstablishmentEntriesDcComponent],
      imports: [TranslateModule.forRoot(), TabsModule.forRoot(), HttpClientTestingModule, NgxPaginationModule],

      providers: [
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentSearchScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(' ngOnInit', () => {
    it('should  ngOnInit', () => {
      component.dashboardSearchService?.establishmentSearchRequest?.searchKey === undefined;
      spyOn(component, 'initiateSearch').and.callThrough();
      spyOn(component, 'resumeSearch').and.callThrough();
      component.ngOnInit();
      expect(component.dashboardSearchService.establishmentSearchRequest?.searchKey).toEqual(undefined);
    });
  });
  describe(' initiate search', () => {
    it(' should initiate search ', () => {
      component.searchRequest = new SearchRequest();
      component.searchRequest.limit = new RequestLimit();
      component.searchRequest.sort = new RequestSort();
      component.searchRequest.sort.column = EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT[0].column;
      component.initiateSearch();
      expect(component.searchRequest.limit.pageNo).toBe(0);
      expect(component.searchRequest.limit.pageSize).toBe(10);
      expect(component.searchRequest.sort.direction).toBe('ASC');
      expect(component.searchRequest.sort.column).toBe(EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT[0].column);
      expect(component.searchRequest.limit).toBeDefined();
      expect(component.searchRequest.sort).toBeDefined();
    });
  });
  describe('resume search', () => {
    it(' should resume search ', () => {
      component.searchRequest = new SearchRequest();
      component.resumeSearch();
      spyOn(component, 'getSearchResults').and.callThrough();
      component.isSearch = true;
      expect(component.isSearch).toBe(true);
    });
  });
  describe('test suite for search establishments', () => {
    it('It should search for all the matching establishments ', () => {
      spyOn(component, 'getSearchResults').and.callThrough();
      component.isSearch = false;
      component.onSearchEstablishment();
      expect(component.getSearchResults).toHaveBeenCalled();
      expect(component.isSearch).toEqual(false);
    });
  });
  describe('getSearchResult', () => {
    it('should getSearchResult', () => {
      spyOn(component.dashboardSearchService, 'searchEstablishment').and.returnValue(
        of(bindToObject(new Establishment(), establishmentListData))
      );
      component.getSearchResults();
      expect(component.establishmentEntry).not.toEqual(null);
      expect(component.establishmentSearchCount).not.toEqual(null);
    });
    it('should getSearchResult', () => {
      spyOn(component.dashboardSearchService, 'searchEstablishment').and.returnValue(
        throwError({
          status: 400,
          error: {
            message: {
              english: 'Invalid',
              arabic: 'رمز التحقق غير صحيح'
            }
          }
        })
      );
      component.getSearchResults();
      expect(component).toBeTruthy();
    });
    it('should getSearchResult', () => {
      spyOn(component.dashboardSearchService, 'searchEstablishment').and.returnValue(
        throwError({
          status: 400,
          error: {
            message: {
              english: 'Invalid',
              arabic: 'رمز التحقق غير صحيح'
            }
          }
        })
      );
      component.getSearchResults();
      expect(component).toBeTruthy();
    });
  });
  // describe('test suite for pagination ', () => {
  //   it('It should paginate', () => {
  //     spyOn(component, 'getSearchResults').and.callThrough();
  //     component.onLimit(new RequestLimit());
  //     expect(component.searchRequest.limit).toBeDefined();
  //     expect(component.getSearchResults).toHaveBeenCalled();
  //   });
  // });
  // describe('test suite for sorting', () => {
  //   it('It should sort', () => {
  //     spyOn(component, 'getSearchResults').and.callThrough();
  //     component.estEntry = new EstablishmentEntriesDcComponent(component.language);
  //     component.searchEstEntry = new SearchCardDcComponent(component.language);
  //     spyOn(component.searchEstEntry, 'resetPagination').and.callThrough();
  //     spyOn(component.estEntry, 'resetPagination').and.callThrough();
  //     component.onSort(new RequestSort());
  //     expect(component.searchRequest.sort).toBeDefined();
  //     expect(component.getSearchResults).toHaveBeenCalled();
  //     expect(component.estEntry).toBeDefined();
  //     expect(component.estEntry.resetPagination).toHaveBeenCalled();
  //     expect(component.searchEstEntry).toBeDefined();
  //     expect(component.searchEstEntry.resetPagination).toHaveBeenCalled();
  //   });
  // });
  // describe('test suite for filtering', () => {
  //   it('It should filter', () => {
  //     spyOn(component, 'getSearchResults').and.callThrough();
  //     component.estEntry = new EstablishmentEntriesDcComponent(component.language);
  //     component.searchEstEntry = new SearchCardDcComponent(component.language);
  //     spyOn(component.searchEstEntry, 'resetPagination').and.callThrough();
  //     spyOn(component.estEntry, 'resetPagination').and.callThrough();
  //     component.onFilter(new RequestFilter());
  //     expect(component.searchRequest.filter).toBeDefined();
  //     expect(component.getSearchResults).toHaveBeenCalled();
  //     expect(component.estEntry).toBeDefined();
  //     expect(component.estEntry.resetPagination).toHaveBeenCalled();
  //     expect(component.searchEstEntry).toBeDefined();
  //     expect(component.searchEstEntry.resetPagination).toHaveBeenCalled();
  //   });
  // });
  describe('test suite for reset pagination', () => {
    it('It should reset the pagination', () => {
      component.estEntry = new EstablishmentEntriesDcComponent(component.language);
      component.searchEstEntry = new SearchCardDcComponent(component.language);
      spyOn(component.searchEstEntry, 'resetPagination').and.callThrough();
      spyOn(component.estEntry, 'resetPagination').and.callThrough();
      component.resetPagination();
      expect(component.estEntry).toBeDefined();
      expect(component.estEntry.resetPagination).toHaveBeenCalled();
      expect(component.searchEstEntry).toBeDefined();
      expect(component.searchEstEntry.resetPagination).toHaveBeenCalled();
    });
  });
  describe('test suite  onEstablishmentSearchEnable', () => {
    it('It should  onEstablishmentSearchEnable', () => {
      spyOn(component, 'clearSearchDetails').and.callThrough();
      component.onEstablishmentSearchEnable(true);
      expect(component.clearSearchDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for  clearSearchDetails ', () => {
    it('It should  clearSearchDetails', () => {
      component.dashboardSearchService.establishmentSearchRequest = new SearchRequest();
      component.clearSearchDetails();
      expect(component.dashboardSearchService.establishmentSearchRequest).toBeDefined();
      expect(component.establishmentEntry).toEqual([]);
      expect(component.establishmentSearchCount).toBe(0);
    });
  });
  describe('test suite for  navigateToEstablishment ', () => {
    it('It should  navigateToEstablishment', () => {
      component.registrationNo = 10000602;
      component.router.navigate(['dashboard/search/establishment/10000602']);
      component.navigateToEstablishment(component.registrationNo);
      expect(component.router.navigate).toHaveBeenCalledWith(['dashboard/search/establishment/10000602']);
    });
  });
  describe('on reset', () => {
    it(' should reset', () => {
      component.onReset();
      expect(component).toBeTruthy();
    });
  });
  describe('show adv search', () => {
    it(' should show adv search', () => {
      component.onAdvancedSearchShow();
      expect(component.dashboardSearchService.enableEstablishmentAdvancedSearch).toBeTruthy();
    });
  });
  describe('on reset filter and sort', () => {
    it(' should reset filter and sort', () => {
      component.resetFilterAndSort();
      expect(component).toBeTruthy();
    });
  });
  describe('close adv search', () => {
    it(' should close adv search', () => {
      component.onAdvancedSearchClose();
      expect(component.dashboardSearchService.enableEstablishmentAdvancedSearch).toBeFalsy();
    });
  });
  describe('adv search', () => {
    it(' should search', () => {
      const forms = new SearchForms();
      component.searchForm = forms.createEstSearchForm();
      component.searchForm.updateValueAndValidity();
      component.searchForm.get('searchKeyForm').get('searchKey').setValue('abd');
      component.searchForm.get('advancedSearchForm').get('personIdentifier').setValue(19087654333);
      component.onAdvancedSearch();
      expect(component.searchForm).not.toEqual(null);
      expect(component.searchForm.valid).toBeTruthy();
      expect(component.searchForm.value).not.toEqual(null);
    });
  });
});
