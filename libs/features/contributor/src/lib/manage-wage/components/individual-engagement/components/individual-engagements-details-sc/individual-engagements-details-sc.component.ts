import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  BorderNumber,
  convertToYYYYMMDD,
  IdentityTypeEnum,
  Iqama,
  LanguageToken,
  NIN,
  Passport,
  startOfMonth,
  subtractMonths,
  AuthTokenService,
  ApplicationTypeToken,
  RouterDataToken,
  RouterData,
  DocumentService,
  WorkflowService,
  LookupService,
  OccupationList,
  GosiCalendar,
  isNIN,
  ContributorStatus,
  ApplicationTypeEnum,
  LovList,
  Lov,
  Occupation
} from '@gosi-ui/core';
import {
  BillDetails,
  BillSummaryWrapper,
  ContractAuthenticationService,
  ContractWrapper,
  Contributor,
  ContributorActionEnum,
  ContributorRouteConstants,
  ContributorService,
  Coverage,
  CoveragePeriod,
  DropDownItems,
  EngagementDetails,
  EngagementFilter,
  EngagementPeriod,
  EngagementService,
  EstablishmentService,
  ManageWageConstants,
  ManageWageService,
  SearchEngagementResponse,
  VicContributionDetails,
  VicEngagementDetails
} from '@gosi-ui/features/contributor/lib/shared';
import { EmployerList } from '@gosi-ui/features/contributor/lib/shared/models/employer-list';
import { IndividualRoleConstants } from '@gosi-ui/foundation-dashboard/lib/individual-app/constants';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'cnt-individual-engagements-details-sc',
  templateUrl: './individual-engagements-details-sc.component.html',
  styleUrls: ['./individual-engagements-details-sc.component.scss']
})
export class IndividualEngagementsDetailsScComponent implements OnInit {
  sin: number;
  showPendingContract = false;
  contributionValues: SearchEngagementResponse;
  contractId: number;
  engagementId: number;
  registrationNo: number;
  socialInsuranceNo: number;
  isVic: boolean;
  monthSelectedDate: string;
  actionList: DropDownItems[];
  overallactionList: DropDownItems[];
  regNo: number;
  lang: string;
  EngagementType: string;
  nin: number;
  isNin: boolean = true;
  contratId: number;
  engId: number;
  contractDetailsFlag: boolean;
  engagementDetails: EngagementDetails[];
  engagementPeriod: EngagementPeriod;
  allEngagements: EngagementDetails[];
  activeEngagementsList: EngagementDetails[];
  singleActive: boolean;
  myarray: CoveragePeriod;
  coverageDetails: CoveragePeriod;
  contractDetails: ContractWrapper;
  periods: CoveragePeriod[] = [];
  typeVic = 'vic';
  billHistory: BillSummaryWrapper = new BillSummaryWrapper();
  billNumber: number;
  billDetails: BillDetails = new BillDetails();
  isBillNumber = false;
  vicContributionDto: VicContributionDetails;
  vicEngagementDto: VicEngagementDetails;
  modalRef: BsModalRef;
  contributorData: Contributor;
  isAbsherVerified: boolean;
  isDashboard: number;
  engagementleavingDate: string;
  occupationList$: Observable<OccupationList>;
  occupationDetailsList: OccupationList;
  occupationLovList: LovList = new LovList([]);
  occupationDetails: Occupation[];
  employerList$: Observable<EmployerList>;
  NavigateUrl: string;
  wageUpdateSuccess: boolean;
  noOfPaidContribution: number;
  userRoleArray: string[] = [];
  roleArray = [];
  uniqueOccupation: EngagementPeriod[] = [];
  pendingContractsCount: number;
  /**
   *
   * @param language
   * @param alertService
   * @param manageWageService
   * @param contributorService
   * @param route
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly manageWageService: ManageWageService,
    readonly contributorService: ContributorService,
    readonly modalService: BsModalService,
    readonly authTokenService: AuthTokenService,
    readonly lookUpService: LookupService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly contractService: ContractAuthenticationService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly lookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.route.queryParams.subscribe(params => {
      if (params.wageUpdateSuccess) {
        this.wageUpdateSuccess = true;
      }
    });
    this.nin = this.authTokenService.getIndividual();
    this.isNin = isNIN(this.nin.toString());
    this.occupationList$ = this.lookUpService.getOccupationList();

    this.fetchEngagementDetails();
    this.fetchIndvRoles();
    this.noOfPaidContribution = 0;
    this.isDashboard = 1;

    if (this.roleArray.includes('DASHBOARD.SUBSCRIBER')) {
      this.employerList$ = this.contributorService.getContributorEmployersList(this.nin);
    }
  }

  /** Method to get NIN. */
  getNin(identities: Array<NIN | Iqama | BorderNumber | Passport>) {
    const index = identities.findIndex(item => item.idType === IdentityTypeEnum.NIN);
    return identities[index] ? (<NIN>identities[index]).newNin : null;
  }
  occupationToLov(occupation: any): Lov {
    return { value: occupation.value, sequence: occupation.sequence };
  }
  /**Method to fecth engagement details */
  fetchEngagementDetails(): void {
    this.contributorService.getEngagementFullDetails(this.nin).subscribe(res => {
      this.contributionValues = res;
      const list = new LovList([]);
      const occupationSet = new Set<string>();
      let count = 0;
      this.contributionValues.overallEngagements.forEach(values => {
        values.engagementPeriod.forEach((data, index) => {
          if (data?.occupation) {
            const occKey = JSON.stringify(data.occupation);
            if (!occupationSet.has(occKey)) {
              occupationSet.add(occKey);
              this.uniqueOccupation.push(data);
            }
          }
        });
      });
      this.occupationList$.subscribe((occupationList: OccupationList) => {
        const filteredItems: Lov[] = occupationList?.items
          .filter(item =>
            this.uniqueOccupation.some(overallItem => item.value.english === overallItem.occupation.english)
          )
          .map(this.occupationToLov);

        this.occupationLovList = new LovList(filteredItems);
      });
      if (res?.pendingContractsCount) {
        this.pendingContractsCount = res.pendingContractsCount;
      }
      if (res?.activeEngagements.length == 0) {
        this.contributorService.getUserStatus(this.nin).subscribe(res => {
          this.showPendingContract = res.statusType == ContributorStatus.PENDING_WITH_CONTRIBUTOR ? true : false;
        });
      }
      if (res?.activeEngagements) {
        if (res.activeEngagements.length === 1) {
          this.singleActive = true;
        } else {
          this.singleActive = false;
        }
        res?.activeEngagements?.forEach(item => {
          this.isVic = item?.vicIndicator;
          this.engagementId = item?.engagementId;
          if (this.isVic) {
            this.getVicCoverage(this.nin, item.engagementId).subscribe(response => {
              this.vicContributionDto = response;
            });
            this.getVicEngagement(this.nin, item.engagementId).subscribe(resp => {
              this.vicEngagementDto = resp;
            });
          } else if (!this.isVic) {
            this.contributorService
              .getContributorybyEngagementIdCoverage(this.nin, item.engagementId)
              .subscribe(resp => {
                item.coverageDetails = resp?.currentPeriod;
                this.coverageDetails = resp?.currentPeriod;
              });
            this.contributorService
              .getContractDetails(this.nin, item.registrationNo, item.engagementId)
              .subscribe(contracts => {
                if (contracts) {
                  contracts.contracts.forEach(element => {
                    if (element.status === 'CONTRACT_PENDING_CON') {
                      this.showPendingContract = true;
                    }
                  });
                  if (contracts.count) {
                    item.contractDetailsFlag = true;
                    item.actionList = ManageWageConstants.IndividualActionsDropdown;
                    if (!this.singleActive) {
                      item.actionList?.push(ManageWageConstants.MultiIndividualSecondDropdown);
                    }
                  } else {
                    item.contractDetailsFlag = false;
                    item.actionList = ManageWageConstants.IndividualSecondDropdown;
                    if (!this.singleActive) {
                      item.actionList?.push(ManageWageConstants.MultiIndividualSecondDropdown);
                    }
                  }
                  contracts?.contracts?.forEach(val => {
                    this.contratId = val?.id;
                    item.contractId = val?.id;
                  });
                }
              });
          }
        });
        this.activeEngagementsList = res?.activeEngagements;
      }
      let coverage = new EngagementDetails();
      res?.overallEngagements?.forEach(eng => {
        if (eng?.engagementType === this.typeVic) {
          eng.engagementPeriod = eng.engagementPeriod.filter(engPeriod =>
            moment(engPeriod.startDate.gregorian).isSameOrBefore(new Date())
          );
          this.getVicCoverage(this.nin, eng.engagementId).subscribe(response => {
            this.vicContributionDto = response;
            coverage = this.setResponsePeriodToEngagement(eng, response.contributionDetails.periods);
            eng = coverage;
          });
        } else if (eng?.engagementType !== this.typeVic) {
          this.contributorService.getContributorybyEngagementIdCoverage(this.nin, eng.engagementId).subscribe(resp => {
            eng.coverageDetails = resp?.currentPeriod;
            this.coverageDetails = resp?.currentPeriod;
            coverage = this.setResponsePeriodToEngagement(eng, resp.periods);
            eng = coverage;
          });
          this.contributorService
            .getContractDetails(this.nin, eng.registrationNo, eng.engagementId)
            .subscribe(contracts => {
              if (contracts) {
                eng.overallactionList = ManageWageConstants.ModifyJoiningDate;
                if (eng.status === 'LIVE' || eng.status === 'TERMINATION_IN_PROGRESS') {
                  eng.overallactionList.push(ManageWageConstants.TerminateEngagement);
                } else {
                  eng.overallactionList.push(ManageWageConstants.ModifyLeaving);
                }
                eng.overallactionList.push(ManageWageConstants.CancelEngagement);
                if (contracts.count > 0) {
                  eng.contractDetailsFlag = true;
                  eng.overallactionList.push(ManageWageConstants.ViewContracts);
                } else {
                  eng.contractDetailsFlag = false;
                }
                contracts?.contracts?.forEach(val => {
                  this.contratId = val?.id;
                  eng.contractId = val?.id;
                });
              }
            });
        }
        eng.engagementPeriod.forEach(engPeriod => {
          engPeriod.coverages = [];
          engPeriod.coverageType.forEach(covType => {
            const cov = new Coverage();
            cov.coverageType = covType;
            engPeriod.coverages.push(cov);
          });
        });

        this.allEngagements = res?.overallEngagements;
      });
    });
  }
  /**
   * This method is to fetch gregorian date
   * @param date
   */
  fetchDate(date: GosiCalendar): Date | null {
    return date?.gregorian ? date.gregorian : null;
  }

