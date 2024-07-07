/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import {
  SearchRequest,
  RequestSort,
  RequestFilter,
  RequestLimit,
  EstablishmentSortConstants,
  SearchParam
} from '../../../../shared';
import { EstablishmentEntriesDcComponent } from '../establishment-entries-dc/establishment-entries-dc.component';
import { DashboardSearchService } from '../../../services';
import { EstablishmentResponse } from '../../../models';
import { Router } from '@angular/router';
import { SearchBaseScComponent } from '../../base/search-base-sc.component';
import {
  ApplicationTypeToken,
  LanguageToken,
  AlertService,
  SearchService,
  LookupService,
  Establishment,
  SortDirectionEnum,
  LovList,
  EstablishmentStatusCodeEnum,
  EstablishmentStatusEnum,
  BilingualText,
  GosiErrorWrapper,
  scrollToTop,
  markFormGroupTouched
} from '@gosi-ui/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SearchCardDcComponent } from '../../search-components';
import { tap, filter, map } from 'rxjs/operators';

@Component({
  selector: 'dsb-establishment-search-sc',
  templateUrl: './establishment-search-sc.component.html',
  styleUrls: ['./establishment-search-sc.component.scss']
})
export class EstablishmentSearchScComponent extends SearchBaseScComponent implements OnInit, OnDestroy {
  /**
   * local variables
   */
  registrationNo = null;
  ppaEstablishment = null;
  establishmentEntry: Establishment[] = [];
  establishmentSearchCount: number;
  lang = 'en';
  isSearch: boolean;
  isFilter = false;
  isShow = true;
  registrationStatusList$: Observable<LovList>;
  currentError: BilingualText;
  @ViewChild('estEntry', { static: false }) estEntry: EstablishmentEntriesDcComponent;
  @ViewChild('searchEstEntry', { static: false }) searchEstEntry: SearchCardDcComponent;
  mandatoryEstablishmentIdPrefix: BilingualText = {
    english: 'Please enter MOLestID',
    arabic: 'Please enter MOLestID in Ar'
  };
  mandatoryEstablishmentId: BilingualText = {
    english: 'Please enter MOLestofficeID',
    arabic: 'Please enter MOLestofficeID in Ar'
  };
  mandatoryUnifiedEstablishmentId: BilingualText = {
    english: 'Please enter MOLOFFICEID',
    arabic: 'Please enter MOLOFFICEID in Ar'
  };
  mandatorUnifiedEstablishmentIdPrefix: BilingualText = {
    english: 'Please enter MOLUNID',
    arabic: 'Please enter MOLUNID in Ar'
  };
  /**
   *
   * @param appToken
   * @param dashboardSearchService
   * @param searchService
   * @param alertService
   * @param language
   * @param router
   */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly dashboardSearchService: DashboardSearchService,
    readonly searchService: SearchService,
    readonly alertService: AlertService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router,
    readonly lookUpService: LookupService
  ) {
    super(appToken, alertService, lookUpService, dashboardSearchService, language);
  }
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.isEstablishment = true;
    this.resetTabs();
    this.getGccCountryList();
    this.getStatusList();
    this.registrationStatusList$ = this.statusList$.pipe(
      map(res => {
        return new LovList(
          res.items.filter(
            item =>
              item.value.english === EstablishmentStatusEnum.REGISTERED ||
              item.value.english === EstablishmentStatusEnum.CLOSED
          )
        );
      })
    );
    this.alertService.clearAllErrorAlerts();
    this.searchForm.addControl('searchKeyForm', this.searchKeyForm);
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    if (this.dashboardSearchService.establishmentSearchRequest === undefined) {
      this.initiateSearch();
    } else {
      this.resumeSearch();
    }
  }
  /**
   * method to initialise search
   */
  initiateSearch() {
    this.isSearch = false;
    this.searchRequest = new SearchRequest();
    this.searchRequest.limit = new RequestLimit();
    this.searchRequest.sort = new RequestSort();
    this.searchRequest.sort.column = EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT[0].column;
    this.searchRequest.sort.direction = SortDirectionEnum.ASCENDING;
    this.searchRequest.filter = new RequestFilter();
  }
  /**
   * method to resume search
   */
  resumeSearch() {
    this.searchRequest = this.dashboardSearchService.establishmentSearchRequest;
    this.searchKey = this.dashboardSearchService?.establishmentSearchRequest?.searchParam?.registrationNo
      ? this.dashboardSearchService?.establishmentSearchRequest?.searchParam?.registrationNo
      : this.dashboardSearchService?.establishmentSearchRequest?.searchParam?.establishmentName;
    this.loadSearchPage();
  }
  /**
   * method to load establishment search screen
   */
  loadSearchPage() {
    if (this.dashboardSearchService.isSummaryPage === false) {
      this.isSearch = true;
      this.getSearchResults();
    }
  }
  /**
   * method to search establishment
   * @param searchKey
   */
  onSearchEstablishment() {
    this.dashboardSearchService.isSummaryPage = false;
    this.setSearchRequest();
    this.getSearchResults();
  }
  /**
   * method to get establishment search results
   */
  getSearchResults() {
    this.clearErrorAlerts();
    if (this.checkSearchParamValidity()) {
      this.noResults = false;
      this.dashboardSearchService
        .searchEstablishment(this.searchRequest)
        .pipe(
          tap((res: EstablishmentResponse) => {
            if (res && res.establishments && res.establishments.length === 0) {
              this.isShow = false;
              this.noResults = true;
            } else {
              this.getEntityList();
              this.getOfficeList();
              this.getStatusList();
            }
          })
        )
        .subscribe(
          (establishmentSearchResponse: EstablishmentResponse) => {
            if (establishmentSearchResponse) {
              this.establishmentEntry = establishmentSearchResponse.establishments;
              this.establishmentSearchCount = establishmentSearchResponse.totalRecords;
              this.ppaEstablishment = this.establishmentEntry[0].ppaEstablishment;
              this.dashboardSearchService.ppaEstablishment = this.ppaEstablishment;
              this.isSearch = true;
              this.isShow = false;
              this.isSearchCount = true;
              if (this.establishmentSearchCount === 0 && this.isFilter === false) {
                this.isSearch = false;
              } else if (this.establishmentSearchCount === 0 && this.isFilter === true) {
                this.isSearch = true;
                this.isSearchCount = true;
              }
            }
          },
          error => {
            this.isSearch = false;
            this.isSearchCount = false;
            this.establishmentEntry = [];
            this.establishmentSearchCount = 0;
            if (error.status === 400) {
              this.noResults = true;
              this.currentError = error?.error?.message;
            } else this.alertService.showError(error?.error?.message);
            if (error.status === 400 && this.isFilter === true) {
              this.isSearchCount = true;
              this.isSearch = true;
            }
          }
        );
    } else {
      this.isShow = false;
      this.isSearch = false;
      this.isSearched = false;
      this.establishmentEntry = [];
      this.establishmentSearchCount = 0;
      this.isSearchCount = false;
    }
  }
  /**
   * method to enable establishment search event
   * @param event
   */
  onEstablishmentSearchEnable(event: boolean) {
    this.isSearch = event;
    this.clearSearchDetails();
  }
  /**
   * method to clear all search details
   */
  public clearSearchDetails() {
    this.establishmentEntry = [];
    this.establishmentSearchCount = 0;
    this.isShow = true;
    this.dashboardSearchService.establishmentSearchRequest = new SearchRequest();
    this.initiateSearch();
    this.alertService.clearAlerts();
  }
  /**
   * method to navigate to the establishment profile page
   * @param registrationNo
   */
  navigateToEstablishment(registrationNo: number) {
    this.dashboardSearchService.registrationNo = registrationNo;
    this.dashboardSearchService.isSummaryPage = true;
  }
  /**
   * method to reset pagination
   */
  resetPagination() {
    this.estEntry.resetPagination();
    this.searchEstEntry.resetPagination();
  }
  /**
   * method to close advanced search
   */
  onAdvancedSearchClose() {
    this.dashboardSearchService.enableEstablishmentAdvancedSearch = false;
    // this.searchRequest.searchParam = new SearchParam();
    Object.keys(this.searchRequest.searchParam).forEach(key => {
      if (key != ('registrationNo' || 'establishmentName')) {
        this.searchRequest.searchParam[key] = undefined;
      }
    });
    this.searchForm.get('advancedSearchForm.unifiedEstablishmentIdPrefix').clearValidators();
    this.searchForm.get('advancedSearchForm.unifiedEstablishmentIdPrefix').updateValueAndValidity();
    this.searchForm.get('advancedSearchForm.unifiedEstablishmentId').clearValidators();
    this.searchForm.get('advancedSearchForm.unifiedEstablishmentId').updateValueAndValidity();
    this.searchForm.get('advancedSearchForm.establishmentIdPrefix').clearValidators();
    this.searchForm.get('advancedSearchForm.establishmentIdPrefix').updateValueAndValidity();
    this.searchForm.get('advancedSearchForm.establishmentId').clearValidators();
    this.searchForm.get('advancedSearchForm.establishmentId').updateValueAndValidity();
    this.refreshFilter();
    this.getSearchResults();
  }
  /**
   * method to perform advanced search
   */
  onAdvancedSearch() {
    // if (this.searchForm.valid) {
    //   this.alertService.clearAlerts();
    //   this.dashboardSearchService.isSummaryPage = false;
    //   this.resetFilterAndSort();
    //   this.setSearchRequest();
    //   this.getSearchResults();
    // } else {
    scrollToTop();
    markFormGroupTouched(this.searchForm);
    if (
      this.searchForm.get('advancedSearchForm.establishmentIdPrefix').value &&
      !this.searchForm.get('advancedSearchForm.establishmentId').value
    ) {
      this.alertService.showError(this.mandatoryEstablishmentId);
    } else if (
      this.searchForm.get('advancedSearchForm.establishmentId').value &&
      !this.searchForm.get('advancedSearchForm.establishmentIdPrefix').value
    ) {
      this.alertService.showError(this.mandatoryEstablishmentIdPrefix);
    } else if (
      this.searchForm.get('advancedSearchForm.unifiedEstablishmentId').value &&
      !this.searchForm.get('advancedSearchForm.unifiedEstablishmentIdPrefix').value
    ) {
      this.alertService.showError(this.mandatorUnifiedEstablishmentIdPrefix);
    } else if (
      this.searchForm.get('advancedSearchForm.unifiedEstablishmentIdPrefix').value &&
      !this.searchForm.get('advancedSearchForm.unifiedEstablishmentId').value
    ) {
      this.alertService.showError(this.mandatoryUnifiedEstablishmentId);
    } else {
      this.alertService.clearAlerts();
      this.dashboardSearchService.isSummaryPage = false;
      this.resetFilterAndSort();
      this.setSearchRequest();
      this.getSearchResults();
    }
  }

  /**
   * set search request
   */
  setSearchRequest() {
    if (new RegExp('^[0-9]*$').test(this.searchForm?.value?.searchKeyForm?.searchKey)) {
      this.searchRequest.searchParam.registrationNo = this.searchForm?.value?.searchKeyForm?.searchKey;
    } else {
      this.searchRequest.searchParam.establishmentName = this.searchForm?.value?.searchKeyForm?.searchKey;
    }
    this.searchRequest.searchParam.personIdentifier = this.searchForm?.value?.advancedSearchForm?.personIdentifier;
    this.searchRequest.searchParam.phoneNumber = this.searchForm?.value?.advancedSearchForm?.phoneNumber;
    this.searchRequest.searchParam.commercialRegistrationNo =
      this.searchForm?.value?.advancedSearchForm?.commercialRegistrationNo;
    this.searchRequest.searchParam.unifiedIdentificationNo =
      this.searchForm?.value?.advancedSearchForm?.unifiedIdentificationNo;
    this.searchRequest.searchParam.licenceNo = this.searchForm?.value?.advancedSearchForm?.licenceNo;
    this.searchRequest.searchParam.recruitmentNo = this.searchForm?.value?.advancedSearchForm?.recruitmentNo;
    this.searchRequest.searchParam.registrationStatus =
      this.searchForm?.value?.advancedSearchForm?.registrationStatusValue;
    this.searchRequest.searchParam.gccId = this.searchForm?.value?.advancedSearchForm?.gccId;
    this.searchRequest.searchParam.gccCountryCode = this.searchForm?.value?.advancedSearchForm?.gccCountryCode;
    this.searchRequest.searchParam.gccCountryList = this.searchForm?.value?.advancedSearchForm?.gccCountryList;
    this.searchRequest.searchParam.unifiedEstablishmentId =
      this.searchForm?.value?.advancedSearchForm?.unifiedEstablishmentId;
    this.searchRequest.searchParam.unifiedEstablishmentIdPrefix =
      this.searchForm?.value?.advancedSearchForm?.unifiedEstablishmentIdPrefix;
    this.searchRequest.searchParam.establishmentIdPrefix =
      this.searchForm?.value?.advancedSearchForm?.establishmentIdPrefix;
    this.searchRequest.searchParam.establishmentId = this.searchForm?.value?.advancedSearchForm?.establishmentId;
  }
  /**
   * This method is to perform cleanup alert when an instance of component is destroyed.
   */
  ngOnDestroy() {
    this.clearAlerts();
  }
  resetFilterAndSort() {}
  /**
   * method to show advanced search
   */
  onAdvancedSearchShow() {
    this.dashboardSearchService.enableEstablishmentAdvancedSearch = true;
    this.refreshFilter();
  }
  /**
   * method to reset establishment search
   */
  onReset() {
    this.onEstablishmentSearchEnable(false);
  }
}
