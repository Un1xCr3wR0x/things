/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import {
  LanguageToken,
  CoreContributorService,
  CoreBenefitService,
  RouterData,
  RouterDataToken,
  TransactionStatus,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService
} from '@gosi-ui/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActiveBenefits,
  BenefitConstants,
  isHeirBenefit,
  ManageBenefitService,
  ModifyBenefitService
} from '../../shared';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { ReturnLumpsumService } from '../../shared/services/return-lumpsum.service';
import { AnnuityBenefitTypes } from '../../shared/constants/annuity-benefit-constants';

@Component({
  selector: 'bnt-saned-benefit-history-sc',
  templateUrl: './saned-benefit-history-sc.component.html',
  styleUrls: ['./saned-benefit-history-sc.component.scss']
})
export class SanedBenefitHistoryScComponent implements OnInit {
  //Input Variables
  lang = 'en';
  annuityBenefitHistory = [];
  currentSortColumn = '';
  socialInsuranceNo: number;
  isAnnuity = false;
  isOcc = false;
  isUiHistory = false;
  isOccHistory = false;
  currentSortDirection = 'ASC';
  pageSize = 10;
  unViewed = 0;
  deletedHistory = 0;
  itemsPerPage = 10;
  currentPage = 1;
  goToPage = 1;
  ascendingSort = true;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  historyData: string;
  /**
   * @param language
   * @param manageBenefitService
   * @param location
   */
  @Output() updateCount: EventEmitter<number> = new EventEmitter();
  /** Child components */
  @ViewChild('componentChild') paginationDcComponent: PaginationDcComponent;
  isIndividualApp: boolean;

  /**
   * @param language
   * @param manageBenefitService
   * @param location
   * @param RouterDataToken
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) private routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly manageBenefitService: ManageBenefitService,
    readonly authTokenService: AuthTokenService,
    public route: ActivatedRoute,
    private location: Location,
    private contributorService: CoreContributorService,
    readonly router: Router,
    private returnLumpsumService: ReturnLumpsumService,
    private coreBenefitService: CoreBenefitService
  ) {}

  /** Initializes the component. */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    //getting param value
    this.route.queryParams.subscribe(params => {
      this.isAnnuity = params.annuity === 'true' ? true : false;
      this.isUiHistory = params.uihistory === 'true' ? true : false;
      this.isOccHistory = params.occ === 'true' ? true : false;
    });

