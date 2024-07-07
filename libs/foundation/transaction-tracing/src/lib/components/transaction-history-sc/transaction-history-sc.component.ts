/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BaseComponent,
  CoreIndividualProfileService,
  LanguageToken,
  Person,
  RoleIdEnum,
  PsFeaturesModel,
  RouterData,
  RouterDataToken,
  StorageService,
  Transaction,
  TransactionService as TransactionRoutingService,
  TransactionStatus,
  checkIqamaOrBorderOrPassport,
  statusBadgeType
} from '@gosi-ui/core';
import { IndividualCommonTransfer } from '@gosi-ui/core/lib/models/inidividual-common-transfer';
import { ContributorService, ManageWageService } from '@gosi-ui/features/contributor/lib/shared/services';
import {
  ChangePersonService,
  ManagePersonService,
  TransactionId
} from '@gosi-ui/features/customer-information/lib/shared';
import { Pagination } from '@gosi-ui/features/occupational-hazard/lib/shared';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, zip } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import {
  TransactionFilter,
  TransactionHistoryRequest,
  TransactionHistoryResponse,
  TransactionLimit,
  TransactionSearch,
  TransactionSort
} from '../../models';
import { ServiceRequestDetails } from '../../models/serivce-requests';
import { CommonTransactionService } from '../../services/common-transaction.service';
import { TransactionService } from '../../services/transaction.service';
import { ContributorRouteConstants } from '@gosi-ui/features/contributor';
import { DropDownItems } from '@gosi-ui/features/contributor';

declare const require;

@Component({
  selector: 'trn-transaction-history-sc',
  templateUrl: './transaction-history-sc.component.html',
  styleUrls: ['./transaction-history-sc.component.scss']
})
export class TransactionHistoryScComponent extends BaseComponent implements OnInit, OnDestroy {
  /**
   * To access transactions.json
   */
  tempTxn: Transaction;
  transactionsJson = require('../../../../../../../transactions.json');
  serviceRequestDetails: ServiceRequestDetails[] = [];
  showBox: boolean;
  icon = 'chevron-down';
  /**
   * local variable
   */
  lang = 'en';
  /**
   * Pagination variables
   */
  tabs = [];
  totalItems;
  itemsPerPage = 10;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  transactionRequest: TransactionHistoryRequest = <TransactionHistoryRequest>{};
  /**
   * Filter and Search variables
   */

