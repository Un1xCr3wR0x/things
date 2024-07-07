/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageToken, BaseComponent, AlertService, ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';
import { BreadCrumbConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ContributorRouteConstants } from '../../../shared/constants';
import { ContractParams, ContractWrapper, Contributor, EngagementDetails } from '../../../shared/models';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  ManageWageService
} from '../../../shared/services';

@Component({
  selector: 'cnt-view-contract-sc',
  templateUrl: './view-contract-sc.component.html',
  styleUrls: ['./view-contract-sc.component.scss']
})
export class ViewContractScComponent extends BaseComponent implements OnInit {
  /** Local variables. */
  registrationNo: number;
  socialInsuranceNo: number;
  engagementId: number;
  contributor: Contributor;
  contractDetails: ContractWrapper;
  engagementDetails: EngagementDetails;
  pageNo = 0;
  pageSize = 4;
  selectedLang: string;
  unifiedProfileFlag: boolean;
  individualApp = false;
  isContract: boolean;
  contractId: number;
  @ViewChild('brdcmb', { static: false })
  cntBillingBrdcmb: BreadcrumbDcComponent;
  /** Creates an instance of ViewContractScComponent. */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly contractService: ContractAuthenticationService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly router: Router,
    readonly manageWageService: ManageWageService,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly route: ActivatedRoute
  ) {
    super();
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(language => (this.selectedLang = language));
    if (this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.getIdentifiersForView();
      this.getDetailsForView();
    }
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.route.queryParams.subscribe(params => {
        if (params) {
          this.contractId = params.id;
          this.engagementId = params.engId;
          this.registrationNo = params.regNumber;
          this.socialInsuranceNo = params.nin;
          this.isContract = params.isContract;
        }
      });
      this.individualApp = true;
      this.getDetailsForIndividualView();
    }
  }
  ngAfterViewInit() {
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.CONTRACT_BREADCRUMB_VALUES;
    }
  }
  /** Method to get identifiers for view. */
  getIdentifiersForView() {
    this.unifiedProfileFlag = this.manageWageService.unifiedProfileIndicator;
    this.registrationNo = this.manageWageService.registrationNo;
    this.engagementId = this.manageWageService.engagementId;
    this.socialInsuranceNo = this.manageWageService.socialInsuranceNo;
  }

  /** Method to get details for view. */
  getDetailsForView() {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
      forkJoin([this.getContributorDetails(), this.getEngagementDetails()])
        .pipe(switchMap(() => this.getContractsForEngagement()))
        .subscribe();
    }
  }
  /** Method to get details for view. */
  getDetailsForIndividualView() {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
      forkJoin([this.getIndContributorDetails(), this.getIndEngagementDetails()])
        .pipe(switchMap(() => this.getIndContracts()))
        .subscribe();
    }
  }

  /** Method to get contributor details. */
  getContributorDetails() {
    return this.contributorService
      .getContributor(this.registrationNo, this.socialInsuranceNo)
      .pipe(tap(res => (this.contributor = res)));
  }
  getIndContributorDetails() {
    return this.contributorService
      .getIndividualContDetails(this.socialInsuranceNo)
      .pipe(tap(res => (this.contributor = res)));
  }

  /** Method to get engagement details. */
  getEngagementDetails() {
    return this.engagementService
      .getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId)
      .pipe(tap(res => (this.engagementDetails = res)));
  }
  /** Method to get individual engagement details. */
  getIndEngagementDetails() {
    return this.contributorService
      .getEngagementDetails(this.socialInsuranceNo, this.engagementId)
      .pipe(tap(res => (this.engagementDetails = res)));
  }

  /** Method to get contracts for engagement. */
  getIndContracts() {
    return this.contributorService
      .getViewContractDetails(this.socialInsuranceNo, this.registrationNo, this.engagementId)
      .pipe(tap(res => (this.contractDetails = res)));
  }
  /** Method to get contracts for ind app engagement. */
  getContractsForEngagement() {
    return this.contractService
      .getContracts(
        this.registrationNo,
        this.socialInsuranceNo,
        new ContractParams(this.engagementId, null, null, this.pageSize, this.pageNo)
      )
      .pipe(tap(res => (this.contractDetails = res)));
  }
  /** Method is used fetch details based on selected page */
  handlePagination(selectedPageNo: number) {
    this.pageNo = selectedPageNo;
    this.getContractsForEngagement().subscribe();
  }

  /** Method ot navigate to contributor profile. */
  navigateToProfile() {
    this.location.back();
  }

  /** Method to navigate to preview. */
  navigateToPreview(contract) {
    if (contract?.oldContract) {
      this.contractService.contractId = contract.id;
      this.router.navigate([ContributorRouteConstants.ROUTE_CONTRACT_DOCUMENT]);
    } else {
      if (!this.individualApp) {
        this.contractService.contractId = contract.id;
        this.router.navigate([ContributorRouteConstants.ROUTE_CONTRACT_DETAILS]);
      } else {
        this.router.navigate([ContributorRouteConstants.ROUTE_INDIVIDUAL_CONTRACT_VIEW], {
          queryParams: {
            id: contract.id,
            nin: this.socialInsuranceNo,
            engId: this.engagementId,
            regNumber: this.registrationNo,
            isContract: true
          }
        });
      }
    }
  }
  navigateToContributionPage() {
    this.router.navigate([`/home/contributor/individual/contributions`]);
  }
}
