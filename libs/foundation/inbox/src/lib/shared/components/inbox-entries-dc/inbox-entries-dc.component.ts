/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, Inject, ViewChild } from '@angular/core';
import {
  BPMResponse,
  Task,
  LovList,
  LanguageToken,
  RequestSort,
  BPMTransactionStatus,
  Limit,
  getTranslationKey,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  TransactionService,
  AlertService,
  AppealsType,
  BilingualText
} from '@gosi-ui/core';
import {ClaimedTransactionExpiryTime} from '@gosi-ui/core/lib/models/claimed-transaction-expiry-time'
import { BehaviorSubject } from 'rxjs';
import { DropDownItems } from '@gosi-ui/features/contributor';
import { RequestLimit } from '@gosi-ui/foundation-dashboard/lib/shared';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';

@Component({
  selector: 'ibx-inbox-entries-dc',
  templateUrl: './inbox-entries-dc.component.html',
  styleUrls: ['./inbox-entries-dc.component.scss']
})
export class InboxEntriesDcComponent implements OnInit, OnChanges {
  comment: any;
  /*
   * Input variables
   */
  @Input() isWorkList: boolean;
  @Input() bpmTaskResponse: BPMResponse;
  @Input() pageDetails;
  @Input() unViewed: number;
  @Input() sortItem: RequestSort;
  @Input() sortList: LovList;
  @Input() selectedFilterStatus: BPMTransactionStatus;
  @Input() searchParam: string;
  @Input() pageLimit: Limit;
  @Input() bpmTaskResponseUnclaimed: BPMResponse;
  @Input() claimedTransactions: ClaimedTransactionExpiryTime[];
  @Input() clearSearch: boolean;
  @Input() limitItem: RequestLimit = new RequestLimit();
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;

  /*
   * Output variables
   */
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();
  @Output() navigate: EventEmitter<Task> = new EventEmitter();
  @Output() sort: EventEmitter<RequestSort> = new EventEmitter();
  @Output() sortUnclaimed: EventEmitter<RequestSort> = new EventEmitter();

  @Output() filter: EventEmitter<string[]> = new EventEmitter();
  @Output() slaOlaFilter: EventEmitter<BilingualText[]> = new EventEmitter();
  @Output() tnxFilter: EventEmitter<string[]> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() roleFilter: EventEmitter<string[]> = new EventEmitter();
  selectedId: any;
  //Local variables
  itemsPerPage = 10;
  lang = 'en';
  transUpdate: string;
  tabs = [];
  unclaimed: boolean = true;
  claimed: boolean = false;
  isAppPublic: boolean;
  claimedCount: any;
  UnclaimedCount = 0;
  isLoading: boolean = true;
  appealsType = AppealsType;

