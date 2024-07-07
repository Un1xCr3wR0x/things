/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild, Inject, TemplateRef } from '@angular/core';
import { SearchRequest, RequestLimit, RequestSort } from '../../../../shared';
import { DashboardSearchService } from '../../../services';
import { IndividualEntriesDcComponent } from '../individual-entries-dc/individual-entries-dc.component';
import { SearchBaseScComponent } from '../../base/search-base-sc.component';
import {
  ApplicationTypeToken,
  AlertService,
  SearchService,
  SearchTypeEnum,
  LookupService,
  Person,
  RouterConstants,
  LanguageToken,
  ContributorToken,
  ContributorTokenDto,
  RegistrationNumber,
  RegistrationNoToken,
  StorageService, CoreContributorService
} from '@gosi-ui/core';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared/services';
import { IndividualSortConstants } from '../../../constants';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { SearchCardDcComponent } from '../../search-components';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
declare const require;
@Component({
  selector: 'dsb-individual-search-sc',
  templateUrl: './individual-search-sc.component.html',
  styleUrls: ['./individual-search-sc.component.scss']
})
export class IndividualSearchScComponent extends SearchBaseScComponent implements OnInit {
  /**
   * local variables
   */

  // newUrl= this.sanitizer.bypassSecurityTrustResourceUrl(this.url)
  individualEntry: Person[] = [];
  searchRequest: SearchRequest = new SearchRequest();
  searchForm: FormGroup = new FormGroup({});
  individualSearchCount: number;
  isSearch = false;
  isPrivate: boolean;
  registrationNo = null;
  modalRef: BsModalRef;
  @ViewChild('indvEntry', { static: false }) indvEntry: IndividualEntriesDcComponent;
  @ViewChild('searchIndvEntry', { static: false }) searchIndvEntry: SearchCardDcComponent;
  @ViewChild('warningTemplate', { static: false }) warningTemplate: TemplateRef<HTMLElement>;
  personIdentifier: number;
  /**
   *
   * @param appToken
   * @param dashboardSearchService
   * @param searchService
   * @param alertService
   * @param router
   */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly dashboardSearchService: DashboardSearchService,
    readonly searchService: SearchService,
    readonly storageService: StorageService,
    readonly contributorService: ContributorService,
    readonly changePersonService: ChangePersonService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly lookUpService: LookupService,
    readonly modalService: BsModalService,
    readonly sanitizer: DomSanitizer,
    private coreContributorService: CoreContributorService,
    @Inject(ContributorToken) readonly contributorToken: ContributorTokenDto,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber
  ) {
    super(appToken, alertService, lookUpService, dashboardSearchService, language);
  }
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.isIndividual = true;
    this.resetTabs();
    this.alertService.clearAlerts();
    this.getNationalityList();
    this.searchForm.addControl('searchKeyForm', this.searchKeyForm);
    if (this.dashboardSearchService.individualSearchRequest === undefined) {
      this.initiateSearch();
    } else {
      this.resumeSearch();
    }
    this.changePersonService._socialInsuranceNo.next(null);
    this.coreContributorService.resetValues();
  }
  /**
   * method to initiate search
   */
  public initiateSearch() {
    this.searchRequest.limit = new RequestLimit();
    this.searchRequest.sort = new RequestSort();
    this.searchRequest.sort.column = IndividualSortConstants.SORT_FOR_CONTRIBUTOR[0].column;
    this.searchRequest.sort.direction = 'ASC';
  }
  /**
   * method to resume search
   */
  public resumeSearch() {
    this.isSearch = true;
    this.searchRequest = this.dashboardSearchService.individualSearchRequest;
    this.searchKey = this.searchRequest?.searchKey;
    this.getSearchResults();
  }
  /**
   * method to get individual search results
   */
  getSearchResults() {
    this.clearErrorAlerts();
    if (this.searchRequest?.searchKey || this.checkSearchParamValidity()) {
      this.changePersonService.setSearchRequest(this.searchRequest);
      this.dashboardSearchService.individualSearchRequest = this.searchRequest;
      this.noResults = false;
      this.dashboardSearchService
        .searchIndividual(this.searchRequest, false)
        .pipe(
          tap(response => {
            if (response && response.listOfPersons && response.listOfPersons.length === 0) {
              this.noResults = true;
              this.isSearched = true;
            }
          })
        )
        .subscribe(
          res => {
            this.individualEntry = res.listOfPersons;
            this.individualSearchCount = res.recordCount;
            this.isSearch = true;
            this.isSearchCount = true;
          },
          error => {
            this.isSearch = false;
            this.isSearchCount = false;
            this.individualEntry = [];
            this.individualSearchCount = 0;

            if (error.status === 400) {
              this.noResults = true;
            }
          }
        );
    } else {
      this.isSearch = false;
      this.individualEntry = [];
      this.individualSearchCount = 0;
      this.isSearchCount = false;
      this.isSearched = false;
    }
  }
  openPopupWindow(template: TemplateRef<HTMLElement>, size = 'md') {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  /**
   * method to clear search details
   */
  public clearSearchDetails() {
    this.individualEntry = [];
    this.individualSearchCount = 0;
    this.dashboardSearchService.individualSearchRequest = new SearchRequest();
    this.dashboardSearchService.searchKey = undefined;
    this.initiateSearch();
  }
  /**
   * method to search individuals
   */
  onSearchIndividual() {
    if (this.searchForm.value?.searchKeyForm?.searchKey) {
      this.searchRequest.searchKey = this.searchForm.value?.searchKeyForm?.searchKey;
      this.setSearchRequest();
      this.getSearchResults();
    }
  }
  /**
   * method to enable search event
   * @param event
   */
  onIndividualSearchEnable(event: boolean) {
    this.isSearch = event;
    this.clearSearchDetails();
  }
  /**
   * method to reset pagination
   */
  public resetPagination() {
    this.indvEntry.resetPagination();
    this.searchIndvEntry.resetPagination();
  }
  /**
   * method to navigate to the contributor page
   * @param person
   */
  navigateToContributor(person: Person) {
    this.contributorService.isIndividualProfile = true;
    this.storageService.setLocalValue('fromEstablishment', false);
    this.changePersonService.setPersonInformation(person);
    this.changePersonService._personInfo.next(person);
    // this.changePersonService.setMenuIndex(0);
    const NINArr = person.identity.filter(x => x.idType == 'NIN');
    const IQAMAArr = person.identity.filter(x => x.idType == 'IQAMA');
    const GCCIdArr = person.identity.filter(x => x.idType == 'GCCID');
    const BorderNoArr = person.identity.filter(x => x.idType == 'BORDERNO');
    const PassportArr = person.identity.filter(x => x.idType == 'PASSPORT');

    this.contributorService.NINDetails = NINArr;
    this.contributorService.IqamaDetails = IQAMAArr;
    this.contributorService.setSin(person.socialInsuranceNumber[0]);
    this.contributorService.GCCIdDetails = GCCIdArr;
    this.contributorService.BordeNoDetails = BorderNoArr;
    this.contributorService.PassportDetails = PassportArr;

    switch (true) {
      case NINArr.length > 0 && this.contributorService?.NINDetails[0]?.newNin > 0:
        this.storageService.setSessionValue('idType', 'NIN');
        this.personIdentifier = this.contributorService.NINDetails[0].newNin;
        break;
      case IQAMAArr.length > 0 && this.contributorService.IqamaDetails[0].iqamaNo > 0:
        this.storageService.setSessionValue('idType', 'IQAMA');
        this.personIdentifier = this.contributorService.IqamaDetails[0].iqamaNo;
        break;
      case person.socialInsuranceNumber.length > 0:
        this.storageService.setSessionValue('idType', 'SIN');
        this.personIdentifier = person.socialInsuranceNumber[0];
        break;
      case GCCIdArr.length > 0 :
        this.storageService.setSessionValue('idType', 'GCCID');
        this.personIdentifier = this.contributorService.GCCIdDetails[0].id;
        break;

      case BorderNoArr.length > 0:
        this.storageService.setSessionValue('idType', 'BORDERNO');
        this.personIdentifier = this.contributorService.BordeNoDetails[0].id;
        break;
      // case PassportArr.length > 0:
      //   this.storageService.setSessionValue("idType", "passportNo");
      //   this.personIdentifier = Number(this.contributorService.PassportDetails[0].passportNo);
      //   break;
    }
    this.contributorService.setPersonIdentifier(this.personIdentifier);

    if (!this.personIdentifier) {
      this.openPopupWindow(this.warningTemplate);
    } else if (this.personIdentifier) {
      this.establishmentRegistrationNo.value = null;
      this.contributorToken.socialInsuranceNo = null;
      // this.router.navigate([RouterConstants.ROUTE_CONTRIBUTOR_PROFILE_INFO(person.socialInsuranceNumber[0])]);
      this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL_PROFILE_INFO(this.personIdentifier)]);
    }
  }

  /**
   * method to close advanced search
   */
  onAdvancedSearchClose() {
    this.dashboardSearchService.enableIndividualAdvancedSearch = false;
    this.refreshFilter();
    // this.getSearchResults();
  }
  /**
   * method to perform advanced search
   */
  onAdvancedSearch() {
    if (this.searchForm.valid) {
      this.resetFilterAndSort();
      this.resetPagination();
      this.setSearchRequest();
      this.getSearchResults();
    }
  }
  /**
   * method to show advances search
   */
  onAdvancedSearchShow() {
    this.dashboardSearchService.enableIndividualAdvancedSearch = true;
    this.refreshFilter();
  }

  onReset() {
    this.onIndividualSearchEnable(false);
  }
  /**
   * set search request
   */
  setSearchRequest() {
    this.searchRequest.searchKey = this.searchForm.value?.searchKeyForm?.searchKey;
    this.searchRequest.searchParam.familyName = this.searchForm?.value?.advancedSearchForm?.familyName;
    this.searchRequest.searchParam.firstName = this.searchForm?.value?.advancedSearchForm?.firstName;
    this.searchRequest.searchParam.secondName = this.searchForm?.value?.advancedSearchForm?.secondName;
    this.searchRequest.searchParam.thirdName = this.searchForm?.value?.advancedSearchForm?.thirdName;
    this.searchRequest.searchParam.englishName = this.searchForm?.value?.advancedSearchForm?.englishName;
    this.searchRequest.searchParam.phoneNumber = this.searchForm?.value?.advancedSearchForm?.phoneNumber;
    this.searchRequest.searchParam.oldNationalId = this.searchForm?.value?.advancedSearchForm?.oldNationalId;
    this.searchRequest.searchParam.birthDate = this.searchForm?.value?.advancedSearchForm?.birthDate;
    this.searchRequest.searchParam.nationality = this.searchForm?.value?.advancedSearchForm?.nationality;
    this.searchRequest.searchParam.nationalityCode = this.searchForm?.value?.advancedSearchForm?.nationalityCode;
    this.searchRequest.searchParam.passportNo = this.searchForm?.value?.advancedSearchForm?.passportNo;
    this.searchRequest.searchParam.gccId = this.searchForm?.value?.advancedSearchForm?.gccId;
    this.searchRequest.searchParam.borderNo = this.searchForm?.value?.advancedSearchForm?.borderNo;
    // this.searchRequest.searchParam.sin = this.searchForm?.value?.advancedSearchForm?.sin;
  }
  /**
   * method to reset filter and sort
   */
  resetFilterAndSort() {}
  navigateToSimisProfile() {
    window.open('', '_blank');
    this.hideModal();
  }
}