  class = 'arrow-down-reg';
  transactionFilter: TransactionFilter = new TransactionFilter();
  transactionSearch: TransactionSearch = new TransactionSearch();
  transactionStatus = TransactionStatus;
  selectedOption: string;
  isDescending = true;
  parentForm: FormGroup = new FormGroup({});
  sortContributorFormControl: FormControl = new FormControl();
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  captcha: FormGroup;
  personIdentifier: number;
  selectedId: any;
  myTransaction: boolean = true;
  serviceRequest: boolean = false;
  isShowTab: boolean;
  personDtls: Person;
  daysDifference: number;
  currentTab: number = 0;
  lighterLabel = '#999999';
  isPagination = false;
  isLoadMore = false;
  pagination = new Pagination();
  fromIndividualProfile: boolean;
  sin: number;
  canReopen: boolean = false;
  commonApiList: IndividualCommonTransfer[] = [];
  isIndividualApp = false;
  isIndividualProfile = false;
  actionDropDown: DropDownItems[];
  actionDList: DropDownItems[];
  actionEList: DropDownItems[];
  userRoles: string[];
  isReopenRole: boolean = false;
  psFeatures: string [] = [];
  estAppealActive: string = null;
  systemParameter: any;
  /** Creates an instance of transaction-historyScComponent. */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly transactionService: TransactionService,
    readonly contributorService: ContributorService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly txnService: TransactionRoutingService,
    readonly storageService: StorageService,
    readonly authTokenService: AuthTokenService,
    @Inject(RouterDataToken) private routerData: RouterData,
    readonly changePersonService: ChangePersonService,
    readonly individualService: CoreIndividualProfileService,
    readonly commonTransactionService: CommonTransactionService,
    readonly manageWageService: ManageWageService,
    public manageService: ManagePersonService
  ) {
    super();
  }

  /* Fetching the transactions to display the list on the page load */
  ngOnInit(): void {
    this.transactionService.getSystemParams().subscribe(res => {
      this.systemParameter = res.filter(item => item.name == 'REOPEN_COMPLAINT_ENQUIRY_EFFECTIVE_DATE');
    })
    this.getUserRoles();
    let message: any = this.routerData?.idParams?.get('reopenMessage');
    setTimeout(() => {
      if(message){
      this.alertService.showSuccess(message, null);
      this.routerData.idParams.delete('reopenMessage');
      }
    }, 500);
    this.actionDropDown = new Array<DropDownItems>();
    this.actionDropDown.push({
      id: 1,
      value: { english: 'Register Complaint', arabic: 'تقديم شكاوى' },
    });
    this.actionDList = new Array<DropDownItems>();
    this.actionDList.push({
      id: 1,
      value: { english: 'Reopen Complaint', arabic: 'إعادة فتح شكاوى' },
      icon: 'redo'
    },
    {
      id: 2,
      value: { english: 'Register Complaint', arabic: 'تقديم شكاوى' },
    });
    this.actionEList = new Array<DropDownItems>();
    this.actionEList.push({
      id: 1,
      value: { english: 'Reopen Enquiry', arabic: 'تقديم شكاوى' },
      icon: 'redo'
    },
    {
      id: 2,
      value: { english: 'Register Complaint', arabic: 'تقديم شكاوى' },
    });
    this.appToken === ApplicationTypeEnum.PUBLIC ? this.getAllowedPSFeatures() : '';
    if (this.storageService.getLocalValue('individualProfile') === 'true') this.isIndividualProfile = true;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    if (this.isIndividualApp) this.getAllServiceRequests(this.authTokenService.getIndividual());
    this.showBox = false;
    this.selectedId = 1;
    if (this.storageService.getLocalValue('individualProfile') === 'true') {
      this.fromIndividualProfile = true;
      // this.route.parent.parent.paramMap.subscribe(params => {
      //   this.changePersonService.setMenuIndex(1);
      // })
    }
    if (this.txnService.getTab()) {
      this.currentTab = this.txnService.getTab();
    }
    // if(this.contributorService.NINDetails?.length > 0) {
    //   this.personIdentifier = this.contributorService.NINDetails[0].newNin;
    // } else if(this.contributorService.IqamaDetails?.length > 0) {
    //   this.personIdentifier = this.contributorService.IqamaDetails[0].iqamaNo;
    // }
    this.routerData.fromJsonToObject(new RouterData());
    this.language.subscribe(language => {
      this.lang = language;
    });
    if (this.transactionService.transactionRequest === undefined) {
      this.allTransactions();
    } else {
      this.transactionRequest = this.transactionService.transactionRequest;
      this.getTransactions();
      this.setResumeTransactionRequest();
    }
    if (this.route.routeConfig)
      this.route.routeConfig.data = {
        breadcrumb: `TRANSACTION-TRACING.${
          this.appToken === ApplicationTypeEnum.PRIVATE ? 'MY-TRANSACTIONS' : 'MY-REQUESTS'
        }`
      };
      this.txnService?.getReassignSuccessMsg() && this.txnService?.getReassignSuccessMsg()?.english
        ? this.alertService.showSuccess(this.txnService.getReassignSuccessMsg())
        : this.alertService.clearAlerts();
  }
  getAllServiceRequests(id) {
    this.transactionService.getServiceRequests(id).subscribe((res: any) => {
      this.serviceRequestDetails = res;
      if (res.length == 0) {
        this.tabs = [{ id: 1, label: `TRANSACTION-TRACING.TRANSACTIONS` }];
      } else {
        this.tabs = [
          { id: 1, label: `TRANSACTION-TRACING.TRANSACTIONS` },
          { id: 2, label: `TRANSACTION-TRACING.SERVICE-REQUESTS` }
        ];
        this.serviceRequestDetails.forEach(element => {
          element.icon = 'chevron-down';
        });
      }
    });
  }
  selectTab(id: any) {
    this.selectedId = id;
    if (this.selectedId == 1) {
      this.myTransaction = true;
      this.serviceRequest = false;
    } else {
      this.myTransaction = false;
      this.serviceRequest = true;
    }
  }
  toggleFunction(index, icon) {
    this.serviceRequestDetails[index].showBox = !this.serviceRequestDetails[index].showBox;
    if (icon === 'chevron-down') {
      this.serviceRequestDetails[index].icon = 'chevron-up';
      this.class = 'arrow-up-reg';
    } else {
      this.serviceRequestDetails[index].icon = 'chevron-down';
      this.class = 'arrow-down-reg';
    }
  }
  private setResumeTransactionRequest() {
    this.selectedOption = this.transactionRequest.sort.column;
    this.isDescending = this.transactionRequest.sort.direction;
    this.transactionSearch.value = this.transactionRequest.search.value;
    this.transactionFilter = this.transactionRequest.filter;
    this.currentPage =
      this.pageDetails.currentPage =
      this.pageDetails.goToPage =
        this.transactionRequest.page.pageNo + 1;
  }

  getAllowedPSFeatures(){
    this.transactionService.getAllowedPSFeatures().subscribe(
      data => {
        this.psFeatures = data.Features;
        this.estAppealActive = this.psFeatures.find(item => item == "Appeal_Est");
        this.estAppealActive != null ? this.storageService.setLocalValue("Appeal_Est", "Appeal_Est") : this.storageService.setLocalValue("Appeal_Est", null);
      },
      err =>{
        this.alertService.showError(err.error.message);
      },
      ()=> {}
    );
  }

  /**
   *
   * Methods to set default Parameters
   */
  defaultPagination() {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.pageDetails = {
      currentPage: this.currentPage,
      goToPage: 1
    };
  }
  defaultSort() {
    this.selectedOption = 'lastModifiedDate';
    this.isDescending = true;
  }
  defaultSearch() {
    this.transactionSearch.value = undefined;
  }

  /**
   *
   * Methods for the search,filter,sort,paginate Transactions
   */

  allTransactions() {
    this.defaultPagination();
    this.defaultSort();
    this.defaultSearch();
    // this.defaultFilter();
    this.transactionRequestSetter();
    this.getTransactions();
  }

  searchTransactions(searchValue: string) {
    this.defaultPagination();
    this.defaultSort();
    this.transactionRequestSetter();
    if (searchValue?.length > 2) {
      this.transactionSearch.value = searchValue;
      this.getTransactions();
    } else if (searchValue === null || searchValue?.length === 0) {
      this.defaultSearch();
      this.getTransactions();
    }
  }

  filterTransactions(transactionFilter?: TransactionFilter) {
    this.transactionFilter = transactionFilter;
    this.defaultPagination();
    // this.defaultSort();
    this.transactionRequestSetter();
    this.getTransactions();
  }

  sortTransactions() {
    this.defaultPagination();
    this.transactionRequestSetter();
    this.getTransactions();
  }

  paginateTransactions(page: number): void {
    this.pageDetails.currentPage = this.currentPage = page;
    this.transactionRequestSetter();
    this.getTransactions();
  }

  /**
   *
   * Method to fetch transactions from the service
   */
  getTransactions() {
    if (this.storageService.getLocalValue('individualProfile') == 'true') {
      this.changePersonService.getPersonIdentifierArr().subscribe(res => {
        this.personIdentifier = res ? res[0]?.newNin || res[0]?.iqamaNo || res[0]?.id || res[0]?.passportNo : null;
        this.changePersonService.getSocialInsuranceNo().subscribe(res => {
          this.sin = res;
        });
        if (this.personIdentifier || this.sin) {
          zip(
            this.transactionService.getIndividualTransactions(this.transactionRequest, this.personIdentifier, this.sin),
            // this.commonTransactionService.getDenodoTransactions(this.personIdentifier)
          )
            .pipe(
              takeUntil(this.destroy$),
              map(resp => {
                const arr = [];
                let totalRecord = 0;
                resp.forEach((elem: IndividualCommonTransfer[] | TransactionHistoryResponse) => {
                  if ('listOfTransactionDetails' in elem) {
                    arr.push(...elem.listOfTransactionDetails);
                    totalRecord += elem.totalRecords;
                  } else {
                    arr.push(...elem);
                    this.commonApiList = elem;
                    totalRecord += elem.length;
                  }
                });
                return { data: arr, totalRecords: totalRecord };
              })
            )
            .subscribe(resp => {
              this.filteredTransactions = resp.data;
              this.totalItems = resp.totalRecords;
            });
        }
      });
    } else {
      this.transactionService
        .getTransactions(this.transactionRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: TransactionHistoryResponse) => {
            this.filteredTransactions = data?.listOfTransactionDetails;
            this.totalItems = data?.totalRecords;
                  },
          err => {
            this.alertService.showError(err.error.message);
            this.filteredTransactions = [];
            this.totalItems = 0;
          }
        );
    }
  }

  getTitle(title) {
    if (title?.arabic && title?.arabic?.toString()?.trim() === 'إضافة إصابة') {
      title.arabic = 'إبلاغ عن إصابة';
    }
    return title;
  }

  /**
   * This method is to set the Transaction Request
   */
  transactionRequestSetter(): void {
    this.transactionRequest.page = new TransactionLimit();
    this.transactionRequest.page.pageNo = this.currentPage - 1;
    this.transactionRequest.page.size = this.itemsPerPage;
    this.transactionRequest.sort = new TransactionSort();
    this.transactionRequest.sort.column = this.selectedOption;
    this.transactionRequest.sort.direction = this.isDescending;

    this.transactionRequest.filter = new TransactionFilter();
    this.transactionRequest.filter = this.transactionFilter;
    if (this.storageService.getLocalValue('individualProfile') == 'true' && this.transactionRequest.filter.channel) {
      for (let i = 0; i < this.transactionRequest.filter.channel.length; i++) {
        if (this.transactionRequest.filter.channel[i].english == 'Taminaty App') {
          this.transactionRequest.filter.channel[i].english = 'Taminaty';
        }
      }
    }
    this.transactionRequest.search = new TransactionSearch();
    this.transactionRequest.search = this.transactionSearch;
  }

  getTreatmentDaysDifference(startDate, endDate) {
    const startDates = moment(startDate.gregorian);
    const endDates = moment(endDate.gregorian);
    this.daysDifference = endDates.diff(startDates, 'days');
    return this.daysDifference + 1;
  }

  /**
   * This method is to change the sort direction and fetch the list
   */
  changeSortDirection(): void {
    if (this.isDescending) {
      this.isDescending = false;
    } else {
      this.isDescending = true;
    }
    this.sortTransactions();
  }
  /**
   * This method is to handle large screen table sorting
   */
  sortList(columnName) {
    this.selectedOption = columnName;
    this.changeSortDirection();
  }
  /**
   * This method is to handle small screen table sorting
   */
  sort() {
    this.sortTransactions();
  }

  reopenTransaction(transaction: Transaction, evnt){
    if (evnt == '1') {
    this.transactionService.IsReopenTransaction = true;
    this.routerData.idParams.set('quickLinkReopen', true);
    this.routerData.idParams.set('isreopen', true);
    this.routerData.idParams.set('Complaint_ID', transaction.businessId);
    this.routerData.idParams.set('transactionID', transaction.transactionId)
    this.router.navigate([`home/transactions/view/${transaction.transactionId}/${transaction.transactionRefNo}/complaints/transactions/reopen/${true}`]);
    } else{
      const personId = this.changePersonService.personId;
      this.router.navigate([`/home/complaints/register/general/${personId}/${transaction.transactionRefNo}`]);
    }
  }

  calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    const dateOne = moment(dateSent);
    const dateTwo = moment(this.systemParameter[0].value);
    let a: any =  dateOne.isAfter(dateTwo) ? -1 : 0;

    let reopen = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
    if(reopen >= 30 && a == -1){
      this.canReopen = false;
    }
    else{
      this.canReopen = true;
    }
    return this.canReopen;
  }

  /**
   * This method is to navigate to domain transaction details page
   */
  transactionNavigation(transaction: Transaction | IndividualCommonTransfer) {
    const isInCommonApiList = this.commonApiList.find(
      item => item.transactionRefNo === transaction.transactionRefNo || false
    );
    if (isInCommonApiList) {
      this.alertService.showError(
        {
          arabic: 'الصفحة تحت التطوير',
          english: 'Page is under development '
        },
        [],
        3
      );
      return;
    }
    this.txnService.setTab(this.currentTab);
    if (transaction.status.english.toUpperCase() !== TransactionStatus.DRAFT.toUpperCase()) {
      const obj = Object.assign(new Transaction(), transaction);
      this.txnService.navigate(obj);
    } else if (
      transaction.status.english.toUpperCase() == TransactionStatus.DRAFT.toUpperCase() &&
      transaction.transactionId == TransactionId.REGISTER_CONTRIBUTOR
    ) {
      this.routerData.draftRequest = true;
      this.routerData.idParams.set('registrationNo', transaction?.params?.REGISTRATION_NO);
      this.routerData.idParams.set('socialInsuranceNo', transaction?.params?.SIN);
      this.routerData.idParams.set('engagementId', transaction?.params?.ENGAGEMENT_ID);
      this.routerData.idParams.set('referenceNo', transaction?.transactionRefNo);
      this.router.navigate([ContributorRouteConstants.ROUTE_ADD_CONTRIBUTOR]);
    } else if (
      transaction.status.english.toUpperCase() == TransactionStatus.DRAFT.toUpperCase() &&
      transaction.transactionId == TransactionId.CHANGE_ENGAGEMENT
    ) {
      this.routerData.draftRequest = true;
      this.manageWageService.registrationNo = transaction?.params?.REGISTRATION_NO;
      this.manageWageService.socialInsuranceNo = transaction?.params?.SIN;
      this.manageWageService.engagementId = transaction?.params?.ENGAGEMENT_ID;
      this.manageWageService.draftNeeded = true;
      this.manageWageService.referenceNo = Number(transaction?.transactionRefNo);
      this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT]);
    } else if (
      transaction.status.english.toUpperCase() == TransactionStatus.DRAFT.toUpperCase() &&
      transaction.transactionId == TransactionId.ADD_CONTRACT
    ) {
      this.routerData.draftRequest = true;
      this.manageWageService.registrationNo = transaction?.params?.REGISTRATION_NO;
      this.manageWageService.socialInsuranceNo = transaction?.params?.SIN;
      this.manageWageService.engagementId = transaction?.params?.ENGAGEMENT_ID;
      this.manageWageService.draftNeeded = true;
      this.manageWageService.referenceNo = Number(transaction?.transactionRefNo);
      this.manageWageService.contractId = transaction?.params?.CONTRACT_ID;
      this.router.navigate([ContributorRouteConstants.ROUTE_ADD_CONTRACT]);
    } else {
      const txnDomain = this.transactionsJson.transactionsList.filter(
        txn => txn.transactionId === transaction.transactionId
      );
      if (txnDomain.length > 0) {
        this.individualService.setFromNavigation(this.router.routerState.snapshot.url);
        this.router.navigate([
          'home',
          txnDomain[0].domain,
          'transactions',
          'resume',
          transaction.transactionId,
          transaction.transactionRefNo
        ]);
      }
    }
  }

  /**
   * This method is used to style the status badge based on the received status
   */
  statusBadgeType(txn: Transaction) {
    return statusBadgeType(txn.status.english);
  }
  statusBadgeTypeService(req: Transaction) {
    return statusBadgeType(req.status.english);
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    // this.transactionService._transactionRequest = undefined;
    this.alertService.clearAlerts();
  }
  navigateToTableView() {
    this.isLoadMore = false;
    this.isPagination = false;
    this.currentTab = 0;
    this.currentPage = 1;
    this.transactionRequestSetter();
    this.getTransactions();
  }
  navigateToTimelineView() {
    this.isLoadMore = false;
    this.isPagination = false;
    this.currentTab = 1;
    this.currentPage = 1;
    this.transactionRequestSetter();
    this.getTransactions();
  }
  /**
   *
   * @param loadmoreObj Load more
   */
  onLoadMore(loadmoreObj) {
    this.pageDetails.currentPage = this.currentPage = loadmoreObj.currentPage + 1;
    this.isPagination = false;
    this.isLoadMore = true;
    this.pagination.page.pageNo = loadmoreObj.currentPage;
    this.pagination.page.size = this.itemsPerPage;
    this.transactionRequestSetter();
    this.getTransactions();
  }

  raiseComplaint(transaction: any) {
    //raiseComplaint(transaction: Transaction | IndividualCommonTransfer) {
    //this.router.navigate([`/home/complaints/register/general/${transaction.transactionRefNo}`]);
    const personId = this.changePersonService.personId;
    this.router.navigate([`/home/complaints/register/general/${personId}/${transaction.transactionRefNo}`]);
  }

  /** Method to get user roles. */
  getUserRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    if (gosiscp) {
       this.userRoles = gosiscp?.[0].role?.map(r => r?.toString());
       if(this.userRoles?.includes(RoleIdEnum.CUSTOMER_CARE_OFFICER.toString()) || this.userRoles?.includes(RoleIdEnum.CALL_CENTRE_AGENT.toString()) || this.userRoles?.includes(RoleIdEnum.CSR.toString())){
        this.isReopenRole = true;
       }
       else{
        this.isReopenRole = false;
       }
    }
  }
  
}
