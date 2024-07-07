import { Component, Input, OnChanges, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ViolationRouteConstants } from '../../constants';
import {
  FilterHistory,
  HistoryRequest,
  Page,
  RequestSort,
  ViolationHistoryList,
  ViolationTransaction
} from '../../models';
import { ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';
import { EstablishmentViolationsService } from '../../services';

@Component({
  selector: 'vol-previous-establishment-violations-sc',
  templateUrl: './previous-establishment-violations-sc.component.html',
  styleUrls: ['././previous-establishment-violations-sc.component.scss']
})
export class PreviousEstablishmentViolationsScComponent implements OnInit {
  limitItem: Page = new Page();
  itemsPerPage = 5;
  sort: RequestSort = new RequestSort();
  @Input() transactionDetails: ViolationTransaction;
  totalViolations: number;
  previousViolations: ViolationHistoryList[];
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };

  @Output() estProfile: EventEmitter<number> = new EventEmitter();

  /**
   *
   * @param modalRef
   */
  constructor(
    private modalRef: BsModalRef,
    readonly establishmentViolationsService: EstablishmentViolationsService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  ngOnInit(): void {
    this.limitItem.pageNo = 0;
    this.limitItem.size = this.itemsPerPage;
    this.getPreviousViolations();
  }
  /**
   * Method to hide modal
   */
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  getPreviousViolations() {
    const historyRequest: HistoryRequest = new HistoryRequest();
    historyRequest.page = new Page();
    historyRequest.sort = new RequestSort();

    this.sort.direction = 'DESC';
    historyRequest.sort = this.sort;
    historyRequest.page = this.limitItem;
    const filterHistory: FilterHistory = new FilterHistory();
    filterHistory.violationType = [this.transactionDetails.violationType];
    historyRequest.filter = filterHistory;
    historyRequest.isPreviousViolation = true;
    this.establishmentViolationsService
      .getViolationHistory(this.transactionDetails.establishmentInfo.registrationNo, historyRequest)
      .subscribe(res => {
        this.totalViolations = res.estViolationsCount;
        this.previousViolations = res.violationSummaryDtoList;
      });
  }
  /**
   * Method to select corresponding page
   * @param page
   */
  selectPage(value: number): void {
    if (this.pageDetails.currentPage !== value) {
      this.pageDetails.currentPage = this.currentPage = value;

      this.limitItem.pageNo = this.currentPage - 1;
      this.getPreviousViolations();
    }
  }
  /**
   * Method to navigate to establishment profile page
   */
  navigateToEstProfile(regNo: number) {
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_ESTABLISHMENT_PROFILE_PAGE(regNo);
    } else {
      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_ESTABLISHMENT_PROFILE_PAGE(regNo);
    }
    window.open(url, '_blank');
  }
  /**
   * Method to navigate to violation details
   */
  navigateViolationDetails(violationId: number) {
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
