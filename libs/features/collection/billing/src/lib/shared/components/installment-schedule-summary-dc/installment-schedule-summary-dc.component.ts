import { Component, OnInit, Input } from '@angular/core';
import { InstallmentSchedule } from '../../models';

@Component({
  selector: 'blg-installment-schedule-summary-dc',
  templateUrl: './installment-schedule-summary-dc.component.html',
  styleUrls: ['./installment-schedule-summary-dc.component.scss']
})
export class InstallmentScheduleSummaryDcComponent implements OnInit {
  /**Input variable */
  itemsPerPage = 8;
  noOfRecords: number;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  paginationId = 'paginationId';
  currentPage = 1;
  @Input() installmentSchedule?: InstallmentSchedule[];
  constructor() {}

  ngOnInit(): void {
    this.noOfRecords = this.installmentSchedule?.length;
  }
  /**
   * Method to select page
   */
  selectPage(page: number) {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
    }
  }
}
