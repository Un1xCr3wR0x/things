/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchBaseScComponent } from './search-base-sc.component';
import { ApplicationTypeToken, LanguageToken } from '@gosi-ui/core';
import { RequestSort, RequestLimit, SearchRequest, RequestFilter } from '../../../shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'search-base-derived'
})
export class DerivedSearchBaseScComponent extends SearchBaseScComponent {
  getSearchResults() {}
  resetPagination() {}
  onAdvancedSearchClose() {}
  onAdvancedSearch() {}
  resetFilterAndSort() {}
  resumeSearch() {}
}

describe('SearchBaseScComponent', () => {
  let component: DerivedSearchBaseScComponent;
  let fixture: ComponentFixture<SearchBaseScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule, HttpClientTestingModule],
      declarations: [DerivedSearchBaseScComponent],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedSearchBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('test suite for sorting', () => {
    it('It should sort', () => {
      spyOn(component, 'getSearchResults').and.callThrough();
      const sortItem = new RequestSort();
      component.searchRequest = new SearchRequest();
      component.onSort(sortItem);
      expect(component.searchRequest.sort).toEqual(sortItem);
      expect(component.searchRequest).toBeDefined();
    });
  });
  describe('test suite for filtering', () => {
    it('It should filter', () => {
      spyOn(component, 'getSearchResults').and.callThrough();
      const filterItem = new RequestFilter();
      component.searchRequest = new SearchRequest();
      component.onFilter(filterItem);
      expect(component.searchRequest.filter).toEqual(filterItem);
      expect(component.isFilter).toEqual(true);
      expect(component.searchRequest).toBeDefined();
    });
  });
  describe('test suite for pagination ', () => {
    it('It should paginate', () => {
      spyOn(component, 'getSearchResults').and.callThrough();
      const limitItem = new RequestLimit();
      component.searchRequest = new SearchRequest();
      component.onLimit(limitItem);
      expect(component.searchRequest.limit).toEqual(limitItem);
      expect(component.searchRequest).toBeDefined();
    });
  });

  describe('reset search', () => {
    it('should reset search', () => {
      component.isSearched = false;
      component.noResults = false;
      component.resetSearch();
      expect(component).toBeTruthy();
    });
  });
});