    this.currentSortColumn = 'requestDate';
    this.socialInsuranceNo = this.isIndividualApp
      ? this.authTokenService.getIndividual()
      : this.contributorService.selectedSIN;
    //setting the history according to the queryparam received
    if (this.socialInsuranceNo) {
      if (this.isAnnuity) {
        this.getAllBenefitHistory();
      }
      if (this.isUiHistory) {
        this.getAllUiHistory();
      }
      if (this.isOccHistory) {
        this.getAllOccBenefitHistory();
      }
    }
  }
  /**
   * Method to get all benefit history details
   */
  getAllBenefitHistory() {
    this.socialInsuranceNo = this.isIndividualApp
      ? this.authTokenService.getIndividual()
      : this.contributorService.selectedSIN;
    const annuityType = AnnuityBenefitTypes.AnnuityTypes;
    this.manageBenefitService.getAllBenefitHistory(this.socialInsuranceNo, annuityType).subscribe(response => {
      this.annuityBenefitHistory = response;
      this.annuityBenefitHistory.forEach(benefit => {
        if (benefit.status.english === 'Deleted') {
          this.deletedHistory++;
        }
      });
      this.unViewed = this.annuityBenefitHistory.length - this.deletedHistory;
    });
  }
  /**
   * Method to get all benefit history details
   */
  getAllOccBenefitHistory() {
    this.socialInsuranceNo = this.isIndividualApp
      ? this.authTokenService.getIndividual()
      : this.contributorService.selectedSIN;
    const occType = AnnuityBenefitTypes.OccTypes;
    this.manageBenefitService.getAllOccBenefitHistory(this.socialInsuranceNo, occType).subscribe(response => {
      this.annuityBenefitHistory = response;
      this.annuityBenefitHistory.forEach(benefit => {
        if (benefit.status.english === 'Deleted') {
          this.deletedHistory++;
        }
      });
      this.unViewed = this.annuityBenefitHistory.length - this.deletedHistory;
    });
  }
  /**
   * Method to get all ui history details
   */
  getAllUiHistory() {
    this.socialInsuranceNo = this.isIndividualApp
      ? this.authTokenService.getIndividual()
      : this.contributorService.selectedSIN;
    this.manageBenefitService.getAllUiHistory(this.socialInsuranceNo).subscribe(response => {
      this.annuityBenefitHistory = response;
      this.annuityBenefitHistory.forEach(benefit => {
        if (benefit.status.english === 'Deleted') {
          this.deletedHistory++;
        }
      });
      this.unViewed = this.annuityBenefitHistory.length - this.deletedHistory;
    });
  }

  onBenefitEntryCLick(selectedBenefit: ActiveBenefits) {
    if (selectedBenefit?.status?.english?.toLowerCase() === TransactionStatus.REJECTED.toLowerCase()) return;
    this.returnLumpsumService.setActiveBenefit(selectedBenefit);
    const data = new ActiveBenefits(
      selectedBenefit?.sin,
      selectedBenefit.benefitRequestId,
      selectedBenefit?.benefitType,
      selectedBenefit.referenceNo,
      selectedBenefit?.nin
    );
    this.coreBenefitService.setActiveBenefit(data);
    if (isHeirBenefit(selectedBenefit?.benefitType?.english)) {
      this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
    } else {
      this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
    }
  }
  /**
   * Route back to previous page
   */
  routeBack() {
    this.manageBenefitService.socialInsuranceNo = this.socialInsuranceNo;
    this.location.back();
  }
  /**
   * Method to sort the item based on request Date
   */
  sortList() {
    // this.annuityBenefitHistory = this.annuityBenefitHistory.sort((a, b) => {
    // if (a.requestDate.gregorian) {
    //   return a.requestDate.gregorian.localeCompare(b.requestDate.gregorian);
    // }
    if (this.ascendingSort) {
      this.annuityBenefitHistory = this.annuityBenefitHistory.sort((a, b) => {
        if (a.requestDate.gregorian) {
          return new Date(a.requestDate.gregorian).getTime() - new Date(b.requestDate.gregorian).getTime();
        }
        if (this.unViewed > 10) {
          this.paginationDcComponent.resetPage();
          this.currentPage = 1;
          this.currentPage = this.currentPage - 1;
          this.pageSize = this.itemsPerPage;
          this.pageDetails.currentPage = this.currentPage;
          this.unViewed = this.unViewed;
          this.getAllBenefitHistory();
          this.getAllUiHistory();
        } else {
          this.currentPage = this.currentPage - 1;
          this.pageSize = this.itemsPerPage;
          this.unViewed = this.unViewed;
          this.getAllBenefitHistory();
          this.getAllUiHistory();
        }
      });
    } else {
      this.annuityBenefitHistory = this.annuityBenefitHistory.sort((a, b) => {
        if (a.requestDate.gregorian) {
          return new Date(b.requestDate.gregorian).getTime() - new Date(a.requestDate.gregorian).getTime();
        }
        if (this.unViewed > 10) {
          this.paginationDcComponent.resetPage();
          this.currentPage = 1;
          this.currentPage = this.currentPage - 1;
          this.pageSize = this.itemsPerPage;
          this.pageDetails.currentPage = this.currentPage;
          this.unViewed = this.unViewed;
          this.getAllBenefitHistory();
          this.getAllUiHistory();
        } else {
          this.currentPage = this.currentPage - 1;
          this.pageSize = this.itemsPerPage;
          this.unViewed = this.unViewed;
          this.getAllBenefitHistory();
          this.getAllUiHistory();
        }
      });
    }
    this.ascendingSort = !this.ascendingSort;
  }
  /**method to select page */
  selectPage(page: number): void {
    this.currentPage = this.pageDetails.currentPage = page;
    this.getAllBenefitHistory();
    this.getAllUiHistory();
  }
}
