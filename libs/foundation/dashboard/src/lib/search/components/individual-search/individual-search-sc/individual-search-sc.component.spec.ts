/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  bindToObject,
  ContributorToken,
  ContributorTokenDto,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber,
  CoreContributorService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { contributorResponseTestData, ModalServiceStub, SearchForms, CoreContributorSerivceStub } from 'testing';
import { RequestLimit, RequestSort, SearchRequest } from '../../../../shared';
import { IndividualSortConstants } from '../../../constants';
import { IndividualSearchDetails } from '../../../models';
import { SearchCardDcComponent } from '../../search-components';
import { IndividualEntriesDcComponent } from '../individual-entries-dc/individual-entries-dc.component';
import { IndividualSearchScComponent } from './individual-search-sc.component';
describe('IndividualSearchScComponent', () => {
  let component: IndividualSearchScComponent;
  let fixture: ComponentFixture<IndividualSearchScComponent>;
  const routerSpy = { url: 'dashboard/search/contributor/200085736', navigate: jasmine.createSpy('navigate') };
  const activatedRouteStub = () => ({
    queryParams: { subscribe: f => f({}) }
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndividualSearchScComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: CoreContributorService, useClass: CoreContributorSerivceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualSearchScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(' ngOnInit', () => {
    it('should  ngOnInit', () => {
      spyOn(component, 'initiateSearch').and.callThrough();
      component.ngOnInit();
      expect(component.initiateSearch).toHaveBeenCalled();
    });
  });
  describe(' initiate contributor search', () => {
    it(' should initiate contributor search ', () => {
      component.searchRequest = new SearchRequest();
      component.searchRequest.limit = new RequestLimit();
      component.searchRequest.sort = new RequestSort();
      component.searchRequest.sort.column = IndividualSortConstants.SORT_FOR_CONTRIBUTOR[0].column;
      component.initiateSearch();
      expect(component.searchRequest.limit.pageNo).toBe(0);
      expect(component.searchRequest.limit.pageSize).toBe(10);
      expect(component.searchRequest.sort.direction).toBe('ASC');
      expect(component.searchRequest.sort.column).toBe(IndividualSortConstants.SORT_FOR_CONTRIBUTOR[0].column);
      expect(component.searchRequest.limit).toBeDefined();
      expect(component.searchRequest.sort).toBeDefined();
    });
  });
  describe(' resume search', () => {
    it('should  resume search', () => {
      component.isSearch = true;
      spyOn(component, 'resumeSearch').and.callThrough();
      component.resumeSearch();
      expect(component.isSearch).toEqual(false);
    });
  });
  describe('getSearchResults', () => {
    it('should getSearchResults', () => {
      spyOn(component.dashboardSearchService, 'searchIndividual').and.returnValue(
        of(bindToObject(new IndividualSearchDetails(), contributorResponseTestData))
      );
      component.getSearchResults();
      expect(component.individualEntry).not.toEqual(null);
      expect(component.individualSearchCount).not.toEqual(null);
      expect(component.isSearch).toEqual(false);
    });
    it('should getSearchResults', () => {
      spyOn(component.dashboardSearchService, 'searchIndividual').and.returnValue(
        throwError({
          error: {
            message: {
              english: 'Invalid',
              arabic: 'رمز التحقق غير صحيح'
            }
          }
        })
      );
      component.getSearchResults();
      expect(component.isSearch).toEqual(false);
    });
    it('should getSearchResults', () => {
      spyOn(component.dashboardSearchService, 'searchIndividual').and.returnValue(
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
      expect(component.isSearch).toEqual(false);
    });
  });
  describe(' clear search', () => {
    it('should  clear search', () => {
      component.dashboardSearchService.individualSearchRequest = new SearchRequest();
      component.clearSearchDetails();
      expect(component.dashboardSearchService.individualSearchRequest).toBeDefined();
      expect(component.individualEntry).toEqual([]);
      expect(component.individualSearchCount).toBe(0);
    });
  });
  // describe('test suite for limit item ', () => {
  //   it('It should limit', () => {
  //     const limitItem = new RequestLimit();
  //     spyOn(component, 'getSearchResults').and.callThrough();
  //     component.onLimit(limitItem);
  //     expect(component.searchRequest.limit).toBeDefined();
  //     expect(component.getSearchResults).toHaveBeenCalled();
  //   });
  // });
  // describe('test suite for contributor sort', () => {
  //   it('It should sort contributor details', () => {
  //     spyOn(component, 'getSearchResults').and.callThrough();
  //     component.indvEntry = new IndividualEntriesDcComponent();
  //     spyOn(component.indvEntry, 'resetPagination').and.callThrough();
  //     const sortItem = new RequestSort();
  //     component.onSort(sortItem);
  //     expect(component.searchRequest.sort).toBeDefined();
  //     expect(component.getSearchResults).toHaveBeenCalled();
  //     expect(component.indvEntry).toBeDefined();
  //     expect(component.indvEntry.resetPagination).toHaveBeenCalled();
  //   });
  // });
  // describe('test suite for contributor filtering', () => {
  //   it('It should sort contributor details filtering', () => {
  //     spyOn(component, 'getSearchResults').and.callThrough();
  //     component.indvEntry = new IndividualEntriesDcComponent();
  //     spyOn(component.indvEntry, 'resetPagination').and.callThrough();
  //     const filterItem = new RequestFilter();
  //     component.onFilter(filterItem);
  //     expect(component.searchRequest.filter).toBeDefined();
  //     expect(component.getSearchResults).toHaveBeenCalled();
  //     expect(component.indvEntry).toBeDefined();
  //     expect(component.indvEntry.resetPagination).toHaveBeenCalled();
  //   });
  // });
  describe(' search individuals', () => {
    it('should search individuals', () => {
      spyOn(component, 'onSearchIndividual').and.callThrough();
      component.onSearchIndividual();
      expect(component.onSearchIndividual).toHaveBeenCalled();
      //expect(component.searchRequest.searchKey).toEqual('601336235');
    });
  });
  describe('enable search individuals', () => {
    it('should enable search individuals', () => {
      spyOn(component, 'clearSearchDetails').and.callThrough();
      component.onIndividualSearchEnable(true);
      expect(component.clearSearchDetails).toHaveBeenCalled();
      expect(component.isSearch).toEqual(true);
    });
  });
  describe('test suite for reset pagination', () => {
    it('It should reset the pagination', () => {
      component.indvEntry = new IndividualEntriesDcComponent();
      component.searchIndvEntry = new SearchCardDcComponent(component.language);
      spyOn(component.indvEntry, 'resetPagination').and.callThrough();
      spyOn(component.searchIndvEntry, 'resetPagination').and.callThrough();
      component.resetPagination();
      expect(component.indvEntry).toBeDefined();
      expect(component.searchIndvEntry).toBeDefined();
    });
  });
  describe('test suite for  navigateToContributor', () => {
    it('It should  navigateToContributor', () => {
      component.registrationNo = 200085736;
      component.router.navigate(['dashboard/search/contributor/200085736']);
      component.navigateToContributor(component.registrationNo);
      expect(component.router.navigate).toHaveBeenCalledWith(['dashboard/search/contributor/200085736']);
    });
  });
  describe('test suite for  reset filter and sort', () => {
    it('It should  reset filter and sort', () => {
      component.resetFilterAndSort();
      expect(component).toBeTruthy();
    });
  });
  describe('test suite for navigation to simis profile', () => {
    it('It should  navigate', () => {
      component.navigateToSimisProfile();
      expect(component).toBeTruthy();
    });
  });
  describe('test suite for set search request', () => {
    it('It should  set request', () => {
      const forms = new SearchForms();
      component.searchForm = forms.createSearchForm();
      component.searchForm.updateValueAndValidity();
      component.searchForm.get('searchKeyForm').get('searchKey').setValue('1000');
      component.searchForm.get('advancedSearchForm').get('name').setValue('ahmmed');
      component.setSearchRequest();
      expect(component).toBeTruthy();
      expect(component.searchForm).not.toEqual(null);
      expect(component.searchForm.valid).toBeTruthy();
      expect(component.searchForm.value).not.toEqual(null);
    });
  });
  describe('test suite for reset search', () => {
    it('It should reset search', () => {
      component.onReset();
      expect(component).toBeTruthy();
    });
  });
  describe('test suite to show adv search', () => {
    it('It should show adv search', () => {
      component.onAdvancedSearchShow();
      expect(component.dashboardSearchService.enableIndividualAdvancedSearch).toBeTruthy();
    });
  });
  describe('test suite to close adv search', () => {
    it('It should close adv search', () => {
      component.onAdvancedSearchClose();
      expect(component.dashboardSearchService.enableIndividualAdvancedSearch).toBeFalsy();
    });
  });
  describe('test suite for advanced search', () => {
    it('It should advance search', () => {
      const forms = new SearchForms();
      component.searchForm = forms.createSearchForm();
      component.searchForm.updateValueAndValidity();
      component.searchForm.get('searchKeyForm').get('searchKey').setValue('1000');
      component.searchForm.get('advancedSearchForm').get('name').setValue('ahmmed');
      component.indvEntry = new IndividualEntriesDcComponent();
      component.searchIndvEntry = new SearchCardDcComponent(component.language);
      spyOn(component.searchIndvEntry, 'resetPagination').and.callThrough();
      spyOn(component.indvEntry, 'resetPagination').and.callThrough();
      component.onAdvancedSearch();
      expect(component.searchForm).not.toEqual(null);
      expect(component.searchForm.valid).toBeTruthy();
      expect(component.searchForm.value).not.toEqual(null);
      expect(component.indvEntry).toBeDefined();
      expect(component.searchIndvEntry).toBeDefined();
    });
  });
  describe('test suite for individual search', () => {
    it('It should search individuals', () => {
      const forms = new SearchForms();
      component.searchForm = forms.createSearchForm();
      component.searchForm.updateValueAndValidity();
      component.searchForm.get('searchKeyForm').get('searchKey').setValue('1000');
      component.searchForm.get('advancedSearchForm').get('name').setValue('ahmmed');
      component.onSearchIndividual();
      expect(component.searchForm).not.toEqual(null);
      expect(component.searchForm.valid).toBeTruthy();
      expect(component.searchForm.value).not.toEqual(null);
    });
  });
  describe('test suite for reset pagination', () => {
    it('It should reset the pagination', () => {
      component.indvEntry = new IndividualEntriesDcComponent();
      component.searchIndvEntry = new SearchCardDcComponent(component.language);
      spyOn(component.searchIndvEntry, 'resetPagination').and.callThrough();
      spyOn(component.indvEntry, 'resetPagination').and.callThrough();
      component.resetPagination();
      expect(component.indvEntry).toBeDefined();
      expect(component.searchIndvEntry).toBeDefined();
    });
  });
  describe('test suite to show modal', () => {
    it('It should open modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.openPopupWindow(modalRef, 'md');
      expect(component.modalRef).not.toEqual(null);
    });
  });
});
