/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Inject, OnInit } from '@angular/core';
import {
  AlertService,
  AuthTokenService,
  BPMTaskListBaseComponent,
  Environment,
  EnvironmentToken,
  LanguageToken,
  Person,
  RouterService,
  TransactionService,
  WorkflowService,
  convertToYYYYMMDD,
  startOfMonth,
  subtractMonths
} from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IndividualDashboardService } from '../../services/individual-dashboard.service';
import {
  BillDetails,
  BillDetailsWrapper,
  CoverageWrapper,
  EngagementDetails,
  OHResponse,
  PersonDetails,
  SearchEngagementValues,
  VicContributionDetails,
  VicEngagementDetails
} from '../../models';
import { OverallEngagementResponse } from '@gosi-ui/features/customer-information/lib/shared';
import { catchError, elementAt } from 'rxjs/operators';
import {
  ActiveBenefits,
  DependentDetails,
  DependentService,
  HeirStatusType,
  isHeirBenefit,
  SanedBenefitService
} from '@gosi-ui/features/benefits/lib/shared';
@Directive()
export abstract class IndividualBaseScComponent extends BPMTaskListBaseComponent implements OnInit {
  lang: string;
  engagementDetails: EngagementDetails[];
  overallEngagements: EngagementDetails[];
  personDetails: PersonDetails;
  billHistory: BillDetailsWrapper = new BillDetailsWrapper();
  billNumber: number;
  billDetails: BillDetails = new BillDetails();
  overallEngagementResponse: OverallEngagementResponse;
  identifier: number;
  isBillNumber = false;
  ohResponse: OHResponse;
  contributorResponse: Person;
  sin: number;
  engagementList: SearchEngagementValues;
  typeVic = 'vic';
  monthSelectedDate: string;
  vicCoverageDetails: VicContributionDetails;
  vicEngagementDetails: VicEngagementDetails;
  activeBenefitsList: ActiveBenefits[] = [];
  isVic = false;
  benefitType: string;
  status: string[] = [];
  dependentDetails: DependentDetails[];
  hasActiveVicEngagement: boolean;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly individualAppDashboardService: IndividualDashboardService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
    readonly routerService: RouterService,
    readonly authTokenService: AuthTokenService
  ) {
    super(workflowService, environment, transactionService, routerService, authTokenService);
  }
  /**
   * method to initialise the component
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  fectchValues(identifier) {
    this.identifier = identifier;
    if (identifier) {
      this.getEngagementDetails(identifier);
      // this.fetchOhDetails(identifier);
      this.getProfileDetails(identifier);
    }
  }
  getVicBillBreakupDetails(idNo) {
    if (idNo) {
      this.alertService.clearAlerts();
      this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1)).toString());
      this.individualAppDashboardService.getBillNumber(idNo, this.monthSelectedDate, true).subscribe(
        res => {
          if (res) {
            this.billHistory = res;
            this.billNumber = res.bills[0].billNumber;
            this.isBillNumber = false;
            this.individualAppDashboardService
              .getVicBillBreakup(idNo, this.billNumber)
              .subscribe((response: BillDetails) => {
                this.billDetails = response;
              });
          }
        },
        err => {
          this.isBillNumber = true;
          this.alertService.showError(err?.error?.message);
        }
      );
    }
  }
  fetchOhDetails(identifier: number) {
    this.individualAppDashboardService.getOccupationalDetails(identifier).subscribe(
      res => {
        this.ohResponse = res;
      },
      err => {
        this.alertService.showError(err?.error?.message);
      }
    );
  }
  getEngagementDetails(identifier: number) {
    this.individualAppDashboardService.getEngagementFullDetails(identifier).subscribe(
      res => {
        if (res) {
          this.engagementDetails = res.activeEngagements;
          this.overallEngagements = res.overallEngagements;
          this.engagementList = res;
          this.hasActiveVicEngagement =
            this.engagementDetails.findIndex(activeEngagement => {
              activeEngagement.vicIndicator == true;
            }) > 0
              ? true
              : false;
          this.engagementDetails.forEach(item => {
            this.isVic = item?.vicIndicator;
            if (item.engagementId)
              if (item?.vicIndicator) {
                this.getVicBillBreakupDetails(identifier);
                this.getVicCoverage(this.identifier, item.engagementId).subscribe(response => {
                  this.vicCoverageDetails = response;
                });
                this.getVicEngagement(this.identifier, item.engagementId).subscribe(res => {
                  this.vicEngagementDetails = res;
                });
              } else {
                this.getCoverage(identifier, item.engagementId).subscribe(response => {
                  item.coverageDetails = response.currentPeriod;
                  // item.coverageDetails.coverages.forEach(elment=>{
                  //   if(elment.coverageType.english=='Occupational Hazard'){
                  //   if( elment.contributorPercentage ==0){
                  //     elment.contributorPercentage=2;
                  //   }
                  // }
                  // })
                });
              }
          });
        }
      },
      err => this.alertService.showError(err?.error?.message)
    );
  }

  getCoverage(nin: number, engagementId: number): Observable<CoverageWrapper> {
    return this.individualAppDashboardService.getContributoryCoverage(nin, engagementId).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  getVicCoverage(nin: number, engagementId: number): Observable<VicContributionDetails> {
    return this.individualAppDashboardService.getVicContributionDetails(nin, engagementId).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
  getVicEngagement(nin: number, engagementId: number): Observable<VicEngagementDetails> {
    return this.individualAppDashboardService.getVicEngagementById(nin, engagementId).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
  getProfileDetails(identifier) {
    this.individualAppDashboardService.getProfileDetails(identifier).subscribe(res => {
      this.personDetails = res.personDetails;
    });
  }
}