  // fetchEmployerList() : void {
  //   this.contributorService.getContributorEmployersList(this.nin).subscribe(res => {
  //     res.forEach
  //   });
  // }

  setResponsePeriodToEngagement(eng: EngagementDetails, periods: CoveragePeriod[]): EngagementDetails {
    if (periods && periods.length > 0) {
      periods.forEach(period => {
        if (period) {
          eng.engagementPeriod.forEach(engPeriod => {
            if (
              this.fetchDate(period.startDate) === this.fetchDate(engPeriod.startDate) &&
              this.fetchDate(period.endDate) === this.fetchDate(engPeriod.endDate)
            ) {
              engPeriod.coverages.forEach(engCov => {
                period.coverages.forEach(perCov => {
                  if (engCov.coverageType.english === perCov.coverageType.english) {
                    engCov.fromJsonToObject(perCov);
                  }
                });
              });
            }
          });
        }
      });
    }
    return eng;
  }
  navigateToProfileScreen(key: string) {}
  getEngagementDetail(key: number) {}
  navigateToContract(engagement: EngagementDetails) {
    this.router.navigate([ContributorRouteConstants.ROUTE_INDIVIDUAL_CONTRACT], {
      queryParams: {
        id: engagement.contractId,
        nin: this.nin,
        engId: engagement.engagementId,
        regNumber: engagement.registrationNo,
        isContract: false
      }
    });
  }

  fetchIndvRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    this.userRoleArray = gosiscp?.length > 0 ? gosiscp?.[0]?.role?.map(r => r.toString()) : [];
    IndividualRoleConstants.INDV_ROLES.filter(v => {
      if (this.userRoleArray.includes(v.roleId.toString())) {
        this.roleArray.push(v.roleName);
      }
    });
    if (this.roleArray.includes('DASHBOARD.VIC')) {
      this.getVicBillDetails();
    }
    if (this.roleArray.includes('DASHBOARD.SUBSCRIBER')) {
      this.employerList$ = this.contributorService.getContributorEmployersList(this.nin);
    }
  }

  getVicBillDetails() {
    //  this.alertService.clearAlerts();
    this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1)).toString());
    this.contributorService.getBillNumber(this.nin, this.monthSelectedDate, true).subscribe(
      res => {
        if (res) {
          this.billHistory = res;
          this.billNumber = res.bills[0].billNumber;
          this.isBillNumber = false;
          this.contributorService.getVicBillBreakup(this.nin, this.billNumber).subscribe((response: BillDetails) => {
            this.billDetails = response;
            this.noOfPaidContribution = response.overAllPaidContribution;
          });
        }
      },
      err => {
        this.isBillNumber = true;
        this.noOfPaidContribution = 0;
      }
    );
  }
  navigateToBillDashboard() {
    this.router.navigate(['/home/billing/vic/dashboard'], {
      queryParams: {
        idNo: this.nin,
        isDashboard: 'false'
      }
    });
  }
  navigateToModify() {
    this.router.navigate(['/home/contributor/wage/update/vic-wage'], {
      queryParams: {
        nin: this.nin,
        engId: this.engagementId
      }
    });
  }
  getVicEngagement(nin: number, engagementId: number): Observable<VicEngagementDetails> {
    return this.contributorService.getVicEngagementById(nin, engagementId).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
  getVicCoverage(nin: number, engagementId: number): Observable<VicContributionDetails> {
    return this.contributorService.getVicContributionDetails(nin, engagementId).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: `modal-lg modal-dialog-centered` }));
  }
  showModalRef(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: `modal-md modal-dialog-centered` }));
  }
  hideModal() {
    this.modalRef?.hide();
  }
  navigateToCancelEngagement(selectedValue: string) {
    this.router.navigate([ContributorRouteConstants.MODIFY_ENG]);
  }
  handleEngagementAction(engagement) {
    this.alertService.clearAlerts();
    this.manageWageService.engagementId = engagement?.engagementId;
    if (engagement.selectedItem === ContributorActionEnum.MODIFY_JOINING_DATE) {
      this.EngagementType = 'JoiningDate';
      this.NavigateUrl = '/home/contributor/individual/JoiningDate';
    } else if (engagement.selectedItem === ContributorActionEnum.MODIFY_LEAVING_DATE) {
      this.EngagementType = 'LeavingDate';
      this.NavigateUrl = '/home/contributor/individual/LeavingDate';
    } else if (engagement.selectedItem === ContributorActionEnum.CANCEL_ENGAGEMENT) {
      this.EngagementType = 'Cancelengagement';
      this.NavigateUrl = '/home/contributor/individual/Cancelengagement';
    } else if (engagement.selectedItem === ContributorActionEnum.TERMINATE_ENGAGEMENT) {
      this.EngagementType = 'Terminateengagement';
      this.NavigateUrl = '/home/contributor/individual/Terminateengagement';
    }

    if (engagement?.status === 'LIVE') {
      this.router.navigate([this.NavigateUrl], {
        queryParams: {
          EngagementType: this.EngagementType,
          joiningDate: convertToYYYYMMDD(engagement?.joiningDate?.gregorian.toString()),
          engagementId: engagement?.engagementId,
          status: 'Active'
        }
      });
    } else {
      this.router.navigate([this.NavigateUrl], {
        queryParams: {
          EngagementType: this.EngagementType,
          joiningDate: convertToYYYYMMDD(engagement?.joiningDate?.gregorian.toString()),
          leavingDate: convertToYYYYMMDD(engagement?.leavingDate?.gregorian.toString()),
          engagementId: engagement?.engagementId,
          status: 'Inactive'
        }
      });
    }
  }
  getFilterDetails(filterParam?: EngagementFilter) {
    if (filterParam === null) this.fetchEngagementDetails();
    else {
      this.contributorService.getEngagementFilterDetails(this.nin, filterParam).subscribe(res => {
        res?.overallEngagements?.forEach(eng => {
          eng.engagementPeriod = eng.engagementPeriod.filter(engPeriod =>
            moment(engPeriod.startDate.gregorian).isSameOrBefore(new Date())
          );
          this.contributorService
            .getContractDetails(this.nin, eng.registrationNo, eng.engagementId)
            .subscribe(contracts => {
              if (contracts) {
                eng.overallactionList = ManageWageConstants.ModifyJoiningDate;
                if (eng.status === 'LIVE' || eng.status === 'TERMINATION_IN_PROGRESS') {
                  eng.overallactionList.push(ManageWageConstants.TerminateEngagement);
                } else {
                  eng.overallactionList.push(ManageWageConstants.ModifyLeaving);
                }
                eng.overallactionList.push(ManageWageConstants.CancelEngagement);
                if (contracts.count > 0) {
                  eng.overallactionList.push(ManageWageConstants.ViewContracts);
                }
              }
            });
        });
        this.allEngagements = res.overallEngagements;
      });
    }
  }
}
