import { Component, Directive, Inject, Input, OnInit } from '@angular/core';
import { InjuryHistoryResponse } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { __param } from 'tslib';
import { ViolationRouteConstants } from '../../constants';
import { Router } from '@angular/router';
import {
  FilterHistory,
  HistoryRequest,
  Page,
  RequestSort,
  ViolationFilterResponse,
  ViolationHistoryList,
  ViolationHistoryResponse,
  ViolationTransaction
} from '../../models';
import { EstablishmentViolationsService } from '../../../shared/services';
import { AlertService, ApplicationTypeToken, ApplicationTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'vol-previous-contributor-violations-sc',
  templateUrl: './previous-contributor-violations-sc.component.html',
  styleUrls: ['./previous-contributor-violations-sc.component.scss']
})
export class PreviousContributorViolationsScComponent implements OnInit {
  limitItem: Page = new Page();
  itemsPerPage = 5;
  sort: RequestSort = new RequestSort();
  totalViolations: number;
  filteredHistory: ViolationHistoryList[];
  //pagenation variables
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  @Input() transactionDetails: ViolationTransaction;
  @Input() index: number;

  /**
   *
   * @param modalRef
   */
  constructor(
    private modalref: BsModalRef,
    readonly establishmentViolationsService: EstablishmentViolationsService,
    readonly alertService: AlertService,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  ngOnInit(): void {
    this.limitItem.pageNo = 0;
    this.limitItem.size = this.itemsPerPage;
    this.historyResponse();
  }

  hideModal() {
    if (this.modalref) this.modalref.hide();
  }

  historyResponse() {
    const historyRequest: HistoryRequest = new HistoryRequest();
    historyRequest.page = new Page();
    historyRequest.sort = new RequestSort();
    this.sort.direction = 'DESC';
    historyRequest.sort = this.sort;
    historyRequest.page = this.limitItem;
    //const filterHistory: FilterHistory = new FilterHistory();
    //filterHistory.violationType = [this.transactionDetails.violationType];
    historyRequest.contributorId = this.transactionDetails?.contributors[this.index].contributorId;
    //historyRequest.filter = filterHistory;
    this.establishmentViolationsService
      .getViolationHistory(this.transactionDetails.establishmentInfo.registrationNo, historyRequest)
      .subscribe(
        (res: ViolationHistoryResponse) => {
          this.totalViolations = res.estViolationsCount;
          this.filteredHistory = res.violationSummaryDtoList;
        },
        err => {
          this.alertService.showError(err.error.message, err.error.details);
        }
      );
  }

  selectPage(value: number): void {
    if (this.pageDetails.currentPage !== value) {
      this.pageDetails.currentPage = this.currentPage = value;
      this.limitItem.pageNo = this.currentPage - 1;
      this.historyResponse();
    }
  }
  //Method to navigate profile
  navigateToContributorProfile(i: number) {
    const regNo = this.transactionDetails.establishmentInfo.registrationNo;
    const sinNo = this.transactionDetails.contributors[this.index].socialInsuranceNo;
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_CONTRIBUTOR_PROFILE_PAGE(regNo, sinNo);
    } else {
      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_CONTRIBUTOR_PROFILE_PAGE(regNo, sinNo);
    }
    window.open(url, '_blank');
  }
  //Method to navigate violation details
  navigateToViolationDetails(violationId: number) {
    const regNo = this.transactionDetails.establishmentInfo.registrationNo;
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(violationId, regNo);
    } else {
      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(violationId, regNo);
    }
    window.open(url, '_blank');
  }
}
