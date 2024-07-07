import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ItemizedGovernmentReceiptsResponse } from '../../../shared/models/Itemized-government-receipts-response';

@Component({
  selector: 'blg-government-receipts-list-view-dc',
  templateUrl: './government-receipts-list-view-dc.component.html',
  styleUrls: ['./government-receipts-list-view-dc.component.scss']
})
export class GovernmentReceiptsListViewDcComponent implements OnInit, OnChanges {
  // local variables
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };

  // inputs
  @Input() receipts: ItemizedGovernmentReceiptsResponse;
  @Input() pageNo: number;
  @Input() pageSize: number;

  // output
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.pageNo) {
      this.pageDetails.currentPage = this.pageNo + 1;
    }
  }

  selectPage(page) {
    this.pageDetails.currentPage = this.currentPage = page;
    this.selectPageNo.emit(this.currentPage - 1);
  }

  getType(status) {
    if (status.english === 'Not entered' || status.english === 'Rejected') {
      return 'danger';
    } else if (status.english === 'In the workflow') {
      return 'warning';
    } else {
      return 'success';
    }
  }
}
