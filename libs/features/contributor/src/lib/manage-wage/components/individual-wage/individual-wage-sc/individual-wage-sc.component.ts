/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  CalendarService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  StorageService,
  WorkflowService
} from '@gosi-ui/core';
import { SearchEngagementResponse } from '@gosi-ui/features/customer-information/lib/shared';
import moment from 'moment-timezone';
import { forkJoin, noop, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  ContributorActionEnum,
  ContributorConstants,
  ContributorRouteConstants,
  SearchTypeEnum,
  getNin
} from '../../../../shared';
import { ContributorBaseScComponent } from '../../../../shared/components';
import { ContractParams, Contributor, EngagementDetails, EngagementPeriod } from '../../../../shared/models';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../../shared/services';

@Component({
  selector: 'cnt-individual-wage-sc',
  templateUrl: './individual-wage-sc.component.html',
  styleUrls: ['./individual-wage-sc.component.scss']
})
export class IndividualWageScComponent extends ContributorBaseScComponent implements OnInit, OnDestroy {
  /**Local variable*/
  isAppPublic: boolean;
  engagementHistoryList: EngagementDetails[] = [];
  engagementPeriod = new EngagementPeriod();
  contributorlegalEntity: BilingualText;
  hasBranches: boolean;
  contributorData: Contributor;
  contractDetails;
  isNin: boolean;
  nin: number;
  userRoles: string[];
  isAbsherVerified: boolean;
  contributionBreakup: SearchEngagementResponse;

  /**
   * This method creates a instance of IndividualWageScComponent
   * @param manageWageService
   * @param alertService
   * @param lookUpService
   * @param contributorService
   */
  constructor(
    readonly manageWageService: ManageWageService,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly contractService: ContractAuthenticationService,
    readonly authTokenService: AuthTokenService,
    readonly storageService: StorageService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly calendarService: CalendarService
  ) {
    super(
      alertService,
      establishmentService,
      contributorService,
      engagementService,
      documentService,
      workflowService,
      manageWageService,
      routerDataToken,
      calendarService
    );
  }

  /**
   * This method handles the initialization tasks.
   */
  ngOnInit(): void {
    this.nin = this.authTokenService.getIndividual();
    // this.isNin = isNIN(this.nin.toString());
    this.getParamsFromRoute();
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    this.getUserRoles();
    if (this.socialInsuranceNo && this.registrationNo) {
      this.getContributor();
      this.getCurrentEngagementDetails(this.socialInsuranceNo, this.registrationNo);
      this.getEstablishmentWithBranchCount(this.registrationNo);
      // this.getContributionBreakup();
    }
    this.alertService.clearAllErrorAlerts();
  }

  /** Method to get params from route. */
  getParamsFromRoute() {
    if (this.storageService.getLocalValue('individualProfile') == 'true') {
      this.route.paramMap.subscribe(params => {
        if (params.get('registrationNo'))
          this.registrationNo = this.manageWageService.registrationNo = Number(params.get('registrationNo'));
      });
      this.route.parent.parent.paramMap.subscribe(params => {
        if (params.get('personId'))
          this.socialInsuranceNo = this.manageWageService.socialInsuranceNo = Number(params.get('personId'));
      });
    } else {
      this.route.parent.parent.paramMap.subscribe(params => {
        if (params.get('registrationNo'))
          this.registrationNo = this.manageWageService.registrationNo = Number(params.get('registrationNo'));
        if (params.get('sin'))
          this.socialInsuranceNo = this.manageWageService.socialInsuranceNo = Number(params.get('sin'));
      });
    }
  }

