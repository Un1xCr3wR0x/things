/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  DocumentService,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  RequestSort,
  RouterData,
  RouterDataToken,
  TransactionService,
  WorkflowService,
  AuthTokenService
} from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src/lib/components';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ViolationsBaseScComponent } from '../../../shared/components';
import { ViolationRouteConstants, EligibleRoleConstants } from '../../../shared/constants';
import {
  FilterHistory,
  HistoryRequest,
  Page,
  ViolationFilterResponse,
  ViolationHistoryList,
  ViolationHistoryResponse,
  DefaultAmounts
} from '../../../shared/models';
import { EstablishmentViolationsService, ViolationsValidatorService } from '../../../shared/services';
import {AppealViolationsService} from "@gosi-ui/features/violations/lib/shared/services/appeal-violations.service";

@Component({
  selector: 'vol-violation-history-sc',
  templateUrl: './violation-history-sc.component.html',
  styleUrls: ['./violation-history-sc.component.scss']
})
export class ViolationHistoryScComponent extends ViolationsBaseScComponent implements OnInit, OnDestroy {
  /**
   * local variables
   */
  channelList: LovList;
  currentPage = 1; // Pagination
  filterHistory: FilterHistory = new FilterHistory();
  filteredHistory: ViolationHistoryList[] = [];
  historyRequest: HistoryRequest = <HistoryRequest>{};
  isAppPrivate: boolean;
  itemsPerPage = 10; // Pagination
  limitItem: Page = new Page();
  modalRef: BsModalRef;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  paginationId = 'violation-history';
  regno: number;
  searchValue: number;
  sort: RequestSort = new RequestSort();
  statusList: LovList;
  successMessage: BilingualText;
  totalItems = 0;
  typeList: LovList;
  violationHistoryResponse: ViolationHistoryResponse;
  violationFilterResponse: ViolationFilterResponse;
  accessEligibility = EligibleRoleConstants.ELIGIBLE_INTERNAL_ROLES;
  sortDirection = 'ASC';
  sortBy: string;
  defaultAmounts: DefaultAmounts;

  @ViewChild('paginationComponent') paginationComponent: PaginationDcComponent;
  backPath: string;

