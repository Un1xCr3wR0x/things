/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ContributorToken,
  ContributorTokenDto,
  Establishment,
  LanguageToken,
  MenuService,
  RegistrationNoToken,
  RegistrationNumber,
  RouterConstants,
  Transaction,
  LanguageEnum,
  Person
} from '@gosi-ui/core';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared/services';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared/services';
import { BehaviorSubject } from 'rxjs';
import { BillHistoryWrapper, EstablishmentCertificateStatus, RequestLimit, SearchRequest } from '../../../../shared';
import { QuickActionRouteConstants, EstablishmentFilterConstants } from '../../../constants';
import { QuickAction, TransactionSearchResponse } from '../../../models';
import { DashboardSearchService } from '../../../services';

@Component({
  selector: 'dsb-establishment-details-sc',
  templateUrl: './establishment-details-sc.component.html',
  styleUrls: ['./establishment-details-sc.component.scss']
})
export class EstablishmentDetailsScComponent implements OnInit, OnDestroy {
  @Input() fromIndividualProfile: boolean;
  //output variables
  @Output() navigate: EventEmitter<string> = new EventEmitter();
  /**
   * local variables
   */
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  currentPage = 1;
  itemsPerPage = 10;
  limitItem: RequestLimit = new RequestLimit();
  searchForm: FormGroup = new FormGroup({});
  registrationNo: number;
  ppaEstablishment: boolean;
  searchRequest: SearchRequest;
  selectedLangage = 'en';
  billingDetails: BillHistoryWrapper = new BillHistoryWrapper();
  eligibilityStatus: boolean = null;
  billingDate: Date = new Date();
  billingdueDate: string;
  startDate: Date;
  establishmentDetails: Establishment = new Establishment();
  transactionDetails: Transaction[] = [];
  isLoaded = false;
  isError = false;
  quickAction: QuickAction[] = [];
  totalRecords: number;
  languageEnumValue = LanguageEnum;
  individualProfile: boolean;
  identifier: number;
  personDtls: Person;
  isPpa = false;