  actionDropDown: DropDownItems[];
  @Output() refresh: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @param language
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private alertService: AlertService,
    readonly transactionService: TransactionService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}
  /*
   * Method to initialsie tasks
   */
  ngOnInit(): void {
    // this.selectedApp = <ApplicationTypeEnum>this.appToken;
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    this.isLoading = true;
    setTimeout(() => {
      if (this.isAppPublic) this.getWorklistCountUnclaimed();
      this.getWorklistCount();
      this.isLoading = false;
    }, 1000);
    this.language.subscribe((res: string) => {
      this.lang = res;
    });
    this.selectedId = 1;
    this.actionDropDown = new Array<DropDownItems>();
    this.actionDropDown.push({
      id: 1,
      value: { english: 'Release back to Establishment Inbox', arabic: 'إعادة تعيين إلى بريد المنشأة' }
    });
  }
  /*
   * Method to detect changes in input property
   */

  navigateTo(event, task) {
    this.transactionService.releaseTasks(task.taskId).subscribe((res: any) => {
      const value = {
        english: 'Transaction released to Establishment Inbox',
        arabic: 'تم إعادة تعيين المعاملة إلى صندوق المنشأة'
      };
      this.alertService.showSuccess(value);
      this.selectedId = 1;
      this.isLoading = true;
      this.claimedTransactions.splice(0,this.claimedTransactions.length);
      setTimeout(() => {
        this.refresh.emit(true);
        this.getWorklistCount();
        this.getWorklistCountUnclaimed();
        this.isLoading = false;
      }, 2000);
    });
  }
  getWorklistCount() {
    this.transactionService.getInboxCount().subscribe((res: any) => {
      this.claimedCount = res.taskCountResponse;
      if (this.UnclaimedCount == 0) {
        this.tabs = [{ id: 2, label: `Claimed`, count: this.claimedCount, icon: 'check-circle' }];
        this.claimed = true;
        this.unclaimed = false;
      } else {
        this.tabs = [
          { id: 1, label: 'Unclaimed', count: this.UnclaimedCount, icon: 'list' },
          { id: 2, label: 'Claimed', count: this.claimedCount, icon: 'check-circle' }
        ];
        this.claimed = false;
        this.unclaimed = true;
      }
    });
  }
  getWorklistCountUnclaimed() {
    this.transactionService.getInboxCountUnclaimed().subscribe((res: any) => {
      this.UnclaimedCount = res.taskCountResponse;
      if (this.UnclaimedCount == 0) {
        this.tabs = [{ id: 2, label: `Claimed`, count: this.claimedCount, icon: 'check-circle' }];
        this.claimed = true;
        this.unclaimed = false;
      } else {
        this.tabs = [
          { id: 1, label: `Unclaimed`, count: this.UnclaimedCount, icon: 'list' },
          { id: 2, label: `Claimed`, count: this.claimedCount, icon: 'check-circle' }
        ];
        this.claimed = false;
        this.unclaimed = true;
      }
    });
  }
  selectTab(id: any) {
    this.selectedId = id;
    if (this.selectedId == 1) {
      this.unclaimed = true;
      this.claimed = false;
      this.resetPagination();
    } else {
      this.unclaimed = false;
      this.claimed = true;
       this.resetPagination();
    }
  }
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.limitItem.pageNo = 0;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.unViewed && changes.unViewed.currentValue) this.unViewed = changes.unViewed.currentValue;
      if (changes.isWorkList && changes.isWorkList.currentValue) this.isWorkList = changes.isWorkList.currentValue;
      if (changes.bpmTaskResponseUnclaimed && changes.bpmTaskResponseUnclaimed.currentValue)
        this.bpmTaskResponseUnclaimed = changes.bpmTaskResponseUnclaimed.currentValue;
      if (changes.bpmTaskResponse && changes.bpmTaskResponse.currentValue)
        this.bpmTaskResponse = changes.bpmTaskResponse.currentValue;
      if (changes.pageDetails && changes.pageDetails.currentValue) this.pageDetails = changes.pageDetails.currentValue;
      if (changes.sortItem && changes.sortItem.currentValue) this.sortItem = changes.sortItem.currentValue;
      if (changes.sortList && changes.sortList.currentValue) this.sortList = changes.sortList.currentValue;
      if (changes?.selectedFilterStatus?.currentValue)
        this.selectedFilterStatus = changes.selectedFilterStatus.currentValue;
      if (changes?.searchParam?.currentValue) this.searchParam = changes.searchParam.currentValue;
      if (changes?.pageLimit?.currentValue) {
        this.pageLimit = changes.pageLimit.currentValue;
        this.pageDetails.currentPage = this.pageDetails.goToPage = this.pageLimit.end / 10;
      }
      if (changes.claimedTransactions && changes.claimedTransactions.currentValue){
        this.claimedTransactions = changes.claimedTransactions.currentValue;
      }
    }
  }

  /**
   * Method to trigger the page select event
   * @param page
   */
  selectPage(page: number) {
    this.pageChanged.emit(page);
  }

  /**
   * Method to trigger navigate to validator view event
   * @param task
   */
  navigateToView(task: Task) {
    this.navigate.emit(task);
  }
  /**
   * Method to trigger the search event
   * @param searchKey
   */
  onSearch(searchKey: string, type: any) {
    this.search.emit({ searchKey, type });
  }
  /**
   * Method to trigger the filter event
   * @param filter
   */
  onFilter(filter: string[]) {
    this.filter.emit(filter);
  }
  /**
   * Method to trigger the filter event
   * @param filter
   */
  onSlaOlaFilter(filter: BilingualText[]) {
    this.slaOlaFilter.emit(filter);

  }
  onTransactionFilter(filter: string[]) {
    this.tnxFilter.emit(filter);
  }
  onRoleFilter(filter: string[]) {
    this.roleFilter.emit(filter);
  }
  /**
   * Method to trigger the sort event
   * @param sort
   *
   */
  onSort(sort: RequestSort) {
    this.sort.emit(sort);
  }
  /**
   * Method to trigger the sort event
   * @param sortUnclaimed
   *
   */
  onSortUncliamed(sortUnclaimed: RequestSort) {
    this.sortUnclaimed.emit(sortUnclaimed);
  }
  getRole(label: string) {
    label = label.toString();
    const firstIndex = label.indexOf('(');
    const lastIndex = label.lastIndexOf(')');
    if (lastIndex > -1 && firstIndex > -1) {
      const str = label.slice(firstIndex + 1, lastIndex);
      return getTranslationKey(str);
    } else return null;
  }
  getUserId(label: string): string {
    label = label.toString();
    const firstIndex = label.indexOf('(');
    if (firstIndex > -1) return label.slice(0, firstIndex);
    else return label;
  }
  showError() {
    this.alertService.showErrorByKey('CORE.ERROR.INVALID-SEARCH-FORMAT')
  }

  getTransactionNumber(value: string): string {
    const numberString = value.replace(/\D/g, '');
    return numberString;
  }
}