  /** Method to get user roles. */
  getUserRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    if (gosiscp) {
      if (this.isAppPublic) {
        const adminRole = gosiscp.filter(item => Number(item.establishment) === this.registrationNo)[0];
        this.userRoles = adminRole ? adminRole.role?.map(r => r.toString()) : [];
      } else this.userRoles = gosiscp?.[0].role?.map(r => r?.toString());
    }
  }

  /** Method to get contributor details. */
  getContributor() {
    this.getContributorDetails(
      this.registrationNo,
      this.socialInsuranceNo,
      new Map().set('absherVerificationRequired', true)
    ).subscribe(res => {
      this.isAbsherVerified =
        ContributorConstants.ValidABSHERVerificationStatus.indexOf(res.person.absherVerificationStatus) !== -1;
      this.contributorData = res;
      this.checkEligibility(getNin(res?.person?.identity));
    });
  }
  /**
   * This method is used to get current engagement details of a contributor
   * @param sin
   * @param regNo
   */
  getCurrentEngagementDetails(sin: number, regNo: number): void {
    this.getHistoryEngagementDetails(sin, regNo);
    this.manageWageService
      .getEngagementWithCoverage(sin, regNo, SearchTypeEnum.ACTIVE)
      .pipe(map(engagements => engagements[0]))
      .subscribe((engagement: EngagementDetails) => {
        if (engagement) {
          this.currentEngagement = engagement;
          if (engagement.ppaIndicator) {
            engagement.engagementPeriod = engagement.engagementPeriod.filter(period =>
              moment(period.startDate?.gregorian).isSameOrBefore(new Date())
            );
          }
          this.engagementPeriod = engagement.engagementPeriod[0];
        }
      });
  }

  /**
   * This method is used to get engagement history details of a contributor
   *  @param sin
   * @param regNo
   */
  getHistoryEngagementDetails(sin: number, regNo: number) {
    this.manageWageService
      .getEngagementWithCoverage(
        sin,
        regNo,
        this.isAppPublic ? SearchTypeEnum.ACTIVE_AND_TERMINATED : SearchTypeEnum.ACTIVE_AND_TERMINATED_AND_CANCELLED
      )
      .pipe(
        switchMap((res: EngagementDetails[]) => {
          return forkJoin(
            res.map(eng => {
              return this.contractService
                .getContracts(
                  this.registrationNo,
                  this.socialInsuranceNo,
                  new ContractParams(eng.engagementId, null, null, 4, 0)
                )
                .pipe(
                  catchError(() => of(eng)),
                  map(response => {
                    eng.contracts = response['contracts'];
                    return eng;
                  })
                );
            })
          );
        })
      )
      .subscribe((engagements: EngagementDetails[]) => {
        if (engagements)
          //Engagement with cancellation reason as Transfer to anaother branch is not required in profile view.
          this.engagementHistoryList = engagements.filter(
            item =>
              (item.cancellationReason &&
                item.cancellationReason.english !== ContributorConstants.CANCEL_DUE_TO_TRANSFER_REASON) ||
              !item.cancellationReason
          );
      });
  }

  /**
   * Method to get establishment details with branch count.
   * @param registrationNo registration number
   */
  getEstablishmentWithBranchCount(registrationNo: number) {
    this.getEstablishmentDetails(registrationNo)
      .pipe(
        tap(res => (this.establishment = res)),
        switchMap(() => {
          return this.establishmentService.getActiveBranchesCount(registrationNo).pipe(
            tap(res => {
              if (res > 1) this.hasBranches = true;
              else this.hasBranches = false;
            })
          );
        })
      )
      .subscribe(noop, noop);
  }

  /**
   * This method is to navigate to change engagement view
   * @param engagementId
   */
  navigateToSelectedOptions(selectedItems) {
    //console.log('insc', selectedItems);
    this.alertService.clearAlerts();
    this.manageWageService.engagementId = selectedItems.engagementValue;
    if (selectedItems.selectedValue === ContributorActionEnum.TERMINATE) {
      this.router.navigate([ContributorRouteConstants.ROUTE_TERMINATE_CONTRIBUTOR]);
    } else if (selectedItems.selectedValue === ContributorActionEnum.MODIFY) {
      this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT]);
    } else if (selectedItems.selectedValue === ContributorActionEnum.CANCEL) {
      this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_ENGAGEMENT]);
    } else if (selectedItems.selectedValue === ContributorActionEnum.TRANSFER) {
      this.router.navigate([ContributorRouteConstants.ROUTE_TRANSFER_INDIVIDUAL_ENGAGEMENT]);
    } else if (selectedItems.selectedValue === ContributorActionEnum.ADD_CONTRACT) {
      this.router.navigate([ContributorRouteConstants.ROUTE_ADD_CONTRACT]);
    } else if (selectedItems.selectedValue === ContributorActionEnum.CONTRACT_DETAILS) {
      this.router.navigate([ContributorRouteConstants.ROUTE_VIEW_CONTRACT]);
    } else if (selectedItems.selectedValue === ContributorActionEnum.MODIFY_COVERAGE) {
      this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT], {
        queryParams: {
          isModifyCoverage: true
        }
      });
    }
  }

  /** This method is used to navigate current wage update */
  navigateToWageUpdate() {
    this.manageWageService.engagementId = this.currentEngagement.engagementId;
    this.manageWageService.setEstablishment = this.establishment;
    this.router.navigateByUrl(ContributorRouteConstants.ROUTE_UPDATE_INDIVIDUAL_WAGE);
  }

  /**
   * Method to handle tasks on component destroy
   */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
  /**
   * Method to cancel contract which is pending with contributor
   * @param
   */
  confirmCancelContract(contractDetails) {
    this.manageWageService.engagementId = contractDetails.engagmentId;
    this.contractService.contractId = contractDetails.contractId;
    this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_CONTRACT]);
  }
  getContributionBreakup() {
    this.contributorService.getEngagementFullDetails(this.socialInsuranceNo).subscribe(res => {
      this.contributionBreakup = res;
      //console.log(this.contributionBreakup, '<- res', 'sin:', this.socialInsuranceNo);
    });
  }
}
