/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { LanguageToken, LovList, CoreBenefitService } from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BenefitRequestFilterDcComponent } from './benefit-request-filter-dc/benefit-request-filter-dc.component';
import { BenefitsRequestsTabDcComponent } from './benefits-requests-tab-dc/benefits-requests-tab-dc.component';
import { BenefitRequestsService } from '../../shared/services/benefit-requests.service';
import {
  MyBenefitRequestsResponse,
  BenefitStatus,
  ActiveBenefits,
  ModifyBenefitService,
  BenefitConstants,
  BenefitRequestFilter,
  BenefitOverviewDetails,
  isHeirBenefit,
  ReturnLumpsumService
} from '../../shared';
import { BenefitGroup } from '../../shared/enum/benefit-group';

@Component({
  selector: 'bnt-my-benefit-requests-sc',
  templateUrl: './my-benefit-requests-sc.component.html',
  styleUrls: ['./my-benefit-requests-sc.component.scss']
})
export class MyBenefitRequestsScComponent implements OnInit {
  lang = 'en';
  myBenefitRequestsResponse: MyBenefitRequestsResponse;
  benefitOverviewResponse: BenefitOverviewDetails;
  BenefitStatus = BenefitStatus;
  BenefitGroup = BenefitGroup;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  itemsPerPage = 10;
  transactionStatus: string;
  benefitStatusButtonEvent = {
    onHold: false,
    active: false,
    stopped: false,
    waived: false
  };
  benefitGroup: string;
  benefitTypeList$: Observable<LovList>;
  benefitRequestFilter: BenefitRequestFilter;

  @ViewChild('benefitFilterComponent') benefitFilterComponent: BenefitRequestFilterDcComponent;
  @ViewChild('benefitRequestTab') benefitRequestTab: BenefitsRequestsTabDcComponent;

  constructor(
    private location: Location,
    readonly router: Router,
    readonly benefitRequestsService: BenefitRequestsService,
    private returnLumpsumService: ReturnLumpsumService,
    readonly coreBenefitService: CoreBenefitService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.benefitGroup = BenefitGroup.Annuities;
    this.getBenefitTransactions();
    this.getBenefitOverview();
    this.benefitTypeList$ = this.benefitRequestsService.getbenefitFilterType();
  }

  /**
   * Method to get benefit transactions
   */
  getBenefitTransactions(benefitRequestFilter?: BenefitRequestFilter) {
    if (benefitRequestFilter) this.benefitRequestFilter = benefitRequestFilter;
    this.benefitRequestsService
      .getAllBenefitTranscations(
        this.currentPage - 1,
        this.itemsPerPage,
        this.transactionStatus,
        this.benefitGroup,
        this.benefitRequestFilter
      )
      .subscribe(res => {
        this.myBenefitRequestsResponse = res;
      });
  }
  /**
   * Method to get benefit overview
   */
  getBenefitOverview() {
    this.benefitRequestsService.getEachNoOfBenefits().subscribe(res => {
      this.benefitOverviewResponse = res;
    });
  }
  onBenefitEntryCLick(selectedBenefit) {
    const data = new ActiveBenefits(
      selectedBenefit?.sin,
      selectedBenefit.benefitRequestId,
      selectedBenefit?.benefitType,
      selectedBenefit.referenceNo
    );
    this.returnLumpsumService.setActiveBenefit(data);
    this.coreBenefitService.setActiveBenefit(data);
    if (isHeirBenefit(selectedBenefit?.benefitType?.english)) {
      this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
    } else {
      this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
    }
  }

  /** Route back to previous page */
  routeBack() {
    this.location.back();
  }

  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.getBenefitTransactions();
    }
  }
  selectTab(benefitCategory) {
    this.benefitGroup = benefitCategory;
    this.transactionStatus = undefined;
    this.benefitRequestFilter = undefined;
    this.resetFiltersAndPage();
    this.getBenefitTransactions();
    this.benefitStatusButtonEvent = {
      onHold: false,
      active: false,
      stopped: false,
      waived: false
    };
  }
  resetFiltersAndPage() {
    this.benefitFilterComponent.clearAllFiters();
    this.benefitFilterComponent.resetSearch();
    this.benefitFilterComponent.direction = 'ASCENDING';
    this.benefitFilterComponent.resetSort();
    this.currentPage = 1;
    this.benefitRequestTab.resetPage();
  }
  /**
   *
   * @param benefitStatus method to filter transactions based on benefit status
   */
  filterTransaction(benefitStatus) {
    this.checkbenefitStatusButtonEvent(benefitStatus);
    this.currentPage = 1;
    this.benefitRequestTab.resetPage();
    this.getBenefitTransactions();
  }

  filterRequests(benefitRequestFilter: BenefitRequestFilter) {
    this.currentPage = 1;
    this.benefitRequestTab.resetPage();
    this.getBenefitTransactions(benefitRequestFilter);
  }

  checkbenefitStatusButtonEvent(benefitStatus) {
    if (benefitStatus === BenefitStatus.ONHOLD) {
      this.benefitStatusButtonEvent.onHold = !this.benefitStatusButtonEvent.onHold;
      this.benefitStatusButtonEvent.active = false;
      this.benefitStatusButtonEvent.stopped = false;
      this.benefitStatusButtonEvent.waived = false;
      this.transactionStatus = this.benefitStatusButtonEvent.onHold ? benefitStatus : null;
    }
    if (benefitStatus === BenefitStatus.ACTIVE) {
      this.benefitStatusButtonEvent.onHold = false;
      this.benefitStatusButtonEvent.active = !this.benefitStatusButtonEvent.active;
      this.benefitStatusButtonEvent.stopped = false;
      this.benefitStatusButtonEvent.waived = false;
      this.transactionStatus = this.benefitStatusButtonEvent.active ? benefitStatus : null;
    }
    if (benefitStatus === BenefitStatus.STOPPED) {
      this.benefitStatusButtonEvent.onHold = false;
      this.benefitStatusButtonEvent.active = false;
      this.benefitStatusButtonEvent.stopped = !this.benefitStatusButtonEvent.stopped;
      this.benefitStatusButtonEvent.waived = false;
      this.transactionStatus = this.benefitStatusButtonEvent.stopped ? benefitStatus : null;
    }
    if (benefitStatus === BenefitStatus.WAIVED) {
      this.benefitStatusButtonEvent.onHold = false;
      this.benefitStatusButtonEvent.active = false;
      this.benefitStatusButtonEvent.stopped = false;
      this.benefitStatusButtonEvent.waived = !this.benefitStatusButtonEvent.waived;
      this.transactionStatus = this.benefitStatusButtonEvent.waived ? benefitStatus : null;
    }
  }
}