  /**
   *
   * @param language
   * @param dashboardSearchService
   * @param router
   * @param route
   * @param alertService
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly dashboardSearchService: DashboardSearchService,
    readonly contributorService: ContributorService,
    readonly changePersonService: ChangePersonService,
    readonly router: Router,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly alertService: AlertService,
    readonly menuService: MenuService,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    @Inject(ContributorToken) readonly contributorToken: ContributorTokenDto
  ) {
    /**
     *     pLocation.onPopState(() => {
      if (
        this.router.url === RouterConstants.ROUTE_ESTABLISHMENT_SEARCH &&
        this.dashboardSearchService.isSummaryPage === true
      ) {
        this.dashboardSearchService.isSummaryPage = false;
      this.router.navigate([RouterConstants.ROUTE_ESTABLISHMENT_SEARCH], { skipLocationChange: true });
      }
    });
     */
  }
  /**
   * method to initialise tasks
   */

  ngOnInit(): void {
    if (this.router.url.includes('individual/internal')) {
      this.individualProfile = true;
      this.changePersonService.fromIndividualSearch = true;
      this.personDtls = this.changePersonService.getPersonInformation();
      if (this.contributorService.NINDetails?.length > 0 && this.contributorService.NINDetails[0].newNin) {
        this.identifier = this.contributorService.NINDetails[0].newNin;
      } else if (this.contributorService.IqamaDetails?.length > 0 && this.contributorService.IqamaDetails[0].iqamaNo) {
        this.identifier = this.contributorService.IqamaDetails[0].iqamaNo;
      } else {
        this.identifier = this.personDtls.socialInsuranceNumber[0];
      }
    } else this.changePersonService.fromIndividualSearch = false;
    this.language.subscribe(lang => {
      this.selectedLangage = lang;
    });
    this.registrationNo = this.dashboardSearchService.registrationNo;
    this.ppaEstablishment = this.dashboardSearchService.ppaEstablishment;

    if (this.ppaEstablishment) {
      this.isPpa = true;
    }

    if (this.registrationNo) {
      this.getProfileDetails();
      this.getQuickActions();
    } else this.dashboardSearchService.isSummaryPage = false;
  }
  getProfileDetails() {
    this.getEstablishmentDetails();
    this.getTransactionDetails();
    this.getBillingDetails();
    this.getEstablishmentCertificateStatus();
  }
  /**
   * method to get searched establishment results
   */
  getEstablishmentDetails() {
    this.isError = false;
    this.dashboardSearchService.getEstablishmentDetails(this.registrationNo).subscribe(
      (establishmentDetails: Establishment) => {
        this.establishmentDetails = establishmentDetails;
        this.establishmentRegistrationNo.isGcc = establishmentDetails.gccCountry;
        this.isLoaded = true;
      },
      error => {
        if (error.status === 400) this.establishmentDetails = null;
        else this.isError = true;
        this.isLoaded = true;
      }
    );
  }
  /**
   * method to get searched transaction details
   */
  getTransactionDetails() {
    this.searchRequest = new SearchRequest();
    this.searchRequest.limit = this.limitItem;
    this.dashboardSearchService
      .getTransactions(this.registrationNo, this.searchRequest)
      .subscribe((transactionResponse: TransactionSearchResponse) => {
        if (transactionResponse && transactionResponse.listOfTransactionDetails)
          this.transactionDetails = transactionResponse.listOfTransactionDetails;
        this.totalRecords = transactionResponse.totalRecords;
      });
  }
  getIndividualTransactionDetails() {
    this.searchRequest = new SearchRequest();
    this.searchRequest.limit = this.limitItem;
    this.dashboardSearchService
      .getEstIndividualTransactions(this.registrationNo, this.identifier, this.searchRequest)
      .subscribe((transactionResponse: TransactionSearchResponse) => {
        if (transactionResponse && transactionResponse.listOfTransactionDetails)
          this.transactionDetails = transactionResponse.listOfTransactionDetails;
        this.totalRecords = transactionResponse.totalRecords;
      });
  }
  /**
   * method to get billing details
   */
  getBillingDetails() {
    this.dashboardSearchService.getBillingDetails(this.registrationNo).subscribe((res: BillHistoryWrapper) => {
      this.billingDetails = res;
    });
  }
  /**
   *  method to get certificate status
   */
  getEstablishmentCertificateStatus() {
    this.dashboardSearchService
      .getEstablishmentCertificateStatus(this.registrationNo)
      .subscribe((response: EstablishmentCertificateStatus) => {
        this.eligibilityStatus = response.isEligible;
      });
  }
  /**
   * method to provide route to the url
   * @param url
   */
  navigateTo(url: string) {
    this.establishmentRegistrationNo.value = this.registrationNo;
    this.contributorToken.socialInsuranceNo = null;
    if (this.establishmentDetails?.ppaEstablishment) {
      this.menuService.isPpaEstablishment = true;
    } else {
      this.menuService.isPpaEstablishment = false;
    }
    this.router.navigate([url], {
      state: {
        registrationNo: this.registrationNo,
        personIdentifier: this.identifier,
        fromIndividualProfile: this.fromIndividualProfile
      }
    });
  }
  /**
   * method to navigate to the search results
   */
  navigateToSearchResults() {
    this.dashboardSearchService.isSummaryPage = false;
    this.navigate.emit();
  }
  /**
   *  navigate to establishment txns
   */
  navigateToList() {
    this.navigateTo(RouterConstants.ROUTE_ESTABLISHMENT_TRANSACTION_HISTORY(this.registrationNo));
  }
  /**
   * method to update the searchkey
   * @param event
   */
  onUpdate(event) {
    this.dashboardSearchService.searchKey = event;
    if (event === null) {
      this.dashboardSearchService.establishmentSearchRequest = new SearchRequest();
    }
    this.navigateToSearchResults();
  }
  /**
   *
   * This method is to perform cleanup activities when an instance of component is destroyed.
   */
  ngOnDestroy() {
    this.alertService.clearAlerts();
  }
  getQuickActions() {
    this.quickAction = QuickActionRouteConstants.ROUTE_CONSTANTS(this.registrationNo).filter(item => {
      if (!this.isPpa) return this.menuService.checkURLPermission(item.url);
      else if (this.isPpa && item?.showForPPA) return this.menuService.checkURLPermission(item.url);
    });
  }
  /**
   * method for pagination
   * @param limitItem
   */
  onSelectPage(page: number) {
    this.limitItem.pageNo = page - 1;
    this.limitItem.pageSize = this.itemsPerPage;
    this.getTransactionDetails();
  }

  getFlag(country: string) {
    return EstablishmentFilterConstants.COUNTRY_FLAG.find(item => item.country === country).flagClass;
  }
}