  /** Method to initialize*/
  /**
   *
   * @param activatedRoute
   * @param activatedroute
   * @param alertService
   * @param appToken
   * @param documentService
   * @param establishmentViolationsService
   * @param language
   * @param lookupService
   * @param modalService
   * @param router
   * @param routerDataToken
   * @param validatorService
   * @param workflowService
   */
  constructor(
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly establishmentViolationsService: EstablishmentViolationsService,
    readonly validatorService: ViolationsValidatorService,
    readonly activatedroute: ActivatedRoute,
    readonly location: Location,
    readonly transactionService: TransactionService,
    readonly appealVlcService: AppealViolationsService,
    readonly authService: AuthTokenService
  ) {
    super(
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router,
      validatorService,
      routerDataToken,
      activatedroute,
      appToken,
      location,
      transactionService,
      appealVlcService,
      authService
    );
  }
  /** This method is used to handle initialization tasks. */
  ngOnInit(): void {
    this.alertService.clearAllErrorAlerts();
    if (this.validatorService.alertMessage) this.alertService.showSuccess(this.validatorService.alertMessage);
    else this.alertService.clearAlerts();
    this.activatedRoute.paramMap
      .pipe(
        tap(params => {
          if (params && params.get('registrationNo')) this.regno = +params.get('registrationNo');
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.initializeView();
    this.getEstablishment(this.regno);
  }
  /**
   * Method to initialise the parameters
   */
  initializeView() {
    this.historyRequest.page = new Page();
    this.historyRequest.sort = new RequestSort();
    this.limitItem.pageNo = 0;
    this.limitItem.size = this.itemsPerPage;
    this.sort.direction = 'DESC';
    this.historyRequest.sort = this.sort;
    this.historyRequest.page = this.limitItem;
    this.getRecords();
    this.goToEstProfile();
  }

  /**
   * This method is to navigate to history details page
   */
  navigateToHistoryDetails(transactionId) {
    this.router.navigate([ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(transactionId, this.regno)]);
  }

  /** This method is invoked for handling pagination operation. */
  paginateHistoryList(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.currentPage = this.pageDetails.currentPage = page;
      this.limitItem.pageNo = this.currentPage - 1;
      this.historyRequest.page = this.limitItem;
      this.getRecords();
    }
  }

  /**
   * Method to search for a value
   * @param searchValue
   */
  searchHistoryRecords(searchValue: string) {
    if (searchValue) {
      this.historyRequest.searchKey = searchValue;
    } else {
      this.alertService.clearAlerts();
      this.historyRequest.searchKey = undefined;
    }
    this.resetPagination();
    this.alertService.clearAlerts();
    this.getRecords();
  }
  /**
   * Method to filter records
   * @param filterParams
   */
  filterHistoryRecords(filterParams: FilterHistory) {
    if (filterParams) {
      this.filterHistory.period.startDate = filterParams.period.startDate;
      this.filterHistory.period.endDate = filterParams.period.endDate;
      this.filterHistory.violationType = filterParams.violationType;
      this.filterHistory.channel = filterParams.channel;
      this.filterHistory.status = filterParams.status;
      this.filterHistory.appliedPenaltyAmountStart = filterParams.appliedPenaltyAmountStart;
      this.filterHistory.appliedPenaltyAmountEnd = filterParams.appliedPenaltyAmountEnd;
      this.filterHistory.appliedPaidAmountStart = filterParams.appliedPaidAmountStart;
      this.filterHistory.appliedPaidAmountEnd = filterParams.appliedPaidAmountEnd;
      this.historyRequest.filter = this.filterHistory;
    }
    this.resetPagination();
    this.getRecords();
  }

  /**
   * Method to reset pagination
   */
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.limitItem.pageNo = 0;
    if (this.paginationComponent) {
      this.paginationComponent.resetPage();
    }
  }
  /**
   *
   * Method to fetch history from the service
   */
  getRecords() {
    this.establishmentViolationsService
      .getViolationHistory(this.regno, this.historyRequest)
      .pipe(
        tap((res: ViolationHistoryResponse) => {
          this.filteredHistory = res.violationSummaryDtoList;
          this.violationFilterResponse = res.violationsFilterResponseDto;
          this.channelList = new LovList(this.violationFilterResponse.listOfViolationChannel);
          this.typeList = new LovList(this.violationFilterResponse.listOfViolationType);
          this.defaultAmounts = new DefaultAmounts();
          this.defaultAmounts.defaultPenaltyMinAmount = Math.floor(res.violationsFilterResponseDto?.penaltyAmountStart);
          this.defaultAmounts.defaultPenaltyMaxAmount = Math.ceil(res.violationsFilterResponseDto?.penaltyAmountEnd);
          this.defaultAmounts.defaultPaidMinAmount = Math.floor(res.violationsFilterResponseDto?.paidAmountStart);
          this.defaultAmounts.defaultPaidMaxAmount = Math.ceil(res.violationsFilterResponseDto?.paidAmountEnd);
          if(this.defaultAmounts?.defaultPenaltyMaxAmount === 0){
            this.defaultAmounts.defaultPenaltyMaxAmount=1;
          }
          if(this.defaultAmounts?.defaultPaidMaxAmount === 0){
            this.defaultAmounts.defaultPaidMaxAmount=1;
          }
        })
      )
      .subscribe(
        (res: ViolationHistoryResponse) => {
          this.totalItems = res.estViolationsCount;
        },
        err => {
          this.showErrors(err);
        }
      );
  }
  ngOnDestroy() {
    this.validatorService.alertMessage = null;
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllSuccessAlerts();
    this.alertService.clearAllWarningAlerts();
  }
  /**
   *
   * @param err This method to show the page level error
   */
  showErrors(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  goToEstProfile() {
    this.backPath = ViolationRouteConstants.ROUTE_ESTABLISHMENT_PROFILE_PAGE(this.regno);
  }
  navigateToReportViolation() {
    this.establishmentViolationsService.estRegNumber = this.regno;
    this.router.navigate([ViolationRouteConstants.ROUTE_RAISE_VIOLATIONS(this.regno)]);
  }
  getViolationSortFields(sortBy) {
    this.sortBy = sortBy;
    this.historyRequest.sort.column = this.sortBy;
    this.getRecords();
  }
  getViolationSortedDirection(sortDirection) {
    this.sortDirection = sortDirection;
    this.sort.direction = this.sortDirection;

    this.getRecords();
  }
}
