import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AlertService, LovList } from '@gosi-ui/core';
import { RequestLimit } from '@gosi-ui/foundation-dashboard/lib/shared';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';
import { BulkReassignHistory } from '../../shared/models/bulk-reassign-history';
import { ReassignService } from '../../shared/services/reassign.service';

@Component({
  selector: 'bulk-reassign-tab-dc',
  templateUrl: './bulk-reassign-tab-dc.component.html',
  styleUrls: ['./bulk-reassign-tab-dc.component.scss']
})
export class BulkReassignTabDcComponent implements OnInit {
  isDescending: any;
  totalItems;
  sortByList: any;
  bulkReassignList: BulkReassignHistory[];
  bulkHistoryList: BulkReassignHistory[];
  count = 0;
  initialPageNo = 0;
  //sort: string;
  page: number;
  selectedOption: any;
  estPagination = 'estPagination';
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  itemsPerPage = 10;
  limitItem: RequestLimit = new RequestLimit();
  sort: any = 'Date';
  sortOrder: any = 'DESC';
  filterStatus: any = [];

  constructor(readonly reassignService: ReassignService,
    readonly alertService: AlertService) { }

  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  @Output() limit: EventEmitter<RequestLimit> = new EventEmitter();

  ngOnInit(): void {
    this.alertService.clearAlerts();
    // this.bulkReassignList = [
    //   { ID: 1, transactionTraceId: '1223344', sourceUserId: '10092881', targetUserId: '23092834', status: 'Success', AmeenCalendarData: new Date },
    //   { ID: 2, transactionTraceId: '1223344', sourceUserId: '10092881', targetUserId: '23092834', status: 'Failed', AmeenCalendarData: new Date },
    // ];
    this.sortByList = new LovList([
      {
        value: {
          english: 'Request Date',
          arabic: 'تاريخ الطلب'
        },
        sequence: 1
      },
      {
        value: {
          english: 'Transaction ID',
          arabic: 'رقم المعاملة'
        },
        sequence: 2
      },
      {
        value: {
          english: 'Source Employee',
          arabic: 'الموظف المصدر'
        },
        sequence: 2
      },
      {
        value: {
          english: 'Target Employee',
          arabic: 'الموظف المستهدف'
        },
        sequence: 2
      }
    ]);
  }

  onTabClick(){
    this.reassignService.getBulkReassignHistory(this.initialPageNo ,this.sort, this.page, this.filterStatus).subscribe(res => {
      this.bulkReassignList = res.reassignedTransactionHistoryList;
      this.bulkHistoryList = this.bulkReassignList;
      this.count = res.totalRecords;
    })

  }
  // changeSortDirection(): void {
  //   if (this.isDescending) {
  //     this.isDescending = false;
  //   } else {
  //     this.isDescending = true;
  //   }
  //   this.sortTransactions();
  // }
  // sortTransactions() {
  //   throw new Error('Method not implemented.');
  // }
  selectPage(pageNo: number) {
    // if (pageNo - 1 !== this.limitItem.pageNo) {
    //   this.pageDetails.currentPage = pageNo;
    //   this.limitItem.pageNo = pageNo - 1;
    //   this.onLimit();
    // }
    this.reassignService.getBulkReassignHistory(pageNo-1, this.sort, this.page, this.filterStatus).subscribe(res => {
      this.bulkReassignList = res.reassignedTransactionHistoryList;
      this.bulkHistoryList = this.bulkReassignList;
    });
    this.pageDetails.currentPage = pageNo;
    this.pageDetails.goToPage = pageNo;
  }
  private onLimit() {
    this.limit.emit(this.limitItem);
  }

  /**
 * method to reset pagination
 */
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = 1;
    this.limitItem.pageNo = 0;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }

  handleSearchCallbackEvent(data:{searchType:string,searchData:string}){
    this.reassignService.searchBulkReassignHistory(0,this.sort, this.page, this.filterStatus,data.searchType,data.searchData).subscribe(res => {
      this.bulkReassignList = res.reassignedTransactionHistoryList;
      this.bulkHistoryList = this.bulkReassignList;
      this.count = res.totalRecords;
    });
     this.resetPagination();
  }
  onFilter() {
    if (this.selectedOption === 'success') {
      this.filterStatus = ['Success'];
      //this.bulkReassignList = this.bulkHistoryList.filter(item => item.status === "Success");
    } else if
      (this.selectedOption === 'failed') {
        this.filterStatus = ['Failed'];
      //this.bulkReassignList = this.bulkHistoryList.filter(item => item.status === "Failed");
    } else if
      (this.selectedOption === 'inprogress') {
        this.filterStatus = ['In Progress'];
      //this.bulkReassignList = this.bulkHistoryList.filter(item => item.status === "In Progress");
    }
    else if(this.selectedOption === 'reclaimed'){
      this.filterStatus = ['Reclaimed'];
    }
    else if(this.selectedOption === 'reclaiming'){
      this.filterStatus = ['Reclaiming'];
    }
    
    else {
      this.filterStatus = null;
    }
    this.reassignService.getBulkReassignHistory(this.initialPageNo,this.sort, this.page, this.filterStatus).subscribe(res => {
      this.bulkReassignList = res.reassignedTransactionHistoryList;
      this.bulkHistoryList = this.bulkReassignList;
      this.count = res.totalRecords;
    });
    this.resetPagination();
  }

  sortListDetails(evnt) {
    if(evnt.value.english == 'Request Date'){
      this.sort = 'date';
    }
    else if(evnt.value.english == 'Transaction ID'){
      this.sort = 'transactionTraceId'
    }
    else if(evnt.value.english == 'Source Employee'){
      this.sort = 'sourceUserId';
    }
    else if(evnt.value.english == 'Target Employee'){
      this.sort = 'targetUserId';
    }
    this.reassignService.getBulkReassignHistory(this.initialPageNo,this.sort, this.sortOrder, this.filterStatus).subscribe(res => {
      this.bulkReassignList = res.reassignedTransactionHistoryList;
      this.bulkHistoryList = this.bulkReassignList;
      this.count = res.totalRecords;
    });
    this.resetPagination();
  }

  sortOrderList(evnt){
    this.sortOrder = evnt;
    this.reassignService.getBulkReassignHistory(this.initialPageNo,this.sort, this.sortOrder, this.filterStatus).subscribe(res => {
      this.bulkReassignList = res.reassignedTransactionHistoryList;
      this.bulkHistoryList = this.bulkReassignList;
      this.count = res.totalRecords;
    });
    this.resetPagination();
  }
}
