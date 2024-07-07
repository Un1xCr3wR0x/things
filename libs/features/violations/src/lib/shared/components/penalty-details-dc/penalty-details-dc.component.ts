/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PenaltyDetails } from '../../models';

@Component({
  selector: 'vol-penalty-details-dc',
  templateUrl: './penalty-details-dc.component.html',
  styleUrls: ['./penalty-details-dc.component.scss']
})
export class PenaltyDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  itemsPerPage = 5;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  paginationId = 'penalityData';
  noOfRecords = 0;
  currentPage = 1;
  lang = 'en';
  //Input variables
  @Input() index: number;
  @Input() penaltyInfoDetails: PenaltyDetails[] = new Array<PenaltyDetails>();
  @Input() isCancelEngagement: boolean;
  constructor(private modalRef: BsModalRef) {}
  /** Method to initiaslie tasks */
  ngOnInit(): void {
    this.noOfRecords = this.penaltyInfoDetails[this.index]?.violatedContributors?.length;
  }
  /**
   * Method to select corresponding page
   * @param page
   */
  selectPage(page: number): void {
    this.pageDetails.currentPage = this.currentPage = page;
  }
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.penaltyInfoDetails.currentValue) {
      this.penaltyInfoDetails = changes.penaltyInfoDetails.currentValue;
      this.noOfRecords = this.penaltyInfoDetails[this.index]?.violatedContributors?.length;
    }
  }
  getAmount() {
    let total = 0;
    if (this.penaltyInfoDetails[this.index]?.violatedContributors) {
      this.penaltyInfoDetails[this.index].violatedContributors.forEach(value => {
        total = total + value.violationAmount;
      });
    }
    return total;
  }
}
